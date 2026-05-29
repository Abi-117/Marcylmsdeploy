import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

console.log("🔥 Notification Routes Loaded");

// =====================
// GET ALL NOTIFICATIONS
// =====================
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({
      createdAt: -1,
    });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch notifications",
    });
  }
});

// =====================
// GET USER NOTIFICATIONS
// =====================
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { userId: req.params.userId },
        { userId: null }, // global notifications
      ],
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
    });
  }
});

// =====================
// CREATE NOTIFICATION (ADMIN)
// =====================
router.post("/", async (req, res) => {
  try {
    const { title, message, userId } = req.body;

    const notification = await Notification.create({
      title,
      message,
      userId: userId || null,
    });

    res.json(notification);
  } catch (err) {
    res.status(500).json({
      message: "Failed to create notification",
    });
  }
});

// =====================
// MARK AS READ
// =====================
router.put("/:id/read", async (req, res) => {
  try {
    const updated = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({
      message: "Failed to update",
    });
  }
});

export default router;