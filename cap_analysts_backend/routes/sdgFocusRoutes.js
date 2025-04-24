import express from "express";
import { 
    getAllSdgFocus,
    getSdgFocusById,
    createSdgFocus,
    updateSdgFocus,
    deleteSdgFocus,

 } from "../controllers/sdgFocus.js";

const router = express.Router();



router.get("/", getAllSdgFocus);
router.get("/:id", getSdgFocusById);
router.post("/", createSdgFocus);
router.put("/:id", updateSdgFocus);
router.delete("/:id", deleteSdgFocus)

export default router;

