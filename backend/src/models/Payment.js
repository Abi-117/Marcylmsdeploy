import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },

    amount: Number,

    status: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    paidAt: Date,
    invoiceUrl: String,
  },
  
  {
    timestamps: true,
  }
);

const Payment = mongoose.model(
  "Payment",
  paymentSchema
);

export default Payment;