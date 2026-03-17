import express from 'express';
import { getStats, getAnalytics } from '../controllers/admin.controller.js';
import { getSystemSettings, updateSystemSettings } from '../controllers/systemSettings.controller.js';
import { protect, allowPermissions } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/stats', protect, allowPermissions('dashboard:read'), getStats);
router.get('/analytics', protect, allowPermissions('analytics:read'), getAnalytics);
router.get('/settings/system', protect, allowPermissions('*'), getSystemSettings);
router.put('/settings/system', protect, allowPermissions('*'), updateSystemSettings);

export default router;
