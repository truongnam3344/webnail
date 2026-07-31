import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SERVICES_DATA } from '../data/servicesData';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  onSelectService: (service: ServiceItem) => void;
  onFilterCategory: (category: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectService,
  onFilterCategory,
}) => {
  const categories = [
    {
      id: 'spa',
      icon: '🪷',
      title: 'Spa thư giãn',
      description: 'Massage body, đá nóng, tinh dầu giúp giảm stress và phục hồi năng lượng.',
      sampleServiceId: 'spa-body-relax'
    },
    {
      id: 'facial',
      icon: '✨',
      title: 'Chăm sóc da',
      description: 'Liệu trình facial chuyên sâu, làm sạch sâu và dưỡng ẩm theo loại da.',
      sampleServiceId: 'facial-deep-clean'
    },
    {
      id: 'nail',
      icon: '💅',
      title: 'Nail Art',
      description: 'Sơn gel, design nghệ thuật, chăm sóc móng tay – móng chân chuyên nghiệp.',
      sampleServiceId: 'nail-gel-art'
    },
    {
      id: 'hair',
      icon: '💇',
      title: 'Làm tóc',
      description: 'Cắt, uốn, nhuộm và chăm sóc tóc theo xu hướng mới nhất.',
      sampleServiceId: 'hair-cut-style'
    }
  ];

  const handleCategoryClick = (catId: string, sampleId: string) => {
    const matchedService = SERVICES_DATA.find((s) => s.id === sampleId);
    if (matchedService) {
      onSelectService(matchedService);
    } else {
      onFilterCategory(catId);
    }
  };

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-semibold tracking-[0.25em] text-[#c9a86c] uppercase mb-2">
            Dịch vụ
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3a2f2a] tracking-tight">
            Trải nghiệm chăm sóc toàn diện
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6b5c54] font-sans leading-relaxed">
            Từ thư giãn body đến làm đẹp chi tiết, chúng tôi mang đến liệu trình phù hợp với từng nhu cầu của bạn.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id, cat.sampleServiceId)}
              className="group bg-[#f7f1eb] rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-white border border-transparent hover:border-[#c9a86c]/30 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 mx-auto mb-6 bg-[#f3e6e0] rounded-full flex items-center justify-center text-3xl text-[#b08d4f] group-hover:scale-110 group-hover:bg-[#c9a86c] group-hover:text-white transition-all shadow-xs">
                  {cat.icon}
                </div>
                <h3 className="font-serif text-xl font-semibold text-[#3a2f2a] mb-3 group-hover:text-[#b08d4f] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-sm text-[#6b5c54] leading-relaxed mb-6 font-sans">
                  {cat.description}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#b08d4f] group-hover:text-[#3a2f2a] transition-colors">
                <span>Xem chi tiết liệu trình</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Quick Popular Highlight Strip */}
        <div className="mt-16 bg-gradient-to-r from-[#f7f1eb] via-[#f3e6e0] to-[#f7f1eb] p-6 sm:p-8 rounded-3xl border border-[#c9a86c]/20 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-[#c9a86c] text-white flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-[#3a2f2a]">
                Bạn phân vân chưa biết chọn liệu trình nào?
              </h4>
              <p className="text-xs sm:text-sm text-[#6b5c54]">
                Khám phá Bảng giá chi tiết với đầy đủ mô tả, thời gian và giá ưu đãi đặc quyền hôm nay.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const pricingElem = document.getElementById('pricing');
              if (pricingElem) pricingElem.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3 rounded-full bg-[#3a2f2a] hover:bg-[#4a3c35] text-white text-xs sm:text-sm font-medium transition-all shadow-md shrink-0 cursor-pointer"
          >
            Xem bảng giá đầy đủ
          </button>
        </div>

      </div>
    </section>
  );
};
