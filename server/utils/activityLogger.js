import ActivityLog from "../models/activityLog.model.js";

const logActivity = async ({
  userId,
  userName,
  action,
  targetType,
  targetId,
  details,
}) => {
  try {
    await ActivityLog.create({
      userId,
      userName,
      action,
      targetType,
      targetId,
      details,
    });
  } catch (error) {
    console.error("Failed to create activity log:", error);
  }
};

export default logActivity;
