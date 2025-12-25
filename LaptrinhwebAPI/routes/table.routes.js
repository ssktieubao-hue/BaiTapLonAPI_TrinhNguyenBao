import { Router } from "express";
import { getTables } from "../controllers/table.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// GET /api/ban
// Yêu cầu phải có Token (Đăng nhập) mới xem được
router.get("/", authenticate, getTables);

export default router;