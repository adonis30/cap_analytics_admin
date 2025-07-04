import express from 'express';
import {
  createPayroll,
  getAllPayrolls,
  getPayrollById,
  updatePayroll,
  deletePayroll
} from '../controllers/payroll.controller.js';

const router = express.Router();

router.post('/', createPayroll);
router.get('/', getAllPayrolls);
router.get('/:id', getPayrollById);
router.put('/:id', updatePayroll);
router.delete('/:id', deletePayroll);

export default router;
