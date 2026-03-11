import express from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem, updateNote } from '../controllers/cart.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/item/:id', updateCartItem);
router.delete('/item/:id', removeCartItem);
router.put('/note', updateNote);

export default router;
