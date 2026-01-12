import { pool } from '../config/database.js';

// ADMIN ONLY - Get all tables with status
export const getAllTables = async (req, res) => {
  try {
    const query = `
      SELECT 
        b.id,
        b.so_ban,
        b.so_ghe,
        b.vi_tri,
        b.mo_ta,
        b.hinh_anh,
        CASE 
          WHEN EXISTS (
            SELECT 1 FROM DatBan d 
            WHERE d.ban_an_id = b.id 
            AND d.trang_thai IN ('DA_DAT', 'DANG_PHUC_VU')
          ) THEN true
          ELSE false
        END AS dang_co_khach,
        d.nguoi_dung_id,
        nd.ho_ten AS ten_khach
      FROM BanAn b
      LEFT JOIN DatBan d ON b.id = d.ban_an_id 
        AND d.trang_thai IN ('DA_DAT', 'DANG_PHUC_VU')
      LEFT JOIN NguoiDung nd ON d.nguoi_dung_id = nd.id
      ORDER BY b.so_ban ASC
    `;

    const [rows] = await pool.query(query);

    return res.status(200).json({
      success: true,
      message: 'Lấy danh sách bàn thành công',
      data: rows
    });

  } catch (error) {
    console.error('Lỗi lấy danh sách bàn:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

// PUBLIC - Get available tables by floor (for customers)
export const getAvailableTablesByFloor = async (req, res) => {
  try {
    const { vi_tri } = req.query;

    let query = `
      SELECT 
        b.id AS ban_id, 
        b.so_ban, 
        b.so_ghe,
        b.vi_tri,
        b.mo_ta,
        b.hinh_anh
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
    console.error('Lỗi lấy danh sách bàn trống:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

export default { 
  getAllTables, 
  getAvailableTablesByFloor 
};