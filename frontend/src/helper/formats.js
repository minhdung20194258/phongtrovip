import {MONEY_SPLITS} from '@/const/money.js';

export const formatPhoneNumber = (phone, {split = ' ', split1 = 3, split2 = 6}) => {
  if (!phone || split1 > split2) return;
  const phoneNumber = phone
    .toString()
    .replace(/[A-Za-z]/g, '')
    .replace(new RegExp(split, 'g'), '')
    .substring(0, 10);

  if (phoneNumber.length <= split1) {
    return phoneNumber;
  }
  if (phoneNumber.length > split1 && phoneNumber.length <= split2) {
    return `${phoneNumber.substring(0, split1)}${split}${phoneNumber.substring(split1, split2)}`;
  }
  return `${phoneNumber.substring(0, split1)}${split}${phoneNumber.substring(split1, split2)}${split}${phoneNumber.substring(split2, 10)}`;
};

export const splitStr = (str, split = '', splits = [], reverse = false) => {
  if (!['string', 'number'].includes(typeof str)) return '';

  let res = [];
  let s = str
    .toString()
    .split('')
    .filter((c) => c !== split);
  (reverse ? s.reverse() : s).forEach((c, i) => {
    if (splits.includes(i)) res.push(split);
    res.push(c);
  });
  return (reverse ? res.reverse() : res).join('');
};

export const splitMoney = (str) => splitStr(str || '', '.', MONEY_SPLITS, true);
export const removeSplit = (str, split) => {
  if (!str) return;

  return str
    .toString()
    .split('')
    .filter((c) => c !== split)
    .join('');
};

export const removeSplitObj = (obj, split) => {
  const res = {};
  Object.keys(obj).forEach((key) => (res[key] = removeSplit(obj[key], split)));
  return res;
};
