import React from 'react';
import { Sparkles, Coffee, ShieldAlert, Heart, VolumeX } from 'lucide-react';

export const FacilitySection: React.FC = () => {
  const images = [
    {
      url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
      title: 'Phòng Trị Liệu Body VIP',
      subtitle: 'Không gian riêng tư, rèm tơ tằm, nhạc thiền êm dịu'
    },
    {
      url: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80',
      title: 'Sảnh Chờ Trà Thảo Mộc',
      subtitle: 'Trà hoa cúc gừng ấm & bánh quy dinh dưỡng đón tiếp'
    },
    {
      url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80',
      title: 'Khu Vực Nail Lounge',
      subtitle: 'Ghế bọc nhung ngả lưng thư giãn, trang thiết bị tiệt trùng UV'
    },
    {
      url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
      title: 'Phòng Skincare & Facial Y Khoa',
      subtitle: 'Máy móc hiện đại chuẩn Châu Âu, công nghệ điện di ion'
    }
  ];

  return (
    <section id="facility" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-semibold tracking-[0.25em] text-[#c9a86c] uppercase mb-2">
            Không gian Lumé
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3a2f2a] tracking-tight">
            Nơi Tâm Trí Đm Lại Sự Bình Yên
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6b5c54] font-sans leading-relaxed">
            Thiết kế theo phong cách Minimalism kết hợp chất liệu gỗ ấm & ánh sáng dịu nhẹ mang lại cảm giác dễ chịu ngay khi bước vào.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((item, idx) => (
            <div
              key={idx}
              className="relative h-80 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group border border-[#ebe3d9]"
            >
              <img
                src={item.url}
                alt={item.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3a2f2a]/90 via-[#3a2f2a]/20 to-transparent" />
              
              <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                <h3 className="font-serif text-lg font-bold leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-white/80 mt-1 font-sans">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Amenities Bar */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 rounded-3xl bg-[#f7f1eb] border border-[#ebe3d9]">
          <div className="flex items-center gap-3">
            <VolumeX className="w-5 h-5 text-[#c9a86c] shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-[#3a2f2a]">
              Acoustic Calm Music
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Coffee className="w-5 h-5 text-[#c9a86c] shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-[#3a2f2a]">
              Trà chiều & Bánh miễn phí
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-[#c9a86c] shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-[#3a2f2a]">
              Khu vực phòng VIP riêng
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#c9a86c] shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-[#3a2f2a]">
              Tiệt trùng dụng cụ 100%
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
