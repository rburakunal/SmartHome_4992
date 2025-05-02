import { Router } from 'express';
import { deleteUser, getAllUsers, updatePin, updateProfile } from '../controllers/userController';
import { authenticate, isAdmin } from '../middleware/authMiddleware';

console.log("📂 userRoutes yüklendi");

const router = Router();

router.get('/test', (_req, res) => {
  res.send('✅ /kullanicilar/test route çalışıyor');
});

router.get('/', authenticate, isAdmin, getAllUsers);
router.delete('/:id', authenticate, isAdmin, deleteUser);
router.put('/guncelle', authenticate, updateProfile);

// ✅ PIN güncelleme route'u
router.put('/pin', authenticate, updatePin);

export default router;
