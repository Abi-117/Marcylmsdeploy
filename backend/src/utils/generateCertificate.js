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
  category,
  level,
  description,
  duration,
  completionDate,
}) => {

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
      0.70,
      0.55,
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
  // BG IMAGE
  // =========================

  const bgPath =
    path.join(
      process.cwd(),
      "uploads",
      "certificate-bg.png"
    );

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
  // CENTER HELPER
  // =========================

  const centerText = (
    text,
    size,
    font
  ) => {

    const textWidth =
      font.widthOfTextAtSize(
        text,
        size
      );

    return (
      (width - textWidth) / 2
    );
  };

  // =========================
  // CATEGORY
  // =========================

  page.drawText(
    category,
    {
      x:
        centerText(
          category,
          42,
          boldFont
        ),

      y:
        height - 330,

      size: 42,

      font:
        boldFont,

      color:
        black,
    }
  );

  // =========================
  // COURSE
  // =========================

  const courseText =
    course.toUpperCase();

  page.drawText(
    courseText,
    {
      x:
        centerText(
          courseText,
          38,
          boldFont
        ),

      y:
        height - 400,

      size: 38,

      font:
        boldFont,

      color:
        black,
    }
  );

  // =========================
  // STUDENT NAME
  // =========================

  page.drawText(
    studentName,
    {
      x:
        centerText(
          studentName,
          48,
          boldFont
        ),

      y:
        height - 500,

      size: 48,

      font:
        boldFont,

      color:
        gold,
    }
  );

  // =========================
  // DESCRIPTION
  // =========================

  const desc1 =
    `In recognition of successful completion of ${level}`;

  const desc2 =
    `in ${course} under ${category}`;

  const desc3 =
    description;

  page.drawText(
    desc1,
    {
      x:
        centerText(
          desc1,
          24,
          normalFont
        ),

      y:
        height - 590,

      size: 24,

      font:
        normalFont,

      color:
        black,
    }
  );

  page.drawText(
    desc2,
    {
      x:
        centerText(
          desc2,
          24,
          normalFont
        ),

      y:
        height - 625,

      size: 24,

      font:
        normalFont,

      color:
        black,
    }
  );

  page.drawText(
    desc3,
    {
      x:
        centerText(
          desc3,
          20,
          normalFont
        ),

      y:
        height - 680,

      size: 20,

      font:
        normalFont,

      color:
        black,
    }
  );

  // =========================
  // DURATION
  // =========================

  const durationText =
    `Course Duration: ${duration}`;

  page.drawText(
    durationText,
    {
      x:
        centerText(
          durationText,
          22,
          normalFont
        ),

      y: 180,

      size: 22,

      font:
        normalFont,

      color:
        black,
    }
  );

  // =========================
  // DATE
  // =========================

  const dateText =
    `Date of Completion: ${completionDate}`;

  page.drawText(
    dateText,
    {
      x:
        centerText(
          dateText,
          22,
          normalFont
        ),

      y: 145,

      size: 22,

      font:
        normalFont,

      color:
        black,
    }
  );

  // =========================
  // SAVE PDF
  // =========================

  const pdfBytes =
    await pdfDoc.save();

  // CREATE FOLDER

  const certDir =
    path.join(
      process.cwd(),
      "uploads",
      "certificates"
    );

  if (
    !fs.existsSync(
      certDir
    )
  ) {

    fs.mkdirSync(
      certDir,
      {
        recursive:
          true,
      }
    );
  }

  const safeName =
    studentName.replace(
      /\s+/g,
      "-"
    );

  const fileName =
    `${safeName}-${Date.now()}.pdf`;

  const outputPath =
    path.join(
      certDir,
      fileName
    );

  fs.writeFileSync(
    outputPath,
    pdfBytes
  );

  // =========================
  // RETURN URL
  // =========================

  return `http://localhost:5000/uploads/certificates/${fileName}`;
};