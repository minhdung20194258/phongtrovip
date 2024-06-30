import PromiseRouter from 'express-promise-router';
import UsersController from '../controllers/Users.controller.mjs';
import {initBaseReadOnly} from './base/Base.router.mjs';
import passport from '../middleware/passport.mjs';

const router = PromiseRouter();
const middlewareJWT = passport.authenticate('jwt-access-token', {session: false});
const middlewareLocal = passport.authenticate('local', {session: false});
const middlewareGoogle = passport.authenticate('google', {scope: ['profile', 'email']});
const middlewareFacebook = passport.authenticate('facebook', {scope: ['profile', 'email']});
const middlewareGoogleCallBack = passport.authenticate('google', {
  failureRedirect: `${process.env.VUE_URL}/login`,
});

// Another
router.route('/reaction/post/:postId').put(middlewareJWT, UsersController.reactPost);
router.route('/requests').post(middlewareJWT, UsersController.createRequest);
router.route('/requests').get(middlewareJWT, UsersController.getRequests);
router.route('/requests/:requestId').delete(middlewareJWT, UsersController.deleteRequest);

// Authenticate
router.route('/private').get(middlewareJWT, UsersController.getInfo);
router.route('/avatar').put(middlewareJWT, UsersController.changeAvatar);
router.route('/forgot-pass/email').put(UsersController.forgotPassStep1);
router.route('/forgot-pass/otp').put(UsersController.forgotPassStep2);
router.route('/forgot-pass/change').put(middlewareJWT, UsersController.forgotPassStep3);
router.route('/password').put(middlewareJWT, UsersController.changePass);
router.route('/auth/sign-in/local').post(middlewareLocal, UsersController.signInLocal);
router.route('/auth/sign-up/local').post(UsersController.signUpLocal);

// Frontend request to sign in
router.route('/auth/google').get(middlewareGoogle);
router.route('/auth/facebook').get(middlewareFacebook);
// Success authentication, then redirect to frontend for requesting information
router.route('/callback').get(middlewareGoogleCallBack, UsersController.successGoogle);
// Return information for login success
router.route('/auth/secret').get(middlewareJWT, UsersController.signInLocal);
router.route('/update').put(middlewareJWT, UsersController.updateOne);
router.route('/:id').put(middlewareJWT, UsersController.updateOne);

initBaseReadOnly(router, UsersController);

export default router;
