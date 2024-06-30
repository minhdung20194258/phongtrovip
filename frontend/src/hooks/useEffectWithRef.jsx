import {useCallback} from 'react';

function useEffectWithRef(handleDOM = (_) => {}) {
  return useCallback(
    (node) => {
      if (!node) return;

      handleDOM(node);
    },
    [handleDOM],
  );
}

export default useEffectWithRef;
