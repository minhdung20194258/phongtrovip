import MessagesModel from '../models/Messages.mjs';
import BaseCrudController from './base/BaseCrud.controller.mjs';
import MessagesRepository from '../repositories/Messages.repository.mjs';

class MessagesController extends BaseCrudController {
  constructor() {
    super(MessagesModel, MessagesRepository);
  }
}

export default new MessagesController();
