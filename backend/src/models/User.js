import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    level: {
      type: String,
    },

    amount: {
      type: Number,
    },

    paymentId: {
      type: String,
    },

    orderId: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const userSchema = new mongoose.Schema(
  {
    // =========================
    // COMMON
    // =========================

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },

    phone: {
      type: String,
      default: "",
    },

    // =========================
    // STUDENT
    // =========================

    course: {
      type: String,
      default: "",
    },

    selectedLevel: {
  type: String,
  default: null,
},

    unlockedLevels: {
      type: [String],
      default: [],
    },

    completedLevels: {
      type: [String],
      default: [],
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    payments: {
      type: [paymentSchema],
      default: [],
    },

    mode: {
      type: String,
      default: "Online",
    },

    fromTime: {
      type: String,
      default: "",
    },

    toTime: {
      type: String,
      default: "",
    },

    availableDays: {
      type: [String],
      default: [],
    },

    exp: {
      type: String,
      default: "",
    },

    grade: {
      type: String,
      default: "",
    },

    level: {
      type: String,
      default: "",
    },

    batch: {
      type: String,
      default: "",
    },

    // =========================
    // TEACHER
    // =========================

    subject: {
      type: String,
      default: "",
    },

    experience: {
      type: String,
      default: "",
    },

    customExperience: {
      type: String,
      default: "",
    },

    qualification: {
      type: String,
      default: "",
    },
    teacherId: {
  type: String,
  default: "",
},

progress: {
  type: Number,
  default: 0,
},
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model(
  "User",
  userSchema
);

export default User;