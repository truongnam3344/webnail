import { Promotion } from '../types';

export const PROMOTIONS_DATA: Promotion[] = [
  {
    id: 'promo-welcome',
    title: 'Combo Chăm Sóc Nhanh Cho Nàng Bận Rộn',
    code: 'LUME2026',
    discount: 'Giảm 20%',
    description: 'Bao gồm Gội đầu dưỡng sinh + Nail Gel tay thiết kế đơn giản + Thư giãn vai cổ gáy.',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80',
    validUntil: '31/12/2026',
    originalPrice: 630000,
    discountedPrice: 490000,
    servicesIncluded: ['Gội đầu dưỡng sinh', 'Nail Gel tay Art', 'Massage vai cổ gáy']
  },
  {
    id: 'promo-spa-facial',
    title: 'Gói Spa Body + Chăm Sóc Da Căng Bóng Collagen',
    code: 'GLOW50',
    discount: 'Giảm 25%',
    description: 'Trải nghiệm 135 phút thư giãn tuyệt đối từ làn da mặt đến toàn thân với tinh chất hoa cúc & đá nóng.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
    validUntil: 'Hàng tuần (Thứ 2 - Thứ 5)',
    originalPrice: 1000000,
    discountedPrice: 750000,
    servicesIncluded: ['Massage Body Đá Nóng 75p', 'Cấy Collagen Vàng 24K 60p']
  },
  {
    id: 'promo-friend',
    title: 'Đi 2 Người - Giảm Thêm 15% Tổng Hóa Đơn',
    code: 'LUME2GETHER',
    discount: 'Tặng Voucher 100K',
    description: 'Dành riêng cho nhóm 2 bạn cùng trải nghiệm dịch vụ Nail Art hoặc Spa thư giãn cuối tuần.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
    validUntil: '30/09/2026',
    originalPrice: 800000,
    discountedPrice: 680000,
    servicesIncluded: ['Sử dụng cho tất cả dịch vụ đơn lẻ']
  }
];
