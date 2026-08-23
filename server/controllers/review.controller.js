import Review from "../models/review.model.js";
import logActivity from "../utils/activityLogger.js";

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({
      productId: Number(productId),
    }).sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);

    res.status(500).json({
      message: "Failed to fetch reviews",
    });
  }
};

export const createReview = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userName = req.user.name;

    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment?.trim()) {
      return res.status(400).json({
        message: "All review fields are required",
      });
    }

    const review = await Review.create({
      productId: Number(productId),
      userId,
      userName,
      rating: Number(rating),
      comment: comment.trim(),
    });

    await logActivity({
      userId,
      userName,
      action: "ADD_REVIEW",
      targetType: "PRODUCT",
      targetId: String(productId),
      details: {
        rating,
        comment,
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);

    res.status(500).json({
      message: "Failed to create review",
    });
  }
};
