import {useEffect, useRef, useState} from 'react';
import Step3 from '@/pages/Post/PostForm/Step3.jsx';
import {Navigate, useParams} from 'react-router-dom';
import useCreateApi from '@/hooks/api/useCreateApi.jsx';
import useFetchApi from '@/hooks/api/useFetchApi.jsx';
import {
  postAdminDeposit,
  postNewStep1Rules,
  postNewStep2Rules,
  postNewStep3Rules,
} from '@/config/validations/postValidation.js';
import {PostFormContext} from '@/pages/Post/PostForm/PostFormContext.jsx';
import {
  AppButton,
  AppCombobox,
  AppContainer,
  AppInput,
  AppSeperateText,
  AppSettingToggle,
  AppToggle,
} from '@/components/index.jsx';
import '../PostFrom.scss';
import Step2Form from '@/pages/Post/PostForm/Step2Form.jsx';
import moment from 'moment/moment.js';
import {isEqual, pick} from 'lodash';
import {postPriceItems} from '@/helper/picker.js';
import {removeSplitObj} from '@/helper/formats.js';
import {useSelector} from 'react-redux';
import {getUserId} from '@/reducers/authSlice.js';
import useValidations from '@/hooks/form/useValidations.jsx';
import {getChangedValue} from '@/helper/untils.js';
import {typeOfRoomOptions} from '@/const/options/postOptions.js';

PostEdit.propTypes = {};

function PostEdit() {
  const userId = useSelector(getUserId);
  const params = useParams();
  const initData = useRef();
  const [step, setStep] = useState(1);
  const {handleCreate, creating} = useCreateApi({
    url: '/posts',
    fullResp: true,
    successMsg: 'Chỉnh sửa thành công',
    errorMsg: 'Có lỗi xảy ra',
  });

  const {data, loading, fetched, setData, handleChangeData, toggleData} = useFetchApi({
    url: `/posts/${params.postId}`,
    defaultData: {},
  });
  const {handleValidations, validations} = useValidations({
    ...postAdminDeposit(data),
    ...postNewStep1Rules(data),
    ...postNewStep2Rules(data),
    ...postNewStep3Rules(data),
  });
  useEffect(() => {
    if (!fetched) return () => {};
    initData.current = data;
  }, [fetched]);

  const handleSave = async () => {
    if (!handleValidations() || isEqual(data, initData.current)) return;

    const changedData = getChangedValue(data, initData.current, ['_id']);
    const fd = new FormData();
    const images = data.images || [];
    const postData = {
      ...changedData,
      ...removeSplitObj(pick(data, postPriceItems), '.'),
      images: images.map((image) => (image._id ? image : null)).filter(Boolean),
    };
    fd.append('data', JSON.stringify(postData));
    images.forEach((image, index) => {
      if (image._id) return;
      fd.append(`fileUpload${index}`, image.file);
    });

    const resp = await handleCreate(fd);
    if (!resp.success) return;
    setData(resp.data);
    initData.current = resp.data;
  };

  if (loading) return <AppContainer />;
  if (data.userId !== userId) return <Navigate to={`/posts/${params.postId}`} replace={true} />;

  return (
    <PostFormContext.Provider
      value={{
        step,
        setStep,
        input: data,
        setInput: setData,
        handleChange: handleChangeData,
        handleValidations,
        validations,
        handleCreate,
        creating,
      }}
    >
      <AppContainer
        className="EditForm"
        header="Chỉnh sửa bài đăng"
        paddingInline={240}
        primaryAction={() => handleSave()}
        secondaryAction={() => setData(initData.current)}
        loading={creating}
      >
        {/*  <div className="d-flex gap-12 pr-240">*/}
        {/*    <AppButton*/}
        {/*      type="secondary"*/}
        {/*      onClick={() => setData(initData.current)}*/}
        {/*      loading={creating}*/}
        {/*    >*/}
        {/*      Loại bỏ*/}
        {/*    </AppButton>*/}
        {/*    <AppButton onClick={() => handleSave()} loading={creating}>*/}
        {/*      Lưu*/}
        {/*    </AppButton>*/}
        {/*  </div>*/}
        {/*}*/}
        <div className="PostForm__ContentLayout">
          <div className="d-flex-col w-full gap-8">
            <AppSettingToggle
              checked={!data.isAdminHidden}
              title="Thông tin gói tin"
              uncheckedMess={data.isAdminCheck ? 'Admin từ chối' : 'Chưa phê duyệt'}
              checkedMess={data.isAdminCheck ? 'Admin xác nhận' : 'Chưa phê duyệt'}
            />
            <div className="d-flex gap-8 ai-c">
              <div className="fw-600 col-1p4">Ngày đăng ký:</div>
              <div className="fw-600">
                {moment(data.subscriptionStartAt).format('hh:mm [ngày] DD [tháng] MM [năm] YYYY')}
              </div>
            </div>
            <div className="d-flex gap-8 ai-c">
              <div className="fw-600 col-1p4">Ngày kết thúc:</div>
              <div className="fw-600">
                {moment(data.subscriptionEndAt).format('hh:mm [ngày] DD [tháng] MM [năm] YYYY')}
              </div>
            </div>
            <div className="d-flex gap-8 ai-c">
              <div className="fw-600 col-1p4">Còn lại:</div>
              <div className="fw-600">
                {moment(data.subscriptionEndAt).diff(moment(new Date()), 'days')} ngày
              </div>
            </div>
            <div className="d-flex gap-8 ai-c">
              <div className="fw-600 col-1p4">Tự động thanh toán:</div>
              <AppToggle
                checked={data.isAutoPaying}
                setChecked={() => toggleData('isAutoPaying')}
              />
            </div>
            <div className="d-flex gap-8 ai-c">
              <div className="fw-600 col-1p4">Đang hiển thị:</div>
              <AppToggle
                checked={!data.isUserHidden}
                setChecked={() => toggleData('isUserHidden')}
              />
            </div>
          </div>
        </div>
        <AppSeperateText className="pl-200 pr-200 mb-24" />
        <div className="PostForm__ContentLayout">
          <div className="d-flex-col w-full gap-8">
            <AppSettingToggle
              checked={data.isUseDeposit}
              title="Cài đặt đặt cọc"
              uncheckedMess="Không sử dụng"
              checkedMess="Đang sử dụng"
              handleToggle={() => toggleData('isUseDeposit')}
            />
            <div className="d-flex gap-16 ai-c">
              <AppInput
                label="Ngày nhận phòng"
                type="date"
                value={moment(data.startAt).format('YYYY-MM-DD')}
                onChange={(val) => handleChangeData('startAt', val)}
                min={moment().format('YYYY-MM-DD')}
                errorMess={validations.startAt}
              />
              <AppInput
                label="Ngày trả phòng"
                type="date"
                value={moment(data.endAt).format('YYYY-MM-DD')}
                onChange={(val) => handleChangeData('endAt', val)}
                min={moment(data.startAt).format('YYYY-MM-DD')}
                errorMess={validations.endAt}
              />
            </div>
          </div>
        </div>
        <AppSeperateText className="pl-200 pr-200 mb-24" />
        <Step3 />
        <AppSeperateText className="pl-200 pr-200 mb-24" />
        <div className="PostForm__ContentLayout ContentStep2">
          <AppCombobox
            label="Danh mục đăng tin"
            options={typeOfRoomOptions}
            selected={data.typeOfRoom}
            onSelected={(val) => handleChangeData('typeOfRoom', val)}
          />
          <Step2Form />
        </div>
      </AppContainer>
    </PostFormContext.Provider>
  );
}

export default PostEdit;
