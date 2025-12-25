import { Router } from "express";
import { createBooking } from "../controllers/booking.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createBookingSchema } from "../validators/booking.validator.js";

const router = Router();

// API: POST /api/dat-ban
router.post(
  "/", 
  authenticate,               // 1. Phải đăng nhập
  validate(createBookingSchema), // 2. Check dữ liệu đầu vào
  createBooking               // 3. Xử lý
);

export default router;