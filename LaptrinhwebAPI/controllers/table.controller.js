import { getTableStatusList } from "../services/table.service.js";

export const getTables = async (req, res) => {
  try {
    const data = await getTableStatusList();

    return res.status(200).json({
      success: true,
      total_tables: data.length,
      data: data,
    });
  } catch (error) {
    console.error("Lỗi Controller:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy danh sách bàn",
    });
  }
};