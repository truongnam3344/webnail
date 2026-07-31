export interface RewardPackage {
  id: string;
  title: string;
  category: 'voucher' | 'free_service' | 'combo';
  pointsRequired: number;
  valueText: string;
  valueAmount: number; // Value in VND for discount calculation
  description: string;
  icon: string;
  popular?: boolean;
  minSpend?: number;
  serviceTitle?: string;
}

export interface LoyaltyTier {
  id: 'bronze' | 'silver' | 'gold' | 'diamond';
  name: string;
  badge: string;
  minPoints: number;
  color: string;
  bgColor: string;
  benefits: string[];
  discountPercent: number;
}

export const LOYALTY_TIERS: LoyaltyTier[] = [
  {
    id: 'bronze',
    name: 'Thành Viên Bronze',
    badge: '🥉',
    minPoints: 0,
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    benefits: ['Tích 1 điểm cho mỗi 10.000đ chi tiêu', 'Nhận ưu đãi sinh nhật 50k'],
    discountPercent: 0,
  },
  {
    id: 'silver',
    name: 'Thành Viên Silver',
    badge: '🥈',
    minPoints: 200,
    color: 'text-slate-600',
    bgColor: 'bg-slate-200',
    benefits: ['Tích điểm x1.2 nhanh hơn', 'Giảm thêm 3% cho mọi dịch vụ', 'Quà tặng sinh nhật 100k'],
    discountPercent: 3,
  },
  {
    id: 'gold',
    name: 'Thành Viên Gold',
    badge: '🥇',
    minPoints: 500,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    benefits: ['Tích điểm x1.5', 'Giảm thêm 5% cho mọi dịch vụ', 'Tặng 1 buổi Gội đầu thảo dược sinh nhật', 'Ưu tiên xếp lịch KTV VIP'],
    discountPercent: 5,
  },
  {
    id: 'diamond',
    name: 'Thành Viên Diamond VIP',
    badge: '💎',
    minPoints: 1000,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    benefits: ['Tích điểm x2.0 siêu tốc', 'Giảm thêm 10% cho tất cả dịch vụ', 'Miễn phí Combo Spa Birthday', 'Phục vụ phòng VIP riêng biệt'],
    discountPercent: 10,
  },
];

export const REWARD_PACKAGES: RewardPackage[] = [
  {
    id: 'rew_50k',
    title: 'Voucher Giảm 50.000đ',
    category: 'voucher',
    pointsRequired: 50,
    valueText: 'Giảm 50.000đ',
    valueAmount: 50000,
    description: 'Áp dụng giảm trực tiếp trên tổng hóa đơn đặt lịch bất kỳ tại Lumé Spa.',
    icon: '🎟️',
    minSpend: 0,
  },
  {
    id: 'rew_herbal',
    title: 'Gói Gội Đầu Dưỡng Sinh Thảo Dược 0đ',
    category: 'free_service',
    pointsRequired: 150,
    valueText: 'Miễn phí 100% (250.000đ)',
    valueAmount: 250000,
    serviceTitle: 'Gội Đầu Dưỡng Sinh Thảo Dược Lumé',
    description: 'Nấu bồ kết tươi, sả, vỏ bưởi nguyên chất + Massage đầu cổ vai gáy 60 phút.',
    icon: '🌿',
    popular: true,
  },
  {
    id: 'rew_150k',
    title: 'Voucher Giảm 150.000đ',
    category: 'voucher',
    pointsRequired: 200,
    valueText: 'Giảm 150.000đ',
    valueAmount: 150000,
    description: 'Áp dụng cho hóa đơn dịch vụ chăm sóc da & body từ 400.000đ trở lên.',
    icon: '🏷️',
    minSpend: 400000,
  },
  {
    id: 'rew_massage',
    title: 'Gói Massage Cổ Vai Gáy Chuyên Sâu 0đ',
    category: 'free_service',
    pointsRequired: 250,
    valueText: 'Miễn phí 100% (350.000đ)',
    valueAmount: 350000,
    serviceTitle: 'Massage Cổ Vai Gáy Chuyên Sâu',
    description: 'Ấn huyệt chuyên sâu giải tỏa nhức mỏi, chườm đá nóng Himalaya trị liệu.',
    icon: '💆',
    popular: true,
  },
  {
    id: 'rew_facial_cleansing',
    title: 'Gói Chăm Sóc Da Mặt SDeep Cleansing 0đ',
    category: 'free_service',
    pointsRequired: 300,
    valueText: 'Miễn phí 100% (390.000đ)',
    valueAmount: 390000,
    serviceTitle: 'Chăm Sóc Da Mặt Chuyên SDeep Cleansing',
    description: 'Làm sạch sâu chuẩn y khoa, hút mụn cám, thải độc bã nhờn mang lại làn da thông thoáng.',
    icon: '✨',
  },
  {
    id: 'rew_200k',
    title: 'Voucher Ưu Đãi VIP 200.000đ',
    category: 'voucher',
    pointsRequired: 350,
    valueText: 'Giảm 200.000đ',
    valueAmount: 200000,
    description: 'Khấu trừ 200.000đ trực tiếp khi trải nghiệm combo Nail hoặc Facial.',
    icon: '💎',
  },
  {
    id: 'rew_gold24k',
    title: 'Gói Cấy Tinh Chất Collagen & Vàng 24K 0đ',
    category: 'free_service',
    pointsRequired: 500,
    valueText: 'Miễn phí 100% (650.000đ)',
    valueAmount: 650000,
    serviceTitle: 'Cấy Tinh Chất Collagen & Vàng 24K',
    description: 'Điện di ion tinh chất vàng 24K nano giúp da căng bóng, chống lão hóa & mờ nếp nhăn.',
    icon: '👑',
    popular: true,
  },
  {
    id: 'rew_vip_combo',
    title: 'Gói VIP Luxury Spa & Facial Combo 0đ',
    category: 'combo',
    pointsRequired: 800,
    valueText: 'Miễn phí 100% (1.200.000đ)',
    valueAmount: 1200000,
    description: 'Trọn gói trải nghiệm VIP: Massage Body đá nóng + Cấy Vàng 24K + Gội đầu thảo dược.',
    icon: '🌟',
  },
];

export function getUserTier(points: number = 0): LoyaltyTier {
  if (points >= 1000) return LOYALTY_TIERS[3]; // Diamond
  if (points >= 500) return LOYALTY_TIERS[2];  // Gold
  if (points >= 200) return LOYALTY_TIERS[1];  // Silver
  return LOYALTY_TIERS[0]; // Bronze
}

export function getNextTierInfo(points: number = 0): { nextTier: LoyaltyTier | null; pointsNeeded: number; progressPercent: number } {
  if (points >= 1000) {
    return { nextTier: null, pointsNeeded: 0, progressPercent: 100 };
  }
  
  let targetTier = LOYALTY_TIERS[1];
  let currentMin = 0;
  
  if (points >= 500) {
    targetTier = LOYALTY_TIERS[3];
    currentMin = 500;
  } else if (points >= 200) {
    targetTier = LOYALTY_TIERS[2];
    currentMin = 200;
  }

  const range = targetTier.minPoints - currentMin;
  const progress = points - currentMin;
  const percent = Math.min(100, Math.max(0, Math.round((progress / range) * 100)));

  return {
    nextTier: targetTier,
    pointsNeeded: targetTier.minPoints - points,
    progressPercent: percent,
  };
}
