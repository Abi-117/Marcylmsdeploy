import express from "express";

import CertificateRequest
from "../models/CertificateRequest.js";

import {
  generateCertificate,
} from "../utils/generateCertificate.js";

const router =
  express.Router();

// =========================
// CREATE REQUEST
// =========================

router.post(
  "/create",
  async (req, res) => {

    try {

      console.log(req.body);

      return res.status(200).json({
        success: true,
        message:
          "Certificate Request Created",
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
// GET PENDING
// =========================

router.get(
  "/pending",

  async (
    req,
    res
  ) => {

    try {

      const certs =
        await CertificateRequest.find({
          status:
            "pending",
        });

      res.json(
        certs
      );

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }
  }
);

// =========================
// APPROVE
// =========================

router.put(
  "/approve/:id",

  async (
    req,
    res
  ) => {

    try {

      const cert =
        await CertificateRequest.findById(
          req.params.id
        );

      const pdfUrl =
        await generateCertificate({

          studentName:
            cert.studentName,

          course:
            cert.course,

          level:
            cert.level,

          completionDate:
            cert.completionDate,
        });

      cert.status =
        "approved";

      cert.pdfUrl =
        pdfUrl;

      await cert.save();

      res.json({
        success:
          true,
      });

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }
  }
);

// =========================
// STUDENT CERTIFICATES
// =========================

router.get(
  "/student/:id",

  async (
    req,
    res
  ) => {

    try {

      const certs =
        await CertificateRequest.find({

          student:
            req.params.id,

          status:
            "approved",
        });

      res.json(
        certs
      );

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }
  }
);

export default router;