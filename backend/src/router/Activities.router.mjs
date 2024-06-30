import PromiseRouter from 'express-promise-router';
import {initBase as initBaseRouter} from './base/Base.router.mjs';
import ActivitiesController from '../controllers/Activities.controller.mjs';

const router = PromiseRouter();
initBaseRouter(router, ActivitiesController);

export default router;
