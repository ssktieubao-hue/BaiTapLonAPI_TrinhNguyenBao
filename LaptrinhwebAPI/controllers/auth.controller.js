// controllers/auth.controller.js
import { authService } from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ message: "Đăng ký thành công", data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, mat_khau } = req.body;
    const result = await authService.login(email, mat_khau);

    if (!result) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    res.json({ message: "Đăng nhập thành công", data: result });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};