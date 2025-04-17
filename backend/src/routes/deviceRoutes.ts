import { Router } from 'express';
import {
    controlDevice,
    createDevice,
    getUserDevices
} from '../controllers/deviceController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Cihaza komut gönderme
router.post('/kontrol', authenticate, controlDevice);

// Yeni cihaz ekleme
router.post('/', authenticate, createDevice);

// Kullanıcının cihazlarını listeleme
router.get('/', authenticate, getUserDevices);

export default router;
