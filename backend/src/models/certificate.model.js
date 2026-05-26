// =====================================
// models/certificate.model.js
// =====================================

import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: {
      type: String,
      default: "Certificate of Completion",
    },

    course: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      required: true,
    },

    studentName: {
      type: String,
      required: true,
    },

    date: {
      type: String,
    },

    earned: {
      type: Boolean,
      default: true,
    },

    fileUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Certificate = mongoose.model(
  "Certificate",
  certificateSchema
);

export default Certificate;