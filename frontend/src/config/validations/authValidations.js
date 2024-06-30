import {
  VALID_CUSTOM,
  VALID_EMAIL,
  VALID_LEN_EQUAL,
  VALID_LEN_GTE,
  VALID_LEN_LTE,
  VALID_REQUIRED,
} from '@/const/types/validationTypes.js';

export const forgotPasswordStep3 = (data) => ({
  newPassword: {
    value: data.newPassword,
    validations: [VALID_REQUIRED, VALID_LEN_GTE],
    errors: ['Mật khẩu mới là bắt buộc', 'Mật khẩu mới phải có ít nhất 6 ký tự'],
    comparedValue: 6,
  },
  confirmPassword: {
    value: data.confirmPassword,
    validations: [VALID_REQUIRED, VALID_LEN_GTE, VALID_CUSTOM],
    errors: ['Xác nhận mật khẩu là bắt buộc', 'Xác nhận mật khẩu phải có ít nhất 6 ký tự'],
    comparedValue: 6,
    customHandler: (data) => data.newPassword === data.confirmPassword,
  },
});

export const signInEmailValid = (data) => ({
  email: {
    validations: [VALID_REQUIRED, VALID_EMAIL],
    value: data.email,
    errors: ['Email là bắt buộc', 'Email không hợp lệ'],
  },
  password: {
    value: data.password,
    validations: [VALID_REQUIRED, VALID_LEN_GTE],
    errors: ['Mật khẩu là bắt buộc', 'Mật khẩu phải có ít nhất 6 ký tự'],
    comparedValue: 6,
  },
});

export const signInPhoneValid = (data) => ({
  mobile: {
    value: data.mobile,
    validations: [VALID_REQUIRED],
    errors: ['Số điện thoại là bắt buộc'],
  },
  phone: {
    value: data.phone,
    validations: [VALID_REQUIRED, VALID_LEN_GTE, VALID_LEN_LTE],
    errors: [
      'Số điện thoại là bắt buộc',
      'Số điện thoại phải có độ dài hơn 13 ký tự',
      'Số điện thoại phải có độ dài ít hơn 18 ký tự',
    ],
    comparedValue: 13,
    comparedValueMax: 18,
  },
  otp: {
    validations: [VALID_REQUIRED, VALID_LEN_EQUAL],
    value: data.otp,
    errors: ['Mã OTP là bắt buộc', 'Mã OTP phải có 6 ký tự'],
    comparedValue: 6,
  },
});

export const forgotPasswordStep1 = (data) => ({
  email: {
    validations: [VALID_REQUIRED, VALID_EMAIL],
    value: data.email,
    errors: ['Email là bắt buộc', 'Email không hợp lệ'],
  },
});

export const otpValid = (data) => ({
  validation: {
    validations: [VALID_REQUIRED, VALID_LEN_EQUAL],
    value: data.validation,
    errors: ['Mã OTP là bắt buộc', 'Mã OTP phải có 6 ký tự'],
    comparedValue: 6,
  },
});

export const signUpValid = (data = {}) => ({
  fullName: {
    value: data.fullName,
    validations: [VALID_REQUIRED, VALID_LEN_GTE],
    errors: ['Họ và tên bắt buộc', 'Họ tên phải có ít nhất 3 ký tự'],
    comparedValue: 3,
  },
  email: {
    value: data.email,
    validations: [VALID_REQUIRED, VALID_EMAIL],
    errors: ['Email là bắt buộc', 'Email không hợp lệ'],
  },
  password: {
    value: data.password,
    validations: [VALID_REQUIRED, VALID_LEN_GTE],
    errors: ['Mật khẩu là bắt buộc', 'Mật khẩu phải có ít nhất 6 ký tự'],
    comparedValue: 6,
  },
  confirmPassword: {
    value: data.confirmPassword,
    validations: [VALID_REQUIRED, VALID_LEN_GTE, VALID_CUSTOM],
    errors: [
      'Xác nhận mật khẩu là bắt buộc',
      'Xác nhận mật khẩu phải có ít nhất 6 ký tự',
      'Mật khẩu không khớp. Vui lòng nhập lại mật khẩu.',
    ],
    comparedValue: 6,
    customHandler: (data) => data.password === data.confirmPassword,
  },
});

export const userEditValid = (data = {}) => ({
  fullName: {
    value: data.fullName,
    validations: [VALID_REQUIRED, VALID_LEN_GTE],
    errors: ['Họ và tên bắt buộc', 'Họ tên phải có ít nhất 3 ký tự'],
    comparedValue: 3,
  },
  email: {
    value: data.email,
    validations: [VALID_REQUIRED, VALID_EMAIL],
    errors: ['Email là bắt buộc', 'Email không hợp lệ'],
  },
});

export const changePasswordAdmin = (data = {}) => ({
  newPassword: {
    value: data.newPassword,
    validations: [VALID_REQUIRED, VALID_LEN_GTE],
    errors: ['Mật khẩu mới là bắt buộc', 'Mật khẩu mới phải có ít nhất 6 ký tự'],
    comparedValue: 6,
  },
  confirmPassword: {
    value: data.confirmPassword,
    validations: [VALID_REQUIRED, VALID_LEN_GTE, VALID_CUSTOM],
    errors: [
      'Xác nhận mật khẩu là bắt buộc',
      'Xác nhận mật khẩu phải có ít nhất 6 ký tự',
      'Mật khẩu không khớp. Vui lòng nhập lại mật khẩu.',
    ],
    comparedValue: 6,
    customHandler: (data) => data.newPassword === data.confirmPassword,
  },
});
export const changePassword = (data = {}) => ({
  oldPassword: {
    value: data.oldPassword,
    validations: [VALID_REQUIRED, VALID_LEN_GTE],
    errors: ['Mật khẩu cũ là bắt buộc', 'Mật khẩu cũ phải có ít nhất 6 ký tự'],
    comparedValue: 6,
  },
  ...changePasswordAdmin(data),
});
