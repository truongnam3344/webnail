import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Sparkles, Star, Award, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onOpenBooking: (serviceId?: string) => void;
  onViewServices: () => void;
}

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000&q=80',
    title: 'Spa thư giãn',
    tagline: 'Massage body & Đá nóng xua tan mệt mỏi'
  },
  {
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1000&q=80',
    title: 'Chăm sóc da Facial',
    tagline: 'Cấy Collagen Vàng 24K & Thải độc da'
  },
  {
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1000&q=80',
    title: 'Nail Art Nghệ Thuật',
    tagline: 'Sơn gel cao cấp & Mẫu vẽ thiết kế sang trọng'
  },
  {
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1000&q=80',
    title: 'Làm tóc & Styling',
    tagline: 'Cắt Layer Hàn Quốc & Uốn gợn sóng lơi'
  }
];

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, onViewServices }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);

  // Auto slide timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-[92vh] pt-24 pb-16 flex items-center justify-center bg-gradient-to-br from-[#f7f1eb] via-[#f3e6e0] to-[#ebe3d9] overflow-hidden"
    >
      {/* Decorative background shapes */}
      <div className="absolute top-12 -right-20 w-80 h-80 rounded-full bg-[#c9a86c]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-16 w-64 h-64 rounded-full bg-[#e8d5cc]/40 blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Text */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#c9a86c]/30 shadow-xs text-xs font-medium text-[#b08d4f]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Thương hiệu Spa & Nail Cao Cấp tại TP. Hồ Chí Minh</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#3a2f2a] leading-[1.18] tracking-tight">
              Chăm sóc sắc đẹp<br />
              <span className="text-[#b08d4f] italic font-serif">Thư giãn trọn vẹn</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#6b5c54] max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
              Không gian yên tĩnh, liệu trình chuyên nghiệp giúp bạn tái tạo năng lượng và tỏa sáng tự nhiên mỗi ngày.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onOpenBooking()}
                className="px-7 py-3.5 rounded-full text-sm font-semibold bg-[#c9a86c] hover:bg-[#b08d4f] text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Đặt lịch ngay</span>
              </button>

              <button
                onClick={onViewServices}
                className="px-7 py-3.5 rounded-full text-sm font-semibold text-[#b08d4f] border-2 border-[#c9a86c] hover:bg-[#c9a86c] hover:text-white transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                Xem dịch vụ
              </button>
            </div>

            {/* Trust Features Badges */}
            <div className="pt-6 border-t border-[#c9a86c]/20 grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0">
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="flex items-center gap-1 text-[#b08d4f] font-bold text-sm">
                  <Star className="w-4 h-4 fill-current text-[#c9a86c]" />
                  <span>4.9 / 5.0</span>
                </div>
                <span className="text-xs text-[#6b5c54]">1,200+ Khách hàng</span>
              </div>

              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="flex items-center gap-1 text-[#3a2f2a] font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-[#c9a86c]" />
                  <span>100% Organic</span>
                </div>
                <span className="text-xs text-[#6b5c54]">Sản phẩm an toàn</span>
              </div>

              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="flex items-center gap-1 text-[#3a2f2a] font-bold text-sm">
                  <Award className="w-4 h-4 text-[#c9a86c]" />
                  <span>Master KTV</span>
                </div>
                <span className="text-xs text-[#6b5c54]">Đào tạo bài bản</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image Slider */}
          <div className="lg:col-span-6 flex justify-center">
            <div
              className="relative w-full max-w-md lg:max-w-none aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-[#f3e6e0] border-4 border-white/60"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Slides wrapper */}
              <div
                className="flex w-full h-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {SLIDES.map((slide, index) => (
                  <div key={index} className="min-w-full h-full relative group">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80';
                      }}
                      className="w-full h-full object-cover object-center"
                    />
                    {/* Gradient Overlay & Caption */}
                    <div className="absolute inset-x-0 bottom-0 p-6 pt-16 bg-gradient-to-t from-[#3a2f2a]/90 via-[#3a2f2a]/40 to-transparent text-white">
                      <span className="inline-block px-3 py-1 bg-[#c9a86c] text-[10px] font-bold uppercase tracking-wider rounded-full mb-1">
                        Dịch vụ nổi bật
                      </span>
                      <h3 className="font-serif text-2xl font-semibold leading-tight text-white">
                        {slide.title}
                      </h3>
                      <p className="text-xs text-white/90 mt-1 font-sans">
                        {slide.tagline}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slider Prev / Next Buttons */}
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#3a2f2a] shadow-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer z-10"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-[#3a2f2a] shadow-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer z-10"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Slider Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                {SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentSlide === idx
                        ? 'w-6 bg-white'
                        : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
