import express from 'express';
import { createWarehouse, getWarehouses } from '../controllers/warehouseController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/authorizeMiddleware.js';

const router = express.Router();

router.post('/', authenticate, authorize(['Admin']), createWarehouse);
router.get('/', authenticate, authorize(['Admin', 'User']), getWarehouses);

export default router;
