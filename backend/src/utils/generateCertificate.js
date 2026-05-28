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

    const categoryText =
      category ||
      "Performance Arts";

    const categorySize =
      40;

    const categoryWidth =
      boldFont.widthOfTextAtSize(
        categoryText,
        categorySize
      );

    page.drawText(
      categoryText,
      {
        x:
          (width -
            categoryWidth) / 2,

        y: 690,

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
      (course || "")
      .toUpperCase();

    const courseSize =
      36;

    const courseWidth =
      boldFont.widthOfTextAtSize(
        courseText,
        courseSize
      );

    page.drawText(
      courseText,
      {
        x:
          (width -
            courseWidth) / 2,

        y: 620,

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

    const studentText =
      studentName ||
      "Student Name";

    const nameSize =
      42;

    const nameWidth =
      boldFont.widthOfTextAtSize(
        studentText,
        nameSize
      );

    page.drawText(
      studentText,
      {
        x:
          (width -
            nameWidth) / 2,

        y: 520,

        size:
          nameSize,

        font:
          boldFont,

        color:
          gold,
      }
    );

    // =========================
    // FIRST DESCRIPTION
    // =========================

    const desc1 =
      `In recognition of successful completion of ${level} in ${course} under ${category}.`;

    const desc1Size =
      22;

    const desc1Width =
      normalFont.widthOfTextAtSize(
        desc1,
        desc1Size
      );

    page.drawText(
      desc1,
      {
        x:
          (width -
            desc1Width) / 2,

        y: 430,

        size:
          desc1Size,

        font:
          normalFont,

        color:
          black,
      }
    );

    // =========================
// SECOND DESCRIPTION
// =========================

const desc2 =
  description &&
  description.trim() !== ""
    ? description
    : "With dedication and excellence.";

console.log("DESCRIPTION:", desc2);

const maxWidth = 850;
const fontSize = 22;
const lineHeight = 30;

const words =
  desc2.split(" ");

let lines = [];
let currentLine = "";

for (
  let i = 0;
  i < words.length;
  i++
) {

  const word =
    words[i];

  const testLine =
    currentLine +
    word +
    " ";

  const textWidth =
    normalFont.widthOfTextAtSize(
      testLine,
      fontSize
    );

  if (
    textWidth >
    maxWidth
  ) {

    lines.push(
      currentLine.trim()
    );

    currentLine =
      word + " ";

  } else {

    currentLine =
      testLine;
  }
}

if (
  currentLine.trim() !== ""
) {

  lines.push(
    currentLine.trim()
  );
}

// =========================
// DRAW DESCRIPTION
// =========================

let startY = 360;

lines.forEach(
  (
    line,
    index
  ) => {

    const lineWidth =
      normalFont.widthOfTextAtSize(
        line,
        fontSize
      );

    page.drawText(
      line,
      {
        x:
          (width -
            lineWidth) / 2,

        y:
          startY -
          index * 30,

        size:
          fontSize,

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

    const durationWidth =
      normalFont.widthOfTextAtSize(
        durationText,
        22
      );

    page.drawText(
      durationText,
      {
        x:
          (width -
            durationWidth) / 2,

        y: 200,

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

    const dateWidth =
      normalFont.widthOfTextAtSize(
        dateText,
        22
      );

    page.drawText(
      dateText,
      {
        x:
          (width -
            dateWidth) / 2,

        y: 160,

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
    // UPLOAD CLOUDINARY
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

    // DELETE TEMP

    fs.unlinkSync(
      tempPath
    );

    // =========================
    // PDF URL
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