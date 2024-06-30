export const findResetKeys = (key) => {
  return ['isExpired', 'isAdminCheck', 'isAdminHidden', 'isShowForUser'].filter((i) => i !== key);
};
export const showOptions = [
  {
    content: 'Tất cả',
    key: 'isAdminHidden',
    value: null,
    id: 1,
  },
  {
    content: 'Chưa phê duyệt',
    key: 'isAdminCheck',
    value: false,
    id: 2,
  },
  {
    content: 'Đã phê duyệt',
    key: 'isAdminCheck',
    value: true,
    id: 3,
  },
  {
    content: 'Từ chối',
    key: 'isAdminHidden',
    value: true,
    id: 4,
  },
  {
    content: 'Đã hết hạn',
    key: 'isExpired',
    value: true,
    id: 5,
  },
  {
    content: 'Đang hiển thị',
    key: 'isShowForUser',
    value: true,
    id: 6,
  },
];

export const showUserOptions = [
  {
    content: 'Tất cả',
    id: null,
  },
  {
    content: 'Đang hoạt động',
    id: true,
  },
  {
    content: 'Khóa tài khoản',
    id: false,
  },
];
export const showReviewOptions = [
  {
    content: 'Tất cả',
    id: null,
  },
  {
    content: 'Đang hiển thị',
    id: false,
  },
  {
    content: 'Đang ẩn',
    id: true,
  },
];

export const showRequestOptions = [
  {
    content: 'Tất cả',
    id: null,
  },
  {
    content: 'Đang chờ',
    id: false,
  },
  {
    content: 'Hoàn tất',
    id: true,
  },
];

export const typeDepositOptions = [
  {
    content: 'Đã nhận',
    id: 0,
    query: {
      isReceiver: true,
    },
  },
  {
    content: 'Đã gửi',
    id: 1,
    query: {
      isSender: true,
    },
  },
];
