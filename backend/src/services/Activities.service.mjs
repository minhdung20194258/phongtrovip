import BaseCrudService from './base/BaseCrud.service.mjs';
import ActivitiesModel from '../models/Activities.mjs';
import ActivitiesRepository from '../repositories/Activities.repository.mjs';

class ActivitiesService extends BaseCrudService {
  constructor() {
    super(ActivitiesModel, ActivitiesRepository);
  }
}

export default new ActivitiesService();
