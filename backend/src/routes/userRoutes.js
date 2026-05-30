import express from "express";

import User from "../models/User.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "marcy-profile-images",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

router.put(
  "/unlock-level/:id",

  async (req, res) => {

    try {

      const {
        level,
      } = req.body;

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {

        return res
          .status(404)
          .json({
            message:
              "User not found",
          });

      }

      // unlock level

      if (
        !user.unlockedLevels.includes(
          level
        )
      ) {

        user.unlockedLevels.push(
          level
        );

      }

      user.selectedLevel =
        level;

      user.paymentStatus =
        "Paid";

      await user.save();

      res.json({
        success: true,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Server Error",
      });

    }

  }
);



// =========================
// GET PROFILE (/me)
// =========================
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "Invalid token" });
  }
});

// =========================
// UPDATE PROFILE
// =========================
router.put("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const updated = await User.findByIdAndUpdate(
      decoded.id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        parentName: req.body.parentName,
        address: req.body.address,
      },
      { new: true }
    ).select("-password");

    res.json(updated);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Update failed" });
  }
});

router.put(
  "/upload-profile-image",
  upload.single("image"),
  async (req, res) => {
    try {
      const token = req.headers.authorization;

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      const updatedUser =
        await User.findByIdAndUpdate(
          decoded.id,
          {
            profileImage: req.file.path,
          },
          { new: true }
        ).select("-password");

      res.json(updatedUser);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: err.message,
      });

    }
  }
);


export default router;