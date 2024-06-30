import {useState} from 'react';
import {AppButton, AppCard, AppContainer, AppInput} from '@/components/index.jsx';
import {removeSplit, splitMoney} from '@/helper/formats.js';
import {useSelector} from 'react-redux';
import {getUser} from '@/reducers/authSlice.js';
import './Payment.scss';
import {IconPiggyBank} from '@/components/Icons/AppIcon.jsx';
import {paymentOptions} from '@/const/options/paymentOptions.js';

Payment.propTypes = {};

function Payment() {
  const [balance, setBalance] = useState('');
  const user = useSelector(getUser);

  const handleVnpay = () => {
    const amount = removeSplit(balance, '.');
    if (parseInt(amount) < 10000 || !balance) return;
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/v1/payments/vnpay/${user._id}?amount=${amount}&orderInfo=napthe`;
    window.open(url);
  };

  return (
    <AppContainer className="d-flex-col ai-c">
      <div className="d-flex-col ai-c mb-48">
        <div className="d-flex ai-c gap-8">
          <IconPiggyBank />
          <div className="fw-700 fs-20">Số dư hiện tại của bạn</div>
        </div>
        <div className="color-500 fw-700 fs-20">{splitMoney(user.amountBalance) || 0}đ</div>
        <div className="color-grey-600 fs-13 fw-500 mt-8">
          Hãy đảm bảo số dư tài khoản luôn đủ để sử dụng dịch vụ của chúng tôi.
        </div>
      </div>
      <AppCard className="App-Payment">
        <AppInput
          value={splitMoney(balance)}
          onChange={(val) => setBalance(splitMoney(val))}
          label="Số tiền thanh toán"
          type="number"
          placeholder="VD: 50.000đ"
          suffix="đ"
          maxLength={12}
        />
        <div className="d-flex gap-8 mb-48">
          {paymentOptions.map((item, index) => (
            <AppButton
              text={splitMoney(item)}
              key={index}
              onClick={() => setBalance(splitMoney(item))}
            />
          ))}
        </div>
        <div className="fw-500 mb-8">Thanh toán qua tài khoản</div>
        <AppButton type="border" fullWidth={true} className="pt-4 pb-4" onClick={handleVnpay}>
          <img
            src="https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg"
            alt=""
            className="h-28 w-100"
          />
        </AppButton>
      </AppCard>
    </AppContainer>
  );
}

export default Payment;
