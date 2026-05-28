import express from "express";

import CertificateRequest
from "../models/CertificateRequest.js";
import certificate from "../models/certificate.model.js";

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

      console.log(
        "BODY:",
        req.body
      );

      const newRequest =
        await CertificateRequest.create({

          student:
            req.body.student,

          studentName:
            req.body.studentName,

          course:
            req.body.course,

          category:
            req.body.category,

          level:
            req.body.level,

          description:
            req.body.description,

          duration:
            req.body.duration,

          completionDate:
            req.body.completionDate,

          previewImage:
            req.body.previewImage,

          status:
            "pending",
        });

      console.log(
        "SAVED:",
        newRequest
      );

      return res.status(201).json({

        success: true,

        message:
          "Certificate Request Created",

        data:
          newRequest,
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

      if (!cert) {

        return res.status(404).json({
          message:
            "Certificate not found",
        });
      }

      // GENERATE PDF

      const pdfUrl =
        await generateCertificate({

          studentName:
            cert.studentName,

          course:
            cert.course,

          category:
            cert.category,

          level:
            cert.level,

          description:
            cert.description,

          duration:
            cert.duration,

          completionDate:
            cert.completionDate,
        });

      // UPDATE

      cert.status =
        "approved";

      cert.pdfUrl =
        pdfUrl;

      await cert.save();

      // SEND UPDATED DATA

      res.json({
        success: true,
        pdfUrl,
        cert,
      });

    } catch (err) {

      console.log(
        "APPROVE ERROR:",
        err
      );

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