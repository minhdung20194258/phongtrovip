export const getQuery = ({name = '', defaultValue = '', isInt = false, isObject = false}) => {
  const urlParams = new URLSearchParams(decodeURI(window.location.search));

  if (isObject && typeof defaultValue === 'object' && defaultValue !== null) {
    const initValue = {};
    Object.keys(defaultValue).forEach((key) => {
      initValue[key] = getQuery({
        name: name?.[key] ?? key,
        defaultValue: defaultValue[key],
      });
    });
    return initValue;
  }

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

export const isDeleteQuery = (newValue, defaultValue) => {
  if (newValue === null) {
    return true;
  }
  if (typeof newValue !== 'object') {
    return newValue === defaultValue;
  }
  return JSON.stringify(newValue) === JSON.stringify(defaultValue);
};

export const addQuery = ({urlParams, name, value}) => {
  if (typeof value === 'object') {
    return urlParams.set(name, JSON.stringify(value));
  }
  return urlParams.set(name, value);
};
