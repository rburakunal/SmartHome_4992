import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import User from '../models/User';

// ✅ Kullanıcı listesini getir (admin)
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Kullanıcılar alınamadı', error: err });
  }
};

// ✅ Kullanıcı sil (admin)
export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    await User.findByIdAndDelete(userId);
    res.json({ message: 'Kullanıcı silindi' });
  } catch (err) {
    res.status(500).json({ message: 'Silme başarısız', error: err });
  }
};

// ✅ Kullanıcı kendi profilini günceller (username hariç)
export const updateProfile = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { email, password } = req.body;

  if (!email && !password) {
    return res.status(400).json({ message: 'Email veya şifre sağlanmalı.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    if (email) user.email = email;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
    }

    await user.save();

    res.json({
      message: 'Profil güncellendi',
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        _id: user._id
      }
    });
  } catch (err) {
    console.error('❌ Profil güncelleme hatası:', err);
    res.status(500).json({ message: 'Profil güncellenemedi', error: err });
  }
};
