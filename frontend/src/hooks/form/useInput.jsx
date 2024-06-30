import {useCallback, useState} from 'react';

/**
 * @param initialState
 * @return {{input: {object}, handleChange: (function(*, *): void), setInput: (value: any) => void}}
 */
export default function useInput(initialState = null) {
  const [input, setInput] = useState(initialState);

  const handleChange = useCallback(
    (key, value) =>
      setInput((prev) => ({
        ...prev,
        [key]: value,
      })),
    [],
  );
  const resetInput = useCallback(() => setInput(initialState), [initialState]);

  return {input, handleChange, setInput, resetInput};
}
