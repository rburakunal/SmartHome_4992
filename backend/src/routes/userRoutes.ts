import { Router } from 'express';
import { deleteUser, getAllUsers, updateProfile, getCurrentUser, updatePin} from '../controllers/userController';
import { authenticate, isAdmin } from '../middleware/authMiddleware';

console.log("📂 userRoutes yüklendi");

const router = Router();

router.get('/test', (_req, res) => {
  res.send('✅ /kullanicilar/test route çalışıyor');
});

router.get('/', authenticate, isAdmin, getAllUsers);
router.delete('/:id', authenticate, isAdmin, deleteUser);
router.put('/guncelle', authenticate, updateProfile);
router.get('/profil', authenticate, getCurrentUser);

// ✅ PIN güncelleme route'u
router.put('/pin', authenticate, updatePin);

export default router;
