import mongoose from "mongoose";

const mailLogSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    type: {
      type: String,
      enum: [
        "payment-reminder",
        "class-reminder",
      ],
    },

    subject: String,

    email: String,

    status: {
      type: String,
      default: "Sent",
    },

    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "MailLog",
  mailLogSchema
);