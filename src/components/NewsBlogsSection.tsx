import React, { useState } from 'react';
import { ArrowRight, Calendar, User, Clock, Eye, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { BlogArticle } from '../types';
import { BlogDetailModal } from './BlogDetailModal';

interface NewsBlogsSectionProps {
  onOpenBooking?: () => void;
}

export const NewsBlogsSection: React.FC<NewsBlogsSectionProps> = ({ onOpenBooking }) => {
  const { t } = useLanguage();
  const { blogsCatalog } = useAuth();

  const [selectedBlog, setSelectedBlog] = useState<BlogArticle | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayBlogs = showAll ? blogsCatalog : blogsCatalog.slice(0, 3);

  const handleOpenBlog = (blog: BlogArticle) => {
    setSelectedBlog(blog);
  };

  return (
    <section id="blogs" className="bg-[#f7f4ee] py-16 border-t border-[#e6dec8]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2d4a3e] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {t('news.sub')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1f2923]">
              {t('news.title')}
            </h2>
          </div>

          <button 
            onClick={() => setShowAll(!showAll)}
            className="px-5 py-2.5 rounded-full border border-[#2d4a3e] text-[#2d4a3e] hover:bg-[#2d4a3e] hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
          >
            <span>{showAll ? 'Thu Gọn Bài Viết' : `${t('news.viewall')} (${blogsCatalog.length})`}</span>
            <ArrowRight className={`w-3.5 h-3.5 transition-transform ${showAll ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayBlogs.map((blog) => (
            <article
              key={blog.id}
              onClick={() => handleOpenBlog(blog)}
              className="bg-white rounded-2xl overflow-hidden border border-[#e8dfcb] shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-[#f5f0e6]">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#2d4a3e] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {blog.category}
                  </span>
                  {blog.readTime && (
                    <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {blog.readTime}
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-[#736860]">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#2d4a3e]" />
                      {blog.author}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#2d4a3e]" />
                      {blog.date}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-[#1f2923] group-hover:text-[#2d4a3e] transition-colors leading-snug line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="text-xs text-[#524943] line-clamp-3 leading-relaxed">
                    {blog.summary}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-3 border-t border-[#f2ede4] flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenBlog(blog);
                  }}
                  className="inline-flex items-center gap-2 text-xs font-extrabold text-[#2d4a3e] group-hover:gap-3 transition-all cursor-pointer"
                >
                  <span>Đọc Chi Tiết</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                {blog.views && (
                  <span className="text-[11px] text-[#8c8178] flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {blog.views}
                  </span>
                )}
              </div>

            </article>
          ))}
        </div>

      </div>

      {/* Blog Detail Reading Modal */}
      <BlogDetailModal
        blog={selectedBlog}
        isOpen={!!selectedBlog}
        onClose={() => setSelectedBlog(null)}
        onOpenBooking={onOpenBooking}
      />
    </section>
  );
};
