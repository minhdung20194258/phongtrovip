/**
 * @param name
 * @param defaultValue
 * @param isInt
 * @return {number|any|string}
 */
export const getSearch = ({name = '', defaultValue = '', isInt = false}) => {
  const urlParams = new URLSearchParams(decodeURI(window.location.search));

  const value = urlParams.get(name);
  if (!value) {
    return defaultValue;
  }
  if (typeof defaultValue === 'object' && defaultValue !== null) {
    return JSON.parse(value);
  }
  if (isInt) {
    return parseInt(value);
  }
  return value;
};

/**
 * Check empty or equal default values for delete query param
 * @param {any} newValue
 * @param {any} defaultValue
 * @returns {boolean}
 */
export const isDeleteSearch = (newValue, defaultValue) => {
  if (newValue === null) {
    return true;
  }
  if (typeof newValue !== 'object') {
    return newValue === defaultValue;
  }
  return JSON.stringify(newValue) === JSON.stringify(defaultValue);
};

/**
 * Set primary values for param
 * @param {{urlParams: URLSearchParams, name: string, value: any}}
 */
export const addSearch = ({urlParams, name, value}) => {
  if (typeof value === 'object') {
    return urlParams.set(name, JSON.stringify(value));
  }
  return urlParams.set(name, value);
};
