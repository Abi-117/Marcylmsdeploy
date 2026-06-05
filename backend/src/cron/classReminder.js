import dotenv from "dotenv";
dotenv.config();

import cron from "node-cron";
import Class from "../models/Class.js";
import MailLog from "../models/MailLog.js";
import { sendMail } from "../utils/mailer.js";

console.log("Class Reminder Loaded ✅");

cron.schedule("* * * * *", async () => {

  console.log("Checking classes...");

  const now = new Date();

  const classes = await Class.find({
    status: "Upcoming",
  }).populate("students");

  console.log("Classes Found:", classes.length);

  for (const cls of classes) {

    const classTime = new Date(cls.date);

    const diff =
      (classTime - now) /
      (1000 * 60);

    console.log(
      cls.title,
      "Minutes Left:",
      diff
    );

    if (diff <= 5 && diff >= 0) {

      console.log(
        "Sending reminder..."
      );

      for (const student of cls.students) {

        try {

          const info =
            await sendMail({
              to: student.email,
              subject: "Class Starting Soon",
              html: `
                <h2>Hello ${student.name}</h2>
                <p>
                Your class
                ${cls.title}
                starts in 5 minutes.
                </p>
              `,
            });

          console.log(
            "MAIL SENT:",
            student.email
          );

          await MailLog.create({
            student: student._id,
            type: "class-reminder",
            subject: "Class Starting Soon",
            email: student.email,
          });

        } catch (err) {

          console.log(
            "MAIL ERROR:",
            err
          );

        }

      }

    }

  }

});