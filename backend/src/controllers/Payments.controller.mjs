import {getVNPayUrl} from '../services/ipay/VNPay.service.mjs';
import UsersService from '../services/Users.service.mjs';
import ActivitiesService from '../services/Activities.service.mjs';
import {
  ACTIVITY_RECHARGE,
  ACTIVITY_RECHARGE_ERROR,
  ACTIVITY_RECHARGE_WAITING,
} from '../const/types/activitiesTypes.mjs';
import getServeUrl from '../helpers/express/getServeUrl.mjs';

class PaymentController {
  constructor() {}

  create = async (req, res) => {
    const ipAddr =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    const {
      query: {orderInfo, amount},
      params: {userId},
    } = req;

    if (!orderInfo || !amount) {
      const failedUrl = `${process.env.FRONTEND_URL || getServeUrl(req)}${process.env.VNP_RETURN_URL_FAIL}`;
      return res.redirect(failedUrl);
    }
    const redirectUrl = getVNPayUrl({
      ipAddr,
      orderInfo,
      amount: parseInt(amount),
      userId,
      serveUrl: getServeUrl(req),
    });
    return res.redirect(redirectUrl);
  };

  done = async (req, res) => {
    const getStatus = (status) => {
      return `${process.env.FRONTEND_URL || getServeUrl(req)}/payments/status/${status}?amount=${vndAmount}&order=${vnp_TxnRef}`;
    };

    const {
      params: {userId},
      query: {vnp_Amount, vnp_TxnRef, vnp_TransactionStatus},
    } = req;
    const vndAmount = parseInt(vnp_Amount) / 100;

    if (vnp_TransactionStatus === '01') {
      await ActivitiesService.createOne({
        type: ACTIVITY_RECHARGE_WAITING,
        amount: vndAmount,
        orderId: vnp_TxnRef,
        userId,
      });
      return res.redirect(getStatus('waiting'));
    }
    if (vnp_TransactionStatus !== '00') {
      await ActivitiesService.createOne({
        type: ACTIVITY_RECHARGE_ERROR,
        amount: vndAmount,
        orderId: vnp_TxnRef,
        userId,
      });
      return res.redirect(getStatus('error'));
    }

    await Promise.all([
      UsersService.Repo.increaseOne(userId, 'amountBalance', vndAmount),
      ActivitiesService.createOne({
        type: ACTIVITY_RECHARGE,
        amount: vndAmount,
        orderId: vnp_TxnRef,
        userId,
      }),
    ]);
    return res.redirect(getStatus('success'));
  };
}

export default new PaymentController();
