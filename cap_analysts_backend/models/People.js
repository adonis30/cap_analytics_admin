import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

// Define the schema for Employee
const employeeSchema = new Schema(
  {
    title: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/, // Validate email format
    },
    phoneNumbers: { type: String, required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    position: { type: String, required: true },
    department: { type: String }, // Optional department
    hireDate: { type: Date, default: Date.now }, // Defaults to current date
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
employeeSchema.index({ organizationId: 1 });
employeeSchema.index({ lastName: 1 });

// Create and export the Employee model
const Employee = models.Employee || model('Employee', employeeSchema);

export default Employee;
