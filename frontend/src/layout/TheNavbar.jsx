import AppButton from '@/components/Button/AppButton.jsx';
import {
  IconChevron,
  IconMenu,
  IconMessageRoom,
  IconPen,
  IconPiggyBank,
} from '@/components/Icons/AppIcon.jsx';
import {useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {authSignOut, getIsStaff, getIsAuth, getUser} from '@/reducers/authSlice.js';
import useOnClickOutside from '@/hooks/useOnClickOutSide.jsx';
import AppCard from '@/components/Polaries/Card/AppCard.jsx';
import {setDialog} from '@/reducers/layout/dialogSlice.js';
import useChangePassword from '@/pages/Auth/ChangePassword/useChangePassword.jsx';
import {useNavigate} from 'react-router-dom';
import {getDevice, toggleShowMenu} from '@/reducers/layout/layoutSlice.js';
import {splitStr} from '@/helper/formats.js';
import {MONEY_SPLITS} from '@/const/money.js';
import {AppSeperateText} from '@/components/index.jsx';
import useModalSignIn from '@/hooks/modal/useModalSignIn.jsx';

function TheNavbar() {
  const [isShowMenu, setIsShowMenu] = useState(false);
  const user = useSelector(getUser);
  const isStaff = useSelector(getIsStaff);
  const isAuth = useSelector(getIsAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const ref = useRef();
  const {isMobile} = useSelector(getDevice);

  useOnClickOutside({
    ref,
    handler: () => setIsShowMenu(false),
  });

  const {openModal, modal} = useChangePassword();
  const {modal: modalSignIn, openModal: openModalSignIn} = useModalSignIn();

  const AuthNavbar = (
    <>
      <AppButton text="Đăng tin" icon={IconPen} url="/posts/new" />
      <AppButton icon={IconMessageRoom} type="no-text-2" url="/message" />
      <AppButton icon={IconPiggyBank} type="no-text-2" url="/plans" className="Btn-PinggyBank" />
      <div className="Navbar__User" ref={ref}>
        <div onClick={() => setIsShowMenu((prev) => !prev)} className="Navbar__User--Preview">
          <div className="UserAvatar">
            <img src={user.avatar?.url ? user.avatar.url : '/default-avatar.png'} alt="" />
          </div>
          <div className="UserInfo">
            <div className="UserInfo__Name">{user.fullName}</div>
            <div className="UserInfo__More">
              <p>Tài khoản:</p>
              <span className="color-500 fw-700">{`${splitStr(user.amountBalance, '.', MONEY_SPLITS, true)}đ`}</span>
            </div>
          </div>
          {IconChevron({type: isShowMenu ? 'up' : 'down'})}
        </div>

        {isShowMenu && (
          <AppCard className="Navbar__User--More" onClick={() => setIsShowMenu(false)}>
            {isStaff && (
              <>
                <AppButton type="transparent" className="w-full d-flex jc-s" url="/admin">
                  Admin
                </AppButton>
                <AppSeperateText className="pt-8 pb-8" />
              </>
            )}
            <AppButton type="transparent" className="w-full d-flex jc-s" url="/plans">
              Nạp tiền
            </AppButton>
            <AppButton
              type="transparent"
              className="w-full d-flex jc-s"
              url="/user/profile?type=payment-required"
            >
              Rút tiền
            </AppButton>
            <AppSeperateText className="pt-8 pb-8" />
            <AppButton type="transparent" className="w-full d-flex jc-s" onClick={openModal}>
              Đổi mật khẩu
            </AppButton>
            <AppButton type="transparent" className="w-full d-flex jc-s" url="/user/profile">
              Quản lý chung
            </AppButton>
            <AppSeperateText className="pt-8 pb-8" />
            <AppButton type="transparent" className="w-full d-flex jc-s" url="/posts/new">
              Cho thuê chỗ ở
            </AppButton>
            <AppButton type="transparent" className="w-full d-flex jc-s" url="/helps">
              Trung tâm trợ giúp
            </AppButton>
            <AppSeperateText className="pt-8 pb-8" />
            <AppButton
              type="transparent"
              className="w-full d-flex jc-s"
              onClick={() => {
                setIsShowMenu(false);
                dispatch(
                  setDialog({
                    type: 'info',
                    header: 'Xác nhận',
                    content: 'Bạn có chắc chắn muốn đăng xuất không?',
                    onCancel: () => {},
                    onAccept: () => {
                      dispatch(authSignOut());
                    },
                  }),
                );
              }}
            >
              Đăng xuất
            </AppButton>
          </AppCard>
        )}
      </div>
    </>
  );

  const NotAuthNavbar = (
    <>
      {modalSignIn}
      <AppButton type="text" onClick={openModalSignIn}>
        <div className="fw-600">Cho thuê chỗ ở</div>
      </AppButton>
      <div className="Navbar__User" ref={ref}>
        <div
          onClick={() => setIsShowMenu((prev) => !prev)}
          className="Navbar__User--Preview--NotAuth"
        >
          <IconMenu />
          <img src="/default-avatar.png" alt="" />
        </div>

        {isShowMenu && (
          <AppCard className="Navbar__User--More" onClick={() => setIsShowMenu(false)}>
            <AppButton type="transparent" className="w-full d-flex jc-s" url="/sign-in">
              Đăng nhập
            </AppButton>
            <AppButton type="transparent" className="w-full d-flex jc-s" url="/sign-up">
              Đăng ký
            </AppButton>
            <AppSeperateText className="pt-8 pb-8" />
            <AppButton type="transparent" className="w-full d-flex jc-s" url="/posts/new">
              Cho thuê chỗ ở
            </AppButton>
            <AppButton type="transparent" className="w-full d-flex jc-s" url="/helps">
              Trung tâm trợ giúp
            </AppButton>
          </AppCard>
        )}
      </div>
    </>
  );

  return (
    <div className="App-Navbar">
      <div className="Navbar__Left">
        <AppButton
          icon={IconMenu}
          type="no-text-2"
          className="Navbar__Left--Menu"
          onClick={() => dispatch(toggleShowMenu())}
        />
        <div className="Navbar__Left--Icon" onClick={() => navigate('/')}>
          <img src={isMobile ? '/logo-sm.svg' : '/logo-md.svg'} alt="" />
        </div>
      </div>
      <div className="Navbar__Right">{isAuth ? AuthNavbar : NotAuthNavbar}</div>
      {modal}
    </div>
  );
}

export default TheNavbar;
