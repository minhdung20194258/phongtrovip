import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getUser} from '@/reducers/authSlice.js';
import {
  getOnlineUsers,
  setChatLists,
  setNewMessage,
  setOnlineUsers,
  setSendMessage,
} from '@/reducers/socketSlice.js';
import {io} from 'socket.io-client';

useChatSocket.propTypes = {};

function useChatSocket() {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const onlineUsers = useSelector(getOnlineUsers);

  useEffect(() => {
    if (!user._id) return () => socket?.connected && socket.disconnect();
    if (socket?.connected) return () => {};

    const newSocket = io(import.meta.env.VITE_BACKEND_URL || '');
    newSocket.emit('addOnlineUsers', user._id);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [user._id]);

  useEffect(() => {
    if (!user._id || !socket) return () => {};

    socket.on('getOnlineUsers', (res) => dispatch(setOnlineUsers(res)));
    return () => {
      socket.off('getOnlineUsers');
    };
  }, [dispatch, socket, user._id]);

  useEffect(() => {
    if (!user._id || !socket) return () => {};

    socket.on('getChatLists', (res) => dispatch(setChatLists(res)));
    return () => {
      socket.off('getChatLists');
    };
  }, [dispatch, socket, user._id]);

  useEffect(() => {
    if (!user._id || !socket) return () => {};

    const senderFunc = ({message, receiverId, image}) => {
      socket.emit('sendMessage', {message, senderId: user._id, receiverId, image});
    };

    dispatch(setSendMessage(senderFunc));
  }, [dispatch, socket, user._id]);

  useEffect(() => {
    if (!user._id || !socket) return () => {};

    socket.on('newMessage', (res) => dispatch(setNewMessage(res)));
    return () => {
      socket.off('newMessage');
    };
  }, [dispatch, socket, user._id]);

  return {socket, onlineUsers};
}

export default useChatSocket;
