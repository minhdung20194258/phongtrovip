import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {getUser} from '@/reducers/authSlice.js';
import {AppInput} from '@/components/index.jsx';
import {IconSend} from '@/components/Icons/AppIcon.jsx';
import clsx from 'clsx';

PostItemDetailInput.propTypes = {
  className: PropTypes.string,
  errorMess: PropTypes.string,
  value: PropTypes.any,
  setValue: PropTypes.func,
  handleChange: PropTypes.func,
  disabled: PropTypes.bool,
  helpText: PropTypes.string,
};

function PostItemDetailInput({
  value,
  setValue,
  handleChange,
  errorMess,
  className,
  disabled = false,
  helpText = '',
}) {
  const user = useSelector(getUser);

  return (
    <div
      className={clsx({
        PostItemReaction__Item: true,
        'PostItemReaction__Item--Input': true,
        [className]: className,
      })}
    >
      <img src={user?.avatar?.url || '/default-avatar.png'} alt="" />
      <AppInput
        textarea={true}
        value={value}
        onChange={(val) => setValue(val)}
        icon={() => <IconSend onClick={() => user._id && !disabled && handleChange()} />}
        helpText={helpText || (!user._id ? 'Bạn cần đăng nhập để thực hiện chức năng này' : '')}
        disabled={!user._id || disabled}
        errorMess={errorMess}
      />
    </div>
  );
}

export default PostItemDetailInput;
