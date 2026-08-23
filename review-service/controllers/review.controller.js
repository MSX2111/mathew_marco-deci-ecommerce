import Review from "../models/review.model.js";

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
    const { productId, userId, userName, rating, comment } = req.body;

    if (!productId || !userId || !userName || !rating || !comment?.trim()) {
      return res.status(400).json({
        message: "All review fields are required",
      });
    }

    const numericRating = Number(rating);

    if (numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5",
      });
    }

    const review = await Review.create({
      productId: Number(productId),
      userId: Number(userId),
      userName,
      rating: numericRating,
      comment: comment.trim(),
    });

    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);

    res.status(500).json({
      message: "Failed to create review",
    });
  }
};
