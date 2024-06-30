import {useState} from 'react';
import AppContainer from '@/components/Polaries/Contaner/AppContainer.jsx';
import AppCard from '@/components/Polaries/Card/AppCard.jsx';
import {NavLink} from 'react-router-dom';
import Step1 from '@/pages/Auth/ForgotPassword/Step1.jsx';
import Step2 from '@/pages/Auth/ForgotPassword/Step2.jsx';
import Step3 from '@/pages/Auth/ForgotPassword/Step3.jsx';

ForgotPassword.propTypes = {};

function ForgotPassword() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');

  return (
    <AppContainer className="App-AuthPage">
      <AppCard className="AuthPage__Card">
        {step === 0 && <Step1 setStep={setStep} setEmail={setEmail} />}
        {step === 1 && <Step2 email={email} setStep={setStep} />}
        {step === 2 && <Step3 email={email} />}

        <div className="d-flex jc-sb pt-12 pb-12">
          <NavLink to="/sign-up" className="NavLink">
            Tạo mới tài khoản
          </NavLink>
          <NavLink to="/sign-in" className="NavLink d-flex ai-c">
            Bạn đã có tài khoản? Đăng nhập.
          </NavLink>
        </div>
      </AppCard>
    </AppContainer>
  );
}

export default ForgotPassword;
