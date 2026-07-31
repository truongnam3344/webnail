export type UserRole = 'customer' | 'staff' | 'sales' | 'accountant' | 'admin';

export interface RedeemedVoucher {
  id: string;
  code: string;
  title: string;
  discountType: 'amount' | 'percentage' | 'free_service';
  discountValue: number; // Discount amount in VND or 100%
  serviceTitle?: string;
  pointsSpent: number;
  redeemedAt: string;
  isUsed: boolean;
  validUntil: string;
}

export interface PointTransaction {
  id: string;
  date: string;
  points: number;
  type: 'earn' | 'redeem' | 'bonus';
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  specialistId?: string; // Links to specialist ID if role is 'staff'
  rewardPoints?: number;
  redeemedVouchers?: RedeemedVoucher[];
  pointTransactions?: PointTransaction[];
  isApproved?: boolean; // Required for staff accounts (must be approved by Admin)
  registeredAt?: string;
}

export type ServiceCategory = 'all' | 'spa' | 'facial' | 'nail' | 'hair';

export type CatalogItemType = 'service' | 'product';

export interface ServiceItem {
  id: string;
  category: 'spa' | 'facial' | 'nail' | 'hair';
  title: string;
  subtitle?: string;
  price: number;
  originalPrice?: number;
  duration: number; // minutes for services, or volume/weight for products
  icon: string;
  description: string;
  image: string;
  popular?: boolean;
  protocolSteps?: string[];
  targetSkinOrBody?: string;
  benefits?: string[];
  itemType?: CatalogItemType; // 'service' (Đặt lịch) vs 'product' (Mua hàng)
  stockQuantity?: number;
}

export interface Specialist {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  specialty: string;
  experienceYears: number;
}

export interface Promotion {
  id: string;
  title: string;
  code: string;
  discount: string;
  description: string;
  image: string;
  validUntil: string;
  originalPrice?: number;
  discountedPrice?: number;
  servicesIncluded?: string[];
  itemType?: CatalogItemType;
}

export type OrderStatus =
  | 'pending_confirmation' // Chờ Sales xác nhận
  | 'confirmed'            // Sales đã xác nhận
  | 'shipping'             // Đang giao hàng (đối với sản phẩm)
  | 'pending_payment'      // Chờ kế toán duyệt thanh toán
  | 'paid'                 // Kế toán đã xác nhận thu tiền / xuất hóa đơn
  | 'in_progress'          // KTV đang thực hiện dịch vụ
  | 'completed'            // Hoàn tất đơn hàng / dịch vụ
  | 'cancelled';           // Đã hủy

export interface ProductOrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  category?: string;
}

export interface ProductOrder {
  id: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  items: ProductOrderItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  finalPrice: number;
  paymentMethod: 'cod' | 'bank_transfer' | 'momo';
  paymentStatus: 'unpaid' | 'paid';
  invoiceIssued?: boolean;
  invoiceCode?: string;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
  salesPersonName?: string;
  accountantName?: string;
  salesNotes?: string;
}

export interface Appointment {
  id: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  selectedServices: ServiceItem[];
  specialistId?: string;
  specialistName?: string;
  date: string;
  timeSlot: string;
  totalPrice: number;
  discountAmount: number;
  finalPrice: number;
  promoCode?: string;
  notes?: string;
  status: OrderStatus;
  paymentStatus?: 'unpaid' | 'paid';
  paymentMethod?: 'cash' | 'bank_transfer' | 'momo' | 'card';
  invoiceIssued?: boolean;
  invoiceCode?: string;
  createdAt: string;
  branch: string;
  salesPersonName?: string;
  accountantName?: string;
}

export interface Review {
  id: string;
  customerName: string;
  avatar?: string;
  role?: string;
  title?: string;
  rating: number;
  serviceName?: string;
  date: string;
  comment: string;
  verified?: boolean;
  status?: 'approved' | 'pending' | 'hidden';
}

