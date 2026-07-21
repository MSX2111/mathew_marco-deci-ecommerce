import express from "express";
import cartController from "../controllers/cartController.js";

const router = express.Router();

router.get("/", cartController.getCart);
router.post("/", cartController.addToCart);
router.put("/", cartController.updateQuantity); 
router.delete("/", cartController.removeItem); 

export default router;
