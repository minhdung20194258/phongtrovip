import {countryPhoneMin} from '@/const/countryPhone.js';
import AppInput from '@/components/Input/AppInput.jsx';
import {signInPhoneValid} from '@/config/validations/authValidations.js';
import AppCombobox from '@/components/Combobox/AppCombobox.jsx';
import AppButton from '@/components/Button/AppButton.jsx';
import {useDispatch, useSelector} from 'react-redux';
import {getErrorBE, resetErrorBE} from '@/reducers/authSlice.js';
import {useEffect, useState} from 'react';
import AppBadge from '@/components/Polaries/Badge/AppBadge.jsx';
import {splitStr} from '@/helper/formats.js';
import useInputValidations from '@/hooks/form/useInputValidations.jsx';

SignInPhoneNumber.propTypes = {};

function SignInPhoneNumber() {
  const {input, handleChange, validations, handleValidations} = useInputValidations({
    initialState: {
      mobile: {},
      phone: '',
      otp: '',
    },
    configRules: signInPhoneValid,
  });

  const [isTyping, setIsTyping] = useState(true);
  const dispatch = useDispatch();
  const errorBE = useSelector(getErrorBE);

  const handleNext = async () => {
    if (!handleValidations()) return;
    setIsTyping(false);
  };
  const handleSignIn = async () => {};

  useEffect(() => {
    dispatch(resetErrorBE());
  }, [input, dispatch]);
  return (
    <>
      {isTyping && (
        <div className="d-flex">
          <AppCombobox
            selected={input.mobile}
            options={countryPhoneMin.map((country) => ({
              value: country.phone,
              label: country.phone,
              labelOption: `${country.name} (${country.phone})`,
              prefix: <img src={country.image} alt={''}></img>,
            }))}
            onSelected={(selected) => handleChange('mobile', selected)}
            label="Mobile number"
            size="lg"
            className="w-200"
            placeholder="Dial code"
            errorMess={validations.mobile}
          />
          <AppInput
            labelHidden={true}
            placeholder="Mobile number"
            size="lg"
            value={splitStr(input.phone, ' ', [3, 6, 4])}
            onChange={(val) => handleChange('phone', val)}
            errorMess={validations.phone}
            className="w-full pl-4"
            maxLength={15}
          />
        </div>
      )}
      {!isTyping && (
        <AppInput
          label="OTP verification code"
          placeholder="OTP verification code"
          size="lg"
          value={input.otp}
          onChange={(val) => handleChange('otp', val)}
          errorMess={validations.otp}
          className="w-full pl-4"
          type="number"
          maxLength={6}
        />
      )}
      <div className="d-flex-col pb-12 pt-12 gap-12">
        {errorBE && <AppBadge tone="error">{errorBE}</AppBadge>}
        <AppButton
          text={isTyping ? 'Next' : 'Sign in'}
          className="w-full active"
          size="lg"
          onClick={isTyping ? handleNext : handleSignIn}
        />
      </div>
    </>
  );
}

export default SignInPhoneNumber;
