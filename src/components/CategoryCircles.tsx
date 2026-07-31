import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export interface CategoryCircleItem {
  id: string;
  key: string;
  defaultName: string;
  image: string;
}

const CATEGORIES: CategoryCircleItem[] = [
  {
    id: 'skin-care',
    key: 'cat.skincare',
    defaultName: 'Skin Care',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=300&q=80',
  },
  {
    id: 'makeup',
    key: 'cat.makeup',
    defaultName: 'Makeup',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300&q=80',
  },
  {
    id: 'hair-care',
    key: 'cat.haircare',
    defaultName: 'Hair Care',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&q=80',
  },
  {
    id: 'fragrances',
    key: 'cat.fragrances',
    defaultName: 'Fragrances',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&q=80',
  },
  {
    id: 'nail-care',
    key: 'cat.nailcare',
    defaultName: 'Nail Care',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=300&q=80',
  },
  {
    id: 'body-care',
    key: 'cat.bodycare',
    defaultName: 'Body Care',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=300&q=80',
  },
  {
    id: 'accessories',
    key: 'cat.accessories',
    defaultName: 'Accessories & Tools',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&q=80',
  },
];

interface CategoryCirclesProps {
  activeCategory?: string;
  onSelectCategory?: (id: string) => void;
}

export const CategoryCircles: React.FC<CategoryCirclesProps> = ({
  activeCategory = 'all',
  onSelectCategory,
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-[#f7f4ee] py-8 border-b border-[#e6dec8]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-6 sm:gap-10 overflow-x-auto no-scrollbar py-2">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            const displayName = t(cat.key) || cat.defaultName;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory && onSelectCategory(cat.id)}
                className="flex flex-col items-center group flex-shrink-0 cursor-pointer transition-transform hover:-translate-y-1 focus:outline-none"
              >
                <div
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 transition-all ${
                    isSelected
                      ? 'ring-2 ring-[#2d4a3e] ring-offset-2 ring-offset-[#f7f4ee]'
                      : 'border border-[#e0d6c3] group-hover:border-[#2d4a3e]'
                  }`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-white shadow-xs">
                    <img
                      src={cat.image}
                      alt={displayName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
                <span className="mt-3 text-xs sm:text-sm font-semibold text-[#2d2825] group-hover:text-[#2d4a3e] transition-colors whitespace-nowrap">
                  {displayName}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
