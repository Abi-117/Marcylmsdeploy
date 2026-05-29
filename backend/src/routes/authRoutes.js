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
    console.log("API HIT");

    const { email } = req.body;

    console.log("EMAIL:", email);

    const user = await User.findOne({ email });

    console.log("USER:", user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = generateOTP();

    console.log("OTP:", otp);

    await OTP.deleteMany({ email });

    console.log("OLD OTP DELETED");

    await OTP.create({ email, otp });

    console.log("OTP SAVED");

    await sendOTPEmail(email, otp);

    console.log("MAIL SENT SUCCESS");

    return res.json({
      message: "OTP sent successfully",
    });

  } catch (err) {
    console.log("SEND OTP ERROR:");
    console.log(err);
    console.log(err.message);

    return res.status(500).json({
      message: "Failed to send OTP",
      error: err.message,
    });
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

// ==========================================
// REGISTER
// ==========================================

router.post("/register", async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      role,

      phone,
      course,

      selectedLevel,
      level,
      batch,

      mode,
      fromTime,
      toTime,
      availableDays,

    } = req.body;

    // =========================
    // CHECK EXISTING USER
    // =========================

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // =========================
    // HASH PASSWORD
    // =========================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // =========================
    // CREATE USER
    // =========================

    const user = await User.create({

      name,
      email,

      password: hashedPassword,

      role: role || "student",

      // STUDENT DETAILS

      phone,
      course,

      selectedLevel,
      level,
      batch,

      mode,
      fromTime,
      toTime,

      availableDays,

      // DEFAULTS

      unlockedLevels: [
        level,
        batch,
      ],

      completedLevels: [],

      paymentStatus: "Pending",

      payments: [],

    });

    // =========================
    // JWT TOKEN
    // =========================

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // =========================
    // RESPONSE
    // =========================

    res.status(201).json({

      message: "Register Success",

      token,

      user,

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error",
    });

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