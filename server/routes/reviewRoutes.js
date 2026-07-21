import express from "express";
import reviewController from "../controllers/reviewController.js";

const router = express.Router();

router.get("/:productId", reviewController.getProductReviews);
router.post("/", reviewController.createReview);
router.put("/:reviewId", reviewController.updateReview); 
router.delete("/:reviewId", reviewController.deleteReview); 

export default router;
