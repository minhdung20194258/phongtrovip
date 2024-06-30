import BaseCrudService from './base/BaseCrud.service.mjs';
import ReactionsModel from '../models/Reactions.mjs';
import ReactionsRepository from '../repositories/Reactions.repository.mjs';

class ReactionsService extends BaseCrudService {
  constructor() {
    super(ReactionsModel, ReactionsRepository);
  }

  findReact = async ({postId, userId, type}) =>
    ReactionsRepository.findReact({postId, userId, type});
}

export default new ReactionsService();
