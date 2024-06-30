import {isEmpty} from 'lodash';
import {trim} from '@/helper/untils.js';

/**
 * @param input
 * @param value
 * @param field
 * @param errorMess
 * @param validation
 * @param ltDate
 * @param gtDate
 * @param isEqual
 * @param ltNum
 * @param gtNum
 * @param minLength
 * @param maxLength
 * @param equalLength
 * @param customHandler
 * @returns {null|string}
 */
export const checkValidation = ({
  input,
  value,
  field,
  errorMess,
  validation,
  ltDate,
  gtDate,
  isEqual,
  ltNum,
  gtNum,
  minLength,
  maxLength,
  equalLength,
  customHandler,
}) => {
  const fieldUpcase = `${field.charAt(0).toUpperCase()}${field.slice(1)}`;
  switch (validation) {
    case 'required': {
      if (isEmpty(trim(value)) || !value) {
        return errorMess || 'Trường này không được bỏ trống';
      }
      return null;
    }

    case 'date_less_than': {
      if (value === null || value === undefined) break;
      if (new Date(value) > new Date(ltDate)) {
        return errorMess || 'Ngày không hợp lệ';
      }
      return null;
    }
    case 'date_greater_than': {
      if (value === null || value === undefined) break;
      if (new Date(value) < new Date(gtDate)) {
        return errorMess || 'Ngày không hợp lệ';
      }
      return null;
    }

    case 'date_between': {
      if (value === null || value === undefined) break;
      if (new Date(value) < new Date(gtDate) || new Date(value) > new Date(ltDate)) {
        return errorMess || 'Vui lòng chọn ngày nằm trong khoảng';
      }
      return null;
    }

    case 'num_greater_than': {
      if (value === null || value === undefined) break;
      const isValid = isEqual
        ? parseFloat(value) >= parseFloat(gtNum)
        : parseFloat(value) > parseFloat(gtNum);
      if (isValid) {
        return (
          errorMess || `Số cần phải lớn hơn ${isEqual ? 'hoặc bằng ' : ''}${parseFloat(gtNum)}`
        );
      }
      return null;
    }

    case 'num_less_than': {
      if (value === null || value === undefined) break;
      const isValid = isEqual
        ? parseFloat(value) <= parseFloat(ltNum)
        : parseFloat(value) < parseFloat(ltNum);
      if (isValid) {
        return errorMess || `Số cần phải bé hơn ${isEqual ? 'hoặc bằng ' : ''}${parseFloat(gtNum)}`;
      }
      return null;
    }

    case 'num_between': {
      if (value === null || value === undefined) break;
      let isValid = false;
      if (
        isEqual &&
        parseFloat(value) <= parseFloat(ltNum) &&
        parseFloat(value) >= parseFloat(gtNum)
      ) {
        isValid = true;
      }
      if (
        !isEqual &&
        parseFloat(value) < parseFloat(ltNum) &&
        parseFloat(value) > parseFloat(gtNum)
      ) {
        isValid = true;
      }
      if (!isValid) {
        return (
          errorMess ||
          `Số cần nằm trong ${isEqual ? 'khoảng ' : 'đoạn'}${parseFloat(gtNum)} và ${parseFloat(ltNum)}`
        );
      }
      return null;
    }

    case 'email': {
      if (trim(value) !== '' && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
        return errorMess || 'Email không hợp lệ';
      }
      return null;
    }

    case 'digits': {
      if (!Number.isInteger(parseFloat(value))) {
        return errorMess || 'Nhập chữ số';
      }
      return null;
    }

    case 'length_min': {
      if (value === null || value === undefined) break;
      const isValid = isEqual ? trim(value).length >= minLength : trim(value).length > minLength;
      if (!isValid) {
        return errorMess || `${fieldUpcase} ${isEqual ? 'ít nhất' : 'hơn'} ${minLength} ký tự`;
      }
      return null;
    }

    case 'length_max': {
      if (value === null || value === undefined) break;
      const isValid = isEqual ? trim(value).length <= maxLength : trim(value).length < maxLength;
      if (!isValid) {
        return (
          errorMess ||
          `${fieldUpcase} ${isEqual ? 'ít hơn hoặc bằng' : 'ít hơn'} ${minLength} ký tự`
        );
      }
      return null;
    }

    case 'length_between': {
      if (value === null || value === undefined) break;
      let isValid = false;
      if (isEqual && trim(value).length <= maxLength && trim(value).length >= minLength) {
        isValid = true;
      }
      if (!isEqual && trim(value).length < maxLength && trim(value).length > minLength) {
        isValid = true;
      }
      if (!isValid) {
        return (
          errorMess ||
          `${fieldUpcase} between ${isEqual ? 'or equal' : ''} from ${minLength} to ${maxLength} characters`
        );
      }
      return null;
    }

    case 'length_equal': {
      if (value === null || value === undefined) break;
      if (trim(value).length !== equalLength) {
        return errorMess || `${fieldUpcase} must be ${equalLength} characters`;
      }
      return null;
    }

    case 'custom': {
      if (customHandler && !customHandler(input)) {
        return errorMess || `The ${fieldUpcase} is invalid`;
      }
      return null;
    }
  }

  return null;
};
