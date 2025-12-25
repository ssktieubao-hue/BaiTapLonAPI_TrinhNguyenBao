// routes/auth.routes.js
import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/authens/auth.validator.js";

const router = Router();

// POST /api/auth/dang-ky
router.post("/dang-ky", validate(registerSchema), register);

// POST /api/auth/dang-nhap
router.post("/dang-nhap", validate(loginSchema), login);

export default router;