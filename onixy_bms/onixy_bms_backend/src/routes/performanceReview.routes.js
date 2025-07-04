import express from 'express';
import {
  createPerformanceReview,
  getAllPerformanceReviews,
  getPerformanceReviewById,
  updatePerformanceReview,
  deletePerformanceReview,
} from '../controllers/performanceReview.controller.js';

const router = express.Router();

// Create a performance review
router.post('/', createPerformanceReview);

// Get all reviews (optional: filter by ?employeeId=xyz)
router.get('/', getAllPerformanceReviews);

// Get a single review by ID
router.get('/:id', getPerformanceReviewById);

// Update a review
router.put('/:id', updatePerformanceReview);

// Delete a review
router.delete('/:id', deletePerformanceReview);

export default router;
