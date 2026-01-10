import { bookingRepository } from "../repositories/booking.repository.js";

export const bookingService = {
  bookTable: async (userId, data) => {
    // 1. Tìm bàn trống NGAY BÂY GIỜ tại tầng khách chọn
    const availableTable = await bookingRepository.findAvailableTable(data.vi_tri);
    
    if (!availableTable) {
      throw new Error(`Rất tiếc, ${data.vi_tri} hiện tại đã hết bàn trống.`);
    }

    // 2. Xếp bàn ngay
    const bookingId = await bookingRepository.createBooking(userId, availableTable.id, data);

    return {
      message: "Xếp bàn thành công!",
      booking_id: bookingId,
      assigned_table: availableTable.so_ban,
      floor: availableTable.vi_tri,
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