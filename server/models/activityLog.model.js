import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: Number,
      required: false,
    },

    userName: {
      type: String,
      required: false,
    },

    action: {
      type: String,
      required: true,
    },

    targetType: {
      type: String,
      required: false,
    },

    targetId: {
      type: String,
      required: false,
    },

    details: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("ActivityLog", activityLogSchema);
