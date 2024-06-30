import AppInput from '@/components/Input/AppInput.jsx';
import useModal from '@/hooks/modal/useModal.jsx';
import AppBadge from '@/components/Polaries/Badge/AppBadge.jsx';

useChangePasswordForm.propTypes = {};

function useChangePasswordForm({
  input = {},
  editing = false,
  handleClose = () => {},
  handleSave = () => {},
  handleChange = (_, __) => {},
  validations = {},
  errorBE = '',
  isAdmin = false,
}) {
  const {open, modal, closeModal, openModal} = useModal({
    header: 'Đổi mật khẩu',
    type: 'sm',
    loading: editing,
    handleClose,
    primaryAction: {
      onAction: () => handleSave(),
    },
    children: (
      <>
        {!isAdmin && (
          <AppInput
            label="Mật khẩu cũ"
            placeholder="Nhập mật khẩu cũ của bạn"
            type="password"
            value={input.oldPassword}
            onChange={(val) => handleChange('oldPassword', val)}
            errorMess={validations.oldPassword}
          />
        )}
        <AppInput
          label="Mật khẩu mới"
          placeholder="Nhập mật khẩu mới của bạn"
          type="password"
          onChange={(val) => handleChange('newPassword', val)}
          value={input.newPassword}
          errorMess={validations.newPassword}
        />
        <AppInput
          label="Nhập lại mật khẩu"
          placeholder="Nhập lại mật khẩu mới"
          type="password"
          onChange={(val) => handleChange('confirmPassword', val)}
          value={input.confirmPassword}
          errorMess={validations.confirmPassword}
        />
        {errorBE && (
          <AppBadge tone="error" fullWidth={true} size="lg">
            {errorBE}
          </AppBadge>
        )}
      </>
    ),
  });

  return {open, modal, closeModal, openModal};
}

export default useChangePasswordForm;
