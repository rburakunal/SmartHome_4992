import { Router } from 'express';
import { deleteUser, getAllUsers } from '../controllers/userController';
import { authenticate, isAdmin } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, isAdmin, getAllUsers);
router.delete('/:id', authenticate, isAdmin, deleteUser);

export default router;
