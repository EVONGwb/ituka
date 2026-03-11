import express from 'express';
import { getUsers, getUserHistory } from '../controllers/user.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect, admin, getUsers);
router.get('/:id/history', protect, admin, getUserHistory);

export default router;
