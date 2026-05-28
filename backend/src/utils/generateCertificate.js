// =====================================
// utils/generateCertificate.js
// =====================================

import fs from "fs";
import path from "path";

import {
  PDFDocument,
  rgb,
  StandardFonts,
} from "pdf-lib";

import cloudinary
from "../config/cloudinary.js";

export const generateCertificate =
async ({
  studentName,
  course,
  category,
  level,
  description,
  duration,
  completionDate,
}) => {

  try {

    // =========================
    // CREATE PDF
    // =========================

    const pdfDoc =
      await PDFDocument.create();

    const page =
      pdfDoc.addPage([
        1400,
        1000,
      ]);

    const {
      width,
      height,
    } = page.getSize();

    // =========================
    // COLORS
    // =========================

    const black =
      rgb(0, 0, 0);

    const gold =
      rgb(
        0.72,
        0.56,
        0.18
      );

    // =========================
    // FONTS
    // =========================

    const boldFont =
      await pdfDoc.embedFont(
        StandardFonts.HelveticaBold
      );

    const normalFont =
      await pdfDoc.embedFont(
        StandardFonts.Helvetica
      );

    // =========================
    // BACKGROUND IMAGE
    // =========================

    const bgPath =
      path.join(
        process.cwd(),
        "uploads",
        "certificate-bg.png"
      );

    if (
      !fs.existsSync(bgPath)
    ) {

      throw new Error(
        "certificate-bg.png not found"
      );
    }

    const bgBytes =
      fs.readFileSync(
        bgPath
      );

    const bgImage =
      await pdfDoc.embedPng(
        bgBytes
      );

    page.drawImage(
      bgImage,
      {
        x: 0,
        y: 0,
        width,
        height,
      }
    );

    // =========================
    // CATEGORY
    // =========================

    page.drawText(
      category || "Performance Arts",
      {
        x: 520,
        y: 690,
        size: 40,
        font: boldFont,
        color: black,
      }
    );

    // =========================
    // COURSE
    // =========================

    page.drawText(
      course.toUpperCase(),
      {
        x: 560,
        y: 620,
        size: 36,
        font: boldFont,
        color: black,
      }
    );

    // =========================
    // STUDENT NAME
    // =========================

    page.drawText(
      studentName,
      {
        x: 520,
        y: 520,
        size: 42,
        font: boldFont,
        color: gold,
      }
    );

    // =========================
    // DESCRIPTION
    // =========================

    const desc1 =
      `Successfully completed ${level}`;

    const desc2 =
      `${course} under ${category}`;

    page.drawText(
      desc1,
      {
        x: 420,
        y: 430,
        size: 24,
        font: normalFont,
        color: black,
      }
    );

    page.drawText(
      desc2,
      {
        x: 470,
        y: 390,
        size: 24,
        font: normalFont,
        color: black,
      }
    );

    // =========================
    // DURATION
    // =========================

    page.drawText(
      `Course Duration: ${duration}`,
      {
        x: 500,
        y: 200,
        size: 22,
        font: normalFont,
        color: black,
      }
    );

    // =========================
    // DATE
    // =========================

    page.drawText(
      `Date of Completion: ${completionDate}`,
      {
        x: 460,
        y: 160,
        size: 22,
        font: normalFont,
        color: black,
      }
    );

    // =========================
    // SAVE PDF TEMP
    // =========================

    const pdfBytes =
      await pdfDoc.save();

    const fileName =
      `${studentName}-${Date.now()}.pdf`;

    const tempPath =
      path.join(
        process.cwd(),
        fileName
      );

    fs.writeFileSync(
      tempPath,
      pdfBytes
    );

    // =========================
    // CLOUDINARY UPLOAD
    // IMPORTANT
    // =========================

    const result =
      await cloudinary.uploader.upload(
        tempPath,
        {
          resource_type:
            "raw",

          folder:
            "certificates",

          public_id:
            fileName.replace(
              ".pdf",
              ""
            ),

          format:
            "pdf",
        }
      );

    // DELETE TEMP FILE

    fs.unlinkSync(
      tempPath
    );

    // =========================
    // RETURN WORKING URL
    // =========================

    const pdfUrl =
      result.secure_url.replace(
        "/upload/",
        "/upload/fl_attachment/"
      );

    return pdfUrl;

  } catch (err) {

    console.log(
      "PDF GENERATE ERROR:",
      err
    );

    throw err;
  }
};