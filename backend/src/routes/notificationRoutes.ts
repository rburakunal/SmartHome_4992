// src/routes/notificationRoutes.ts
import { Router } from 'express';
import { savePushToken } from '../controllers/notificationController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/token', authenticate, savePushToken);

export default router;
