// models/InvestmentAsk.js
import mongoose from "mongoose";

const investmentAskSchema = new mongoose.Schema({
  min: { type: Number, required: true },
  max: { type: Number, required: true },
  description: { type: String },
}, {
  timestamps: true,
});

const InvestmentAsk = mongoose.models.InvestmentAsk || mongoose.model("InvestmentAsk", investmentAskSchema);
export default InvestmentAsk;
