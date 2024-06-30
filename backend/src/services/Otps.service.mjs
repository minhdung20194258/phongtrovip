import BaseCrudService from './base/BaseCrud.service.mjs';
import OtpsModel from '../models/Otps.mjs';
import OtpsRepository from '../repositories/Otps.repository.mjs';
import {getRandomNumber} from '../helpers/oneTimePassword.mjs';
import sendMail from './cloud/maill.service.mjs';
import {getDiffMinutes} from '../helpers/momentService.js';
import moment from 'moment/moment.js';

const getMess = (time) => `Bạn đã nhập sai 5 lần. Thử lại sau ${time} phút nữa.`;

class OtpsService extends BaseCrudService {
  constructor() {
    super(OtpsModel, OtpsRepository);
  }

  handleVerify = async ({userId, postId, type, validation, expiredMinutes = 60}) => {
    const otp = await OtpsRepository.queryOne({userId, type, postId});

    if (otp.times >= 5) {
      throw new Error(getMess(expiredMinutes - getDiffMinutes(otp.createdAt)));
    }
    if (otp.validation !== validation) {
      await OtpsRepository.increaseOne(otp._id, 'times', 1);
      throw new Error(`Bạn đã nhập sai ${otp.times + 1} lần.`);
    }
    if (moment(new Date()).diff(moment(otp.createdAt), 'minutes') > 5) {
      throw new Error('Mã OTP đã hết hạn');
    }

    return otp;
  };

  handleCheckAndCreate = async ({userId, email, postId, expiredMinutes = 60, type = ''}) => {
    const otp = await OtpsRepository.queryOne({userId, type, postId});
    if (otp) {
      const diff = getDiffMinutes(otp.createdAt);
      if (diff < 5) {
        throw new Error(`Xin hãy đợi ${5 - diff} phút nữa cho yêu cầu tiếp theo.`);
      }
      if (otp.times > 5 && diff < expiredMinutes) {
        throw new Error(getMess(expiredMinutes - diff));
      }
    }

    const validation = getRandomNumber();
    const [newOtp] = await Promise.all([
      OtpsRepository.createOne({userId, validation, type, postId}),
      otp?._id && OtpsRepository.findByIdAndDelete(otp?._id),
      sendMail({to: email, text: `Mã xác thực của bạn là ${validation}.`}),
    ]);
    return newOtp;
  };
}

export default new OtpsService();
