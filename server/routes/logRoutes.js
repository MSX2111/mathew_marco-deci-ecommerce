import express from "express";
import logController from "../controllers/logController.js";

const router = express.Router();

router.get("/", logController.findActivityLogs);

export default router;
