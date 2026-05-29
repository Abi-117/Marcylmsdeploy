import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: String,
    otp: String,
    expiresAt: {
      type: Date,
      default: () => Date.now() + 5 * 60 * 1000, // 5 min
    },
  },
  { timestamps: true }
);

export default mongoose.model("OTP", otpSchema);