// middlewares/validate.middleware.js
import { z } from "zod";

export const validate = (schema) => (req, res, next) => {
  try {
    // Kiểm tra xem schema có hợp lệ không trước khi parse
    if (!schema) {
        throw new Error("Schema validation bị thiếu hoặc không hợp lệ");
    }

    // Parse dữ liệu body
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    console.error("Validate Middleware Error:", error);
    
    // 1. Nếu là lỗi do Zod (Dữ liệu sai định dạng) - kiểm tra bằng error.errors
    if (error.errors && Array.isArray(error.errors)) {
      const errorMessages = error.errors.map((issue) => ({
        field: issue.path?.join('.') || 'unknown',
        message: issue.message,
      }));
      return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors: errorMessages });
    }

    // 2. Nếu là lỗi khác (Lỗi code, lỗi thiếu thư viện...) -> In ra terminal để sửa
    return res.status(500).json({ 
        message: "Lỗi server nội bộ", 
        detail: error.message || "Unknown error"
    });
  }
};