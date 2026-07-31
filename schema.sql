-- SQL Database Schema & Seed Data for Lumé Spa & Nail System

-- 1. Table Users
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(32) NOT NULL,
  role VARCHAR(32) DEFAULT 'customer',
  avatar TEXT,
  specialist_id VARCHAR(64),
  reward_points INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table Loyalty Tiers
CREATE TABLE IF NOT EXISTS loyalty_tiers (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  badge VARCHAR(10) NOT NULL,
  min_points INT DEFAULT 0,
  discount_percent INT DEFAULT 0,
  benefits JSON
);

-- 3. Table Reward Packages
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

-- 4. Table Services
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(64) PRIMARY KEY,
  category VARCHAR(32) NOT NULL,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  price INT NOT NULL,
  original_price INT,
  duration INT NOT NULL,
  icon VARCHAR(10),
  popular BOOLEAN DEFAULT FALSE,
  description TEXT,
  image TEXT,
  protocol_steps JSON,
  target_skin_or_body TEXT,
  benefits JSON
);

-- 5. Table Specialists (Technicians)
CREATE TABLE IF NOT EXISTS specialists (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  experience VARCHAR(100),
  rating DECIMAL(3, 2) DEFAULT 5.0,
  total_reviews INT DEFAULT 0,
  avatar TEXT,
  specialties JSON
);

-- 6. Table Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(32) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  appointment_date DATE NOT NULL,
  time_slot VARCHAR(16) NOT NULL,
  branch VARCHAR(255) NOT NULL,
  specialist_id VARCHAR(64),
  specialist_name VARCHAR(255),
  note TEXT,
  status VARCHAR(32) DEFAULT 'confirmed',
  total_price INT NOT NULL,
  discount_amount INT DEFAULT 0,
  final_price INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 7. Table Redeemed Vouchers
CREATE TABLE IF NOT EXISTS redeemed_vouchers (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  code VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  discount_type VARCHAR(32) NOT NULL,
  discount_value INT NOT NULL,
  points_spent INT NOT NULL,
  redeemed_at DATE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  valid_until DATE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 8. Table Point Transactions
CREATE TABLE IF NOT EXISTS point_transactions (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL,
  transaction_date DATE NOT NULL,
  points INT NOT NULL,
  transaction_type VARCHAR(32) NOT NULL,
  description VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Initial Seed Data Sample:
INSERT INTO loyalty_tiers (id, name, badge, min_points, discount_percent) VALUES
('bronze', 'Thành Viên Bronze', '🥉', 0, 0),
('silver', 'Thành Viên Silver', '🥈', 200, 3),
('gold', 'Thành Viên Gold', '🥇', 500, 5),
('diamond', 'Thành Viên Diamond VIP', '💎', 1000, 10);

INSERT INTO users (id, name, email, phone, role, reward_points) VALUES
('usr_customer_1', 'Nguyễn Thị Lan', 'lan.nguyen@example.com', '0901234567', 'customer', 320),
('usr_staff_1', 'KTV Mai Phương', 'mai.phuong@lumespa.vn', '0988776655', 'staff', 0),
('usr_admin_1', 'Quản Lý Lumé Admin', 'admin@lumespa.vn', '0911223344', 'admin', 0);
