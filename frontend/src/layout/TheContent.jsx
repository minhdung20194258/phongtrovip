import AppDialog from '@/components/Dialog/AppDialog';
import AppToast from '@/components/Toast/AppToast';
import {useSelector} from 'react-redux';
import {Outlet} from 'react-router-dom';
import PropTypes from 'prop-types';

TheContent.propTypes = {
  children: PropTypes.any,
};

export default function TheContent({children}) {
  const configDialog = useSelector((state) => state.dialog);
  const configToast = useSelector((state) => state.toast);

  return (
    <div className="App-Content">
      <Outlet />
      {configToast.isShow && <AppToast {...configToast} />}
      {configDialog.isShow && <AppDialog {...configDialog} />}
      {children}
    </div>
  );
}
