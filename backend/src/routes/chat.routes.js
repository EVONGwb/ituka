import express from 'express';
import { getOrCreateChat, getChatHistory, sendMessage, uploadImage, markAsRead, getConversations, getAdminChatByUser } from '../controllers/chat.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.get('/conversations', protect, admin, getConversations);
router.get('/admin/user/:userId', protect, admin, getAdminChatByUser);
router.post('/init', protect, getOrCreateChat);
router.get('/:chatId/messages', protect, getChatHistory);
router.post('/message', protect, sendMessage);
router.post('/upload', protect, upload.single('image'), uploadImage);
router.put('/:chatId/read', protect, markAsRead);

export default router;
