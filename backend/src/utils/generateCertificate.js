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
        0.76,
        0.60,
        0.20
      );

    const dark =
      rgb(
        0.15,
        0.15,
        0.15
      );

    const gray =
      rgb(
        0.35,
        0.35,
        0.35
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
    // BACKGROUND
    // =========================

    const bgPath =
      path.join(
        process.cwd(),
        "uploads",
        "certificate-bg.png"
      );

    if (
      fs.existsSync(bgPath)
    ) {

      const bgBytes =
        fs.readFileSync(
          bgPath
        );

      const ext =
        path.extname(
          bgPath
        ).toLowerCase();

      let bgImage;

      if (
        ext === ".png"
      ) {

        bgImage =
          await pdfDoc.embedPng(
            bgBytes
          );

      } else {

        bgImage =
          await pdfDoc.embedJpg(
            bgBytes
          );
      }

      page.drawImage(
        bgImage,
        {
          x: 0,
          y: 0,
          width,
          height,
        }
      );

    } else {

      // fallback rich background

      page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height,
        color: rgb(
          0.97,
          0.95,
          0.90
        ),
      });

      // top line

      page.drawRectangle({
        x: 0,
        y: height - 18,
        width,
        height: 18,
        color: gold,
      });

      // bottom line

      page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height: 18,
        color: gold,
      });

      // border

      page.drawRectangle({
        x: 40,
        y: 40,
        width:
          width - 80,
        height:
          height - 80,
        borderWidth: 4,
        borderColor: gold,
      });
    }

    // =========================
    // TITLE
    // =========================

    const title =
      "CERTIFICATE";

    const title2 =
      "OF ACHIEVEMENT";

    const titleSize =
      40;

    const titleWidth =
      boldFont.widthOfTextAtSize(
        title,
        titleSize
      );

    page.drawText(
      title,
      {
        x:
          (
            width -
            titleWidth
          ) / 2,

        y:
          height - 150,

        size:
          titleSize,

        font:
          boldFont,

        color:
          dark,
      }
    );

    const title2Width =
      boldFont.widthOfTextAtSize(
        title2,
        28
      );

    page.drawText(
      title2,
      {
        x:
          (
            width -
            title2Width
          ) / 2,

        y:
          height - 200,

        size: 28,

        font:
          boldFont,

        color:
          gold,
      }
    );

    // =========================
    // STUDENT NAME
    // =========================

    const nameSize =
      52;

    const safeName =
      studentName ||
      "Student";

    const nameWidth =
      boldFont.widthOfTextAtSize(
        safeName,
        nameSize
      );

    page.drawText(
      safeName,
      {
        x:
          (
            width -
            nameWidth
          ) / 2,

        y:
          height - 340,

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

    const desc1 =
      "has successfully completed";

    const desc2 =
      `${course} (${level})`;

    const desc3 =
      `under ${category}`;

    const descSize =
      26;

    [
      desc1,
      desc2,
      desc3,
    ].forEach(
      (
        text,
        index
      ) => {

        const textWidth =
          normalFont.widthOfTextAtSize(
            text,
            descSize
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
              450 -
              (
                index *
                45
              ),

            size:
              descSize,

            font:
              normalFont,

            color:
              gray,
          }
        );
      }
    );

    // =========================
    // LONG DESCRIPTION
    // =========================

    const safeDescription =
      description ||
      "With dedication and excellence.";

    page.drawText(
      safeDescription,
      {
        x: 180,
        y:
          height - 650,

        size: 20,

        font:
          normalFont,

        color:
          black,

        maxWidth:
          width - 360,

        lineHeight:
          30,
      }
    );

    // =========================
    // DURATION
    // =========================

    page.drawText(
      `Duration: ${duration}`,
      {
        x: 170,
        y: 160,

        size: 22,

        font:
          boldFont,

        color:
          dark,
      }
    );

    // =========================
    // DATE
    // =========================

    page.drawText(
      `Completion Date: ${completionDate}`,
      {
        x: 900,
        y: 160,

        size: 22,

        font:
          boldFont,

        color:
          dark,
      }
    );

    // =========================
    // SIGNATURE LINE
    // =========================

    page.drawLine({
      start: {
        x: 1050,
        y: 110,
      },

      end: {
        x: 1250,
        y: 110,
      },

      thickness: 2,

      color: black,
    });

    page.drawText(
      "Authorized Signature",
      {
        x: 1060,
        y: 80,

        size: 16,

        font:
          normalFont,

        color:
          gray,
      }
    );

    // =========================
    // SAVE PDF
    // =========================

    const pdfBytes =
      await pdfDoc.save();

    const cleanedName =
      safeName
        .replace(
          /\s+/g,
          "-"
        )
        .toLowerCase();

    const fileName =
      `${cleanedName}-${Date.now()}.pdf`;

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

    // =========================
    // DELETE TEMP FILE
    // =========================

    fs.unlinkSync(
      tempPath
    );

    return result.secure_url;

  } catch (err) {

    console.log(
      "PDF GENERATION ERROR:",
      err
    );

    throw err;
  }
};