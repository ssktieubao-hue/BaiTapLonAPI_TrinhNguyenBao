
import { orderService } from "../services/order.service.js";

export const createOrder = async (req, res) => {
  try {
    const { dat_ban_id, items } = req.body;
    
    const result = await orderService.orderFood(dat_ban_id, items);
    
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};