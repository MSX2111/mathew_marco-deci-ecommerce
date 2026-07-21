import ActivityLog from "../models/activityLog.js";

async function logActivity({ userId = 0, action, entityId, details = {} }) {
  try {
    const log = new ActivityLog({
      userId: Number(userId),
      action,
      entityId: String(entityId),
      details,
    });
    await log.save();
    console.log(`[ACTIVITY LOGGED] Action: ${action} | Entity: ${entityId}`);
  } catch (error) {
    console.error(
      "Failed to write system activity log to MongoDB:",
      error.message,
    );
  }
}

export default logActivity;
