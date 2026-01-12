import { bookingRepository } from "../repositories/booking.repository.js";
import { pool } from "../config/database.js";

export const bookingService = {
  bookTable: async (userId, data) => {
    let tableId;
    let tableInfo;
    
    // OPTION 1: Khách chọn bàn cụ thể
    if (data.ban_an_id) {
      const [rows] = await pool.query(
        `SELECT b.* FROM BanAn b
         WHERE b.id = ?
         AND b.id NOT IN (
           SELECT ban_an_id FROM DatBan d
           WHERE d.trang_thai IN ('DA_DAT', 'DANG_PHUC_VU')
         )`,
        [data.ban_an_id]
      );

      if (rows.length === 0) {
        throw new Error('Bàn này đã có người đặt, vui lòng chọn bàn khác.');
      }

      tableId = data.ban_an_id;
      tableInfo = rows[0];
    } 

    // Tạo booking
    const bookingId = await bookingRepository.createBooking(userId, tableId, data);

    return {
      message: "Xếp bàn thành công!",
      booking_id: bookingId,
      assigned_table: tableInfo.so_ban,
      floor: tableInfo.vi_tri,
      note: "Bạn có thể gọi món ngay bây giờ."
    };
  },

  // Thanh toán hóa đơn và giải phóng bàn
  checkout: async (userId, datBanId) => {
    // 1. Lấy thông tin đặt bàn
    const booking = await bookingRepository.getCurrentBooking(userId);
    
    if (!booking) {
      throw new Error('Bạn không có bàn nào đang ăn');
    }

    if (booking.id !== datBanId) {
      throw new Error('Không thể thanh toán bàn của người khác');
    }

    // 2. Lấy danh sách các món đã gọi để tính tổng tiền
    const orders = await bookingRepository.getBookingOrders(datBanId);
    
    if (orders.length === 0) {
      throw new Error('Không có bất kỳ đơn hàng nào để thanh toán');
    }

    const totalPrice = orders.reduce((sum, order) => sum + (order.gia * order.so_luong), 0);

    // 3. Cập nhật trạng thái thành 'DA_THANH_TOAN' - bàn trở thành trống
    await bookingRepository.checkout(datBanId);

    return {
      success: true,
      message: "Thanh toán thành công! Bàn được giải phóng.",
      booking_id: datBanId,
      total_price: totalPrice,
      orders: orders,
      status: "DA_THANH_TOAN"
    };
  }
};