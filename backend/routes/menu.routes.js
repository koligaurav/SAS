import { Router } from 'express';
import {
  getMenu,
  getMenuItem,
  getCategories,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menu.controller.js';
import { protect, adminOnly } from '../middlewares/auth.js';

const router = Router();

router.get('/', getMenu);
router.get('/categories', getCategories);
router.get('/:id', getMenuItem);
router.post('/', protect, adminOnly, createMenuItem);
router.put('/:id', protect, adminOnly, updateMenuItem);
router.delete('/:id', protect, adminOnly, deleteMenuItem);

export default router;
