import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, CheckCircle, Sparkles } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [activeBranch, setActiveBranch] = useState<'b1' | 'b2'>('b1');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const branches = {
    b1: {
      name: 'Lumé Spa & Nail - Chi nhánh Quận 1',
      address: '123 Nguyễn Huệ, P. Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      hotline: '0901 234 567',
      mapUrl: 'https://maps.google.com/maps?q=123+Nguy%E1%BB%85n+Hu%E1%BB%87,+Qu%E1%BA%ADn+1,+Ho+Chi+Minh+City&t=&z=15&ie=UTF8&iwloc=&output=embed'
    },
    b2: {
      name: 'Lumé Spa & Nail - Chi nhánh Thảo Điền',
      address: '45 Thảo Điền, P. Thảo Điền, Quận 2, TP. Hồ Chí Minh',
      hotline: '0901 234 888',
      mapUrl: 'https://maps.google.com/maps?q=45+Th%E1%BA%A3o+%C4%90i%E1%BB%81n,+Qu%E1%BA%ADn+2,+Ho+Chi+Minh+City&t=&z=15&ie=UTF8&iwloc=&output=embed'
    }
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setName('');
      setPhone('');
      setMessage('');
    }, 3000);
  };

  const currentBranch = branches[activeBranch];

  return (
    <section id="contact" className="py-20 bg-[#f7f1eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-xs font-semibold tracking-[0.25em] text-[#c9a86c] uppercase mb-2">
            Liên hệ & Chi nhánh
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3a2f2a] tracking-tight">
            Ghé Thăm Lumé Spa & Nail
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6b5c54] font-sans leading-relaxed">
            Chúng tôi luôn sẵn sàng đón tiếp và tư vấn liệu trình phù hợp nhất cho bạn.
          </p>
        </div>

        {/* Branch Selector Tabs */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <button
            onClick={() => setActiveBranch('b1')}
            className={`px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeBranch === 'b1'
                ? 'bg-[#c9a86c] text-white shadow-md'
                : 'bg-white text-[#6b5c54] hover:bg-[#ebe3d9]'
            }`}
          >
            Chi nhánh 1 (Quận 1)
          </button>

          <button
            onClick={() => setActiveBranch('b2')}
            className={`px-6 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeBranch === 'b2'
                ? 'bg-[#c9a86c] text-white shadow-md'
                : 'bg-white text-[#6b5c54] hover:bg-[#ebe3d9]'
            }`}
          >
            Chi nhánh 2 (Thảo Điền Q.2)
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Info Card */}
          <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-[#ebe3d9] shadow-xs space-y-6">
            <h3 className="font-serif text-xl font-bold text-[#3a2f2a]">
              {currentBranch.name}
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-[#6b5c54]">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#c9a86c] shrink-0 mt-0.5" />
                <span>{currentBranch.address}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#c9a86c] shrink-0" />
                <span>Hotline: <strong className="text-[#3a2f2a]">{currentBranch.hotline}</strong></span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#c9a86c] shrink-0" />
                <span>Email: <strong className="text-[#3a2f2a]">hello@lumespa.vn</strong></span>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#c9a86c] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#3a2f2a] block">Giờ mở cửa:</span>
                  <span>08:30 - 20:30 (Thứ 2 - Chủ Nhật, bao gồm Lễ Tết)</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#f7f1eb] flex flex-wrap gap-3">
              <a
                href={`tel:${currentBranch.hotline.replace(/\s/g, '')}`}
                className="flex-1 py-3 px-4 rounded-full bg-[#c9a86c] hover:bg-[#b08d4f] text-white text-xs font-bold text-center transition-colors shadow-xs"
              >
                Gọi Hotline Ngay
              </a>

              <a
                href="https://zalo.me"
                target="_blank"
                rel="noreferrer"
                className="py-3 px-5 rounded-full bg-[#3a2f2a] hover:bg-[#4a3c35] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#c9a86c]" />
                <span>Chat Zalo</span>
              </a>
            </div>

            {/* Quick Contact Form */}
            <div className="pt-6 border-t border-[#f7f1eb]">
              <h4 className="font-serif text-base font-bold text-[#3a2f2a] mb-2">
                Gửi Thắc Mắc & Yêu Cầu Tư Vấn
              </h4>
              {formSubmitted ? (
                <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-medium flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Cảm ơn bạn! Lumé sẽ liên hệ tư vấn trong ít phút.</span>
                </div>
              ) : (
                <form onSubmit={handleSendInquiry} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Họ tên của bạn *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Số điện thoại *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                  />
                  <textarea
                    rows={2}
                    placeholder="Nội dung muốn tư vấn..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-full bg-[#3a2f2a] text-white text-xs font-semibold hover:bg-[#4a3c35] transition-colors"
                  >
                    Gửi yêu cầu
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Map Embed Preview */}
          <div className="lg:col-span-7 bg-white p-3 rounded-3xl border border-[#ebe3d9] shadow-xs h-[520px] overflow-hidden">
            <iframe
              title="Lumé Spa Location Map"
              src={currentBranch.mapUrl}
              className="w-full h-full rounded-2xl border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </div>

      </div>
    </section>
  );
};
