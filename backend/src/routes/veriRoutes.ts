import { Router } from 'express';
import {
    createData,
    deleteData,
    getAllData,
    getDataById
} from '../controllers/veriController';

import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// ⬅️ Önce özel route'u koy, çünkü /:id her şeyi yutuyor
router.get('/gizli/veri', authenticate, (req, res) => {
  res.json({
    message: `Bu veriye sadece token ile erişebilirsin. Hoş geldin ${req.user?.userId}!`
  });
});

router.get('/', getAllData);
router.get('/:id', getDataById);
router.post('/', createData);
router.delete('/:id', deleteData);

export default router;
