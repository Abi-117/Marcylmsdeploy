import fs from "fs";
import path from "path";

import {
  PDFDocument,
} from "pdf-lib";

import cloudinary from "../config/cloudinary.js";

export const generateCertificate = async ({
  previewImage,
  studentName,
}) => {

  try {

    if (!previewImage) {
      throw new Error(
        "Preview image missing"
      );
    }

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

    // Remove data URL header
    const base64Data =
      previewImage.replace(
        /^data:image\/(png|jpeg|jpg);base64,/,
        ""
      );

    const imageBytes =
      Buffer.from(
        base64Data,
        "base64"
      );

    let image;

    if (
      previewImage.includes(
        "data:image/png"
      )
    ) {

      image =
        await pdfDoc.embedPng(
          imageBytes
        );

    } else {

      image =
        await pdfDoc.embedJpg(
          imageBytes
        );
    }

    page.drawImage(
      image,
      {
        x: 0,
        y: 0,
        width,
        height,
      }
    );

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

    console.log(
      "Uploading PDF..."
    );

    const result =
      await cloudinary.uploader.upload(
        tempPath,
        {
          resource_type: "raw",
          folder: "certificates",
          public_id:
            fileName.replace(
              ".pdf",
              ""
            ),
          format: "pdf",
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

    console.error(
      "PDF GENERATE ERROR:"
    );

    console.error(err);

    throw err;
  }
};