import mongoose, { Schema } from "mongoose";

// Funding Rounds Schema
const fundingroundsSchema = new Schema(
  {
    name: { type: String, required: true }, // Name is required
    description: { type: String }, // Description is optional
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// If the model already exists, use it; otherwise, create a new model
const Fundingrounds =
  mongoose.models.Fundingrounds ||
  mongoose.model("Fundingrounds", fundingroundsSchema);

export default Fundingrounds;
