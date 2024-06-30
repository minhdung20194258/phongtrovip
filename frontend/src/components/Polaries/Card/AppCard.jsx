import PropTypes from 'prop-types';
import './AppCard.scss';
import clsx from 'clsx';
import AppButton from '@/components/Button/AppButton.jsx';
import AppSkeleton from '@/components/Polaries/Skeleton/AppSkeleton.jsx';
import {isEmpty} from 'lodash';
import {IconChevron} from '@/components/Icons/AppIcon.jsx';
import useEffectWithRef from '@/hooks/useEffectWithRef.jsx';

AppCard.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
  loading: PropTypes.bool,
  primaryAction: PropTypes.shape({
    type: PropTypes.oneOf([
      'primary',
      'secondary',
      'border',
      'border-1',
      'circle',
      'transparent',
      'no-text-1',
      'no-text-2',
      'text',
      'tab',
    ]),
    className: PropTypes.string,
    content: PropTypes.any,
    onAction: PropTypes.func,
    hidden: PropTypes.bool,
  }),
  secondaryAction: PropTypes.shape({
    type: PropTypes.oneOf([
      'primary',
      'secondary',
      'border',
      'border-1',
      'circle',
      'transparent',
      'no-text-1',
      'no-text-2',
      'text',
      'tab',
    ]),
    className: PropTypes.string,
    content: PropTypes.any,
    onAction: PropTypes.func,
    hidden: PropTypes.bool,
  }),
  header: PropTypes.any,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  onClick: PropTypes.func,
  initLoading: PropTypes.bool,
  isBorder: PropTypes.bool,
  isNotShadow: PropTypes.bool,
  isEmpty: PropTypes.bool,
  isUseScrollPagination: PropTypes.bool,
  emptyMess: PropTypes.string,
  paddingInline: PropTypes.number,
  paddingBlock: PropTypes.number,
  multiples: PropTypes.number,
  style: PropTypes.any,
  pageInfo: PropTypes.object,
  nextPage: PropTypes.func,
  prevPage: PropTypes.func,
};

function AppCard({
  className,
  children,
  loading,
  initLoading,
  header,
  size,
  primaryAction: primary,
  secondaryAction: secondary,
  onClick = () => {},
  isEmpty: isEmptyData = false,
  emptyMess = 'Không có bài đăng nào',
  multiples = 5,
  isBorder = false,
  isNotShadow = false,
  isUseScrollPagination = true,
  paddingInline,
  paddingBlock,
  pageInfo,
  nextPage,
  prevPage,
  ...props
}) {
  const isUsePagination = !isEmpty(pageInfo) && nextPage && prevPage;
  const ref = useEffectWithRef((node) => {
    typeof paddingInline !== 'undefined' &&
      node.style.setProperty('--padding-inline', paddingInline + 'px');
    typeof paddingBlock !== 'undefined' &&
      node.style.setProperty('--padding-block', paddingBlock + 'px');
  });
  const classNameCard = clsx({
    'App-Card': true,
    [className]: className,
    [size]: size,
    border: isBorder,
    'no-shadow': isNotShadow,
    'App-Card__Pagination scroll': isUsePagination && isUseScrollPagination,
  });

  const primaryAction = typeof primary === 'function' ? {onAction: primary} : primary;
  const secondaryAction = typeof secondary === 'function' ? {onAction: secondary} : secondary;

  if (initLoading)
    return (
      <div className={classNameCard} ref={ref}>
        <AppSkeleton multiples={multiples} />
      </div>
    );

  return (
    <div className={classNameCard} ref={ref} onClick={onClick} {...props}>
      {(secondary || primary || header || isEmptyData) && (
        <div className="Card__Header">
          {header && <div className="Card__Header--Text">{header}</div>}
          {isEmptyData && <div className="Card__Header--Text">{emptyMess}</div>}
          <div className="Card__Header--Button">
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
      {isUsePagination && (
        <div className="Card__Pagination">
          <AppButton
            type="no-text-1"
            icon={() => <IconChevron type="prev" />}
            onClick={prevPage}
            disabled={!pageInfo.hasPrev}
          />
          <AppButton
            type="no-text-1"
            icon={() => <IconChevron type="next" />}
            onClick={nextPage}
            disabled={!pageInfo.hasNext}
          />
        </div>
      )}
    </div>
  );
}

export default AppCard;
