import express from 'express';
import {  getAllBoardMembers, getBoardMemberById, createBoardMember, updateBoardMember, deleteBoardMember } from '../controllers/general.js';


const router = express.Router();


// Routes Funding Types
router.get("/", getAllBoardMembers); // Fetch all Board Members
router.get("/:id", getBoardMemberById); // Fetch a single Board Members by ID
router.post("/", createBoardMember); // Add a new Board Members
router.put("/:id", updateBoardMember); // Update a Board Members  by ID
router.delete("/:id", deleteBoardMember); // Delete a Board Members by ID

export default router;