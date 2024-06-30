import MessageModel from '../models/Messages.mjs';
import BaseCrudRepository from './base/BaseCrud.repository.mjs';

class MessagesRepository extends BaseCrudRepository {
  constructor() {
    super(MessageModel);
  }
}

export default new MessagesRepository();
