import {planOptions, timeOptionOptions, timePostedOptions} from '@/const/options/postOptions.js';
import {AppButton, AppCombobox, AppSeperateText} from '@/components/index.jsx';
import {useContext} from 'react';
import {PostFormContext} from '@/pages/Post/PostForm/PostFormContext.jsx';
import {IconCheck} from '@/components/Icons/AppIcon.jsx';
import {splitMoney} from '@/helper/formats.js';
import {useDispatch, useSelector} from 'react-redux';
import {getUser, setUser} from '@/reducers/authSlice.js';
import {FREE, getPricePost} from 'backend/const/plans.mjs';
import Plans from '@/pages/Plans/Plans.jsx';
import useModal from '@/hooks/modal/useModal.jsx';
import {setDialog} from '@/reducers/layout/dialogSlice.js';
import useEditApi from '@/hooks/api/useEditApi.jsx';
import {useLocation, useParams} from 'react-router-dom';
import {pick} from 'lodash';
import {postStep3} from '@/helper/picker.js';
import moment from 'moment/moment.js';

Step3.propTypes = {};

function Step3() {
  const location = useLocation();
  const user = useSelector(getUser);
  const {
    setStep,
    handleChange,
    input = {},
    validations = {},
    handleValidations,
  } = useContext(PostFormContext);
  const price = getPricePost(input);
  const dispatch = useDispatch();
  const {postId} = useParams();

  const {handleEdit: handlePostPayment} = useEditApi({
    url: `/posts/payment/${input._id || postId}`,
  });
  const {handleEdit} = useEditApi({
    url: `/posts/${input._id || postId}`,
  });

  const handlePayment = async () => {
    const resp = await handlePostPayment(pick(input, postStep3));
    if (!resp) return;
    dispatch(
      setUser({
        amountBalance: user.amountBalance - price,
      }),
    );
  };

  const handleNextStep = async () => {
    if (!handleValidations()) return;
    await handleEdit(pick(input, postStep3));

    setStep(4);
  };
  const handleConfirmCharge = () => {
    if (!handleValidations()) return;
    if (!input.plan || !input.timePosted || !input.timePosted) return;

    dispatch(
      setDialog({
        type: 'help',
        header: 'Xác nhận',
        content: (
          <p>
            Bạn muốn thanh toán <span className="fw-700">{splitMoney(price)}đ</span> ngay?
          </p>
        ),
        onAccept: () => handlePayment(),
      }),
    );
  };

  const {modal, openModal} = useModal({
    children: <Plans isModal={true} />,
  });
  const handleConfirmNotCharge = () => {
    if (!handleValidations()) return;

    dispatch(
      setDialog({
        type: 'warning',
        onAccept: handleNextStep,
        header: 'Xác nhận',
        content: 'Bạn chưa thanh toán ngay bây giờ?',
      }),
    );
  };

  return (
    <div className="PostForm__ContentLayout Step3">
      {modal}
      <div className="d-flex pt-4 ai-c gap-8">
        <div className="fw-700 fs-16">Thanh toán</div>
        <AppButton type="border-1" className="pl-6 pr-6" onClick={openModal}>
          Xem gói tin
        </AppButton>
      </div>
      <div className="row gap-8">
        <div className="col-1p3">
          <AppCombobox
            label="Chọn loại tin"
            options={planOptions}
            selected={input.plan || FREE}
            onSelected={(value) => handleChange('plan', value)}
            errorMess={validations.plan}
          />
        </div>
        <div className="col-1p3">
          <AppCombobox
            label="Chọn thời gian"
            options={timeOptionOptions}
            selected={input.timeOption}
            onSelected={(value) => handleChange('timeOption', value)}
            errorMess={validations.timeOption}
          />
        </div>
        <div className="col-1p3">
          <AppCombobox
            label="Kết thúc sau"
            options={timePostedOptions(input.timeOption)}
            selected={input.timePosted}
            onSelected={(value) => handleChange('timePosted', value)}
            errorMess={validations.timePosted}
          />
        </div>
      </div>
      <div className="Step3--Info w-full d-flex-col gap-16">
        <div className="d-flex gap-12">
          <div className="fw-700 fs-16 ">Phương thức thanh toán:</div>
          <div className="d-center fs-14">
            <div>Trừ tiền trong tài khoản</div>
            <IconCheck className="w-16 h-16" />
          </div>
        </div>
        <p className="fw-500">
          Số dư hiện tại:{' '}
          <span className="color-500 fw-700 fs-16">{splitMoney(user.amountBalance)}đ</span>
        </p>
      </div>

      <div className="Step3--Info w-full d-flex-col gap-16">
        <AppSeperateText text="Thông tin thanh toán" classNameText="fw-600 fs-18 color-black" />
        <div className="d-flex ai-c jc-sb w-full">
          <div className="col-1p3">Bài đăng:</div>
          <div className="fw-600">{input.title}</div>
        </div>
        <div className="d-flex ai-c jc-sb w-full">
          <div className="col-1p3">Loại tin:</div>
          <div className="fw-600">
            {planOptions.find((item) => item.value === input.plan)?.label}
          </div>
        </div>
        <div className="d-flex ai-c jc-sb w-full">
          <div className="col-1p3">Hình thức đăng:</div>
          <div className="fw-600">
            {timeOptionOptions.find((item) => item.value === input.timeOption)?.label}
          </div>
        </div>
        <div className="d-flex ai-c jc-sb w-full">
          <div className="col-1p3">Thời hạn:</div>
          <div className="fw-600">
            {
              timePostedOptions(input.timeOption).find((item) => item.value === input.timePosted)
                ?.label
            }
          </div>
        </div>
        <div className="d-flex ai-c jc-sb w-full">
          <div className="col-1p3">Kết thúc:</div>
          <div className="fw-600">
            {moment(input.subscriptionEndAt)
              .add(input.timePosted, input.timeOption)
              .format('hh:mm [ngày] DD [tháng] MM [năm] YYYY')}
          </div>
        </div>
        <AppSeperateText />
        <div className="d-flex ai-c jc-sb w-full">
          <div className="col-1p3 fw-600">Tổng thanh toán:</div>
          <div className="fw-600 fs-24">{splitMoney(price)}đ</div>
        </div>
      </div>

      <AppButton onClick={handleConfirmCharge} className="w-full" size="lg">
        Thanh toán ngay
      </AppButton>
      {!location.pathname.includes('edit') && (
        <AppButton onClick={handleConfirmNotCharge} className="w-full" size="lg" type="text">
          Để sau
        </AppButton>
      )}
    </div>
  );
}

export default Step3;
