import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import Alert from '../models/Alert';

const router = Router();

// Tüm alert'leri getir
router.get('/', authenticate, async (_req, res) => {
  try {
    const alerts = await Alert.find().sort({ timestamp: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: 'Alarmlar alınamadı', error: err });
  }
});

export default router;
