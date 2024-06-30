import PromiseRouter from 'express-promise-router';
import {initBaseReadOnly} from './base/Base.router.mjs';
import ReviewsController from '../controllers/Reviews.controller.mjs';
import passport from '../middleware/passport.mjs';

const router = PromiseRouter();
const middlewareJWT = passport.authenticate('jwt-access-token', {session: false});

router.route('/').post(middlewareJWT, ReviewsController.createOne);
router.route('/check').get(middlewareJWT, ReviewsController.hasReview);
router.route('/stars/:postId').get(ReviewsController.countStar);
initBaseReadOnly(router, ReviewsController);

export default router;
