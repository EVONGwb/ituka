import express from 'express';
import { getOrders, getOrder, createOrder, updateOrderStatus, getRequests, getMyOrders, confirmOrderFromChat } from '../controllers/order.controller.js';
import { protect, allowPermissions, allowAnyPermissions } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect, allowPermissions('orders:read'), getOrders);
router.get('/requests', protect, allowPermissions('requests:read'), getRequests);
router.get('/myorders', protect, getMyOrders);
router.post('/', protect, createOrder);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, allowAnyPermissions('orders:update', 'requests:update'), updateOrderStatus);
router.post('/:id/confirm', protect, allowAnyPermissions('orders:update', 'requests:update'), confirmOrderFromChat);

export default router;
