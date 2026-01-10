import { bookingService } from "../services/booking.service.js";
import { bookingRepository } from "../repositories/booking.repository.js";

export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy ID khách từ Token
    const bookingData = req.body;

    const result = await bookingService.bookTable(userId, bookingData);

    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Khách xem booking hiện tại + orders
export const getMyBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const booking = await bookingRepository.getCurrentBooking(userId);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Bạn không có bàn nào đang ăn' });
    }

    const orders = await bookingRepository.getBookingOrders(booking.id);
    const total = orders.reduce((sum, o) => sum + (o.gia * o.so_luong), 0);

    return res.json({ 
      success: true, 
      booking: {
        ...booking,
        orders,
        total_price: total
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Khách thanh toán và giải phóng bàn
export const checkoutBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { dat_ban_id } = req.body;

    if (!dat_ban_id) {
      return res.status(400).json({ success: false, message: 'Vui lòng cung cấp ID đặt bàn' });
    }

    const result = await bookingService.checkout(userId, dat_ban_id);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
