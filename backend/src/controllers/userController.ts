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

// ✅ Kullanıcı profilini güncelle (email / password)
export const updateProfile = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { email, password, currentPassword } = req.body;

  if (!email && !password) {
    return res.status(400).json({ message: 'Email veya yeni şifre sağlanmalı.' });
  }

  if (!currentPassword) {
    return res.status(400).json({ message: 'Mevcut şifre zorunludur.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mevcut şifre hatalı.' });
    }

    if (email) user.email = email;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      user.password = hashed;
    }

    await user.save();

    res.json({
      message: 'Profil başarıyla güncellendi.',
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        _id: user._id
      }
    });
  } catch (err) {
    console.error('❌ Profil güncelleme hatası:', err);
    res.status(500).json({ message: 'Profil güncellenemedi.', error: err });
  }
};

// ✅ PIN güncelleme (yeni eklendi)
export const updatePin = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { currentPin, pin } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // If user has no PIN set, allow setting initial PIN without current PIN
    if (!user.pin) {
      if (!pin) {
        return res.status(400).json({ error: "New PIN is required." });
      }

      // Hash and set the initial PIN
      const salt = await bcrypt.genSalt(10);
      const hashedPin = await bcrypt.hash(pin, salt);
      await User.findByIdAndUpdate(userId, { pin: hashedPin });
      return res.json({ message: "PIN successfully set." });
    }

    // For existing PINs, require both current and new PIN
    if (!currentPin || !pin) {
      return res.status(400).json({ error: "Both current PIN and new PIN are required." });
    }

    // Check if the stored PIN is already hashed (bcrypt hashes start with '$2')
    let isPinValid;
    if (user.pin.startsWith('$2')) {
      // PIN is hashed, use bcrypt compare
      isPinValid = await bcrypt.compare(currentPin, user.pin);
    } else {
      // PIN is still plain text, do direct comparison
      isPinValid = user.pin === currentPin;
    }

    if (!isPinValid) {
      return res.status(401).json({ error: "Current PIN is incorrect." });
    }

    // Hash the new PIN before storing
    const salt = await bcrypt.genSalt(10);
    const hashedPin = await bcrypt.hash(pin, salt);

    // Update PIN only if current PIN is correct
    await User.findByIdAndUpdate(userId, { pin: hashedPin });
    res.json({ message: "PIN successfully updated." });
  } catch (err) {
    console.error('Error updating PIN:', err);
    res.status(500).json({ error: "Failed to update PIN.", details: err });
  }
};

// ✅ Mevcut kullanıcının bilgilerini getir
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Oturum açmanız gerekiyor.' });
    }

    const user = await User.findById(userId, '-password');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('❌ Kullanıcı bilgisi alma hatası:', err);
    res.status(500).json({ message: 'Kullanıcı bilgisi alınamadı.', error: err });
  }
};

// ✅ Check if user has PIN set
export const checkPinStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({
      hasPin: !!user.pin
    });
  } catch (err) {
    console.error('Error checking PIN status:', err);
    res.status(500).json({ error: 'Failed to check PIN status.', details: err });
  }
};