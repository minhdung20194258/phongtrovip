import UsersRepository from '../repositories/Users.repository.mjs';
import UsersModel from '../models/Users.mjs';
import {UsersController} from './Users.controller.mjs';
import UsersService from '../services/Users.service.mjs';
import {pick, remove, trim} from '../helpers/untils.mjs';
import ActivitiesService from '../services/Activities.service.mjs';
import {
  ACTIVITY_STAFF_ACCEPT_PAYMENT,
  ACTIVITY_STAFF_ACCEPT_POST,
  ACTIVITY_STAFF_CREATE_USER,
  ACTIVITY_STAFF_EDIT_USER,
} from '../const/types/activitiesTypes.mjs';
import {getNewId} from '../repositories/base/Helper.repository.mjs';
import PostsService from '../services/Posts.service.mjs';
import sendMail from '../services/cloud/maill.service.mjs';
import {postsRequestAccept, postsRequestReject} from '../config/email/postsEmail.mjs';
import ReviewsService from '../services/Reviews.service.mjs';
import RequestsService from '../services/Requests.service.mjs';

class AdminController extends UsersController {
  constructor() {
    super(UsersModel, UsersRepository);
  }

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  requestImages = async (req, res) => {
    const {
      images,
      params: {requestId},
    } = req;
    console.log('dfssssssssssss');
    const request = await RequestsService.updateOne(requestId, {images});

    return res.status(200).json({
      success: true,
      data: request,
    });
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  acceptRequest = async (req, res) => {
    const {
      user: staff = {},
      body: {userId, requestId},
    } = req;

    const [user, request] = await Promise.all([
      UsersService.findOne(userId),
      RequestsService.findOne(requestId),
    ]);

    if (user.amountBalance < request.amount) throw new Error('Tài khoản không đủ');
    if (request.isAdminFirstCheck || request.isCompleted) throw new Error('Đã chuyển trước đó');

    const [newRequest] = await Promise.all([
      RequestsService.updateOne(requestId, {
        isCompleted: true,
        isAdminFirstCheck: true,
      }),
      UsersService.Repo.increaseOne(userId, 'amountBalance', -request.amount),
      ActivitiesService.createOne({
        staffInfo: staff,
        type: ACTIVITY_STAFF_ACCEPT_PAYMENT,
        amount: request.amount,
        userId,
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: newRequest,
    });
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  getListRequests = async (req, res) => {
    const {query} = req;
    const {count, docs, pageInfo} = await RequestsService.query(query);

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
  approvedReview = async (req, res) => {
    const {
      body: {isAdminHidden},
      params: {id: reviewId},
    } = req;
    const post = await ReviewsService.updateOne(reviewId, {isAdminHidden});
    return res.status(200).json({
      success: true,
      data: post,
    });
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  approvedPost = async (req, res) => {
    const {
      user: staff,
      body: {isAdminHidden},
      params: {id: postId},
    } = req;
    const post = await PostsService.updateOne(postId, {isAdminCheck: true, isAdminHidden});
    const user = await UsersService.findOne(post.userId);
    await Promise.all([
      ActivitiesService.createOne({
        postId,
        userId: user._id,
        staffInfo: pick(staff, ['fullName', '_id', 'role']),
        editInfo: {isAdminHidden},
        oldInfo: {isAdminHidden: !isAdminHidden},
        type: ACTIVITY_STAFF_ACCEPT_POST,
      }),
      sendMail({
        to: user.email,
        html: isAdminHidden
          ? postsRequestReject({postId, title: post.title})
          : postsRequestAccept({postId, title: post.title}),
        subject: isAdminHidden
          ? `Ẩn tin đăng "${post.title}"`
          : `Phê duyệt tin đăng "${post.title}"`,
      }),
    ]);
    return res.status(200).json({
      success: true,
      data: post,
    });
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  updateOne = async (req, res) => {
    const {
      body: {_id, ...doc},
      user: staff,
      params: {userId},
    } = req;
    const docUser = staff?.role === 'admin' ? trim(doc) : remove(trim(doc), ['role']);

    const oldUser = await UsersService.findOne(_id || userId);
    const newUser = await UsersService.updateOne(_id || userId, docUser);
    await ActivitiesService.createOne({
      staffInfo: pick(staff, ['fullName', '_id', 'role']),
      userId: _id || userId,
      editInfo: docUser,
      oldInfo: pick(oldUser, Object.keys(docUser)),
      type: ACTIVITY_STAFF_EDIT_USER,
    });

    return res.status(200).json({
      success: true,
      data: newUser,
    });
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  createOne = async (req, res) => {
    const {body: doc, user: staff} = req;
    const newId = await getNewId();
    const docUser = staff?.role === 'admin' ? trim(doc) : remove(trim(doc), ['role']);

    const [user] = await Promise.all([
      UsersService.createOne({_id: newId, ...docUser}),
      ActivitiesService.createOne({
        staffId: staff._id,
        userId: newId,
        editInfo: remove(docUser, ['password']),
        type: ACTIVITY_STAFF_CREATE_USER,
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: user,
    });
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  createOrUpdate = async (req, res) => {
    return req.body?._id ? this.updateOne(req, res) : this.createOne(req, res);
  };
}

/**
 * @param type {'admin' | 'staff'}
 * @return {RequestHandler}
 */
export function middlewareAdmin(type = 'staff') {
  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @param next {import('express').NextFunction}
   * @return {Promise}
   */
  return async (req, res, next) => {
    const {user} = req;
    if ((user && user.role === type) || user.role === 'admin') return next();

    return res.status(200).json({
      success: false,
      message: `User not role "${type}"!`,
    });
  };
}
export default new AdminController();
