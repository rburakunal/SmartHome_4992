// src/routes/notificationRoutes.ts
import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import PushToken from '../models/PushToken';
import { sendPushNotification } from '../utils/pushNotification';

const router = Router();

// ✅ Push token kaydetme
router.post('/token', authenticate, async (req, res) => {
  const { token } = req.body;
  const userId = req.user?.userId;

  if (!token) {
    return res.status(400).json({ message: 'Token gereklidir.' });
  }

  await PushToken.findOneAndUpdate(
    { user: userId },
    { token },
    { upsert: true, new: true }
  );

  res.status(200).json({ message: 'Push token kaydedildi.' });
});

// ✅ Bildirim gönderme endpoint'i
router.post('/gonder', authenticate, async (req, res) => {
  const { title, body } = req.body;
  const userId = req.user?.userId;

  try {
    const userToken = await PushToken.findOne({ user: userId });
    if (!userToken) {
      return res.status(404).json({ message: 'Kullanıcının push tokenı bulunamadı.' });
    }

    await sendPushNotification(userToken.token, title, body);
    res.status(200).json({ message: 'Bildirim gönderildi.' });
  } catch (err) {
    console.error('Bildirim gönderme hatası:', err);
    res.status(500).json({ message: 'Bildirim gönderilemedi.' });
  }
});

export default router;
