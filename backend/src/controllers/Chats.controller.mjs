import ChatsModel from '../models/Chats.mjs';
import BaseCrudController from './base/BaseCrud.controller.mjs';
import ChatsService from '../services/Chats.service.mjs';
import ChatsRepository from '../repositories/Chats.repository.mjs';

class ChatsController extends BaseCrudController {
  constructor() {
    super(ChatsModel, ChatsRepository);
  }

  queryByUserId = async (req, res) => {
    const {userId} = req.query;

    return res.status(200).json({
      success: true,
      data: await ChatsService.queryByUserId(userId),
    });
  };
}

export default new ChatsController();
