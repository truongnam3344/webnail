import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle, User, X } from 'lucide-react';
import { REVIEWS_DATA } from '../data/reviewsData';
import { Review } from '../types';

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>(REVIEWS_DATA);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comment) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      customerName: name,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80`,
      rating,
      serviceName: serviceName || 'Trải nghiệm dịch vụ tại Lumé',
      date: new Date().toLocaleDateString('vi-VN'),
      comment,
      verified: true,
    };

    setReviews([newReview, ...reviews]);
    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
      setShowForm(false);
      setName('');
      setServiceName('');
      setComment('');
    }, 2000);
  };

  return (
    <section id="reviews" className="py-20 bg-[#f7f1eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
          <div>
            <span className="inline-block text-xs font-semibold tracking-[0.25em] text-[#c9a86c] uppercase mb-2">
              Khách hàng nói gì về Lumé
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3a2f2a] tracking-tight">
              Cảm Nhận & Đánh Giá Tận Tâm
            </h2>
          </div>

          <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-3xl border border-[#ebe3d9] shadow-xs">
            <div className="text-center pr-4 border-r border-[#ebe3d9]">
              <span className="text-3xl font-bold text-[#3a2f2a] font-serif">4.9</span>
              <div className="flex text-[#c9a86c] text-xs">
                {'★'.repeat(5)}
              </div>
            </div>
            <div>
              <span className="text-sm font-semibold text-[#3a2f2a] block">
                1,200+ Đánh giá hài lòng
              </span>
              <button
                onClick={() => setShowForm(true)}
                className="text-xs text-[#b08d4f] hover:underline font-medium flex items-center gap-1 mt-0.5 cursor-pointer"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>Viết đánh giá của bạn</span>
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 shadow-xs border border-[#ebe3d9] flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 text-[#c9a86c] mb-3">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-[#c9a86c]" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-[#3a2f2a] leading-relaxed mb-4 italic font-sans">
                  "{rev.comment}"
                </p>
              </div>

              {/* User info */}
              <div className="pt-4 border-t border-[#f7f1eb] flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.customerName}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
                  }}
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-[#c9a86c]/30"
                />
                <div>
                  <h4 className="text-xs font-bold text-[#3a2f2a] flex items-center gap-1">
                    <span>{rev.customerName}</span>
                    {rev.verified && (
                      <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" title="Đã xác thực dịch vụ" />
                    )}
                  </h4>
                  <span className="text-[11px] text-[#6b5c54] block line-clamp-1">
                    {rev.serviceName}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Submit Review Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#f7f1eb] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#c9a86c]/20 relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 p-2 text-[#6b5c54] hover:text-[#3a2f2a] rounded-full hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-2xl font-bold text-[#3a2f2a] mb-2">
              Gửi Đánh Giá Của Bạn
            </h3>
            <p className="text-xs text-[#6b5c54] mb-6">
              Ý kiến của bạn là động lực lớn nhất giúp Lumé Spa & Nail không ngừng nâng cao chất lượng dịch vụ.
            </p>

            {successMessage ? (
              <div className="text-center py-8 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200">
                <CheckCircle className="w-10 h-10 mx-auto text-emerald-600 mb-2" />
                <p className="font-semibold text-sm">Cảm ơn bạn đã gửi đánh giá!</p>
                <p className="text-xs mt-1">Đánh giá của bạn đã được ghi nhận vào hệ thống.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3a2f2a] mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3a2f2a] mb-1">
                    Dịch vụ đã trải nghiệm
                  </label>
                  <input
                    type="text"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="VD: Massage Body Đá Nóng, Nail Gel..."
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3a2f2a] mb-1">
                    Mức độ hài lòng (1 - 5 sao)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-2xl cursor-pointer transition-transform hover:scale-125 ${
                          star <= rating ? 'text-[#c9a86c]' : 'text-[#ebe3d9]'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3a2f2a] mb-1">
                    Nội dung đánh giá *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Chia sẻ trải nghiệm của bạn về không gian, thái độ KTV, chất lượng dịch vụ..."
                    className="w-full p-4 text-xs sm:text-sm bg-white rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#c9a86c] hover:bg-[#b08d4f] text-white text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer"
                >
                  Gửi đánh giá ngay
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
