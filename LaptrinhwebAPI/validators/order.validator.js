
import { z } from "zod";

export const createOrderSchema = z.object({
  dat_ban_id: z.number({ required_error: "Vui lòng cung cấp ID lượt đặt bàn" }),
  
  // Quan trọng: items là một MẢNG (Array) các món ăn
  items: z.array(
    z.object({
      mon_an_id: z.number(),
      so_luong: z.number().min(1, "Số lượng phải lớn hơn 0"),
      ghi_chu: z.string().optional() // Ví dụ: "Không hành", "Ít đá"
    })
  ).min(1, "Vui lòng chọn ít nhất 1 món") // Bắt buộc phải có ít nhất 1 món trong mảng
});