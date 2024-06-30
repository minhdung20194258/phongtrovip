import PromiseRouter from 'express-promise-router';
import AppResourceController from '../controllers/AppResource.controller.mjs';

const router = PromiseRouter();

router.route('/areas').get(AppResourceController.getProvinces);
router.route('/areas/province/:provinceId').get(AppResourceController.getDistricts);
router
  .route('/areas/district/:districtId/province/:provinceId')
  .get(AppResourceController.getWards);
router.route('/banks').get(AppResourceController.getAllBanks);
router.route('/banks/:bankId').get(AppResourceController.getBank);

export default router;
