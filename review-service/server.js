import express from "express";
import cors from "cors";
import "dotenv/config";

import connectMongoDB from "./config/mongodb.js";
import reviewRoutes from "./routes/review.routes.js";

const app = express();

connectMongoDB();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "review-service",
  });
});

app.use("/reviews", reviewRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Review service route not found",
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Review service running on port ${PORT}`);
});
