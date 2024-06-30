import {AppLoading, AppSuccessInfo} from '@/components/index.jsx';
import {useLocation, useParams} from 'react-router-dom';
import {splitStr} from '@/helper/formats.js';
import {MONEY_SPLITS} from '@/const/money.js';
import {IconCricleXmark} from '@/components/Icons/AppIcon.jsx';

PaymentStatus.propTypes = {};

function PaymentStatus() {
  const location = useLocation();
  const params = useParams();
  const urlParams = new URLSearchParams(location.search);

  switch (params.status) {
    case 'waiting':
      return (
        <div className="w-full h-600 d-flex-col ai-c jc-c">
          <AppLoading className="w-64 h-64" />
          <div className="fw-700 fs-20">Đang xử lý</div>
        </div>
      );
    case 'error':
      return (
        <div className="w-full h-600 d-flex-col ai-c jc-c">
          <IconCricleXmark className="w-200 h-200" />
          <div className="fw-700 fs-20">Giao dịch thất bại</div>
        </div>
      );

    case 'success':
    default:
      return (
        <div className="w-full h-600 d-center">
          <AppSuccessInfo>
            <div className="d-flex gap-4 fs-16 ai-c">
              <div>Bạn vừa nạp thành công</div>
              <div style={{color: '#ffb300', fontSize: '20px'}}>
                {splitStr(urlParams.get('amount'), '.', MONEY_SPLITS, true) + 'đ'}
              </div>
              <div> vào tài khoản</div>
            </div>
          </AppSuccessInfo>
        </div>
      );
  }
}

export default PaymentStatus;
