import PromiseRouter from 'express-promise-router';
import {initBase as initBaseRouter} from './base/Base.router.mjs';
import MessagesController from '../controllers/Messages.controller.mjs';

const router = PromiseRouter();
initBaseRouter(router, MessagesController);

export default router;
