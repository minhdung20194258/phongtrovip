import PromiseRouter from 'express-promise-router';
import PaymentController from '../controllers/Payments.controller.mjs';

const router = PromiseRouter();

router.route('/vnpay/:userId').get(PaymentController.create);
router.route('/callback/vnpay/done/:userId').get(PaymentController.done);

export default router;
