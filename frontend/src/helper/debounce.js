/**
 * @param func
 * @param ms
 * @return {function}
 */
export function debounce(func, ms = 1000) {
  let timer;
  return function (...args) {
    const context = this;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      timer = null;
      func.apply(context, args);
    }, ms);
  };
}
