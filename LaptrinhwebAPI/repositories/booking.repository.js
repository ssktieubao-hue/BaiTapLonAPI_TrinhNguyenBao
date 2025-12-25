import { pool } from "../config/database.js";

export const bookingRepository = {
  
  // 1. Tìm bàn trống (Logic: Bàn nào KHÔNG CÓ khách đang ngồi ăn)
  findAvailableTable: async (viTri) => {
    // Tìm bàn ở tầng đó mà ID không nằm trong danh sách đang bận ('DA_DAT', 'DANG_PHUC_VU')
    const query = `
      SELECT * FROM BanAn b
      WHERE b.vi_tri = ? 
      AND b.id NOT IN (
        SELECT ban_an_id FROM DatBan d
        WHERE d.trang_thai IN ('DA_DAT', 'DANG_PHUC_VU')
      )
      LIMIT 1;
    `;
    
    const [rows] = await pool.query(query, [viTri]);
    return rows[0];
  },

  // 2. Tạo đặt bàn
  createBooking: async (userId, tableId, data) => {
    // Insert vào DB. Lưu ý: NOW() là hàm lấy giờ hiện tại của MySQL
    const [result] = await pool.query(
      `INSERT INTO DatBan (nguoi_dung_id, ban_an_id, thoi_gian_den, ghi_chu, trang_thai) 
       VALUES (?, ?, NOW(), ?, 'DANG_PHUC_VU')`, 
      [userId, tableId, data.ghi_chu || '']
    );
    
    return result.insertId;
  }
};