import React from 'react';
import { Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { ServiceItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface NewArrivalsProps {
  onSelectService: (service: ServiceItem) => void;
  onBookService: (service: ServiceItem) => void;
}

const NEW_ARRIVALS: (ServiceItem & { discountTag: string; rating: number; reviewCount: number })[] = [
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
    id: 'essence-body-gel',
    category: 'spa',
    title: 'Essence Body Gel Wash',
    subtitle: 'Gel tắm tinh chất nha đam tươi',
    price: 320000,
    originalPrice: 640000,
    duration: 0,
    itemType: 'product',
    icon: '✨',
    description: 'Làm sạch dịu nhẹ và cung cấp độ ẩm giúp làn da mềm mại như lụa.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&q=80',
    discountTag: '50% Off',
    rating: 4.9,
    reviewCount: 78,
  },
  {
    id: 'hyaluronic-serum',
    category: 'facial',
    title: 'Hyaluronic Acid 2% + B5',
    subtitle: 'Serum phục hồi da căng mướt',
    price: 500000,
    originalPrice: 1000000,
    duration: 0,
    itemType: 'product',
    icon: '💎',
    description: 'Căng bóng da chuẩn Clinic Hàn Quốc, se khít lỗ chân lông.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&q=80',
    discountTag: '50% Off',
    rating: 4.95,
    reviewCount: 156,
  },
  {
    id: 'oceanmist-moisturizer',
    category: 'facial',
    title: 'OceanMist Cream',
    subtitle: 'Kem khóa ẩm khoáng biển sâu',
    price: 380000,
    originalPrice: 760000,
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

export const NewArrivalsSection: React.FC<NewArrivalsProps> = ({
  onSelectService,
  onBookService,
}) => {
  const { t } = useLanguage();
  const { newArrivals } = useAuth();

  const itemsToDisplay = newArrivals && newArrivals.length > 0 ? newArrivals : NEW_ARRIVALS;

  return (
    <section className="bg-[#f7f4ee] py-16 border-t border-[#e6dec8]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#2d4a3e]">
            {t('newarrivals.sub')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1f2923]">
            {t('newarrivals.title')}
          </h2>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Vertical Poster */}
          <div className="lg:col-span-4 relative rounded-2xl overflow-hidden bg-[#2d4a3e] text-white p-8 flex flex-col justify-between shadow-lg group min-h-[420px]">
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80"
                alt="New Arrival Poster"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b3b2b] via-[#1b3b2b]/40 to-transparent" />
            </div>

            <div className="relative z-10 space-y-3">
              <span className="inline-block px-3 py-1 bg-white text-[#1b3b2b] text-xs font-black rounded-full uppercase">
                50% OFF
              </span>
              <h3 className="text-3xl font-serif font-bold leading-tight text-white">
                New Season <br />
                Beauty Deals
              </h3>
            </div>

            <div className="relative z-10 space-y-4 pt-10">
              <p className="text-xs text-white/90 leading-relaxed">
                Nâng tầm vẻ đẹp tự nhiên với dòng sản phẩm hữu cơ mới ra mắt năm 2026.
              </p>
              <button
                onClick={() => itemsToDisplay[0] && onBookService(itemsToDisplay[0])}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#e6d3ad] hover:bg-white text-[#1b3b2b] text-xs font-extrabold rounded-full transition-all shadow-md cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right 6 Products Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {itemsToDisplay.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectService(product)}
                className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 border border-[#e8dfcb] group cursor-pointer flex flex-col justify-between p-3.5"
              >
                <div className="relative aspect-square bg-[#f5f0e6] rounded-xl overflow-hidden mb-3">
                  <span className="absolute top-2 left-2 z-10 px-2 py-0.5 bg-[#2d4a3e] text-white text-[10px] font-extrabold rounded-md uppercase">
                    {product.discountTag}
                  </span>
                  <img
                    src={product.image}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{product.rating}</span>
                      <span className="text-gray-400 font-normal">({product.reviewCount})</span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-[#1f2923] group-hover:text-[#2d4a3e] transition-colors line-clamp-1">
                      {product.title}
                    </h4>
                    <p className="text-[11px] text-[#736860] line-clamp-1">
                      {product.subtitle}
                    </p>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-[#f2ede4]">
                    <div>
                      <span className="text-xs font-bold text-[#2d4a3e]">
                        {product.price.toLocaleString('vi-VN')}đ
                      </span>
                      <span className="ml-1 text-[10px] text-gray-400 line-through">
                        {product.originalPrice?.toLocaleString('vi-VN')}đ
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookService(product);
                      }}
                      className="p-1.5 rounded-full bg-[#2d4a3e] hover:bg-[#1f362c] text-white transition-all cursor-pointer shadow-xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
