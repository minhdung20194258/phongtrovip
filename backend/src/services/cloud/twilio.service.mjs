import Twilio from 'twilio';

const accountSid = process.env.TWILIO_CID;
const authToken = process.env.TWILIO_ACCESS_TOKEN;

const client = Twilio(accountSid, authToken);

/**
 * @param body
 * @param to
 * @return {Promise}
 */
const sendSms = async (body = '', to = '') => {
  if (!body || !to) return;

  return client.messages.create({
    body,
    to,
    messagingServiceSid: 'MG28aa47b9fa14f39eec8ab2c151e3f339',
  });
};

export default sendSms;
