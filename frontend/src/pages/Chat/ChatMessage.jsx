import {useEffect, useRef, useState} from 'react';
import clsx from 'clsx';
import {AppButton, AppInput} from '@/components/index.jsx';
import {IconImage, IconSend, IconTrash} from '@/components/Icons/AppIcon.jsx';
import {useSelector} from 'react-redux';
import {getChatLists, getNewMessage, getSendMessage} from '@/reducers/socketSlice.js';
import {getUserId} from '@/reducers/authSlice.js';
import useKeyboard from '@/hooks/useKeyboard.jsx';
import useScroll from '@/hooks/useScroll.jsx';
import PropTypes from 'prop-types';
import usePaginate from '@/hooks/api/usePaginate.jsx';
import AppInfiniteScroll from '@/components/InfiniteScroll/AppInfiniteScroll.jsx';
import moment from 'moment/moment.js';

ChatMessage.propTypes = {
  chatId: PropTypes.string,
};

function ChatMessage({chatId}) {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const scrollRef = useRef();
  const inputRef = useRef();
  const userId = useSelector(getUserId);
  const sendMessage = useSelector(getSendMessage);
  const newMessage = useSelector(getNewMessage);
  const chatLists = useSelector(getChatLists);
  const receive = chatLists.find((chat) => chat._id === chatId)?.receive || {};

  const {data, pageInfo, nextPage, fetched, setData, page} = usePaginate({
    url: `/messages/query`,
    keepPreviousData: true,
    defaultData: [],
    defaultQueries: {
      limit: 20,
      field: `chatId:${chatId}`,
    },
  });

  useEffect(() => {
    if (newMessage.chatId !== chatId) return () => {};

    setData((prev) => [...prev, newMessage]);
  }, [chatId, newMessage, setData]);

  const {handleScroll} = useScroll(scrollRef, false);

  useEffect(() => {
    if (!fetched) return () => {};
    setTimeout(() => handleScroll(), 100);
  }, [fetched]);

  const handeSendInfo = () => {
    if (image) {
      sendMessage({image, chatId, receiverId: receive._id});
      setImage(null);
      return setTimeout(() => handleScroll(), 100);
    }

    if (!message) return;
    sendMessage({message, chatId, receiverId: receive._id});
    setMessage('');
    setTimeout(() => handleScroll(), 100);
  };

  const handleImportFile = (e) => {
    setImage(e.target.files[0]);
    console.log(e.target.files[0]);
  };
  useKeyboard({Enter: handeSendInfo}, inputRef);

  return (
    <div className="App-ChatMessage">
      <AppInfiniteScroll
        fetchMore={() => nextPage()}
        className="ChatMessage__ListMessage"
        hasMore={pageInfo.hasNext}
        endMessage={page === 1 || !page ? '' : 'Bạn đang ở cuối trang'}
      >
        <div ref={scrollRef}></div>
        {data
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((mess) => (
            <ChatMessageText
              time={mess.createdAt}
              message={mess.content}
              mySender={mess.senderId === userId}
              image={mess.image}
              key={mess._id}
            />
          ))}
      </AppInfiniteScroll>

      <div className="d-flex w-full gap-12" ref={inputRef}>
        {image ? (
          <div className="ChatPreview__Image">
            <img src={URL.createObjectURL(image)} alt="" />
            <AppButton icon={IconTrash} type="no-text-1" onClick={() => setImage(null)} />
          </div>
        ) : (
          <AppInput textarea={true} value={message} onChange={(val) => setMessage(val)} />
        )}
        <input type="file" id="MessageFile" onChange={handleImportFile} style={{display: 'none'}} />
        <label htmlFor="MessageFile">
          <div className="btn btn--no-text-2">
            <IconImage className="color-500" />
          </div>
        </label>
        <AppButton
          icon={() => IconSend({className: 'color-500'})}
          type="no-text-2"
          onClick={() => handeSendInfo()}
        />
      </div>
    </div>
  );
}

// eslint-disable-next-line react/prop-types
function ChatMessageText({message, mySender, time, image = {}}) {
  return (
    <div
      className={clsx({
        ChatMessageText: true,
        'ChatMessageText--MySender': mySender,
      })}
    >
      {message && <div>{message}</div>}
      {image.url && (
        <div className="ChatMessageText__Image">
          <img src={image?.url} alt={''} />{' '}
        </div>
      )}
      <p>{moment(time).format('HH:mm')}</p>
    </div>
  );
}

export default ChatMessage;
