import axios from "axios";
import logActivity from "../utils/activityLogger.js";

const reviewService = axios.create({
  baseURL: process.env.REVIEW_SERVICE_URL,
  timeout: 10000,
});

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const response = await reviewService.get(`/reviews/product/${productId}`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Review service error:",
      error.response?.data || error.message,
    );

    return res.status(error.response?.status || 503).json({
      message: error.response?.data?.message || "Review service unavailable",
    });
  }
};

export const createReview = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userName = req.user.name;

    const { productId, rating, comment } = req.body;

    const response = await reviewService.post(
      "/reviews",
      {
        productId: Number(productId),
        userId,
        userName,
        rating: Number(rating),
        comment: comment.trim(),
      },
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      },
    );

    const review = response.data;

    await logActivity({
      userId,
      userName,
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
      "Review service error:",
      error.response?.data || error.message,
    );

    return res.status(error.response?.status || 503).json({
      message: error.response?.data?.message || "Review service unavailable",
    });
  }
};
