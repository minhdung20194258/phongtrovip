import UsersRepository from '../repositories/Users.repository.mjs';
import UsersModel from '../models/Users.mjs';
import UserService from '../services/Users.service.mjs';
import BaseCrudController from './base/BaseCrud.controller.mjs';
import {pick, remove, trim} from '../helpers/untils.mjs';
import {encodeAccessToken, encodeRefreshToken, encodeToken} from '../helpers/jwt.mjs';
import {fieldsAdminUser, fieldsPrivateUser} from '../const/picker.mjs';
import bcrypt from 'bcrypt';
import {deleteImage, uploadImage} from '../services/cloud/cloudinary.service.mjs';
import {getDiffMinutes} from '../helpers/momentService.js';
import {Error} from 'mongoose';
import RequestsService from '../services/Requests.service.mjs';
import {REQUEST_TRANSFER} from '../const/types/requestsTypes.mjs';
import OtpsService from '../services/Otps.service.mjs';
import {OTP_FORGOT_PASSWORD} from '../const/types/otpTypes.mjs';

export class UsersController extends BaseCrudController {
  constructor() {
    super(UsersModel, UsersRepository);
  }

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  deleteRequest = async (req, res) => {
    const {
      user /**@type {Users}*/,
      params: {requestId},
    } = req;

    const request = await RequestsService.findOne(requestId);
    if (request?.userId.toString() === user?._id.toString() && !request.isCompleted) {
      await RequestsService.deleteOne(requestId);
    }

    console.log(request?.userId, user._id);
    return res.status(200).json({
      success: true,
    });
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  getRequests = async (req, res) => {
    const {user /**@type {Users}*/, query = {}} = req;
    const {count, docs, pageInfo} = await RequestsService.query({
      userId: user._id,
      ...query,
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
  createRequest = async (req, res) => {
    const {
      user /**@type {Users}*/,
      body: {_id, amount, bankInfo},
    } = req;
    const {id, accountNumber, accountName, accountCreatedAt} = bankInfo || {};

    if (!amount || parseInt(amount) < 50000) {
      throw new Error('Chỉ cho phép rút trên 50.000đ');
    }
    if (user.amountBalance < parseInt(amount)) {
      throw new Error('Tài khoản không đủ để thực hiện hành động này');
    }
    if (!id || !accountNumber || !accountName || !accountCreatedAt) {
      throw new Error('Vui lòng điền đầy đủ thông tin ngân hàng');
    }
    const doc = {
      userId: user._id,
      amount,
      bankInfo,
      type: REQUEST_TRANSFER,
    };

    const data = _id
      ? await RequestsService.updateOne(_id, doc)
      : await RequestsService.createOne(doc);
    return res.status(200).json({
      success: true,
      data,
    });
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  reactPost = async (req, res) => {
    const {
      user /**@type {Users}*/,
      params: {postId},
      body: {type},
    } = req;

    const data = await UserService.reactPost({userId: user._id, postId, type});
    return res.status(200).json({
      success: true,
      data,
    });
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  updateOne = async (req, res) => {
    const {user /**@type {Users}*/, body} = req;
    const data = await UserService.findByIdAndUpdate(user._id, remove(trim(body), fieldsAdminUser));
    return res.status(200).json({
      success: true,
      data,
    });
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  forgotPassStep3 = async (req, res) => {
    const {
      user,
      body: {password = ''},
      authInfo: {data},
    } = req;
    if (getDiffMinutes(data.createdAt) > 5) {
      throw new Error('Mã OTP đã hết hạn');
    }
    await UserService.updateOne(user._id, {password});

    return res.status(200).json({success: true});
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  forgotPassStep2 = async (req, res) => {
    const {email, validation} = req.body;

    const existUser = await UserService.findOneByEmail(email);
    if (!existUser) throw new Error('Not found email');

    const otp = await OtpsService.handleVerify({
      validation,
      userId: existUser._id,
      type: OTP_FORGOT_PASSWORD,
    });

    res.status(200).json({
      success: true,
      accessToken: encodeToken(existUser._id, otp, 60000 * 5),
    });
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  forgotPassStep1 = async (req, res) => {
    const {email} = req.body;

    const existUser = await UserService.findOneByEmail(email);
    if (!existUser) throw new Error('Not found email');

    await OtpsService.handleCheckAndCreate({
      userId: existUser._id,
      type: OTP_FORGOT_PASSWORD,
      email,
    });

    return res.status(200).json({
      success: true,
    });
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  getInfo = async (req, res) => {
    return res.status(200).json({
      success: true,
      data: req.user,
      accessToken: encodeAccessToken(req.user._id, req.user.role),
      ...encodeRefreshToken(req.user._id, req.user.role),
    });
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  changeAvatar = async (req, res) => {
    const {
      user,
      files: {fileUpload},
    } = req;

    const [avatar] = await Promise.all([
      uploadImage(fileUpload),
      deleteImage(user.avatar?.publicId),
    ]);
    await UserService.updateOne(user._id, {avatar});
    return res.status(200).json({
      success: true,
    });
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  changePass = async (req, res) => {
    const {
      user,
      body: {password, newPassword},
    } = req;

    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error('Tài khoản không tồn tại hoặc sai mật khẩu');
    }

    await UserService.updateOne(user._id, {password: newPassword});
    return res.status(200).json({
      success: true,
      user: pick(user, fieldsPrivateUser),
    });
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  signUpLocal = async (req, res) => {
    const {email, fullName, password, description} = req.body;

    if (await UserService.findOneByEmail(email))
      return res.status(200).json({
        success: false,
        data: null,
        message: 'Email already exists.',
        error: {
          message: 'Email already exists.',
          code: 'DUPLICATE_EMAIL',
        },
      });

    const user = await UserService.createOne({email, password, fullName, description});
    return res.status(200).json({success: true, data: user});
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  signInLocal = async (req, res) => {
    const {
      user = {},
      body: {password},
    } = req;

    if (!user._id) {
      throw new Error('Tài khoản không tồn tại hoặc sai mật khẩu');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error('Tài khoản không tồn tại hoặc sai mật khẩu');
    }
    if (!user.isActive) {
      throw new Error('Tài khoản đang bị khóa, vui lòng liên hệ admin để được hỗ trợ');
    }

    return res.status(200).json({
      success: true,
      data: user,
      accessToken: encodeAccessToken(user._id, user.role),
      ...encodeRefreshToken(user._id, user.role),
    });
  };

  /**
   * @param req {import('express').Request}
   * @param res {import('express').Response}
   * @return {Promise}
   */
  successGoogle = async (req, res) => {
    const {user} = req;

    if (!user) res.redirect(`${process.env.FRONTEND_URL}/sign-in`);
    console.log(process.env.FRONTEND_URL);

    const accessToken = encodeAccessToken(user._id, user.role);
    return res.redirect(`${process.env.FRONTEND_URL}/?auth=google&accessToken=${accessToken}`);
  };
}

export default new UsersController();
