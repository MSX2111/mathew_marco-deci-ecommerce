import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import { toNumber } from "./utils/http.js";
import errorHandler from "./utils/errorHandler.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import homeRoutes from "./routes/homeRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import logRoutes from "./routes/logRoutes.js";

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

app.use((req, res) => res.status(404).json({ message: "Endpoint not found" }));
app.use(errorHandler);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const port = toNumber(process.env.PORT, 5000);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export default app;
