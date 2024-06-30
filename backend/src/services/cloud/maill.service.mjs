import nodemailer from 'nodemailer';

const sendMail = async ({
  to = 'minhdungit2001@gmail.com',
  text = '',
  subject = 'PHONGTROVIP',
  html = '',
  attachments = [],
}) => {
  if (!to) return;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'gmail',
    secureConnection: true,
    auth: {
      user: 'store.accommodation@gmail.com',
      pass: 'bwnt ynjp ayni jgie',
    },
  });

  return transporter.sendMail({
    from: 'store.accommodation@gmail.com',
    to,
    subject,
    text,
    html,
    // attachments: attachments.length
    //   ? attachments
    //   : [
    //       {
    //         filename: 'logo.png',
    //         path: `./src/config/email/logo.png`,
    //         cid: 'logo1',
    //       },
    //     ],
  });
};

export default sendMail;
