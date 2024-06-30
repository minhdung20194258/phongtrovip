import PropTypes from 'prop-types';
import useInputValidations from '@/hooks/form/useInputValidations.jsx';
import {otpValid} from '@/config/validations/authValidations.js';
import useEditApi from '@/hooks/api/useEditApi.jsx';
import AppInput from '../../../components/Input/AppInput.jsx';
import AppBadge from '../../../components/Polaries/Badge/AppBadge.jsx';
import {useSelector} from 'react-redux';
import {getUser} from '@/reducers/authSlice.js';
import useModal from '@/hooks/modal/useModal.jsx';

usePostItemDetailDepositOTP.propTypes = {
  post: PropTypes.object.isRequired,
  setPost: PropTypes.func.isRequired,
};

function usePostItemDetailDepositOTP({post = {} /** @type {PostsExtend}*/, setPost = () => {}}) {
  const user = useSelector(getUser);
  const {input, handleChange, validations, handleValidations} = useInputValidations({
    initialState: {validation: ''},
    configRules: otpValid,
  });
  const {editing, handleEdit, errorBE} = useEditApi({
    url: `/posts/deposit/verify/${post._id}`,
    useToast: false,
  });
  const handleVerification = async () => {
    if (!handleValidations()) {
      return;
    }
    const resp = await handleEdit({
      validation: input.validation,
    });
    if (!resp) return;
    setPost((prev) => ({...prev, isHasDeposit: true}));
  };

  const {modal, openModal} = useModal({
    type: 'xs',
    primaryAction: {
      onAction: handleVerification,
      loading: editing,
    },
    content: (
      <>
        <div className="mt-16 mb-16">
          <div className="h-txt-24 fw-600">Xác nhận</div>
          <div>Chúng tôi vừa gửi mã otp tới {user.email}, xin hãy nhập lại mã otp.</div>
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
          {/*<AppButton*/}
          {/*  text="Xác nhận"*/}
          {/*  className="w-full active"*/}
          {/*  size="lg"*/}
          {/*  onClick={handleVerification}*/}
          {/*  loading={editing}*/}
          {/*/>*/}
        </div>
      </>
    ),
  });

  return {modal, openModal};
}

export default usePostItemDetailDepositOTP;
