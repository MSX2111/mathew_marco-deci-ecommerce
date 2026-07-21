import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  productId: {
    type: Number, // Matches your PostgreSQL autoincrement integer ID
    required: true,
    index: true, // Speeds up queries when searching reviews by product
  },
  username: {
    type: String,
    default: "Anonymous",
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the native MongoDB Model
export default mongoose.model("Review", reviewSchema);
