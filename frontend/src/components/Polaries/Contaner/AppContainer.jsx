import PropTypes from 'prop-types';
import './AppContainer.scss';
import clsx from 'clsx';
import AppButton from '../../Button/AppButton.jsx';
import {isUndefined} from 'lodash';
import useEffectWithRef from '@/hooks/useEffectWithRef.jsx';

AppContainer.propTypes = {
  className: PropTypes.string,
  header: PropTypes.any,
  children: PropTypes.any,
  headerRight: PropTypes.any,
  primaryAction: PropTypes.any,
  loading: PropTypes.bool,
  secondaryAction: PropTypes.any,
  paddingInline: PropTypes.number,
  paddingBlock: PropTypes.number,
};

/**
 * @param className
 * @param paddingInline
 * @param paddingBlock
 * @param children
 * @param primary {ButtonAction | React.ReactNode | function}
 * @param secondary {ButtonAction | React.ReactNode | function}
 * @param header
 * @param headerRight
 * @param loading
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
function AppContainer({
  className,
  paddingInline,
  paddingBlock,
  children,
  primaryAction: primary,
  secondaryAction: secondary,
  loading,
  header,
  headerRight,
  ...props
}) {
  const primaryAction = typeof primary === 'function' ? {onAction: primary} : primary;
  const secondaryAction = typeof secondary === 'function' ? {onAction: secondary} : secondary;

  const ref = useEffectWithRef((node) => {
    typeof paddingInline !== 'undefined' &&
      node.style.setProperty('--padding-inline', paddingInline + 'px');
    typeof paddingBlock !== 'undefined' &&
      node.style.setProperty('--padding-block', paddingBlock + 'px');
  });

  return (
    <div ref={ref} className={clsx({'App-Container': true, [className]: className})} {...props}>
      {(secondary || primary || header || headerRight) && (
        <div className="Container__Header">
          {header && <div className="Container__Header--Text">{header}</div>}
          {headerRight}
          <div className="Container__Header--Button">
            {secondary && (
              <AppButton
                type={secondaryAction.type || 'secondary'}
                className={clsx({
                  'mr-8': true,
                  [secondaryAction.className]: secondaryAction.className,
                })}
                onClick={() => secondaryAction.onAction()}
                loading={loading}
                text={secondaryAction.content || 'Hủy bỏ'}
              />
            )}
            {primary && (
              <AppButton
                type={primaryAction.type || 'primary'}
                className={clsx({[primaryAction.className]: primaryAction.className})}
                onClick={() => primaryAction.onAction()}
                loading={loading}
                text={primaryAction.content || 'Lưu'}
              />
            )}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

export default AppContainer;
