import cron from "node-cron";
import Class from "../models/Class.js";
import MailLog from "../models/MailLog.js";
import { sendMail } from "../utils/mailer.js";

cron.schedule("* * * * *", async () => {

  const now = new Date();

  const classes =
    await Class.find({
      status: "Upcoming",
    }).populate(
      "students"
    );

  for (const cls of classes) {

    const classTime =
      new Date(cls.date);

    const diff =
      (classTime - now) /
      (1000 * 60);

    if (
      diff <= 5 &&
      diff > 4
    ) {

      for (const student of cls.students) {

        await sendMail({
          to: student.email,
          subject:
            "Class Starting Soon",
          html: `
          <h2>Hello ${student.name}</h2>

          <p>
          Your class
          ${cls.title}
          starts in 5 minutes.
          </p>

          <a href="${cls.meetingLink}">
            Join Class
          </a>
          `,
        });

        await MailLog.create({
          student:
            student._id,
          type:
            "class-reminder",
          subject:
            "Class Starting Soon",
          email:
            student.email,
        });
      }
    }
  }
});