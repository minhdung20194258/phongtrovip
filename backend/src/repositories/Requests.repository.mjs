import RequestsModel from '../models/Requests.mjs';
import BaseCrudRepository from './base/BaseCrud.repository.mjs';

class RequestsRepository extends BaseCrudRepository {
  constructor() {
    super(RequestsModel);
  }
}

export default new RequestsRepository();
