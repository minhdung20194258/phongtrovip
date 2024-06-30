import {useCallback, useEffect, useState} from 'react';
import {isString, isEmpty, isNull, isUndefined, isArray} from 'lodash';
import {trim} from '@/helper/untils.js';
import {
  VALID_CUSTOM,
  VALID_DATE_BETWEEN,
  VALID_DATE_GT,
  VALID_DATE_LT,
  VALID_DIGITS,
  VALID_EMAIL,
  VALID_LEN_LT,
  VALID_LEN_GT,
  VALID_NUM_GT,
  VALID_NUM_LT,
  VALID_REQUIRED,
  VALID_LEN_EQUAL,
  VALID_NUM_GTE,
  VALID_NUM_LTE,
  VALID_LEN_GTE,
  VALID_LEN_LTE,
  VALID_DATE_LTE,
  VALID_DATE_GTE,
} from '@/const/types/validationTypes.js';

function useValidations(rules) {
  const [validations, setValidations] = useState({});

  const getErrorMessageRule = useCallback(
    ({rule, index, key}) => {
      if (rules[key].depends && !rules[key].depends()) return;
      const errorMessage = isArray(rules[key].errors)
        ? rules[key].errors[index]
        : rules[key].errorMessage || '';

      switch (rule) {
        case VALID_REQUIRED: {
          const value = trim(rules[key].value);
          return (isString(value) && value === '') ||
            isNull(value) ||
            isUndefined(value) ||
            (isArray(value) && value.length === 0)
            ? errorMessage || 'Trường này không được bỏ trống'
            : '';
        }

        case VALID_DATE_LT: {
          const {value, comparedValue} = rules[key];
          return !(new Date(value) < new Date(comparedValue))
            ? errorMessage || 'Ngày không hợp lệ'
            : '';
        }
        case VALID_DATE_LTE: {
          const {value, comparedValue} = rules[key];
          return !(new Date(value) <= new Date(comparedValue))
            ? errorMessage || 'Ngày không hợp lệ'
            : '';
        }

        case VALID_DATE_GT: {
          const {value, comparedValue} = rules[key];
          return !(new Date(value) > new Date(comparedValue))
            ? errorMessage || 'Ngày không hợp lệ'
            : '';
        }

        case VALID_DATE_GTE: {
          const {value, comparedValue} = rules[key];
          return !(new Date(value) >= new Date(comparedValue))
            ? errorMessage || 'Ngày không hợp lệ'
            : '';
        }

        case VALID_DATE_BETWEEN: {
          let {value, fromDate, toDate} = rules[key];
          const dateFrom = new Date(fromDate);
          const dateTo = new Date(toDate);
          const dateValue = new Date(value);

          return !(
            dateValue !== null &&
            dateFrom < dateTo &&
            dateFrom <= dateValue &&
            dateTo >= dateValue
          )
            ? errorMessage || 'Phạm vi ngày không hợp lệ'
            : '';
        }

        case VALID_NUM_GTE: {
          const {value, comparedValue} = rules[key];
          return !(comparedValue <= parseFloat(value))
            ? errorMessage || `Giá trị trường này cần phải lớn hơn hoặc bằng ${comparedValue}`
            : '';
        }
        case VALID_NUM_GT: {
          const {value, comparedValue} = rules[key];
          return !(comparedValue < parseFloat(value))
            ? errorMessage || `Giá trị trường này cần phải lớn hơn ${comparedValue}`
            : '';
        }

        case VALID_NUM_LT: {
          const {value, comparedValue} = rules[key];
          return !(comparedValue > parseFloat(value))
            ? errorMessage || `Giá trị trường này cần phải bé hơn ${comparedValue}`
            : '';
        }

        case VALID_NUM_LTE: {
          const {value, comparedValue} = rules[key];
          return !(comparedValue >= parseFloat(value))
            ? errorMessage || `Giá trị trường này cần phải bé hơn hoặc bằng ${comparedValue}`
            : '';
        }

        case VALID_EMAIL: {
          const {value} = rules[key];
          return value.trim() !== '' && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
            ? errorMessage || 'Email không hợp lệ'
            : '';
        }

        case VALID_DIGITS: {
          const {value} = rules[key];
          return !Number.isInteger(parseFloat(value)) ? errorMessage || 'Phải là chữ số' : '';
        }

        case VALID_LEN_EQUAL: {
          const {value, comparedValue} = rules[key];
          return !(value.length === comparedValue)
            ? errorMessage || `Điền ${comparedValue} ký tự`
            : '';
        }

        case VALID_LEN_GT: {
          const {value, comparedValue} = rules[key];
          return !(value.length > comparedValue)
            ? errorMessage || `Điền nhiều hơn ${comparedValue} ký tự`
            : '';
        }
        case VALID_LEN_GTE: {
          const {value, comparedValue} = rules[key];
          return !(value.length >= comparedValue)
            ? errorMessage || `Điền ít nhất ${comparedValue} ký tự`
            : '';
        }

        case VALID_LEN_LT: {
          const {value, comparedValueMax} = rules[key];
          return !(value.length < comparedValueMax)
            ? errorMessage || `Điền ít hơn ${comparedValueMax} ký tự`
            : '';
        }

        case VALID_LEN_LTE: {
          const {value, comparedValueMax} = rules[key];
          return !(value.length < comparedValueMax)
            ? errorMessage || `Điền tối đa ${comparedValueMax} ký tự`
            : '';
        }

        case VALID_CUSTOM: {
          const {value, customHandler} = rules[key];
          return !customHandler(value) ? errorMessage || 'Giá trị không hợp lệ' : '';
        }

        default:
          break;
      }
    },
    [rules],
  );

  const handleValidations = useCallback(() => {
    const newValidations = {};
    Object.keys(rules).forEach((key) => {
      rules[key].validations.forEach((rule, index) => {
        if (newValidations[key]) return;
        const error = getErrorMessageRule({rule, key, index});
        if (error) newValidations[key] = error;
      });
    });
    setValidations(newValidations);
    return isEmpty(newValidations);
  }, [rules, getErrorMessageRule]);

  useEffect(() => {
    if (!isEmpty(validations)) console.log(validations);
  }, [validations]);

  return {
    validations,
    handleValidations,
    setValidations,
    resetValidations: () => setValidations({}),
  };
}

export default useValidations;
