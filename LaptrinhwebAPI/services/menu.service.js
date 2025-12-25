// services/menu.service.js
import { menuRepository } from "../repositories/menu.repository.js";

export const menuService = {
  getMenu: async (danhMucId) => {
    // Gọi repo lấy danh sách món
    const items = await menuRepository.getAll(danhMucId);
    
    // Gọi repo lấy danh sách danh mục (để Frontend hiển thị thanh filter)
    // Nếu chỉ muốn lấy món ăn thì bỏ dòng này đi cũng được
    const categories = await menuRepository.getCategories();

    return {
      categories, // Danh sách nhóm: Đồ ăn, Đồ uống...
      items       // Danh sách món chi tiết
    };
  }
};