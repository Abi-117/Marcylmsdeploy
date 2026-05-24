import express from "express";

import User from "../models/User.js";

const router = express.Router();

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

export default router;