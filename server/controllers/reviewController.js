import Review from "../models/reviews.js";
import logActivity from "../utils/logger.js";
import { parseUserId, jsonError, toNumber } from "../utils/http.js";

async function getProductReviews(req, res) {
  const productId = toNumber(req.params.productId);
  const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
  return res.status(200).json(reviews);
}

async function createReview(req, res) {
  const userId = parseUserId(req);
  const payload = {
    productId: toNumber(req.body.productId),
    username: req.body.username || "Anonymous",
    comment: (req.body.comment || "").trim(),
  };

  if (!payload.comment) {
    return jsonError(res, "Review comment is required", 400);
  }

  const savedReview = await new Review(payload).save();
  await logActivity({
    userId,
    action: "REVIEW_CREATE",
    entityId: savedReview._id,
    details: { productId: payload.productId, username: payload.username },
  });

  return res.status(201).json(savedReview);
}

async function updateReview(req, res) {
  const userId = parseUserId(req);
  const reviewId = req.params.reviewId;
  const comment = (req.body.comment || "").trim();

  if (!comment) {
    return jsonError(res, "Review comment is required", 400);
  }

  const updatedReview = await Review.findByIdAndUpdate(
    reviewId,
    { comment },
    { new: true },
  );
  if (!updatedReview) {
    return jsonError(res, "Review not found", 404);
  }

  await logActivity({
    userId,
    action: "REVIEW_UPDATE",
    entityId: reviewId,
  });

  return res.status(200).json(updatedReview);
}

async function deleteReview(req, res) {
  const userId = parseUserId(req);
  const reviewId = req.params.reviewId;
  const review = await Review.findByIdAndDelete(reviewId);

  if (!review) {
    return jsonError(res, "Review not found", 404);
  }

  await logActivity({
    userId,
    action: "REVIEW_DELETE",
    entityId: reviewId,
    details: { targetProductId: review.productId },
  });

  return res.status(200).json({ message: "Review deleted successfully" });
}

export default { getProductReviews, createReview, updateReview, deleteReview };
