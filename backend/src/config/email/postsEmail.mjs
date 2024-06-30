import {containerHtml} from './logo.js';

export const postsRequestAccept = ({postId, title}) =>
  containerHtml(`
    <p style="color: #222222;">
      Tin đăng <b>"${title}"</b> của bạn đã được phê duyệt
      <b style="font-size: 15px; color: rgb(0, 187, 9)">thành công</b>.
    </p>
    <p style="color: #222222;">
      Xem thông tin chi tiết tin đăng
      <a
      style="font-weight: bold"
      href="http://localhost:5173/posts/${postId}"
      target="_blank"
      >
      Tại đây
      </a>
    </p>
`);

export const postsRequestReject = ({postId, title}) =>
  containerHtml(`
    <p style="color: #222222;">
      Tin đăng <b>"${title}"</b> của bạn <b style="font-size: 14px; color: rgb(187,0,0)">KHÔNG</b> được phê duyệt do vi phạm 
      <a
      style="font-weight: bold"
      href="http://localhost:5173/posts/${postId}"
      target="_blank"
      >
      chính sách
      </a> của PHONGTROVIP.
    </p>
    <p style="color: #222222;">
      Xem thông tin chi tiết tin đăng
      <a
      style="font-weight: bold"
      href="http://localhost:5173/posts/${postId}"
      target="_blank"
      >
      Tại đây
      </a>
      (Lưu ý: chỉ được xem khi đã đăng nhập)
    </p>
`);
