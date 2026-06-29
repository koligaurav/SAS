import { Router } from 'express';
import { getNotifications, markAllRead, markOneRead } from '../controllers/notification.controller.js';
import { protect } from '../middlewares/auth.js';

const router = Router();
router.use(protect);

router.get('/', getNotifications);
router.put('/read', markAllRead);
router.put('/:id/read', markOneRead);

export default router;
