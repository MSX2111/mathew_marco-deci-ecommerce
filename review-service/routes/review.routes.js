import express from "express";

import {
  getProductReviews,
  createReview,
} from "../controllers/review.controller.js";

import { authenticate } from "../../server/middleware/auth.middleware.js";

const router = express.Router();

router.get("/product/:productId", authenticate, getProductReviews);

router.post("/", authenticate, createReview);

export default router;
