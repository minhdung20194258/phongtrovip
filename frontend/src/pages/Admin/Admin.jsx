import AdminSidebar from '@/pages/Admin/AdminSidebar/AdminSidebar.jsx';
import {useLocation} from 'react-router-dom';
import Tooltips from '@/pages/Admin/Tooltips/Tooltips.jsx';
import Accounts from '@/pages/Admin/Accounts/Accounts.jsx';
import {useMemo} from 'react';
import './Admin.scss';
import Posts from '@/pages/Admin/Posts/Posts.jsx';
import {useSelector} from 'react-redux';
import {getLoadingInitUser} from '@/reducers/authSlice.js';
import AdminSkeleton from '@/pages/Admin/AdminSkeleton.jsx';
import Reviews from '@/pages/Admin/Reviews/Reviews.jsx';
import Reports from '@/pages/Admin/Reports/Reports.jsx';
import RequestsTransfers from '@/pages/Admin/RequestsTranfers/RequestsTransfers.jsx';

Admin.propTypes = {};

function Admin() {
  const location = useLocation();
  const loading = useSelector(getLoadingInitUser);
  const urlParams = new URLSearchParams(location.search);
  const type = urlParams.get('type');
  const Content = useMemo(() => {
    switch (type) {
      case 'tooltips':
        return Tooltips;
      case 'accounts':
        return Accounts;
      case 'accounts-staff':
        return () => Accounts({isStaff: true});
      case 'posts':
        return Posts;
      case 'reviews':
        return Reviews;
      case 'reports':
        return Reports;
      case 'requests-transfer':
        return RequestsTransfers;
      default:
        return Accounts;
    }
  }, [type]);
  if (loading) return <AdminSkeleton />;

  return (
    <div className="d-flex">
      <AdminSidebar />
      <Content />
    </div>
  );
}

export default Admin;
