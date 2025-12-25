import { bookingService } from "../services/booking.service.js";

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