import express from "express";
import cors from "cors";
import "dotenv/config";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import activityLogRoutes from "./routes/activityLog.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import { info } from "./utils/logger.js";
import { error as logError } from "./utils/logger.js";

import connectMongoDB from "./config/mongodb.js";

const app = express();

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    info("HTTP request", {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - start,
    });
  });

  next();
});

connectMongoDB();

app.use(helmet());

app.use(cors());

app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Too many requests, please try again later.",
  },
});

app.use(apiLimiter);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use("/user", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/activity-logs", activityLogRoutes);
app.use("/reviews", reviewRoutes);
app.get("/test-error", (req, res, next) => {
  next(new Error("Test structured logging error"));
});

app.use((req, res) => {
  res.status(404).json({
    message: "API route not found",
  });
});

app.use((err, req, res, next) => {
  logError("Unhandled application error", {
    method: req.method,
    path: req.originalUrl,
    status: err.status || 500,
    error: err.message,
  });

  res.status(err.status || 500).json({
    message: "Internal server error",
  });
});

export default app;
