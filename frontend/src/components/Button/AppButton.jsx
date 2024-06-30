import clsx from 'clsx';
import PropTypes from 'prop-types';
import './AppButton.scss';
import {useNavigate} from 'react-router-dom';
import AppLoading from '@/components/Loading/AppLoading.jsx';
import React from 'react';

AppButton.propTypes = {
  ...React.ButtonHTMLAttributes,
  type: PropTypes.oneOf([
    'primary',
    'secondary',
    'border',
    'border-1',
    'circle',
    'transparent',
    'no-text-1',
    'no-text-2',
    'no-text-3',
    'text',
    'tab',
  ]),
  title: PropTypes.string,
  url: PropTypes.string,
  icon: PropTypes.func,
  loading: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'lg', 'md']),
  isActive: PropTypes.bool,
  fullWidth: PropTypes.bool,

  disabled: PropTypes.bool,
  text: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  props: PropTypes.any,
  children: PropTypes.any,
};

function AppButton({
  icon,
  size,
  loading = false,
  text = '',
  type = 'primary',
  url = '',
  fullWidth = false,

  isActive = false,
  onClick = (_) => {},
  className,
  children,
  ...props
}) {
  const navigate = useNavigate();
  const handleClick = async (e) => {
    await onClick(e);
    if (url) navigate(url);
  };

  return (
    <button
      className={clsx({
        btn: true,
        [className]: className,
        [`btn--${type}`]: true,
        lg: size === 'lg',
        sm: size === 'sm',
        active: isActive,
        fullWidth: fullWidth,
      })}
      onClick={handleClick}
      disabled={!!(props.disabled | loading)}
      {...props}
    >
      {icon && icon()}
      {(text || children) && <div className="btn__content">{text ? text : children}</div>}
      {loading && <AppLoading />}
    </button>
  );
}

export default AppButton;
