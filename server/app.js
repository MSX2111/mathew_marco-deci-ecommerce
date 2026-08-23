import express from "express";
import cors from "cors";
import "dotenv/config";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import activityLogRoutes from "./routes/activityLog.routes.js";

import connectMongoDB from "./config/mongodb.js";

const app = express();

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

app.use((req, res) => {
  res.status(404).json({
    message: "API route not found",
  });
});

export default app;
