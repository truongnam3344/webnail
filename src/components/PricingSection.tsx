import React, { useState, useMemo } from 'react';
import { Search, Clock, Sparkles, Filter, Check, Eye, Plus } from 'lucide-react';
import { SERVICES_DATA } from '../data/servicesData';
import { ServiceItem, ServiceCategory } from '../types';
import { useAuth } from '../context/AuthContext';

interface PricingSectionProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onViewDetail: (service: ServiceItem) => void;
  onBookService: (service: ServiceItem) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  selectedCategory,
  onSelectCategory,
  onViewDetail,
  onBookService,
}) => {
  const { servicesCatalog } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const servicesListToUse = servicesCatalog && servicesCatalog.length > 0 ? servicesCatalog : SERVICES_DATA;

  const categories: { id: ServiceCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'Tất cả dịch vụ', icon: '✨' },
    { id: 'spa', label: 'Spa & Body', icon: '🪷' },
    { id: 'facial', label: 'Chăm sóc da', icon: '💎' },
    { id: 'nail', label: 'Nail Art', icon: '💅' },
    { id: 'hair', label: 'Làm tóc', icon: '💇' },
  ];

  const filteredServices = useMemo(() => {
    return servicesListToUse.filter((service) => {
      // Only include actual services (not physical products)
      const isActualService = service.itemType !== 'product' && service.duration > 0;
      const matchesCategory =
        selectedCategory === 'all' || service.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        service.title.toLowerCase().includes(query) ||
        (service.description && service.description.toLowerCase().includes(query)) ||
        (service.subtitle && service.subtitle.toLowerCase().includes(query));

      return isActualService && matchesCategory && matchesSearch;
    });
  }, [servicesListToUse, selectedCategory, searchQuery]);

  return (
    <section id="pricing" className="py-20 bg-[#f7f1eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-xs font-semibold tracking-[0.25em] text-[#c9a86c] uppercase mb-2">
            Bảng giá niêm yết
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3a2f2a] tracking-tight">
            Menu Dịch Vụ & Liệu Trình
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6b5c54] font-sans leading-relaxed">
            Bảng giá minh bạch, cam kết không phát sinh chi phí phụ. Trải nghiệm dịch vụ 5 sao với giá ưu đãi tốt nhất.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#c9a86c] text-white shadow-md'
                    : 'bg-white text-[#6b5c54] hover:bg-[#ebe3d9] hover:text-[#3a2f2a]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c9a86c]" />
            <input
              type="text"
              placeholder="Tìm tên dịch vụ, từ khóa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white rounded-full border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c] text-[#3a2f2a] placeholder-[#6b5c54]/60 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6b5c54] hover:text-[#3a2f2a]"
              >
                Xóa
              </button>
            )}
          </div>

        </div>

        {/* Services List Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#ebe3d9]">
            <p className="text-base text-[#6b5c54]">Không tìm thấy dịch vụ phù hợp với từ khóa "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery('');
                onSelectCategory('all');
              }}
              className="mt-4 px-5 py-2 rounded-full text-xs font-semibold bg-[#c9a86c] text-white"
            >
              Xem tất cả dịch vụ
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredServices.map((service) => {
              const formattedPrice = new Intl.NumberFormat('vi-VN').format(service.price) + 'đ';
              const formattedOrigPrice = service.originalPrice
                ? new Intl.NumberFormat('vi-VN').format(service.originalPrice) + 'đ'
                : null;

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-3xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 border border-[#ebe3d9] hover:border-[#c9a86c]/40 flex flex-col sm:flex-row gap-6 group"
                >
                  {/* Image */}
                  <div className="relative w-full sm:w-44 h-44 sm:h-auto rounded-2xl overflow-hidden shrink-0 bg-[#f3e6e0]">
                    <img
                      src={service.image}
                      alt={service.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {service.popular && (
                      <span className="absolute top-2 left-2 bg-[#c9a86c] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                        Bán chạy
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Subtitle / Category Badge */}
                      <div className="flex items-center justify-between text-xs text-[#6b5c54] mb-1">
                        <span className="text-[#b08d4f] font-medium uppercase tracking-wider text-[11px]">
                          {service.subtitle || service.category}
                        </span>
                        <div className="flex items-center gap-1 text-[#6b5c54]">
                          <Clock className="w-3.5 h-3.5 text-[#c9a86c]" />
                          <span>{service.duration} phút</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => onViewDetail(service)}
                        className="font-serif text-lg font-bold text-[#3a2f2a] group-hover:text-[#b08d4f] transition-colors cursor-pointer"
                      >
                        {service.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-[#6b5c54] line-clamp-2 mt-1.5 font-sans leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Price & Actions */}
                    <div className="mt-4 pt-4 border-t border-[#ebe3d9] flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-[#b08d4f] font-sans">
                            {formattedPrice}
                          </span>
                          {formattedOrigPrice && (
                            <span className="text-xs text-[#6b5c54]/60 line-through">
                              {formattedOrigPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewDetail(service)}
                          className="p-2 rounded-full text-[#6b5c54] hover:text-[#3a2f2a] hover:bg-[#f7f1eb] transition-colors cursor-pointer"
                          title="Xem quy trình chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onBookService(service)}
                          className="px-4 py-2 rounded-full text-xs font-semibold bg-[#c9a86c] hover:bg-[#b08d4f] text-white shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Chọn dịch vụ</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
