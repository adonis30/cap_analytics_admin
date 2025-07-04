import { Router } from 'express';
import {
  uploadComplianceDocument,
  getAllComplianceDocuments,
  deleteComplianceDocument,
} from '../controllers/complianceDocument.controller.js';

const router = Router();

router.post('/', uploadComplianceDocument);
router.get('/', getAllComplianceDocuments);
router.delete('/:id', deleteComplianceDocument);

export default router;
