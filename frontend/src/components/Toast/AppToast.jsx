import PropTypes from 'prop-types';
import {IconCricleCheck, IconTriangle, IconClose, IconCricleXmark} from '../Icons/AppIcon';
import {useDispatch} from 'react-redux';
import './AppToast.scss';

function AppToast({type = 'success', content = '', header = '', onClose = () => {}}) {
  const config = {icon: null, header};

  switch (type) {
    case 'success':
      config.icon = IconCricleCheck;
      config.header = 'Thành công';
      break;
    case 'error':
      config.icon = IconCricleXmark;
      config.header = 'Lỗi';
      break;
    case 'warning':
      config.icon = IconTriangle;
      config.header = 'Cảnh báo';
      break;
    default:
      config.icon = IconCricleCheck;
      config.header = 'Thành công';
      break;
  }

  const dispatch = useDispatch();

  return (
    <div className={`toast toast--${type}`}>
      <div className="toast-left">{config.icon()}</div>
      <div className="toast-center">
        <span>{header || config.header}</span>
        {content}
      </div>
      <div className="toast-right">
        <IconClose
          onClick={async () => {
            await onClose();
            dispatch({type: 'toast/hidden'});
          }}
        />
      </div>
    </div>
  );
}

AppToast.propTypes = {
  type: PropTypes.oneOf(['success', 'warning', 'error', 'help', 'info']),
  content: PropTypes.string,
  header: PropTypes.string,
  onClose: PropTypes.func,
};

export default AppToast;
