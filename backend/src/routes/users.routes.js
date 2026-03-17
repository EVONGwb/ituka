import express from 'express';
import { getUsers, getUserHistory } from '../controllers/user.controller.js';
import { protect, allowPermissions } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect, allowPermissions('clients:read'), getUsers);
router.get('/:id/history', protect, allowPermissions('clients:read'), getUserHistory);

export default router;
