import { Router } from 'express';
import {
  getAllOrders,
  updateOrderStatus,
  getUsers,
  broadcastNotification,
} from '../controllers/admin.controller.js';
import {
  getMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menu.controller.js';
import {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
} from '../controllers/coupon.controller.js';
import { protect, adminOnly } from '../middlewares/auth.js';

const router = Router();
router.use(protect, adminOnly);

// Orders
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Users
router.get('/users', getUsers);

// Menu management
router.get('/menu', getMenu);
router.post('/menu', createMenuItem);
router.put('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);

// Coupons
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);

// Notifications
router.post('/notifications/broadcast', broadcastNotification);

export default router;
