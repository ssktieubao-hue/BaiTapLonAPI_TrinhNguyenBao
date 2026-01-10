import { Router } from "express";
import { getTables } from "../controllers/table.controller.js";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Chỉ Admin mới xem được bàn nào đang có khách
router.get('/', verifyToken, isAdmin, getTables);

export default router;