import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import Alert from '../models/Alert';

const router = Router();

// 🔐 Admin panel için detaylı tüm alert'leri getir
router.get('/', authenticate, async (_req, res) => {
  try {
    const alerts = await Alert.find().sort({ timestamp: -1 }).limit(10); // son 10 alarm
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: 'Alarmlar alınamadı', error: err });
  }
});

// 📱 Frontend için sade bildirim listesi (sadece son 5 tanesi)
router.get('/bildirimler', authenticate, async (_req, res) => {
  try {
    const alerts = await Alert.find().sort({ timestamp: -1 }).limit(5);
    const simpleAlerts = alerts.map((a) => ({
      type: a.type,
      message: a.message,
      time: a.timestamp,
    }));
    res.json(simpleAlerts);
  } catch (err) {
    res.status(500).json({ message: 'Bildirimler alınamadı', error: err });
  }
});

export default router;
