import {AppCard} from '@/components/index.jsx';
import './Chat.scss';
import ChatMessage from '@/pages/Chat/ChatMessage.jsx';
import {useNavigate, useParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {getChatLists} from '@/reducers/socketSlice.js';
import ChatUser from '@/pages/Chat/ChatUser.jsx';

Chat.propTypes = {};

function Chat() {
  const params = useParams();
  const navigate = useNavigate();
  const chatList = useSelector(getChatLists);

  return (
    <div className="App-Chat">
      <AppCard size="sm" isEmpty={!chatList.length} emptyMess="Không có tin nhắn nào">
        <div className="App-ChatList">
          {chatList.map((chat) => (
            <ChatUser
              key={chat._id + 'chat'}
              receive={chat.receive}
              active={chat._id === params.chatId}
              lastMessage={chat.lastMessage}
              onClick={() => navigate(`/message/${chat._id}`)}
            />
          ))}
        </div>
      </AppCard>
      <AppCard className="w-full">
        {params.chatId && <ChatMessage chatId={params.chatId} key={params.chatId + 'chat-mess'} />}
      </AppCard>
    </div>
  );
}

export default Chat;
