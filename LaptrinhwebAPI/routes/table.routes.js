import { Router } from 'express';
import { getAllTables, getAvailableTablesByFloor } from '../controllers/table.controller.js';
import { verifyToken, isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// ADMIN route - Xem tất cả bàn (bao gồm cả đang có khách)
router.get('/admin', verifyToken, isAdmin, getAllTables);

// PUBLIC route - Xem bàn trống (cho khách hàng chọn bàn)
router.get('/available', verifyToken, getAvailableTablesByFloor);

export default router;