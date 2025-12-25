
import { pool } from "../config/database.js";

export const orderRepository = {
  // Hàm thêm nhiều món cùng lúc
  addItems: async (datBanId, items) => {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Duyệt qua từng món trong mảng và Insert
      for (const item of items) {
        // Kiểm tra xem món này có tồn tại trong menu không (Optional - kỹ thì thêm)
        
        await connection.query(
          `INSERT INTO GoiMon (dat_ban_id, mon_an_id, so_luong, ghi_chu) 
           VALUES (?, ?, ?, ?)`,
          [datBanId, item.mon_an_id, item.so_luong, item.ghi_chu || '']
        );
      }

      await connection.commit();
      return true;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Kiểm tra bàn này có đang hoạt động không (chưa thanh toán/chưa hủy)
  checkActiveBooking: async (datBanId) => {
    const [rows] = await pool.query(
      "SELECT * FROM DatBan WHERE id = ? AND trang_thai != 'DA_HUY'", 
      [datBanId]
    );
    return rows[0];
  }
};