import sendMail from '../services/cloud/maill.service.mjs';
import {postsRequestReject} from '../config/email/postsEmail.mjs';

(async () => {
  await testSendEmail();
})();

async function testSendEmail() {
  await sendMail({
    html: postsRequestReject({postId: 111, title: 'vsdvsdvds'}),
    attachments: [
      {
        filename: 'logo.png',
        path: `../config/email/logo.png`,
        cid: 'logo1',
      },
    ],
  });
}
