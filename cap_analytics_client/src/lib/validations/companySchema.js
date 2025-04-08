import { z } from "zod";

export const CompanySchema = z.object({
  organizationName: z.string().min(1, "Company Name is required"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  industries: z.array(z.string()).min(1, "Select at least one industry"),
  operatingStatus: z.string().min(1, "Operating status is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  contactEmail: z.string().email("Invalid email format"),
  fundingTypes: z.array(z.string()).min(1, "Select at least one funding type"),
  fundedBy: z.array(z.string()).min(1, "Select at least one investor"),
});
