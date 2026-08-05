import React from 'react';
import { X, Clock, CheckCircle, Sparkles, Calendar, ArrowRight, ShoppingBag, PackageCheck } from 'lucide-react';
import { ServiceItem } from '../types';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onSelectBooking: (service: ServiceItem) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onSelectBooking,
}) => {
  if (!service) return null;

  const isProduct = service.itemType === 'product' || service.duration === 0;

  const formattedPrice = new Intl.NumberFormat('vi-VN').format(service.price) + 'đ';
  const formattedOriginalPrice = (service.originalPrice && service.originalPrice > service.price)
    ? new Intl.NumberFormat('vi-VN').format(service.originalPrice) + 'đ'
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-[#f7f1eb] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#c9a86c]/20 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header / Banner Image */}
        <div className="relative h-56 sm:h-64 overflow-hidden bg-black/20 shrink-0">
          <img
            src={service.image}
            alt={service.title}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80';
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#3a2f2a] via-[#3a2f2a]/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-all cursor-pointer z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <span className="inline-block px-3 py-1 bg-[#c9a86c] text-[10px] font-bold uppercase tracking-wider rounded-full mb-1">
              {isProduct
                ? 'Sản Phẩm Cao Cấp Lumé'
                : service.category === 'spa'
                ? 'Spa Body & Massage'
                : service.category === 'facial'
                ? 'Chăm Sóc Da Facial'
                : service.category === 'nail'
                ? 'Nail Art & Pedicure'
                : 'Làm Tóc & Salon'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
              {service.title}
            </h2>
            {service.subtitle && (
              <p className="text-xs sm:text-sm text-white/80 mt-0.5 font-sans">
                {service.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-[#3a2f2a]">
          {/* Price & Duration Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#ebe3d9] shadow-xs">
            <div className="flex items-center gap-2 text-sm text-[#6b5c54]">
              {isProduct ? (
                <>
                  <PackageCheck className="w-4 h-4 text-[#c9a86c]" />
                  <span>Sản phẩm chính hãng: <strong className="text-[#3a2f2a] font-semibold">Giao hàng toàn quốc</strong></span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-[#c9a86c]" />
                  <span>Thời gian thực hiện: <strong className="text-[#3a2f2a] font-semibold">{service.duration} phút</strong></span>
                </>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#b08d4f] font-sans">
                {formattedPrice}
              </span>
              {formattedOriginalPrice && (
                <span className="text-sm text-[#6b5c54]/70 line-through">
                  {formattedOriginalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Service / Product Description */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#3a2f2a] mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c9a86c]" />
              <span>{isProduct ? 'Thông tin sản phẩm' : 'Mô tả liệu trình'}</span>
            </h3>
            <p className="text-sm text-[#6b5c54] leading-relaxed">
              {service.description}
            </p>
          </div>

          {/* Suitable for */}
          {service.targetSkinOrBody && (
            <div className="bg-[#f3e6e0]/60 p-4 rounded-xl border border-[#c9a86c]/20">
              <span className="text-xs font-semibold text-[#b08d4f] uppercase tracking-wide block mb-1">
                Đối tượng phù hợp:
              </span>
              <p className="text-xs sm:text-sm text-[#3a2f2a]">
                {service.targetSkinOrBody}
              </p>
            </div>
          )}

          {/* Protocol Steps (Các bước thực hiện - Only for services) */}
          {!isProduct && service.protocolSteps && service.protocolSteps.length > 0 && (
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#3a2f2a] mb-3">
                Quy trình thực hiện ({service.protocolSteps.length} bước chuẩn)
              </h3>
              <div className="space-y-2.5">
                {service.protocolSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/80 border border-[#ebe3d9]">
                    <span className="w-6 h-6 rounded-full bg-[#c9a86c] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm text-[#3a2f2a] font-medium leading-relaxed">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Benefits */}
          {service.benefits && service.benefits.length > 0 && (
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#3a2f2a] mb-2">
                {isProduct ? 'Công dụng nổi bật' : 'Hiệu quả mang lại'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {service.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-[#6b5c54]">
                    <CheckCircle className="w-4 h-4 text-[#c9a86c] shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-white border-t border-[#ebe3d9] flex items-center justify-between gap-4 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium text-[#6b5c54] hover:bg-[#f7f1eb] transition-colors cursor-pointer"
          >
            Đóng lại
          </button>

          <button
            onClick={() => {
              onClose();
              onSelectBooking(service);
            }}
            className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-[#c9a86c] hover:bg-[#b08d4f] text-white shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            {isProduct ? (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Đặt Mua Sản Phẩm ({formattedPrice})</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                <span>Đặt Lịch Dịch Vụ Này ({formattedPrice})</span>
              </>
            )}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
