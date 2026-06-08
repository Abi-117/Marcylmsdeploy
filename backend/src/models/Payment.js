import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    level: {
      type: String,
      default: "",
    },

    amount: {
      type: Number,
      required: true,
    },

    paymentId: {
      type: String,
      default: "",
    },

    orderId: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    paidAt: {
      type: Date,
    },
    nextDueDate: {
  type: Date,
},

lastReminderSent: {
  type: Date,
},

reminderCount: {
  type: Number,
  default: 0,
},
paymentGateway: {
  type: String,
  enum: ["razorpay", "paypal"],
  default: "razorpay",
},

paymentCountry: {
  type: String,
  default: "India",
},

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