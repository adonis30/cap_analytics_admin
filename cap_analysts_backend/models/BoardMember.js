import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

// Define the schema for BoardMember
const boardMemberSchema = new Schema(
  {
    title: { type: String, required: true }, // Title (e.g., Mr., Dr., etc.)
    firstName: { type: String, required: true }, // First name of the board member
    lastName: { type: String, required: true }, // Last name of the board member
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/, // Validate email format
    },
    phoneNumbers: { type: [String] }, // Array of phone numbers (optional)
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true }, // Reference to the organization
    roles: { type: [String], required: true }, // Roles (e.g., Chairperson, Treasurer)
    tenureStart: { type: Date, required: true }, // Start date of tenure
    tenureEnd: { type: Date }, // Optional end date of tenure
    affiliations: { type: [String] }, // Other affiliations or organizations
    address: { type: String }, // Optional address
    linkedInUrl: {
      type: String,
      match: /^https:\/\/(www\.)?linkedin\.com\/.*$/, // Validate LinkedIn URL
    },
    photoUrl: { type: String }, // Optional photo URL
    bio: { type: String }, // Optional biography
  },
  {
    timestamps: true, // Add `createdAt` and `updatedAt` fields automatically
  }
);

// Add indexes for faster query performance
boardMemberSchema.index({ organizationId: 1 });
boardMemberSchema.index({ lastName: 1 });

// Create and export the BoardMember model
const BoardMember = models.BoardMember || model("BoardMember", boardMemberSchema);

export default BoardMember;
