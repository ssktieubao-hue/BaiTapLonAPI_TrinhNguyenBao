
import { pool } from "../config/database.js";

export const menuRepository = {
  // Lấy toàn bộ món (hoặc lọc theo danh mục nếu có id)
  getAll: async (danhMucId = null) => {
    let query = `
      SELECT 
        m.id, 
        m.ten_mon, 
        m.gia, 
        m.mo_ta, 
        m.hinh_anh, 
        d.ten_danh_muc 
      FROM MonAn m
      JOIN DanhMuc d ON m.danh_muc_id = d.id
      WHERE m.is_active = 1
    `;

    const params = [];

    // Nếu có truyền ID danh mục thì thêm điều kiện lọc
    if (danhMucId) {
      query += " AND m.danh_muc_id = ?";
      params.push(danhMucId);
    }

    const [rows] = await pool.query(query, params);
    return rows;
  },

  // Hàm phụ: Lấy danh sách các danh mục (để hiển thị các tab menu: Đồ ăn | Đồ uống)
  getCategories: async () => {
    const [rows] = await pool.query("SELECT * FROM DanhMuc");
    return rows;
  }
};