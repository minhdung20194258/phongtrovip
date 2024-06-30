import querystring from 'qs';
import crypto from 'crypto';
import moment from 'moment';

function sortObject(obj) {
  const sorted = {};
  Object.keys(obj)
    .map((key) => encodeURIComponent(key))
    .sort()
    .forEach((key) => {
      sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+');
    });
  return sorted;
}

/**
 * @param ipAddr
 * @param orderInfo
 * @param amount
 * @param userId
 * @param serveUrl
 * @return {string}
 */
export const getVNPayUrl = ({ipAddr, orderInfo, amount, userId, serveUrl}) => {
  const tmnCode = process.env.VNP_TMNCODE;
  const secretKey = process.env.VNP_HASH_SECRET;
  const vnpUrl = process.env.VNP_URL;
  const returnUrl = `${serveUrl}${process.env.VNP_RETURN_URL}`;
  const vnp_Params = sortObject({
    vnp_Version: '2.1.0',
    vnp_Amount: amount * 100,
    vnp_Command: 'pay',
    vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
    vnp_TxnRef: moment().format('YYYYMMDDHHmmss'),
    vnp_CurrCode: 'VND',
    vnp_IpAddr: ipAddr,
    vnp_Locale: 'vn',
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: 'other',
    vnp_ReturnUrl: `${returnUrl}/${userId}`,
    vnp_TmnCode: tmnCode,
  });

  const signData = querystring.stringify(vnp_Params, {encode: false});
  const hmac = crypto.createHmac('sha512', secretKey);
  vnp_Params.vnp_SecureHash = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

  return vnpUrl + '?' + querystring.stringify(vnp_Params, {encode: false});
};
