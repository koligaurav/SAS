import { Router } from 'express';
import {
  getOverview,
  getRevenueChart,
  getPopularItems,
  getOrdersByStatus,
} from '../controllers/analytics.controller.js';
import { protect, adminOnly } from '../middlewares/auth.js';

const router = Router();
router.use(protect, adminOnly);

router.get('/overview', getOverview);
router.get('/revenue', getRevenueChart);
router.get('/popular-items', getPopularItems);
router.get('/orders-by-status', getOrdersByStatus);

export default router;
