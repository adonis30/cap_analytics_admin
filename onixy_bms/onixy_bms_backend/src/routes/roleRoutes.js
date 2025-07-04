import express from 'express';
import {
  createRole,
  getRoles,
  deleteRole,
  updateRole,
} from '../controllers/roleController.js';

import { authenticate } from '../middlewares/authMiddleware.js';
import { authorize } from '../middlewares/authorizeMiddleware.js';

const router = express.Router();

// Only Super Admin or Admin can manage roles
router.post('/', authenticate, authorize(['Super Admin', 'Admin']), createRole);
router.get('/', authenticate, authorize(['Super Admin', 'Admin', 'HR']), getRoles);
router.put('/:id', authenticate, authorize(['Super Admin', 'Admin']), updateRole);
router.delete('/:id', authenticate, authorize(['Super Admin']), deleteRole);

export default router;
