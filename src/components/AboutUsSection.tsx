import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const AboutUsSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="bg-[#f7f4ee] py-16 border-t border-[#e6dec8]/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Collage Images */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="space-y-4">
                <div className="rounded-t-full rounded-b-2xl overflow-hidden aspect-[3/4] shadow-md border-2 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80"
                    alt="Spa Relaxation"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square shadow-md border-2 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80"
                    alt="Beauty Treatment"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-8">
                <div className="rounded-2xl overflow-hidden aspect-square shadow-md border-2 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&q=80"
                    alt="Facial Glow"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-b-full rounded-t-2xl overflow-hidden aspect-[3/4] shadow-md border-2 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80"
                    alt="Nail Art Master"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#e8e0ce] text-[#2d4a3e] text-xs font-extrabold tracking-widest uppercase">
              {t('about.tag')}
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1f2923] leading-tight">
              {t('about.title1')} <br />
              <span className="italic font-serif text-[#2d4a3e]">{t('about.title2')}</span>
            </h2>

            <p className="text-sm sm:text-base text-[#524943] leading-relaxed">
              {t('about.desc')}
            </p>

            {/* Dark Green Stats Banner */}
            <div className="bg-[#1b3b2b] text-white p-6 sm:p-8 rounded-2xl shadow-xl">
              <div className="grid grid-cols-3 gap-4 text-center divide-x divide-white/20">
                <div className="px-2">
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-[#e6d3ad]">25K+</div>
                  <div className="text-[10px] sm:text-xs text-white/80 font-medium uppercase tracking-wider mt-1">
                    {t('about.stat1')}
                  </div>
                </div>

                <div className="px-2">
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-[#e6d3ad]">2500+</div>
                  <div className="text-[10px] sm:text-xs text-white/80 font-medium uppercase tracking-wider mt-1">
                    {t('about.stat2')}
                  </div>
                </div>

                <div className="px-2">
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-[#e6d3ad]">99%</div>
                  <div className="text-[10px] sm:text-xs text-white/80 font-medium uppercase tracking-wider mt-1">
                    {t('about.stat3')}
                  </div>
                </div>
              </div>
            </div>

            {/* Signature */}
            <div className="pt-2 flex items-center gap-4">
              <div className="font-serif italic text-2xl text-[#2d4a3e] border-b-2 border-[#2d4a3e]/30 pb-1">
                Jenny Alexander
              </div>
              <span className="text-xs text-[#736860] uppercase tracking-widest font-semibold">
                — Lumé Founder & Master
              </span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
