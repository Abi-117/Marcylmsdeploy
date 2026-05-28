import express from "express";

import User
from "../models/User.js";

import {
  sendWhatsApp,
} from "../utils/sendWhatsApp.js";

const router =
  express.Router();

router.post(
  "/fees/:id",

  async (
    req,
    res
  ) => {

    try {

      const student =
        await User.findById(
          req.params.id
        );

      if (!student) {

        return res.status(404).json({
          message:
            "Student not found",
        });
      }

      await sendWhatsApp(

        student.phone,

        `Hello ${student.name},

Your fees payment is pending.

Please complete payment.

Marcy's Academy`
      );

      res.json({
        success: true,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false,
      });
    }
  }
);

export default router;