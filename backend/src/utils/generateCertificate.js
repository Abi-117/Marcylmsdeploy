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

    const black =
      rgb(0, 0, 0);

    const gold =
      rgb(
        0.72,
        0.56,
        0.18
      );

    const boldFont =
      await pdfDoc.embedFont(
        StandardFonts.HelveticaBold
      );

    const normalFont =
      await pdfDoc.embedFont(
        StandardFonts.Helvetica
      );

    // =====================
    // BG IMAGE
    // =====================

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

    // =====================
    // CATEGORY
    // =====================

    const categorySize =
      58;

    const categoryWidth =
      boldFont.widthOfTextAtSize(
        category,
        categorySize
      );

    page.drawText(
      category,
      {
        x:
          (width -
            categoryWidth) /
          2,

        y: 720,

        size:
          categorySize,

        font:
          boldFont,

        color:
          black,
      }
    );

    // =====================
    // COURSE
    // =====================

    const courseText =
      course.toUpperCase();

    const courseSize =
      42;

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
            courseWidth) /
          2,

        y: 650,

        size:
          courseSize,

        font:
          boldFont,

        color:
          black,
      }
    );

    // =====================
    // STUDENT NAME
    // =====================

    const nameSize =
      48;

    const nameWidth =
      boldFont.widthOfTextAtSize(
        studentName,
        nameSize
      );

    page.drawText(
      studentName,
      {
        x:
          (width -
            nameWidth) /
          2,

        y: 540,

        size:
          nameSize,

        font:
          boldFont,

        color:
          gold,
      }
    );

    // =====================
    // LINE 1
    // =====================

    const line1 =
      `In recognition of successful completion of ${level} in ${course} under ${category}`;

    const line1Size =
      24;

    const line1Width =
      normalFont.widthOfTextAtSize(
        line1,
        line1Size
      );

    page.drawText(
      line1,
      {
        x:
          (width -
            line1Width) /
          2,

        y: 430,

        size:
          line1Size,

        font:
          normalFont,

        color:
          black,
      }
    );

    // =====================
    // DESCRIPTION
    // =====================

    const desc =
      description ||
      "";

    const maxWidth =
      900;

    const fontSize =
      24;

    const lineHeight =
      42;

    const maxWidth = 1000;

const words = desc.split(" ");

let lines = [];
let currentLine = "";

for (const word of words) {

  const testLine =
    currentLine
      ? `${currentLine} ${word}`
      : word;

  const width =
    normalFont.widthOfTextAtSize(
      testLine,
      24
    );

  if (
    width > maxWidth
  ) {

    lines.push(
      currentLine
    );

    currentLine =
      word;

  } else {

    currentLine =
      testLine;
  }
}

if (currentLine)
  lines.push(
    currentLine
  );

let startY = 400;

lines.forEach(
  (line, index) => {

    const lineWidth =
      normalFont.widthOfTextAtSize(
        line,
        24
      );

    page.drawText(
      line,
      {
        x:
          (1400 -
            lineWidth) /
          2,

        y:
          startY -
          index * 42,

        size: 24,

        font:
          normalFont,

        color:
          black,
      }
    );
  }
);
   

      
   

 

      

    // =====================
    // DURATION
    // =====================

    const durationText =
      `Course Duration: ${duration}`;

    const durationWidth =
      normalFont.widthOfTextAtSize(
        durationText,
        24
      );

    page.drawText(
      durationText,
      {
        x:
          (width -
            durationWidth) /
          2,

        y: 250,

        size: 24,

        font:
          normalFont,

        color:
          black,
      }
    );

    // =====================
    // DATE
    // =====================

    const dateText =
      `Date of Completion: ${completionDate}`;

    const dateWidth =
      normalFont.widthOfTextAtSize(
        dateText,
        24
      );

    page.drawText(
      dateText,
      {
        x:
          (width -
            dateWidth) /
          2,

        y: 220,

        size: 24,

        font:
          normalFont,

        color:
          black,
      }
    );

    // =====================
    // SAVE PDF
    // =====================

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

    fs.unlinkSync(
      tempPath
    );

    return result.secure_url.replace(
      "/upload/",
      "/upload/fl_attachment/"
    );

  } catch (err) {

    console.log(
      "PDF GENERATE ERROR:",
      err
    );

    throw err;
  }
};