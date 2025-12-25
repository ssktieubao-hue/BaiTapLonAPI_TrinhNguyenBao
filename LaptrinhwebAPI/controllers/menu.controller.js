// controllers/menu.controller.js
import { menuService } from "../services/menu.service.js";

export const getMenu = async (req, res) => {
  try {
    // Lấy query param từ URL (ví dụ: ?danh_muc_id=1)
    const { danh_muc_id } = req.query;

    const data = await menuService.getMenu(danh_muc_id);

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};