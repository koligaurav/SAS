import { Router } from 'express';
import { validateCoupon } from '../controllers/coupon.controller.js';

const router = Router();

// Public: validate a coupon code before checkout
router.get('/validate', validateCoupon);

export default router;
