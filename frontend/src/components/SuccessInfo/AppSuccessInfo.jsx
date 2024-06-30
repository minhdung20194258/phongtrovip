import {IconCheck} from '@/components/Icons/AppIcon.jsx';
import PropTypes from 'prop-types';
import './AppSuccessInfo.scss';
import clsx from 'clsx';

AppSuccessInfo.propTypes = {
  message: PropTypes.any,
  size: PropTypes.oneOf(['sm', 'lg']),
  children: PropTypes.any,
};

function AppSuccessInfo({message, children, size}) {
  return (
    <div className="App-SuccessInfo">
      <IconCheck
        className={clsx({
          SuccessInfo__Icon: true,
          [size]: size,
        })}
      />
      <div>{message || children}</div>
    </div>
  );
}

export default AppSuccessInfo;
