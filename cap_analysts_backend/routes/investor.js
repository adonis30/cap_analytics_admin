import express from "express";
import {
  getAllInvestors,
  getInvestorById,
  createInvestor,
  updateInvestor,
  deleteInvestor,
} from "../controllers/investor.js";

const router = express.Router();

// Get all investors
router.get("/", getAllInvestors);

// Get a single investor by ID
router.get("/:id", getInvestorById);

// Create a new investor
router.post("/", createInvestor);

// Update an investor by ID
router.put("/:id", updateInvestor);

// Delete an investor by ID
router.delete("/:id", deleteInvestor);


export default router;
