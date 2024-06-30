import AppContainer from '@/components/Polaries/Contaner/AppContainer.jsx';
import UserSidebar from '@/pages/User/UserSidebar.jsx';
import {useLocation} from 'react-router-dom';
import './styles/UserProfile.scss';
import UserProfile from '@/pages/User/UserProfile.jsx';
import {useMemo} from 'react';
import {
  IconBookMarkSlim,
  IconDislikeSlim,
  IconDola,
  IconLoveSlim,
  IconPen,
  IconPiggyBank,
  IconRefund,
  IconTime,
  IconUser,
} from '@/components/Icons/AppIcon.jsx';
import UserReact from '@/pages/User/UserReact.jsx';
import {useSelector} from 'react-redux';
import {getUser} from '@/reducers/authSlice.js';
import './styles/User.scss';
import UserActivities from '@/pages/User/UserActivities.jsx';
import UserAdminPosts from '@/pages/User/UserAdminPosts.jsx';
import UserCalendar from '@/pages/User/UserCalendar.jsx';
import UserDeposit from '@/pages/User/UserDeposit.jsx';
import {
  USER_DISLIKE_POST,
  USER_LIKE_POST,
  USER_SAVE_POST,
} from 'backend/const/types/reactionPostTypes.mjs';
import UserPaymentRequired from '@/pages/User/RequiredPayment/UserPaymentRequired.jsx';

User.propTypes = {};

function User() {
  const location = useLocation();
  const tabs = useMemo(
    () => [
      {
        title: 'Chỉnh sửa trang cá nhân',
        icon: <IconUser />,
        mockup: <UserProfile />,
        type: '',
      },
      {
        title: 'Bài đăng của tôi',
        icon: <IconPen />,
        mockup: <UserAdminPosts />,
        type: 'my-posts',
      },
      {
        title: 'Lịch sử',
        mockup: <UserActivities />,
        icon: <IconPiggyBank />,
        type: 'my-activities',
      },
      {
        title: 'Yêu cầu rút tiền',
        mockup: <UserPaymentRequired />,
        icon: <IconRefund />,
        type: 'payment-required',
      },
      {
        title: 'Tin yêu thích',
        icon: <IconLoveSlim />,
        mockup: <UserReact type={USER_LIKE_POST} key={'postLikes'} />,
        type: 'my-likes',
      },
      {
        title: 'Tin đã lưu',
        mockup: <UserReact type={USER_SAVE_POST} key={'postSaves'} />,
        icon: <IconBookMarkSlim />,
        type: 'my-saves',
      },
      {
        title: 'Tin dislikes',
        mockup: <UserReact type={USER_DISLIKE_POST} key={'postDislikes'} />,
        icon: <IconDislikeSlim />,
        type: 'my-dislikes',
      },
      {
        title: 'Yêu cầu hẹn gặp',
        mockup: <UserCalendar key={'postDislikes'} />,
        icon: <IconTime />,
        type: 'my-calendar',
      },
      {
        title: 'Yêu cầu đặt cọc',
        mockup: <UserDeposit key={'UserDeposit'} />,
        icon: <IconDola />,
        type: 'deposit',
      },
    ],
    [],
  );
  const urlParams = new URLSearchParams(location.search);
  const currentTab = tabs.find((tab) => tab.type === urlParams.get('type')) || tabs[0];

  return (
    <AppContainer className="App-User">
      <div className="User__SideBar">
        <UserSidebar tabs={tabs} />
      </div>
      <div className="User__Outlet">{currentTab.mockup}</div>
    </AppContainer>
  );
}

export default User;
