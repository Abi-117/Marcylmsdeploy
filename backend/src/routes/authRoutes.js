import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import OTP from "../models/otpModel.js";
import { sendOTPEmail } from "../utils/mailer.js";
import User from "../models/User.js";

const router = express.Router();




function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// ================= SEND OTP =================
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();

    await OTP.deleteMany({ email });

    await OTP.create({ email, otp });

    // ✅ SEND EMAIL HERE
    await sendOTPEmail(email, otp);

    res.json({
      message: "OTP sent successfully to email",
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
});


// ================= RESET PASSWORD =================
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const record = await OTP.findOne({ email, otp });

    if (!record)
      return res.status(400).json({ message: "Invalid OTP" });

    if (record.expiresAt < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const hashed = await bcrypt.hash(password, 10);

    user.password = hashed;
    await user.save();

    await OTP.deleteMany({ email });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Reset failed" });
  }
});



// ==========================================
// REGISTER
// ==========================================

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      unlockedLevels: [],
      completedLevels: [],
      paymentStatus: "Pending",
      payments: [],
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



// ==========================================
// LOGIN
// ==========================================

router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    if (user.role !== role)
      return res.status(400).json({ message: "Invalid role" });

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;