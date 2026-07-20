import express from "express";
import cartController from "../controllers/cartController.js";

const router = express.Router();

router.get("/", cartController.getCart);
router.post("/", cartController.addToCart);
router.put("/", cartController.updateQuantity); // NEW
router.delete("/", cartController.removeItem); // NEW

export default router;
