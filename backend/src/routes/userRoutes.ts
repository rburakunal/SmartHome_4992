import { Router } from 'express';
import { deleteUser, getAllUsers, updateProfile } from '../controllers/userController';
import { authenticate, isAdmin } from '../middleware/authMiddleware';

console.log("📂 userRoutes yüklendi");

const router = Router();

// Test için route
router.get('/test', (_req, res) => {
  res.send('✅ /kullanicilar/test route çalışıyor');
});

router.get('/', authenticate, isAdmin, getAllUsers);
router.delete('/:id', authenticate, isAdmin, deleteUser);
router.put('/guncelle', authenticate, updateProfile);

export default router;
