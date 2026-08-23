import express from "express";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticate, getProducts);
router.get("/:id", authenticate, getProductById);

router.post("/", authenticate, createProduct);
router.put("/:id", authenticate, updateProduct);
router.delete("/:id", authenticate, deleteProduct);

export default router;
