import { Router } from "express";
import { createBooking, getMyBooking, checkoutBooking } from "../controllers/booking.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createBookingSchema } from "../validators/booking.validator.js";

const router = Router();

// API: POST /api/dat-ban - Đặt bàn
router.post(
  "/", 
  verifyToken,               // 1. Phải đăng nhập
  validate(createBookingSchema), // 2. Check dữ liệu đầu vào
  createBooking               // 3. Xử lý
);

// API: GET /api/dat-ban/my - Lấy thông tin bàn hiện tại + orders
router.get(
  "/my",
  verifyToken,
  getMyBooking
);

// API: POST /api/dat-ban/checkout - Thanh toán và giải phóng bàn
router.post(
  "/checkout",
  verifyToken,
  checkoutBooking
);

export default router;
