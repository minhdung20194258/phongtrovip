import PostsModel from '../models/Posts.mjs';
import BaseCrudController from './base/BaseCrud.controller.mjs';
import PostsService from '../services/Posts.service.mjs';
import {convertSort} from '../helpers/untils.mjs';
import {getPricePost} from '../const/plans.mjs';
import PostsRepository from '../repositories/Posts.repository.mjs';
import ReactionsService from '../services/Reactions.service.mjs';
import {USER_LIKE_POST} from '../const/types/reactionPostTypes.mjs';
import {uploadFilePost} from '../helpers/controlFile.mjs';
import {formatDDMMYYYY} from '../helpers/format/formatTime.mjs';
import DepositsService from '../services/Deposits.service.mjs';
import OtpsService from '../services/Otps.service.mjs';
import {OTP_REQUEST_DEPOSIT} from '../const/types/otpTypes.mjs';

class PostsController extends BaseCrudController {
  constructor() {
    super(PostsModel, PostsRepository);
  }

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  refund = async (req, res) => {
    const {
      user = {},
      params: {depositId},
    } = req;

    const deposits = await PostsService.refund(depositId, user);

    return res.status(200).json({success: true, data: deposits});
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  getDeposits = async (req, res) => {
    const {
      user = {},
      query: {
        postId,
        isRefund,
        startAt,
        endAt,
        isSender: isUserAsSender,
        isReceiver: isUserAsReceiver,
        ...props
      },
    } = req;

    const {count, docs, pageInfo} = await DepositsService.query({
      postId,
      ...(isUserAsSender ? {senderId: user._id} : {}),
      ...(isUserAsReceiver ? {receiverId: user._id} : {}),
      isRefund,
      startAt,
      endAt,
      ...props,
    });

    return res.status(200).json({
      success: true,
      data: docs,
      count,
      pageInfo,
    });
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  userReact = async (req, res) => {
    const {
      user = {},
      query: {type = USER_LIKE_POST, ...props},
    } = req;

    const {count, docs, pageInfo} = await ReactionsService.query({
      userId: user._id,
      type,
      ...props,
    });

    return res.status(200).json({
      success: true,
      data: docs,
      count,
      pageInfo,
    });
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  requestDeposit = async (req, res) => {
    const {
      params: {postId},
      user = {},
    } = req;

    if (user.amountBalance < 500000) {
      return res.status(200).json({success: false, messages: 'Tài khoản không đủ'});
    }

    await OtpsService.handleCheckAndCreate({
      email: user.email,
      userId: user._id,
      type: OTP_REQUEST_DEPOSIT,
      postId,
    });

    return res.status(200).json({success: true});
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  deposit = async (req, res) => {
    const {
      params: {postId},
      user = {},
      body: {validation},
    } = req;

    console.log({postId, validation});

    await OtpsService.handleVerify({
      postId,
      userId: user._id,
      type: OTP_REQUEST_DEPOSIT,
      validation,
    });

    if (user.amountBalance < 500000) {
      return res.status(200).json({success: false, messages: 'Tài khoản không đủ'});
    }

    const post = await PostsService.deposit({
      postId,
      userId: user._id,
    });

    return res.status(200).json({success: true, data: post});
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  payment = async (req, res) => {
    const {
      body: {plan, timeOption, timePosted},
      params: {postId},
      user = {},
    } = req;

    const price = getPricePost({plan, timeOption, timePosted});
    if (user.amountBalance < price) {
      return res.status(200).json({success: false, messages: 'Tài khoản không đủ'});
    }

    const post = await PostsService.payment({
      postId,
      plan,
      price,
      timeOption,
      timePosted: parseInt(timePosted),
      userId: user._id,
    });

    return res.status(200).json({success: true, data: post});
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  createOne = async (req, res) => {
    const {
      files = {},
      body: {data: dataJson},
      user = {},
    } = req;
    const data /** @type {Posts}*/ = JSON.parse(dataJson);

    if (data._id && (data.startAt || data.endAt)) {
      const post = await PostsService.findWithDeposit({
        postId: data._id,
        endAt: data.endAt,
        startAt: data.startAt,
      });
      if (post.isHasDeposit) {
        const {startAt, endAt} = post.deposits || {};
        throw new Error(
          `Đã có người đặt cọc trong "${formatDDMMYYYY(startAt)}" đến "${formatDDMMYYYY(endAt)}"`,
        );
      }
    }

    const images = await uploadFilePost(files, data.images);
    const post = data._id
      ? await PostsService.updateOne(data._id, {...data, images})
      : await PostsService.createOne({...data, images, userId: user._id});

    return res.status(200).json({success: true, data: post});
  };

  query = async (req, res) => {
    const {
      sort = 'createdAt:desc',
      minPrice = '0',
      maxPrice = '0',
      maxArea = '0',
      minArea = '0',
      provinces = '',
      districts = '',
      wards = '',
      typeOfRooms = '',
      reviews = '',
      limit = '20',
      page = '0',
      searchText = '',
      userId = '',
      isLookupUser = false,
      isShowAll = false,
      isAdminHidden,
      isExpired,
      isAdminCheck,
      isShowForUser,
      isRefund,

      ...props
    } = req.query;
    const {count, docs, pageInfo} = await PostsService.query({
      sortBy: sort.split(':')[0],
      sortOrder: convertSort(sort.split(':')[1]),
      minPrice: parseInt(minPrice.replace(/\./g, '')),
      maxPrice: parseInt(maxPrice.replace(/\./g, '')),
      minArea: parseInt(minArea.replace(/\./g, '')),
      maxArea: parseInt(maxArea.replace(/\./g, '')),
      provinces: provinces.split(',').filter((i) => i !== ''),
      districts: districts.split(',').filter((i) => i !== ''),
      wards: wards.split(',').filter((i) => i !== ''),
      typeOfRooms: typeOfRooms.split(',').filter((i) => i !== ''),
      reviews: reviews
        .split(',')
        .filter((i) => i !== '')
        .map((i) => parseInt(i)),
      limit: parseInt(limit),
      page: parseInt(page),
      searchText: searchText,
      userId: userId,
      isLookupUser,
      isShowAll,
      isAdminHidden,
      isExpired,
      isAdminCheck,
      isShowForUser,
      isRefund,
      ...props,
    });

    return res.status(200).json({
      success: true,
      data: docs,
      count,
      pageInfo,
    });
  };
}

export default new PostsController();
