import { Router } from 'express';
import {
  createSurvey,
  getAllSurveys,
  getSurveyById,
  deleteSurvey
} from '../controllers/engagementSurvey.controller.js';

const router = Router();

router.post('/', createSurvey);
router.get('/', getAllSurveys);
router.get('/:id', getSurveyById);
router.delete('/:id', deleteSurvey);

export default router;
