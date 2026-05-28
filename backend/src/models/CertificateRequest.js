import mongoose from "mongoose";

const schema =
  new mongoose.Schema({

    studentName:
      String,

    student:
      {
        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "User",
      },

    teacher:
      {
        type:
          mongoose.Schema.Types.ObjectId,

        ref:
          "User",
      },

    course:
      String,

    level:
      String,

    category:
      String,

    duration:
      String,

    completionDate:
      String,

    previewImage:
      String,

    pdfUrl:
      String,

    status:
      {
        type:
          String,

        enum: [
          "pending",
          "approved",
        ],

        default:
          "pending",
      },
  },

  {
    timestamps:
      true,
  }
);

export default mongoose.model(
  "CertificateRequest",
  schema
);