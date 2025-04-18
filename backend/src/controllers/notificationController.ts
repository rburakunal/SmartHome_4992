// src/controllers/notificationController.ts
import { Request, Response } from 'express';
import User from '../models/User';

export const savePushToken = async (req: Request, res: Response) => {
  const { expoPushToken } = req.body;
  const userId = req.user?.userId;

  if (!expoPushToken || !userId) {
    return res.status(400).json({ message: "Token veya kullanıcı bilgisi eksik." });
  }

  try {
    await User.findByIdAndUpdate(userId, { expoPushToken });
    res.status(200).json({ message: "Push token kaydedildi." });
  } catch (err) {
    console.error("❌ Token kayıt hatası:", err);
    res.status(500).json({ message: "Sunucu hatası." });
  }
};
