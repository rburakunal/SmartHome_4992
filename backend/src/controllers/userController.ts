import { Request, Response } from 'express';
import User from '../models/User';

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find({}, '-password'); // şifre hariç
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Kullanıcılar alınamadı', error: err });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    await User.findByIdAndDelete(userId);
    res.json({ message: 'Kullanıcı silindi' });
  } catch (err) {
    res.status(500).json({ message: 'Silme başarısız', error: err });
  }
};
