-- =========================================================
-- INIT DATABASE SCRIPT FOR LUMÉ SPA & BEAUTY SYSTEM
-- Compatible with PostgreSQL / Render PostgreSQL / Supabase
-- =========================================================

-- 1. DROP EXISTING TABLES IF NEEDED
DROP TABLE IF EXISTS product_orders CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS specialists CASCADE;
DROP TABLE IF EXISTS products_catalog CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS reward_packages CASCADE;
DROP TABLE IF EXISTS loyalty_tiers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. CREATE TABLES

-- Table: users
CREATE TABLE users (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'customer',
    avatar TEXT,
    reward_points INT DEFAULT 0,
    is_approved BOOLEAN DEFAULT TRUE,
    redeemed_vouchers JSONB DEFAULT '[]',
    point_transactions JSONB DEFAULT '[]'
);

-- Table: loyalty_tiers
CREATE TABLE loyalty_tiers (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    badge VARCHAR(10),
    min_points INT DEFAULT 0,
    discount_percent INT DEFAULT 0,
    benefits JSONB DEFAULT '[]'
);

-- Table: reward_packages
CREATE TABLE reward_packages (
    id VARCHAR(100) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    points_required INT NOT NULL,
    value_text VARCHAR(255),
    value_amount INT DEFAULT 0,
    service_title VARCHAR(255),
    description TEXT,
    icon VARCHAR(50),
    popular BOOLEAN DEFAULT FALSE
);

-- Table: services
CREATE TABLE services (
    id VARCHAR(100) PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    original_price INT,
    duration INT NOT NULL,
    icon VARCHAR(50),
    popular BOOLEAN DEFAULT FALSE
);

-- Table: products_catalog
CREATE TABLE products_catalog (
    id VARCHAR(100) PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    price INT NOT NULL,
    original_price INT,
    stock_quantity INT DEFAULT 0,
    icon VARCHAR(50),
    description TEXT,
    image TEXT,
    popular BOOLEAN DEFAULT FALSE,
    benefits JSONB DEFAULT '[]'
);

-- Table: specialists
CREATE TABLE specialists (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    experience VARCHAR(100),
    rating NUMERIC(3, 2) DEFAULT 5.00,
    total_reviews INT DEFAULT 0,
    avatar TEXT
);

-- Table: appointments
CREATE TABLE appointments (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    date VARCHAR(20) NOT NULL,
    time_slot VARCHAR(20) NOT NULL,
    branch TEXT NOT NULL,
    selected_services JSONB NOT NULL DEFAULT '[]',
    specialist_id VARCHAR(100),
    specialist_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'confirmed',
    total_price INT DEFAULT 0,
    discount_amount INT DEFAULT 0,
    final_price INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: product_orders
CREATE TABLE product_orders (
    id VARCHAR(100) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    shipping_address TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]',
    subtotal INT DEFAULT 0,
    shipping_fee INT DEFAULT 0,
    discount_amount INT DEFAULT 0,
    final_price INT DEFAULT 0,
    payment_method VARCHAR(50) DEFAULT 'cod',
    payment_status VARCHAR(50) DEFAULT 'unpaid',
    notes TEXT,
    status VARCHAR(50) DEFAULT 'pending_confirmation',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: reviews
CREATE TABLE reviews (
    id VARCHAR(100) PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    role VARCHAR(100) DEFAULT 'Khách hàng',
    avatar TEXT,
    title TEXT,
    comment TEXT NOT NULL,
    rating INT DEFAULT 5,
    service_name VARCHAR(255),
    date VARCHAR(20),
    verified BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'approved'
);

-- =========================================================
-- 3. INSERT SEED DATA (Converted from database.json)
-- =========================================================

-- Insert Users
INSERT INTO users (id, name, email, phone, role, avatar, reward_points, is_approved, redeemed_vouchers, point_transactions) VALUES
('usr_admin_1', 'Ban Quản Lý Lumé', 'admin@lumespa.vn', '0909999888', 'admin', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80', 0, true, '[]', '[]'),
('usr_customer_1', 'Nguyễn Thị Lan', 'lan.nguyen@example.com', '0901234567', 'customer', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80', 320, true,
 '[{"id": "v_welcome50", "code": "WELCOME-LUME-50K", "title": "Voucher Chào Mừng Khách Hàng Mới 50k", "discountType": "amount", "discountValue": 50000, "pointsSpent": 0, "redeemedAt": "2026-07-20", "isUsed": false, "validUntil": "2026-12-31"}]',
 '[{"id": "tx_init_1", "date": "2026-07-13", "points": 200, "type": "earn", "description": "Tích điểm dịch vụ Cấy Tinh Chất Collagen Vàng 24K"}, {"id": "tx_init_2", "date": "2026-07-20", "points": 120, "type": "earn", "description": "Tích điểm dịch vụ Gội Đầu Dưỡng Sinh & Chăm Sóc Da"}]'
),
('usr_staff_1', 'KTV Mai Phương', 'mai.phuong@lumespa.vn', '0988776655', 'staff', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80', 0, true, '[]', '[]');

-- Insert Loyalty Tiers
INSERT INTO loyalty_tiers (id, name, badge, min_points, discount_percent, benefits) VALUES
('bronze', 'Thành Viên Bronze', '🥉', 0, 0, '["Tích 1 điểm cho mỗi 10.000đ chi tiêu", "Nhận ưu đãi sinh nhật 50k"]'),
('silver', 'Thành Viên Silver', '🥈', 200, 3, '["Tích điểm x1.2 nhanh hơn", "Giảm thêm 3% cho mọi dịch vụ", "Quà tặng sinh nhật 100k"]'),
('gold', 'Thành Viên Gold', '🥇', 500, 5, '["Tích điểm x1.5", "Giảm thêm 5% cho mọi dịch vụ", "Tặng 1 buổi Gội đầu thảo dược sinh nhật", "Ưu tiên xếp lịch KTV VIP"]'),
('diamond', 'Thành Viên Diamond VIP', '💎', 1000, 10, '["Tích điểm x2.0 siêu tốc", "Giảm thêm 10% cho tất cả dịch vụ", "Miễn phí Combo Spa Birthday", "Phục vụ phòng VIP riêng biệt"]');

-- Insert Reward Packages
INSERT INTO reward_packages (id, title, category, points_required, value_text, value_amount, service_title, description, icon, popular) VALUES
('rew_50k', 'Voucher Giảm 50.000đ', 'voucher', 50, 'Giảm 50.000đ', 50000, NULL, 'Áp dụng giảm trực tiếp trên tổng hóa đơn đặt lịch bất kỳ tại Lumé Spa.', '🎟️', false),
('rew_herbal', 'Gói Gội Đầu Dưỡng Sinh Thảo Dược 0đ', 'free_service', 150, 'Miễn phí 100% (250.000đ)', 250000, 'Gội Đầu Dưỡng Sinh Thảo Dược Lumé', 'Nấu bồ kết tươi, sả, vỏ bưởi nguyên chất + Massage đầu cổ vai gáy 60 phút.', '🌿', true),
('rew_150k', 'Voucher Giảm 150.000đ', 'voucher', 200, 'Giảm 150.000đ', 150000, NULL, 'Áp dụng cho hóa đơn dịch vụ chăm sóc da & body từ 400.000đ trở lên.', '🏷️', false),
('rew_massage', 'Gói Massage Cổ Vai Gáy Chuyên Sâu 0đ', 'free_service', 250, 'Miễn phí 100% (350.000đ)', 350000, 'Massage Cổ Vai Gáy Chuyên Sâu', 'Ấn huyệt chuyên sâu giải tỏa nhức mỏi, chườm đá nóng Himalaya trị liệu.', '💆', true),
('rew_gold24k', 'Gói Cấy Tinh Chất Collagen & Vàng 24K 0đ', 'free_service', 500, 'Miễn phí 100% (650.000đ)', 650000, 'Cấy Tinh Chất Collagen & Vàng 24K', 'Điện di ion tinh chất vàng 24K nano giúp da căng bóng, chống lão hóa & mờ nếp nhăn.', '👑', true);

-- Insert Services
INSERT INTO services (id, category, title, price, original_price, duration, icon, popular) VALUES
('spa-body-relax', 'spa', 'Massage Body Thư Giãn Tinh Dầu', 350000, 450000, 60, '🪷', true),
('spa-hot-stone', 'spa', 'Massage Đá Nóng Năng Lượng Núi Lửa', 480000, 580000, 75, '🔥', true),
('spa-herbal-shampoo', 'spa', 'Gội Đầu Dưỡng Sinh Thảo Dược Lumé', 250000, 320000, 60, '🌿', true),
('facial-deep-clean', 'facial', 'Chăm Sóc Da Mặt Chuyên SDeep Cleansing', 390000, 500000, 60, '✨', true),
('facial-collagen-glow', 'facial', 'Cấy Tinh Chất Collagen & Vàng 24K', 650000, 850000, 75, '💎', true),
('nail-[#1]', 'nail', 'Chăm Sóc Móng & Sơn Gel Cao Cấp', 180000, 250000, 45, '💅', true),
('nail-foot-care', 'nail', 'Chà Gót Hồng & Chăm Sóc Móng Chân', 220000, 300000, 50, '🦶', false),
('hair-wash-style', 'hair', 'Gội Đầu Thảo Dược & Sấy Tạo Kiểu', 120000, 180000, 35, '✂️', false);

-- Insert Products Catalog
INSERT INTO products_catalog (id, category, title, subtitle, price, original_price, stock_quantity, icon, description, image, popular, benefits) VALUES
('prod-hair-serum-grapefruit', 'hair', 'Serum Tinh Dầu Bưởi & Bồ Kết Tóc Dày Bồng Bềnh', 'Nuôi dưỡng nang tóc, giảm gãy rụng & kích thích mọc tóc con', 290000, 380000, 45, '🧴', 'Chiết xuất 100% tinh dầu vỏ bưởi da xanh ép lạnh kết hợp cô đặc bồ kết nướng.', 'https://images.unsplash.com/photo-1608248597262-838d12328827?auto=format&fit=crop&w=800&q=80', true, '["Ngăn ngừa gãy rụng tóc", "Kích thích mọc tóc nhanh", "Mùi hương thảo mộc thư giãn"]'),
('prod-facial-serum-ha', 'facial', 'Tinh Chất Serum HA Multi-Hydrating Căng Bóng Da', 'Cấp ẩm đa tầng, phục hồi hàng rào bảo vệ da căng mướt', 450000, 590000, 30, '💧', 'Công thức ngậm nước Hyaluronic Acid 5 phân tử giúp da căng mọng ngay sau lần dùng đầu tiên.', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', true, '["Cấp ẩm chuyên sâu 24h", "Tái tạo da mịn màng", "Phù hợp da nhạy cảm"]'),
('prod-body-oil-lavender', 'spa', 'Dầu Massage Body Tinh Chất Hoa Oải Hương Lavender', 'Thư giãn thần kinh, giảm căng thẳng & dưỡng ẩm da toàn thân', 320000, 420000, 60, '🪻', 'Dầu jojoba hữu cơ kết hợp tinh dầu Lavender Pháp giúp xua tan mệt mỏi.', 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80', true, '["Giúp ngủ ngon sâu giấc", "Mềm mịn da body", "Không rít bết dính"]'),
('prod-nail-cuticle-oil', 'nail', 'Tinh Dầu Dưỡng Viền Móng & Phục Hồi Móng Chắc Khỏe', 'Cung cấp Vitamin E & Keratin nuôi dưỡng móng sáng bóng', 150000, 200000, 80, '💅', 'Chứa tinh dầu hạnh nhân và hạt argan bảo vệ móng sau khi làm nail.', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80', false, '["Chống giòn gãy móng", "Làm mềm xước măng rô", "Hương hoa quả ngọt dịu"]');

-- Insert Specialists
INSERT INTO specialists (id, name, title, experience, rating, total_reviews, avatar) VALUES
('sp1', 'KTV Mai Phương', 'Chuyên Gia Spa & Massage Body', '6 năm kinh nghiệm', 4.90, 328, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80'),
('sp2', 'KTV Thu Hà', 'Chuyên Viên Chăm Sóc Da Facial', '5 năm kinh nghiệm', 4.95, 412, 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80'),
('sp3', 'KTV Linh Chi', 'Master Nail Art & Chăm Sóc Móng', '4 năm kinh nghiệm', 4.88, 256, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80');

-- Insert Appointments
INSERT INTO appointments (id, user_id, customer_name, customer_phone, customer_email, date, time_slot, branch, selected_services, specialist_id, specialist_name, status, total_price, discount_amount, final_price, created_at) VALUES
('LUME-8821', 'usr_customer_1', 'Nguyễn Thị Lan', '0901234567', 'lan.nguyen@example.com', '2026-07-28', '14:30', 'Chi nhánh Quận 1: 128 Nguyễn Trãi, P. Bến Thành, Q.1',
 '[{"id": "spa-herbal-shampoo", "title": "Gội Đầu Dưỡng Sinh Thảo Dược Lumé", "price": 250000, "duration": 60}]',
 'sp1', 'KTV Mai Phương', 'confirmed', 250000, 50000, 200000, '2026-07-26 10:00:00');

-- Insert Product Orders
INSERT INTO product_orders (id, customer_name, customer_phone, customer_email, shipping_address, items, subtotal, shipping_fee, discount_amount, final_price, payment_method, payment_status, notes, status, created_at) VALUES
('ORD-9910', 'Phạm Hồng Nhung', '0933444555', 'nhung.pham@gmail.com', '78 Nguyễn Thị Minh Khai, Q.1, TP. Hồ Chí Minh',
 '[{"id": "prod-hair-serum-grapefruit", "title": "Serum Tinh Dầu Bưởi & Bồ Kết Tóc Dày Bồng Bềnh", "price": 290000, "quantity": 2, "image": "https://images.unsplash.com/photo-1608248597262-838d12328827?auto=format&fit=crop&w=800&q=80"}]',
 580000, 20000, 0, 600000, 'cod', 'unpaid', 'Khách muốn kiểm tra hàng trước khi thanh toán COD.', 'pending_confirmation', '2026-07-31 02:56:36');

-- Insert Reviews
INSERT INTO reviews (id, customer_name, role, avatar, title, comment, rating, service_name, date, verified, status) VALUES
('rev_1', 'Bessie Cooper', 'Khách hàng VIP', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80', 'The Best Thing I''ve Used For My Skin!', 'Lumé Spa thực sự là chốn bình yên yêu thích của tôi sau những tuần làm việc căng thẳng. Liệu trình cấy Collagen Vàng 24K giúp làn da căng bóng và khỏe mạnh rõ rệt chỉ sau 1 buổi!', 5, 'Cấy Tinh Chất Collagen & Vàng 24K', '2026-07-20', true, 'approved'),
('rev_2', 'Thanh Vân', 'Khách hàng Thân thiết', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80', 'Gội Đầu Dưỡng Sinh & Massage Tuyệt Mới!', 'Tay nghề kỹ thuật viên rất êm ái và nhẹ nhàng, mùi bồ kết sả chanh tự nhiên lưu lại cả ngày. Phòng Spa thơm ngát tinh dầu mang lại cảm giác cực kỳ thư thái.', 5, 'Gội Đầu Dưỡng Sinh Thảo Dược Lumé', '2026-07-22', true, 'approved'),
('rev_3', 'Minh Trí & Phương Thảo', 'Khách hàng Đôi', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80', 'Nail Art Vẽ Tay Đẹp Mắt & Bền Bỉ', 'Sơn gel cao cấp không hề bị bong tróc dù mình hay làm việc nhà. Thiết kế mẫu móng đính đá vô cùng chỉn chu và đúng ý thích của mình!', 5, 'Chăm Sóc Móng & Sơn Gel Cao Cấp', '2026-07-25', true, 'approved');
