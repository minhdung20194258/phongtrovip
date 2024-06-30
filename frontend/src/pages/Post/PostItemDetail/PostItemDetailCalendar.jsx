import {AppBadge, AppButton, AppCard, AppInput, AppSeperateText} from '@/components/index.jsx';
import './PostItemDetail.scss';
import {IconFlash, IconTime} from '@/components/Icons/AppIcon.jsx';
import {splitMoney, splitStr} from '@/helper/formats.js';
import {calendarsRules} from '@/config/validations/postValidation.js';
import {useDispatch, useSelector} from 'react-redux';
import {getIsStaff, getUser} from '@/reducers/authSlice.js';
import PropTypes from 'prop-types';
import useCreateApi from '@/hooks/api/useCreateApi.jsx';
import {setDialog} from '@/reducers/layout/dialogSlice.js';
import useInputValidations from '@/hooks/form/useInputValidations.jsx';
import useEditApi from '@/hooks/api/useEditApi.jsx';
import moment from 'moment';
import usePostItemDetailDepositOTP from '@/pages/Post/PostItemDetail/usePostItemDetailDepositOTP.jsx';

PostItemDetailCalendar.propTypes = {
  post: PropTypes.object.isRequired,
  isVerified: PropTypes.bool,
  setPost: PropTypes.func,
};

function PostItemDetailCalendar({post /** @type {PostsExtend}*/, isVerified, setPost}) {
  const user = useSelector(getUser);
  const isStaff = useSelector(getIsStaff);
  const dispatch = useDispatch();
  const {input, handleChange, validations, handleValidations} = useInputValidations({
    initialState: {isLogin: !!user._id},
    configRules: calendarsRules,
  });
  const {creating, handleCreate} = useCreateApi({
    url: '/calendars',
  });
  const {editing, handleEdit: handleRequestDeposit} = useEditApi({
    url: `/posts/deposit/request/${post._id}`,
  });
  const {modal, openModal} = usePostItemDetailDepositOTP({post, setPost});
  const handleCalendar = async () => {
    if (user._id === post.user?._id || isStaff) return;
    if (!handleValidations()) return;

    const newCalendar = {
      startAt: new Date(`${input.time} ${input.date}`),
      email: user._id ? user.email : input.email,
      timeslot: input.timeslot,
      postId: post._id,
      receiverId: post.user?._id,
      ...(user._id ? {senderId: user._id} : {}),
    };
    await handleCreate(newCalendar);
  };

  const handleDeposit = async () => {
    if (user._id === post.user?._id || isStaff) return;
    const resp = await handleRequestDeposit({});
    if (resp) return openModal();
  };

  const handleConfirmDeposit = async () => {
    if (user.amountBalance < 500000) {
      const errorConfig = setDialog({
        type: 'error',
        header: 'Số dư tài khoản không đủ',
        content: 'Vui lòng nạp thêm tiền để có thể thực hiện chức năng này',
        primaryLabel: 'Nạp thẻ',
        url: '/payments',
      });
      return dispatch(errorConfig);
    }

    const confirmConfig = setDialog({
      type: 'help',
      header: 'Bạn muốn cọc nhà',
      content: (
        <p>
          Chúng tôi sẽ trừ <span className="fw-700">500.000đ</span> vào tài khoản trực tiếp của bạn
          để cọc nhà <span className="fw-600">&quot;{post.title}&quot;</span>. Bạn có chắc chắn muốn
          thực hiện điều này?
        </p>
      ),
      onAccept: () => handleDeposit(),
    });
    dispatch(confirmConfig);
  };

  return (
    <AppCard className="d-flex-col gap-12 w-400">
      {modal}
      {!isVerified && (
        <AppBadge tone="disabled" size="lg" fullWidth={true} align="center">
          Chỉ xem
        </AppBadge>
      )}
      <div className="d-flex jc-e fw-700 fs-20 color-700 ai-e mb-28">
        <span className="fs-34" style={{lineHeight: '36px'}}>
          {splitMoney(post.price)}
        </span>
        <span>đ/tháng</span>
      </div>
      {!post.isHasDeposit && (
        <>
          <div className="d-flex-col">
            <div className="mb-16">
              <div className="fw-600 mb-8">Chọn ngày xem phòng</div>
              <div className="d-flex gap-12">
                <AppInput
                  type="number"
                  value={input.time}
                  onChange={(val) => handleChange('time', splitStr(val, ':', [2, 2], true))}
                  classNameInput="txt-c"
                  suffix="HH:MM"
                  maxLength={5}
                  errorMess={validations.time}
                />
                <AppInput
                  type="date"
                  value={input.date}
                  onChange={(val) => handleChange('date', val)}
                  errorMess={validations.date}
                />
              </div>
            </div>
            <AppInput
              label="Thời gian"
              type="number"
              value={input.timeslot}
              onChange={(val) => handleChange('timeslot', val)}
              classNameInput="txt-c"
              suffix="Phút"
              maxLength={3}
              errorMess={validations.timeslot}
            />
            {!user._id && (
              <AppInput
                value={input.email}
                onChange={(val) => handleChange('email', val)}
                label="Email"
              />
            )}
            <AppButton
              className="bg-red-200 d-flex jc-c h-52 w-full fs-18 fw-700 mt-16"
              icon={() => <IconTime />}
              onClick={() => handleCalendar()}
              loading={creating || editing}
            >
              ĐẶT LỊCH XEM PHÒNG
            </AppButton>
          </div>
          {post.isUseDeposit && (
            <div className="d-flex-col gap-28">
              <div className="d-flex-col gap-16">
                <AppSeperateText text="Hoặc" />
                <div className="d-flex gap-24">
                  <AppInput
                    value={moment(new Date(post.startAt)).format('YYYY-MM-DD')}
                    label="Nhận phòng"
                    disabled={true}
                  />
                  <AppInput
                    value={moment(new Date(post.endAt)).format('YYYY-MM-DD')}
                    label="Trả phòng"
                    disabled={true}
                    labelEnd={true}
                    inputEnd={true}
                  />
                </div>
                <AppButton
                  icon={() => <IconFlash className="w-36 h-36 color-warning" />}
                  className="d-flex jc-c h-52 w-full fs-18 fw-700"
                  loading={creating || editing}
                  onClick={() => handleConfirmDeposit()}
                >
                  CỌC TIỀN NGAY (500.000đ)
                </AppButton>
                <AppSeperateText />
              </div>
            </div>
          )}
        </>
      )}
      {post.isHasDeposit && (
        <AppBadge tone="info" size="lg" fullWidth={true} align="center">
          <div className="txt-c">
            Đã cho thuê từ
            <p>
              <span>Ngày </span>
              {moment(post.deposits?.startAt).format('DD-MM-YYYY')}
              <span> đến ngày </span>
              {moment(post.deposits?.endAt).format('DD-MM-YYYY')}
            </p>
          </div>
        </AppBadge>
      )}
      <AppButton url={`/user/show/${post.user._id}`} type="border" className="h-52">
        Nhắn tin với chủ phòng
      </AppButton>
      <div className="w-full bg-grey-100 pt-16 pb-16 pr-12 pl-12 d-flex jc-c fw-600">
        Gọi 0838.99.3838 để được hỗ trợ 24/7
      </div>
    </AppCard>
  );
}

export default PostItemDetailCalendar;
