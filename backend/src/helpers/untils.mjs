import pkg from 'lodash';
const {filter, keys, union} = pkg;
/**
 * @param {Object} data
 * @param {string[]} fields
 * @returns {Object}
 */
export const pick = (data, fields) => {
  const pickData = {};

  for (const key in data) {
    if (fields.includes(key)) {
      if (typeof data[key] === 'string') {
        pickData[key] = data[key].trim();
      } else {
        pickData[key] = data[key];
      }
    }
  }

  return pickData;
};

/**
 * @param {Object} data
 * @param {string[]} fields
 * @returns {Object}
 */
export const remove = (data, fields) => {
  const result = {...data};
  fields.forEach((field) => delete result[field]);
  return result;
};

export const trim = (data) => {
  const trimData = {};
  for (const key in data) {
    if (typeof data[key] === 'string') {
      trimData[key] = data[key].trim();
    } else {
      trimData[key] = data[key];
    }
  }

  return trimData;
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

export const convertSort = (orderBy) => {
  if (orderBy === 'desc') return -1;
  if (orderBy === 'asc') return 1;

  return -1;
};

export const getChangedKeys = (o1, o2) => {
  const keyUnion = union(keys(o1), keys(o2));
  return filter(keyUnion, function (key) {
    return o1[key] !== o2[key];
  });
};

export const getChangedValue = (newObj, obj) => {
  return pick(newObj, getChangedKeys(obj, newObj));
};
