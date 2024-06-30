import AppButton from '@/components/Button/AppButton';
import {signUpValid} from '@/config/validations/authValidations.js';
import SignInOAuth from '@/pages/Auth/SignIn/SignInOAuth.jsx';
import useCreateApi from '@/hooks/api/useCreateApi.jsx';
import {delay, pick} from 'lodash';
import {useNavigate} from 'react-router-dom';
import SignUpForm from '@/pages/Auth/SignUp/SignUpForm.jsx';
import {AppCard, AppContainer} from '@/components/index.jsx';
import useInputValidations from '@/hooks/form/useInputValidations.jsx';

function SignUp() {
  const navigate = useNavigate();
  const {
    input: user,
    handleChange: handleChangeUser,
    validations,
    handleValidations,
  } = useInputValidations({
    initialState: {
      fullName: 'Minh',
      email: 'check@gmail.com',
      password: '123456',
      confirmPassword: '123456',
    },
    configRules: signUpValid,
  });
  const {creating, handleCreate, errorBE, setErrorBE} = useCreateApi({
    url: '/users/auth/sign-up/local',
  });

  const handleSignUp = async () => {
    if (!handleValidations()) return;
    const resp = await handleCreate(pick(user, ['email', 'password', 'fullName']));
    if (!resp) return;
    setErrorBE('');
    delay(() => navigate('/sign-in'), 1000);
  };

  return (
    <AppContainer className="App-AuthPage">
      <AppCard className="AuthPage__Card">
        <div className="h-txt-24 fw-600 mt-16 mb-16">Đăng ký</div>
        <SignUpForm
          user={user}
          validations={validations}
          handleChange={handleChangeUser}
          handleCreate={handleSignUp}
          creating={creating}
          errorBE={errorBE}
        />
        <AppButton
          text="Đăng ký"
          className="w-full active mt-12 mb-12"
          size={'lg'}
          onClick={handleSignUp}
          loading={creating}
        />
        <SignInOAuth>
          <AppButton
            type="border-1"
            text="Bạn đã có tài khoản? Đăng nhập."
            url="/sign-in"
            className="w-full jc-c mb-12 mt-12"
            size={'lg'}
          />
        </SignInOAuth>
      </AppCard>
    </AppContainer>
  );
}

SignUp.propTypes = {};

export default SignUp;
