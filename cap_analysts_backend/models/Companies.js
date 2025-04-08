import mongoose from "mongoose";
const { Schema, model, models } = mongoose;

// Company Schema
const CompanySchema = new Schema(
  {
    organizationName: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    industries: [{ type: String, trim: true }], // Now an array
    owners: { type: String, trim: true }, // Array of user references
    rankCompany: { type: Number, default: 0 }, // Changed to Number
    operatingStatus: { type: String, enum: ["Active", "Inactive", "Closed"], default: "Active" },
    contactNumber: { type: String, trim: true },
    contactEmail: { type: String, trim: true, lowercase: true },
    numberOfSubOrgs: { type: Number, default: 0 },
    location: { type: String, trim: true },
    imageUrl: { type: String, required: true },
    fundedDate: { type: Date },
    url: { type: String, trim: true },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }], // Array of category IDs
    people: [{ type: Schema.Types.ObjectId, ref: "Person" }], // Array of people IDs
    fundedBy: [{ type: Schema.Types.ObjectId, ref: "Investor" }], // Changed to Investor
    fundingTypes: [{ type: Schema.Types.ObjectId, ref: "FundingType" }], // Array of funding type IDs
    fundingRounds: [{ type: Schema.Types.ObjectId, ref: "FundingRound" }], // Array of funding round IDs
    fundingInstruments: [{ type: Schema.Types.ObjectId, ref: "FundingInstrument" }], // Array of funding instrument IDs
    companyCreator: { type: Schema.Types.ObjectId, ref: "User" }, // Just store user reference
    boardMembers: [
      {
        member: { type: Schema.Types.ObjectId, ref: "BoardMember", required: false }, // Not required
        position: { type: String, required: false, trim: true }, // Not required
      },
    ],
  },
  
  { timestamps: true }
);

const Company = models.Company || model("Company", CompanySchema);
export default Company;
