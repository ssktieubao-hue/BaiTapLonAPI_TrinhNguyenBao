import { z } from "zod";

export const createBookingSchema = z.object({
  vi_tri: z.string().min(1, "Vui lòng chọn tầng (Ví dụ: Tầng 1)").optional(),
  ban_an_id: z.number().optional(), // Thêm trường này
  ghi_chu: z.string().optional(),
}).refine(
  data => data.vi_tri || data.ban_an_id,
  { message: "Vui lòng cung cấp vi_tri hoặc ban_an_id" }
);