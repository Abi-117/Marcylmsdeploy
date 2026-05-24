import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

import User from "../models/User.js";

const router = express.Router();

// =========================
// RAZORPAY INIT
// =========================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

// =========================
// CREATE ORDER
// =========================
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const order = await razorpay.orders.create({
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json({ success: true, order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Order creation failed" });
  }
});

// =========================
// VERIFY PAYMENT (ONLY ONE)
// =========================
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      level,
      amount,
    } = req.body;

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // unlock level
    if (!user.unlockedLevels.includes(level)) {
      user.unlockedLevels.push(level);
    }

    user.paymentStatus = "Paid";
    user.selectedLevel = level;
    user.teacherId = "teacher1";

    user.payments.push({
      level,
      amount,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "Paid",
      createdAt: new Date(),
    });

    await user.save();

    res.json({
      success: true,
      unlockedLevels: user.unlockedLevels,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Verification failed" });
  }
});

// =========================
// PAYMENT HISTORY (MATCH FRONTEND)
// =========================
router.get("/history/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.payments || []);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

// =========================
// INVOICE (MATCH FRONTEND BUTTON)
// =========================
router.get("/invoice/:paymentId", async (req, res) => {
  try {
    const users = await User.find();

    let payment = null;
    let paymentUser = null;

    for (const user of users) {
      const found = user.payments.find(
        (p) => p.paymentId === req.params.paymentId
      );

      if (found) {
        payment = found;
        paymentUser = user;
        break;
      }
    }

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${payment.paymentId}.pdf`
    );

    doc.pipe(res);

    // =========================
    // LOGO
    // =========================
    const logoPath = path.join(process.cwd(), "assets", "logo.png");

    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 30, { width: 80 });
    }

    // =========================
    // COMPANY NAME HEADER
    // =========================
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("Marcys Academy of Music & Speech", 150, 40);

    doc
      .fontSize(10)
      .font("Helvetica")
      .text("Official Payment Invoice", 150, 70);

    // LINE
    doc.moveTo(50, 110).lineTo(550, 110).stroke();

    doc.moveDown(2);

    // =========================
    // INVOICE DETAILS BOX
    // =========================
    doc.fontSize(12).font("Helvetica-Bold").text("Invoice Details", 50, 130);

    doc.font("Helvetica");

    doc.text(`Invoice ID: ${payment.paymentId}`, 50, 155);
    doc.text(`Order ID: ${payment.orderId}`, 50, 175);
    doc.text(`Date: ${new Date(payment.createdAt).toLocaleString()}`, 50, 195);

    // =========================
    // CUSTOMER DETAILS
    // =========================
    doc.font("Helvetica-Bold").text("Customer Details", 300, 130);

    doc.font("Helvetica");
    doc.text(`Name: ${paymentUser?.name || "N/A"}`, 300, 155);
    doc.text(`Email: ${paymentUser?.email || "N/A"}`, 300, 175);

    // =========================
    // PAYMENT TABLE HEADER
    // =========================
    doc.moveDown(4);

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Description", 50, 250)
      .text("Level", 200, 250)
      .text("Amount", 300, 250)
      .text("Status", 400, 250);

    doc.moveTo(50, 270).lineTo(550, 270).stroke();

    // =========================
    // PAYMENT ROW
    // =========================
    doc
      .font("Helvetica")
      .text("Course Payment", 50, 290)
      .text(payment.level, 200, 290)
      .text(`₹${payment.amount}`, 300, 290)
      .text(payment.status, 400, 290);

    // =========================
    // FOOTER
    // =========================
    doc
      .fontSize(10)
      .text(
        "Thank you for learning with Marcys Academy of Music & Speech",
        50,
        700,
        { align: "center" }
      );

    doc.end();
  } catch (err) {
    console.log("INVOICE ERROR:", err);
    res.status(500).json({ message: "Invoice failed" });
  }
});

export default router;