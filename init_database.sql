-- =========================================================
-- FULL DATABASE INITIALIZATION SCRIPT FOR LUMÉ SPA
-- Auto-generated from database.json
-- =========================================================

-- 1. CREATE TABLES
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(32) NOT NULL,
  role VARCHAR(32) DEFAULT 'customer',
  avatar TEXT,
  reward_points INT DEFAULT 0,
  specialist_id VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loyalty_tiers (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  badge VARCHAR(10) NOT NULL,
  min_points INT DEFAULT 0,
  discount_percent INT DEFAULT 0,
  benefits JSONB
);

CREATE TABLE IF NOT EXISTS reward_packages (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(32) NOT NULL,
  points_required INT NOT NULL,
  value_text VARCHAR(100) NOT NULL,
  value_amount INT NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  popular BOOLEAN DEFAULT FALSE,
  min_spend INT DEFAULT 0,
  service_title VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(64) PRIMARY KEY,
  category VARCHAR(32) NOT NULL,
  title VARCHAR(255) NOT NULL,
  price INT NOT NULL,
  original_price INT,
  duration INT NOT NULL,
  icon VARCHAR(10),
  popular BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS specialists (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  experience VARCHAR(100),
  rating NUMERIC(3, 2) DEFAULT 5.0,
  total_reviews INT DEFAULT 0,
  avatar TEXT
);

CREATE TABLE IF NOT EXISTS appointments (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(32) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  appointment_date DATE NOT NULL,
  time_slot VARCHAR(16) NOT NULL,
  branch TEXT NOT NULL,
  specialist_id VARCHAR(64),
  specialist_name VARCHAR(255),
  selected_services JSONB NOT NULL,
  status VARCHAR(32) DEFAULT 'confirmed',
  total_price INT NOT NULL,
  discount_amount INT DEFAULT 0,
  final_price INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS redeemed_vouchers (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id),
  code VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  discount_type VARCHAR(32) NOT NULL,
  discount_value INT NOT NULL,
  points_spent INT NOT NULL,
  redeemed_at DATE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  valid_until DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS point_transactions (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id),
  transaction_date DATE NOT NULL,
  points INT NOT NULL,
  transaction_type VARCHAR(32) NOT NULL,
  description VARCHAR(255) NOT NULL
);

-- 2. SEED DATA

-- Insert Users
INSERT INTO users (id, name, email, phone, role, avatar, reward_points, specialist_id) VALUES ('usr_customer_1', 'Nguyễn Thị Lan', 'lan.nguyen@example.com', '0901234567', 'customer', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80', 320, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar, reward_points, specialist_id) VALUES ('usr_staff_1', 'KTV Mai Phương', 'mai.phuong@lumespa.vn', '0988776655', 'staff', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80', NULL, 'sp1') ON CONFLICT (id) DO NOTHING;
INSERT INTO users (id, name, email, phone, role, avatar, reward_points, specialist_id) VALUES ('usr_admin_1', 'Quản Lý Lumé Admin', 'admin@lumespa.vn', '0911223344', 'admin', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80', NULL, NULL) ON CONFLICT (id) DO NOTHING;

-- Insert Loyalty Tiers
INSERT INTO loyalty_tiers (id, name, badge, min_points, discount_percent, benefits) VALUES ('bronze', 'Thành Viên Bronze', '🥉', 0, 0, '["Tích 1 điểm cho mỗi 10.000đ chi tiêu","Nhận ưu đãi sinh nhật 50k"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO loyalty_tiers (id, name, badge, min_points, discount_percent, benefits) VALUES ('silver', 'Thành Viên Silver', '🥈', 200, 3, '["Tích điểm x1.2 nhanh hơn","Giảm thêm 3% cho mọi dịch vụ","Quà tặng sinh nhật 100k"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO loyalty_tiers (id, name, badge, min_points, discount_percent, benefits) VALUES ('gold', 'Thành Viên Gold', '🥇', 500, 5, '["Tích điểm x1.5","Giảm thêm 5% cho mọi dịch vụ","Tặng 1 buổi Gội đầu thảo dược sinh nhật","Ưu tiên xếp lịch KTV VIP"]') ON CONFLICT (id) DO NOTHING;
INSERT INTO loyalty_tiers (id, name, badge, min_points, discount_percent, benefits) VALUES ('diamond', 'Thành Viên Diamond VIP', '💎', 1000, 10, '["Tích điểm x2.0 siêu tốc","Giảm thêm 10% cho tất cả dịch vụ","Miễn phí Combo Spa Birthday","Phục vụ phòng VIP riêng biệt"]') ON CONFLICT (id) DO NOTHING;

-- Insert Reward Packages
INSERT INTO reward_packages (id, title, category, points_required, value_text, value_amount, description, icon, popular, min_spend, service_title) VALUES ('rew_50k', 'Voucher Giảm 50.000đ', 'voucher', 50, 'Giảm 50.000đ', 50000, 'Áp dụng giảm trực tiếp trên tổng hóa đơn đặt lịch bất kỳ tại Lumé Spa.', '🎟️', NULL, 0, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO reward_packages (id, title, category, points_required, value_text, value_amount, description, icon, popular, min_spend, service_title) VALUES ('rew_herbal', 'Gói Gội Đầu Dưỡng Sinh Thảo Dược 0đ', 'free_service', 150, 'Miễn phí 100% (250.000đ)', 250000, 'Nấu bồ kết tươi, sả, vỏ bưởi nguyên chất + Massage đầu cổ vai gáy 60 phút.', '🌿', TRUE, 0, 'Gội Đầu Dưỡng Sinh Thảo Dược Lumé') ON CONFLICT (id) DO NOTHING;
INSERT INTO reward_packages (id, title, category, points_required, value_text, value_amount, description, icon, popular, min_spend, service_title) VALUES ('rew_150k', 'Voucher Giảm 150.000đ', 'voucher', 200, 'Giảm 150.000đ', 150000, 'Áp dụng cho hóa đơn dịch vụ chăm sóc da & body từ 400.000đ trở lên.', '🏷️', NULL, 400000, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO reward_packages (id, title, category, points_required, value_text, value_amount, description, icon, popular, min_spend, service_title) VALUES ('rew_massage', 'Gói Massage Cổ Vai Gáy Chuyên Sâu 0đ', 'free_service', 250, 'Miễn phí 100% (350.000đ)', 350000, 'Ấn huyệt chuyên sâu giải tỏa nhức mỏi, chườm đá nóng Himalaya trị liệu.', '💆', TRUE, 0, 'Massage Cổ Vai Gáy Chuyên Sâu') ON CONFLICT (id) DO NOTHING;
INSERT INTO reward_packages (id, title, category, points_required, value_text, value_amount, description, icon, popular, min_spend, service_title) VALUES ('rew_gold24k', 'Gói Cấy Tinh Chất Collagen & Vàng 24K 0đ', 'free_service', 500, 'Miễn phí 100% (650.000đ)', 650000, 'Điện di ion tinh chất vàng 24K nano giúp da căng bóng, chống lão hóa & mờ nếp nhăn.', '👑', TRUE, 0, 'Cấy Tinh Chất Collagen & Vàng 24K') ON CONFLICT (id) DO NOTHING;

-- Insert Services
INSERT INTO services (id, category, title, price, original_price, duration, icon, popular) VALUES ('spa-body-relax', 'spa', 'Massage Body Thư Giãn Tinh Dầu', 350000, 450000, 60, '🪷', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO services (id, category, title, price, original_price, duration, icon, popular) VALUES ('spa-hot-stone', 'spa', 'Massage Đá Nóng Năng Lượng Núi Lửa', 480000, 580000, 75, '🔥', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO services (id, category, title, price, original_price, duration, icon, popular) VALUES ('spa-herbal-shampoo', 'spa', 'Gội Đầu Dưỡng Sinh Thảo Dược Lumé', 250000, 320000, 60, '🌿', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO services (id, category, title, price, original_price, duration, icon, popular) VALUES ('facial-deep-clean', 'facial', 'Chăm Sóc Da Mặt Chuyên SDeep Cleansing', 390000, 500000, 60, '✨', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO services (id, category, title, price, original_price, duration, icon, popular) VALUES ('facial-collagen-glow', 'facial', 'Cấy Tinh Chất Collagen & Vàng 24K', 650000, 850000, 75, '💎', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO services (id, category, title, price, original_price, duration, icon, popular) VALUES ('nail-[#1]', 'nail', 'Chăm Sóc Móng & Sơn Gel Cao Cấp', 180000, 250000, 45, '💅', TRUE) ON CONFLICT (id) DO NOTHING;
INSERT INTO services (id, category, title, price, original_price, duration, icon, popular) VALUES ('nail-foot-care', 'nail', 'Chà Gót Hồng & Chăm Sóc Móng Chân', 220000, 300000, 50, '🦶', FALSE) ON CONFLICT (id) DO NOTHING;
INSERT INTO services (id, category, title, price, original_price, duration, icon, popular) VALUES ('hair-wash-style', 'hair', 'Gội Đầu Thảo Dược & Sấy Tạo Kiểu', 120000, 180000, 35, '✂️', FALSE) ON CONFLICT (id) DO NOTHING;

-- Insert Specialists
INSERT INTO specialists (id, name, title, experience, rating, total_reviews, avatar) VALUES ('sp1', 'KTV Mai Phương', 'Chuyên Gia Spa & Massage Body', '6 năm kinh nghiệm', 4.9, 328, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80') ON CONFLICT (id) DO NOTHING;
INSERT INTO specialists (id, name, title, experience, rating, total_reviews, avatar) VALUES ('sp2', 'KTV Thu Hà', 'Chuyên Viên Chăm Sóc Da Facial', '5 năm kinh nghiệm', 4.95, 412, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80') ON CONFLICT (id) DO NOTHING;
INSERT INTO specialists (id, name, title, experience, rating, total_reviews, avatar) VALUES ('sp3', 'KTV Linh Chi', 'Master Nail Art & Chăm Sóc Móng', '4 năm kinh nghiệm', 4.88, 256, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80') ON CONFLICT (id) DO NOTHING;

-- Insert Appointments
INSERT INTO appointments (id, user_id, customer_name, customer_phone, customer_email, appointment_date, time_slot, branch, specialist_id, specialist_name, selected_services, status, total_price, discount_amount, final_price) VALUES ('LUME-8821', 'usr_customer_1', 'Nguyễn Thị Lan', '0901234567', 'lan.nguyen@example.com', '2026-07-28', '14:30', 'Chi nhánh Quận 1: 128 Nguyễn Trãi, P. Bến Thành, Q.1', 'sp1', 'KTV Mai Phương', '[{"id":"spa-herbal-shampoo","title":"Gội Đầu Dưỡng Sinh Thảo Dược Lumé","price":250000,"duration":60}]', 'confirmed', 250000, 50000, 200000) ON CONFLICT (id) DO NOTHING;

-- Insert Redeemed Vouchers for User usr_customer_1
INSERT INTO redeemed_vouchers (id, user_id, code, title, discount_type, discount_value, points_spent, redeemed_at, is_used, valid_until) VALUES ('v_welcome50', 'usr_customer_1', 'WELCOME-LUME-50K', 'Voucher Chào Mừng Khách Hàng Mới 50k', 'amount', 50000, 0, '2026-07-20', FALSE, '2026-12-31') ON CONFLICT (id) DO NOTHING;

-- Insert Point Transactions for User usr_customer_1
INSERT INTO point_transactions (id, user_id, transaction_date, points, transaction_type, description) VALUES ('tx_init_1', 'usr_customer_1', '2026-07-13', 200, 'earn', 'Tích điểm dịch vụ Cấy Tinh Chất Collagen Vàng 24K') ON CONFLICT (id) DO NOTHING;
INSERT INTO point_transactions (id, user_id, transaction_date, points, transaction_type, description) VALUES ('tx_init_2', 'usr_customer_1', '2026-07-20', 120, 'earn', 'Tích điểm dịch vụ Gội Đầu Dưỡng Sinh & Chăm Sóc Da') ON CONFLICT (id) DO NOTHING;

