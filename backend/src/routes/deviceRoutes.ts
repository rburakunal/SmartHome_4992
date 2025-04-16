import { Router } from 'express';
import { controlDevice } from '../controllers/deviceController';

const router = Router();

router.post('/kontrol', controlDevice);

export default router;
