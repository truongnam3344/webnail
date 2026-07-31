import React from 'react';
import { Phone, Mail, MapPin, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#1b3b2b] text-white pt-16 pb-8 border-t border-[#12281d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col items-start">
              <span className="font-serif text-3xl font-bold tracking-tight text-white">
                Lumé
              </span>
              <span className="text-[10px] font-sans font-extrabold tracking-[0.25em] text-[#e6d3ad] uppercase -mt-1">
                Beauty & Spa
              </span>
            </div>

            <p className="text-xs text-white/80 leading-relaxed max-w-sm">
              {t('footer.brand.desc')}
            </p>

            <div className="space-y-2 text-xs text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#e6d3ad]" />
                <span>Chi nhánh Q1: 128 Nguyễn Trãi, P. Bến Thành, Quận 1</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#e6d3ad]" />
                <span>Hotline: 0901 234 567 (24/7)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#e6d3ad]" />
                <span>Email: contact@lumespa.vn</span>
              </div>
            </div>
          </div>

          {/* Quick Links Column 1 */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#e6d3ad] uppercase tracking-wider">
              {t('footer.col1.title')}
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li><a href="#home" className="hover:text-[#e6d3ad] transition-colors">{t('nav.home')}</a></li>
              <li><a href="#about" className="hover:text-[#e6d3ad] transition-colors">{t('nav.about')}</a></li>
              <li><a href="#services" className="hover:text-[#e6d3ad] transition-colors">{t('nav.services')}</a></li>
              <li><a href="#best-sellers" className="hover:text-[#e6d3ad] transition-colors">{t('nav.products')}</a></li>
              <li><a href="#blogs" className="hover:text-[#e6d3ad] transition-colors">{t('nav.news')}</a></li>
            </ul>
          </div>

          {/* Quick Links Column 2 */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#e6d3ad] uppercase tracking-wider">
              {t('footer.col2.title')}
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li><a href="#faq" className="hover:text-[#e6d3ad] transition-colors">{t('nav.faq')}</a></li>
              <li><a href="#reviews" className="hover:text-[#e6d3ad] transition-colors">{t('testimonials.title')}</a></li>
              <li><a href="#lookup" className="hover:text-[#e6d3ad] transition-colors">{t('nav.lookup')}</a></li>
              <li><a href="#privacy" className="hover:text-[#e6d3ad] transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#terms" className="hover:text-[#e6d3ad] transition-colors">Điều khoản dịch vụ</a></li>
            </ul>
          </div>

          {/* Quick Links Column 3 */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#e6d3ad] uppercase tracking-wider">
              {t('footer.col3.title')}
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li><span className="hover:text-[#e6d3ad] cursor-pointer">Chăm Sóc Da Facial Vàng 24K</span></li>
              <li><span className="hover:text-[#e6d3ad] cursor-pointer">Gội Đầu Dưỡng Sinh Thảo Dược</span></li>
              <li><span className="hover:text-[#e6d3ad] cursor-pointer">Massage Body Đá Nóng</span></li>
              <li><span className="hover:text-[#e6d3ad] cursor-pointer">Chăm Sóc Móng & Nail Art</span></li>
              <li><span className="hover:text-[#e6d3ad] cursor-pointer">Gói Combo Sinh Nhật VIP</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <div>
            © {new Date().getFullYear()} Lumé Spa & Beauty. All Rights Reserved.
          </div>
          <div className="flex items-center gap-1 text-white/80">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />
            <span>for your ultimate relaxation.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
