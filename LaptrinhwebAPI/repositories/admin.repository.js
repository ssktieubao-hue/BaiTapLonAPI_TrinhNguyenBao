import { pool } from '../config/database.js';

// Trả về danh sách các DatBan đang hoạt động cùng các món đã gọi (một hàng = 1 món)
export const adminRepository = {
  getActiveBookingsWithItems: async () => {
    const query = `
      SELECT
        d.id AS dat_ban_id,
        d.ban_an_id,
        b.so_ban,
        nd.id AS nguoi_id,
        nd.ho_ten AS ten_khach,
        gm.id AS goi_mon_id,
        m.id AS mon_an_id,
        m.ten_mon,
        m.gia,
        gm.so_luong
      FROM DatBan d
      JOIN BanAn b ON d.ban_an_id = b.id
      JOIN NguoiDung nd ON d.nguoi_dung_id = nd.id
      LEFT JOIN GoiMon gm ON gm.dat_ban_id = d.id
      LEFT JOIN MonAn m ON gm.mon_an_id = m.id
      WHERE d.trang_thai IN ('DA_DAT', 'DANG_PHUC_VU')
      ORDER BY d.id, gm.id;
    `;

    const [rows] = await pool.query(query);
    return rows;
  }
};

export default adminRepository;
