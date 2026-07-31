import React, { useState, useEffect } from 'react';
import { Calendar, Search, Menu, X, User, LogOut, ShieldCheck, UserCheck, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface HeaderProps {
  onOpenBooking: (serviceId?: string) => void;
  onOpenLookup: () => void;
  onOpenAuth: () => void;
  onOpenPortal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBooking,
  onOpenLookup,
  onOpenAuth,
  onOpenPortal,
}) => {
  const { currentUser, logout } = useAuth();
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Track active section based on scroll
      const sections = ['home', 'services', 'pricing', 'promotions', 'booking', 'reviews', 'facility', 'contact'];
      for (const sectionId of sections) {
        const elem = document.getElementById(sectionId);
        if (elem) {
          const rect = elem.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: t('nav.home'), href: '#home' },
    { id: 'about', label: t('nav.about'), href: '#about' },
    { id: 'services', label: t('nav.services'), href: '#best-sellers' },
    { id: 'reviews', label: t('nav.reviews'), href: '#reviews' },
    { id: 'faq', label: t('nav.faq'), href: '#faq' },
    { id: 'contact', label: t('nav.contact'), href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-purple-100 text-purple-800 rounded-md border border-purple-200">Admin</span>;
      case 'staff':
        return <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-blue-100 text-blue-800 rounded-md border border-blue-200">KTV Staff</span>;
      case 'sales':
        return <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800 rounded-md border border-amber-200">Sales</span>;
      case 'accountant':
        return <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-indigo-100 text-indigo-800 rounded-md border border-indigo-200">Kế Toán</span>;
      default:
        return <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800 rounded-md border border-emerald-200">Khách Hàng</span>;
    }
  };

  return (
    <header
      id="header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#f7f4ee]/95 backdrop-blur-md shadow-md border-b border-[#e6dec8]/60 py-3'
          : 'bg-[#f7f4ee]/85 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
            className="group flex flex-col items-start"
          >
            <span className="font-serif text-2xl font-bold tracking-tight text-[#1f2923] group-hover:text-[#2d4a3e] transition-colors">
              Lumé
            </span>
            <span className="text-[10px] font-sans font-extrabold tracking-[0.25em] text-[#2d4a3e] -mt-1 uppercase">
              Beauty & Spa
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-3 xl:space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`text-xs xl:text-sm font-medium transition-colors relative py-1 whitespace-nowrap ${
                  activeSection === link.id
                    ? 'text-[#2d4a3e] font-bold'
                    : 'text-[#524943] hover:text-[#2d4a3e]'
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#2d4a3e] rounded-full" />
                )}
              </a>
            ))}
          </nav>

          {/* Action Buttons & Auth Account */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* USER LOGIN / ACCOUNT BADGE */}
            {currentUser ? (
              <div className="relative shrink-0">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white border border-[#c9a86c]/40 hover:border-[#c9a86c] transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
                >
                  <img
                    src={currentUser.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80'}
                    alt={currentUser.name}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover shrink-0"
                  />
                  <div className="text-left hidden sm:block max-w-[100px] xl:max-w-[140px]">
                    <div className="text-xs font-bold text-[#3a2f2a] leading-tight truncate flex items-center gap-1">
                      <span className="truncate">{currentUser.name}</span>
                      {currentUser.role === 'customer' && (
                        <span className="shrink-0 px-1.5 py-0.2 text-[9px] bg-amber-100 text-amber-800 font-extrabold rounded-full border border-amber-300">
                          💎 {currentUser.rewardPoints || 0}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5">{getRoleBadge(currentUser.role)}</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#6b5c54] shrink-0" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-[#ebe3d9] py-2 z-50 animate-in fade-in duration-150">
                    <div className="px-4 py-2 border-b border-[#f7f1eb] bg-[#f7f1eb]/50">
                      <div className="text-xs font-bold text-[#3a2f2a]">{currentUser.name}</div>
                      <div className="text-[10px] text-[#6b5c54] truncate">{currentUser.email}</div>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenPortal();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-[#3a2f2a] hover:bg-[#f7f1eb] flex items-center gap-2 cursor-pointer"
                    >
                      {currentUser.role === 'admin' && <ShieldCheck className="w-4 h-4 text-purple-600" />}
                      {currentUser.role === 'staff' && <UserCheck className="w-4 h-4 text-blue-600" />}
                      {currentUser.role === 'sales' && <Sparkles className="w-4 h-4 text-amber-600" />}
                      {currentUser.role === 'accountant' && <ShieldCheck className="w-4 h-4 text-indigo-600" />}
                      {currentUser.role === 'customer' && <Sparkles className="w-4 h-4 text-emerald-600" />}
                      <span>
                        {currentUser.role === 'admin' && 'Bảng Quản Trị Admin'}
                        {currentUser.role === 'staff' && 'Cổng Ca Làm Việc KTV'}
                        {currentUser.role === 'sales' && 'Portal Sales & Chốt Đơn'}
                        {currentUser.role === 'accountant' && 'Portal Kế Toán & Hóa Đơn'}
                        {currentUser.role === 'customer' && 'Trang Lịch Hẹn Của Tôi'}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenLookup();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-[#6b5c54] hover:bg-[#f7f1eb] flex items-center gap-2 cursor-pointer"
                    >
                      <Search className="w-4 h-4 text-[#c9a86c]" />
                      <span>Tra cứu theo Mã Lịch</span>
                    </button>

                    <div className="border-t border-[#f7f1eb] my-1" />

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất tài khoản</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#1f2923] hover:text-[#2d4a3e] bg-white hover:bg-[#f7f4ee] rounded-full border border-[#2d4a3e]/30 transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
              >
                <User className="w-3.5 h-3.5 text-[#2d4a3e] shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">{t('nav.login')}</span>
              </button>
            )}

            {/* Language Selector */}
            <LanguageSelector />

            {/* Tra cứu lịch button */}
            <button
              onClick={onOpenLookup}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#524943] hover:text-[#2d4a3e] bg-white/80 hover:bg-white rounded-full border border-[#e6dec8] transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0"
              title={t('nav.lookup')}
            >
              <Search className="w-3.5 h-3.5 text-[#2d4a3e] shrink-0" />
              <span className="whitespace-nowrap">{t('nav.lookup')}</span>
            </button>

            {/* Đặt lịch ngay button */}
            <button
              onClick={() => onOpenBooking()}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold bg-[#2d4a3e] hover:bg-[#1f362c] text-white shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Calendar className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{t('nav.booking')}</span>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#3a2f2a] hover:bg-[#ebe3d9] transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#f7f1eb] border-b border-[#c9a86c]/20 px-6 py-5 shadow-xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`text-base font-medium py-2 px-3 rounded-lg transition-colors ${
                  activeSection === link.id
                    ? 'bg-[#f3e6e0] text-[#3a2f2a] font-semibold border-l-4 border-[#c9a86c]'
                    : 'text-[#6b5c54] hover:bg-white/50'
                }`}
              >
                {link.label}
              </a>
            ))}

            <div className="pt-3 border-t border-[#ebe3d9] flex flex-col space-y-2.5">
              {!currentUser ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-bold text-[#3a2f2a] bg-white rounded-full border border-[#c9a86c]"
                >
                  <User className="w-4 h-4 text-[#c9a86c]" />
                  <span>Đăng Nhập / Đăng Ký Tài Khoản</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPortal();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-bold text-white bg-[#3a2f2a] rounded-full shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-[#c9a86c]" />
                  <span>Mở Bảng Điều Hành ({currentUser.role.toUpperCase()})</span>
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium bg-[#c9a86c] text-white rounded-full shadow-md"
              >
                <Calendar className="w-4 h-4" />
                <span>Đặt Lịch Ngay</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
