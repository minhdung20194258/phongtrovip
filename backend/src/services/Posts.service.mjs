import BaseCrudService from './base/BaseCrud.service.mjs';
import PostsModel from '../models/Posts.mjs';
import PostsRepository from '../repositories/Posts.repository.mjs';
import UsersService from './Users.service.mjs';
import ActivitiesService from './Activities.service.mjs';
import {
  ACTIVITY_AUTO_PAY_POST,
  ACTIVITY_PAY_POST,
  ACTIVITY_RECHARGE_DEPOSIT,
  ACTIVITY_REJECT_DEPOSIT_OWNER,
  ACTIVITY_REJECT_DEPOSIT_CUSTOMER,
} from '../const/types/activitiesTypes.mjs';
import moment from 'moment';
import {getPricePost} from '../const/plans.mjs';
import DepositsService from './Deposits.service.mjs';

class PostsService extends BaseCrudService {
  constructor() {
    super(PostsModel, PostsRepository);
  }

  refund = async (depositId, user = {}) => {
    const deposit = await DepositsService.findOne(depositId);
    console.log({deposit, user});
    console.log(String(deposit.receiverId), String(user._id));
    if (!deposit) {
      throw new Error('Không tìm thấy id=' + depositId);
    }
    if (String(deposit.receiverId) !== String(user._id)) {
      throw new Error('Không phải là người nhận của id=' + depositId);
    }
    if (user.amountBalance < 500000) {
      throw new Error('Người dùng không đủ tiền hoàn trả');
    }
    await Promise.all([
      UsersService.Repo.increaseOne(user._id, 'amountBalance', -500000),
      UsersService.Repo.increaseOne(deposit.senderId, 'amountBalance', 500000),
      ActivitiesService.createOne({
        userId: user._id,
        amount: 500000,
        postId: deposit.postId,
        type: ACTIVITY_REJECT_DEPOSIT_OWNER,
      }),
      ActivitiesService.createOne({
        userId: deposit.senderId,
        amount: 500000,
        postId: deposit.postId,
        type: ACTIVITY_REJECT_DEPOSIT_CUSTOMER,
      }),
      DepositsService.updateOne(depositId, {isRefund: true}),
    ]);
  };

  /**
   * @param senderId
   * @param receiverId
   * @param postId
   * @param startAt
   * @param endAt
   * @return {Promise<PostsExtend|null>}
   */
  findWithDeposit = async ({senderId, receiverId, postId, startAt, endAt}) => {
    return PostsRepository.findWithDeposit({senderId, receiverId, postId, startAt, endAt});
  };

  /**
   * @param plan
   * @param userId
   * @param postId
   * @return {Promise}
   */
  deposit = async ({userId, postId}) => {
    const post = await PostsRepository.findWithDeposit({postId, isRefund: false});
    if (post.isHasDeposit) throw new Error('Đã có người đặt cọc trong khung giờ này');

    const depositId = DepositsService.getNewId();
    await Promise.all([
      //! Send email
      DepositsService.createOne({
        senderId: userId,
        receiverId: post.userId,
        postId,
        amount: 500000,
        startAt: post.startAt,
        endAt: post.endAt,
      }),
      UsersService.Repo.increaseOne(userId, 'amountBalance', -500000),
      ActivitiesService.createOne({
        amount: 500000,
        type: ACTIVITY_RECHARGE_DEPOSIT,
        postId,
        userId,
        info: {
          depositId,
        },
      }),
    ]);
    return post;
  };

  autoPayment = async () => {
    console.log('-------Starting automatically payments post--------');
    const posts = await this.getAvailablePayment();
    console.log(`-------Posts length: ${posts.length}--------`);

    const jobs = [];
    posts.forEach((post) => {
      const newSubscriptionEndAt =
        new Date(post.subscriptionEndAt) < new Date()
          ? moment().add(post.timePosted, post.timeOption).toDate()
          : moment(post.subscriptionEndAt).add(post.timePosted, post.timeOption).toDate();

      jobs.push(
        PostsRepository.updateOne(post._id, {
          subscriptionStartAt: new Date(),
          subscriptionEndAt: newSubscriptionEndAt,
        }),
      );
      jobs.push(UsersService.Repo.increaseOne(post.user._id, 'amountBalance', -post.chargePrice));
      jobs.push(
        ActivitiesService.createOne({
          type: ACTIVITY_AUTO_PAY_POST,
          amount: post.chargePrice,
          postId: post._id,
          userId: post.user._id,
        }),
      );
    });

    return await Promise.all(jobs);
  };

  /**
   * Check if user not enough
   * @return {Promise<PostsExtend[]>}
   */
  getAvailablePayment = async () => {
    const autoPaymentPosts = await PostsRepository.getAutoPayment();
    const availablePayments = autoPaymentPosts.map((post) => {
      const price = getPricePost(post);
      return post.user?.amountBalance < price ? null : {...post, chargePrice: price};
    });
    return availablePayments.filter(Boolean);
  };

  /**
   * @param plan
   * @param userId
   * @param timeOption
   * @param timePosted {number}
   * @param postId
   * @param price {number}
   * @param type
   * @return {Promise}
   */
  payment = async ({
    plan,
    userId,
    timeOption,
    timePosted,
    postId,
    price,
    type = ACTIVITY_PAY_POST,
  }) => {
    const oldPost = await PostsRepository.findOne(postId);
    const newSubscriptionEndAt =
      new Date(oldPost.subscriptionEndAt) < new Date()
        ? moment().add(timePosted, timeOption).toDate()
        : moment(oldPost.subscriptionEndAt).add(timePosted, timeOption).toDate();

    const [post] = await Promise.all([
      PostsRepository.updateOne(postId, {
        plan,
        timeOption,
        timePosted,
        subscriptionStartAt: new Date(),
        subscriptionEndAt: newSubscriptionEndAt,
        isAutoPaying: true,
      }),
      UsersService.Repo.increaseOne(userId, 'amountBalance', -price),
      ActivitiesService.createOne({
        amount: price,
        type,
        postId,
        userId,
      }),
    ]);
    return post;
  };
}

export default new PostsService();
