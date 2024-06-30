import BaseCrudService from './base/BaseCrud.service.mjs';
import CommentsModel from '../models/Comments.mjs';
import CommentsRepository from '../repositories/Comments.repository.mjs';

class CommentsService extends BaseCrudService {
  constructor() {
    super(CommentsModel, CommentsRepository);
  }
}

export default new CommentsService();
