import { Router } from 'express';
import {
    controlDevice,
    createDevice,
    getUserDevices
} from '../controllers/deviceController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Cihaza komut gönderme
router.post('/kontrol', controlDevice);

// Yeni cihaz ekleme
router.post('/', createDevice);

// Kullanıcının cihazlarını listeleme
router.get('/', getUserDevices);

export default router;
