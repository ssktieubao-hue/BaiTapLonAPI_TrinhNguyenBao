import tableRepository from '../repositories/table.repository.js';

export const getTableStatusForAdmin = async () => {
    const rawData = await tableRepository.getAdminTableStatus();

    return rawData.map(row => {
        const isOccupied = row.dat_ban_id !== null;

        return {
            id: row.ban_id,
            ten_ban: row.so_ban,
            so_ghe: row.so_ghe,
            dang_co_khach: isOccupied,
            trang_thai_text: isOccupied ? "Đang phục vụ" : "Bàn trống",
            thong_tin_khach: isOccupied ? {
                dat_ban_id: row.dat_ban_id,
                ten_khach: row.ten_khach
            } : null
        };
    });
};

export default {
    getTableStatusForAdmin
};