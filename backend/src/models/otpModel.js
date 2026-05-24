import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: String,

    otp: String,
  },
  { timestamps: true }
);

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;