import express from 'express';
import { getOrders, getOrder, createOrder, updateOrderStatus, getRequests, getMyOrders } from '../controllers/order.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect, admin, getOrders);
router.get('/requests', protect, admin, getRequests);
router.get('/myorders', protect, getMyOrders);
router.post('/', protect, createOrder);
router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;
