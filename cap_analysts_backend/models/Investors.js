import mongoose from "mongoose";

const { Schema, models, model } = mongoose;

// Base Investor Schema
const BaseInvestorSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["Individual", "Institution"],
      required: true,
    },
    investorCategory: {
      type: String,
      enum: [
        "Angel Investor",
        "Retail Investor",
        "Solo VC",
        "VC Firm",
        "Private Equity",
        "Bank",
        "Hedge Fund",
        "Pension Fund",
        "Sovereign Wealth Fund",
        "Family Office",
        "Corporate Venture Capital",
      ],
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    totalAmountFunded: { type: Number, required: true },
    highestAmountFunded: { type: Number, required: true },
    fundingTypes: [{ type: Schema.Types.ObjectId, ref: "FundingType" }],
    fundingRounds: [{ type: Schema.Types.ObjectId, ref: "FundingRound" }],
    fundingInstruments: [{ type: Schema.Types.ObjectId, ref: "FundingInstrument" }],
    fundedCompaniesIds: [{ type: Schema.Types.ObjectId, ref: "Company" }],
  },
  { discriminatorKey: "type", timestamps: true }
);

// Base Model
const Investor = models.Investor || model("Investor", BaseInvestorSchema);

// Individual Investor Schema
const IndividualInvestorSchema = new Schema({
  individualDetails: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    position: { type: String },
    linkedInUrl: { type: String },
    portfolioUrl: { type: String },
    imageUrl: { type: String, required: true },
    bio: { type: String },
  },
});

// Add discriminator for Individual Investors
const IndividualInvestor =
  models.IndividualInvestor ||
  Investor.discriminator("Individual", IndividualInvestorSchema);

// Institution Investor Schema
const InstitutionInvestorSchema = new Schema({
  institutionDetails: {
    organizationName: { type: String, required: true },
    description: { type: String },
    website: { type: String },
    contactNumber: { type: String },
    address: { type: String },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    contactEmail: { type: String },
    location: { type: String },
    imageUrl: { type: String, required: true },
  },
});

// Add discriminator for Institution Investors
const InstitutionInvestor =
  models.InstitutionInvestor ||
  Investor.discriminator("Institution", InstitutionInvestorSchema);

export { Investor, IndividualInvestor, InstitutionInvestor };
