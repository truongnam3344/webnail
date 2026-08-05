import React, { useState } from 'react';
import { X, Calendar, User, Clock, Eye, Share2, Check, ArrowRight, Sparkles, Tag, BookOpen } from 'lucide-react';
import { BlogArticle } from '../types';

interface BlogDetailModalProps {
  blog: BlogArticle | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking?: () => void;
}

export const BlogDetailModal: React.FC<BlogDetailModalProps> = ({
  blog,
  isOpen,
  onClose,
  onOpenBooking
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !blog) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Process text paragraphs and markdown headings
  const renderFormattedContent = (content?: string) => {
    if (!content) return <p className="text-gray-600 italic">Nội dung bài viết đang được cập nhật...</p>;

    const lines = content.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-4" />;

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-xl font-serif font-bold text-[#1f2923] mt-6 mb-3 flex items-center gap-2 border-b border-[#e8dfcb] pb-2">
            <Sparkles className="w-5 h-5 text-[#2d4a3e]" />
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-2xl font-serif font-bold text-[#1f2923] mt-8 mb-4 border-l-4 border-[#2d4a3e] pl-3">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('- ')) {
        return (
          <li key={idx} className="ml-5 list-disc text-sm text-[#3d4740] my-1 leading-relaxed">
            {trimmed.replace('- ', '')}
          </li>
        );
      }
      return (
        <p key={idx} className="text-sm sm:text-base text-[#3d4740] leading-relaxed my-2">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-[#e8dfcb] relative animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8dfcb] bg-[#fcfbfa]">
          <div className="flex items-center gap-2 text-xs font-bold text-[#2d4a3e] uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Lumé Beauty Blog</span>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar">
          
          {/* Category & Title */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-[#2d4a3e] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {blog.category}
              </span>
              {blog.readTime && (
                <span className="bg-[#f2ece1] text-[#2d4a3e] text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {blog.readTime}
                </span>
              )}
              {blog.views && (
                <span className="text-xs text-gray-500 flex items-center gap-1 ml-auto">
                  <Eye className="w-3.5 h-3.5" />
                  {blog.views.toLocaleString()} lượt xem
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#1f2923] leading-tight">
              {blog.title}
            </h1>

            {/* Author and Date Meta */}
            <div className="flex items-center gap-4 text-xs sm:text-sm text-[#736860] pt-2 border-t border-[#f2ede4]">
              <div className="flex items-center gap-1.5 font-medium text-[#1f2923]">
                <div className="w-7 h-7 rounded-full bg-[#2d4a3e] text-white flex items-center justify-center font-bold text-xs">
                  {blog.author.charAt(0)}
                </div>
                <span>Tác giả: {blog.author}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-[#2d4a3e]" />
                <span>{blog.date}</span>
              </div>
            </div>
          </div>

          {/* Featured Hero Image */}
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[#f5f0e6] shadow-sm border border-[#e8dfcb]">
            <img
              src={blog.image}
              alt={blog.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Summary Quote Box */}
          <div className="bg-[#f7f3eb] border-l-4 border-[#2d4a3e] p-4 sm:p-5 rounded-r-xl shadow-xs italic text-sm sm:text-base text-[#2d4a3e] font-serif leading-relaxed">
            "{blog.summary}"
          </div>

          {/* Detailed Content */}
          <div className="prose max-w-none text-[#2b332d] space-y-4 pt-2">
            {renderFormattedContent(blog.content)}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="pt-4 border-t border-[#e8dfcb] flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-[#736860]" />
              <span className="text-xs font-bold text-[#736860]">Thẻ bài viết:</span>
              {blog.tags.map((tag, i) => (
                <span key={i} className="text-xs bg-[#f2ece1] text-[#2d4a3e] px-2.5 py-1 rounded-md font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Action Card */}
          <div className="bg-[#2d4a3e] text-white rounded-2xl p-6 sm:p-8 space-y-4 text-center mt-8 relative overflow-hidden">
            <div className="relative z-10 space-y-3">
              <h3 className="text-xl sm:text-2xl font-serif font-bold">
                Trải Nghiệm Liệu Trình Chăm Sóc Da Tại Lumé Spa
              </h3>
              <p className="text-xs sm:text-sm text-white/80 max-w-md mx-auto">
                Đặt lịch trực tuyến ngay hôm nay để nhận ưu đãi lên đến 30% cho lần trải nghiệm đầu tiên cùng đội ngũ chuyên gia giàu kinh nghiệm.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                {onOpenBooking && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenBooking();
                    }}
                    className="w-full sm:w-auto px-6 py-3 bg-[#e6dec8] hover:bg-white text-[#1f2923] font-bold text-sm rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Đặt Lịch Ngay</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-300" />
                      <span>Đã sao chép liên kết!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>Chia sẻ bài viết</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#fcfbfa] border-t border-[#e8dfcb] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-full transition-all cursor-pointer"
          >
            Đóng bài viết
          </button>
        </div>

      </div>
    </div>
  );
};
