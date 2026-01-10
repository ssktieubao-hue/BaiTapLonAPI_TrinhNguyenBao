// middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "bi_mat_nha_hang";

// Hàm xác thực đăng nhập
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Vui lòng đăng nhập để lấy Token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

// Hàm kiểm tra quyền Admin
export const isAdmin = (req, res, next) => {
  const ADMIN_ROLE_ID = 1;

  if (req.user && req.user.vai_tro_id === ADMIN_ROLE_ID) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Bạn không có quyền Admin để thực hiện thao tác này!",
    });
  }
};