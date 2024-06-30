import {getConfigRequired, VALID_NUM_GTE, VALID_REQUIRED} from '@/const/types/validationTypes.js';

export const paymentRules = (data) => ({
  amount: {
    value: data.amount,
    validations: [VALID_REQUIRED, VALID_NUM_GTE],
    errors: ['Số tiền là bắt buộc', 'Yêu cầu nhập ít nhất 50.000đ'],
    comparedValue: 50000,
  },
  ...getConfigRequired(['id', 'accountNumber', 'accountName', 'accountCreatedAt'], data.bankInfo),
});
