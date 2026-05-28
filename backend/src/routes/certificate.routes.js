import express from "express";

import Certificate from
"../models/certificate.model.js";

const router =
  express.Router();

router.post(
  "/create",
  async (
    req,
    res
  ) => {

    try {

      const {
        student,
        teacher,
        studentName,
        course,
        level,
        completionDate,
      } = req.body;

      const cert =
        await Certificate.create({
          student,
          teacher,
          studentName,
          course,
          level,
          completionDate,
        });

      res.json({
        success: true,
        cert,
      });

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }
  }
);

router.put(
  "/approve/:id",
  async (
    req,
    res
  ) => {

    try {

      const cert =
        await Certificate.findById(
          req.params.id
        );

      if (!cert) {

        return res
          .status(404)
          .json({
            message:
              "Certificate not found",
          });
      }

      // PDF GENERATE

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
        success: true,
        cert,
      });

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }
  }
);
router.get(
  "/student/:id",
  async (
    req,
    res
  ) => {

    try {

      const certs =
        await Certificate.find({
          student:
            req.params.id,

          status:
            "approved",
        });

      res.json(certs);

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }
  }
);
router.get(
  "/pending",
  async (
    req,
    res
  ) => {

    try {

      const certs =
        await Certificate.find({
          status:
            "pending",
        });

      res.json(certs);

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }
  }
);
export default router;