import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

const router = express.Router();


// ==========================================
// REGISTER
// ==========================================

router.post(
  "/register",
  async (req, res) => {

    try {

      const {
  name,
  email,
  password,
  role,
  phone,

  // STUDENT
  course,
  mode,
  exp,
  grade,
  level,
  batch,

  fromTime,
  toTime,
  availableDays,

  // TEACHER
  subject,
  experience,
  customExperience,
  qualification,

} = req.body;


      // =========================
      // EMAIL CHECK
      // =========================

      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {

        return res.status(400).json({
          message:
            "User already exists",
        });

      }


      // =========================
      // PASSWORD HASH
      // =========================

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );


      // =========================
      // CREATE USER
      // =========================

      const user =
        await User.create({

          // COMMON
          name,
          email,
          password:
            hashedPassword,

          role,
          phone,

          // STUDENT
          course,
mode,
exp,
grade,

level,
batch,

          // IMPORTANT
          selectedLevel: level,

          unlockedLevels: [],

          completedLevels: [],

          paymentStatus:
            "Pending",

          payments: [],

          fromTime,
          toTime,

          availableDays,

          // TEACHER
          subject,
          experience,
          customExperience,
          qualification,

        });


      // =========================
      // JWT TOKEN
      // =========================

      const token = jwt.sign(

        {
          id: user._id,
        },

        "secretkey",

        {
          expiresIn: "7d",
        }

      );


      // =========================
      // RESPONSE
      // =========================

      res.status(201).json({

        message:
          "Register success",

        token,

        user: {

          id: user._id,

          name: user.name,

          email: user.email,

          role: user.role,

          phone: user.phone,

          // ====================
          // STUDENT
          // ====================

          course:
            user.course,

          mode:
            user.mode,

          exp:
            user.exp,

          grade:
  user.grade,

level:
  user.level,

batch:
  user.batch,

selectedLevel:
  user.selectedLevel,
 

          unlockedLevels:
            user.unlockedLevels,

          completedLevels:
            user.completedLevels,

          paymentStatus:
            user.paymentStatus,

          payments:
            user.payments,

          fromTime:
            user.fromTime,

          toTime:
            user.toTime,

          availableDays:
            user.availableDays,

          // ====================
          // TEACHER
          // ====================

          subject:
            user.subject,

          experience:
            user.experience,

          customExperience:
            user.customExperience,

          qualification:
            user.qualification,

        },

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });

    }

  }
);


// ==========================================
// LOGIN
// ==========================================

router.post(
  "/login",
  async (req, res) => {

    try {

      const {
        email,
        password,
        role,
      } = req.body;


      // =========================
      // FIND USER
      // =========================

      const user =
        await User.findOne({
          email,
        });

      if (!user) {

        return res.status(400).json({
          message:
            "User not found",
        });

      }


      // =========================
      // ROLE CHECK
      // =========================

      if (
        user.role !== role
      ) {

        return res.status(400).json({
          message:
            "Invalid role",
        });

      }


      // =========================
      // PASSWORD CHECK
      // =========================

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {

        return res.status(400).json({
          message:
            "Invalid password",
        });

      }


      // =========================
      // TOKEN
      // =========================

      const token = jwt.sign(

        {
          id: user._id,
        },

        "secretkey",

        {
          expiresIn: "7d",
        }

      );


      // =========================
      // RESPONSE
      // =========================

      res.status(200).json({

        message:
          "Login success",

        token,

        user: {

          id: user._id,

          name: user.name,

          email: user.email,

          role: user.role,

          phone: user.phone,

          // ====================
          // STUDENT
          // ====================

          course:
            user.course,

          mode:
            user.mode,

          exp:
            user.exp,

          grade:
            user.grade,

          selectedLevel:
            user.selectedLevel,

          unlockedLevels:
            user.unlockedLevels,

          completedLevels:
            user.completedLevels,

          paymentStatus:
            user.paymentStatus,

          payments:
            user.payments,

          fromTime:
            user.fromTime,

          toTime:
            user.toTime,

          availableDays:
            user.availableDays,

          // ====================
          // TEACHER
          // ====================

          subject:
            user.subject,

          experience:
            user.experience,

          customExperience:
            user.customExperience,

          qualification:
            user.qualification,

        },

      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          "Server Error",
      });

    }

  }
);

export default router;