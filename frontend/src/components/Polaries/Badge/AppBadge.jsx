import PropTypes from 'prop-types';
import './AppBadge.scss';
import {useMemo} from 'react';
import clsx from 'clsx';

AppBadge.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
  nowrap: PropTypes.bool,
  align: PropTypes.oneOf(['center']),
  tone: PropTypes.oneOf(['error', 'info', 'success', 'disabled', 'info-bold']),
  size: PropTypes.oneOf(['md', 'lg', 'xl']),
};

function AppBadge({children, tone = 'error', className, align, size, fullWidth = false, nowrap}) {
  const badgeClass = useMemo(() => {
    switch (tone) {
      case 'error':
        return 'App-Badge--Error';
      case 'info':
        return 'App-Badge--Info';
      case 'info-bold':
        return 'App-Badge--InfoBold';
      case 'success':
        return 'App-Badge--Success';
      case 'disabled':
        return 'App-Badge--Disabled';
      default:
        return 'App-Badge--Error';
    }
  }, [tone]);

  return (
    <div
      className={clsx({
        'App-Badge': true,
        [badgeClass]: true,
        [className]: className,
        [align]: align,
        [size]: size,
        fullWidth: fullWidth,
        nowrap: nowrap,
      })}
    >
      {children}
    </div>
  );
}

export default AppBadge;
