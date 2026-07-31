import mongoose from "mongoose";

// const paymentSchema = new mongoose.Schema(
//   {
//     level: {
//       type: String,
//     },
//     courseId: {
//       type: String, // 🔥 ADD THIS (IMPORTANT)
//       required: true,
//     },


//     amount: {
//       type: Number,
//     },

//     paymentId: {
//       type: String,
//     },

//     orderId: {
//       type: String,
//     },

//     status: {
//       type: String,
//       enum: ["Pending", "Paid"],
//       default: "Pending",
//     },

//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   {
//     _id: false,
//   }
// );

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
    levelHistory: [
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    grade: String,
    paidAt: {
      type: Date,
      default: Date.now,
    },
  },
],

    // =========================
    // STUDENT
    // =========================

    course: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Course",
  default: null,
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

    classTime: {
  type: String,
  default: "",
},

reminderEnabled: {
  type: Boolean,
  default: true,
},

lastReminderSent: {
  type: Date,
  default: null,
},

feesReminderSent: {
  type: Boolean,
  default: false,
},

parentName: {
  type: String,
  default: ""
},

address: {
  type: String,
  default: ""
},

gender: {
  type: String,
  default: ""
},
profileImage: {
  type: String,
  default: "",
},
classType: {
  type: String,
  enum: ["Individual", "Group"],
  default: "Individual",
},
groupName: {
  type: String,
  default: "",
},

groupId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "GroupClass",
  default: null,
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
certificates: {
  type: Array,
  default: [],
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