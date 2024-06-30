import {Navigate, useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {getIsStaff, getIsAuth, getLoadingInitUser, getUser} from '@/reducers/authSlice.js';
import TheLayout from '@/layout/index.jsx';
import TheSkeleton from '@/layout/TheSkeleton.jsx';

const requireAuth = [
  '/test',
  '/test/v',
  '/posts/new',
  '/posts/edit',
  '/user/profile',
  '/message',
  '/payments',
];

export default function ValidationRouter() {
  const loading = useSelector(getLoadingInitUser);
  const isAuth = useSelector(getIsAuth);
  const isStaff = useSelector(getIsStaff);
  const user = useSelector(getUser);
  const {pathname} = useLocation();

  if (loading) {
    return <TheSkeleton />;
  }

  if (!isAuth && requireAuth.includes(pathname)) {
    return <Navigate to="/sign-in" replace={true} />;
  }
  if (isAuth && pathname === '/sign-in') {
    return <Navigate to="/" replace={true} />;
  }
  if (!isStaff && pathname.includes('/admin')) {
    return <Navigate to="/" replace={true} />;
  }
  return <TheLayout />;
}
