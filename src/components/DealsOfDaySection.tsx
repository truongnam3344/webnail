import React from 'react';
import { ArrowRight, Star, ShoppingBag } from 'lucide-react';
import { ServiceItem } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface DealsOfDayProps {
  onBookService: (service: ServiceItem) => void;
}

const DEALS_PRODUCTS: (ServiceItem & { discountTag: string; rating: number; reviewCount: number })[] = [
  {
    id: 'smooth-foundation',
    category: 'facial',
    title: 'Smooth Foundation Serum',
    subtitle: 'Kem nền nhung lụa kiềm dầu 24h',
    price: 200000,
    originalPrice: 400000,
    duration: 0,
    itemType: 'product',
    icon: '✨',
    description: 'Che phủ hoàn hảo khuyết điểm, mỏng nhẹ tự nhiên như làn da thứ hai.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80',
    discountTag: '50% Off',
    rating: 4.9,
    reviewCount: 88,
  },
  {
    id: 'smooth-body-cream',
    category: 'spa',
    title: 'Smooth Body Cream Lotion',
    subtitle: 'Kem dưỡng body hương hoa nhài',
    price: 300000,
    originalPrice: 600000,
    duration: 0,
    itemType: 'product',
    icon: '🌿',
    description: 'Thẩm thấu cực nhanh, giúp da tay & toàn thân trắng sáng mượt mà.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80',
    discountTag: '50% Off',
    rating: 5.0,
    reviewCount: 142,
  },
];

export const DealsOfDaySection: React.FC<DealsOfDayProps> = ({ onBookService }) => {
  const { t } = useLanguage();

  return (
    <section className="bg-[#f7f4ee] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Title */}
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#2d4a3e]">
            {t('deals.sub')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1f2923]">
            {t('deals.title')}
          </h2>
        </div>

        {/* Top Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {DEALS_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e8dfcb] shadow-xs flex flex-col sm:flex-row gap-5 items-center hover:shadow-md transition-shadow"
            >
              <div className="relative w-full sm:w-40 aspect-square rounded-xl bg-[#f5f0e6] overflow-hidden flex-shrink-0">
                <span className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-[#2d4a3e] text-white text-[10px] font-extrabold rounded-md uppercase">
                  {product.discountTag}
                </span>
                <img
                  src={product.image}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating}</span>
                  <span className="text-gray-400 font-normal">({product.reviewCount})</span>
                </div>

                <h3 className="font-serif font-bold text-lg text-[#1f2923]">
                  {product.title}
                </h3>
                <p className="text-xs text-[#736860] line-clamp-2">
                  {product.subtitle}
                </p>

                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold text-[#2d4a3e]">
                      {product.price.toLocaleString('vi-VN')}đ
                    </span>
                    <span className="ml-2 text-xs text-gray-400 line-through">
                      {product.originalPrice?.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  <button
                    onClick={() => onBookService(product)}
                    className="px-4 py-2 bg-[#2d4a3e] hover:bg-[#1f362c] text-white text-xs font-bold rounded-full transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{t('banner.shopnow')}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Weekly Deals Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-[#1b3b2b] text-white p-8 sm:p-12 shadow-xl border border-[#12281d]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-7 space-y-4">
              <span className="inline-block px-3 py-1 bg-[#2d4a3e] text-[#e6d3ad] text-xs font-extrabold uppercase tracking-widest rounded-full border border-[#e6d3ad]/30">
                {t('deals.weeklytag')}
              </span>

              <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
                {t('deals.weeklytitle')}
              </h3>

              <p className="text-xs sm:text-sm text-white/80 max-w-lg leading-relaxed">
                {t('deals.weeklydesc')}
              </p>

              <button
                onClick={() => onBookService(DEALS_PRODUCTS[0])}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#e6d3ad] hover:bg-[#d8c195] text-[#1b3b2b] text-xs font-extrabold rounded-full transition-all shadow-md cursor-pointer"
              >
                <span>{t('banner.shopnow')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="md:col-span-5 flex justify-center">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] w-full max-w-sm border-2 border-[#e6d3ad]/40 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80"
                  alt="Weekly Beauty Deals"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
