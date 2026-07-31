import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SummerGlowCountdownProps {
  onOpenBooking: (serviceId?: string, promoCode?: string) => void;
}

export const SummerGlowCountdown: React.FC<SummerGlowCountdownProps> = ({ onOpenBooking }) => {
  const { t } = useLanguage();

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 14,
    minutes: 48,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNum = (num: number) => num.toString().padStart(2, '0');

  return (
    <section className="bg-[#f7f4ee] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-[#e3ded2] border border-[#d4cbba] overflow-hidden p-8 sm:p-12 shadow-sm">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Image Arch */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="rounded-t-full rounded-b-2xl overflow-hidden aspect-[3/4] shadow-lg border-4 border-white/80">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80"
                  alt="Summer Glow Model"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Middle Countdown Content */}
            <div className="lg:col-span-6 text-center space-y-5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2d4a3e] text-white text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('countdown.tag')}</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1f2923] leading-tight">
                {t('countdown.title')}
              </h2>

              <p className="text-sm sm:text-base text-[#524943] font-medium">
                {t('countdown.sub')}
              </p>

              {/* Countdown Boxes */}
              <div className="flex items-center justify-center gap-3 sm:gap-6 py-2">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-xl sm:text-2xl font-serif font-bold text-[#1f2923] border border-[#d6ccbb]">
                    {formatNum(timeLeft.days)}
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-[#736860] uppercase mt-2">{t('countdown.days')}</span>
                </div>

                <span className="text-xl font-bold text-[#2d4a3e] -mt-5">:</span>

                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-xl sm:text-2xl font-serif font-bold text-[#1f2923] border border-[#d6ccbb]">
                    {formatNum(timeLeft.hours)}
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-[#736860] uppercase mt-2">{t('countdown.hours')}</span>
                </div>

                <span className="text-xl font-bold text-[#2d4a3e] -mt-5">:</span>

                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-xl sm:text-2xl font-serif font-bold text-[#1f2923] border border-[#d6ccbb]">
                    {formatNum(timeLeft.minutes)}
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-[#736860] uppercase mt-2">{t('countdown.minutes')}</span>
                </div>

                <span className="text-xl font-bold text-[#2d4a3e] -mt-5">:</span>

                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white shadow-md flex items-center justify-center text-xl sm:text-2xl font-serif font-bold text-[#1f2923] border border-[#d6ccbb]">
                    {formatNum(timeLeft.seconds)}
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-[#736860] uppercase mt-2">{t('countdown.seconds')}</span>
                </div>
              </div>

              {/* Shop Now Button */}
              <div className="pt-2">
                <button
                  onClick={() => onOpenBooking(undefined, 'SUMMER50')}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#2d4a3e] hover:bg-[#1f362c] text-white text-sm font-bold rounded-full transition-all shadow-lg hover:shadow-xl cursor-pointer hover:gap-3"
                >
                  <span>{t('banner.shopnow')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Image Arch */}
            <div className="hidden lg:block lg:col-span-3">
              <div className="rounded-t-full rounded-b-2xl overflow-hidden aspect-[3/4] shadow-lg border-4 border-white/80">
                <img
                  src="https://tse1.explicit.bing.net/th/id/OIP.dhYAaz-g20d-E9Do5rpKaQHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
                  alt="Summer Glow Skincare"
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
