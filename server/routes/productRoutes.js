import productController from "../controllers/productController.js";
import express from "express";

const router = express.Router();

router.get("/", productController.findProducts);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct); // NEW
router.delete("/:id", productController.deleteProduct); // NEW
router.get("/:id", productController.findSingleProduct);

export default router;
