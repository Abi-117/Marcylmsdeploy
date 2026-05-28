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

  const page =
    pdfDoc.addPage([
      1200,
      850,
    ]);

  const {
    width,
    height,
  } = page.getSize();

  // ==========================
  // COLORS
  // ==========================

  const black =
    rgb(0, 0, 0);

  const gold =
    rgb(
      0.68,
      0.52,
      0.18
    );

  // ==========================
  // FONTS
  // ==========================

  // BEST BUILT-IN FONT
  // similar "g" style

  const boldFont =
    await pdfDoc.embedFont(
      StandardFonts.HelveticaBold
    );

  const normalFont =
    await pdfDoc.embedFont(
      StandardFonts.Helvetica
    );

  // ==========================
  // BACKGROUND IMAGE
  // ==========================

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

  // ==========================
  // CENTER SHIFT
  // ==========================

  const CENTER_SHIFT_X =
    70;

  // ==========================
  // LETTER SPACING FUNCTION
  // ==========================

  const drawSpacedText = ({
    text,
    x,
    y,
    size = 22,
    font = normalFont,
    color = black,
    spacing = 0.5,
  }) => {

    let currentX = x;

    text
      .split("")
      .forEach((char) => {

        page.drawText(
          char,
          {
            x: currentX,
            y,
            size,
            font,
            color,
          }
        );

        currentX +=
          font.widthOfTextAtSize(
            char,
            size
          ) + spacing;

      });
  };

  // ==========================
  // CATEGORY
  // ==========================

  const category =
    "Performance Arts";

  const categorySize =
    40;

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
        ) / 2
        +
        CENTER_SHIFT_X,

      y:
        height - 285,

      size:
        categorySize,

      font:
        boldFont,

      color:
        black,
    }
  );

  // ==========================
  // COURSE
  // ==========================

  const courseText =
    course.toUpperCase();

  const courseSize =
    40;

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
        ) / 2
        +
        CENTER_SHIFT_X,

      y:
        height - 345,

      size:
        courseSize,

      font:
        boldFont,

      color:
        black,
    }
  );

  // ==========================
  // STUDENT NAME
  // ==========================

  const nameSize =
    40;

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
        ) / 2
        +
        CENTER_SHIFT_X,

      y:
        height - 435,

      size:
        nameSize,

      font:
        boldFont,

      color:
        gold,
    }
  );

  // ==========================
  // DESCRIPTION
  // ==========================

  const lines = [

    `In recognition of successful completion of ${level} in`,

    `${course} in ${category}.`,

    "",

    "With dedication, enthusiasm, and excellence in",

    "communication, confidence-building, stage presence,",

    "voice modulation, expression, and presentation skills.",
  ];

  lines.forEach(
    (
      text,
      i
    ) => {

      const totalWidth =
        text
          .split("")
          .reduce(
            (
              acc,
              char
            ) => {

              return (
                acc +
                normalFont.widthOfTextAtSize(
                  char,
                  22
                ) -
                0.5
              );

            },
            0
          );

      const x =
        (
          width -
          totalWidth
        ) / 2
        +
        30;

      const y =
        height -
        485 -
        (
          i * 28
        );

      drawSpacedText({
        text,
        x,
        y,
        size: 22,
        font: normalFont,
        color: black,
        spacing: 0.5,
      });

    }
  );

  // ==========================
  // COURSE DURATION
  // ==========================

  const duration =
    "Course Duration: 1 Year";

  const durationWidth =
    normalFont.widthOfTextAtSize(
      duration,
      22
    );

  page.drawText(
    duration,
    {
      x:
        (
          width -
          durationWidth
        ) / 2
        +
        55,

      y:
        height - 660,

      size:
        22,

      font:
        normalFont,

      color:
        black,
    }
  );

  // ==========================
  // DATE
  // ==========================

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
        (
          width -
          dateWidth
        ) / 2
        +
        45,

      y:
        height - 680,

      size:
        22,

      font:
        normalFont,

      color:
        black,
    }
  );

  // ==========================
  // SAVE PDF
  // ==========================

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
    }
  );

fs.unlinkSync(tempPath);

return result.secure_url;
};