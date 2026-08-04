import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';

const getFilename = () => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta && import.meta.url) {
      return fileURLToPath(import.meta.url);
    }
  } catch (e) {}
  return typeof __filename !== 'undefined' ? __filename : '';
};

const currentFilename = getFilename();
const currentDirname = currentFilename ? path.dirname(currentFilename) : process.cwd();

const DB_FILE = path.join(process.cwd(), 'database.json');

const INITIAL_DB_DATA = {
  users: [
    {
      id: "usr_customer_1",
      name: "Nguyễn Thị Lan",
      email: "lan.nguyen@example.com",
      phone: "0901234567",
      role: "customer",
      isApproved: true,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80",
      rewardPoints: 320,
      redeemedVouchers: [
        {
          id: "v_welcome50",
          code: "WELCOME-LUME-50K",
          title: "Voucher Chào Mừng Khách Hàng Mới 50k",
          discountType: "amount",
          discountValue: 50000,
          pointsSpent: 0,
          redeemedAt: "2026-07-20",
          isUsed: false,
          validUntil: "2026-12-31"
        }
      ],
      pointTransactions: [
        {
          id: "tx_init_1",
          date: "2026-07-13",
          points: 200,
          type: "earn",
          description: "Tích điểm dịch vụ Cấy Tinh Chất Collagen Vàng 24K"
        },
        {
          id: "tx_init_2",
          date: "2026-07-20",
          points: 120,
          type: "earn",
          description: "Tích điểm dịch vụ Gội Đầu Dưỡng Sinh & Chăm Sóc Da"
        }
      ]
    },
    {
      id: "usr_staff_1",
      name: "KTV Mai Phương",
      email: "mai.phuong@lumespa.vn",
      phone: "0988776655",
      role: "staff",
      isApproved: true,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80",
      specialistId: "sp1"
    },
    {
      id: "usr_sales_1",
      name: "Nguyễn Văn Hải (Sales Executive)",
      email: "sales@lumespa.vn",
      phone: "0903888777",
      role: "sales",
      isApproved: true,
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&q=80"
    },
    {
      id: "usr_acc_1",
      name: "Trần Thu Hà (Trưởng Nhóm Kế Toán)",
      email: "ketoan@lumespa.vn",
      phone: "0905666555",
      role: "accountant",
      isApproved: true,
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&q=80"
    },
    {
      id: "usr_admin_1",
      name: "Quản Lý Lumé Admin",
      email: "admin@lumespa.vn",
      phone: "0911223344",
      role: "admin",
      isApproved: true,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80"
    }
  ],
  loyaltyTiers: [
    {
      id: "bronze",
      name: "Thành Viên Bronze",
      badge: "🥉",
      minPoints: 0,
      discountPercent: 0,
      benefits: [
        "Tích 1 điểm cho mỗi 10.000đ chi tiêu",
        "Nhận ưu đãi sinh nhật 50k"
      ]
    },
    {
      id: "silver",
      name: "Thành Viên Silver",
      badge: "🥈",
      minPoints: 200,
      discountPercent: 3,
      benefits: [
        "Tích điểm x1.2 nhanh hơn",
        "Giảm thêm 3% cho mọi dịch vụ",
        "Quà tặng sinh nhật 100k"
      ]
    },
    {
      id: "gold",
      name: "Thành Viên Gold",
      badge: "🥇",
      minPoints: 500,
      discountPercent: 5,
      benefits: [
        "Tích điểm x1.5",
        "Giảm thêm 5% cho mọi dịch vụ",
        "Tặng 1 buổi Gội đầu thảo dược sinh nhật",
        "Ưu tiên xếp lịch KTV VIP"
      ]
    },
    {
      id: "diamond",
      name: "Thành Viên Diamond VIP",
      badge: "💎",
      minPoints: 1000,
      discountPercent: 10,
      benefits: [
        "Tích điểm x2.0 siêu tốc",
        "Giảm thêm 10% cho tất cả dịch vụ",
        "Miễn phí Combo Spa Birthday",
        "Phục vụ phòng VIP riêng biệt"
      ]
    }
  ],
  rewardPackages: [
    {
      id: "rew_50k",
      title: "Voucher Giảm 50.000đ",
      category: "voucher",
      pointsRequired: 50,
      valueText: "Giảm 50.000đ",
      valueAmount: 50000,
      description: "Áp dụng giảm trực tiếp trên tổng hóa đơn đặt lịch bất kỳ tại Lumé Spa.",
      icon: "🎟️"
    },
    {
      id: "rew_herbal",
      title: "Gói Gội Đầu Dưỡng Sinh Thảo Dược 0đ",
      category: "free_service",
      pointsRequired: 150,
      valueText: "Miễn phí 100% (250.000đ)",
      valueAmount: 250000,
      serviceTitle: "Gội Đầu Dưỡng Sinh Thảo Dược Lumé",
      description: "Nấu bồ kết tươi, sả, vỏ bưởi nguyên chất + Massage đầu cổ vai gáy 60 phút.",
      icon: "🌿",
      popular: true
    },
    {
      id: "rew_150k",
      title: "Voucher Giảm 150.000đ",
      category: "voucher",
      pointsRequired: 200,
      valueText: "Giảm 150.000đ",
      valueAmount: 150000,
      description: "Áp dụng cho hóa đơn dịch vụ chăm sóc da & body từ 400.000đ trở lên.",
      icon: "🏷️",
      minSpend: 400000
    },
    {
      id: "rew_massage",
      title: "Gói Massage Cổ Vai Gáy Chuyên Sâu 0đ",
      category: "free_service",
      pointsRequired: 250,
      valueText: "Miễn phí 100% (350.000đ)",
      valueAmount: 350000,
      serviceTitle: "Massage Cổ Vai Gáy Chuyên Sâu",
      description: "Ấn huyệt chuyên sâu giải tỏa nhức mỏi, chườm đá nóng Himalaya trị liệu.",
      icon: "💆",
      popular: true
    },
    {
      id: "rew_gold24k",
      title: "Gói Cấy Tinh Chất Collagen & Vàng 24K 0đ",
      category: "free_service",
      pointsRequired: 500,
      valueText: "Miễn phí 100% (650.000đ)",
      valueAmount: 650000,
      serviceTitle: "Cấy Tinh Chất Collagen & Vàng 24K",
      description: "Điện di ion tinh chất vàng 24K nano giúp da căng bóng, chống lão hóa & mờ nếp nhăn.",
      icon: "👑",
      popular: true
    }
  ],
  services: [
    {
      id: "spa-body-relax",
      category: "spa",
      title: "Massage Body Thư Giãn Tinh Dầu",
      price: 350000,
      originalPrice: 450000,
      duration: 60,
      icon: "🪷",
      popular: true
    },
    {
      id: "spa-hot-stone",
      category: "spa",
      title: "Massage Đá Nóng Năng Lượng Núi Lửa",
      price: 480000,
      originalPrice: 580000,
      duration: 75,
      icon: "🔥",
      popular: true
    },
    {
      id: "spa-herbal-shampoo",
      category: "spa",
      title: "Gội Đầu Dưỡng Sinh Thảo Dược Lumé",
      price: 250000,
      originalPrice: 320000,
      duration: 60,
      icon: "🌿",
      popular: true
    },
    {
      id: "facial-deep-clean",
      category: "facial",
      title: "Chăm Sóc Da Mặt Chuyên SDeep Cleansing",
      price: 390000,
      originalPrice: 500000,
      duration: 60,
      icon: "✨",
      popular: true
    },
    {
      id: "facial-collagen-glow",
      category: "facial",
      title: "Cấy Tinh Chất Collagen & Vàng 24K",
      price: 650000,
      originalPrice: 850000,
      duration: 75,
      icon: "💎",
      popular: true
    },
    {
      id: "nail-[#1]",
      category: "nail",
      title: "Chăm Sóc Móng & Sơn Gel Cao Cấp",
      price: 180000,
      originalPrice: 250000,
      duration: 45,
      icon: "💅",
      popular: true
    },
    {
      id: "nail-foot-care",
      category: "nail",
      title: "Chà Gót Hồng & Chăm Sóc Móng Chân",
      price: 220000,
      originalPrice: 300000,
      duration: 50,
      icon: "🦶",
      popular: false
    },
    {
      id: "hair-wash-style",
      category: "hair",
      title: "Gội Đầu Thảo Dược & Sấy Tạo Kiểu",
      price: 120000,
      originalPrice: 180000,
      duration: 35,
      icon: "✂️",
      popular: false
    }
  ],
  productsCatalog: [
    {
      id: "prod-hair-serum-grapefruit",
      category: "hair",
      title: "Serum Tinh Dầu Bưởi & Bồ Kết Tóc Dày Bồng Bềnh",
      subtitle: "Nuôi dưỡng nang tóc, giảm gãy rụng & kích thích mọc tóc con",
      price: 290000,
      originalPrice: 380000,
      duration: 0,
      stockQuantity: 45,
      icon: "🧴",
      description: "Chiết xuất 100% tinh dầu vỏ bưởi da xanh ép lạnh kết hợp cô đặc bồ kết nướng.",
      image: "https://images.unsplash.com/photo-1608248597262-838d12328827?auto=format&fit=crop&w=800&q=80",
      popular: true,
      benefits: ["Ngăn ngừa gãy rụng tóc", "Kích thích mọc tóc nhanh", "Mùi hương thảo mộc thư giãn"]
    },
    {
      id: "prod-facial-serum-ha",
      category: "facial",
      title: "Tinh Chất Serum HA Multi-Hydrating Căng Bóng Da",
      subtitle: "Cấp ẩm đa tầng, phục hồi hàng rào bảo vệ da căng mướt",
      price: 450000,
      originalPrice: 590000,
      duration: 0,
      stockQuantity: 30,
      icon: "💧",
      description: "Công thức ngậm nước Hyaluronic Acid 5 phân tử giúp da căng mọng ngay sau lần dùng đầu tiên.",
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
      popular: true,
      benefits: ["Cấp ẩm chuyên sâu 24h", "Tái tạo da mịn màng", "Phù hợp da nhạy cảm"]
    },
    {
      id: "prod-body-oil-lavender",
      category: "spa",
      title: "Dầu Massage Body Tinh Chất Hoa Oải Hương Lavender",
      subtitle: "Thư giãn thần kinh, giảm căng thẳng & dưỡng ẩm da toàn thân",
      price: 320000,
      originalPrice: 420000,
      duration: 0,
      stockQuantity: 60,
      icon: "🪻",
      description: "Dầu jojoba hữu cơ kết hợp tinh dầu Lavender Pháp giúp xua tan mệt mỏi.",
      image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80",
      popular: true,
      benefits: ["Giúp ngủ ngon sâu giấc", "Mềm mịn da body", "Không rít bết dính"]
    },
    {
      id: "prod-nail-cuticle-oil",
      category: "nail",
      title: "Tinh Dầu Dưỡng Viền Móng & Phục Hồi Móng Chắc Khỏe",
      subtitle: "Cung cấp Vitamin E & Keratin nuôi dưỡng móng sáng bóng",
      price: 150000,
      originalPrice: 200000,
      duration: 0,
      stockQuantity: 80,
      icon: "💅",
      description: "Chứa tinh dầu hạnh nhân và hạt argan bảo vệ móng sau khi làm nail.",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      popular: false,
      benefits: ["Chống giòn gãy móng", "Làm mềm xước măng rô", "Hương hoa quả ngọt dịu"]
    }
  ],
  specialists: [
    {
      id: "sp1",
      name: "KTV Mai Phương",
      title: "Chuyên Gia Spa & Massage Body",
      experience: "6 năm kinh nghiệm",
      rating: 4.9,
      totalReviews: 328,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80"
    },
    {
      id: "sp2",
      name: "KTV Thu Hà",
      title: "Chuyên Viên Chăm Sóc Da Facial",
      experience: "5 năm kinh nghiệm",
      rating: 4.95,
      totalReviews: 412,
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80"
    },
    {
      id: "sp3",
      name: "KTV Linh Chi",
      title: "Master Nail Art & Chăm Sóc Móng",
      experience: "4 năm kinh nghiệm",
      rating: 4.88,
      totalReviews: 256,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80"
    }
  ],
  appointments: [
    {
      id: "LUME-8821",
      userId: "usr_customer_1",
      customerName: "Nguyễn Thị Lan",
      customerPhone: "0901234567",
      customerEmail: "lan.nguyen@example.com",
      date: new Date().toISOString().split('T')[0],
      timeSlot: "14:30",
      branch: "Chi nhánh Quận 1: 128 Nguyễn Trãi, P. Bến Thành, Q.1",
      selectedServices: [
        {
          id: "spa-herbal-shampoo",
          category: "spa",
          title: "Gội Đầu Dưỡng Sinh Thảo Dược Lumé",
          price: 250000,
          duration: 60,
          icon: "🌿"
        }
      ],
      specialistId: "sp1",
      specialistName: "KTV Mai Phương",
      status: "confirmed",
      totalPrice: 250000,
      discountAmount: 50000,
      finalPrice: 200000,
      createdAt: new Date().toISOString()
    }
  ],
  productOrders: [
    {
      id: "ORD-9910",
      customerName: "Phạm Hồng Nhung",
      customerPhone: "0933444555",
      customerEmail: "nhung.pham@gmail.com",
      shippingAddress: "78 Nguyễn Thị Minh Khai, Q.1, TP. Hồ Chí Minh",
      items: [
        {
          id: "prod-hair-serum-grapefruit",
          title: "Serum Tinh Dầu Bưởi & Bồ Kết Tóc Dày Bồng Bềnh",
          price: 290000,
          quantity: 2,
          image: "https://images.unsplash.com/photo-1608248597262-838d12328827?auto=format&fit=crop&w=800&q=80"
        }
      ],
      subtotal: 580000,
      shippingFee: 20000,
      discountAmount: 0,
      finalPrice: 600000,
      paymentMethod: "cod",
      paymentStatus: "unpaid",
      notes: "Khách muốn kiểm tra hàng trước khi thanh toán COD.",
      status: "pending_confirmation",
      createdAt: new Date().toISOString()
    }
  ],
  reviews: [
    {
      id: "rev_1",
      customerName: "Bessie Cooper",
      role: "Khách hàng VIP",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
      title: "The Best Thing I've Used For My Skin!",
      comment: "Lumé Spa thực sự là chốn bình yên yêu thích của tôi sau những tuần làm việc căng thẳng. Liệu trình cấy Collagen Vàng 24K giúp làn da căng bóng và khỏe mạnh rõ rệt chỉ sau 1 buổi!",
      rating: 5,
      serviceName: "Cấy Tinh Chất Collagen & Vàng 24K",
      date: "2026-07-20",
      verified: true,
      status: "approved"
    },
    {
      id: "rev_2",
      customerName: "Thanh Vân",
      role: "Khách hàng Thân thiết",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
      title: "Gội Đầu Dưỡng Sinh & Massage Tuyệt Mới!",
      comment: "Tay nghề kỹ thuật viên rất êm ái và nhẹ nhàng, mùi bồ kết sả chanh tự nhiên lưu lại cả ngày. Phòng Spa thơm ngát tinh dầu mang lại cảm giác cực kỳ thư thái.",
      rating: 5,
      serviceName: "Gội Đầu Dưỡng Sinh Thảo Dược Lumé",
      date: "2026-07-22",
      verified: true,
      status: "approved"
    },
    {
      id: "rev_3",
      customerName: "Minh Trí & Phương Thảo",
      role: "Khách hàng Đôi",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80",
      title: "Nail Art Vẽ Tay Đẹp Mắt & Bền Bỉ",
      comment: "Sơn gel cao cấp không hề bị bong tróc dù mình hay làm việc nhà. Thiết kế mẫu móng đính đá vô cùng chỉn chu và đúng ý thích của mình!",
      rating: 5,
      serviceName: "Chăm Sóc Móng & Sơn Gel Cao Cấp",
      date: "2026-07-25",
      verified: true,
      status: "approved"
    }
  ],
  newArrivals: [],
  instaPhotos: [],
  servicesCatalog: []
};

async function readDatabase() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      await writeDatabase(INITIAL_DB_DATA);
      return INITIAL_DB_DATA;
    }
    const raw = await fs.promises.readFile(DB_FILE, 'utf-8');
    if (!raw || !raw.trim()) {
      await writeDatabase(INITIAL_DB_DATA);
      return INITIAL_DB_DATA;
    }
    const parsed = JSON.parse(raw);
    return {
      users: parsed.users || INITIAL_DB_DATA.users,
      loyaltyTiers: parsed.loyaltyTiers || INITIAL_DB_DATA.loyaltyTiers,
      rewardPackages: parsed.rewardPackages || INITIAL_DB_DATA.rewardPackages,
      services: parsed.services || INITIAL_DB_DATA.services,
      productsCatalog: parsed.productsCatalog || INITIAL_DB_DATA.productsCatalog,
      specialists: parsed.specialists || INITIAL_DB_DATA.specialists,
      appointments: parsed.appointments || INITIAL_DB_DATA.appointments,
      productOrders: parsed.productOrders || INITIAL_DB_DATA.productOrders,
      reviews: parsed.reviews || INITIAL_DB_DATA.reviews,
      newArrivals: parsed.newArrivals || [],
      instaPhotos: parsed.instaPhotos || [],
    };
  } catch (err) {
    console.error('[DB READ ERROR - Restoring initial data]', err);
    try {
      await writeDatabase(INITIAL_DB_DATA);
    } catch (writeErr) {
      console.error('[DB RESTORE WRITE ERROR]', writeErr);
    }
    return INITIAL_DB_DATA;
  }
}

async function writeDatabase(data: any) {
  const tmpFile = `${DB_FILE}.${Date.now()}.${Math.random().toString(36).substring(2)}.tmp`;
  try {
    const jsonStr = JSON.stringify(data, null, 2);
    await fs.promises.writeFile(tmpFile, jsonStr, 'utf-8');
    await fs.promises.rename(tmpFile, DB_FILE);
  } catch (err) {
    console.error('[DB WRITE ERROR]', err);
    if (fs.existsSync(tmpFile)) {
      try {
        await fs.promises.unlink(tmpFile);
      } catch (e) {}
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // DATABASE REST API ROUTES
  
  // Get full database state
  app.get('/api/database', async (req, res) => {
    const db = await readDatabase();
    res.json({ success: true, db });
  });

  // Reset database tables to initial seed data
  app.post('/api/database/reset', async (req, res) => {
    await writeDatabase(INITIAL_DB_DATA);
    res.json({ success: true, db: INITIAL_DB_DATA, message: 'Khôi phục cơ sở dữ liệu về mặc định ban đầu thành công!' });
  });

  // Add Appointment to database table
  app.post('/api/appointments', async (req, res) => {
    try {
      const { appointment } = req.body;
      if (!appointment) return res.status(400).json({ error: 'Missing appointment payload' });

      const db = await readDatabase();
      db.appointments = [appointment, ...db.appointments.filter((a: any) => a.id !== appointment.id)];
      await writeDatabase(db);
      res.json({ success: true, appointment });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update Appointment in database table
  app.put('/api/appointments/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const db = await readDatabase();

      let updatedItem = null;
      db.appointments = db.appointments.map((a: any) => {
        if (a.id === id) {
          updatedItem = { ...a, ...updates };
          return updatedItem;
        }
        return a;
      });

      await writeDatabase(db);
      res.json({ success: true, appointment: updatedItem });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Add Product Order to database table & update stock
  app.post('/api/orders', async (req, res) => {
    try {
      const { order } = req.body;
      if (!order) return res.status(400).json({ error: 'Missing order payload' });

      const db = await readDatabase();
      db.productOrders = [order, ...db.productOrders.filter((o: any) => o.id !== order.id)];

      // Deduct product stock in productsCatalog table
      if (order.items && Array.isArray(order.items)) {
        db.productsCatalog = db.productsCatalog.map((p: any) => {
          const item = order.items.find((it: any) => it.id === p.id);
          if (item) {
            const currentStock = p.stockQuantity ?? 50;
            return { ...p, stockQuantity: Math.max(0, currentStock - item.quantity) };
          }
          return p;
        });
      }

      await writeDatabase(db);
      res.json({ success: true, order });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update Product Order status in database table
  app.put('/api/orders/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const db = await readDatabase();

      let updatedItem = null;
      db.productOrders = db.productOrders.map((o: any) => {
        if (o.id === id) {
          updatedItem = { ...o, ...updates };
          return updatedItem;
        }
        return o;
      });

      await writeDatabase(db);
      res.json({ success: true, order: updatedItem });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Add Product to database productsCatalog table
  app.post('/api/products', async (req, res) => {
    try {
      const { product } = req.body;
      if (!product) return res.status(400).json({ error: 'Missing product payload' });

      const db = await readDatabase();
      db.productsCatalog = [product, ...db.productsCatalog.filter((p: any) => p.id !== product.id)];
      await writeDatabase(db);
      res.json({ success: true, product });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update Product / Stock in database
  app.put('/api/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const db = await readDatabase();

      let updatedItem = null;
      db.productsCatalog = db.productsCatalog.map((p: any) => {
        if (p.id === id) {
          updatedItem = { ...p, ...updates };
          return updatedItem;
        }
        return p;
      });

      await writeDatabase(db);
      res.json({ success: true, product: updatedItem });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete Product from database
  app.delete('/api/products/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const db = await readDatabase();
      db.productsCatalog = db.productsCatalog.filter((p: any) => p.id !== id);
      await writeDatabase(db);
      res.json({ success: true, deletedId: id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // SERVICES API ENDPOINTS
  app.get('/api/services', async (req, res) => {
    try {
      const db = await readDatabase();
      res.json({ success: true, services: db.services || [] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/services', async (req, res) => {
    try {
      const { service } = req.body;
      if (!service) return res.status(400).json({ error: 'Missing service payload' });

      const db = await readDatabase();
      db.services = [service, ...(db.services || []).filter((s: any) => s.id !== service.id)];
      await writeDatabase(db);
      res.json({ success: true, service });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/services/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const db = await readDatabase();

      let updatedService = null;
      db.services = (db.services || []).map((s: any) => {
        if (s.id === id) {
          updatedService = { ...s, ...updates };
          return updatedService;
        }
        return s;
      });

      await writeDatabase(db);
      res.json({ success: true, service: updatedService });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/services/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const db = await readDatabase();
      db.services = (db.services || []).filter((s: any) => s.id !== id);
      await writeDatabase(db);
      res.json({ success: true, deletedId: id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // REVIEWS API ENDPOINTS
  app.get('/api/reviews', async (req, res) => {
    try {
      const db = await readDatabase();
      res.json({ success: true, reviews: db.reviews || [] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/reviews', async (req, res) => {
    try {
      const { review } = req.body;
      if (!review) return res.status(400).json({ error: 'Missing review payload' });

      const db = await readDatabase();
      db.reviews = [review, ...(db.reviews || []).filter((r: any) => r.id !== review.id)];
      await writeDatabase(db);
      res.json({ success: true, review });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/reviews/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const db = await readDatabase();

      let updatedReview = null;
      db.reviews = (db.reviews || []).map((r: any) => {
        if (r.id === id) {
          updatedReview = { ...r, ...updates };
          return updatedReview;
        }
        return r;
      });

      await writeDatabase(db);
      res.json({ success: true, review: updatedReview });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/reviews/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const db = await readDatabase();
      db.reviews = (db.reviews || []).filter((r: any) => r.id !== id);
      await writeDatabase(db);
      res.json({ success: true, deletedId: id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // NEW ARRIVALS API ENDPOINTS
  app.get('/api/new-arrivals', async (req, res) => {
    try {
      const db = await readDatabase();
      res.json({ success: true, newArrivals: db.newArrivals || [] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/new-arrivals', async (req, res) => {
    try {
      const { item } = req.body;
      if (!item) return res.status(400).json({ error: 'Missing item payload' });

      const db = await readDatabase();
      db.newArrivals = [item, ...(db.newArrivals || []).filter((a: any) => a.id !== item.id)];
      await writeDatabase(db);
      res.json({ success: true, item });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/new-arrivals/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const db = await readDatabase();

      let updatedItem = null;
      db.newArrivals = (db.newArrivals || []).map((a: any) => {
        if (a.id === id) {
          updatedItem = { ...a, ...updates };
          return updatedItem;
        }
        return a;
      });

      await writeDatabase(db);
      res.json({ success: true, item: updatedItem });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/new-arrivals/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const db = await readDatabase();
      db.newArrivals = (db.newArrivals || []).filter((a: any) => a.id !== id);
      await writeDatabase(db);
      res.json({ success: true, deletedId: id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // INSTAGRAM PHOTOS API ENDPOINTS
  app.get('/api/insta-photos', async (req, res) => {
    try {
      const db = await readDatabase();
      res.json({ success: true, instaPhotos: db.instaPhotos || [] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/insta-photos', async (req, res) => {
    try {
      const { photo } = req.body;
      if (!photo) return res.status(400).json({ error: 'Missing photo payload' });

      const db = await readDatabase();
      db.instaPhotos = [photo, ...(db.instaPhotos || []).filter((p: any) => p.id !== photo.id)];
      await writeDatabase(db);
      res.json({ success: true, photo });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/insta-photos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const db = await readDatabase();
      db.instaPhotos = (db.instaPhotos || []).filter((p: any) => p.id !== id);
      await writeDatabase(db);
      res.json({ success: true, deletedId: id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get Users list
  app.get('/api/users', async (req, res) => {
    try {
      const db = await readDatabase();
      res.json({ success: true, users: db.users || [] });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Create User
  app.post('/api/users', async (req, res) => {
    try {
      const { user } = req.body;
      if (!user) return res.status(400).json({ error: 'Missing user payload' });

      const db = await readDatabase();
      db.users = [user, ...(db.users || []).filter((u: any) => u.id !== user.id && u.email !== user.email)];
      await writeDatabase(db);
      res.json({ success: true, user });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Update User in database
  app.put('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { user } = req.body;
      const db = await readDatabase();

      if (user) {
        db.users = [user, ...(db.users || []).filter((u: any) => u.id !== id)];
      } else {
        const updates = req.body;
        db.users = (db.users || []).map((u: any) => u.id === id ? { ...u, ...updates } : u);
      }
      await writeDatabase(db);
      res.json({ success: true, user });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete User
  app.delete('/api/users/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const db = await readDatabase();
      db.users = (db.users || []).filter((u: any) => u.id !== id);
      await writeDatabase(db);
      res.json({ success: true, deletedId: id });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Cache Ethereal test account if using test mode
  let testAccount: nodemailer.TestAccount | null = null;

  async function getTransporter() {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;

    if (host && user && pass) {
      return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
    }

    // Fallback to Ethereal account or mock stream for testing & instant preview
    if (!testAccount) {
      try {
        testAccount = await nodemailer.createTestAccount();
      } catch (err) {
        console.warn('[EMAIL WARNING] Could not create Ethereal test account, using direct mock transport', err);
        return nodemailer.createTransport({
          jsonTransport: true,
        });
      }
    }

    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }

  // API Route: Send Email Confirmation
  app.post('/api/send-email', async (req, res) => {
    try {
      const { to, appointment } = req.body;

      if (!to || !appointment) {
        return res.status(400).json({ error: 'Missing required parameters (to, appointment)' });
      }

      const transporter = await getTransporter();
      const fromAddress = process.env.SMTP_FROM || 'Lumé Beauty & Spa <xacnhan@lumespa.vn>';

      const servicesHtml = (appointment.selectedServices || [])
        .map(
          (s: any) =>
            `<tr style="border-bottom: 1px solid #f0e6dc;">
              <td style="padding: 10px 0; font-[#3a2f2a]; font-[#3a2f2a]; font-size: 14px;">${s.title} (${s.duration} phút)</td>
              <td style="padding: 10px 0; text-align: right; font-weight: bold; font-size: 14px; color: #b08d4f;">${new Intl.NumberFormat('vi-VN').format(s.price)}đ</td>
            </tr>`
        )
        .join('');

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Xác Nhận Lịch Hẹn Lumé Spa</title>
        </head>
        <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7f1eb; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #e2d7cb; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            
            <!-- Header -->
            <div style="background-color: #3a2f2a; padding: 30px; text-align: center;">
              <h1 style="color: #c9a86c; margin: 0; font-size: 26px; letter-spacing: 2px; text-transform: uppercase;">LUMÉ BEAUTY & SPA</h1>
              <p style="color: #ebe3d9; font-size: 13px; margin-top: 5px; font-style: italic;">Tỏa Sáng Vẻ Đẹp Tự Nhiên</p>
            </div>

            <!-- Content -->
            <div style="padding: 30px; color: #3a2f2a;">
              <h2 style="font-size: 18px; margin-top: 0; color: #3a2f2a;">Xin chào, ${appointment.customerName}!</h2>
              <p style="font-size: 14px; color: #6b5c54; line-height: 1.6;">
                Cảm ơn bạn đã lựa chọn dịch vụ chăm sóc sắc đẹp tại <strong>Lumé Beauty & Spa</strong>. Dưới đây là thông tin chi tiết vé xác nhận đặt lịch hẹn của bạn:
              </p>

              <!-- Ticket Box -->
              <div style="background-color: #faf6f2; border: 1px dashed #c9a86c; border-radius: 16px; padding: 20px; margin: 25px 0;">
                <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #e8dfd5; padding-bottom: 12px; margin-bottom: 15px;">
                  <div>
                    <span style="font-size: 11px; font-weight: bold; color: #c9a86c; text-transform: uppercase;">MÃ ĐẶT LỊCH</span><br>
                    <span style="font-family: monospace; font-size: 20px; font-weight: bold; color: #3a2f2a;">#${appointment.id}</span>
                  </div>
                  <div style="text-align: right;">
                    <span style="display: inline-block; background-color: #d1fae5; color: #065f46; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 20px;">
                      ĐÃ XÁC NHẬN
                    </span>
                  </div>
                </div>

                <table style="width: 100%; font-size: 13px; color: #3a2f2a; margin-bottom: 15px;" cellpadding="6">
                  <tr>
                    <td style="color: #6b5c54; width: 35%;"><strong>Ngày hẹn:</strong></td>
                    <td><strong>${appointment.date}</strong></td>
                  </tr>
                  <tr>
                    <td style="color: #6b5c54;"><strong>Khung giờ:</strong></td>
                    <td><strong>${appointment.timeSlot}</strong></td>
                  </tr>
                  <tr>
                    <td style="color: #6b5c54;"><strong>Chi nhánh:</strong></td>
                    <td>${appointment.branch}</td>
                  </tr>
                  <tr>
                    <td style="color: #6b5c54;"><strong>KTV / Chuyên gia:</strong></td>
                    <td>${appointment.specialistName}</td>
                  </tr>
                  <tr>
                    <td style="color: #6b5c54;"><strong>Số điện thoại:</strong></td>
                    <td>${appointment.customerPhone}</td>
                  </tr>
                </table>

                <div style="border-top: 1px solid #e8dfd5; pt: 15px; margin-top: 15px;">
                  <strong style="font-size: 13px; color: #3a2f2a; display: block; margin-bottom: 8px;">Dịch vụ đã chọn:</strong>
                  <table style="width: 100%; border-collapse: collapse;">
                    ${servicesHtml}
                  </table>
                  <div style="text-align: right; margin-top: 15px; font-size: 16px; font-weight: bold; color: #b08d4f;">
                    Tổng tiền: ${new Intl.NumberFormat('vi-VN').format(appointment.finalPrice)}đ
                  </div>
                </div>
              </div>

              <!-- Important Notes -->
              <div style="background-color: #f7f1eb; border-radius: 12px; padding: 15px; font-size: 12px; color: #6b5c54; line-height: 1.5;">
                <strong style="color: #3a2f2a;">Lưu ý khi đến Spa:</strong>
                <ul style="margin: 5px 0 0 0; padding-left: 20px;">
                  <li>Vui lòng đến trước giờ hẹn 10 phút để được đón tiếp chu đáo nhất.</li>
                  <li>Nếu có nhu cầu đổi giờ hoặc thay đổi thông tin, quý khách có thể tra cứu lịch trên website hoặc liên hệ hotline.</li>
                </ul>
              </div>

              <!-- Signature -->
              <p style="font-size: 13px; color: #6b5c54; margin-top: 30px; line-height: 1.6;">
                Trân trọng,<br>
                <strong>Đội ngũ Lumé Beauty & Spa</strong><br>
                Hotline: 0901 234 567
              </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f0e6dc; padding: 15px; text-align: center; font-size: 11px; color: #8c7b70;">
              © ${new Date().getFullYear()} Lumé Beauty & Spa. All rights reserved.
            </div>
          </div>
        </body>
        </html>
      `;

      const info = await transporter.sendMail({
        from: fromAddress,
        to,
        subject: `[LUMÉ SPA] Xác Nhận Lịch Hẹn Thành Công #${appointment.id}`,
        html: htmlContent,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);

      console.log(`[EMAIL DISPATCH] Sent email to ${to}. MessageId: ${info.messageId}`);
      if (previewUrl) {
        console.log(`[EMAIL TEST PREVIEW] ${previewUrl}`);
      }

      return res.json({
        success: true,
        messageId: info.messageId,
        previewUrl: previewUrl || null,
        recipient: to,
      });
    } catch (err: any) {
      console.error('[EMAIL ERROR]', err);
      return res.status(500).json({
        error: 'Lỗi khi gửi email xác nhận',
        details: err?.message || String(err),
      });
    }
  });

  // Vite Middleware in Dev Mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
