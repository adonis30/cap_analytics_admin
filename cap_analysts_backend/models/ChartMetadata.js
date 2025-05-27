import mongoose from 'mongoose';

const chartMetadataSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sourceFileName: String,
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model('ChartMetadata', chartMetadataSchema);
