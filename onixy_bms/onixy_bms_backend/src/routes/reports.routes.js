import express from "express";
import {
  attendanceSummary,
  leaveSummary,
  averagePerformance,
} from "../controllers/reports.controller.js";

const router = express.Router();

router.get("/attendance-summary", attendanceSummary);
router.get("/leave-summary", leaveSummary);
router.get("/performance-summary", averagePerformance);

export default router;
