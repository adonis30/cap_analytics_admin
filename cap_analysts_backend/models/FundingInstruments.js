import mongoose, { Schema } from "mongoose";

// Funding Instruments Schema
const fundingInstrumentsSchema = new Schema(
  {
    name: { type: String, required: true }, // Name is required
    description: { type: String }, // Description is optional
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// If the model already exists, use it; otherwise, create a new model
const FundingInstruments =
  mongoose.models.FundingInstruments ||
  mongoose.model("FundingInstruments", fundingInstrumentsSchema);

export default FundingInstruments;
