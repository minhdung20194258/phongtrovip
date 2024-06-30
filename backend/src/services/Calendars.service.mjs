import BaseCrudService from './base/BaseCrud.service.mjs';
import CalendarsModel from '../models/Calendars.mjs';
import CalendarsRepository from '../repositories/Calendars.repository.mjs';

class CalendarsService extends BaseCrudService {
  constructor() {
    super(CalendarsModel, CalendarsRepository);
  }
}

export default new CalendarsService();
