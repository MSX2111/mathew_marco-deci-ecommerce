import Review from "../models/reviews.js";
import logActivity from "../utils/logger.js";
import prisma from "../utils/prismClient.js";

async function getProductReviews(req, res) {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ productId: Number(productId) }).sort({
      createdAt: -1,
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("MongoDB Fetch Error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function createReview(req, res) {
  try {
    const { productId, username, comment } = req.body;
    const activeUserId = req.headers["x-user-id"] || 0;

    const newReview = new Review({
      productId: Number(productId),
      username,
      comment: comment.trim(),
    });
    const savedReview = await newReview.save();

    await logActivity({
      userId: activeUserId,
      action: "REVIEW_CREATE",
      entityId: savedReview._id,
      details: { productId: Number(productId), username },
    });

    return res.status(201).json(savedReview);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updateReview(req, res) {
  try {
    const { reviewId } = req.params;
    const { comment } = req.body;
    const activeUserId = req.headers["x-user-id"] || 0;

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { comment: comment.trim() },
      { new: true },
    );

    await logActivity({
      userId: activeUserId,
      action: "REVIEW_UPDATE",
      entityId: reviewId,
    });

    return res.status(200).json(updatedReview);
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteReview(req, res) {
  try {
    const { reviewId } = req.params;
    const activeUserId = req.headers["x-user-id"] || 0;

    const reviewData = await Review.findById(reviewId);
    await Review.findByIdAndDelete(reviewId);

    await logActivity({
      userId: activeUserId,
      action: "REVIEW_DELETE",
      entityId: reviewId,
      details: { targetProductId: reviewData?.productId },
    });

    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default { getProductReviews, createReview, updateReview, deleteReview };
