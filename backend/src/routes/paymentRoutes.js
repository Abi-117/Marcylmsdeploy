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
import Course from "../models/Course.js";

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

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: "INR",
      receipt: "rcpt_" + Date.now(),
    });

    return res.json({
      success: true,
      order,
    });

  } catch (err) {

    console.log("CREATE ORDER ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Order creation failed",
    });

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
      courseId,
      amount,
    } = req.body;

    // ====================================
    // VALIDATION
    // ====================================

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !userId ||
      !courseId
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ====================================
    // VERIFY SIGNATURE
    // ====================================

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

    // ====================================
    // FIND USER
    // ====================================

    const user =
      await User.findById(userId);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }

    // ====================================
    // FIND COURSE
    // ====================================

    const course =
      await Course.findById(courseId);

    if (!course) {

      return res.status(404).json({
        success: false,
        message: "Course not found",
      });

    }

    // ====================================
    // CHECK DUPLICATE PAYMENT
    // ====================================

    const existingPayment =
  await Payment.findOne({
    student: userId,
  course: courseId,
  });

if (existingPayment) {

  return res.json({
    success: true,
    alreadyPaid: true,
    message: "Payment already processed",
    payment: existingPayment,
  });

}
    // ====================================
    // CREATE PAYMENT
    // ====================================

   const payment =
  await Payment.create({
    student: userId,
    course: courseId,
    level: course.mainLevel,
    amount: Number(amount),
    status: "Paid",
    paidAt: new Date(),

    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id,
  });

    // ====================================
    // UPDATE USER
    // ====================================

    user.paymentStatus = "Paid";

    // CURRENT ACTIVE GRADE
   // ACTIVE COURSE (current)
user.course = course._id;

// STORE HISTORY (IMPORTANT FIX)
if (!user.levelHistory) {
  user.levelHistory = [];
}

user.levelHistory.push({
  course: course._id,
  grade: course.grade,
  paidAt: new Date(),
});

    // STORE PAID COURSES
    if (!user.unlockedLevels) {
      user.unlockedLevels = [];
    }

    // grade unlock
    if (
      !user.unlockedLevels.includes(
        course.grade
      )
    ) {

      user.unlockedLevels.push(
        course.grade
      );

    }

    await user.save();

    // ====================================
    // RESPONSE
    // ====================================

    return res.json({
      success: true,
      message:
        "Payment verified successfully",
      payment,
    });

  } catch (err) {

    console.log(
      "VERIFY PAYMENT ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message: "Verification failed",
      error: err.message,
    });

  }

});

// ========================================
// ADMIN - ALL PAYMENTS
// ========================================

router.get("/", async (req, res) => {

  try {

    const payments =
      await Payment.find()

        .populate(
          "student",
          "name email"
        )

        .populate(
          "course",
          "name grade mainLevel fee"
        )

        .sort({
          createdAt: -1,
        });

    return res.json(payments);

  } catch (err) {

    console.log(
      "GET PAYMENTS ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch payments",
    });

  }

});

// ========================================
// SINGLE STUDENT PAYMENTS
// ========================================

router.get(
  "/student/:userId",
  async (req, res) => {

    try {

      const payments =
        await Payment.find({
          student:
            req.params.userId,
        })

          .populate(
            "course",
            "name grade mainLevel fee"
          )

          .sort({
            createdAt: -1,
          });

      return res.json(payments);

    } catch (err) {

      console.log(
        "STUDENT PAYMENT ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch student payments",
      });

    }

  }
);

// ========================================
// PAYMENT HISTORY
// ========================================

router.get(
  "/history/:userId",
  async (req, res) => {

    try {

      const payments =
        await Payment.find({
          student:
            req.params.userId,
        })

          .populate(
            "course",
            "name grade mainLevel fee"
          )

          .sort({
            createdAt: -1,
          });

      return res.json(payments);

    } catch (err) {

      console.log(
        "PAYMENT HISTORY ERROR:",
        err
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch history",
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

      // ====================================
      // FIND PAYMENT
      // ====================================

      const payment =
        await Payment.findById(
          req.params.paymentId
        )

          .populate(
            "student",
            "name email"
          )

          .populate(
            "course",
            "name grade mainLevel"
          );

      if (!payment) {

        return res.status(404).json({
          success: false,
          message:
            "Payment not found",
        });

      }

      // ====================================
      // PDF START
      // ====================================

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
        `attachment; filename=invoice-${payment._id}.pdf`
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
        .fontSize(22)
        .font(
          "Helvetica-Bold"
        )
        .text(
          "Marcys Academy of Music & Speech",
          150,
          40
        );

      doc
        .fontSize(11)
        .font("Helvetica")
        .text(
          "Official Payment Invoice",
          150,
          72
        );

      doc
        .moveTo(50, 110)
        .lineTo(550, 110)
        .stroke();

      // ====================================
      // INVOICE DETAILS
      // ====================================

      doc
        .fontSize(13)
        .font(
          "Helvetica-Bold"
        )
        .text(
          "Invoice Details",
          50,
          140
        );

      doc
        .font("Helvetica")
        .fontSize(11)

        .text(
          `Invoice ID: INV-${payment._id
            .toString()
            .slice(-6)}`,
          50,
          170
        )

        .text(
          `Payment ID: ${payment.paymentId || "-"}`,
          50,
          190
        )

        .text(
          `Order ID: ${payment.orderId || "-"}`,
          50,
          210
        )

        .text(
          `Date: ${new Date(
            payment.createdAt
          ).toLocaleString()}`,
          50,
          230
        );

      // ====================================
      // CUSTOMER DETAILS
      // ====================================

      doc
        .font(
          "Helvetica-Bold"
        )
        .fontSize(13)
        .text(
          "Customer Details",
          320,
          140
        );

      doc
        .font("Helvetica")
        .fontSize(11)

        .text(
          `Name: ${payment.student?.name || "-"}`,
          320,
          170
        )

        .text(
          `Email: ${payment.student?.email || "-"}`,
          320,
          190
        );

      // ====================================
      // TABLE HEADER
      // ====================================

      doc
        .font(
          "Helvetica-Bold"
        )
        .fontSize(12)

        .text(
          "Course",
          50,
          300
        )

        .text(
          "Grade",
          220,
          300
        )

        .text(
          "Amount",
          340,
          300
        )

        .text(
          "Status",
          450,
          300
        );

      doc
        .moveTo(50, 320)
        .lineTo(550, 320)
        .stroke();

      // ====================================
      // TABLE DATA
      // ====================================

      doc
        .font("Helvetica")
        .fontSize(11)

        .text(
          payment.course?.name || "-",
          50,
          340
        )

        .text(
          payment.course?.grade || "-",
          220,
          340
        )

        .text(
          `₹${payment.amount}`,
          340,
          340
        )

        .text(
          payment.status,
          450,
          340
        );

      // ====================================
      // FOOTER
      // ====================================

      doc
        .fontSize(10)
        .font("Helvetica")

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

      return res.status(500).json({
        success: false,
        message:
          "Invoice generation failed",
      });

    }

  }
);

export default router;