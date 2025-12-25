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
  }
};