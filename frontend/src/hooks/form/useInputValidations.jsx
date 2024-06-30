import useInput from '@/hooks/form/useInput.jsx';
import useValidations from '@/hooks/form/useValidations.jsx';

function useInputValidations({initialState = {}, configRules = (_) => ({})}) {
  const {input, handleChange, setInput, resetInput} = useInput(initialState);
  const {validations, handleValidations, setValidations, resetValidations} = useValidations(
    configRules(input),
  );

  return {
    input,
    handleChange,
    setInput,
    resetInput,
    validations,
    handleValidations,
    setValidations,
    resetValidations,
  };
}

export default useInputValidations;
