import mongoose, { Schema } from "mongoose";

// Funding Type Schema
const fundingTypeSchema = new Schema(
  {
    name: { type: String, required: true }, // Required name field
    description: { type: String }, // Optional description field
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Use an existing model if it exists, or create a new one
const FundingTypes = mongoose.models.FundingTypes || mongoose.model("FundingTypes", fundingTypeSchema);

export default FundingTypes;
