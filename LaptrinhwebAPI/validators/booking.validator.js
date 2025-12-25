import { z } from "zod";

export const createBookingSchema = z.object({
  vi_tri: z.string().min(1, "Vui lòng chọn tầng (Ví dụ: Tầng 1)"),
  ghi_chu: z.string().optional(),
});