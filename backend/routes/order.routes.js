import { Router } from 'express';
import { createOrder, verifyPayment, getUserOrders, getOrder } from '../controllers/order.controller.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

// Optional auth middleware — works for both logged-in and guest users
function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return protect(req, res, next);
  next();
}

router.post('/create', optionalAuth, createOrder);
router.post('/verify', optionalAuth, verifyPayment);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrder);

export default router;
