import PropTypes from 'prop-types';
import './AppToggle.scss';
import clsx from 'clsx';

AppToggle.propTypes = {
  checked: PropTypes.bool,
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  setChecked: PropTypes.func,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  label: PropTypes.any,
};

function AppToggle({
  loading = false,
  checked = false,
  setChecked = (_) => {},
  size = 'md',
  label = '',
  disabled = false,
}) {
  return (
    <div className="App-Toggle">
      {label && <div className="App-Toggle__Label">{label}</div>}
      <label
        className={clsx({
          toggle: true,
          [size]: size,
        })}
      >
        {loading && (
          <div className="App-Toggle__Loading">
            <div className="loader"></div>
          </div>
        )}
        <input
          type="checkbox"
          checked={checked}
          onClick={(e) => setChecked(e.target.checked)}
          onChange={() => {}}
          disabled={disabled}
        />
        <span className="slider" />
      </label>
    </div>
  );
}

export default AppToggle;
