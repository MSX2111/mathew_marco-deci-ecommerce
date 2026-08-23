import express from "express";

import {
  getProductReviews,
  createReview,
} from "../controllers/review.controller.js";

const router = express.Router();

router.get("/product/:productId", getProductReviews);

router.post("/", createReview);

export default router;
