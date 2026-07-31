import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, MessageSquarePlus, CheckCircle, X, Sparkles, User, ThumbsUp, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Review } from '../types';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80',
];

const SPA_SERVICES = [
  'Cấy Tinh Chất Collagen & Vàng 24K',
  'Gội Đầu Dưỡng Sinh Thảo Dược Lumé',
  'Massage Body Thư Giãn Tinh Dầu',
  'Massage Đá Nóng Năng Lượng Núi Lửa',
  'Chăm Sóc Da Mặt Chuyên Sâu Deep Cleansing',
  'Chăm Sóc Móng & Sơn Gel Cao Cấp',
  'Chà Gót Hồng & Chăm Sóc Móng Chân',
  'Gội Đầu Thảo Dược & Sấy Tạo Kiểu'
];

export const TestimonialsSection: React.FC = () => {
  const { t } = useLanguage();
  const { reviews, addReview, currentUser } = useAuth();
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Form states
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [role, setRole] = useState('Khách hàng Thân thiết');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [serviceName, setServiceName] = useState(SPA_SERVICES[0]);
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);

  // Filter approved reviews for display
  const approvedReviews = reviews && reviews.length > 0 
    ? reviews.filter(r => r.status !== 'hidden')
    : [];

  const displayReviews = approvedReviews.length > 0 ? approvedReviews : [
    {
      id: 'rev_default_1',
      customerName: 'Bessie Cooper',
      role: 'Khách hàng VIP',
      avatar: PRESET_AVATARS[0],
      title: "Trải nghiệm tuyệt vời nhất cho làn da!",
      comment: 'Lumé Spa thực sự là chốn bình yên yêu thích của tôi sau những tuần làm việc căng thẳng. Liệu trình cấy Collagen Vàng 24K giúp làn da căng bóng và khỏe mạnh rõ rệt chỉ sau 1 buổi!',
      rating: 5,
      serviceName: 'Cấy Tinh Chất Collagen & Vàng 24K',
      date: '2026-07-20',
      verified: true,
      status: 'approved'
    }
  ];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + displayReviews.length) % displayReviews.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % displayReviews.length);
  };

  const current = displayReviews[activeIndex] || displayReviews[0];

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addReview({
      customerName: customerName.trim() || 'Khách hàng Lumé',
      role: role || 'Khách hàng Thân thiết',
      avatar: selectedAvatar,
      title: title.trim() || 'Trải nghiệm ấn tượng tại Lumé Spa',
      comment: comment.trim(),
      rating: rating,
      serviceName: serviceName,
      verified: true,
      status: 'approved',
    });

    setIsModalOpen(false);
    setShowSuccessToast(true);
    setActiveIndex(0); // Switch active card to newly added review

    // Reset form
    setTitle('');
    setComment('');
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 4000);
  };

  return (
    <section id="reviews" className="bg-[#f7f4ee] py-16 border-t border-[#e6dec8]/60 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2d4a3e] bg-[#e8dfcb]/60 px-3 py-1 rounded-full border border-[#2d4a3e]/10">
              {t('testimonials.sub') || 'Ý Kiến & Cảm Nhận Thực Tế'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1f2923]">
            {t('testimonials.title') || 'Khách Hàng Nói Gì Về Lumé Spa'}
          </h2>
          <p className="text-sm text-[#736860] max-w-xl mx-auto font-sans">
            Hàng ngàn khách hàng đã trải nghiệm dịch vụ chăm sóc da, massage gội đầu dưỡng sinh & làm đẹp tại Lumé Spa.
          </p>
        </div>

        {/* Customer Avatars Selector Row */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 py-2 overflow-x-auto pb-3">
          {displayReviews.map((item, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={item.id}
                onClick={() => setActiveIndex(idx)}
                className={`relative transition-all cursor-pointer rounded-full p-1 shrink-0 ${
                  isActive
                    ? 'ring-2 ring-[#2d4a3e] ring-offset-2 ring-offset-[#f7f4ee] scale-110 shadow-md'
                    : 'opacity-60 hover:opacity-100 hover:scale-105'
                }`}
                title={item.customerName}
              >
                <img
                  src={item.avatar || PRESET_AVATARS[0]}
                  alt={item.customerName}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover shadow-xs"
                />
              </button>
            );
          })}
        </div>

        {/* Active Testimonial Card */}
        <div className="relative bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-[#e8dfcb] space-y-6 text-center transition-all">
          <Quote className="w-10 h-10 text-[#2d4a3e]/20 mx-auto" />

          {current.serviceName && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#f4eee2] text-[#2d4a3e] border border-[#e2d8c3]">
              <Sparkles className="w-3.5 h-3.5 text-[#2d4a3e]" />
              <span>{current.serviceName}</span>
            </div>
          )}

          <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1f2923]">
            "{current.title || 'Dịch vụ vô cùng chỉn chu và chu đáo'}"
          </h3>

          <p className="text-sm sm:text-base text-[#524943] leading-relaxed max-w-2xl mx-auto font-sans italic">
            "{current.comment}"
          </p>

          <div className="flex justify-center items-center gap-1 text-amber-500">
            {[...Array(current.rating || 5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>

          <div>
            <div className="font-bold text-base text-[#1f2923] font-serif flex items-center justify-center gap-2">
              <span>{current.customerName}</span>
              {current.verified && (
                <ShieldCheck className="w-4 h-4 text-emerald-600" title="Khách hàng đã xác thực dịch vụ" />
              )}
            </div>
            <div className="text-xs text-[#736860] uppercase tracking-wider mt-0.5">
              {current.role || 'Khách hàng Lumé'} {current.date ? `• ${current.date}` : ''}
            </div>
          </div>

          {/* Navigation Controls & Write Review Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#f2ede4]">
            <div className="flex items-center gap-3">
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
              <span className="text-xs text-[#8c827a] font-medium">
                {activeIndex + 1} / {displayReviews.length}
              </span>
            </div>

            {/* Action to open comment form */}
            <button
              onClick={() => {
                if (currentUser) setCustomerName(currentUser.name);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2d4a3e] hover:bg-[#1f342b] text-white font-medium text-xs sm:text-sm transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4 text-amber-300" />
              <span>Viết Đánh Giá & Ý Kiến Của Bạn</span>
            </button>
          </div>

        </div>

      </div>

      {/* Success Notification Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2d4a3e] text-white px-5 py-3.5 rounded-2xl shadow-xl border border-amber-300/30 flex items-center gap-3 animate-slide-up">
          <CheckCircle className="w-5 h-5 text-amber-300 shrink-0" />
          <div>
            <div className="font-bold text-sm text-white">Cảm ơn đánh giá của bạn!</div>
            <div className="text-xs text-amber-100">Ý kiến của bạn đã được cập nhật thành công trên trang chủ Lumé Spa.</div>
          </div>
        </div>
      )}

      {/* WRITE REVIEW MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#e8dfcb] relative space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#f4eee2] hover:bg-[#e2d8c3] text-[#2d4a3e] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Title */}
            <div className="space-y-1 pr-8">
              <div className="flex items-center gap-2 text-[#2d4a3e]">
                <MessageSquarePlus className="w-5 h-5 text-[#2d4a3e]" />
                <span className="text-xs font-bold uppercase tracking-widest">Đánh Giá Dịch Vụ</span>
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#1f2923]">Gửi Ý Kiến & Đánh Giá</h3>
              <p className="text-xs text-[#736860]">
                Chia sẻ trải nghiệm của bạn tại Lumé Spa để giúp chúng tôi hoàn thiện dịch vụ tốt hơn!
              </p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-left">
              
              {/* Rating Selector */}
              <div className="space-y-1.5 bg-[#fbf9f4] p-3.5 rounded-2xl border border-[#ece4d4]">
                <label className="text-xs font-bold text-[#1f2923] block">
                  Đánh giá số sao chất lượng:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-amber-400 transition-transform hover:scale-125 cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          (hoverRating || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#2d4a3e] ml-2">
                    {rating === 5 ? '5/5 • Rất hài lòng ⭐⭐⭐⭐⭐' : `${rating}/5 sao`}
                  </span>
                </div>
              </div>

              {/* Service Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1f2923] block">
                  Dịch vụ bạn đã trải nghiệm:
                </label>
                <select
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="w-full text-sm bg-white border border-[#d6cbbe] rounded-xl px-3.5 py-2.5 text-[#1f2923] focus:ring-2 focus:ring-[#2d4a3e] outline-none"
                >
                  {SPA_SERVICES.map((srv, i) => (
                    <option key={i} value={srv}>
                      {srv}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title & Comment */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1f2923] block">
                  Tiêu đề ngắn gọn:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Gội đầu thảo dược siêu thư giãn, kỹ thuật viên nhiệt tình..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm bg-white border border-[#d6cbbe] rounded-xl px-3.5 py-2.5 text-[#1f2923] focus:ring-2 focus:ring-[#2d4a3e] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#1f2923] block">
                  Ý kiến & cảm nhận chi tiết của bạn:
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Viết trải nghiệm thực tế của bạn về không gian, kỹ thuật viên, hương thơm, tay nghề..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full text-sm bg-white border border-[#d6cbbe] rounded-xl px-3.5 py-2.5 text-[#1f2923] focus:ring-2 focus:ring-[#2d4a3e] outline-none resize-none"
                />
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1f2923] block">Tên của bạn:</label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-sm bg-white border border-[#d6cbbe] rounded-xl px-3.5 py-2.5 text-[#1f2923] focus:ring-2 focus:ring-[#2d4a3e] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#1f2923] block">Danh xưng / Thẻ:</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full text-sm bg-white border border-[#d6cbbe] rounded-xl px-3.5 py-2.5 text-[#1f2923] focus:ring-2 focus:ring-[#2d4a3e] outline-none"
                  >
                    <option value="Khách hàng Thân thiết">Khách hàng Thân thiết</option>
                    <option value="Khách hàng VIP">Khách hàng VIP</option>
                    <option value="Khách hàng Lần đầu">Khách hàng Lần đầu</option>
                    <option value="Khách hàng Đôi">Khách hàng Đôi</option>
                  </select>
                </div>
              </div>

              {/* Avatar Selector */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-[#1f2923] block">Chọn hình đại diện của bạn:</label>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {PRESET_AVATARS.map((avt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(avt)}
                      className={`relative rounded-full p-0.5 cursor-pointer shrink-0 transition-transform ${
                        selectedAvatar === avt ? 'ring-2 ring-[#2d4a3e] ring-offset-1 scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={avt} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#2d4a3e] hover:bg-[#1f342b] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  <ThumbsUp className="w-4 h-4 text-amber-300" />
                  <span>Gửi Đánh Giá Ngay</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </section>
  );
};
