import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  userId: {
    type: Number,
    default: 0,
    index: true,
  },
  action: {
    type: String,
    required: true,
    index: true,
  },
  entityId: {
    type: String,
    required: true,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


let ActivityLog;
try {
  ActivityLog = mongoose.model("ActivityLog");
} catch (error) {
  ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
}

export default ActivityLog;
