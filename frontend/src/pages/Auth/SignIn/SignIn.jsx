import {NavLink} from 'react-router-dom';
import {useState} from 'react';
import clsx from 'clsx';
import AppButton from '@/components/Button/AppButton';
import {IconUnlock} from '@/components/Icons/AppIcon.jsx';
import SignInPhoneNumber from '@/pages/Auth/SignIn/SignInPhoneNumber.jsx';
import SignInEmail from '@/pages/Auth/SignIn/SignInEmail.jsx';
import SignInOAuth from '@/pages/Auth/SignIn/SignInOAuth.jsx';
import AppContainer from '@/components/Polaries/Contaner/AppContainer.jsx';
import AppCard from '@/components/Polaries/Card/AppCard.jsx';
import PropTypes from 'prop-types';

function SignIn({children}) {
  const [typeSignIn, setTypeSignIn] = useState('email');

  return (
    <AppContainer className="App-AuthPage">
      <AppCard className="AuthPage__Card">
        {children}
        <div className="mt-16 mb-16">
          <div className="h-txt-24 fw-600">Đăng nhập</div>
          <div>Để bảo mật, vui lòng đăng nhập để truy cập thông tin của bạn</div>
        </div>
        {/*<div className="d-flex jc-sb pb-12">*/}
        {/*  <AppButton*/}
        {/*    text="EMAIL"*/}
        {/*    type="tab"*/}
        {/*    className={clsx({*/}
        {/*      'w-full': true,*/}
        {/*      active: typeSignIn === 'email',*/}
        {/*    })}*/}
        {/*    onClick={() => setTypeSignIn('email')}*/}
        {/*  />*/}
        {/*  <AppButton*/}
        {/*    text="MOBILE"*/}
        {/*    type="tab"*/}
        {/*    className={clsx({*/}
        {/*      'w-full': true,*/}
        {/*      active: typeSignIn === 'mobile',*/}
        {/*    })}*/}
        {/*    onClick={() => setTypeSignIn('mobile')}*/}
        {/*  />*/}
        {/*</div>*/}
        {/*{typeSignIn === 'mobile' && <SignInPhoneNumber />}*/}
        {typeSignIn === 'email' && <SignInEmail />}
        <div className="d-flex jc-sb pt-12 pb-12">
          <NavLink to="/sign-up" className="NavLink">
            Tạo mới tài khoản
          </NavLink>
          <NavLink to="/forgot-pass" className="NavLink d-flex ai-c">
            <IconUnlock className="fs-12 color-700" />
            Quên mật khẩu?
          </NavLink>
        </div>
        <SignInOAuth />
      </AppCard>
    </AppContainer>
  );
}

SignIn.propTypes = {
  children: PropTypes.any,
};

export default SignIn;
