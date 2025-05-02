import { Router } from 'express';
import { controlAlarm } from '../controllers/alarmController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// 🚨 Alarmı manuel aç/kapat
// POST /alarm/kontrol { "action": "on" }
router.post('/kontrol', authenticate, controlAlarm);

export default router;
