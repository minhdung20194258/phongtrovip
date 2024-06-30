import PropTypes from 'prop-types';
import {AppButton, AppCard, AppSeperateText} from '@/components/index.jsx';
import {IconCheck, IconFlag, IconVerify} from '@/components/Icons/AppIcon.jsx';
import useReportUser from './useReportUser.jsx';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {getIsAuth} from '@/reducers/authSlice.js';
import {setShowModalSignIn} from '@/reducers/layout/layoutSlice.js';

UserPublicCard.propTypes = {
  user: PropTypes.object.isRequired,
  isNavigate: PropTypes.bool,
};

function UserPublicCard({user = {} /**@type {Users}*/, isNavigate = false}) {
  const isAuth = useSelector(getIsAuth);
  const dispatch = useDispatch();
  const {modal, openModal} = useReportUser({accountId: user._id});
  const navigate = useNavigate();

  return (
    <div className="App-UserPublicCard">
      {modal}
      <AppCard
        className="UserEvaluate"
        onClick={() => isNavigate && navigate(`/user/show/${user._id}`)}
      >
        <div className="UserEvaluate__Preview">
          <div className="Preview__Img">
            <img src={user.avatar?.url ? user.avatar.url : '/default-avatar.png'} alt="" />
            <IconVerify className="color-500" />
          </div>
          <div className="name">{user.fullName}</div>
        </div>
        <div className="UserEvaluate__Info">
          <div className="d-flex-col">
            <div className="fw-700 fs-22">888</div>
            <div className="fs-11">Đánh giá</div>
          </div>
          <AppSeperateText className="pt-16 pb-16" />
          <div className="d-flex-col">
            <div className="fw-700 fs-22">4.88</div>
            <div className="fs-11">Xếp hạng</div>
          </div>
          <AppSeperateText className="pt-16 pb-16" />
          <div className="d-flex-col">
            <div className="fw-700 fs-22">4</div>
            <div className="fs-11">năm kinh nghiệm đón tiếp khách</div>
          </div>
        </div>
      </AppCard>
      <AppCard className="UserVerify">
        <div className="fw-600 fs-20">Thông tin đã xác nhận</div>
        <div>
          <div className="d-flex gap-8">
            <IconCheck />
            Địa chỉ email
          </div>
          <div className="ml-32">{user.email}</div>
        </div>
      </AppCard>
      <div>
        <AppButton
          type="text"
          icon={IconFlag}
          onClick={() => (isAuth ? openModal() : dispatch(setShowModalSignIn(true)))}
        >
          <p>
            Báo cáo tài khoản
            <span className="fw-700 ml-4">&quot;{user.fullName}&quot;</span>
          </p>
        </AppButton>
      </div>
    </div>
  );
}

export default UserPublicCard;
