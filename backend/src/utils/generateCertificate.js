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
      0.73,
      0.58,
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
      "uploads/certificate-bg.png"
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
  // CATEGORY
  // =========================

  const categorySize =
    38;

  const categoryWidth =
    boldFont.widthOfTextAtSize(
      category,
      categorySize
    );

  page.drawText(
    category,
    {
      x:
        (
          width -
          categoryWidth
        ) / 2,

      y:
        height - 430,

      size:
        categorySize,

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

  const courseSize =
    38;

  const courseWidth =
    boldFont.widthOfTextAtSize(
      courseText,
      courseSize
    );

  page.drawText(
    courseText,
    {
      x:
        (
          width -
          courseWidth
        ) / 2,

      y:
        height - 500,

      size:
        courseSize,

      font:
        boldFont,

      color:
        black,
    }
  );

  // =========================
  // STUDENT NAME
  // =========================

  const nameSize =
    42;

  const nameWidth =
    boldFont.widthOfTextAtSize(
      studentName,
      nameSize
    );

  page.drawText(
    studentName,
    {
      x:
        (
          width -
          nameWidth
        ) / 2,

      y:
        height - 610,

      size:
        nameSize,

      font:
        boldFont,

      color:
        gold,
    }
  );

  // =========================
  // DESCRIPTION
  // =========================

  const lines = [

    `In recognition of successful completion of ${level} in`,

    `${course} under ${category}.`,

    "",

    description,
  ];

  lines.forEach(
    (
      text,
      i
    ) => {

      const size =
        22;

      const textWidth =
        normalFont.widthOfTextAtSize(
          text,
          size
        );

      page.drawText(
        text,
        {
          x:
            (
              width -
              textWidth
            ) / 2,

          y:
            height -
            690 -
            (
              i * 35
            ),

          size,

          font:
            normalFont,

          color:
            black,
        }
      );
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
      x: 470,
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
      x: 470,
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
      }
    );

  fs.unlinkSync(
    tempPath
  );

  return result.secure_url;
};