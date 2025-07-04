import { Router } from 'express';
import {
  createAutomationTask,
  getAllAutomationTasks,
  updateAutomationTask,
  deleteAutomationTask,
} from '../controllers/automation.controller.js';

const router = Router();

router.post('/', createAutomationTask);
router.get('/', getAllAutomationTasks);
router.put('/:id', updateAutomationTask);
router.delete('/:id', deleteAutomationTask);

export default router;
