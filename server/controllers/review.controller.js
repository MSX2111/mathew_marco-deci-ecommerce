import reviewService from "../config/reviewService.js";
import logActivity from "../utils/activityLogger.js";

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const response = await reviewService.get(`/reviews/product/${productId}`);

    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Error fetching reviews:",
      error.response?.data || error.message,
    );

    res.status(503).json({
      message: "Review service unavailable",
    });
  }
};

export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment?.trim()) {
      return res.status(400).json({
        message: "Product ID, rating and comment are required",
      });
    }

    const response = await reviewService.post("/reviews", {
      productId: Number(productId),
      userId: req.user.userId,
      userName: req.user.name,
      rating: Number(rating),
      comment: comment.trim(),
    });

    const review = response.data;

    await logActivity({
      userId: req.user.userId,
      userName: req.user.name,
      action: "ADD_REVIEW",
      targetType: "PRODUCT",
      targetId: String(productId),
      details: {
        rating: Number(rating),
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error(
      "Error creating review:",
      error.response?.data || error.message,
    );

    res.status(503).json({
      message: "Review service unavailable",
    });
  }
};
