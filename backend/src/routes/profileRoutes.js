import express from "express";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();


// GET LOGGED USER PROFILE
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Profile fetch failed" });
  }
});


// UPDATE PROFILE (STUDENT ONLY EDIT)
router.put("/update", protect, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        parentName: req.body.parentName,
        profileImage: req.body.profileImage,
      },
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

export default router;