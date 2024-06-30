import './AdminSidebar.scss';
import {AppCardMenu} from '@/components/index.jsx';
import clsx from 'clsx';
import {Link, useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {getIsAdmin, getUser} from '@/reducers/authSlice.js';

AdminSidebar.propTypes = {};

function AdminSidebar() {
  const user = useSelector(getUser);
  const isAdmin = useSelector(getIsAdmin);
  const tabs = [
    isAdmin && {
      label: 'Quản lý tài khoản nhân viên',
      icon: '',
      id: 'accounts-staff',
    },
    {
      label: 'Quản lý tài khoản',
      icon: '',
      id: 'accounts',
    },
    {
      label: 'Quản lý bài đăng',
      icon: '',
      id: 'posts',
    },
    {
      label: 'Quản lý yêu cầu rút tiền',
      icon: '',
      id: 'requests-transfer',
    },
    // {
    //   label: 'Quản lý tin tức',
    //   icon: '',
    //   id: 'news',
    // },
    // {
    //   label: 'Quản lý hỏi-đáp',
    //   icon: '',
    //   id: 'questions',
    // },
    {
      label: 'Quản lý đánh giá',
      icon: '',
      id: 'reviews',
    },
    // {
    //   label: 'Quản lý gói dịch vụ',
    //   icon: '',
    //   id: 'plans',
    // },
    // {
    //   label: 'Quản lý banner',
    //   icon: '',
    //   id: 'banner',
    // },
    // {
    //   label: 'Quản lý báo xấu',
    //   icon: '',
    //   id: 'reports',
    // },
    {
      label: 'Quản lý giới thiệu',
      icon: '',
      id: 'introduces',
    },
    {
      label: 'Quản lý mẹo',
      icon: '',
      id: 'tooltips',
    },
  ].filter(Boolean);
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);

  return (
    <AppCardMenu className="App-AdminSidebar">
      <div className="AdminSidebar__User">
        <div className="AdminSidebar__User--Avatar">
          <img src={user.avatar?.url ? user.avatar.url : 'default-avatar.png'} alt="" />
        </div>
        <div className="AdminSidebar__User--FullName">
          {user.fullName}
          <div className={clsx({role: true, admin: isAdmin})}>
            {isAdmin ? 'Admin' : 'Cộng tác viên'}
          </div>
        </div>
      </div>

      {tabs.map((tab) => (
        <Link
          key={tab.id}
          to={`/admin?type=${tab.id}`}
          className={clsx({
            'App-LinkBtn': true,
            active: tab.id === urlParams.get('type'),
          })}
        >
          {tab.icon}
          {tab.label}
        </Link>
      ))}
    </AppCardMenu>
  );
}

export default AdminSidebar;
