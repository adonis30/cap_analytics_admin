import express from 'express';

import { createFundingInstrument, updateFundingInstrument, getAllFundingTypes, createFundingType, deleteFundingType,  updateFundingRound, getFundingTypeById,  createFundingRound,updateFundingType, deleteFundingInstrument, deleteFundingRound, getFundingInstrumentById, getAllFundingInstruments, getAllFundingRound, getFundingRoundById} from '../controllers/funding.js';

const router = express.Router();

// Routes Funding Instruments
router.get("/fundingInstruments", getAllFundingInstruments); // Fetch all Funding Instruments
router.get("/fundingInstruments/:id", getFundingInstrumentById); // Fetch a single funding instrumen by ID
router.post("/fundingInstruments", createFundingInstrument); // Add a new funding instrument
router.put("/fundingInstruments/:id", updateFundingInstrument); // Update a funding instrument by ID
router.delete("/fundingInstruments/:id", deleteFundingInstrument); // Delete a funding instrument by ID
// Routes Funding Rounds
router.get("/fundingRounds", getAllFundingRound); // Fetch all Funding Round 
router.get("/fundingRounds/:id", getFundingRoundById); // Fetch a single funding Roundby ID
router.post("/fundingRounds", createFundingRound); // Add a new funding Round
router.put("/fundingRounds/:id", updateFundingRound); // Update a funding Round by ID
router.delete("/fundingRounds/:id", deleteFundingRound); // Delete a funding Round by ID
// Routes Funding Types
router.get("/fundingTypes", getAllFundingTypes); // Fetch all Funding type 
router.get("/fundingTypes/:id", getFundingTypeById); // Fetch a single funding type  by ID
router.post("/fundingTypes", createFundingType); // Add a new funding type 
router.put("/fundingTypes/:id", updateFundingType); // Update a funding type  by ID
router.delete("/fundingTypes/:id", deleteFundingType); // Delete a funding type by ID

export default router;

