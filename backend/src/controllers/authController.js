import Course from "../models/Course.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import GroupClass from "../models/GroupClass.js";

import OTP from "../models/otpModel.js";
import { sendOTPEmail } from "../utils/mailer.js";

// =========================
// REGISTER
// =========================

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
      classType,
      subject,
      experience,
      customExperience,
    } = req.body;

    // =========================
    // EMAIL EXISTS
    // =========================

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // =========================
    // GROUP
    // =========================

    let assignedGroup = null;

    // =========================
    // STUDENT REGISTRATION
    // =========================

    if (role === "student") {
      // =========================
      // FIND COURSE
      // =========================

      const selectedCourse =
        await Course.findById(course);

      if (!selectedCourse) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      // =====================================================
      // INDIVIDUAL CLASS
      // =====================================================

      if (
        selectedCourse.classMode ===
        "Individual"
      ) {
        const totalStudents =
          await User.countDocuments({
            role: "student",

            course: selectedCourse._id,

            level: level,

            batch: batch,

            mode: mode,

            fromTime: fromTime,

            toTime: toTime,

            availableDays: {
              $in: availableDays,
            },
          });

        // Only one student allowed
        if (totalStudents >= 1) {
          return res.status(400).json({
            message:
              "This time slot is already booked. Please choose another day or time.",
          });
        }
      }

      // =====================================================
      // GROUP CLASS
      // =====================================================

      else {
        // ==========================================
        // FIND EXISTING GROUP FOR EXACT SLOT
        // ==========================================

        assignedGroup =
          await GroupClass.findOne({
            course: selectedCourse._id,

            level: level,

            grade: batch,

            mode: mode,

            fromTime: fromTime,

            toTime: toTime,

            availableDays: {
              $all: availableDays,
            },
          });

        // ==========================================
        // EXISTING GROUP FOUND
        // ==========================================

        if (assignedGroup) {
          // ========================================
          // CHECK GROUP CAPACITY
          // ========================================

          if (
            assignedGroup.students.length >=
            assignedGroup.maxStudents
          ) {
            return res.status(400).json({
              message:
                "This group is full for the selected day and time. Please choose another available day or time.",
            });
          }
        }

        // ==========================================
        // NO GROUP FOR THIS SLOT
        // ==========================================

        else {
          // ========================================
          // FIND LAST GROUP FOR SAME
          // COURSE + LEVEL + GRADE
          // ========================================

          const lastGroup =
            await GroupClass.findOne({
              course:
                selectedCourse._id,

              level: level,

              grade: batch,
            }).sort({
              createdAt: -1,
            });

          // ========================================
          // GROUP NUMBER
          // ========================================

          let groupNumber = 1;

          if (lastGroup) {
            const match =
              lastGroup.groupName.match(
                /Group\s+(\d+)$/i
              );

            if (match) {
              groupNumber =
                Number(match[1]) + 1;
            }
          }

          // ========================================
          // CREATE GROUP NAME
          // ========================================

          const groupName =
            `${selectedCourse.name} - ${level} - ${batch} - Group ${groupNumber}`;

          // ========================================
          // CREATE GROUP
          // ========================================

          assignedGroup =
            await GroupClass.create({
              groupName,

              course:
                selectedCourse._id,

              level: level,

              grade: batch,

              mode: mode,

              fromTime: fromTime,

              toTime: toTime,

              availableDays:
                availableDays,

              students: [],

              maxStudents:
                selectedCourse.maxStudents ||
                3,

              status: "Available",
            });
        }
      }
    }

    // =========================
    // HASH PASSWORD
    // =========================

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    // =========================
    // CREATE USER
    // =========================

    const user = await User.create({
      name,

      email,

      password:
        hashedPassword,

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

      classType,

      subject,

      experience,

      customExperience,

      // =========================
      // GROUP DETAILS
      // =========================

      groupId:
        assignedGroup
          ? assignedGroup._id
          : null,

      groupName:
        assignedGroup
          ? assignedGroup.groupName
          : "",
    });

    // =========================
    // ADD USER TO GROUP
    // =========================

    if (assignedGroup) {
      assignedGroup.students.push(
        user._id
      );

      // =========================
      // CHECK FULL
      // =========================

      if (
        assignedGroup.students.length >=
        assignedGroup.maxStudents
      ) {
        assignedGroup.status =
          "Full";
      } else {
        assignedGroup.status =
          "Available";
      }

      await assignedGroup.save();
    }

    // =========================
    // RESPONSE
    // =========================

    return res.status(201).json({
      message:
        "Register Success",

      user,

      group: assignedGroup
        ? {
            id:
              assignedGroup._id,

            name:
              assignedGroup.groupName,

            status:
              assignedGroup.status,

            students:
              assignedGroup.students.length,

            maxStudents:
              assignedGroup.maxStudents,
          }
        : null,
    });
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};
// =========================
// LOGIN
// =========================

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

// =========================
// FORGOT PASSWORD
// =========================

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

// =========================
// SEND OTP
// =========================

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

// =========================
// RESET PASSWORD
// =========================

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

    const hashedPassword = await bcrypt.hash(password, 10);

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