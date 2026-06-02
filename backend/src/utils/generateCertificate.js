import fs from "fs";
import path from "path";

import {
  PDFDocument,
} from "pdf-lib";

import cloudinary
from "../config/cloudinary.js";

export const generateCertificate =
async ({
  previewImage,
  studentName,
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

    // =====================
    // CONVERT BASE64
    // =====================

    const base64Data =
      previewImage.replace(
        /^data:image\/jpeg;base64,/,
        ""
      );

    const imageBytes =
      Buffer.from(
        base64Data,
        "base64"
      );

    const image =
      await pdfDoc.embedJpg(
        imageBytes
      );

    // =====================
    // DRAW IMAGE FULL PAGE
    // =====================

    page.drawImage(
      image,
      {
        x: 0,
        y: 0,
        width,
        height,
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

    // =====================
    // CLOUDINARY UPLOAD
    // =====================

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