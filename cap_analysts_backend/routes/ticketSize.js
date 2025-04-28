import express from "express";
 import {
    getAllTicketSizes,
    getTicketSizeById,
    createTicketSize,
    updateTicketSize,
    deleteTicketSize,
 } from "../controllers/ticketSize.js"; // Importing the controller functions

const router = express.Router();

// Routes
router.get("/", getAllTicketSizes); // Fetch all ticket sizes
router.get("/:id", getTicketSizeById); // Fetch a single ticket size by ID
router.post("/", createTicketSize); // Add a new ticket size
router.put("/:id", updateTicketSize); // Update a ticket size by ID
router.delete("/:id", deleteTicketSize); // Delete a ticket size by ID
 

export default router;