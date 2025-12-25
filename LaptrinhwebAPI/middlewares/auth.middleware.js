// middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "bi_mat_nha_hang";

export const authenticate = (req, res, next) => {
  // 1. Lấy token từ Header (Dạng: "Bearer <token>")
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Vui lòng đăng nhập để lấy Token" });
  }

  // 2. Tách lấy phần mã token phía sau chữ "Bearer "
  const token = authHeader.split(" ")[1];

  try {
    // 3. Giải mã Token
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // 4. Gắn thông tin user vào request để các hàm sau dùng
    req.user = decoded; 
    
    next(); // Cho phép đi tiếp
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};