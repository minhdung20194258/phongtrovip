import {isEmpty, pick} from 'lodash';
import useCreateApi from '@/hooks/api/useCreateApi.jsx';
import useModal from '@/hooks/modal/useModal.jsx';
import SignUpForm from '@/pages/Auth/SignUp/SignUpForm.jsx';
import {signUpValid, userEditValid} from '@/config/validations/authValidations.js';
import {useSelector} from 'react-redux';
import {getIsAdmin, getIsStaff} from '@/reducers/authSlice.js';
import {removeSplit} from '@/helper/formats.js';
import {useRef} from 'react';
import {getChangedValue} from '@/helper/untils.js';
import useInputValidations from '@/hooks/form/useInputValidations.jsx';
import useInput from '@/hooks/form/useInput.jsx';
import useValidations from '@/hooks/form/useValidations.jsx';

useAccountForm.propTypes = {};

function useAccountForm(successCallback = () => {}) {
  const initData = useRef({});
  const isAdmin = useSelector(getIsAdmin);
  const isStaff = useSelector(getIsStaff);
  const {input, handleChange, setInput} = useInput({
    fullName: 'Minh',
    email: 'check@gmail.com',
    password: '123456',
    confirmPassword: '123456',
    role: 'default',
  });
  const isEdit = !isEmpty(input) && input._id;
  const {validations, handleValidations, resetValidations} = useValidations(
    isEdit ? userEditValid : signUpValid,
  );

  const {creating, handleCreate, errorBE, setErrorBE} = useCreateApi({
    url: '/admin/users',
    successMsg: isEdit ? 'Chỉnh sửa thành công' : 'Tạo mới thành công',
    successCallback,
  });

  const handleSignUp = async () => {
    if (!handleValidations()) return;
    const fields = [
      'email',
      'password',
      'fullName',
      '_id',
      'description',
      'amountBalance',
      isAdmin && 'role',
    ].filter(Boolean);
    const docUser = {
      ...pick(input, fields),
      amountBalance: removeSplit(input.amountBalance || '', '.'),
    };

    await handleCreate({...getChangedValue(docUser, initData.current), _id: input._id});
    initData.current = input;
    setErrorBE('');
  };
  const {modal, openModal} = useModal({
    header: isEdit ? 'Chỉnh sửa' : 'Thêm mới',
    content: (
      <SignUpForm
        user={input}
        validations={validations}
        handleChange={handleChange}
        handleCreate={handleSignUp}
        creating={creating}
        errorBE={errorBE}
        isAdmin={isAdmin}
        isStaff={isStaff}
      />
    ),
    primaryAction: {
      content: 'Lưu',
      onAction: () => handleSignUp(),
      loading: creating,
    },
    secondaryAction: {
      content: 'Huỷ',
      onAction: () => {
        setInput({});
        initData.current = {};
      },
      loading: creating,
    },
    handleClose: () => {
      setInput({});
      initData.current = {};
      setErrorBE('');
      resetValidations();
    },
  });

  return {
    modal,
    openModal: (userEdit) => {
      setInput(userEdit);
      initData.current = userEdit;
      openModal();
    },
  };
}

export default useAccountForm;
