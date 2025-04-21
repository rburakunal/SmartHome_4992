console.log("🛠 authRoutes dosyası yüklendi");
import { Router } from 'express';
import { login, register } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.get('/test', (_req, res) => {
  res.send('✅ Auth route çalışıyor!');
});

export default router;
