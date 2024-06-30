import PromiseRouter from 'express-promise-router';
import PostsController from '../controllers/Posts.controller.mjs';
import {initBaseReadOnly} from './base/Base.router.mjs';
import passport from '../middleware/passport.mjs';

const router = PromiseRouter();
const middlewareJWT = passport.authenticate('jwt-access-token', {session: false});

router.route('/').post(middlewareJWT, PostsController.createOne);
router.route('/:id').put(middlewareJWT, PostsController.updateOne);
router.route('/deposit/list').get(middlewareJWT, PostsController.getDeposits);
router.route('/refund/:depositId').put(middlewareJWT, PostsController.refund);
router.route('/payment/:postId').put(middlewareJWT, PostsController.payment);
router.route('/deposit/request/:postId').put(middlewareJWT, PostsController.requestDeposit);
router.route('/deposit/verify/:postId').put(middlewareJWT, PostsController.deposit);
router.route('/react').get(middlewareJWT, PostsController.userReact);
router.route('/filter').get(PostsController.query);

initBaseReadOnly(router, PostsController);

export default router;
