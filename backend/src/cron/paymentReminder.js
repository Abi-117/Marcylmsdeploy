import cron from "node-cron";
import Payment from "../models/Payment.js";
import User from "../models/User.js";
import MailLog from "../models/MailLog.js";
import { sendMail } from "../utils/sendMail.js";

cron.schedule("0 9 * * *", async () => {

  const today = new Date();

  const payments =
    await Payment.find({
      status: "Paid",
    }).populate("student");

  for (const payment of payments) {

    if (!payment.nextDueDate) continue;

    const diffDays = Math.ceil(
      (payment.nextDueDate - today) /
      (1000 * 60 * 60 * 24)
    );

    if (diffDays <= 365) {

      await sendMail({
        to: payment.student.email,
        subject:
          "Monthly Payment Reminder",
        html: `
          <h2>Hello ${payment.student.name}</h2>
          <p>Your next payment is due on
          ${payment.nextDueDate.toDateString()}</p>
        `,
      });

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
    }
  }
});