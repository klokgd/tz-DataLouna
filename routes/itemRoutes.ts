import router from './authRoutes';
import * as itemController from '../controllers/itemController';

router.get('/min-prices', itemController.getMinPrices)

export default router;