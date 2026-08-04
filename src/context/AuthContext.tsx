import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Appointment, RedeemedVoucher, PointTransaction, ProductOrder, OrderStatus, ServiceItem, Review } from '../types';
import { SERVICES_DATA } from '../data/servicesData';
import { RewardPackage } from '../data/rewardsData';

export interface InstaPhotoItem {
  id: string;
  url: string;
  caption?: string;
}

export type NewArrivalItem = ServiceItem & {
  discountTag?: string;
  rating?: number;
  reviewCount?: number;
};

export const INITIAL_NEW_ARRIVALS: NewArrivalItem[] = [
  {
    id: 'aquafresh-wellness',
    category: 'facial',
    title: 'Aquafresh Wellness Serum',
    subtitle: 'Tinh chất cấp nước khóa ẩm 72h',
    price: 350000,
    originalPrice: 700000,
    duration: 0,
    itemType: 'product',
    icon: '💧',
    description: 'Cấp ẩm tức thì cho da khô mệt mỏi, tái tạo lớp màng lipid bảo vệ da.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80',
    discountTag: '50% Off',
    rating: 4.9,
    reviewCount: 64,
  },
  {
    id: 'velvet-rose',
    category: 'facial',
    title: 'Velvet Rose Elixir',
    subtitle: 'Dầu dưỡng hoa hồng nhung trắng da',
    price: 450000,
    originalPrice: 900000,
    duration: 0,
    itemType: 'product',
    icon: '🌹',
    description: 'Chống oxy hóa mạnh mẽ, xua tan sắc tố sẫm màu mang lại làn da trắng hồng.',
    image: 'https://th.bing.com/th/id/OIP.Dau8hngwWSNnUeB5t6Z-lwHaJ2?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3',
    discountTag: '50% Off',
    rating: 5.0,
    reviewCount: 89,
  },
  {
    id: 'herbal-haven',
    category: 'spa',
    title: 'Herbal Haven Body Oil',
    subtitle: 'Dầu thảo dược trị liệu nhức mỏi',
    price: 280000,
    originalPrice: 560000,
    duration: 0,
    itemType: 'product',
    icon: '🌿',
    description: 'Ấn huyệt trị liệu xua tan mệt mỏi cơ khớp, lưu thông khí huyết tốt.',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&q=80',
    discountTag: '50% Off',
    rating: 4.8,
    reviewCount: 42,
  },
  {
    id: 'marine-collagen-mask',
    category: 'facial',
    title: 'Marine Collagen Hydrogel Mask',
    subtitle: 'Mặt nạ Collagen biển phục hồi màng da',
    price: 320000,
    originalPrice: 640000,
    duration: 0,
    itemType: 'product',
    icon: '🌊',
    description: 'Giàu vi khoáng biển khôi phục độ đàn hồi và tươi trẻ tự nhiên.',
    image: 'https://tse3.mm.bing.net/th/id/OIP.h6Iow8BSh99AthTNIwMkVgHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    discountTag: '50% Off',
    rating: 4.85,
    reviewCount: 93,
  },
];

export const INITIAL_INSTA_PHOTOS: InstaPhotoItem[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80' },
  { id: '2', url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80' },
  { id: '3', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80' },
  { id: '4', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80' },
  { id: '5', url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80' },
  { id: '6', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80' },
  { id: '7', url: 'https://i.pinimg.com/originals/53/bf/fc/53bffc774772840dc0992d589e3e6e60.jpg' },
  { id: '8', url: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=400&q=80' },
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    customerName: 'Bessie Cooper',
    role: 'Khách hàng VIP',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
    title: "The Best Thing I've Used For My Skin!",
    comment: 'Lumé Spa thực sự là chốn bình yên yêu thích của tôi sau những tuần làm việc căng thẳng. Liệu trình cấy Collagen Vàng 24K giúp làn da căng bóng và khỏe mạnh rõ rệt chỉ sau 1 buổi!',
    rating: 5,
    serviceName: 'Cấy Tinh Chất Collagen & Vàng 24K',
    date: '2026-07-20',
    verified: true,
    status: 'approved',
  },
  {
    id: 'rev_2',
    customerName: 'Thanh Vân',
    role: 'Khách hàng Thân thiết',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
    title: 'Gội Đầu Dưỡng Sinh & Massage Tuyệt Mới!',
    comment: 'Tay nghề kỹ thuật viên rất êm ái và nhẹ nhàng, mùi bồ kết sả chanh tự nhiên lưu lại cả ngày. Phòng Spa thơm ngát tinh dầu mang lại cảm giác cực kỳ thư thái.',
    rating: 5,
    serviceName: 'Gội Đầu Dưỡng Sinh Thảo Dược Lumé',
    date: '2026-07-22',
    verified: true,
    status: 'approved',
  },
  {
    id: 'rev_3',
    customerName: 'Minh Trí & Phương Thảo',
    role: 'Khách hàng Đôi',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80',
    title: 'Nail Art Vẽ Tay Đẹp Mắt & Bền Bỉ',
    comment: 'Sơn gel cao cấp không hề bị bong tróc dù mình hay làm việc nhà. Thiết kế mẫu móng đính đá vô cùng chỉn chu và đúng ý thích của mình!',
    rating: 5,
    serviceName: 'Chăm Sóc Móng & Sơn Gel Cao Cấp',
    date: '2026-07-25',
    verified: true,
    status: 'approved',
  },
];

// Initial default physical products from catalog
const INITIAL_PRODUCTS_CATALOG: ServiceItem[] = SERVICES_DATA.filter(
  item => item.itemType === 'product' || item.duration === 0
).map(p => ({
  ...p,
  stockQuantity: p.stockQuantity ?? 50
}));

// Demo Preset Accounts for easy role testing
export const DEMO_USERS: Record<UserRole, User> = {
  customer: {
    id: 'usr_cust_1',
    name: 'Nguyễn Thị Lan',
    email: 'lan.nguyen@gmail.com',
    phone: '0901234567',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
    rewardPoints: 320, // Initial balance for instant testing & redeeming!
    redeemedVouchers: [
      {
        id: 'v_welcome50',
        code: 'WELCOME-LUME-50K',
        title: 'Voucher Chào Mừng Khách Hàng Mới 50k',
        discountType: 'amount',
        discountValue: 50000,
        pointsSpent: 0,
        redeemedAt: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
        isUsed: false,
        validUntil: '2026-12-31',
      },
    ],
    pointTransactions: [
      {
        id: 'tx_init_1',
        date: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
        points: 200,
        type: 'earn',
        description: 'Tích điểm dịch vụ Cấy Tinh Chất Collagen Vàng 24K',
      },
      {
        id: 'tx_init_2',
        date: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
        points: 120,
        type: 'earn',
        description: 'Tích điểm dịch vụ Gội Đầu Dưỡng Sinh & Chăm Sóc Da',
      },
    ],
  },
  staff: {
    id: 'usr_staff_1',
    name: 'Mai Phương',
    email: 'mai.phuong@lumespa.vn',
    phone: '0902111222',
    role: 'staff',
    specialistId: 'sp1',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80',
  },
  sales: {
    id: 'usr_sales_1',
    name: 'Nguyễn Văn Hải (Sales Executive)',
    email: 'sales@lumespa.vn',
    phone: '0903888777',
    role: 'sales',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&q=80',
  },
  accountant: {
    id: 'usr_acc_1',
    name: 'Trần Thu Hà (Trưởng Nhóm Kế Toán)',
    email: 'ketoan@lumespa.vn',
    phone: '0905666555',
    role: 'accountant',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&q=80',
  },
  admin: {
    id: 'usr_admin_1',
    name: 'Ban Quản Lý Lumé',
    email: 'admin@lumespa.vn',
    phone: '0909999888',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80',
  }
};

// Initial Sample Appointments for demonstration
const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'LUME-8821',
    userId: 'usr_cust_1',
    customerName: 'Nguyễn Thị Lan',
    customerPhone: '0901234567',
    customerEmail: 'lan.nguyen@gmail.com',
    selectedServices: [SERVICES_DATA[0], SERVICES_DATA[2]],
    specialistId: 'sp1',
    specialistName: 'Mai Phương',
    date: new Date().toISOString().split('T')[0], // Today
    timeSlot: '14:00',
    totalPrice: 1040000,
    discountAmount: 100000,
    finalPrice: 940000,
    promoCode: 'LUMEVIP100',
    notes: 'Khách thích phòng yên tĩnh, da khô nhạy cảm.',
    status: 'confirmed',
    paymentStatus: 'paid',
    paymentMethod: 'momo',
    invoiceIssued: true,
    invoiceCode: 'HDGTGT-8821',
    createdAt: new Date().toISOString(),
    branch: 'Chi nhánh 1 (123 Nguyễn Huệ, Q.1)',
    salesPersonName: 'Nguyễn Văn Hải',
    accountantName: 'Trần Thu Hà'
  },
  {
    id: 'LUME-8822',
    customerName: 'Trần Minh Anh',
    customerPhone: '0988777666',
    customerEmail: 'minhanh@gmail.com',
    selectedServices: [SERVICES_DATA[1]],
    specialistId: 'sp1',
    specialistName: 'Mai Phương',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '15:30',
    totalPrice: 480000,
    discountAmount: 0,
    finalPrice: 480000,
    notes: 'Sơn gel màu pastel hồng nhẹ.',
    status: 'in_progress',
    paymentStatus: 'unpaid',
    paymentMethod: 'cash',
    createdAt: new Date().toISOString(),
    branch: 'Chi nhánh 1 (123 Nguyễn Huệ, Q.1)',
    salesPersonName: 'Nguyễn Văn Hải'
  },
  {
    id: 'LUME-8823',
    customerName: 'Lê Hoàng Nam',
    customerPhone: '0912345999',
    customerEmail: 'nam.le@gmail.com',
    selectedServices: [SERVICES_DATA[3]],
    specialistId: 'sp3',
    specialistName: 'Bảo Ngọc',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '10:00',
    totalPrice: 450000,
    discountAmount: 50000,
    finalPrice: 400000,
    status: 'pending_confirmation',
    paymentStatus: 'unpaid',
    createdAt: new Date().toISOString(),
    branch: 'Chi nhánh 2 (45 Thảo Điền, Q.2)'
  }
];

// Initial Sample Product Orders
const INITIAL_PRODUCT_ORDERS: ProductOrder[] = [
  {
    id: 'ORD-901',
    userId: 'usr_cust_1',
    customerName: 'Nguyễn Thị Lan',
    customerPhone: '0901234567',
    customerEmail: 'lan.nguyen@gmail.com',
    shippingAddress: '456 Lê Văn Sỹ, Phường 12, Quận 3, TP. Hồ Chí Minh',
    items: [
      {
        id: 'prod-cream-gold-24k',
        title: 'Kem Dưỡng Da Vàng 24K & Peptide Collagen Lumé',
        price: 680000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1608248597262-838d12328827?auto=format&fit=crop&w=800&q=80',
      },
      {
        id: 'prod-lavender-oil-organic',
        title: 'Tinh Dầu Oải Hương Lavender Organic Nguyên Chất',
        price: 320000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1608248597262-838d12328827?auto=format&fit=crop&w=800&q=80',
      }
    ],
    subtotal: 1000000,
    shippingFee: 30000,
    discountAmount: 50000,
    finalPrice: 980000,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'paid',
    invoiceIssued: true,
    invoiceCode: 'HDGTGT-P901',
    notes: 'Giao giờ hành chính, gọi trước 15 phút.',
    status: 'shipping',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    salesPersonName: 'Nguyễn Văn Hải',
    accountantName: 'Trần Thu Hà',
    salesNotes: 'Đã gọi điện xác nhận địa chỉ và nhận biên lai chuyển khoản VietQR.'
  },
  {
    id: 'ORD-902',
    customerName: 'Phạm Hồng Nhung',
    customerPhone: '0933444555',
    customerEmail: 'nhung.pham@gmail.com',
    shippingAddress: '78 Nguyễn Thị Minh Khai, Q.1, TP. Hồ Chí Minh',
    items: [
      {
        id: 'prod-hair-serum-grapefruit',
        title: 'Serum Tinh Dầu Bưởi & Bồ Kết Tóc Dày Bồng Bềnh',
        price: 290000,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1608248597262-838d12328827?auto=format&fit=crop&w=800&q=80',
      }
    ],
    subtotal: 580000,
    shippingFee: 20000,
    discountAmount: 0,
    finalPrice: 600000,
    paymentMethod: 'cod',
    paymentStatus: 'unpaid',
    notes: 'Khách muốn kiểm tra hàng trước khi thanh toán COD.',
    status: 'pending_confirmation',
    createdAt: new Date().toISOString()
  }
];

interface AuthContextType {
  currentUser: User | null;
  allUsers: User[];
  login: (email: string, role?: UserRole) => { success: boolean; error?: string };
  register: (
    name: string,
    email: string,
    phone: string,
    role: UserRole,
    adminSecretKey?: string
  ) => { success: boolean; error?: string; pendingApproval?: boolean; message?: string };
  quickLogin: (role: UserRole) => void;
  logout: () => void;
  approveUser: (userId: string) => Promise<void>;
  rejectOrDeleteUser: (userId: string) => Promise<void>;
  adminAddUser: (userPayload: Partial<User> & { name: string; email: string; phone: string; role: UserRole }) => Promise<void>;
  appointments: Appointment[];
  productOrders: ProductOrder[];
  productsCatalog: ServiceItem[];
  servicesCatalog: ServiceItem[];
  reviews: Review[];
  newArrivals: NewArrivalItem[];
  instaPhotos: InstaPhotoItem[];
  addAppointment: (appointment: Appointment) => void;
  addProductOrder: (order: ProductOrder) => void;
  addProduct: (product: ServiceItem) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  updateProduct: (product: ServiceItem) => void;
  deleteProduct: (productId: string) => void;
  addService: (service: ServiceItem) => void;
  updateService: (service: ServiceItem) => void;
  deleteService: (serviceId: string) => void;
  addNewArrival: (item: NewArrivalItem) => void;
  updateNewArrival: (item: NewArrivalItem) => void;
  deleteNewArrival: (itemId: string) => void;
  addInstaPhoto: (photo: InstaPhotoItem) => void;
  deleteInstaPhoto: (photoId: string) => void;
  addReview: (review: Omit<Review, 'id' | 'date'> & { id?: string; date?: string }) => void;
  deleteReview: (reviewId: string) => void;
  updateReviewStatus: (reviewId: string, status: 'approved' | 'pending' | 'hidden') => void;
  updateAppointmentStatus: (
    id: string,
    status: OrderStatus,
    paymentStatus?: 'paid' | 'unpaid',
    paymentMethod?: Appointment['paymentMethod']
  ) => void;
  updateProductOrderStatus: (
    id: string,
    status: OrderStatus,
    paymentStatus?: 'paid' | 'unpaid',
    salesNotes?: string
  ) => void;
  issueInvoice: (id: string, type: 'appointment' | 'product_order') => string;
  assignSpecialist: (appointmentId: string, specialistId: string, specialistName: string) => void;
  redeemRewardPackage: (pkg: RewardPackage) => { success: boolean; voucher?: RedeemedVoucher; error?: string };
  useVoucher: (voucherId: string) => void;
  addBonusPoints: (points: number, description: string) => void;
  resetDatabase: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('lume_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('lume_all_users');
    return saved ? JSON.parse(saved) : Object.values(DEMO_USERS).map(u => ({ ...u, isApproved: true }));
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('lume_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [productOrders, setProductOrders] = useState<ProductOrder[]>(() => {
    const saved = localStorage.getItem('lume_product_orders');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCT_ORDERS;
  });

  const [productsCatalog, setProductsCatalog] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('lume_products_catalog');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PRODUCTS_CATALOG;
      }
    }
    return INITIAL_PRODUCTS_CATALOG;
  });

  const [servicesCatalog, setServicesCatalog] = useState<ServiceItem[]>(() => {
    const saved = localStorage.getItem('lume_services_catalog');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return SERVICES_DATA.filter(s => s.itemType !== 'product' && s.duration > 0);
      }
    }
    return SERVICES_DATA.filter(s => s.itemType !== 'product' && s.duration > 0);
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('lume_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_REVIEWS;
      }
    }
    return INITIAL_REVIEWS;
  });

  const [newArrivals, setNewArrivals] = useState<NewArrivalItem[]>(() => {
    const saved = localStorage.getItem('lume_new_arrivals');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_NEW_ARRIVALS; }
    }
    return INITIAL_NEW_ARRIVALS;
  });

  const [instaPhotos, setInstaPhotos] = useState<InstaPhotoItem[]>(() => {
    const saved = localStorage.getItem('lume_insta_photos');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return INITIAL_INSTA_PHOTOS; }
    }
    return INITIAL_INSTA_PHOTOS;
  });

  // Fetch live database tables on mount
  useEffect(() => {
    fetch('/api/database')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.db) {
          if (data.db.users && Array.isArray(data.db.users)) setAllUsers(data.db.users);
          if (data.db.appointments && Array.isArray(data.db.appointments)) setAppointments(data.db.appointments);
          if (data.db.productOrders && Array.isArray(data.db.productOrders)) setProductOrders(data.db.productOrders);
          if (data.db.productsCatalog && Array.isArray(data.db.productsCatalog)) setProductsCatalog(data.db.productsCatalog);
          const servs = data.db.services || data.db.servicesCatalog;
          if (servs && Array.isArray(servs) && servs.length > 0) setServicesCatalog(servs);
          if (data.db.reviews && Array.isArray(data.db.reviews)) setReviews(data.db.reviews);
          if (data.db.newArrivals && Array.isArray(data.db.newArrivals) && data.db.newArrivals.length > 0) setNewArrivals(data.db.newArrivals);
          if (data.db.instaPhotos && Array.isArray(data.db.instaPhotos) && data.db.instaPhotos.length > 0) setInstaPhotos(data.db.instaPhotos);
        }
      })
      .catch(err => console.warn('[DB INITIAL FETCH WARN]', err));
  }, []);

  const resetDatabase = async () => {
    try {
      const res = await fetch('/api/database/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.db) {
        setAllUsers(data.db.users || Object.values(DEMO_USERS).map(u => ({ ...u, isApproved: true })));
        setAppointments(data.db.appointments || []);
        setProductOrders(data.db.productOrders || []);
        setProductsCatalog(data.db.productsCatalog || []);
        setReviews(data.db.reviews || INITIAL_REVIEWS);
        localStorage.removeItem('lume_all_users');
        localStorage.removeItem('lume_appointments');
        localStorage.removeItem('lume_product_orders');
        localStorage.removeItem('lume_products_catalog');
        localStorage.removeItem('lume_reviews');
      }
    } catch (err) {
      console.error('[DB RESET ERROR]', err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('lume_auth_user', JSON.stringify(currentUser));
      fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: currentUser }),
      }).catch(err => console.warn('[DB USER SYNC WARN]', err));
    } else {
      localStorage.removeItem('lume_auth_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('lume_all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('lume_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('lume_product_orders', JSON.stringify(productOrders));
  }, [productOrders]);

  useEffect(() => {
    localStorage.setItem('lume_products_catalog', JSON.stringify(productsCatalog));
  }, [productsCatalog]);

  useEffect(() => {
    localStorage.setItem('lume_services_catalog', JSON.stringify(servicesCatalog));
  }, [servicesCatalog]);

  useEffect(() => {
    localStorage.setItem('lume_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('lume_new_arrivals', JSON.stringify(newArrivals));
  }, [newArrivals]);

  useEffect(() => {
    localStorage.setItem('lume_insta_photos', JSON.stringify(instaPhotos));
  }, [instaPhotos]);

  const addNewArrival = (item: NewArrivalItem) => {
    setNewArrivals(prev => [item, ...prev]);
    fetch('/api/new-arrivals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item }),
    }).catch(err => console.error('[DB ADD NEW ARRIVAL ERROR]', err));
  };

  const updateNewArrival = (item: NewArrivalItem) => {
    setNewArrivals(prev => prev.map(a => a.id === item.id ? item : a));
    fetch(`/api/new-arrivals/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    }).catch(err => console.error('[DB UPDATE NEW ARRIVAL ERROR]', err));
  };

  const deleteNewArrival = (itemId: string) => {
    setNewArrivals(prev => prev.filter(a => a.id !== itemId));
    fetch(`/api/new-arrivals/${itemId}`, {
      method: 'DELETE',
    }).catch(err => console.error('[DB DELETE NEW ARRIVAL ERROR]', err));
  };

  const addInstaPhoto = (photo: InstaPhotoItem) => {
    setInstaPhotos(prev => [photo, ...prev]);
    fetch('/api/insta-photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photo }),
    }).catch(err => console.error('[DB ADD INSTA PHOTO ERROR]', err));
  };

  const deleteInstaPhoto = (photoId: string) => {
    setInstaPhotos(prev => prev.filter(p => p.id !== photoId));
    fetch(`/api/insta-photos/${photoId}`, {
      method: 'DELETE',
    }).catch(err => console.error('[DB DELETE INSTA PHOTO ERROR]', err));
  };

  const addReview = (reviewPayload: Omit<Review, 'id' | 'date'> & { id?: string; date?: string }) => {
    const newRev: Review = {
      id: reviewPayload.id || `rev_${Date.now()}`,
      date: reviewPayload.date || new Date().toISOString().split('T')[0],
      customerName: reviewPayload.customerName || 'Khách hàng Lumé',
      role: reviewPayload.role || 'Khách hàng Thân thiết',
      avatar: reviewPayload.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
      title: reviewPayload.title || 'Đánh giá dịch vụ tuyệt vời!',
      comment: reviewPayload.comment,
      rating: reviewPayload.rating || 5,
      serviceName: reviewPayload.serviceName || 'Dịch vụ Spa',
      verified: reviewPayload.verified ?? true,
      status: reviewPayload.status || 'approved',
    };

    setReviews(prev => [newRev, ...prev]);
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review: newRev }),
    }).catch(err => console.error('[DB ADD REVIEW ERROR]', err));
  };

  const deleteReview = (reviewId: string) => {
    setReviews(prev => prev.filter(r => r.id !== reviewId));
    fetch(`/api/reviews/${reviewId}`, { method: 'DELETE' }).catch(err => console.error('[DB DELETE REVIEW ERROR]', err));
  };

  const updateReviewStatus = (reviewId: string, status: 'approved' | 'pending' | 'hidden') => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status } : r));
    fetch(`/api/reviews/${reviewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(err => console.error('[DB REVIEW STATUS ERROR]', err));
  };

  const quickLogin = (role: UserRole) => {
    setCurrentUser(DEMO_USERS[role] || DEMO_USERS.customer);
  };

  const login = (email: string, role: UserRole = 'customer'): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check if user exists in registered database
    const foundUser = allUsers.find(
      u => u.email.toLowerCase() === cleanEmail || u.phone === cleanEmail
    );

    if (foundUser) {
      // If staff / sales / accountant and NOT approved -> Block login
      if (
        (foundUser.role === 'staff' || foundUser.role === 'sales' || foundUser.role === 'accountant') &&
        foundUser.isApproved === false
      ) {
        return {
          success: false,
          error: 'Tài khoản Nhân viên của bạn đang CHỜ ADMIN PHÊ DUYỆT. Vui lòng liên hệ Admin Lumé Spa để được duyệt và kích hoạt tài khoản.',
        };
      }
      setCurrentUser(foundUser);
      return { success: true };
    }

    // Fallbacks for demo default emails
    if (cleanEmail.includes('admin')) {
      setCurrentUser(DEMO_USERS.admin);
      return { success: true };
    } else if (cleanEmail.includes('sales') || role === 'sales') {
      setCurrentUser(DEMO_USERS.sales);
      return { success: true };
    } else if (cleanEmail.includes('ketoan') || role === 'accountant') {
      setCurrentUser(DEMO_USERS.accountant);
      return { success: true };
    } else if (cleanEmail.includes('mai.phuong') || cleanEmail.includes('staff') || role === 'staff') {
      setCurrentUser(DEMO_USERS.staff);
      return { success: true };
    } else if (cleanEmail.includes('lan.nguyen')) {
      setCurrentUser(DEMO_USERS.customer);
      return { success: true };
    } else {
      // Default fallback new customer login
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        phone: '0901234567',
        role: role,
        isApproved: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
        rewardPoints: 100,
        redeemedVouchers: [],
        pointTransactions: [
          {
            id: `tx_${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            points: 100,
            type: 'bonus',
            description: 'Tặng 100 điểm thưởng chào mừng thành viên mới Lumé Spa',
          },
        ],
      };
      setAllUsers(prev => [newUser, ...prev]);
      setCurrentUser(newUser);
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: newUser }),
      }).catch(err => console.error('[DB USER CREATE ERROR]', err));
      return { success: true };
    }
  };

  const register = (
    name: string,
    email: string,
    phone: string,
    role: UserRole,
    adminSecretKey?: string
  ): { success: boolean; error?: string; pendingApproval?: boolean; message?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    
    // Check duplicate email
    const existing = allUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, error: 'Email này đã được sử dụng. Vui lòng chọn email khác hoặc Đăng Nhập.' };
    }

    // Admin registration security code check
    if (role === 'admin') {
      const validAdminKeys = ['LUME-ADMIN-2026', 'ADMIN2026', 'ADMIN'];
      if (!adminSecretKey || !validAdminKeys.includes(adminSecretKey.trim().toUpperCase())) {
        return {
          success: false,
          error: 'Mã bảo mật Quản trị viên (Admin Key) không chính xác! Vui lòng nhập đúng mã hệ thống (Mặc định: LUME-ADMIN-2026).'
        };
      }
    }

    // Determine approval status: Customers & Admin are auto approved. Staff/Sales/Accountant require Admin approval!
    const needsApproval = role === 'staff' || role === 'sales' || role === 'accountant';
    const isApproved = !needsApproval;

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      phone,
      role,
      isApproved,
      registeredAt: new Date().toISOString(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      rewardPoints: 100,
      redeemedVouchers: [],
      pointTransactions: [
        {
          id: `tx_${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          points: 100,
          type: 'bonus',
          description: 'Thưởng 100 điểm khởi tạo tài khoản thành viên',
        },
      ],
      ...(role === 'staff' ? { specialistId: 'sp1' } : {})
    };

    setAllUsers(prev => [newUser, ...prev]);

    // Persist to backend
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: newUser }),
    }).catch(err => console.error('[DB REGISTER USER ERROR]', err));

    if (needsApproval) {
      // Do NOT log in automatically
      return {
        success: true,
        pendingApproval: true,
        message: 'Đăng ký tài khoản Nhân Viên thành công! Tài khoản của bạn đang CHỜ ADMIN PHÊ DUYỆT trước khi có thể đăng nhập.'
      };
    } else {
      // Customer or Admin -> Log in automatically
      setCurrentUser(newUser);
      return { success: true };
    }
  };

  const approveUser = async (userId: string) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, isApproved: true } : u));
    fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isApproved: true }),
    }).catch(err => console.error('[DB APPROVE USER ERROR]', err));
  };

  const rejectOrDeleteUser = async (userId: string) => {
    setAllUsers(prev => prev.filter(u => u.id !== userId));
    fetch(`/api/users/${userId}`, { method: 'DELETE' }).catch(err => console.error('[DB DELETE USER ERROR]', err));
  };

  const adminAddUser = async (userPayload: Partial<User> & { name: string; email: string; phone: string; role: UserRole }) => {
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: userPayload.name,
      email: userPayload.email,
      phone: userPayload.phone,
      role: userPayload.role,
      isApproved: true, // Created directly by Admin -> Approved automatically
      registeredAt: new Date().toISOString(),
      avatar: userPayload.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80',
      rewardPoints: 100,
      redeemedVouchers: [],
      pointTransactions: [],
      ...(userPayload.role === 'staff' ? { specialistId: 'sp1' } : {})
    };

    setAllUsers(prev => [newUser, ...prev]);
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: newUser }),
    }).catch(err => console.error('[DB ADMIN ADD USER ERROR]', err));
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addAppointment = (newApp: Appointment) => {
    setAppointments(prev => [newApp, ...prev]);
    fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appointment: newApp }),
    }).catch(err => console.error('[DB ADD APPT ERROR]', err));
  };

  const addProductOrder = (newOrder: ProductOrder) => {
    setProductOrders(prev => [newOrder, ...prev]);
    if (newOrder.items && newOrder.items.length > 0) {
      setProductsCatalog(prevCatalog =>
        prevCatalog.map(p => {
          const orderedItem = newOrder.items.find(it => it.id === p.id);
          if (orderedItem) {
            const currentStock = p.stockQuantity ?? 50;
            const newStock = Math.max(0, currentStock - orderedItem.quantity);
            return { ...p, stockQuantity: newStock };
          }
          return p;
        })
      );
    }
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: newOrder }),
    }).catch(err => console.error('[DB ADD ORDER ERROR]', err));
  };

  const addProduct = (product: ServiceItem) => {
    setProductsCatalog(prev => [product, ...prev]);
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product }),
    }).catch(err => console.error('[DB ADD PROD ERROR]', err));
  };

  const updateProductStock = (productId: string, newStock: number) => {
    const stockVal = Math.max(0, newStock);
    setProductsCatalog(prev =>
      prev.map(p => (p.id === productId ? { ...p, stockQuantity: stockVal } : p))
    );
    fetch(`/api/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stockQuantity: stockVal }),
    }).catch(err => console.error('[DB STOCK ERROR]', err));
  };

  const updateProduct = (updatedProduct: ServiceItem) => {
    setProductsCatalog(prev =>
      prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    fetch(`/api/products/${updatedProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    }).catch(err => console.error('[DB UPDATE PROD ERROR]', err));
  };

  const deleteProduct = (productId: string) => {
    setProductsCatalog(prev => prev.filter(p => p.id !== productId));
    fetch(`/api/products/${productId}`, {
      method: 'DELETE',
    }).catch(err => console.error('[DB DELETE PROD ERROR]', err));
  };

  const addService = (service: ServiceItem) => {
    setServicesCatalog(prev => [service, ...prev]);
    fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service }),
    }).catch(err => console.error('[DB ADD SERVICE ERROR]', err));
  };

  const updateService = (updatedService: ServiceItem) => {
    setServicesCatalog(prev =>
      prev.map(s => (s.id === updatedService.id ? updatedService : s))
    );
    fetch(`/api/services/${updatedService.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedService),
    }).catch(err => console.error('[DB UPDATE SERVICE ERROR]', err));
  };

  const deleteService = (serviceId: string) => {
    setServicesCatalog(prev => prev.filter(s => s.id !== serviceId));
    fetch(`/api/services/${serviceId}`, {
      method: 'DELETE',
    }).catch(err => console.error('[DB DELETE SERVICE ERROR]', err));
  };

  const updateAppointmentStatus = (
    id: string,
    status: OrderStatus,
    paymentStatus?: 'paid' | 'unpaid',
    paymentMethod?: Appointment['paymentMethod']
  ) => {
    setAppointments(prev => {
      const targetApp = prev.find(a => a.id === id);
      if (targetApp && status === 'completed' && targetApp.status !== 'completed') {
        const pointsEarned = Math.floor(targetApp.finalPrice / 10000);
        if (pointsEarned > 0 && currentUser && (currentUser.id === targetApp.userId || currentUser.email === targetApp.customerEmail)) {
          const newTx: PointTransaction = {
            id: `tx_${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            points: pointsEarned,
            type: 'earn',
            description: `Tích điểm hoàn thành dịch vụ #${targetApp.id}`,
          };

          setCurrentUser(user => {
            if (!user) return user;
            return {
              ...user,
              rewardPoints: (user.rewardPoints || 0) + pointsEarned,
              pointTransactions: [newTx, ...(user.pointTransactions || [])],
            };
          });
        }
      }

      return prev.map(app => {
        if (app.id === id) {
          return {
            ...app,
            status,
            ...(paymentStatus ? { paymentStatus } : {}),
            ...(paymentMethod ? { paymentMethod } : {}),
            ...(currentUser?.role === 'sales' ? { salesPersonName: currentUser.name } : {}),
            ...(currentUser?.role === 'accountant' ? { accountantName: currentUser.name } : {}),
          };
        }
        return app;
      });
    });

    fetch(`/api/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        ...(paymentStatus ? { paymentStatus } : {}),
        ...(paymentMethod ? { paymentMethod } : {}),
        ...(currentUser?.role === 'sales' ? { salesPersonName: currentUser.name } : {}),
        ...(currentUser?.role === 'accountant' ? { accountantName: currentUser.name } : {}),
      }),
    }).catch(err => console.error('[DB APPT STATUS ERROR]', err));
  };

  const updateProductOrderStatus = (
    id: string,
    status: OrderStatus,
    paymentStatus?: 'paid' | 'unpaid',
    salesNotes?: string
  ) => {
    setProductOrders(prev =>
      prev.map(order => {
        if (order.id === id) {
          return {
            ...order,
            status,
            ...(paymentStatus ? { paymentStatus } : {}),
            ...(salesNotes ? { salesNotes } : {}),
            ...(currentUser?.role === 'sales' ? { salesPersonName: currentUser.name } : {}),
            ...(currentUser?.role === 'accountant' ? { accountantName: currentUser.name } : {}),
          };
        }
        return order;
      })
    );

    fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        ...(paymentStatus ? { paymentStatus } : {}),
        ...(salesNotes ? { salesNotes } : {}),
        ...(currentUser?.role === 'sales' ? { salesPersonName: currentUser.name } : {}),
        ...(currentUser?.role === 'accountant' ? { accountantName: currentUser.name } : {}),
      }),
    }).catch(err => console.error('[DB ORDER STATUS ERROR]', err));
  };

  const issueInvoice = (id: string, type: 'appointment' | 'product_order'): string => {
    const invoiceCode = `HDGTGT-${Math.floor(1000 + Math.random() * 9000)}`;
    if (type === 'appointment') {
      setAppointments(prev =>
        prev.map(app =>
          app.id === id
            ? {
                ...app,
                invoiceIssued: true,
                invoiceCode,
                paymentStatus: 'paid',
                accountantName: currentUser?.name || 'Thị Hà (Kế toán)',
              }
            : app
        )
      );
      fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceIssued: true,
          invoiceCode,
          paymentStatus: 'paid',
          accountantName: currentUser?.name || 'Thị Hà (Kế toán)',
        }),
      }).catch(err => console.error('[DB INVOICE ERROR]', err));
    } else {
      setProductOrders(prev =>
        prev.map(order =>
          order.id === id
            ? {
                ...order,
                invoiceIssued: true,
                invoiceCode,
                paymentStatus: 'paid',
                accountantName: currentUser?.name || 'Thị Hà (Kế toán)',
              }
            : order
        )
      );
      fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceIssued: true,
          invoiceCode,
          paymentStatus: 'paid',
          accountantName: currentUser?.name || 'Thị Hà (Kế toán)',
        }),
      }).catch(err => console.error('[DB INVOICE ERROR]', err));
    }
    return invoiceCode;
  };

  const assignSpecialist = (appointmentId: string, specialistId: string, specialistName: string) => {
    setAppointments(prev =>
      prev.map(app =>
        app.id === appointmentId ? { ...app, specialistId, specialistName } : app
      )
    );
    fetch(`/api/appointments/${appointmentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ specialistId, specialistName }),
    }).catch(err => console.error('[DB ASSIGN ERROR]', err));
  };

  const redeemRewardPackage = (pkg: RewardPackage): { success: boolean; voucher?: RedeemedVoucher; error?: string } => {
    if (!currentUser) {
      return { success: false, error: 'Vui lòng đăng nhập để đổi quà tích điểm!' };
    }

    const currentPoints = currentUser.rewardPoints || 0;
    if (currentPoints < pkg.pointsRequired) {
      return {
        success: false,
        error: `Bạn cần thêm ${pkg.pointsRequired - currentPoints} điểm nữa để đổi gói quà này!`,
      };
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const voucherCode = `REW-${pkg.id.toUpperCase()}-${randomSuffix}`;

    const newVoucher: RedeemedVoucher = {
      id: `vouch_${Date.now()}`,
      code: voucherCode,
      title: pkg.title,
      discountType: pkg.category === 'free_service' ? 'free_service' : 'amount',
      discountValue: pkg.valueAmount,
      serviceTitle: pkg.serviceTitle,
      pointsSpent: pkg.pointsRequired,
      redeemedAt: new Date().toISOString().split('T')[0],
      isUsed: false,
      validUntil: '2026-12-31',
    };

    const newTx: PointTransaction = {
      id: `tx_red_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      points: -pkg.pointsRequired,
      type: 'redeem',
      description: `Đổi quà: ${pkg.title} (Mã: ${voucherCode})`,
    };

    setCurrentUser(user => {
      if (!user) return null;
      return {
        ...user,
        rewardPoints: (user.rewardPoints || 0) - pkg.pointsRequired,
        redeemedVouchers: [newVoucher, ...(user.redeemedVouchers || [])],
        pointTransactions: [newTx, ...(user.pointTransactions || [])],
      };
    });

    return { success: true, voucher: newVoucher };
  };

  const useVoucher = (voucherId: string) => {
    setCurrentUser(user => {
      if (!user || !user.redeemedVouchers) return user;
      return {
        ...user,
        redeemedVouchers: user.redeemedVouchers.map(v =>
          v.id === voucherId ? { ...v, isUsed: true } : v
        ),
      };
    });
  };

  const addBonusPoints = (points: number, description: string) => {
    if (!currentUser) return;
    const newTx: PointTransaction = {
      id: `tx_bonus_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      points: points,
      type: 'bonus',
      description: description || 'Tặng điểm thưởng đặc biệt từ BQL Lumé Spa',
    };

    setCurrentUser(user => {
      if (!user) return user;
      return {
        ...user,
        rewardPoints: (user.rewardPoints || 0) + points,
        pointTransactions: [newTx, ...(user.pointTransactions || [])],
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        login,
        register,
        quickLogin,
        logout,
        approveUser,
        rejectOrDeleteUser,
        adminAddUser,
        appointments,
        productOrders,
        productsCatalog,
        servicesCatalog,
        reviews,
        newArrivals,
        instaPhotos,
        addAppointment,
        addProductOrder,
        addProduct,
        updateProductStock,
        updateProduct,
        deleteProduct,
        addService,
        updateService,
        deleteService,
        addNewArrival,
        updateNewArrival,
        deleteNewArrival,
        addInstaPhoto,
        deleteInstaPhoto,
        addReview,
        deleteReview,
        updateReviewStatus,
        updateAppointmentStatus,
        updateProductOrderStatus,
        issueInvoice,
        assignSpecialist,
        redeemRewardPackage,
        useVoucher,
        addBonusPoints,
        resetDatabase,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

