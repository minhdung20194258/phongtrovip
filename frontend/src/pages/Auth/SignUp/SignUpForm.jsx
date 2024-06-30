import AppInput from '@/components/Input/AppInput';
import PropTypes from 'prop-types';
import MDEditor from '@uiw/react-md-editor';
import MDEditorLite from 'react-markdown-editor-lite';
import AppBadge from '../../../components/Polaries/Badge/AppBadge.jsx';
import clsx from 'clsx';
import {AppCombobox} from '@/components/index.jsx';
import {roleOptions} from '@/const/options/adminOption.js';
import {splitMoney} from '@/helper/formats.js';

function SignUpForm({
  user = {} /**@type {Users}*/,
  handleChange = (_, __) => {},
  validations = {},
  children,
  errorBE,
  isAdmin = false,
  isStaff = false,
}) {
  return (
    <>
      <div className="d-flex-col pt-12 pb-12">
        <AppInput
          label="Họ và tên"
          placeholder="Họ và tên"
          size={'lg'}
          value={user.fullName}
          onChange={(val) => handleChange('fullName', val)}
          errorMess={validations.fullName}
        />
        <AppInput
          label="Email"
          placeholder="Email"
          size={'lg'}
          value={user.email}
          onChange={(val) => handleChange('email', val)}
          errorMess={validations.email}
        />
        {!user._id && (
          <>
            <AppInput
              label="Mật khẩu"
              placeholder="Mật khẩu"
              size={'lg'}
              type="password"
              value={user.password}
              onChange={(val) => handleChange('password', val)}
              errorMess={validations.password}
            />
            <AppInput
              label="Xác nhận mật khẩu"
              placeholder="Xác nhận mật khẩu"
              size={'lg'}
              type="password"
              value={user.confirmPassword}
              onChange={(val) => handleChange('confirmPassword', val)}
              errorMess={validations.confirmPassword}
            />
          </>
        )}
        {user._id && (
          <>
            <div className="fw-600 mb-8">Giới thiệu bản thân</div>
            <MDEditorLite
              view={{html: false}}
              canView={{fullScreen: false}}
              allowPasteImage={true}
              style={{minHeight: '300px', maxHeight: '600px'}}
              renderHTML={(text) => <MDEditor.Markdown source={text} />}
              value={user.description}
              onChange={({text}) => handleChange('description', text)}
              className={clsx({'bd-color-red-500': validations.description, 'mb-16': true})}
            />
            <div className="color-error">{validations.description}</div>
          </>
        )}
        {isAdmin && (
          <AppCombobox
            label="Role"
            options={roleOptions}
            selected={user.role}
            onSelected={(val) => handleChange('role', val)}
          />
        )}
        {(isAdmin || isStaff) && (
          <AppInput
            label="Chỉnh số dư tài khoản"
            placeholder="Số dư tài khoản"
            size={'lg'}
            type="number"
            value={splitMoney(user.amountBalance) || '0'}
            onChange={(val) => handleChange('amountBalance', val)}
            errorMess={validations.amountBalance}
            maxLength={12}
            suffix="đ"
          />
        )}
        {errorBE && (
          <AppBadge tone="error" fullWidth={true} className="mt-12" size={'lg'}>
            {errorBE}
          </AppBadge>
        )}
      </div>

      {children}
    </>
  );
}

SignUpForm.propTypes = {
  user: PropTypes.object,
  handleChange: PropTypes.func,
  validations: PropTypes.object,
  children: PropTypes.any,
  isAdmin: PropTypes.bool,
  isStaff: PropTypes.bool,
  errorBE: PropTypes.string,
};

export default SignUpForm;
