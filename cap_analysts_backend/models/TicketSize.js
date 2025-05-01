import mongoose from "mongoose";

const ticketSizeSchema = new mongoose.Schema(
  {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Use an existing model if it exists, or create a new one
const TicketSize = mongoose.models.TicketSize || mongoose.model("TicketSize", ticketSizeSchema);

export default TicketSize;
