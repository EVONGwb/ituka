import express from 'express';
import { 
  getProducts, 
  getProduct, 
  getAdminProducts,
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/product.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

const maybeUploadImages = (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.startsWith('multipart/form-data')) {
    return upload.array('images', 5)(req, res, next);
  }
  return next();
};

// Public routes
router.get('/', getProducts);
router.get('/admin', protect, admin, getAdminProducts);
router.get('/:id', getProduct);

// Admin routes
router.post('/', protect, admin, maybeUploadImages, createProduct);
router.put('/:id', protect, admin, maybeUploadImages, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
