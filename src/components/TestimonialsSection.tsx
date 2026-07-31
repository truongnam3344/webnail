import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  title: string;
  comment: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Bessie Cooper',
    role: 'Khách hàng VIP',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
    title: "The Best Thing I've Used For My Skin!",
    comment: 'Lumé Spa thực sự là chốn bình yên yêu thích của tôi sau những tuần làm việc căng thẳng. Liệu trình cấy Collagen Vàng 24K giúp làn da căng bóng và khỏe mạnh rõ rệt chỉ sau 1 buổi!',
    rating: 5,
  },
  {
    id: '2',
    name: 'Thanh Vân',
    role: 'Khách hàng Thân thiết',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
    title: 'Gội Đầu Dưỡng Sinh & Massage Tuyệt Mới!',
    comment: 'Tay nghề kỹ thuật viên rất êm ái và nhẹ nhàng, mùi bồ kết sả chanh tự nhiên lưu lại cả ngày. Phòng Spa thơm ngát tinh dầu mang lại cảm giác cực kỳ thư thái.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Minh Trí & Phương Thảo',
    role: 'Khách hàng Đôi',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80',
    title: 'Nail Art Vẽ Tay Đẹp Mắt & Bền Bỉ',
    comment: 'Sơn gel cao cấp không hề bị bong tróc dù mình hay làm việc nhà. Thiết kế mẫu móng đính đá vô cùng chỉn chu và đúng ý thích của mình!',
    rating: 5,
  },
];

export const TestimonialsSection: React.FC = () => {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[activeIndex];

  return (
    <section id="reviews" className="bg-[#f7f4ee] py-16 border-t border-[#e6dec8]/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Header */}
        <div className="space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#2d4a3e]">
            {t('testimonials.sub')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1f2923]">
            {t('testimonials.title')}
          </h2>
        </div>

        {/* Customer Avatars Selector Row */}
        <div className="flex items-center justify-center gap-4 py-2">
          {TESTIMONIALS.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.id}
                onClick={() => setActiveIndex(idx)}
                className={`relative transition-all cursor-pointer rounded-full p-1 ${
                  isActive
                    ? 'ring-2 ring-[#2d4a3e] ring-offset-2 ring-offset-[#f7f4ee] scale-110'
                    : 'opacity-60 hover:opacity-100 hover:scale-105'
                }`}
              >
                <img
                  src={item.avatar}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-sm"
                />
              </button>
            );
          })}
        </div>

        {/* Active Testimonial Card */}
        <div className="relative bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-[#e8dfcb] space-y-6 text-center">
          <Quote className="w-10 h-10 text-[#2d4a3e]/20 mx-auto" />

          <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1f2923]">
            "{current.title}"
          </h3>

          <p className="text-sm sm:text-base text-[#524943] leading-relaxed max-w-2xl mx-auto font-sans">
            {current.comment}
          </p>

          <div className="flex justify-center items-center gap-1 text-amber-500">
            {[...Array(current.rating)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>

          <div>
            <div className="font-bold text-base text-[#1f2923] font-serif">{current.name}</div>
            <div className="text-xs text-[#736860] uppercase tracking-wider">{current.role}</div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-[#f2ede4] hover:bg-[#2d4a3e] hover:text-white text-[#2d4a3e] transition-all flex items-center justify-center cursor-pointer shadow-xs"
              aria-label="Previous Review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-[#f2ede4] hover:bg-[#2d4a3e] hover:text-white text-[#2d4a3e] transition-all flex items-center justify-center cursor-pointer shadow-xs"
              aria-label="Next Review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
