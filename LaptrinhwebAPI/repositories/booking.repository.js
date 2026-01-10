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
  },

  // 3. Lấy DatBan hiện tại của khách (đang ăn)
  getCurrentBooking: async (userId) => {
    const query = `
      SELECT 
        d.id,
        d.ban_an_id,
        d.thoi_gian_den,
        d.trang_thai,
        b.so_ban,
        b.vi_tri
      FROM DatBan d
      JOIN BanAn b ON d.ban_an_id = b.id
      WHERE d.nguoi_dung_id = ? AND d.trang_thai IN ('DA_DAT', 'DANG_PHUC_VU')
      ORDER BY d.id DESC
      LIMIT 1;
    `;
    const [rows] = await pool.query(query, [userId]);
    return rows[0];
  },

  // 4. Lấy tất cả GoiMon của một DatBan
  getBookingOrders: async (datBanId) => {
    const query = `
      SELECT 
        gm.id,
        gm.mon_an_id,
        m.ten_mon,
        m.gia,
        gm.so_luong,
        gm.ghi_chu
      FROM GoiMon gm
      JOIN MonAn m ON gm.mon_an_id = m.id
      WHERE gm.dat_ban_id = ?
      ORDER BY gm.id;
    `;
    const [rows] = await pool.query(query, [datBanId]);
    return rows;
  },

  // 5. Checkout - Thanh toán và giải phóng bàn
  checkout: async (datBanId) => {
    // Cập nhật trạng thái DatBan thành 'DA_THANH_TOAN'
    const [result] = await pool.query(
      `UPDATE DatBan 
       SET trang_thai = 'DA_THANH_TOAN'
       WHERE id = ?`,
      [datBanId]
    );
    
    return result;
  }

  
};