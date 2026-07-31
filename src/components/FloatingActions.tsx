import React from 'react';
import { Phone, MessageCircle, Calendar } from 'lucide-react';

interface FloatingActionsProps {
  onOpenBooking: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ onOpenBooking }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
      
      {/* Phone Call Floating Button */}
      <a
        href="tel:0901234567"
        className="pointer-events-auto w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
        title="Gọi điện Hotline 0901 234 567"
      >
        <Phone className="w-5 h-5 animate-bounce" />
      </a>

      {/* Zalo Chat Floating Button */}
      <a
        href="https://zalo.me"
        target="_blank"
        rel="noreferrer"
        className="pointer-events-auto w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
        title="Tư vấn Zalo"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* Quick Booking Floating Pill */}
      <button
        onClick={onOpenBooking}
        className="pointer-events-auto px-5 py-3 rounded-full bg-[#c9a86c] hover:bg-[#b08d4f] text-white text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer border-2 border-white"
      >
        <Calendar className="w-4 h-4" />
        <span>Đặt Lịch Ngay</span>
      </button>

    </div>
  );
};
