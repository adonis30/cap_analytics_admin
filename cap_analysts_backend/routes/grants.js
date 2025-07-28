import express from "express";
import {
    getAllGrants,
    getGrantsById,
    createGrant,
    updateGrant,
    deleteGrant,
} from "../controllers/grants.js"

const router = express.Router();


//Routes

router.get("/", getAllGrants); //fetch all grants
router.get("/:id", getGrantsById); // fetch a gingle by ID
router.post("/", createGrant); // add a new grant
router.put("/:id", updateGrant); // update grant
router.delete("/:id", deleteGrant) // delete grant

export default router;