import { Router } from 'express';
import { getCurrentCustomers } from '../controllers/admin.controller.js';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/admin/customers - Admin: xem khách hàng hiện tại, bàn, món đã gọi, tổng tiền
router.get('/customers', verifyToken, isAdmin, getCurrentCustomers);

export default router;
