// routes/menu.routes.js
import { Router } from "express";
import { getMenu } from "../controllers/menu.controller.js";

const router = Router();

// GET /api/thuc-don
router.get("/", getMenu);

export default router;