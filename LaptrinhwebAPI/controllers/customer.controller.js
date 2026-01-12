
import { pool } from '../config/database.js';

export const getAvailableTablesByFloor = async (req, res) => {
  try {
    const { vi_tri } = req.query;

    let query = `
      SELECT 
        b.id AS ban_id, 
        b.so_ban, 
        b.so_ghe,
        b.vi_tri,
        b.mo_ta
      FROM BanAn b
      WHERE b.id NOT IN (
        SELECT ban_an_id FROM DatBan d
        WHERE d.trang_thai IN ('DA_DAT', 'DANG_PHUC_VU')
      )
    `;

    const params = [];

    if (vi_tri) {
      query += ' AND b.vi_tri = ?';
      params.push(vi_tri);
    }

    query += ' ORDER BY b.so_ban ASC';

    const [rows] = await pool.query(query, params);

    return res.status(200).json({
      success: true,
      message: 'Lấy danh sách bàn trống thành công',
      data: rows
    });

  } catch (error) {
    console.error('Lỗi:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

export default { getAvailableTablesByFloor };