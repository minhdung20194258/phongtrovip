import {useState} from 'react';
import PropTypes from 'prop-types';
import {AppButton, AppInput, AppSeperateText} from '@/components/index.jsx';
import usePaginate from '@/hooks/api/usePaginate.jsx';
import PostItem from '@/pages/Post/PostItem/PostItem.jsx';
import MDEditor from '@uiw/react-md-editor';
import {useSelector} from 'react-redux';
import {getSendMessage} from '@/reducers/socketSlice.js';
import {getUserId} from '@/reducers/authSlice.js';
import {useParams} from 'react-router-dom';

UserPublicContent.propTypes = {
  user: PropTypes.object,
};

function UserPublicContent({user = {}}) {
  const {userPublicId} = useParams();
  const userId = useSelector(getUserId);
  const {data, PaginateButtonGroup} = usePaginate({
    url: '/posts/filter',
    defaultData: [],
    defaultQueries: {
      limit: 20,
      userId: userPublicId,
      isShowForUser: true,
    },
    keepPreviousData: true,
  });
  const [message, setMessage] = useState('');
  const sendMessage = useSelector(getSendMessage);

  const handleSendMessage = () => {
    if (!message || userId === user._id) return;
    sendMessage({message, receiverId: user._id});
    setMessage('');
  };

  return (
    <div className="App-UserPublicContent">
      <div className={'d-flex-col'}>
        <div className="fw-700 fs-24">Thông tin về {user.fullName}</div>
        <MDEditor.Markdown source={user.description} />
      </div>
      <div className="d-flex-col gap-8">
        <div className="fw-700 fs-20">Liên hệ</div>
        <AppInput textarea={true} classNameInput="h-100" value={message} onChange={setMessage} />
        <AppButton
          type="border"
          text="Gửi tin nhắn"
          size="lg"
          className="w-200"
          onClick={handleSendMessage}
        />
      </div>
      <AppSeperateText className="pb-48 pt-48" />
      <div className={'d-flex-col gap-24'}>
        <div className="fw-700 fs-24">Mục cho thuê của {user.fullName}</div>
        {data.map((post) => (
          <PostItem post={post} key={post._id} />
        ))}
        <div className="d-center w-full">
          <PaginateButtonGroup />
        </div>
      </div>
    </div>
  );
}

export default UserPublicContent;
