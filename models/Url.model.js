import mongoose from "mongoose";

const UrlSchema = new mongoose.Schema(
  {
    longUrl: { type: String, required: true },
    shortUrl: { type: String, required: true },
    alias: { type: String, required: true, unique: true },
    topic: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
    clicks: [
      {
        timestamp: { type: Date, default: Date.now },
        ipAddress: { type: String },
        osType: { type: String },
        deviceType: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Url = mongoose.model("Url", UrlSchema);
export default Url;
