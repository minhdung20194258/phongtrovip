import {union, keys, filter, pick} from 'lodash';

export const trim = (value) => {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number') return value + '';

  return value;
};

/**
 * @param {number} seconds
 * @returns {Promise}
 */
export const delay = (seconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
};

export const getChangedKeys = (o1, o2) => {
  const keyUnion = union(keys(o1), keys(o2));
  return filter(keyUnion, function (key) {
    return o1[key] !== o2[key];
  });
};

export const getChangedValue = (newObj, obj, addFields = []) => {
  return {...pick(newObj, getChangedKeys(obj, newObj)), ...pick(newObj, addFields)};
};

export const getChangedArray = (newArr, oldArr, key = 'id') => {
  const result = [];

  newArr.forEach((newA) => {
    const matchOld = oldArr.find((oldA) => oldA[key] === newA[key]);
    const changeKeys = getChangedKeys(newA, matchOld);
    if (changeKeys.length) {
      result.push({...pick(newA, changeKeys), [key]: newA[key]});
    }
  });

  return result;
};

export const filterChangedArray = (newArr, oldArr, key = 'id') => {
  return newArr.filter((newA) => {
    const matchOld = oldArr.find((oldA) => oldA[key] === newA[key]);
    const changeKeys = getChangedKeys(newA, matchOld);
    return !!changeKeys.length;
  });
};
