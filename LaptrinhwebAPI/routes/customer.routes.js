
import { Router } from 'express';
import { getAvailableTablesByFloor } from '../controllers/customer.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/ban-trong?vi_tri=Tầng 1
router.get('/', verifyToken, getAvailableTablesByFloor);

export default router;