import PromiseRouter from 'express-promise-router';
import {initBase as initBaseRouter} from './base/Base.router.mjs';
import ChatsController from '../controllers/Chats.controller.mjs';

const router = PromiseRouter();

router.route('/users').get(ChatsController.queryByUserId);

initBaseRouter(router, ChatsController);

export default router;
