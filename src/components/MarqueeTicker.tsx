import React from 'react';

const ITEMS = [
  'Skin Care',
  'Makeup',
  'Hair Care',
  'Fragrances',
  'Nail Care',
  'Body Care',
  'Accessories & Tools',
  'Organic Spa',
  'Master Technicians',
  'VIP Treatment Rooms',
];

export const MarqueeTicker: React.FC = () => {
  return (
    <div className="bg-[#1b3b2b] text-white py-3.5 overflow-hidden border-y border-[#12281d] select-none">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS].map((item, idx) => (
          <div key={idx} className="flex items-center mx-6">
            <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase font-sans text-[#e6d3ad]">
              {item}
            </span>
            <span className="ml-6 text-emerald-400 font-bold">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};
