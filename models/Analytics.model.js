import mongoose from "mongoose";

const AnalyticsSchema = new mongoose.Schema(
  {
    url: { type: mongoose.Schema.Types.ObjectId, ref: "Url", required: true }, // Reference to Url
    timestamp: { type: Date, default: Date.now },
    ipAddress: { type: String },
    osType: { type: String },
    deviceType: { type: String },
  },
  { timestamps: true }
);

const Analytics = mongoose.model("Analytics", AnalyticsSchema);
export default Analytics;
