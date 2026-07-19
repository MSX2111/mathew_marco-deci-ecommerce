import userController from "../controllers/userController.js";

import express, { Router } from "express";

const router = express.Router();

router.post("/signup", userController.createUser);
router.post("/login", userController.loginUser);
router.post("/dashboard", userController.findUser);
router.post("/update", userController.updateUser);

export default router;
