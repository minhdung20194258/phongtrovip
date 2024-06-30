/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import {
  ACTIVITY_AUTO_PAY_POST,
  ACTIVITY_PAY_POST,
  ACTIVITY_RECHARGE,
  ACTIVITY_RECHARGE_DEPOSIT,
  ACTIVITY_RECHARGE_ERROR,
  ACTIVITY_RECHARGE_WAITING,
  ACTIVITY_AUTO_REFUND_DEPOSIT_OWNER,
  ACTIVITY_REJECT_DEPOSIT_OWNER,
  ACTIVITY_REJECT_DEPOSIT_CUSTOMER,
  ACTIVITY_STAFF_ACCEPT_PAYMENT,
  ACTIVITY_STAFF_ACCEPT_POST,
  ACTIVITY_STAFF_CREATE_USER,
  ACTIVITY_STAFF_EDIT_USER,
} from 'backend/const/types/activitiesTypes.mjs';
import {AppBadge} from '@/components/index.jsx';

export const getStatusStar = (rate) => {
  switch (parseInt(rate)) {
    case 1:
      return 'Rất tồi';
    case 2:
      return 'Tồi';
    case 3:
      return 'Bình thường';
    case 4:
      return 'Tốt';
    case 5:
      return 'Tuyệt vời';
    default:
      return '';
  }
};

export const getActivityName = (type) => {
  switch (type) {
    case ACTIVITY_RECHARGE:
      return <div className="color-success fw-700">Nạp tiền</div>;
    case ACTIVITY_RECHARGE_WAITING:
      return <div className="color-warning fw-700">Đang xử lý</div>;
    case ACTIVITY_RECHARGE_ERROR:
      return <div className="color-error fw-700">Hủy giao dịch</div>;
    case ACTIVITY_PAY_POST:
      return <div className="color-error fw-700">Trừ tiền</div>;
    case ACTIVITY_RECHARGE_DEPOSIT:
      return <div className="color-error fw-700">Đặt cọc</div>;
    case ACTIVITY_AUTO_PAY_POST:
      return <div className="color-error fw-700">Trừ tiền tự động</div>;
    case ACTIVITY_STAFF_EDIT_USER:
      return <div className="color-warning fw-700">Admin chỉnh sửa thông tin</div>;
    case ACTIVITY_STAFF_CREATE_USER:
      return <div className="color-warning fw-700">Admin tạo mới người dùng</div>;
    case ACTIVITY_STAFF_ACCEPT_POST:
      return <div className="color-warning fw-700">Admin xác nhận bài post</div>;
    case ACTIVITY_REJECT_DEPOSIT_OWNER:
      return <div className="color-warning fw-700">Hoàn tiền cho người đặt cọc</div>;
    case ACTIVITY_REJECT_DEPOSIT_CUSTOMER:
      return <div className="color-success fw-700">Hoàn tiền từ chối đặt cọc</div>;
    case ACTIVITY_STAFF_ACCEPT_PAYMENT:
      return <div className="color-error fw-700">Rút tiền từ tài khoản</div>;
    case ACTIVITY_AUTO_REFUND_DEPOSIT_OWNER:
      return <div className="color-success fw-700">Hoàn tiền đặt cọc</div>;
  }
};

export const instructions = [
  'Nhập ảnh thật được nhiều người xem hơn.',
  'Nhập đầy đủ địa chỉ sẽ thuận tiện cho việc tìm kiếm hơn',
  'Miêu tả những điểm nổi bật sẽ thu hút sự chú ý hơn',
  'Nhập đầy đủ diện tích',
  'Nhập đầy đủ thông tin giá cả, chứng nhận pháp lý',
];

export const verifyPost = (post = {} /**@type {Posts}*/, userId) => {
  const ownerId = typeof post.user === 'object' ? post.user?._id : post.userId;

  if (ownerId === userId) return true;
  if (post.isAdminHidden) return false;
  return new Date(post.subscriptionEndAt) >= new Date();
};

export const PostStatusBadge = ({post = {} /**@type {Posts}*/}) => {
  console.log({post});
  if (!post.isAdminCheck) {
    return (
      <AppBadge tone="disabled" nowrap={true}>
        Chưa xác nhận
      </AppBadge>
    );
  }

  if (post.isAdminHidden) {
    return (
      <AppBadge tone="error" nowrap={true}>
        Từ chối
      </AppBadge>
    );
  }

  return (
    <AppBadge tone="success" nowrap={true}>
      Phê duyệt
    </AppBadge>
  );
};
