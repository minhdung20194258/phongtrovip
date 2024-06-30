import {useEffect} from 'react';

useKeyboard.propTypes = {};

/**
 * @param listeners {{[keyboard: string]: function}}
 * @param ref
 */
function useKeyboard(listeners, ref = {}) {
  useEffect(() => {
    const elementListener = ref?.current ? ref.current : document;

    const eventListener = (event) => {
      Object.keys(listeners).forEach((key) => {
        if (event.key === key) {
          return typeof listeners[key] === 'function' ? listeners[key]() : null;
        }
      });
    };

    elementListener.addEventListener('keydown', eventListener, {passive: true});
    return () => {
      elementListener.removeEventListener('keydown', eventListener);
    };
  }, [listeners]); // Not ref
}

export default useKeyboard;
