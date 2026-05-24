import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import PDFDocument from "pdfkit";

import User from "../models/User.js";

const router = express.Router();

// ======================================
// RAZORPAY
// ======================================

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

// ======================================
// CREATE ORDER
// ======================================

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    res.json({
      success: true,
      order,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
});

// ======================================
// VERIFY PAYMENT
// ======================================

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

    // VERIFY SIGNATURE

    const body =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_SECRET
      )
      .update(body.toString())
      .digest("hex");

    if (
      expectedSignature !==
      razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    // FIND USER

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // UNLOCK LEVEL

    if (
      !user.unlockedLevels.includes(level)
    ) {
      user.unlockedLevels.push(level);
    }

    user.paymentStatus = "Paid";
    user.selectedLevel = level;
    // =========================
// AUTO ASSIGN TEACHER
// =========================

user.teacherId = "teacher1";

    // SAVE PAYMENT

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
      message: "Payment success",
      unlockedLevels:
        user.unlockedLevels,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
});

// ======================================
// PAYMENT HISTORY
// ======================================

router.get(
  "/history/:userId",
  async (req, res) => {
    try {
      const user = await User.findById(
        req.params.userId
      );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json(user.payments || []);
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

// ======================================
// DOWNLOAD INVOICE
// ======================================

router.get(
  "/invoice/:paymentId",
  async (req, res) => {
    try {
      const users = await User.find();

      let payment = null;
      let paymentUser = null;

      for (const user of users) {
        const found =
          user.payments.find(
            (p) =>
              p._id.toString() ===
              req.params.paymentId
          );

        if (found) {
          payment = found;
          paymentUser = user;
          break;
        }
      }

      if (!payment) {
        return res.status(404).json({
          message: "Payment not found",
        });
      }

      const doc = new PDFDocument();

      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=invoice.pdf`
      );

      doc.pipe(res);

      doc.fontSize(22).text(
        "Marcy LMS Invoice",
        {
          align: "center",
        }
      );

      doc.moveDown();

      doc.text(
        `Student: ${paymentUser.name}`
      );

      doc.text(
        `Email: ${paymentUser.email}`
      );

      doc.text(
        `Level: ${payment.level}`
      );

      doc.text(
        `Amount: ₹${payment.amount}`
      );

      doc.text(
        `Payment ID: ${payment.paymentId}`
      );

      doc.text(
        `Order ID: ${payment.orderId}`
      );

      doc.text(
        `Status: ${payment.status}`
      );

      doc.text(
        `Date: ${new Date(
          payment.createdAt
        ).toLocaleString()}`
      );

      doc.end();
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "Invoice failed",
      });
    }
  }
);
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

    const sign =
      razorpay_order_id +
      "|" +
      razorpay_payment_id;

    const expectedSign = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_SECRET
      )
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {

      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });

    }

    const user = await User.findById(userId);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }

    // unlock level

    if (
      !user.unlockedLevels.includes(level)
    ) {
      user.unlockedLevels.push(level);
    }

    user.paymentStatus = "Paid";

    user.selectedLevel = level;

    // teacher assign

    user.teacherId = "teacher1";

    // payment save

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

    res.status(500).json({
      success: false,
      message: "Verification failed",
    });

  }
});
export default router;