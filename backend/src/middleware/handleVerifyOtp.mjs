import OtpsService from '../services/Otps.service.mjs';

const type = '';
/**
 * @param req {import('express').Request}
 * @param res {import('express').Response}
 * @param next {import('express').NextFunction}
 * @return {Promise}
 */
export default async function handleVerifyOtp(req, res, next) {
  const {email, userId} = req.body;
  const isVerify = await OtpsService.handleVerify({userId, type});
  if (isVerify) return next();
}
