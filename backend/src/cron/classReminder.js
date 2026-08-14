import dotenv from "dotenv";
dotenv.config();

import cron from "node-cron";
import Class from "../models/Class.js";
import { sendMail } from "../utils/mailer.js";

console.log("Class Reminder Loaded ✅");

let running = false;

cron.schedule("* * * * *", async () => {

  // Prevent overlapping executions
  if (running) {
    console.log("Class reminder already running...");
    return;
  }

  running = true;

  const startedAt = Date.now();

  try {

    console.log(
      "CLASS CRON START:",
      new Date().toISOString()
    );

    const now = new Date();

    const classes = await Class.find({
      status: "Upcoming",
      reminderSent: false,
    }).populate("students");

    console.log(
      "Upcoming classes found:",
      classes.length
    );

    for (const cls of classes) {

      const classDate = new Date(cls.date);

      const diff =
        (classDate - now) /
        (1000 * 60);

      // Only classes starting within next 5 minutes
      if (diff <= 5 && diff >= 0) {

        console.log(
          `Sending reminder: ${cls.title} | Students: ${cls.students.length}`
        );

        // Send all student emails together
        const emailJobs = cls.students
          .filter((student) => student?.email)
          .map((student) =>
            sendMail({
              to: student.email,

              subject: "Class Starting Soon",

              html: `
                <h2>Hello ${student.name}</h2>

                <p>
                  Your class
                  <strong>${cls.title}</strong>
                  starts in less than 5 minutes.
                </p>

                <p>
                  Please be ready for your class.
                </p>
              `,
            })
          );

        await Promise.all(emailJobs);

        // Mark reminder as sent
        cls.reminderSent = true;

        await cls.save();

        console.log(
          "Reminder Sent:",
          cls.title
        );
      }
    }

    const duration =
      Date.now() - startedAt;

    console.log(
      `CLASS CRON END (${duration}ms)`
    );

  } catch (error) {

    console.error(
      "CLASS REMINDER ERROR:",
      error
    );

  } finally {

    running = false;

  }

});
