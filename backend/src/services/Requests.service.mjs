import BaseCrudService from './base/BaseCrud.service.mjs';
import RequestsModel from '../models/Requests.mjs';
import RequestsRepository from '../repositories/Requests.repository.mjs';

class RequestsService extends BaseCrudService {
  constructor() {
    super(RequestsModel, RequestsRepository);
  }
}

export default new RequestsService();
