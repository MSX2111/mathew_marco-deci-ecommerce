import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true,
    index: true,
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

let Review;
try {
  Review = mongoose.model("Review");
} catch (error) {
  Review = mongoose.model("Review", reviewSchema);
}

export default Review;
