import {useEffect} from 'react';
import AppInput from '@/components/Input/AppInput.jsx';
import AppButton from '@/components/Button/AppButton.jsx';
import {signInEmailValid} from '@/config/validations/authValidations.js';
import {useDispatch, useSelector} from 'react-redux';
import {
  getErrorBE,
  getLoadingInitUser,
  getLoadingSignIn,
  resetErrorBE,
  thunkSignIn,
} from '@/reducers/authSlice.js';
import AppBadge from '@/components/Polaries/Badge/AppBadge.jsx';
import {useNavigate} from 'react-router-dom';
import useKeyboard from '@/hooks/useKeyboard.jsx';
import useInputValidations from '@/hooks/form/useInputValidations.jsx';

SignInEmail.propTypes = {};

function SignInEmail() {
  const {
    input: user,
    handleChange: handleChangeUser,
    validations,
    handleValidations,
  } = useInputValidations({
    initialState: {
      email: 'check@gmail.com',
      password: '123456',
    },
    configRules: signInEmailValid,
  });

  const dispatch = useDispatch();
  const errorBE = useSelector(getErrorBE);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    if (!handleValidations()) return;

    const resp = await dispatch(thunkSignIn(user));
    if (!resp?.payload?.success) return;
    if (resp?.payload?.data.role === 'staff') navigate('/admin?type=accounts');
    if (resp?.payload?.data.role === 'admin') navigate('/admin?type=accounts-staff');
  };

  const loading = useSelector(getLoadingSignIn);

  useKeyboard({
    Enter: handleSignIn,
  });

  useEffect(() => {
    dispatch(resetErrorBE());
  }, [user, dispatch]);

  return (
    <>
      <div className="d-flex-col pt-12 pb-12">
        <AppInput
          label="Email"
          placeholder="Email"
          size="lg"
          value={user.email}
          onChange={(val) => handleChangeUser('email', val)}
          errorMess={validations.email}
        />
        <AppInput
          label="Mật khẩu"
          placeholder="Mật khẩu"
          size="lg"
          value={user.password}
          onChange={(val) => handleChangeUser('password', val)}
          errorMess={validations.password}
          type="password"
        />
      </div>
      <div className="d-flex-col pb-12 gap-8">
        {errorBE && (
          <AppBadge tone="error" fullWidth={true} size="lg">
            {errorBE}
          </AppBadge>
        )}
        <AppButton
          text="Đăng nhập"
          className="w-full active"
          size="lg"
          onClick={handleSignIn}
          loading={loading}
        />
      </div>
    </>
  );
}

export default SignInEmail;
