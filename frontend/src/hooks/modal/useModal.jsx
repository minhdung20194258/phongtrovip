import PropTypes from 'prop-types';
import AppButton from '@/components/Button/AppButton.jsx';
import {useState} from 'react';
import {IconClose} from '@/components/Icons/AppIcon.jsx';
import './styles/AppModal.scss';
import clsx from 'clsx';
import {isEmpty} from 'lodash';

useModal.propTypes = {
  header: PropTypes.string,
  loading: PropTypes.bool,
  isClose: PropTypes.bool,
  handleClose: PropTypes.func,
  children: PropTypes.any,
  footer: PropTypes.any,
  type: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
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
    loading: PropTypes.bool,
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
    loading: PropTypes.bool,
  }),
  className: PropTypes.string,
  content: PropTypes.any,
};

/**
 * @param header
 * @param subHeader
 * @param isClose
 * @param loading
 * @param primaryAction {ButtonAction | {}}
 * @param secondaryAction {ButtonAction | {}}
 * @param type
 * @param handleClose
 * @param className
 * @param children
 * @param style
 * @param content
 * @return {{openModal: (function(): void), closeModal: (function(): void), open: boolean, modal: (false|JSX.Element)}}
 */
function useModal({
  header,
  subHeader,
  isClose = true,
  loading = false,
  primaryAction = {},
  secondaryAction = {},
  type = 'md',
  handleClose,
  className = '',
  style = {},
  children,
  content,
}) {
  const [open, setOpen] = useState(false);

  const closeModal = () => setOpen(false);
  const openModal = () => setOpen(true);

  const modal = open && (
    <div
      className={clsx({
        'App-ViewModal': true,
        modal: true,
        [type]: type,
        [className]: className,
      })}
      style={style}
    >
      <div className="modal-content">
        <div className="modal-content__header">
          <AppButton
            className="modal-close"
            type="no-text-2"
            icon={(props) => IconClose({className: 'w-20', ...props})}
            onClick={async () => {
              if (typeof handleClose === 'function') {
                await handleClose();
              }
              isClose && closeModal();
            }}
          />
          <div className="modal-content__header--item">
            {header && <div className="header">{header}</div>}
            {subHeader && <div>{subHeader}</div>}
          </div>
        </div>
        <div className="modal-content__body">{children || content}</div>
        <div className="modal-content__footer">
          {(!isEmpty(secondaryAction) || handleClose) && (
            <AppButton
              type={secondaryAction.type || 'secondary'}
              className={clsx({
                'mr-8': true,
                [secondaryAction.className]: secondaryAction.className,
              })}
              onClick={async () => {
                if (typeof handleClose === 'function') {
                  await handleClose();
                }
                if (typeof secondaryAction.onAction === 'function') {
                  await secondaryAction.onAction();
                }
                isClose && closeModal();
              }}
              loading={secondaryAction.loading || loading}
              {...(secondaryAction.icon ? {icon: secondaryAction.icon} : {})}
            >
              {secondaryAction.content || 'Hủy'}
            </AppButton>
          )}
          {!isEmpty(primaryAction) && (
            <AppButton
              type={primaryAction.type || 'primary'}
              className={clsx({
                'mr-8': true,
                [primaryAction.className]: primaryAction.className,
              })}
              onClick={async () => {
                if (typeof primaryAction.onAction === 'function') {
                  const resp = await primaryAction.onAction();
                  if (resp && isClose) return closeModal();
                }
                // isClose && closeModal();
              }}
              loading={primaryAction.loading || loading}
              {...(primaryAction.icon ? {icon: primaryAction.icon} : {})}
            >
              {primaryAction.content || 'Lưu'}
            </AppButton>
          )}
        </div>
      </div>
    </div>
  );

  return {open, openModal, modal, closeModal};
}

export default useModal;
