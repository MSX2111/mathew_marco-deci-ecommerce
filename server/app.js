import express from "express";
import cors from "cors";
import "dotenv/config";

import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import activityLogRoutes from "./routes/activityLog.routes.js";

import connectMongoDB from "./config/mongodb.js";

const app = express();

connectMongoDB();

app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/reviews", reviewRoutes);
app.use("/activity-logs", activityLogRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({
    message: "API route not found",
  });
});

export default app;
