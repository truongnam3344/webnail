import React from 'react';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BlogArticle {
  id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  image: string;
  summary: string;
}

const BLOGS: BlogArticle[] = [
  {
    id: '1',
    title: 'Your Ultimate Guide to Healthy, Radiant Skin',
    author: 'Jenny Alexander',
    date: '22 January 2025',
    category: 'Skincare Tips',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
    summary: 'Bí quyết chăm sóc da hàng ngày tại nhà giúp làn da luôn duy trì độ ẩm tự nhiên và phục hồi hàng rào bảo vệ da.',
  },
  {
    id: '2',
    title: 'The Best Body Care Products for Every Skin Type',
    author: 'Jenny Alexander',
    date: '18 January 2025',
    category: 'Body Care',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80',
    summary: 'Lựa chọn dầu dưỡng body hữu cơ và kem dưỡng phù hợp cho từng mùa trong năm giúp cơ thể luôn ngạt ngào hương thơm dịu nhẹ.',
  },
  {
    id: '3',
    title: 'Why Sun Protection is Essential for Healthy Skin',
    author: 'Jenny Alexander',
    date: '12 January 2025',
    category: 'Beauty Guide',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80',
    summary: 'Tầm quan trọng của việc dùng kem chống nắng phổ rộng mỗi ngày để chống lão hóa sớm và tàn nhang.',
  },
];

export const NewsBlogsSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="blogs" className="bg-[#f7f4ee] py-16 border-t border-[#e6dec8]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#2d4a3e]">
              {t('news.sub')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1f2923]">
              {t('news.title')}
            </h2>
          </div>

          <button className="px-5 py-2.5 rounded-full border border-[#2d4a3e] text-[#2d4a3e] hover:bg-[#2d4a3e] hover:text-white text-xs font-bold transition-all cursor-pointer">
            {t('news.viewall')}
          </button>
        </div>

        {/* 3 Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOGS.map((blog) => (
            <article
              key={blog.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#e8dfcb] shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-[#f5f0e6]">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#2d4a3e] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                    {blog.category}
                  </span>
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

                  <h3 className="font-serif font-bold text-lg text-[#1f2923] group-hover:text-[#2d4a3e] transition-colors leading-snug">
                    {blog.title}
                  </h3>

                  <p className="text-xs text-[#524943] line-clamp-2 leading-relaxed">
                    {blog.summary}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-[#f2ede4]">
                <button className="inline-flex items-center gap-2 text-xs font-extrabold text-[#2d4a3e] hover:gap-3 transition-all cursor-pointer">
                  <span>Read More</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
