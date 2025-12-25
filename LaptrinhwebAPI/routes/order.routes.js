
import { Router } from "express";
import { createOrder } from "../controllers/order.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createOrderSchema } from "../validators/order.validator.js";

const router = Router();

// POST /api/goi-mon
router.post(
  "/",
  authenticate, // Phải đăng nhập mới được gọi món
  validate(createOrderSchema), 
  createOrder
);

export default router;