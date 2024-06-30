import PropTypes from 'prop-types';
import {useDispatch} from 'react-redux';
import AppButton from '../Button/AppButton';
import {
  IconCricleCheck,
  IconTriangle,
  IconClose,
  IconCricleXmark,
  IconCricleQuestion,
  IconCricleInfo,
} from '../Icons/AppIcon';
import './AppDialog.scss';
import {useState} from 'react';

function AppDialog({
  type = 'warning',
  header = '',
  content = '',
  onCancel = () => {},
  onAccept = () => {},
  onClose = () => {},
  primaryLabel = '',
  url = '',
}) {
  const [loading, setLoading] = useState(false);
  const config = {
    css: '',
    icon: '',
    header: '',
  };
  switch (type) {
    case 'success':
      config.header = 'Thành công';
      config.icon = IconCricleCheck;
      break;
    case 'warning':
      config.header = 'Cảnh báo';
      config.icon = IconTriangle;
      break;
    case 'error':
      config.header = 'Lỗi';
      config.icon = IconCricleXmark;
      break;
    case 'help':
      config.header = 'Xác nhận';
      config.icon = IconCricleQuestion;
      break;
    case 'info':
      config.header = 'Thông tin';
      config.icon = IconCricleInfo;
      break;
  }

  const dispatch = useDispatch();

  return (
    <div className="modal">
      <div className={`dialog dialog--${type}`}>
        <div className="dialog-header">
          <p>{header || config.header}</p>
          <AppButton
            type="no-text-2"
            icon={(props) => IconClose({className: 'w-20', ...props})}
            onClick={async () => {
              setLoading(true);
              await onClose();
              setLoading(false);
              dispatch({type: 'dialog/hidden'});
            }}
          />
        </div>
        <div className="dialog-body">
          <div className="body-icon">{config.icon()}</div>
          <div className="body-text">{content}</div>
        </div>
        <div className="dialog-footer">
          {type !== 'error' && (
            <AppButton
              type="secondary"
              text="Hủy"
              className="mr-8"
              onClick={async () => {
                setLoading(true);
                await onCancel();
                await onClose();
                setLoading(false);
                dispatch({type: 'dialog/hidden'});
              }}
              loading={loading}
            />
          )}
          <AppButton
            text={primaryLabel || 'Đồng ý'}
            onClick={async () => {
              setLoading(true);
              await onAccept();
              await onClose();
              setLoading(false);
              dispatch({type: 'dialog/hidden'});
            }}
            url={url}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

AppDialog.propTypes = {
  type: PropTypes.oneOf(['success', 'warning', 'error', 'help', 'info']),
  header: PropTypes.string,
  icon: PropTypes.any,
  content: PropTypes.any,
  primaryLabel: PropTypes.any,
  url: PropTypes.any,
  loading: PropTypes.bool,
  onCancel: PropTypes.func,
  onAccept: PropTypes.func,
  onClose: PropTypes.func,
};

export default AppDialog;
