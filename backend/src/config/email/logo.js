export const logoHtml = `
    <img src="cid:logo1" alt="logo" style="width: 300px;" />
    <p style="color: #222222;">Chào bạn,</p>
    <p style="color: #222222;">Cảm ơn bạn đã sử dụng dịch vụ của <b>PHONGTROVIP</b></p>
`;

export const attachmentsLogoHtml = [
  {
    filename: 'logo.png',
    path: `./src/config/email/logo.png`,
    cid: 'logo1',
  },
];
export const containerHtml = (body) => `
    ${logoHtml}
    ${body}
    <i style="color: #222222;">Nếu có thắc mắc vui lòng liên hệ tới Hotline: <b>0966782945</b></i>
    <p style="color: #222222;">Trân trọng.</p>    
`;
