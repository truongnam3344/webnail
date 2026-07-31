import React from 'react';
import { Instagram } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const INSTA_PHOTOS = [
  { id: '1', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80' },
  { id: '2', url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80' },
  { id: '3', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80' },
  { id: '4', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80' },
  { id: '5', url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80' },
  { id: '6', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&q=80' },
  { id: '7', url: 'https://images.unsplash.com/photo-1608248597263-000799965813?w=400&q=80' },
  { id: '8', url: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=400&q=80' },
];

export const InstagramGallery: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-[#f7f4ee] py-12 border-t border-[#e6dec8]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#2d4a3e]">
            {t('insta.sub')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1f2923]">
            {t('insta.title')}
          </h2>
          <p className="text-xs text-[#736860] font-mono">@lumespa_beauty</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {INSTA_PHOTOS.map((item) => (
            <a
              key={item.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-xs border border-[#e8dfcb]"
            >
              <img
                src={item.url}
                alt="Instagram post"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-[#1b3b2b]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
                <Instagram className="w-6 h-6 transform group-hover:scale-110 transition-transform" />
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
