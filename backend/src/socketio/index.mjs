import {Server} from 'socket.io';
import ChatsService from '../services/Chats.service.mjs';
import MessagesService from '../services/Messages.service.mjs';

/**
 * @param server {*}
 */
export default function configSocketIo(server) {
  let onlineUsers = [];
  const io = new Server(server, {cors: process.env.FRONTEND_URL, maxHttpBufferSize: 1e8});

  io.on('connection', (socket) => {
    socket.on('addOnlineUsers', async (userId) => {
      if (!onlineUsers.some((user) => user.userId === userId)) {
        onlineUsers.push({userId, socketId: socket.id});
      }

      io.emit('getOnlineUsers', onlineUsers);
      const chatList = await ChatsService.queryByUserId(userId);
      socket.emit('getChatLists', chatList);
    });

    socket.on('sendMessage', async ({message, senderId, receiverId, image}) => {
      const {messageDoc, listChatSender, listChatReceiver} = image
        ? await ChatsService.handleSendImage({
            senderId,
            receiverId,
            image,
          })
        : await ChatsService.handleSendMessage({
            message,
            senderId,
            receiverId,
          });

      const receiveSocket = onlineUsers.find((user) => user.userId === receiverId);
      if (receiveSocket) {
        io.to(receiveSocket.socketId).emit('newMessage', messageDoc);
        io.to(receiveSocket.socketId).emit('getChatLists', listChatReceiver);
      }
      socket.emit('newMessage', messageDoc);
      socket.emit('getChatLists', listChatSender);
    });

    socket.on('getChatMessages', async ({chatId}) => {
      const {docs} = await MessagesService.findManyByField({
        field: `chatId:${chatId}`,
      });
      socket.emit('newMessage', docs.reverse());
    });

    socket.on('disconnect', async () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      io.emit('getOnlineUsers', onlineUsers);
    });
  });
}
