import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '../database.json');
const sqlOutputPath = path.join(__dirname, '../init_database.sql');

if (!fs.existsSync(jsonPath)) {
  console.error('database.json not found');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

let sql = `-- =========================================================\n`;
sql += `-- FULL DATABASE INITIALIZATION SCRIPT FOR LUMÉ SPA\n`;
sql += `-- Auto-generated from database.json\n`;
sql += `-- =========================================================\n\n`;

// 1. Tables creation
sql += `-- 1. CREATE TABLES\n`;
sql += `CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(32) NOT NULL,
  role VARCHAR(32) DEFAULT 'customer',
  avatar TEXT,
  reward_points INT DEFAULT 0,
  specialist_id VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);\n\n`;

sql += `CREATE TABLE IF NOT EXISTS loyalty_tiers (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  badge VARCHAR(10) NOT NULL,
  min_points INT DEFAULT 0,
  discount_percent INT DEFAULT 0,
  benefits JSONB
);\n\n`;

sql += `CREATE TABLE IF NOT EXISTS reward_packages (
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
);\n\n`;

sql += `CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(64) PRIMARY KEY,
  category VARCHAR(32) NOT NULL,
  title VARCHAR(255) NOT NULL,
  price INT NOT NULL,
  original_price INT,
  duration INT NOT NULL,
  icon VARCHAR(10),
  popular BOOLEAN DEFAULT FALSE
);\n\n`;

sql += `CREATE TABLE IF NOT EXISTS specialists (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  experience VARCHAR(100),
  rating NUMERIC(3, 2) DEFAULT 5.0,
  total_reviews INT DEFAULT 0,
  avatar TEXT
);\n\n`;

sql += `CREATE TABLE IF NOT EXISTS appointments (
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
);\n\n`;

sql += `CREATE TABLE IF NOT EXISTS redeemed_vouchers (
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
);\n\n`;

sql += `CREATE TABLE IF NOT EXISTS point_transactions (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) REFERENCES users(id),
  transaction_date DATE NOT NULL,
  points INT NOT NULL,
  transaction_type VARCHAR(32) NOT NULL,
  description VARCHAR(255) NOT NULL
);\n\n`;

// 2. Insert Data
sql += `-- 2. SEED DATA\n\n`;

function escapeSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'number') return val;
  if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
  return `'${String(val).replace(/'/g, "''")}'`;
}

// Users
if (data.users && data.users.length) {
  sql += `-- Insert Users\n`;
  data.users.forEach(u => {
    sql += `INSERT INTO users (id, name, email, phone, role, avatar, reward_points, specialist_id) VALUES `;
    sql += `(${escapeSql(u.id)}, ${escapeSql(u.name)}, ${escapeSql(u.email)}, ${escapeSql(u.phone)}, ${escapeSql(u.role)}, ${escapeSql(u.avatar)}, ${escapeSql(u.rewardPoints)}, ${escapeSql(u.specialistId)}) `;
    sql += `ON CONFLICT (id) DO NOTHING;\n`;
  });
  sql += `\n`;
}

// Loyalty Tiers
if (data.loyaltyTiers && data.loyaltyTiers.length) {
  sql += `-- Insert Loyalty Tiers\n`;
  data.loyaltyTiers.forEach(lt => {
    sql += `INSERT INTO loyalty_tiers (id, name, badge, min_points, discount_percent, benefits) VALUES `;
    sql += `(${escapeSql(lt.id)}, ${escapeSql(lt.name)}, ${escapeSql(lt.badge)}, ${escapeSql(lt.minPoints)}, ${escapeSql(lt.discountPercent)}, ${escapeSql(lt.benefits)}) `;
    sql += `ON CONFLICT (id) DO NOTHING;\n`;
  });
  sql += `\n`;
}

// Reward Packages
if (data.rewardPackages && data.rewardPackages.length) {
  sql += `-- Insert Reward Packages\n`;
  data.rewardPackages.forEach(rp => {
    sql += `INSERT INTO reward_packages (id, title, category, points_required, value_text, value_amount, description, icon, popular, min_spend, service_title) VALUES `;
    sql += `(${escapeSql(rp.id)}, ${escapeSql(rp.title)}, ${escapeSql(rp.category)}, ${escapeSql(rp.pointsRequired)}, ${escapeSql(rp.valueText)}, ${escapeSql(rp.valueAmount)}, ${escapeSql(rp.description)}, ${escapeSql(rp.icon)}, ${escapeSql(rp.popular)}, ${escapeSql(rp.minSpend || 0)}, ${escapeSql(rp.serviceTitle)}) `;
    sql += `ON CONFLICT (id) DO NOTHING;\n`;
  });
  sql += `\n`;
}

// Services
if (data.services && data.services.length) {
  sql += `-- Insert Services\n`;
  data.services.forEach(s => {
    sql += `INSERT INTO services (id, category, title, price, original_price, duration, icon, popular) VALUES `;
    sql += `(${escapeSql(s.id)}, ${escapeSql(s.category)}, ${escapeSql(s.title)}, ${escapeSql(s.price)}, ${escapeSql(s.originalPrice)}, ${escapeSql(s.duration)}, ${escapeSql(s.icon)}, ${escapeSql(s.popular)}) `;
    sql += `ON CONFLICT (id) DO NOTHING;\n`;
  });
  sql += `\n`;
}

// Specialists
if (data.specialists && data.specialists.length) {
  sql += `-- Insert Specialists\n`;
  data.specialists.forEach(sp => {
    sql += `INSERT INTO specialists (id, name, title, experience, rating, total_reviews, avatar) VALUES `;
    sql += `(${escapeSql(sp.id)}, ${escapeSql(sp.name)}, ${escapeSql(sp.title)}, ${escapeSql(sp.experience)}, ${escapeSql(sp.rating)}, ${escapeSql(sp.totalReviews)}, ${escapeSql(sp.avatar)}) `;
    sql += `ON CONFLICT (id) DO NOTHING;\n`;
  });
  sql += `\n`;
}

// Appointments
if (data.appointments && data.appointments.length) {
  sql += `-- Insert Appointments\n`;
  data.appointments.forEach(a => {
    sql += `INSERT INTO appointments (id, user_id, customer_name, customer_phone, customer_email, appointment_date, time_slot, branch, specialist_id, specialist_name, selected_services, status, total_price, discount_amount, final_price) VALUES `;
    sql += `(${escapeSql(a.id)}, ${escapeSql(a.userId)}, ${escapeSql(a.customerName)}, ${escapeSql(a.customerPhone)}, ${escapeSql(a.customerEmail)}, ${escapeSql(a.date)}, ${escapeSql(a.timeSlot)}, ${escapeSql(a.branch)}, ${escapeSql(a.specialistId)}, ${escapeSql(a.specialistName)}, ${escapeSql(a.selectedServices)}, ${escapeSql(a.status)}, ${escapeSql(a.totalPrice)}, ${escapeSql(a.discountAmount)}, ${escapeSql(a.finalPrice)}) `;
    sql += `ON CONFLICT (id) DO NOTHING;\n`;
  });
  sql += `\n`;
}

// User Nested Redeemed Vouchers & Point Transactions
if (data.users && data.users.length) {
  data.users.forEach(u => {
    if (u.redeemedVouchers && u.redeemedVouchers.length) {
      sql += `-- Insert Redeemed Vouchers for User ${u.id}\n`;
      u.redeemedVouchers.forEach(v => {
        sql += `INSERT INTO redeemed_vouchers (id, user_id, code, title, discount_type, discount_value, points_spent, redeemed_at, is_used, valid_until) VALUES `;
        sql += `(${escapeSql(v.id)}, ${escapeSql(u.id)}, ${escapeSql(v.code)}, ${escapeSql(v.title)}, ${escapeSql(v.discountType)}, ${escapeSql(v.discountValue)}, ${escapeSql(v.pointsSpent)}, ${escapeSql(v.redeemedAt)}, ${escapeSql(v.isUsed)}, ${escapeSql(v.validUntil)}) `;
        sql += `ON CONFLICT (id) DO NOTHING;\n`;
      });
      sql += `\n`;
    }

    if (u.pointTransactions && u.pointTransactions.length) {
      sql += `-- Insert Point Transactions for User ${u.id}\n`;
      u.pointTransactions.forEach(t => {
        sql += `INSERT INTO point_transactions (id, user_id, transaction_date, points, transaction_type, description) VALUES `;
        sql += `(${escapeSql(t.id)}, ${escapeSql(u.id)}, ${escapeSql(t.date)}, ${escapeSql(t.points)}, ${escapeSql(t.type)}, ${escapeSql(t.description)}) `;
        sql += `ON CONFLICT (id) DO NOTHING;\n`;
      });
      sql += `\n`;
    }
  });
}

fs.writeFileSync(sqlOutputPath, sql, 'utf8');
console.log('Successfully generated init_database.sql!');
