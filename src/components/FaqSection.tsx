import React, { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: '1',
    question: 'What types of products do you offer?',
    answer: 'Chúng tôi cung cấp đầy đủ các dòng sản phẩm hữu cơ tự nhiên chăm sóc da mặt (Skin Care), trang điểm nhẹ (Makeup), chăm sóc tóc (Hair Care), nước hoa (Fragrances), chăm sóc móng (Nail Care) và body care cao cấp.',
  },
  {
    id: '2',
    question: 'Do you offer any discounts or promotions?',
    answer: 'Có! Lumé Spa thường xuyên có các chương trình giảm giá từ 15% - 50% cho khách hàng đặt lịch online, tặng voucher giảm 50k chào mừng và tích điểm đổi quà VIP.',
  },
  {
    id: '3',
    question: 'What payment methods do you accept?',
    answer: 'Chúng tôi chấp nhận thanh toán tiền mặt, chuyển khoản ngân hàng (QR Code), ví điện tử MoMo, ZaloPay, VNPay và tất cả các loại thẻ tín dụng Visa/Mastercard.',
  },
  {
    id: '4',
    question: 'How can I provide feedback about my experience?',
    answer: 'Bạn có thể đánh giá trực tiếp trên trang Đánh Giá của hệ thống, gửi email cho chúng tôi hoặc thông qua bảng khảo sát sau khi kết thúc buổi làm đẹp tại spa.',
  },
  {
    id: '5',
    question: 'Do you offer customer support?',
    answer: 'Đội ngũ CSKH của Lumé Spa hỗ trợ 24/7 qua Hotline 1900 6868, Zalo OA và Chatbot tư vấn trực tuyến trên website.',
  },
  {
    id: '6',
    question: 'How do I track my order?',
    answer: 'Bạn có thể vào mục "Tra Cứu Lịch Hẹn" ở góc phải màn hình, nhập Mã Lịch Hẹn hoặc Số Điện Thoại để kiểm tra trạng thái lịch hoặc đơn hàng dịch vụ.',
  },
];

interface FaqProps {
  onOpenContact?: () => void;
}

export const FaqSection: React.FC<FaqProps> = ({ onOpenContact }) => {
  const { t } = useLanguage();
  const [openId, setOpenId] = useState<string>('2'); // default open second item as in video

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? '' : id);
  };

  return (
    <section id="faq" className="bg-[#f7f4ee] py-16 border-t border-[#e6dec8]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#2d4a3e]">
            {t('faq.sub')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1f2923]">
            {t('faq.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Accordion List */}
          <div className="lg:col-span-8 space-y-3">
            {FAQS.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? 'bg-[#2d4a3e] text-white border-[#2d4a3e] shadow-md'
                      : 'bg-white text-[#1f2923] border-[#e8dfcb] hover:border-[#2d4a3e]/40'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-white' : 'text-[#2d4a3e]'
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-white/90 leading-relaxed border-t border-white/20">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Contact Card */}
          <div className="lg:col-span-4 bg-[#1b3b2b] text-white rounded-3xl p-8 space-y-6 shadow-xl border border-[#12281d]">
            <div className="w-12 h-12 rounded-2xl bg-[#2d4a3e] flex items-center justify-center text-[#e6d3ad]">
              <MessageCircle className="w-6 h-6" />
            </div>

            <h3 className="text-2xl font-serif font-bold text-white leading-snug">
              Have more questions?
            </h3>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Đội ngũ tư vấn viên của Lumé Spa luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn về liệu trình & sản phẩm.
            </p>

            <button
              onClick={() => {
                if (onOpenContact) onOpenContact();
                else {
                  const contactElem = document.getElementById('contact');
                  if (contactElem) contactElem.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full py-3.5 bg-[#e6d3ad] hover:bg-white text-[#1b3b2b] text-xs font-extrabold uppercase tracking-wider rounded-full transition-all shadow-md cursor-pointer"
            >
              Contact Us
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
