import {changePasswordAdmin} from '@/config/validations/authValidations.js';
import useEditApi from '@/hooks/api/useEditApi.jsx';
import useChangePasswordForm from '@/pages/Auth/ChangePassword/useChangePasswordForm.jsx';
import {useState} from 'react';
import useInputValidations from '@/hooks/form/useInputValidations.jsx';

useChangePasswordAdmin.propTypes = {};

const initialState = {
  newPassword: '',
  confirmPassword: '',
};

function useChangePasswordAdmin() {
  const [user, setUser] = useState({});
  const {input, handleChange, setInput, validations, handleValidations, setValidations} =
    useInputValidations({initialState, configRules: changePasswordAdmin});
  const {editing, handleEdit, errorBE, setErrorBE} = useEditApi({
    url: '/admin/users',
  });
  const handleSave = () => {
    if (!handleValidations()) return;
    return handleEdit({password: input.newPassword}, user._id);
  };

  const {open, modal, closeModal, openModal} = useChangePasswordForm({
    input,
    editing,
    handleClose: () => () => {
      setErrorBE('');
      setInput(initialState);
      setValidations({});
    },
    handleChange,
    handleSave,
    validations,
    errorBE,
    isAdmin: true,
  });

  return {
    open,
    modal,
    closeModal,
    openModal: (account) => {
      setUser(account);
      openModal();
    },
  };
}

export default useChangePasswordAdmin;
