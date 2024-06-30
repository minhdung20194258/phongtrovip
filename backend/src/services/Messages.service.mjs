import BaseCrudService from './base/BaseCrud.service.mjs';
import MessagesModel from '../models/Messages.mjs';
import MessagesRepository from '../repositories/Messages.repository.mjs';

class MessagesService extends BaseCrudService {
  constructor() {
    super(MessagesModel, MessagesRepository);
  }
}

export default new MessagesService();
