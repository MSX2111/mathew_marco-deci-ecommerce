import productController from "../controllers/productController.js";
import express from "express";

const router = express.Router();

router.get("/", productController.findProducts);
router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct); 
router.delete("/:id", productController.deleteProduct); 
router.get("/:id", productController.findSingleProduct);

export default router;
