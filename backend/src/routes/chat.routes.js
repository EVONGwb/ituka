import express from 'express';
import { getOrCreateChat, getChatHistory, sendMessage, uploadImage } from '../controllers/chat.controller.js';
import { verifyToken as protect } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.post('/init', protect, getOrCreateChat);
router.get('/:chatId/messages', protect, getChatHistory);
router.post('/message', protect, sendMessage);
router.post('/upload', protect, upload.single('image'), uploadImage);

export default router;
