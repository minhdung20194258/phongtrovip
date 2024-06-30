import PropTypes from 'prop-types';
import {forgotPasswordStep3} from '@/config/validations/authValidations.js';
import AppInput from '@/components/Input/AppInput.jsx';
import AppButton from '@/components/Button/AppButton.jsx';
import useEditApi from '@/hooks/api/useEditApi.jsx';
import {useNavigate} from 'react-router-dom';
import AppBadge from '@/components/Polaries/Badge/AppBadge.jsx';
import useInputValidations from '@/hooks/form/useInputValidations.jsx';

Step3.propTypes = {
  email: PropTypes.string,
};

// TODO loi chua watcher khi cai field password thay doi ma confirmpassword khong thay doi
function Step3({email}) {
  const {input, handleChange, validations, handleValidations} = useInputValidations({
    initialState: {
      newPassword: '',
      confirmPassword: '',
    },
    configRules: forgotPasswordStep3,
  });
  const {editing, handleEdit, errorBE} = useEditApi({
    url: '/users/forgot-pass/change',
    useToast: true,
  });
  const navigate = useNavigate();
  const handleVerification = async () => {
    if (!handleValidations()) {
      return;
    }
    const resp = await handleEdit({
      email,
      password: input.newPassword,
    });
    if (resp) {
      navigate('/sign-in');
    }
  };

  return (
    <>
      <div className="mt-16 mb-16">
        <div className="h-txt-24 fw-600">Quên mật khẩu</div>
        <div>Tạo mật khẩu mới</div>
      </div>
      <AppInput
        label="Mật khẩu"
        placeholder="Mật khẩu"
        size={'lg'}
        type="password"
        value={input.newPassword}
        onChange={(val) => handleChange('newPassword', val)}
        errorMess={validations.newPassword}
      />
      <AppInput
        label="Xác nhận mật khẩu"
        placeholder="Xác nhận mật khẩu"
        size={'lg'}
        type="password"
        value={input.confirmPassword}
        onChange={(val) => handleChange('confirmPassword', val)}
        errorMess={validations.confirmPassword}
      />
      <div className="d-flex-col pb-12 pt-12 gap-12">
        {errorBE && (
          <AppBadge tone="error" fullWidth={true}>
            {errorBE}
          </AppBadge>
        )}
        <AppButton
          text="Xác nhận"
          className="w-full active"
          size="lg"
          onClick={handleVerification}
          loading={editing}
        />
      </div>
    </>
  );
}

export default Step3;
