import { pool } from "../config/database.js";

export const getTableStatus = async () => {
  const sql = `
    SELECT 
      b.id AS ban_id, 
      b.so_ban AS ten_ban,
      b.so_ghe,
      
      db.id AS dat_ban_id, 
      db.trang_thai,
      
      nd.ho_ten AS ten_khach
    FROM BanAn b
    LEFT JOIN DatBan db ON b.id = db.ban_an_id 
      AND db.trang_thai IN ('DA_DAT', 'DANG_AN', 'CHO_CHE_BIEN')
      
    LEFT JOIN NguoiDung nd ON db.nguoi_dung_id = nd.id
    
    ORDER BY b.so_ban ASC
  `;

  const [rows] = await pool.query(sql);
  return rows;
};