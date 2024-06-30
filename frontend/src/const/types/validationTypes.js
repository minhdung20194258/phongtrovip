export const VALID_REQUIRED = 'required';
export const VALID_DATE_LT = 'date_less_than';
export const VALID_DATE_LTE = 'date_less_than_or_equal';
export const VALID_DATE_GT = 'date_greater_than';
export const VALID_DATE_GTE = 'date_greater_than_or_equal';
export const VALID_DATE_BETWEEN = 'date_between';
export const VALID_NUM_GT = 'num_gt_than';
export const VALID_NUM_GTE = 'num_gt_than_or_equal';
export const VALID_NUM_LT = 'num_lt_than';
export const VALID_NUM_LTE = 'num_lt_than_or_equal';
export const VALID_EMAIL = 'email';
export const VALID_DIGITS = 'digits';
export const VALID_LEN_GT = 'min_length';
export const VALID_LEN_GTE = 'min_length_or_equal';
export const VALID_LEN_LT = 'min_length';
export const VALID_LEN_LTE = 'min_length_or_equal';
export const VALID_LEN_EQUAL = 'length_equal';
export const VALID_CUSTOM = 'custom';

/**
 * @param fields
 * @param data
 * @return {object}
 */
export const getConfigRequired = (fields = [], data) => {
  const result = {};
  fields.forEach((key) => {
    result[key] = {
      value: data[key],
      validations: [VALID_REQUIRED],
    };
  });
  return result;
};
