// services/auth.service.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository.js";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "bi_mat_nha_hang";

export const authService = {
  // ĐĂNG KÝ (Giữ nguyên - Code này ổn)
  register: async (dto) => {
    const existingUser = await userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error("Email đã tồn tại");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(dto.mat_khau, salt);
    const roleId = 2;

    const userId = await userRepository.create({
      ho_ten: dto.ho_ten,
      email: dto.email,
      mat_khau: hashedPassword,
      sdt: dto.sdt || null,
      vai_tro_id: roleId
    });

    return { id: userId, email: dto.email, vai_tro_id: roleId };
  },

  // ĐĂNG NHẬP (Cần sửa)
  login: async (email, mat_khau) => {
    // 1. Tìm user
    const user = await userRepository.findByEmail(email);
    if (!user) return null;

    let isValid = false;
    
    // 2. Kiểm tra mật khẩu
    if (user.mat_khau.startsWith('$2')) {
        // Nếu là user đăng ký bình thường (pass mã hóa)
        isValid = bcrypt.compareSync(mat_khau, user.mat_khau);
    } else {
        // Nếu là admin tự sửa DB (pass thường)
        isValid = (mat_khau === user.mat_khau);
    }

    // [QUAN TRỌNG] --- BẠN ĐANG THIẾU DÒNG NÀY ---
    // Nếu mật khẩu sai thì dừng lại ngay, không được tạo Token
    if (!isValid) return null; 
    // ---------------------------------------------

    // 3. Tạo Token
    const token = jwt.sign(
      { id: user.id, vai_tro_id: user.vai_tro_id }, 
      SECRET_KEY, 
      { expiresIn: "1d" }
    );

    return { 
      token, 
      user: { id: user.id, ho_ten: user.ho_ten, email: user.email, vai_tro_id: user.vai_tro_id } 
    };
  }
};