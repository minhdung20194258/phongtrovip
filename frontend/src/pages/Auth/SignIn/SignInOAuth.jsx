import AppSeperateText from '@/components/Polaries/Seperate/AppSeperateText.jsx';
import AppButton from '@/components/Button/AppButton.jsx';
import {IconFacbebook, IconGoogle} from '@/components/Icons/AppIcon.jsx';
import {NavLink} from 'react-router-dom';
import PropTypes from 'prop-types';

SignInOAuth.propTypes = {
  children: PropTypes.any,
};

function SignInOAuth({children}) {
  return (
    <>
      <AppSeperateText className="pt-12 pb-12" text="Hoặc đăng nhập với" />
      <div className="d-flex-col gap-8 pt-12 pb-12">
        <AppButton
          type="border"
          text="Google"
          className="w-full jc-c zoom"
          size={'lg'}
          icon={() => IconGoogle({className: 'mr-8'})}
          onClick={() => {
            window.open(`${import.meta.env.VITE_BACKEND_URL || ''}/api/v1/users/auth/google`);
          }}
        />
        {/*<AppButton*/}
        {/*  type="border"*/}
        {/*  text="Facebook"*/}
        {/*  className="w-full jc-c zoom"*/}
        {/*  size={'lg'}*/}
        {/*  icon={() => IconFacbebook({className: 'mr-8'})}*/}
        {/*/>*/}
      </div>
      {children && (
        <>
          <AppSeperateText />
          {children}
        </>
      )}
      <div className="d-flex-col ai-c jc-c pt-12 pb-12 fs-11">
        Bằng việc đăng nhập, tôi đồng ý với các
        <div className="fs-11" style={{whiteSpace: 'nowrap'}}>
          <NavLink to={'/terms'} className="NavLink sm">
            Điều khoản sử dụng
          </NavLink>
          &nbsp;và&nbsp;
          <NavLink to={'/policy'} className="NavLink sm">
            Chính sách bảo mật&nbsp;
          </NavLink>
          của PHONGTROVIP
        </div>
      </div>
    </>
  );
}

export default SignInOAuth;
