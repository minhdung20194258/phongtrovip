import PropTypes from 'prop-types';
import {otpValid} from '@/config/validations/authValidations.js';
import AppInput from '@/components/Input/AppInput.jsx';
import AppButton from '@/components/Button/AppButton.jsx';
import useEditApi from '@/hooks/api/useEditApi.jsx';
import {updateAxiosAccessToken} from '@/helper/clientApi.js';
import AppBadge from '@/components/Polaries/Badge/AppBadge.jsx';
import useInputValidations from '@/hooks/form/useInputValidations.jsx';

Step2.propTypes = {
  email: PropTypes.string,
  setStep: PropTypes.func,
};

function Step2({email, setStep}) {
  const {input, handleChange, validations, handleValidations} = useInputValidations({
    initialState: {validation: ''},
    configRules: otpValid,
  });
  const {editing, handleEdit, errorBE} = useEditApi({
    url: '/users/forgot-pass/otp',
    useToast: false,
    fullResp: true,
  });
  const handleVerification = async () => {
    if (!handleValidations()) {
      return;
    }

    const resp = await handleEdit({
      email,
      validation: input.validation,
    });

    if (resp.success) {
      updateAxiosAccessToken(resp.accessToken);
      setStep(2);
    }
  };

  return (
    <>
      <div className="mt-16 mb-16">
        <div className="h-txt-24 fw-600">Quên mật khẩu</div>
        <div>Chúng tôi vừa gửi mã otp tới {email}, xin hãy nhập lại mã otp.</div>
      </div>
      <AppInput
        label="Mã xác thực OTP"
        placeholder="Mã xác thực OTP"
        size="lg"
        value={input.validation}
        onChange={(val) => handleChange('validation', val)}
        errorMess={validations.validation}
        className="w-full pl-4"
        type="number"
        maxLength={6}
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

export default Step2;
