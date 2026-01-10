import adminRepository from '../repositories/admin.repository.js';
import { bookingRepository } from "../repositories/booking.repository.js";

// Trả về danh sách khách hàng hiện tại kèm thông tin bàn, món đã gọi và tổng tiền
export const adminService = {
  getCurrentCustomers: async () => {
    const rows = await adminRepository.getActiveBookingsWithItems();

    // Group theo dat_ban_id
    const map = new Map();

    for (const r of rows) {
      const id = r.dat_ban_id;

      if (!map.has(id)) {
        map.set(id, {
          dat_ban_id: id,
          ban_an_id: r.ban_an_id,
          so_ban: r.so_ban,
          nguoi_id: r.nguoi_id,
          ten_khach: r.ten_khach,
          orders: [],
          total_price: 0
        });
      }

      const entry = map.get(id);

      if (r.goi_mon_id && r.mon_an_id) {
        const subtotal = (r.gia || 0) * (r.so_luong || 0);
        entry.orders.push({
          goi_mon_id: r.goi_mon_id,
          mon_an_id: r.mon_an_id,
          ten_mon: r.ten_mon,
          gia: r.gia,
          so_luong: r.so_luong,
          subtotal
        });
        entry.total_price += subtotal;
      }
    }

    return Array.from(map.values());
  }

  
};

export default adminService;
