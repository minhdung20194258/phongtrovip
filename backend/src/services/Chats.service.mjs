import BaseCrudService from './base/BaseCrud.service.mjs';
import ChatsModel from '../models/Chats.mjs';
import ChatsRepository from '../repositories/Chats.repository.mjs';
import MessagesService from './Messages.service.mjs';
import {uploadBufferImage} from './cloud/cloudinary.service.mjs';

class ChatsService extends BaseCrudService {
  constructor() {
    super(ChatsModel, ChatsRepository);
  }

  handleSendImage = async ({image, senderId, receiverId}) => {
    const [chat, imageCloud] = await Promise.all([
      this.createOrUpdateOne({receiverId, senderId, content: 'Đã gửi một ảnh'}),
      uploadBufferImage(image),
    ]);
    const messageDoc = await MessagesService.createOne({
      senderId,
      chatId: chat._id,
      image: imageCloud,
    });
    const [listChatSender, listChatReceiver] = await Promise.all([
      this.queryByUserId(senderId),
      this.queryByUserId(receiverId),
    ]);

    return {messageDoc, listChatSender, listChatReceiver};
  };

  handleSendMessage = async ({message, senderId, receiverId}) => {
    const chat = await this.createOrUpdateOne({receiverId, senderId, content: message});
    const messageDoc = await MessagesService.createOne({
      senderId,
      content: message,
      chatId: chat._id,
    });
    const [listChatSender, listChatReceiver] = await Promise.all([
      this.queryByUserId(senderId),
      this.queryByUserId(receiverId),
    ]);

    return {messageDoc, listChatSender, listChatReceiver};
  };

  createOrUpdateOne = async ({receiverId = '', senderId = '', content = ''}) => {
    const exist = await ChatsRepository.findOneChatTwoUser(receiverId, senderId);
    const lastMessage = {content, senderId};

    if (exist) return ChatsRepository.updateOne(exist._id, {lastMessage});
    return ChatsRepository.createOne({userId1: senderId, userId2: receiverId, lastMessage});
  };

  queryByUserId = async (userId) => {
    const chats = await ChatsRepository.queryByUserId(userId);

    return chats?.map((chat) => {
      const chatObj = chat.toObject();
      const {userId1 = {}, userId2 = {}} = chatObj;

      if (userId1._id?.toString() === userId) {
        return {...chatObj, members: [userId1._id, userId2._id], receive: userId2}; //another user
      }
      if (userId2._id?.toString() === userId) {
        return {...chatObj, members: [userId1._id, userId2._id], receive: userId1}; //another user
      }

      return chat.toObject();
    });
  };
}

export default new ChatsService();
