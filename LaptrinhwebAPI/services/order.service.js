
import { orderRepository } from "../repositories/order.repository.js";

export const orderService = {
  orderFood: async (datBanId, items) => {
    // 1. Kiểm tra xem bàn này có khách ngồi thật không
    const booking = await orderRepository.checkActiveBooking(datBanId);
    if (!booking) {
      throw new Error("Lượt đặt bàn không tồn tại hoặc đã bị hủy.");
    }

    // 2. Thêm danh sách món ăn vào DB
    await orderRepository.addItems(datBanId, items);

    return {
      message: "Gọi món thành công!",
      dat_ban_id: datBanId,
      total_items: items.length // Trả về số lượng món đã order
    };
  }
};