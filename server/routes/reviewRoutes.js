import express from "express";
import reviewController from "../controllers/reviewController.js";

const router = express.Router();

router.get("/:productId", reviewController.getProductReviews);
router.post("/", reviewController.createReview);
router.put("/:reviewId", reviewController.updateReview); // NEW
router.delete("/:reviewId", reviewController.deleteReview); // NEW

export default router;
