import PromiseRouter from 'express-promise-router';
import {initBaseReadOnly} from './base/Base.router.mjs';
import CommentsController from '../controllers/Comments.controller.mjs';
import passport from '../middleware/passport.mjs';

const router = PromiseRouter();
const middlewareJWT = passport.authenticate('jwt-access-token', {session: false});

initBaseReadOnly(router, CommentsController);
router.route('/').post(middlewareJWT, CommentsController.createOne);
router.route('/posts/:postId').get(CommentsController.getByPostId);

export default router;
