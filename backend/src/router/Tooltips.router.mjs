import PromiseRouter from 'express-promise-router';
import {initBase as initBaseRouter} from './base/Base.router.mjs';
import TooltipsController from '../controllers/Tooltips.controller.mjs';
import uploadImageMiddleware from '../middleware/handleUploadImages.mjs';

const router = PromiseRouter();

router.route('/').post(uploadImageMiddleware, TooltipsController.createOne);
initBaseRouter(router, TooltipsController);

export default router;
