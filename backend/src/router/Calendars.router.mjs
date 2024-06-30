import PromiseRouter from 'express-promise-router';
import CalendarsController from '../controllers/Calendars.controller.mjs';
import passport from '../middleware/passport.mjs';

const router = PromiseRouter();
const middlewareJWT = passport.authenticate('jwt-access-token', {session: false});

router.route('/').post(CalendarsController.createOrUpdateOne);
router.route('/:id').put(CalendarsController.acceptOrReject);
router.route('/filter').get(middlewareJWT, CalendarsController.query);
export default router;
