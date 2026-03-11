import express from 'express';
import { createRequest, getMyRequests } from '../controllers/request.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createRequest);
router.get('/my', getMyRequests);

export default router;
