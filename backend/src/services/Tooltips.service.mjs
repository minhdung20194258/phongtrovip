import BaseCrudService from './base/BaseCrud.service.mjs';
import TooltipsModel from '../models/Tooltips.mjs';
import TooltipsRepository from '../repositories/Tooltips.repository.mjs';

class TooltipsService extends BaseCrudService {
  constructor() {
    super(TooltipsModel, TooltipsRepository);
  }
}

export default new TooltipsService();
