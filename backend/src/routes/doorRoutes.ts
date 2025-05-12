import { Router } from 'express';
import { 
  unlockDoor, 
  getUserDoors, 
  createDoor, 
  updateDoorStatus 
} from '../controllers/doorController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Get all doors for the authenticated user
router.get('/', authenticate, getUserDoors);

// Create a new door
router.post('/', authenticate, createDoor);

// Update door status
router.put('/:doorId/status', authenticate, updateDoorStatus);

// Unlock door with PIN
router.post('/unlock', authenticate, unlockDoor);

export default router;
