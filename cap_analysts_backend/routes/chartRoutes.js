import express from 'express';
import { upload } from '../middlewares/fileUpload.middleware.js';
import {
  uploadChartData,
  getChartDataByMetadataId,
  getAllChartMetadata,
  deleteChartData,
  updateChartMetadata,
  getAllChartData,
  getChartDataById,
  getChartsByCategory
} from '../controllers/chartController.js';

const router = express.Router();

// Upload new chart data from .xlsx/.csv
router.post('/', upload.single('file'), uploadChartData);

// Get all chart metadata (for listing available charts)
router.get('/metadata', getAllChartMetadata);

// Get raw chart data by metadata ID
router.get('/data/:metadataId', getChartDataByMetadataId);

// Optional: Get individual chart row by data ID
router.get('/row/:id', getChartDataById);

// Optional: Get all raw chart data (use cautiously in production)
router.get('/all', getAllChartData);

// Update chart metadata (title, etc.)
router.put('/:metadataId', updateChartMetadata);

// Delete chart and its associated data
router.delete('/:metadataId', deleteChartData);

router.get('/category/:category', getChartsByCategory);

export default router;
