import mongoose from "mongoose";

const ChartMetadataSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sheetName: { type: String },
  sourceFileName: { type: String },
  uploadedAt: { type: Date, default: Date.now },
  region: {
    type: String,
    enum: ["Global", "Africa", "Asia", "Europe", "North America", "South America"],
    required: true,
  },
  country: {
    type: String,
    trim: true,
  },

  category: {
    type: String,
    enum: ["Macroeconomic Overview", "Business Climate", "Investment Trends"],
    required: true,
  },

  name: {
    type: String,
    required: true,
    trim: true,
  },

  chartType: {
    type: String,
    enum: ["line", "bar", "pie", "area", "combo", "map" ],
    default: "line",
  },
 chartSubtype: {
  type: String,
  enum: [
    'default',

    // ✅ Line chart subtypes
    'monotone', 'step', 'spline', 'stepped',

    // ✅ Bar chart subtypes
    'grouped', 'stacked', 'horizontal', 'percent',

    // ✅ Area chart subtypes
    'stacked_area', 'percentage_area',

    // ✅ Pie chart subtypes
    'donut',

    // ✅ Combo chart subtypes
    'line-bar', 'area-bar', 'multi-axis',

    // ✅ Map chart subtypes
    'choropleth', 'heatmap', 'bubble_map'
  ],
  default: 'default',
},

}, { timestamps: true });

const ChartMetadata = mongoose.model("ChartMetadata", ChartMetadataSchema);
export default ChartMetadata;
