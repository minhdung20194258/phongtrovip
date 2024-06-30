import {changePassword} from '@/config/validations/authValidations.js';
import useEditApi from '@/hooks/api/useEditApi.jsx';
import useChangePasswordForm from '@/pages/Auth/ChangePassword/useChangePasswordForm.jsx';
import useInputValidations from '@/hooks/form/useInputValidations.jsx';

useChangePassword.propTypes = {};

const initialState = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
};

function useChangePassword() {
  const {
    input,
    handleChange: handleChange,
    setInput: setPassword,
    validations,
    handleValidations,
    setValidations,
  } = useInputValidations({
    initialState,
    configRules: changePassword,
  });
  const {editing, handleEdit, errorBE, setErrorBE} = useEditApi({
    url: `users/password`,
  });
  const handleSave = () => {
    if (!handleValidations()) return;
    return handleEdit({
      newPassword: input.newPassword,
      password: input.oldPassword,
    });
  };

  const {open, modal, closeModal, openModal} = useChangePasswordForm({
    input,
    editing,
    handleClose: () => () => {
      setErrorBE('');
      setPassword(initialState);
      setValidations({});
    },
    handleChange,
    handleSave,
    validations,
    errorBE,
  });

  return {open, modal, closeModal, openModal};
}

export default useChangePassword;
