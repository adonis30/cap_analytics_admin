import express from 'express';
import {
  createContract,
  getAllContracts,
  getContractById,
  updateContract,
  deleteContract
} from '../controllers/contract.controller.js';

const router = express.Router();

router.post('/', createContract);
router.get('/', getAllContracts);
router.get('/:id', getContractById);
router.put('/:id', updateContract);
router.delete('/:id', deleteContract);

export default router;
