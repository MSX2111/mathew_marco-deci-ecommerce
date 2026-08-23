import ActivityLog from "../models/activityLog.model.js";

export const getActivityLogs = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 100, 500);

    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(limit);

    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching activity logs:", error);

    res.status(500).json({
      message: "Failed to fetch activity logs",
    });
  }
};
