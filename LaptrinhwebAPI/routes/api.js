import { Router } from "express";
import authRoutes from "./auth.routes.js";
import menuRoutes from "./menu.routes.js";
import bookingRoutes from "./booking.routes.js";
import orderRoutes from "./order.routes.js";
import tableRoutes from "./table.routes.js";
import adminRoutes from "./admin.routes.js";

const router = Router();

// --- AUTH ---
router.use("/auth", authRoutes);

// --- MENU ROUTER ---
router.use("/thuc-don", menuRoutes);

// --- BOOKING ROUTER ---
router.use("/dat-ban", bookingRoutes);

// --- ORDER ROUTER ---
router.use("/goi-mon", orderRoutes);

// --- TABLE ROUTER ---
router.use("/ban", tableRoutes);

// --- ADMIN ROUTER ---
router.use("/admin", adminRoutes);

export default router;