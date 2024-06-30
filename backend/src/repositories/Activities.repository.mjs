import ActivitiesModel from '../models/Activities.mjs';
import BaseCrudRepository from './base/BaseCrud.repository.mjs';

class ActivitiesRepository extends BaseCrudRepository {
  constructor() {
    super(ActivitiesModel);
  }
}

export default new ActivitiesRepository();
