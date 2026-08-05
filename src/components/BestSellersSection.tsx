import React, { useState } from 'react';
import { Star, Heart, ShoppingBag, Eye } from 'lucide-react';
import { ServiceItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface BestSellersProps {
  onSelectService: (service: ServiceItem) => void;
  onBookService: (service: ServiceItem) => void;
  onOpenAllCatalog?: () => void;
}

const BEST_SELLER_PRODUCTS: (ServiceItem & { discountTag?: string; rating: number; reviewCount: number })[] = [
  {
    id: 'silk-serum',
    category: 'facial',
    title: 'SilkSerum Serum Collagen',
    subtitle: 'Tinh chất dưỡng căng bóng da & phục hồi',
    price: 350000,
    originalPrice: 700000,
    duration: 0,
    itemType: 'product',
    icon: '✨',
    description: 'Tinh chất Collagen dạng serum ngấm sâu nuôi dưỡng làn da khỏe mạnh, xóa mờ nếp nhăn.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80',
    popular: true,
    discountTag: '50% Off',
    rating: 4.9,
    reviewCount: 128
  },
  {
    id: 'silkskin-serum',
    category: 'facial',
    title: 'SilkSkin Serum Glow',
    subtitle: 'Serum làm sáng da & mờ thâm nám',
    price: 450000,
    originalPrice: 600000,
    duration: 0,
    itemType: 'product',
    icon: '💎',
    description: 'Chứa Vitamin C tinh khiết 15% cùng Hyaluronic Acid giúp làn da bật tông trắng sáng rạng rỡ.',
    image: 'https://tse3.mm.bing.net/th/id/OIP.eFrezuv-sdHSr72mz5y49gHaNK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    popular: true,
    discountTag: '25% Off',
    rating: 4.8,
    reviewCount: 94
  },
  {
    id: 'argan-glow',
    category: 'spa',
    title: 'Argan Glow Body Oil',
    subtitle: 'Dầu massage body Argan Morocco',
    price: 320000,
    originalPrice: 400000,
    duration: 0,
    itemType: 'product',
    icon: '🪷',
    description: 'Chiết xuất từ hạt Argan tươi Morocco nguyên chất giúp mềm da, giảm căng thẳng tuyệt vời.',
    image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500&q=80',
    popular: true,
    discountTag: '20% Off',
    rating: 5.0,
    reviewCount: 210
  },
  {
    id: 'argan-cream',
    category: 'spa',
    title: 'Argan Cream Nourishing',
    subtitle: 'Kem dưỡng thể chuyên sâu & thơm dịu',
    price: 280000,
    originalPrice: 350000,
    duration: 0,
    itemType: 'product',
    icon: '🌿',
    description: 'Cấp ẩm 24h giúp da mịn màng như lụa, khóa ẩm tự nhiên không gây bết dính.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80',
    popular: true,
    discountTag: '20% Off',
    rating: 4.9,
    reviewCount: 86
  },
  {
    id: 'nail-luxury-gel',
    category: 'nail',
    title: 'Bộ Chăm Sóc Móng Gel Luxury',
    subtitle: 'Sơn gel Hàn Quốc & thiết kế móng',
    price: 180000,
    originalPrice: 250000,
    duration: 0,
    itemType: 'product',
    icon: '💅',
    description: 'Sơn gel lên màu chuẩn, sáng bóng bền đẹp đến 4 tuần không bong tróc.',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&q=80',
    popular: true,
    discountTag: '28% Off',
    rating: 4.95,
    reviewCount: 320
  },
  {
    id: 'herbal-shampoo-bot',
    category: 'hair',
    title: 'Dầu Gội Dưỡng Sinh Thảo Dược',
    subtitle: 'Sô-cô-la & Bồ kết sả chanh tươi',
    price: 250000,
    originalPrice: 320000,
    duration: 0,
    itemType: 'product',
    icon: '✂️',
    description: 'Nấu thủ công từ bồ kết, vỏ bưởi, mần trầu giúp giảm gãy rụng và nuôi dưỡng chân tóc.',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=500&q=80',
    popular: true,
    discountTag: '22% Off',
    rating: 4.88,
    reviewCount: 175
  },
  {
    id: 'lume-lipstick-velvet',
    category: 'makeup',
    title: 'Son Môi Dưỡng Mịn Lụa Velvet Lumé',
    subtitle: 'Son dưỡng có màu tự nhiên & chống khô môi',
    price: 220000,
    originalPrice: 320000,
    duration: 0,
    itemType: 'product',
    icon: '💄',
    description: 'Son dưỡng nhung lụa nhiều dưỡng chất nuôi dưỡng đôi môi căng mọng, tự nhiên.',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&q=80',
    popular: true,
    discountTag: '30% Off',
    rating: 4.92,
    reviewCount: 140
  },
  {
    id: 'lume-organic-perfume',
    category: 'fragrances',
    title: 'Nước Hoa Thảo Mộc Lumé Organic Elixir',
    subtitle: 'Hương hoa hồng nhung & tinh dầu gỗ đàn hương',
    price: 490000,
    originalPrice: 700000,
    duration: 0,
    itemType: 'product',
    icon: '🌸',
    description: 'Nước hoa xịt body lưu hương 12 giờ dịu nhẹ thư thái quyến rũ.',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&q=80',
    popular: true,
    discountTag: '30% Off',
    rating: 4.95,
    reviewCount: 205
  }
];

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'facial', label: 'Skin Care' },
  { id: 'makeup', label: 'Makeup' },
  { id: 'fragrances', label: 'Fragrances' },
  { id: 'nail', label: 'Nail Care' },
  { id: 'spa', label: 'Body Care' },
  { id: 'hair', label: 'Accessories & Tools' }
];

export const BestSellersSection: React.FC<BestSellersProps> = ({
  onSelectService,
  onBookService,
  onOpenAllCatalog,
}) => {
  const { t } = useLanguage();
  const { productsCatalog, servicesCatalog } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const CATEGORIES = [
    { id: 'all', label: t('bestsellers.all') },
    { id: 'facial', label: t('cat.skincare') },
    { id: 'makeup', label: t('cat.makeup') },
    { id: 'fragrances', label: t('cat.fragrances') },
    { id: 'nail', label: t('cat.nailcare') },
    { id: 'spa', label: t('cat.bodycare') },
    { id: 'hair', label: t('cat.accessories') }
  ];

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allCatalogItems = [...(productsCatalog || []), ...(servicesCatalog || [])];

  const activeProducts = BEST_SELLER_PRODUCTS.map((p) => {
    const matched = allCatalogItems.find(c => c.id === p.id || c.title.toLowerCase().trim() === p.title.toLowerCase().trim());
    if (matched) {
      const hasDiscount = !!(matched.originalPrice && matched.originalPrice > matched.price);
      const discountPct = hasDiscount ? Math.round(((matched.originalPrice! - matched.price) / matched.originalPrice!) * 100) : 0;
      return {
        ...p,
        ...matched,
        price: matched.price,
        originalPrice: hasDiscount ? matched.originalPrice : undefined,
        discountTag: hasDiscount ? `${discountPct}% Off` : undefined,
      };
    }
    const hasDiscount = !!(p.originalPrice && p.originalPrice > p.price);
    return {
      ...p,
      originalPrice: hasDiscount ? p.originalPrice : undefined,
      discountTag: hasDiscount ? p.discountTag : undefined,
    };
  });

  const filteredProducts = activeTab === 'all'
    ? activeProducts
    : activeProducts.filter((p) => {
        if (p.category === activeTab) return true;
        if (activeTab === 'makeup') return p.category === 'makeup' || p.category === 'facial';
        if (activeTab === 'fragrances') return p.category === 'fragrances' || p.category === 'spa';
        if (activeTab === 'hair') return p.category === 'hair';
        return false;
      });

  return (
    <section id="best-sellers" className="bg-[#f7f4ee] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-8">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#2d4a3e]">
            {t('bestsellers.sub')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1f2923]">
            {t('bestsellers.title')}
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          {CATEGORIES.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2d4a3e] text-white shadow-md'
                    : 'bg-[#ebe4d5] text-[#524943] hover:bg-[#2d4a3e]/10 hover:text-[#2d4a3e]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onSelectService(product)}
              className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 border border-[#e8dfcb] group cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-square bg-[#f5f0e6] overflow-hidden p-4">
                {/* Discount Badge */}
                {product.discountTag && (
                  <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-[#2d4a3e] text-white text-[10px] font-extrabold rounded-md uppercase">
                    {product.discountTag}
                  </span>
                )}

                {/* Heart wishlist button */}
                <button
                  onClick={(e) => toggleFavorite(product.id, e)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-700 flex items-center justify-center shadow-xs transition-transform hover:scale-110 cursor-pointer"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      favorites[product.id] ? 'fill-rose-500 text-rose-500' : 'text-gray-500'
                    }`}
                  />
                </button>

                {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                />

                {/* Quick view hover action */}
                <div className="absolute inset-x-4 bottom-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <span className="px-3 py-1.5 bg-[#2d4a3e] text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Xem Chi Tiết</span>
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mb-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating}</span>
                    <span className="text-gray-400 font-normal">({product.reviewCount})</span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#1f2923] group-hover:text-[#2d4a3e] transition-colors line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-xs text-[#736860] line-clamp-1">
                    {product.subtitle || product.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#f2ede4]">
                  <div>
                    <span className="text-sm font-bold text-[#2d4a3e]">
                      {product.price.toLocaleString('vi-VN')}đ
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="ml-1.5 text-xs text-gray-400 line-through font-normal">
                        {product.originalPrice.toLocaleString('vi-VN')}đ
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookService(product);
                    }}
                    className="p-2 rounded-full bg-[#2d4a3e] hover:bg-[#1f362c] text-white transition-all cursor-pointer shadow-xs hover:scale-105"
                    title={product.itemType === 'product' ? 'Đặt mua sản phẩm ngay' : 'Đặt lịch dịch vụ ngay'}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Catalog Button */}
        {onOpenAllCatalog && (
          <div className="mt-10 text-center">
            <button
              onClick={onOpenAllCatalog}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2d4a3e] hover:bg-[#1f342b] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <span>Xem Tất Cả Sản Phẩm & Dịch Vụ </span>
              <span className="text-amber-300">✨</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
