import PropTypes from 'prop-types';
import {AppBadge, AppToggle} from '@/components/index.jsx';

AppSettingToggle.propTypes = {
  checked: PropTypes.bool,
  loading: PropTypes.bool,
  useToggle: PropTypes.bool,
  title: PropTypes.any,
  checkedMess: PropTypes.any,
  uncheckedMess: PropTypes.any,
  handleToggle: PropTypes.func,
  children: PropTypes.any,
  hasChecked: PropTypes.bool,
};

function AppSettingToggle({
  checked = false,
  title,
  checkedMess,
  uncheckedMess,
  handleToggle = (_) => {},
  loading,
  useToggle = true,
  children,
}) {
  return (
    <div className="d-flex jc-sb ai-s gap-16">
      <div className="d-flex gap-6 ai-s mb-12">
        <div className="fw-700 fs-20">{title}</div>
        <AppBadge tone={checked ? 'success' : 'disabled'} nowrap={true}>
          {checked ? checkedMess || 'Bật' : uncheckedMess || 'Tắt'}
        </AppBadge>
      </div>
      <div className="d-flex ai-c gap-16">
        {children}
        {useToggle && (
          <AppToggle
            checked={checked}
            setChecked={(checked) => handleToggle(checked)}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}

export default AppSettingToggle;
