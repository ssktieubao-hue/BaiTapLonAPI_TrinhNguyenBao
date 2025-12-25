// validators/auth.validator.js
import { z } from "zod";

export const registerSchema = z.object({
  ho_ten: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  mat_khau: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  sdt: z.string().min(10, "Số điện thoại không hợp lệ").optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  mat_khau: z.string().min(1, "Vui lòng nhập mật khẩu"),
});