// repositories/user.repository.js
import { pool } from "../config/database.js";

export const userRepository = {
  // Tìm người dùng theo email (để check trùng hoặc đăng nhập)
  findByEmail: async (email) => {
    const [rows] = await pool.query("SELECT * FROM NguoiDung WHERE email = ?", [email]);
    return rows[0];
  },

  // Tạo người dùng mới
  create: async ({ ho_ten, email, mat_khau, sdt, vai_tro_id }) => {
    const [result] = await pool.query(
      "INSERT INTO NguoiDung (ho_ten, email, mat_khau, sdt, vai_tro_id) VALUES (?, ?, ?, ?, ?)",
      [ho_ten, email, mat_khau, sdt, vai_tro_id]
    );
    return result.insertId;
  },
  
  // Tìm theo ID (để dùng cho middleware authenticate sau này)
  findById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM NguoiDung WHERE id = ?", [id]);
    return rows[0];
  }
};