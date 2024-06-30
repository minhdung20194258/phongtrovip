import PromiseRouter from 'express-promise-router';
import AdminController, {middlewareAdmin} from '../controllers/Admin.controller.mjs';
import passport from '../middleware/passport.mjs';
import uploadImageMiddleware from '../middleware/handleUploadImages.mjs';

const router = PromiseRouter();
const middlewareJWT = passport.authenticate('jwt-access-token', {session: false});

router
  .route('/requests/accept')
  .put(middlewareJWT, middlewareAdmin('staff'), AdminController.acceptRequest);
router
  .route('/requests/accept/:requestId')
  .put(
    middlewareJWT,
    middlewareAdmin('staff'),
    uploadImageMiddleware,
    AdminController.requestImages,
  );
router
  .route('/requests/filter')
  .get(middlewareJWT, middlewareAdmin('staff'), AdminController.getListRequests);
router
  .route('/reviews/:id')
  .put(middlewareJWT, middlewareAdmin('staff'), AdminController.approvedReview);
router
  .route('/users')
  .post(middlewareJWT, middlewareAdmin('staff'), AdminController.createOrUpdate);
router
  .route('/users/:userId')
  .put(middlewareJWT, middlewareAdmin('staff'), AdminController.updateOne);
router
  .route('/posts/:id')
  .put(middlewareJWT, middlewareAdmin('staff'), AdminController.approvedPost);
export default router;
