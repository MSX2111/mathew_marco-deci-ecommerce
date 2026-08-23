import express from "express";

import { getActivityLogs } from "../controllers/activityLog.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  (req, res, next) => {
    if (!req.user.is_admin) {
      return res.status(403).json({
        message: "Admin access required",
      });
    }

    next();
  },
  getActivityLogs,
);

export default router;
