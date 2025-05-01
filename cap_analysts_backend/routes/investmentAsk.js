import express from "express";
import {
    getAllInvestmentAsks,
    getInvestmentAskById,
    createInvestmentAsk,
    updateInvestmentAsk,
    deleteInvestmentAsk,
} from "../controllers/investmentAsk.js"; // Importing the controller functions

const router = express.Router();

// Routes
router.get("/", getAllInvestmentAsks); // Fetch all investment asks
router.get("/:id", getInvestmentAskById); // Fetch a single investment ask by ID
router.post("/", createInvestmentAsk); // Add a new investment ask
router.put("/:id", updateInvestmentAsk); // Update an investment ask by ID
router.delete("/:id", deleteInvestmentAsk); // Delete an investment ask by ID


export default router;