import express from 'express';
import {
    getCompanies,
    getCompanyById,
    createCompany,
    updateCompany,
    deleteCompany,
} from "../controllers/company.js";

const router = express.Router();

// Routes
router.get("/", getCompanies); // Fetch all companies
router.get("/:id", getCompanyById); // Fetch a single company by ID
router.post("/", createCompany); // Add a new company
router.put("/:companyId", updateCompany); // Update a company by ID
router.delete("/:id", deleteCompany); // Delete a company by ID

export default router;
