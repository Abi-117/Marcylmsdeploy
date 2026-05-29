import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

import User from "../models/User.js";
import Payment from "../models/Payment.js";


const router = express.Router();

// ========================================
// RAZORPAY
// ========================================

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});
console.log("🔥 Payment Routes Loaded");
// ========================================
// CREATE ORDER
// ========================================
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    });

    res.json({
      success: true,
      order,
    });

  } catch (err) {
    console.log("ORDER ERROR:", err);
    res.status(500).json({ message: "Order creation failed" });
  }
});


// ========================================
// VERIFY PAYMENT
// ========================================

router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      level,
      courseId,
      amount,
    } = req.body;

    // 1. VERIFY SIGNATURE
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

    // 2. FIND USER
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. CHECK IF PAYMENT ALREADY EXISTS (SAFE IDENTITY CHECK)
    const existingPayment = await Payment.findOne({
      student: userId,
      course: courseId,
      amount,
    });

    if (existingPayment) {
      return res.json({
        success: true,
        message: "Payment already processed",
        payment: existingPayment,
      });
    }

    // 4. CREATE PAYMENT RECORD
    const payment = await Payment.create({
      student: userId,
      course: courseId,
      amount,
      status: "Paid",
      paidAt: new Date(),
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

    // 5. UNLOCK LEVEL SAFELY
    if (!user.unlockedLevels) {
      user.unlockedLevels = [];
    }

    if (!user.unlockedLevels.includes(level)) {
      user.unlockedLevels.push(level);
    }

    user.paymentStatus = "Paid";
    user.selectedLevel = level;

    await user.save();

    // 6. RESPONSE
    return res.json({
      success: true,
      message: "Payment verified successfully",
      payment,
    });

  } catch (err) {
    console.log("VERIFY ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Verification failed",
      error: err.message,
    });
  }
});
// ========================================
// ADMIN ALL PAYMENTS
// ========================================

router.get("/", async (req, res) => {

  try {

    const users = await User.find();

    let allPayments = [];

    users.forEach((user) => {

      if (
        user.payments &&
        user.payments.length > 0
      ) {

        user.payments.forEach((payment) => {

          allPayments.push({

            _id:
              payment._id,

            invoice:
              payment.invoice ||
              "INV-" +
                payment.paymentId
                  ?.slice(-5),

            studentName:
              user.name,

            studentEmail:
              user.email,

            level:
              payment.level,

            amount:
              Number(payment.amount),

            paymentId:
              payment.paymentId,

            orderId:
              payment.orderId,

            status:
              payment.status,

            date:
              new Date(
                payment.createdAt
              ).toLocaleDateString(),

          });

        });

      }

    });

    // LATEST FIRST
    allPayments.sort(
      (a, b) =>
        new Date(b.date) -
        new Date(a.date)
    );

    res.json(allPayments);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message:
        "Failed to fetch payments",
    });

  }

});

// ========================================
// USER PAYMENT HISTORY
// ========================================

router.get(
  "/history/:userId",
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.params.userId
        );

      if (!user) {

        return res.status(404).json({
          message:
            "User not found",
        });

      }

      res.json(
        user.payments || []
      );

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Server error",
      });

    }

  }
);

// ========================================
// INVOICE PDF
// ========================================

router.get(
  "/invoice/:paymentId",
  async (req, res) => {

    try {

      const users =
        await User.find();

      let payment = null;
      let paymentUser = null;

      for (const user of users) {

        const found =
          user.payments.find(
            (p) =>
              p.paymentId ===
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
          message:
            "Payment not found",
        });

      }

      const doc =
        new PDFDocument({
          margin: 50,
        });

      res.setHeader(
        "Content-Type",
        "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename=invoice-${payment.paymentId}.pdf`
      );

      doc.pipe(res);

      // ====================================
      // LOGO
      // ====================================

      const logoPath = path.join(
        process.cwd(),
        "assets",
        "logo.png"
      );

      if (
        fs.existsSync(logoPath)
      ) {

        doc.image(
          logoPath,
          50,
          30,
          {
            width: 80,
          }
        );

      }

      // ====================================
      // HEADER
      // ====================================

      doc
        .fontSize(20)
        .font(
          "Helvetica-Bold"
        )
        .text(
          "Marcys Academy of Music & Speech",
          150,
          40
        );

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(
          "Official Payment Invoice",
          150,
          70
        );

      doc
        .moveTo(50, 110)
        .lineTo(550, 110)
        .stroke();

      // ====================================
      // DETAILS
      // ====================================

      doc
        .fontSize(12)
        .font(
          "Helvetica-Bold"
        )
        .text(
          "Invoice Details",
          50,
          130
        );

      doc
        .font("Helvetica")
        .text(
          `Invoice ID: ${payment.invoice}`,
          50,
          155
        )
        .text(
          `Payment ID: ${payment.paymentId}`,
          50,
          175
        )
        .text(
          `Date: ${new Date(
            payment.createdAt
          ).toLocaleString()}`,
          50,
          195
        );

      // ====================================
      // CUSTOMER
      // ====================================

      doc
        .font(
          "Helvetica-Bold"
        )
        .text(
          "Customer Details",
          300,
          130
        );

      doc
        .font("Helvetica")
        .text(
          `Name: ${paymentUser?.name}`,
          300,
          155
        )
        .text(
          `Email: ${paymentUser?.email}`,
          300,
          175
        );

      // ====================================
      // TABLE
      // ====================================

      doc
        .fontSize(12)
        .font(
          "Helvetica-Bold"
        )
        .text(
          "Description",
          50,
          260
        )
        .text(
          "Level",
          220,
          260
        )
        .text(
          "Amount",
          320,
          260
        )
        .text(
          "Status",
          430,
          260
        );

      doc
        .moveTo(50, 280)
        .lineTo(550, 280)
        .stroke();

      doc
        .font("Helvetica")
        .text(
          "Course Payment",
          50,
          300
        )
        .text(
          payment.level,
          220,
          300
        )
        .text(
          `₹${payment.amount}`,
          320,
          300
        )
        .text(
          payment.status,
          430,
          300
        );

      // ====================================
      // FOOTER
      // ====================================

      doc
        .fontSize(10)
        .text(
          "Thank you for learning with Marcys Academy",
          50,
          720,
          {
            align: "center",
          }
        );

      doc.end();

    } catch (err) {

      console.log(
        "INVOICE ERROR:",
        err
      );

      res.status(500).json({
        message:
          "Invoice failed",
      });

    }

  }
);

export default router;