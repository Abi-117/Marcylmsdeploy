// src/controllers/authController.js
import Course from "../models/Course.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import OTP from "../models/otpModel.js";
import { sendOTPEmail } from "../utils/mailer.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const {
  name,
  email,
  password,
  role,
  phone,
  course,
  mode,
  exp,
  qualification,

  level,
  batch,
  fromTime,
  toTime,
  availableDays,
  parentName,
  address,
  image,
} = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // =========================
// COURSE SEAT CHECK
// =========================

if (role === "student" && course) {
  const selectedCourse = await Course.findById(course);

  if (!selectedCourse) {
    return res.status(404).json({
      message: "Course not found",
    });
  }

  if (selectedCourse.students >= selectedCourse.maxStudents) {
   return res.status(400).json({
  message:
    "The selected day and time slot is already full. Please choose another available time slot.",
});
  }
}

    const user = await User.create({
  name,
  email,
  password: hashedPassword,
  role,
  phone,
  course,

  mode,
  exp,
  qualification,

  level,
  batch,
  fromTime,
  toTime,
  availableDays,

  parentName,
  address,

  profileImage: image,
});
// =========================
// INCREASE STUDENT COUNT
// =========================

if (role === "student" && course) {
  await Course.findByIdAndUpdate(course, {
    $inc: {
      students: 1,
    },
  });
}
    res.status(201).json({
      message: "Register Success",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login Success",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Email not found",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;

    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
    });

    res.json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// // RESET PASSWORD
// export const resetPassword = async (req, res) => {
//   try {
//     const { email, otp, password } = req.body;

//     const user = await User.findOne({
//       email,
//       otp,
//     });

//     if (!user) {
//       return res.status(400).json({
//         message: "Invalid OTP",
//       });
//     }

//     if (user.otpExpire < Date.now()) {
//       return res.status(400).json({
//         message: "OTP expired",
//       });
//     }

//     const hashedPassword = await bcrypt.hash(
//       password,
//       10
//     );

//     user.password = hashedPassword;

//     user.otp = null;
//     user.otpExpire = null;

//     await user.save();

//     res.json({
//       message: "Password reset successful",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };



export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await OTP.deleteMany({ email });

    await OTP.create({
      email,
      otp,
    });

    await sendOTPEmail(email, otp);

    res.json({
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.log("SEND OTP ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};



// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const otpData = await OTP.findOne({
      email,
      otp,
    });

    if (!otpData) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    await User.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
      }
    );

    await OTP.deleteMany({ email });

    res.json({
      message: "Password reset successful",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};