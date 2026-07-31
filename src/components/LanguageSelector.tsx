import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES, Language } from '../data/translations';

interface LanguageSelectorProps {
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ compact = false }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left shrink-0" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded-full border border-[#2d4a3e]/30 bg-white hover:bg-[#f7f4ee] transition-all cursor-pointer shadow-2xs whitespace-nowrap shrink-0 ${
          compact ? 'px-2 py-1 text-xs font-semibold' : 'px-2.5 py-1.5 text-xs font-bold text-[#1f2923]'
        }`}
        title="Choose Language / Chọn Ngôn Ngữ"
      >
        <Globe className="w-3.5 h-3.5 text-[#2d4a3e] shrink-0" />
        <span className="text-sm shrink-0">{currentLang.flag}</span>
        <span className="hidden sm:inline font-medium text-[#1f2923] whitespace-nowrap">{currentLang.name}</span>
        <ChevronDown className="w-3 h-3 text-[#736860] shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-[#e8dfcb] py-1.5 z-50 animate-in fade-in duration-150">
          <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#736860] border-b border-[#f2ede4] mb-1">
            Language / Ngôn Ngữ
          </div>
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as Language);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-[#f7f4ee] transition-colors cursor-pointer ${
                  isSelected ? 'font-bold text-[#2d4a3e] bg-[#f7f4ee]/80' : 'text-[#1f2923]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.name}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#2d4a3e]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
