import {
  getConfigRequired,
  VALID_CUSTOM,
  VALID_DATE_GTE,
  VALID_EMAIL,
  VALID_LEN_GTE,
  VALID_LEN_LTE,
  VALID_NUM_GT,
  VALID_REQUIRED,
} from '@/const/types/validationTypes.js';

export const postAdminDeposit = (data) => ({
  startAt: {
    value: data.startAt,
    validations: [VALID_REQUIRED, VALID_DATE_GTE],
    comparedValue: new Date().toISOString().split('T')[0],
    depends: () => data.isUseDeposit,
    errors: ['', 'Ngày nhận phòng phải lớn hơn hiện tại'],
  },
  endAt: {
    value: data.endAt,
    validations: [VALID_REQUIRED, VALID_DATE_GTE],
    comparedValue: new Date(data.startAt),
    depends: () => data.isUseDeposit,
    errors: ['', 'Ngày trả phòng phải lớn hơn ngày nhận phòng'],
  },
});

export const postNewStep1Rules = (data) => getConfigRequired(['typeOfRoom'], data);

export const postNewStep2Rules = (data) => ({
  images: {
    value: data.images,
    validations: [VALID_REQUIRED, VALID_LEN_GTE, VALID_LEN_LTE],
    errors: ['Vui lòng thêm ảnh', 'Vui lòng chọn trên 3 ảnh', 'Vui lòng chọn dưới 20 ảnh'],
    comparedValue: 3,
    comparedValueMax: 20,
  },
  ...getConfigRequired(
    [
      'title',
      'description',
      'price',
      'priceElectricity',
      'priceWater',
      'priceCar',
      'priceInternet',
      'priceCleaning',
      'priceElevator',
      'province',
      'district',
      'ward',
      'detailAddress',
    ],
    data,
  ),
});
export const postNewStep3Rules = (data) =>
  getConfigRequired(['plan', 'timeOption', 'timePosted'], data);

export const calendarsRules = (data = {}) => ({
  time: {
    value: data.time,
    validations: [VALID_REQUIRED, VALID_CUSTOM],
    customHandler: () => {
      if (typeof data.time !== 'string' || data.time.length < 5) return false;
      const [hours, minutes] = data.time.split(':');
      const hh = parseInt(hours);
      const mm = parseInt(minutes);
      return hh <= 24 && hh >= 0 && mm <= 60 && mm >= 0;
    },
    errors: ['', 'Thời gian không hợp lệ'],
  },
  date: {
    value: data.date,
    validations: [VALID_REQUIRED, VALID_CUSTOM],
    errors: ['', 'Thời gian không hợp lệ'],
    customHandler: () => new Date(data.date) > new Date(),
  },
  timeslot: {
    value: data.timeslot,
    validations: [VALID_REQUIRED, VALID_NUM_GT],
    comparedValue: 0,
  },
  email: {
    value: data.email,
    validations: [VALID_REQUIRED, VALID_EMAIL],
    depends: () => !data.isLogin,
  },
});
