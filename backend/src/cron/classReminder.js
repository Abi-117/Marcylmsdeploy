import dotenv from "dotenv";
dotenv.config();

import cron from "node-cron";
import Class from "../models/Class.js";
import MailLog from "../models/MailLog.js";
import { sendMail } from "../utils/mailer.js";

console.log("Class Reminder Loaded ✅");

cron.schedule("* * * * *", async () => {

  const now = new Date();

  const classes = await Class.find({
    status: "Upcoming",
    reminderSent: false,
  }).populate("students");

  for (const cls of classes) {

    const diff =
      (new Date(cls.date) - now) /
      (1000 * 60);

    if (diff <= 5 && diff >= 0) {

      for (const student of cls.students) {

        await sendMail({
          to: student.email,
          subject: "Class Starting Soon",
          html: `
            <h2>Hello ${student.name}</h2>
            <p>
              Your class starts in less than 5 minutes.
            </p>
          `,
        });

      }

      // IMPORTANT
      cls.reminderSent = true;
      await cls.save();

      console.log(
        "Reminder Sent:",
        cls.title
      );

    }

  }

});