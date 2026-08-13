import dotenv from "dotenv";
dotenv.config();

import cron from "node-cron";

import Payment from "../models/Payment.js";
import MailLog from "../models/MailLog.js";

import { sendMail } from "../utils/mailer.js";

console.log("Payment Reminder Loaded ✅");

let running = false;


// =========================================
// DAILY PAYMENT REMINDER
// Runs every day at 9:00 AM
// =========================================

cron.schedule("0 9 * * *", async () => {

  if (running) {
    console.log(
      "Payment reminder already running..."
    );

    return;
  }

  running = true;

  try {

    const today = new Date();

    const sevenDaysLater =
      new Date(
        today.getTime() +
        7 * 24 * 60 * 60 * 1000
      );


    // =====================================
    // FIND PAYMENTS DUE WITHIN 7 DAYS
    // =====================================

    const payments =
      await Payment.find({

        status: "Paid",

        nextDueDate: {
          $gte: today,
          $lte: sevenDaysLater,
        },

      }).populate("student");


    console.log(
      "Payment reminders found:",
      payments.length
    );


    // =====================================
    // SEND EMAIL
    // =====================================

    for (const payment of payments) {

      if (!payment.student) continue;

      if (!payment.student.email) continue;


      // ===================================
      // CHECK TODAY'S REMINDER ALREADY SENT
      // ===================================

      const startOfDay =
        new Date(today);

      startOfDay.setHours(
        0,
        0,
        0,
        0
      );


      const endOfDay =
        new Date(today);

      endOfDay.setHours(
        23,
        59,
        59,
        999
      );


      const alreadySent =
        await MailLog.findOne({

          student:
            payment.student._id,

          type:
            "payment-reminder",

          createdAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },

        });


      if (alreadySent) {

        console.log(
          "Reminder already sent:",
          payment.student.email
        );

        continue;

      }


      // ===================================
      // SEND MAIL
      // ===================================

      await sendMail({

        to:
          payment.student.email,

        subject:
          "Monthly Payment Reminder",

        html: `
          <h2>
            Hello ${payment.student.name}
          </h2>

          <p>
            Your next payment is due on
            <strong>
              ${payment.nextDueDate.toDateString()}
            </strong>
          </p>

          <p>
            Please complete your payment
            before the due date.
          </p>
        `,

      });


      // ===================================
      // SAVE MAIL LOG
      // ===================================

      await MailLog.create({

        student:
          payment.student._id,

        type:
          "payment-reminder",

        subject:
          "Monthly Payment Reminder",

        email:
          payment.student.email,

      });


      console.log(
        "Payment reminder sent:",
        payment.student.email
      );

    }

  } catch (error) {

    console.log(
      "PAYMENT REMINDER ERROR:",
      error
    );

  } finally {

    running = false;

  }

});