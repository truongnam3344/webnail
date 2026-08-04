import React from 'react';
import { Instagram } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth, INITIAL_INSTA_PHOTOS } from '../context/AuthContext';

export const InstagramGallery: React.FC = () => {
  const { t } = useLanguage();
  const { instaPhotos } = useAuth();

  const photosToDisplay = instaPhotos && instaPhotos.length > 0 ? instaPhotos : INITIAL_INSTA_PHOTOS;

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
          {photosToDisplay.map((item) => (
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
