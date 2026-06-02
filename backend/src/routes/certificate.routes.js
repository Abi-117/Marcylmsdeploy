import express from "express";

import CertificateRequest
from "../models/CertificateRequest.js";

import {
  generateCertificate,
} from "../utils/generateCertificate.js";
import User from "../models/User.js";

const router =
  express.Router();

// =========================
// CREATE REQUEST
// =========================

router.post(
  "/create",

  async (
    req,
    res
  ) => {

    try {

      const newRequest =
        await CertificateRequest.create({

          student:
            req.body.student,

          studentName:
            req.body.studentName,

          teacher:
            req.body.teacher,

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

      return res.status(201).json({

        success: true,

        message:
          "Certificate Request Created",

        certificate:
          newRequest,
      });

    } catch (err) {

      console.log(
        "CREATE ERROR:",
        err
      );

      res.status(500).json({

        success: false,

        message:
          err.message,
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
        })
        .sort({
          createdAt:
            -1,
        });

      res.json(
        certs
      );

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message:
          err.message,
      });
    }
  }
);

// =========================
// GET APPROVED
// =========================

router.get(
  "/approved",

  async (
    req,
    res
  ) => {

    try {

      const certs =
        await CertificateRequest.find({

          status:
            "approved",
        })
        .sort({
          updatedAt:
            -1,
        });

      res.json(
        certs
      );

    } catch (err) {

      console.log(err);

      res.status(500).json({

        success: false,

        message:
          err.message,
      });
    }
  }
);

// =========================
// APPROVE CERTIFICATE
// =========================
router.put("/approve/:id", async (req, res) => {
  try {
    const cert = await CertificateRequest.findById(req.params.id);

    if (!cert) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    const student = await User.findById(cert.student);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const pdfUrl = await generateCertificate({
      studentName: cert.studentName,
      previewImage: cert.previewImage,
    });

    cert.status = "approved";
    cert.pdfUrl = pdfUrl;

    await cert.save();

    res.json({
      success: true,
      certificate: cert,
    });

  } catch (err) {
    console.log("APPROVE ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// =========================
// GET STUDENT CERTIFICATES
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
        })
        .sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        certs,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false,
        message:
          err.message,
      });

    }
  }
);

router.get(
  "/teacher/:teacherId",
  async (req, res) => {

    try {

      const certs =
        await CertificateRequest.find({
          teacher:
            req.params.teacherId,
        })
        .sort({
          createdAt: -1,
        });

      res.json(certs);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

  }
);
export default router;