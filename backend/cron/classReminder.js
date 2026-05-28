import cron from "node-cron";
import dotenv from "dotenv";
import axios from "axios";

// 👇 IMPORT YOUR REAL MODEL (CHANGE PATH IF NEEDED)
import Student from "../src/models/Student.js";

dotenv.config();

let isRunning = false;

/**
 * Send WhatsApp via Twilio
 */
async function sendWhatsApp(to, message) {
  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_SID}/Messages.json`;

    const params = new URLSearchParams();
    params.append("To", `whatsapp:${to}`);
    params.append("From", process.env.TWILIO_WHATSAPP);
    params.append("Body", message);

    const auth = {
      username: process.env.TWILIO_SID,
      password: process.env.TWILIO_AUTH,
    };

    const res = await axios.post(url, params, { auth });

    return res.data;
  } catch (err) {
    console.error("❌ WhatsApp Error:", err.response?.data || err.message);
  }
}

/**
 * REAL DB QUERY (NO DUMMY DATA)
 * Adjust fields based on your schema
 */
async function getStudentsForReminder() {
  try {
    const students = await Student.find({
      isActive: true,
    }).lean();

    return students;
  } catch (err) {
    console.error("❌ DB Fetch Error:", err.message);
    return [];
  }
}

/**
 * MAIN PROCESS
 */
async function processReminders() {
  if (isRunning) {
    console.log("⛔ Cron already running, skipping...");
    return;
  }

  isRunning = true;

  try {
    console.log("🚀 Fetching students from DB...");

    const students = await getStudentsForReminder();

    if (!students.length) {
      console.log("ℹ️ No students found");
      return;
    }

    console.log(`📩 Found ${students.length} students`);

    const batchSize = 5;

    for (let i = 0; i < students.length; i += batchSize) {
      const batch = students.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (student) => {
          // 🔥 adjust field names based on your DB
          const phone = student.phone;
          const name = student.name;
          const course = student.courseName || "your course";

          // Example logic (customize this)
          const message = `Hi ${name}, reminder for your ${course} class. Please attend on time.`;

          if (phone) {
            await sendWhatsApp(phone, message);
          }
        })
      );
    }

    console.log("✅ All reminders processed");
  } catch (err) {
    console.error("❌ Cron Error:", err.message);
  } finally {
    isRunning = false;
  }
}

/**
 * CRON JOB (every 1 minute)
 */
cron.schedule("* * * * *", async () => {
  console.log("🕒 Checking:", new Date().toLocaleTimeString());

  setImmediate(async () => {
    await processReminders();
  });
});

console.log("✅ LMS Reminder Cron Started");