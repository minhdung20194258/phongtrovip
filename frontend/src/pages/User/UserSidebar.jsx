import PropTypes from 'prop-types';
import {Link, useLocation} from 'react-router-dom';
import clsx from 'clsx';
import {AppCardMenu} from '@/components/index.jsx';

UserSidebar.propTypes = {
  tabs: PropTypes.array,
};

function UserSidebar({tabs}) {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);

  return (
    <AppCardMenu className="w-300">
      {tabs.map((tab) => (
        <Link
          key={tab.type}
          to={`/user/profile?type=${tab.type}`}
          className={clsx({
            'App-LinkBtn': true,
            active: tab.type === urlParams.get('type') || (!tab.type && !urlParams.get('type')),
          })}
        >
          {tab.icon}
          {tab.title}
        </Link>
      ))}
    </AppCardMenu>
  );
}

export default UserSidebar;
