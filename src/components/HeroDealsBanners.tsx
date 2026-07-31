import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeroDealsBannersProps {
  onOpenBooking: (serviceId?: string, promoCode?: string) => void;
}

export const HeroDealsBanners: React.FC<HeroDealsBannersProps> = ({ onOpenBooking }) => {
  const { t } = useLanguage();

  return (
    <section className="bg-[#f7f4ee] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Banner - Hair Care Deals */}
          <div className="relative rounded-2xl overflow-hidden bg-[#e8e2d5] min-h-[220px] sm:min-h-[260px] flex items-center p-6 sm:p-10 shadow-sm border border-[#decfae]/50 group">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80"
                alt="Special Hair Care Deals"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-right group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#f7f4ee] via-[#f7f4ee]/85 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-xs space-y-3">
              <span className="inline-block px-3 py-1 bg-[#2d4a3e] text-white text-[11px] font-bold rounded-full uppercase tracking-wider">
                {t('banner.hair.tag')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1f2923] leading-tight">
                {t('banner.hair.title')}
              </h2>
              <p className="text-xs sm:text-sm text-[#524943] line-clamp-2">
                {t('banner.hair.desc')}
              </p>
              <button
                onClick={() => onOpenBooking(undefined, 'HAIR15')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2d4a3e] hover:bg-[#1f362c] text-white text-xs font-bold rounded-full transition-all shadow-md cursor-pointer hover:gap-3"
              >
                <span>{t('nav.booking')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Banner - Skincare Deals */}
          <div className="relative rounded-2xl overflow-hidden bg-[#e0ded8] min-h-[220px] sm:min-h-[260px] flex items-center p-6 sm:p-10 shadow-sm border border-[#decfae]/50 group">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80"
                alt="Save Big on Skincare"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-right group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#f7f4ee] via-[#f7f4ee]/85 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-xs space-y-3">
              <span className="inline-block px-3 py-1 bg-[#2d4a3e] text-white text-[11px] font-bold rounded-full uppercase tracking-wider">
                {t('banner.skin.tag')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1f2923] leading-tight">
                {t('banner.skin.title')}
              </h2>
              <p className="text-xs sm:text-sm text-[#524943] line-clamp-2">
                {t('banner.skin.desc')}
              </p>
              <button
                onClick={() => onOpenBooking(undefined, 'SKIN25')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2d4a3e] hover:bg-[#1f362c] text-white text-xs font-bold rounded-full transition-all shadow-md cursor-pointer hover:gap-3"
              >
                <span>{t('nav.booking')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
