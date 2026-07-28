import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

console.log("MAILER USER:", process.env.EMAIL_USER);
console.log("MAILER PASS:", process.env.EMAIL_PASS ? "Loaded" : "Missing");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err, success) => {
  console.log("VERIFY RESULT:");
  console.log(err || success);
});



export const sendOTPEmail = async (email, otp) => {
  console.log("========== MAIL START ==========");
  console.log("TO:", email);
  console.log("OTP:", otp);

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <h2>Password Reset OTP</h2>
        <h1>${otp}</h1>
        <p>This OTP expires in 5 minutes.</p>
      `,
    });

    console.log("MAIL SUCCESS");
    console.log(info);

    return info;

  } catch (err) {

    console.log("MAIL FAILED");
    console.log(err);
    console.log(err.response);
    console.log(err.responseCode);
    console.log(err.command);

    throw err;
  }
};


export const sendMail = async ({
  to,
  subject,
  html,
}) => {
  return await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};

export default transporter;