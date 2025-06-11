import mongoose from 'mongoose';

const chartDataSchema = new mongoose.Schema(
  {
    metadataId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChartMetadata',
      required: true,
    },
    // dynamic fields will go here
  },
  {
    strict: false,        // allow dynamic keys (since chart structure varies)
    timestamps: true,     // createdAt and updatedAt
  }
);

export default mongoose.model('ChartData', chartDataSchema);
