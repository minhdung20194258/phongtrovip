import PropTypes from 'prop-types';
import AppInput from '@/components/Input/AppInput.jsx';
import AppButton from '@/components/Button/AppButton.jsx';
import {forgotPasswordStep1} from '@/config/validations/authValidations.js';
import useEditApi from '@/hooks/api/useEditApi.jsx';
import AppBadge from '@/components/Polaries/Badge/AppBadge.jsx';
import useInputValidations from '@/hooks/form/useInputValidations.jsx';

Step1.propTypes = {
  setStep: PropTypes.func,
  setEmail: PropTypes.func,
};

function Step1({setStep, setEmail}) {
  const {input, handleChange, validations, handleValidations} = useInputValidations({
    initialState: {email: 'minhdungit2001@gmail.com'},
    configRules: forgotPasswordStep1,
  });
  console.log({input});

  const {editing, handleEdit, errorBE} = useEditApi({
    url: '/users/forgot-pass/email',
    useToast: false,
  });

  const handleNext = async () => {
    setEmail(input.email);
    if (!handleValidations()) return;

    const resp = await handleEdit(input);
    if (resp) {
      setStep(1);
    }
  };

  return (
    <>
      <div className="mt-16 mb-16">
        <div className="h-txt-24 fw-600">Quên mật khẩu</div>
        <div>Vui lòng nhập email để tìm kiếm tài khoản của bạn.</div>
      </div>

      <div className="d-flex">
        <AppInput
          label="Email"
          size="lg"
          value={input.email}
          onChange={(val) => handleChange('email', val)}
          errorMess={validations.email}
          className="w-full"
        />
      </div>

      <div className="d-flex-col pb-12 pt-12 gap-12">
        {errorBE && (
          <AppBadge tone="error" fullWidth={true}>
            {errorBE}
          </AppBadge>
        )}
        <AppButton
          text="Tiếp theo"
          className="w-full active"
          size="lg"
          onClick={handleNext}
          loading={editing}
        />
      </div>
    </>
  );
}

export default Step1;
