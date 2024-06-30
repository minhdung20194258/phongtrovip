import ActivitiesModel from '../models/Activities.mjs';
import BaseCrudController from './base/BaseCrud.controller.mjs';
import ActivitiesRepository from '../repositories/Activities.repository.mjs';

class ActivitiesController extends BaseCrudController {
  constructor() {
    super(ActivitiesModel, ActivitiesRepository);
  }
}

export default new ActivitiesController();
