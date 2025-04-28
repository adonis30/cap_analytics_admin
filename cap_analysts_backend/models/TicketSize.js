import mongoose from "mongoose";


const ticketSizeSchema = new mongoose.Schema(
  {
    number: { type: String, required: true }, // Required name field
    description: { type: String }, // Optional description field
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Use an existing model if it exists, or create a new one
const TicketSize = mongoose.models.TicketSize || mongoose.model("TicketSize", ticketSizeSchema);

export default TicketSize;