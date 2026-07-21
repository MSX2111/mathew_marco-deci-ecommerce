import ActivityLog from "../models/activityLog.js";

async function findActivityLogs(req, res) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 20; 
    const skip = (page - 1) * limit;

    
    const [logs, totalCount] = await Promise.all([
      ActivityLog.find()
        .sort({ createdAt: -1 }) 
        .skip(skip)
        .limit(limit),
      ActivityLog.countDocuments(),
    ]);

    return res.status(200).json({ logs, totalCount });
  } catch (error) {
    console.error("MongoDB Log Pagination Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default { findActivityLogs };
