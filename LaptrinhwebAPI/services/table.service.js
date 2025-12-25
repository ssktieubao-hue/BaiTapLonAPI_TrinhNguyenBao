import { getTableStatus } from "../repositories/table.repository.js";

export const getTableStatusList = async () => {
  const rawData = await getTableStatus();

  const formattedData = rawData.map((row) => {
    const isOccupied = row.dat_ban_id !== null;

    return {
      ban_id: row.ban_id,
      ten_ban: row.ten_ban,
      so_ghe: row.so_ghe,

      trang_thai_code: isOccupied ? 1 : 0,
      trang_thai_text: isOccupied ? "Đang có khách" : "Trống",

      thong_tin_hien_tai: isOccupied
        ? {
            dat_ban_id: row.dat_ban_id,
            ten_khach: row.ten_khach,
            trang_thai_don: row.trang_thai,
          }
        : null,
    };
  });

  return formattedData;
};