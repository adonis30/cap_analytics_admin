import mongoose from "mongoose";

const ChartSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: ["line", "bar", "pie", "area", "scatter"],
    required: true,
  },
  xField: { type: String, required: true }, // e.g., 'Year'
  yField: { type: String, required: true }, // e.g., 'Investment Volume'
  groupField: { type: String }, // e.g., 'Country' (optional)
  rawData: [
    {
      type: Map,
      of: mongoose.Schema.Types.Mixed, // e.g., { Year: 2023, Investment: 2000 }
    },
  ],
  sourceFileName: { type: String },
  uploadedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

export default mongoose.models.Chart || mongoose.model("Chart", ChartSchema);
