import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import logRoutes from "./routes/logRoutes.js";

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/home", homeRoutes);
app.use("/reviews", reviewRoutes);
app.use("/admin/logs", logRoutes);

app.listen(5000, () => {
  console.log(`Server is running on port 5000`);
});
