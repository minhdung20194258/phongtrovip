import {AppBadge, AppButton, AppCard, AppContainer} from '@/components/index.jsx';
import './Plans.scss';
import {plans} from 'backend/const/plans.mjs';
import {IconBadgePlan, IconCheck} from '@/components/Icons/AppIcon.jsx';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {splitMoney} from '@/helper/formats.js';

Plans.propTypes = {
  isModal: PropTypes.bool,
};

function Plans({isModal = false}) {
  return (
    <AppContainer
      className={clsx({
        'App-Plans': true,
        'App-PlansModal': isModal,
      })}
    >
      <div className="Plans__Introduce">
        <div className="fw-700 fs-24">Bảng giá dịch vụ</div>
        <div className="fw-500 color-500 fs-20">
          <span className="fw-700 fs-20">PHONGTROVIP </span>
          xin gửi tới bảng giá dịch vụ của chúng tôi
        </div>
        <div className="fw-500">
          Chúng tôi mong muốn đem lại những dịch vụ trải nghiệm tốt nhất, hoàn hảo nhất tới quý
          khách hàng. Dưới đây là các gói dịch vụ mà <span className="fw-700">PHONGTROVIP </span>
          đang cung cấp. Mong quý khách hàng lựa chọn gói dịch vụ phù hợp với nhu cầu sử dụng của
          bản thân. Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi.
        </div>
      </div>
      <div className="Plans__Info">
        {plans.map((plan) => (
          <AppCard key={plan.id} className="Plans__Info--Item">
            <div className="d-flex-col gap-16">
              <div className="d-center color-500 gap-4">
                <IconBadgePlan className="w-24 h-24" />
                <div className="fw-700 fs-20">{plan.name}</div>
              </div>
              <div>{plan.title}</div>
              <div className="d-flex-col gap-6">
                {plan.features.map((feature, index) => (
                  <div key={index + 'feature'} className="d-flex gap-4">
                    <IconCheck className="w-16 h-16" />
                    <div>{feature}</div>
                  </div>
                ))}
              </div>
              <div className="w-full d-flex-col gap-4">
                <div className="col-1p3">Giá tiền:</div>
                <div className="d-flex gap-4 ml-12 ai-c">
                  - <div className="fw-700">{splitMoney(plan.price)}</div>
                  <div>đ/tin/ngày</div>
                </div>
                <div className="d-flex gap-4 ml-12 ai-c">
                  - <div className="fw-700">{splitMoney(plan.priceWeek)}</div>
                  <div className="mr-8">đ/tin/tuần</div>
                  <AppBadge size="sm" nowrap={true} tone="info">
                    -5%
                  </AppBadge>
                </div>
                <div className="d-flex gap-4 ml-12 ai-c">
                  - <div className="fw-700">{splitMoney(plan.priceMonth)}</div>
                  <div className="mr-8">đ/tin/tháng</div>
                  <AppBadge size="sm" nowrap={true} tone="info-bold">
                    -10%
                  </AppBadge>
                </div>
              </div>
            </div>
            <AppButton className="mt-36" type="border-1">
              Xem đemo
            </AppButton>
          </AppCard>
        ))}
      </div>

      <AppButton className="mt-36 Plans__PaymentBtn" size="lg" url="/payments">
        Nạp tiền
      </AppButton>
    </AppContainer>
  );
}

export default Plans;
