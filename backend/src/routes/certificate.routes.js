// =====================================
// routes/certificate.routes.js
// =====================================

import express from "express";

import Certificate from "../models/certificate.model.js";

import {
  generateCertificate,
} from "../utils/generateCertificate.js";

const router = express.Router();

// =====================================
// GENERATE CERTIFICATE
// =====================================

router.post(
  "/generate",
  async (req, res) => {
    try {
      const {
        studentId,
        studentName,
        course,
        level,
      } = req.body;

      // ========================
      // GENERATE PDF
      // ========================

      const fileUrl =
        await generateCertificate({
          studentName,
          course,
          level,
          completionDate:
            new Date().toDateString(),
        });

      // ========================
      // SAVE DB
      // ========================

      const cert =
        await Certificate.create({
          studentId,
          studentName,
          course,
          level,
          earned: true,
          date:
            new Date().toDateString(),
          fileUrl,
        });

      res.status(200).json(cert);
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message:
          "Certificate generation failed",
      });
    }
  }
);

// =====================================
// GET CERTIFICATES
// =====================================

router.get(
  "/:studentId",
  async (req, res) => {
    try {
      const data =
        await Certificate.find({
          studentId:
            req.params.studentId,
        }).sort({
          createdAt: -1,
        });

      res.json(data);
    } catch (err) {
      res.status(500).json({
        message:
          "Failed to fetch certificates",
      });
    }
  }
);

export default router;