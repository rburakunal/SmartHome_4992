import { Router } from 'express';
import { unlockDoor } from '../controllers/doorController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.post('/unlock', authenticate, unlockDoor);

export default router;
