import express from 'express';
import { getOrCreateChat, getChatHistory, sendMessage, uploadImage, markAsRead, getConversations, getAdminChatByUser } from '../controllers/chat.controller.js';
import { protect, allowPermissions } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.get('/conversations', protect, allowPermissions('chats:read'), getConversations);
router.get('/admin/user/:userId', protect, allowPermissions('chats:read'), getAdminChatByUser);
router.post('/init', protect, getOrCreateChat);
router.get('/:chatId/messages', protect, getChatHistory);
router.post('/message', protect, sendMessage);
router.post('/upload', protect, upload.single('image'), uploadImage);
router.put('/:chatId/read', protect, markAsRead);

export default router;
