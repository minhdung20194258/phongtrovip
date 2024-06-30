import {useMemo} from 'react';
import clsx from 'clsx';
import {useSelector} from 'react-redux';
import {getUserId} from '@/reducers/authSlice.js';
import PropTypes from 'prop-types';

ChatUser.propTypes = {
  receive: PropTypes.any,
  lastMessage: PropTypes.any,
  active: PropTypes.any,
  onClick: PropTypes.func,
};

function ChatUser({receive, lastMessage, active, onClick = () => {}}) {
  const userId = useSelector(getUserId);
  const lastMessageStr = useMemo(() => {
    if (lastMessage.senderId === userId) return `Bạn: ${lastMessage.content}`;
    return `${receive?.fullName.substring(0, 5).trim()}...: ${lastMessage.content}`;
  }, [lastMessage, userId]);

  return (
    <div
      className={clsx({
        'App-ChatRoom': true,
        active: active,
      })}
      onClick={onClick}
    >
      <img src={receive?.avatar?.url || '/default-avatar.png'} alt="" />
      <div className="ChatRoom__Info">
        <div className="fs-16 fw-600">{receive?.fullName}</div>
        <div className="color-grey-600 fs-12">{lastMessageStr}</div>
      </div>
    </div>
  );
}

export default ChatUser;
