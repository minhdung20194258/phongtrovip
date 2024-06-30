import OtpsModel from '../models/Otps.mjs';
import BaseCrudRepository from './base/BaseCrud.repository.mjs';

class OtpsRepository extends BaseCrudRepository {
  constructor() {
    super(OtpsModel);
  }
}

export default new OtpsRepository();
