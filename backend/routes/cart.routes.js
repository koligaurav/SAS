import { Router } from 'express';
import { getCart, addToCart, updateCartItem, clearCart } from '../controllers/cart.controller.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

router.use(protect);
router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/clear', clearCart);

export default router;
