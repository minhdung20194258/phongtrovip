import {typeOfRoomOptions} from '@/const/options/postOptions.js';
import {AppBadge, AppButton, AppSeperateText} from '@/components/index.jsx';
import {useContext} from 'react';
import {PostFormContext} from '@/pages/Post/PostForm/PostFormContext.jsx';
import clsx from 'clsx';

Step1.propTypes = {};

function Step1() {
  const {
    setStep,
    handleChange,
    input = {},
    validations = {},
    handleValidations,
  } = useContext(PostFormContext);
  const handleNextStep = () => {
    if (!handleValidations()) return;

    setStep(2);
  };

  return (
    <div className="PostForm__ContentLayout">
      <div className="Content__Sidebar">
        <div className="fw-700 fs-16 mb-8">Chọn danh mục đăng tin</div>
        {typeOfRoomOptions.map(({value, label}) => (
          <div key={value} onClick={() => handleChange('typeOfRoom', value)}>
            <AppSeperateText />
            <div
              className={clsx({
                'h-48 d-flex ai-c pointer p-12 bdr-4': true,
                'hover-bg-grey-300': input.typeOfRoom !== value,
                'bg-grey-300': input.typeOfRoom === value,
              })}
            >
              {label}
            </div>
          </div>
        ))}

        {validations.typeOfRoom && (
          <AppBadge tone="error" align="center" size="lg" fullWidth={true}>
            {validations.typeOfRoom}
          </AppBadge>
        )}

        <AppButton className="mt-24" onClick={() => handleNextStep()} size="lg">
          Tiếp theo
        </AppButton>
      </div>
      <div className="Content__Main">
        <div className="w-full d-center">
          <div className="ContentStep1-Image" />
        </div>

        <div className="fs-16 fw-500 p-24">
          Khám phá những không gian sống lý tưởng với chúng tôi! Tìm kiếm phòng trọ mơ ước của bạn
          chỉ trong vài bước đơn giản. Đội ngũ chuyên gia của chúng tôi sẵn lòng hỗ trợ bạn trong
          mọi bước của hành trình tìm kiếm. Dễ dàng, nhanh chóng và tiện lợi - bắt đầu ngay hôm nay!
          Với hàng ngàn danh sách phòng trọ đa dạng và phong phú, chúng tôi cam kết mang lại cho bạn
          trải nghiệm tìm kiếm trọn vẹn nhất. Tận hưởng sự linh hoạt và thuận tiện khi tìm kiếm từng
          chi tiết theo nhu cầu của bạn. Dễ dàng liên hệ với chủ nhà, đặt lịch hẹn xem nhà, và thậm
          chí đặt trước phòng trực tuyến. Không gì quan trọng hơn việc tìm được nơi an cư lý tưởng
          cho bản thân. Để chúng tôi giúp bạn biến ước mơ đó thành hiện thực. Tham gia cộng đồng tìm
          kiếm phòng trọ của chúng tôi ngay hôm nay và khám phá cơ hội không gian sống mới mẻ đang
          chờ đón bạn
        </div>
      </div>
    </div>
  );
}

export default Step1;
