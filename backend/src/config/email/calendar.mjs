import {containerHtml} from './logo.js';

export const calendarRequestHtml = ({postId, startAt}) =>
  containerHtml(`
    <p style="color: #222222;">
      Yêu cầu đặt lịch xem phòng
      <a
        style="font-weight: bold"
        href="http://localhost:5173/posts/${postId}"
        target="_blank"
      >
        PHONGTROVIP
      </a>
      vào <b>${startAt}</b> của bạn đã được gửi tới chủ nhà
    </p>
    <p style="color: #222222;">
      Chúng tôi sẽ phản hồi tới bạn sớm nhất khi chủ nhà có trạng thái mới nhất
    </p>
`);

export const calendarOwnerRequestHtml = ({email, postId, startAt}) =>
  containerHtml(`
    <p style="color: #222222;">
      Bạn vừa nhận được yêu cầu xem phòng từ <b>${email}</b>
      vào lúc <b>${startAt}</b> của bài viết 
      <a
        style="font-weight: bold"
        href="http://localhost:5173/posts/${postId}"
        target="_blank"
      >
        PHONGTROVIP
      </a>
    </p>
    <p style="color: #222222;">
      Xin vui lòng xác nhận yêu cầu của người dùng sớm nhất có thể
    </p>
`);

export const calendarRequestAccept = ({postId, title, startAt}) =>
  containerHtml(`
    <p style="color: #222222;">
      Lịch hẹn <b>"${title}"</b> vào lúc <b>${startAt}</b> của bạn đã được
      <b style="font-size: 15px; color: rgb(0, 187, 9)">đồng ý</b>.
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

export const calendarRequestReject = ({postId, title, startAt}) =>
  containerHtml(`
    <p style="color: #222222;">
      Lịch hẹn <b>"${title}"</b> vào lúc <b>${startAt}</b> của bạn đã bị <b style="font-size: 14px; color: rgb(187,0,0)">từ chối</b>
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
