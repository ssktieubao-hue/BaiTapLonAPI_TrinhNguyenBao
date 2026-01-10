import tableService from '../services/table.service.js';

export const getTables = async (req, res) => {
    try {
        const data = await tableService.getTableStatusForAdmin();

        return res.status(200).json({
            success: true,
            message: "Lấy trạng thái bàn thành công",
            data: data
        });
    } catch (error) {
        console.error("Lỗi lấy danh sách bàn:", error);
        return res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
};