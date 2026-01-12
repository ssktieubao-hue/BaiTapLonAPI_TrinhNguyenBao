use baitaplon 
-- 1. Bảng Vai trò (Admin / Khách hàng)
CREATE TABLE VaiTro (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ten_vai_tro VARCHAR(50) NOT NULL UNIQUE -- 'admin', 'khach_hang'
);

-- 2. Bảng Người dùng (Tương ứng 'users')
CREATE TABLE NguoiDung (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ho_ten VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  mat_khau VARCHAR(255) NOT NULL,
  sdt VARCHAR(15),
  vai_tro_id INT NOT NULL,
  FOREIGN KEY (vai_tro_id) REFERENCES VaiTro(id)
);

-- 3. Bảng Bàn ăn (Tương ứng 'courses' + 'sections')
-- Thay vì quản lý môn học, ta quản lý Bàn
CREATE TABLE BanAn (
  id INT PRIMARY KEY AUTO_INCREMENT,
  so_ban VARCHAR(10) NOT NULL UNIQUE, -- Ví dụ: 'A01', 'VIP-02'
  so_ghe INT NOT NULL,                -- Sức chứa (4 ghế, 10 ghế...)
  vi_tri VARCHAR(50),                 -- Ví dụ: 'Tầng 1', 'Sân thượng'
  mo_ta TEXT                          -- Ví dụ: 'Bàn cạnh cửa sổ, view đẹp'
);

-- 4. Bảng Đặt bàn (Tương ứng 'enrollments')
-- Thay vì đăng ký học, ta lưu thông tin ai đặt bàn nào, giờ nào
CREATE TABLE DatBan (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nguoi_dung_id INT NOT NULL,
  ban_an_id INT NOT NULL,
  thoi_gian_den DATETIME NOT NULL,    -- Khách đến lúc mấy giờ?
  ghi_chu TEXT,                       -- Ví dụ: 'Sinh nhật, cần ghế trẻ em'
  trang_thai VARCHAR(20) DEFAULT 'DA_DAT', -- 'DA_DAT', 'DA_HUY', 'HOAN_THANH'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  -- Ràng buộc khóa ngoại
  FOREIGN KEY (nguoi_dung_id) REFERENCES NguoiDung(id),
  FOREIGN KEY (ban_an_id) REFERENCES BanAn(id)
);

-- 5. Bảng Danh mục (Phân loại món)
CREATE TABLE DanhMuc (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ten_danh_muc VARCHAR(100) NOT NULL -- Ví dụ: 'Món Khai Vị', 'Đồ Uống', 'Lẩu'
);

-- 6. Bảng Món ăn
CREATE TABLE MonAn (
  id INT PRIMARY KEY AUTO_INCREMENT,
  ten_mon VARCHAR(150) NOT NULL,
  gia DECIMAL(10, 2) NOT NULL,       -- Ví dụ: 50000.00
  mo_ta TEXT,
  hinh_anh VARCHAR(255),             -- Đường dẫn ảnh
  danh_muc_id INT,
  is_active TINYINT(1) DEFAULT 1,    -- 1: Đang bán, 0: Hết hàng
  FOREIGN KEY (danh_muc_id) REFERENCES DanhMuc(id)
);

-- 7. Bảng Gọi món (Chi tiết Order)
-- Liên kết giữa Đặt bàn (Khách) và Món ăn
CREATE TABLE GoiMon (
  id INT PRIMARY KEY AUTO_INCREMENT,
  dat_ban_id INT NOT NULL,           -- Khách nào gọi? (Lấy từ bảng DatBan)
  mon_an_id INT NOT NULL,            -- Gọi món gì?
  so_luong INT NOT NULL DEFAULT 1,   -- Bao nhiêu cái?
  ghi_chu TEXT,                      -- Ví dụ: 'Ít đường', 'Không hành'
  trang_thai VARCHAR(20) DEFAULT 'CHO_CHE_BIEN', -- CHO_CHE_BIEN, DA_RA_MON
  thoi_gian_goi DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (dat_ban_id) REFERENCES DatBan(id),
  FOREIGN KEY (mon_an_id) REFERENCES MonAn(id)
);


-- Dữ liệu admin
INSERT INTO NguoiDung (ho_ten, email, mat_khau, sdt, vai_tro_id) 
VALUES (
    'admin', 
    'admin@gmail.com', 
    '13122005',  -- <-- Giờ nhập thẳng được rồi vì code đã sửa
    '0969685205', 
    1
);

-- Dữ liệu mẫu Danh mục
INSERT INTO DanhMuc (ten_danh_muc) VALUES ('Đồ Ăn'), ('Đồ Uống');

-- Thêm dữ liệu mẫu cho Vai trò
INSERT INTO VaiTro (ten_vai_tro) VALUES ('admin'), ('khach_hang');

-- 1. Tắt kiểm tra khóa ngoại (để xóa được dữ liệu cũ mà không bị lỗi dính dáng đến đơn đặt bàn cũ)
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Xóa sạch dữ liệu bảng BanAn và reset ID về 1
TRUNCATE TABLE MonAn;

DROP TABLE IF EXISTS ban;
DROP TABLE IF EXISTS khach_hang;
-- Lưu ý: Nếu bảng dat_ban cũ có dữ liệu quan trọng thì backup, không thì xóa để tạo lại cấu trúc chuẩn
DROP TABLE IF EXISTS dat_ban; 
DROP TABLE IF EXISTS DatBan;
DROP TABLE IF EXISTS GoiMon;

-- 3. Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;

-- 4. Chèn dữ liệu mới (18 bàn)
INSERT INTO BanAn (so_ban, so_ghe, vi_tri, mo_ta) VALUES 
-- --- TẦNG 1 (Bàn tiêu chuẩn 4 ghế) ---
('T1-01', 4, 'Tầng 1', 'Bàn gần cửa ra vào'),
('T1-02', 4, 'Tầng 1', 'Bàn tiêu chuẩn'),
('T1-03', 4, 'Tầng 1', 'Bàn tiêu chuẩn'),
('T1-04', 4, 'Tầng 1', 'Bàn tiêu chuẩn'),
('T1-05', 4, 'Tầng 1', 'Bàn góc yên tĩnh'),
('T1-06', 4, 'Tầng 1', 'Bàn cạnh cửa sổ'),

-- --- TẦNG 2 (Bàn gia đình 6 ghế) ---
('T2-01', 6, 'Tầng 2', 'Bàn gia đình'),
('T2-02', 6, 'Tầng 2', 'Bàn gia đình'),
('T2-03', 6, 'Tầng 2', 'Bàn gia đình'),
('T2-04', 6, 'Tầng 2', 'Bàn view thoáng'),
('T2-05', 6, 'Tầng 2', 'Bàn view thoáng'),
('T2-06', 6, 'Tầng 2', 'Bàn góc riêng tư'),

-- --- TẦNG 3 (Bàn tiệc/VIP 8-10 ghế) ---
('T3-01', 8,  'Tầng 3', 'Bàn tiệc nhỏ'),
('T3-02', 8,  'Tầng 3', 'Bàn tiệc nhỏ'),
('T3-03', 10, 'Tầng 3', 'Bàn tiệc lớn VIP'),
('T3-04', 10, 'Tầng 3', 'Bàn tiệc lớn VIP'),
('T3-05', 10, 'Tầng 3', 'Bàn ngoài trời (Sân thượng)'),
('T3-06', 10, 'Tầng 3', 'Bàn ngoài trời (Sân thượng)');

-- Thêm 6 Món Ăn (danh_muc_id = 1)
INSERT INTO MonAn (ten_mon, gia, mo_ta, hinh_anh, danh_muc_id) VALUES 
('Gà Chiên Nước Mắm', 120000, 'Gà ta thả vườn chiên giòn sốt mắm tỏi ớt đậm đà', 'ga_chien_mam.jpg', 1),
('Bò Lúc Lắc Khoai Tây', 150000, 'Thịt bò Úc thái vuông xào lửa lớn kèm khoai tây chiên', 'bo_luc_lac.jpg', 1),
('Sườn Nướng BBQ', 180000, 'Sườn non nướng tảng sốt BBQ kiểu Mỹ mềm tan', 'suon_nuong.jpg', 1),
('Salad Cá Ngừ', 85000, 'Rau xanh Đà Lạt trộn sốt chanh leo và cá ngừ ngâm dầu', 'salad_ca_ngu.jpg', 1),
('Mực Hấp Hành Gừng', 200000, 'Mực trứng tươi hấp gừng sả giữ trọn vị ngọt', 'muc_hap.jpg', 1),
('Nem Rán Hà Nội', 60000, 'Nem rán truyền thống nhân thịt, mộc nhĩ, miến dong', 'nem_ran.jpg', 1);

-- Thêm 5 Đồ Uống (danh_muc_id = 2)
INSERT INTO MonAn (ten_mon, gia, mo_ta, hinh_anh, danh_muc_id) VALUES 
('Trà Đào Cam Sả', 45000, 'Trà đen ủ lạnh kết hợp đào miếng giòn và hương sả', 'tra_dao.jpg', 2),
('Sinh Tố Bơ', 55000, 'Bơ sáp Đắk Lắk xay cùng sữa đặc béo ngậy', 'sinh_to_bo.jpg', 2),
('Nước Ép Dưa Hấu', 40000, 'Nước ép nguyên chất không đường, thanh mát giải nhiệt', 'ep_dua_hau.jpg', 2),
('Cafe Sữa Đá Sài Gòn', 35000, 'Cafe phin truyền thống đậm đà hương vị Việt', 'cafe_sua.jpg', 2),
('Mojito Chanh Bạc Hà', 50000, 'Soda chanh tươi và lá bạc hà mát lạnh (Mocktail)', 'mojito.jpg', 2);

-- Thêm cột hinh_anh vào bảng BanAn
ALTER TABLE BanAn ADD COLUMN hinh_anh VARCHAR(255) AFTER mo_ta;

-- Tầng 1
UPDATE BanAn SET hinh_anh = 'image/tables/bancuaravaoT1.jpg' WHERE so_ban = 'T1-01';
UPDATE BanAn SET hinh_anh = 'image/tables/bantieuchuanT1.jpg' WHERE so_ban = 'T1-02';
UPDATE BanAn SET hinh_anh = 'image/tables/bantieuchuanT1.jpg' WHERE so_ban = 'T1-03';
UPDATE BanAn SET hinh_anh = 'image/tables/bantieuchuanT1.jpg' WHERE so_ban = 'T1-04';
UPDATE BanAn SET hinh_anh = 'image/tables/banyentinhT1.jpg' WHERE so_ban = 'T1-05';
UPDATE BanAn SET hinh_anh = 'image/tables/bancanhcuasoT1.jpg' WHERE so_ban = 'T1-06';

-- Tầng 2
UPDATE BanAn SET hinh_anh = 'image/tables/bangiadinhT2.jpg' WHERE so_ban = 'T2-01';
UPDATE BanAn SET hinh_anh = 'image/tables/bangiadinhT2.jpg' WHERE so_ban = 'T2-02';
UPDATE BanAn SET hinh_anh = 'image/tables/bangiadinhT2.jpg' WHERE so_ban = 'T2-03';
UPDATE BanAn SET hinh_anh = 'image/tables/banviewthoangT2.jpg' WHERE so_ban = 'T2-04';
UPDATE BanAn SET hinh_anh = 'image/tables/banviewthoangT2.jpg' WHERE so_ban = 'T2-05';
UPDATE BanAn SET hinh_anh = 'image/tables/banriengtuT2.jpg' WHERE so_ban = 'T2-06';

-- Tầng 3
UPDATE BanAn SET hinh_anh = 'image/tables/bantiecnhoT3.jpg' WHERE so_ban = 'T3-01';
UPDATE BanAn SET hinh_anh = 'image/tables/bantiecnhoT3.jpg' WHERE so_ban = 'T3-02';
UPDATE BanAn SET hinh_anh = 'image/tables/bantieclonT3.jpg' WHERE so_ban = 'T3-03';
UPDATE BanAn SET hinh_anh = 'image/tables/bantieclonT3.jpg' WHERE so_ban = 'T3-04';
UPDATE BanAn SET hinh_anh = 'image/tables/banngoaitroiT3.jpg' WHERE so_ban = 'T3-05';
UPDATE BanAn SET hinh_anh = 'image/tables/banngoaitroiT3.jpg' WHERE so_ban = 'T3-06';

