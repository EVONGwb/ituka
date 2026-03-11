import express from 'express';
import { login, register, getMe, updateProfile, googleLogin } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/google', googleLogin);
router.post('/register', register);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
