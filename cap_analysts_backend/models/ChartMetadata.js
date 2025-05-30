import mongoose from "mongoose";

const ChartMetadataSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sheetName: { type: String },
  sourceFileName: { type: String },
  uploadedAt: { type: Date, default: Date.now },

  category: {
    type: String,
    enum: ["Macroeconomic Overview", "Business Climate", "Investment Trends"],
    required: true,
  },

  name: {
    type: String,
    required: true,
    enum: [
      // Macroeconomic Overview
      "Economic Growth",
      "Inflation and exchange rate",
      "Preliminary Annual GDP, 2024",
      "Purchasing Manager's Index",
      "Commecial Bank lending Rate",
      "population growth rate",
      "Central Govt External Debt (US$ bn), SOE External Debt (US$ bn) and Domestic Debt (K bn)",

      // Business Climate
      "Ease of Doing Business Score 2021 to 2024",
      "Ease of Starting a Business",
      "Business Confidence Index",
      "Regulatory Quality Index",
      "Corruption Perception Index",
      "Business Taxation Metrics",
      "Ease of Obtaining Permits",

      // Investment Trends
      "FDI Inflows and Gdp growth rate(2021-2023)",
      "Actualised Investments by Sector in (millions)  2021– 2024 ",
      "FDI Inflows (USD Million) ",
      "Cut-off Coupon Rate  and Cut-off Yield Rate 2025",
      "Total Liabilities (USD Billion) and Change",
    ],
  },

  chartType: {
    type: String,
    enum: ["line", "bar", "pie", "area", "combo"],
    default: "line",
  },
  chartSubtype: {
  type: String,
  enum: [
    'default',
    'grouped', 'stacked', 'horizontal',            // bar
    'spline', 'stepped',                           // line
    'stacked_area', 'percentage_area',             // area
    'line_bar', 'multi_axis'                       // combo
  ],
  default: 'default',
},

});

const ChartMetadata = mongoose.model("ChartMetadata", ChartMetadataSchema);
export default ChartMetadata;
