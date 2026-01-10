import { pool } from '../config/database.js';

const getAdminTableStatus = async () => {
    // 1. Logic: Lấy tất cả bàn + Thông tin đơn đặt (nếu đang ăn)
    const sql = `
        SELECT 
            b.id AS ban_id, 
            b.so_ban, 
            b.so_ghe,
            
            -- Lấy thông tin đơn đặt bàn (nếu có)
            db.id AS dat_ban_id, 
            db.trang_thai AS trang_thai_don,
            
            -- Lấy tên khách hàng
            nd.ho_ten AS ten_khach
            
        FROM BanAn b
        -- LEFT JOIN: Lấy cả bàn trống lẫn bàn có khách
        -- Chỉ ghép với đơn có trạng thái đặt/đang phục vụ (chuẩn chuỗi trong DB)
        LEFT JOIN DatBan db ON b.id = db.ban_an_id AND db.trang_thai IN ('DA_DAT', 'DANG_PHUC_VU')
        
        -- Ghép bảng Người dùng để lấy tên khách
        LEFT JOIN NguoiDung nd ON db.nguoi_dung_id = nd.id
        
        ORDER BY b.so_ban ASC;
    `;

    // 2. Chạy câu lệnh
    try {
        const [rows] = await pool.query(sql);
        return rows;
    } catch (error) {
        throw error;
    }
};

export default {
    getAdminTableStatus
};