import express from 'express';
import { getStats } from '../controllers/admin.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/stats', protect, admin, getStats);

export default router;
