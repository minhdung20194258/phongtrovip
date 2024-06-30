import ChatModel from '../models/Chats.mjs';
import BaseCrudRepository from './base/BaseCrud.repository.mjs';
import {LIMIT} from '../const/untils.mjs';

class ChatsRepository extends BaseCrudRepository {
  constructor() {
    super(ChatModel);
  }

  /**
   * @param userId1
   * @param userId2
   * @return {Promise<object | null>}
   */
  findOneChatTwoUser = async (userId1, userId2) => {
    const members = [userId1, userId2];
    return ChatModel.findOne({
      userId2: {$in: members},
      userId1: {$in: members},
    }).populate('userId1 userId2');
  };

  /**
   * @param userId
   * @return {Promise<Array | null>}
   */
  queryByUserId = async (userId) => {
    return ChatModel.find({$or: [{userId1: userId}, {userId2: userId}]})
      .populate('userId1 userId2')
      .sort({createdAt: -1})
      .limit(LIMIT);
  };
}

export default new ChatsRepository();
