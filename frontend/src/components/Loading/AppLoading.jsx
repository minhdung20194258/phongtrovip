import './AppLoading.scss';
import clsx from 'clsx';
import PropTypes from 'prop-types';

function AppLoading({className}) {
  return (
    <div
      className={clsx({
        loader: true,
        [className]: className,
      })}
    />
  );
}

AppLoading.propTypes = {
  className: PropTypes.string,
};

export default AppLoading;
