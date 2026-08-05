import React, { useState } from 'react';
import { Tag, Copy, Check, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { PROMOTIONS_DATA } from '../data/promotionsData';
import { Promotion } from '../types';

interface PromotionsSectionProps {
  onApplyPromo: (promoCode: string) => void;
}

export const PromotionsSection: React.FC<PromotionsSectionProps> = ({ onApplyPromo }) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section id="promotions" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-semibold tracking-[0.25em] text-[#c9a86c] uppercase mb-2">
            Khuyến mãi đặc biệt
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3a2f2a] tracking-tight">
            Ưu Đãi & Combo Thư Giãn
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6b5c54] font-sans leading-relaxed">
            Tiết kiệm hơn khi lựa chọn gói combo chăm sóc da & body hoặc sử dụng mã giảm giá độc quyền dành cho khách hàng Lumé.
          </p>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PROMOTIONS_DATA.map((promo) => (
            <div
              key={promo.id}
              className="bg-[#f7f1eb] rounded-3xl overflow-hidden border border-[#ebe3d9] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image & Discount Badge */}
                <div className="relative h-48 overflow-hidden bg-[#f3e6e0]">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#c9a86c] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {promo.discount}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-[#3a2f2a] mb-2 leading-tight">
                    {promo.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6b5c54] leading-relaxed mb-4">
                    {promo.description}
                  </p>

                  {/* Price Tag if available */}
                  {promo.discountedPrice && (
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-bold text-[#b08d4f] font-sans">
                        {new Intl.NumberFormat('vi-VN').format(promo.discountedPrice)}đ
                      </span>
                      {promo.originalPrice && promo.originalPrice > promo.discountedPrice && (
                        <span className="text-xs text-[#6b5c54]/70 line-through">
                          {new Intl.NumberFormat('vi-VN').format(promo.originalPrice)}đ
                        </span>
                      )}
                    </div>
                  )}

                  {/* Included items */}
                  {promo.servicesIncluded && (
                    <div className="space-y-1 mb-4">
                      <span className="text-[11px] font-semibold text-[#b08d4f] uppercase tracking-wider block">
                        Dịch vụ bao gồm:
                      </span>
                      <ul className="text-xs text-[#3a2f2a] space-y-1">
                        {promo.servicesIncluded.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#c9a86c]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-[11px] text-[#6b5c54] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#c9a86c]" />
                    <span>Hạn sử dụng: {promo.validUntil}</span>
                  </div>
                </div>
              </div>

              {/* Promo Code Copy Bar */}
              <div className="p-4 bg-white border-t border-[#ebe3d9] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 bg-[#f7f1eb] px-3 py-1.5 rounded-xl border border-dashed border-[#c9a86c]">
                  <Tag className="w-3.5 h-3.5 text-[#c9a86c]" />
                  <span className="font-mono text-xs font-bold text-[#3a2f2a]">
                    {promo.code}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(promo.code)}
                    className="p-2 rounded-lg text-[#6b5c54] hover:text-[#3a2f2a] hover:bg-[#f7f1eb] transition-colors cursor-pointer"
                    title="Sao chép mã giảm giá"
                  >
                    {copiedCode === promo.code ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => onApplyPromo(promo.code)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#c9a86c] hover:bg-[#b08d4f] text-white transition-colors cursor-pointer"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
