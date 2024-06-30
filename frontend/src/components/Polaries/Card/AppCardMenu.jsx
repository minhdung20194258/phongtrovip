import PropTypes from 'prop-types';
import './AppCard.scss';
import clsx from 'clsx';
import {useDispatch, useSelector} from 'react-redux';
import {getIsShowMenu, setShowMenu} from '@/reducers/layout/layoutSlice.js';

AppCardMenu.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
};

function AppCardMenu({className, children, ...props}) {
  const isShow = useSelector(getIsShowMenu);
  const dispatch = useDispatch();

  return (
    <>
      <div
        className={clsx({
          'App-Card': true,
          'App-CardMenu': true,
          [className]: className,
          show: isShow,
        })}
        {...props}
      >
        {children}
      </div>
      {isShow && <div className="CardMenu__Modal" onClick={() => dispatch(setShowMenu(false))} />}
    </>
  );
}

export default AppCardMenu;
