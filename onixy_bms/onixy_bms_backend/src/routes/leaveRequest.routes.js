import express from 'express';
import {
  createLeaveRequest,
  getAllLeaveRequests,
  getLeaveRequestById,
  updateLeaveRequest,
  deleteLeaveRequest,
} from '../controllers/leaveRequest.controller.js';

const router = express.Router();

router.post('/', createLeaveRequest);
router.get('/', getAllLeaveRequests);
router.get('/:id', getLeaveRequestById);
router.put('/:id', updateLeaveRequest);
router.delete('/:id', deleteLeaveRequest);

export default router;
