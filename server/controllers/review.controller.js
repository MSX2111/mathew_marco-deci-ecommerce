import axios from "axios";

import logActivity from "../utils/activityLogger.js";

const reviewService = axios.create({
  baseURL: process.env.REVIEW_SERVICE_URL,
  timeout: 10000,
});

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const response = await reviewService.get(`/reviews/product/${productId}`);

    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Error communicating with review service:",
      error.response?.data || error.message,
    );

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    res.status(503).json({
      message: "Review service unavailable",
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

    const response = await reviewService.post("/reviews", {
      productId: Number(productId),
      userId,
      userName,
      rating: Number(rating),
      comment: comment.trim(),
    });

    const review = response.data;

    // Keep activity logging in the main application.
    await logActivity({
      userId,
      userName,
      action: "ADD_REVIEW",
      targetType: "PRODUCT",
      targetId: String(productId),
      details: {
        rating: Number(rating),
        comment: comment.trim(),
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error(
      "Error communicating with review service:",
      error.response?.data || error.message,
    );

    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }

    res.status(503).json({
      message: "Review service unavailable",
    });
  }
};
