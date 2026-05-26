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

export const generateCertificate =
  async ({
    studentName,
    course,
    level,
    completionDate,
  }) => {
    // ==========================
    // CREATE PDF
    // ==========================

    const pdfDoc =
      await PDFDocument.create();

    const page = pdfDoc.addPage([
      1200,
      850,
    ]);

    const { width, height } =
      page.getSize();

    // ==========================
    // COLORS
    // ==========================

    const gold = rgb(
      0.75,
      0.58,
      0.15
    );

    const black = rgb(0, 0, 0);

    // ==========================
    // FONTS
    // ==========================

    const boldFont =
      await pdfDoc.embedFont(
        StandardFonts.HelveticaBold
      );

    const normalFont =
      await pdfDoc.embedFont(
        StandardFonts.Helvetica
      );

    // ==========================
    // BORDER
    // ==========================

    page.drawRectangle({
      x: 20,
      y: 20,
      width: width - 40,
      height: height - 40,
      borderWidth: 8,
      borderColor: gold,
    });

    // ==========================
    // LOGO
    // ==========================

    const logoPath = path.join(
      process.cwd(),
      "uploads/logo.png"
    );

    const logoBytes =
      fs.readFileSync(logoPath);

    const logoImage =
      await pdfDoc.embedPng(
        logoBytes
      );

    page.drawImage(logoImage, {
      x: width / 2 - 70,
      y: height - 170,
      width: 140,
      height: 140,
    });

    // ==========================
    // TITLE
    // ==========================

    page.drawText(
      "CERTIFICATE OF COMPLETION",
      {
        x: 220,
        y: height - 220,
        size: 34,
        font: boldFont,
        color: black,
      }
    );

    // ==========================
    // TAGLINE
    // ==========================

    page.drawText(
      "Empowering Confidence | Creativity | Communication",
      {
        x: 240,
        y: height - 260,
        size: 18,
        font: normalFont,
      }
    );

    // ==========================
    // STUDENT NAME
    // ==========================

    page.drawText(studentName, {
      x: 350,
      y: height - 360,
      size: 40,
      font: boldFont,
      color: gold,
    });

    // ==========================
    // COURSE
    // ==========================

    page.drawText(course, {
      x: 430,
      y: height - 430,
      size: 28,
      font: boldFont,
    });

    // ==========================
    // LEVEL
    // ==========================

    page.drawText(level, {
      x: 500,
      y: height - 470,
      size: 24,
      font: boldFont,
      color: gold,
    });

    // ==========================
    // DESCRIPTION
    // ==========================

    page.drawText(
      `Successfully completed ${level} in ${course}`,
      {
        x: 260,
        y: height - 550,
        size: 22,
        font: normalFont,
      }
    );

    // ==========================
    // DATE
    // ==========================

    page.drawText(
      `Date : ${completionDate}`,
      {
        x: 430,
        y: height - 620,
        size: 20,
        font: normalFont,
      }
    );

    // ==========================
    // SIGNATURE
    // ==========================

    page.drawText(
      "Msrceline Samuel | Founder & Director",
      {
        x: 320,
        y: 100,
        size: 22,
        font: boldFont,
      }
    );

    page.drawText(
      "Marcys Academy of Music & Speech",
      {
        x: 350,
        y: 70,
        size: 18,
        font: boldFont,
      }
    );

    // ==========================
    // SAVE PDF
    // ==========================

    const pdfBytes =
      await pdfDoc.save();

    const fileName = `${studentName}-${Date.now()}.pdf`;

    const outputPath = path.join(
      process.cwd(),
      "uploads/certificates",
      fileName
    );

    fs.writeFileSync(
      outputPath,
      pdfBytes
    );

    return `/uploads/certificates/${fileName}`;
  };