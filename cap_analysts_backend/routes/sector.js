import express from "express";
import { 
    getAllSectors,
    getSectorById,
    createSector,
    updateSector,
    deleteSector,
} from "../controllers/sector.js";

const router = express.Router();

// Routes
router.get("/", getAllSectors); // Fetch all sectors
router.get("/:id", getSectorById); // Fetch a single sector by ID
router.post("/", createSector); // Add a new sector
router.put("/:id", updateSector); // Update a sector by ID
router.delete("/:id", deleteSector); // Delete a sector by ID

export default router;