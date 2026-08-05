import React, { useState, useEffect } from 'react';
import { X, Check, Calendar as CalendarIcon, Clock, User, Tag, MapPin, ChevronRight, CheckCircle, Sparkles, Phone, AlertCircle, Mail } from 'lucide-react';
import { SERVICES_DATA } from '../data/servicesData';
import { SPECIALISTS_DATA } from '../data/specialistsData';
import { PROMOTIONS_DATA } from '../data/promotionsData';
import { ServiceItem, Specialist, Appointment } from '../types';
import { useAuth } from '../context/AuthContext';
import { EmailConfirmationModal } from './EmailConfirmationModal';

interface BookingModalProps {
  isOpen: boolean;
  initialServiceId?: string;
  initialPromoCode?: string;
  onClose: () => void;
  onBookingSuccess: (appointment: Appointment) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  initialServiceId,
  initialPromoCode,
  onClose,
  onBookingSuccess,
}) => {
  if (!isOpen) return null;

  const { currentUser, addAppointment, servicesCatalog } = useAuth();
  const availableServices = (servicesCatalog && servicesCatalog.length > 0) ? servicesCatalog : SERVICES_DATA;

  // Step state: 1 (Services), 2 (Specialist), 3 (Date & Time), 4 (Contact & Promo), 5 (Success Confirmation)
  const [step, setStep] = useState<number>(1);

  // Form State
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist>(SPECIALISTS_DATA[0]);
  
  // Date default tomorrow or today
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00');
  
  // Branch
  const [selectedBranch, setSelectedBranch] = useState<string>('Chi nhánh 1 (123 Nguyễn Huệ, Q.1)');

  // Customer Contact Info - Auto fill if logged in
  const [customerName, setCustomerName] = useState<string>(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState<string>(currentUser?.phone || '');
  const [customerEmail, setCustomerEmail] = useState<string>(currentUser?.email || '');
  const [notes, setNotes] = useState<string>('');

  // Email Modal State
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);

  // Update form if user logs in during session
  useEffect(() => {
    if (currentUser) {
      if (!customerName) setCustomerName(currentUser.name);
      if (!customerPhone) setCustomerPhone(currentUser.phone);
      if (!customerEmail) setCustomerEmail(currentUser.email);
    }
  }, [currentUser]);

  // Promo Code & Vouchers
  const [promoCode, setPromoCode] = useState<string>(initialPromoCode || '');
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [fixedDiscountAmount, setFixedDiscountAmount] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string>('');

  // Created Appointment Ticket
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);

  // Initialize pre-selected service if provided
  useEffect(() => {
    if (initialServiceId) {
      const found = availableServices.find((s) => s.id === initialServiceId);
      if (found) {
        setSelectedServices([found]);
      }
    } else if (selectedServices.length === 0 && availableServices.length > 0) {
      setSelectedServices([availableServices[0]]);
    }

    if (initialPromoCode) {
      handleApplyPromo(initialPromoCode);
    }
  }, [initialServiceId, initialPromoCode, servicesCatalog]);

  // Apply Promo Logic
  const handleApplyPromo = (codeToTest: string) => {
    const code = codeToTest.trim().toUpperCase();
    if (!code) {
      setPromoDiscount(0);
      setFixedDiscountAmount(0);
      setPromoMessage('');
      return;
    }

    // Check user's redeemed vouchers first
    const matchedVoucher = currentUser?.redeemedVouchers?.find(
      v => v.code.toUpperCase() === code && !v.isUsed
    );

    if (matchedVoucher) {
      const val = matchedVoucher.discountValue;
      setFixedDiscountAmount(val);
      setPromoDiscount(0);
      setPromoMessage(`Đã áp dụng Voucher Tích Điểm: ${matchedVoucher.title} (Giảm ${val.toLocaleString('vi-VN')}đ)`);
      return;
    }

    if (code === 'LUME2026') {
      setFixedDiscountAmount(0);
      setPromoDiscount(0.20); // 20%
      setPromoMessage('Đã áp dụng mã LUME2026 (Giảm 20%)');
    } else if (code === 'GLOW50') {
      setFixedDiscountAmount(0);
      setPromoDiscount(0.25); // 25%
      setPromoMessage('Đã áp dụng mã GLOW50 (Giảm 25%)');
    } else if (code === 'LUME2GETHER') {
      setFixedDiscountAmount(0);
      setPromoDiscount(0.15); // 15%
      setPromoMessage('Đã áp dụng mã LUME2GETHER (Giảm 15%)');
    } else if (code.startsWith('REW-') || code.startsWith('WELCOME-')) {
      setFixedDiscountAmount(50000);
      setPromoDiscount(0);
      setPromoMessage(`Đã áp dụng mã Voucher Tích Điểm: ${code} (Giảm 50.000đ)`);
    } else {
      setFixedDiscountAmount(0);
      setPromoDiscount(0);
      setPromoMessage('Mã giảm giá không hợp lệ hoặc đã hết hạn');
    }
  };

  // Service toggle
  const toggleService = (service: ServiceItem) => {
    const exists = selectedServices.some((s) => s.id === service.id);
    if (exists) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
      }
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // Calculate totals
  const subtotalPrice = selectedServices.reduce((acc, s) => acc + s.price, 0);
  const totalDuration = selectedServices.reduce((acc, s) => acc + s.duration, 0);
  const percentageDiscount = Math.round(subtotalPrice * promoDiscount);
  const discountAmount = fixedDiscountAmount > 0 ? fixedDiscountAmount : percentageDiscount;
  const finalPrice = Math.max(0, subtotalPrice - discountAmount);

  // Available Time Slots
  const timeSlots = [
    '08:30', '09:30', '10:30', '11:30',
    '13:30', '14:30', '15:30', '16:30',
    '17:30', '18:30', '19:30'
  ];

  // Submit Booking
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    const bookingId = `LUME-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppointment: Appointment = {
      id: bookingId,
      userId: currentUser?.id,
      customerName,
      customerPhone,
      customerEmail,
      selectedServices,
      specialistId: selectedSpecialist.id,
      specialistName: selectedSpecialist.name,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      totalPrice: subtotalPrice,
      discountAmount,
      finalPrice,
      promoCode: promoDiscount > 0 ? promoCode : undefined,
      notes,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      branch: selectedBranch,
    };

    // Add to AuthContext state
    addAppointment(newAppointment);

    setCreatedAppointment(newAppointment);
    onBookingSuccess(newAppointment);

    // Automatically send confirmation email if customer provided email
    if (customerEmail.trim()) {
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: customerEmail.trim(),
          appointment: newAppointment,
        }),
      }).catch((err) => console.error('Auto email error:', err));
    }

    setStep(5); // Go to confirmation ticket
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-[#f7f1eb] rounded-3xl max-w-2xl w-full shadow-2xl border border-[#c9a86c]/20 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#3a2f2a] text-white p-5 sm:p-6 relative flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9a86c] block">
              Hệ thống đặt lịch hẹn
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold">
              {step === 5 ? 'Lịch Hẹn Đã Được Xác Nhận' : 'Đặt Lịch Trải Nghiệm Lumé'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar (Steps 1 to 4) */}
        {step < 5 && (
          <div className="bg-white border-b border-[#ebe3d9] px-6 py-3 flex items-center justify-between text-xs font-semibold shrink-0">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#b08d4f]' : 'text-[#6b5c54]/50'}`}>
              <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center ${step >= 1 ? 'bg-[#c9a86c] text-white' : 'bg-[#ebe3d9]'}`}>1</span>
              <span className="hidden sm:inline">Dịch vụ</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#ebe3d9]" />

            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#b08d4f]' : 'text-[#6b5c54]/50'}`}>
              <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center ${step >= 2 ? 'bg-[#c9a86c] text-white' : 'bg-[#ebe3d9]'}`}>2</span>
              <span className="hidden sm:inline">Chuyên viên</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#ebe3d9]" />

            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#b08d4f]' : 'text-[#6b5c54]/50'}`}>
              <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center ${step >= 3 ? 'bg-[#c9a86c] text-white' : 'bg-[#ebe3d9]'}`}>3</span>
              <span className="hidden sm:inline">Thời gian</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#ebe3d9]" />

            <div className={`flex items-center gap-1.5 ${step >= 4 ? 'text-[#b08d4f]' : 'text-[#6b5c54]/50'}`}>
              <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center ${step >= 4 ? 'bg-[#c9a86c] text-white' : 'bg-[#ebe3d9]'}`}>4</span>
              <span className="hidden sm:inline">Xác nhận</span>
            </div>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6">

          {/* STEP 1: CHỌN DỊCH VỤ */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-[#3a2f2a]">
                  Bước 1: Chọn một hoặc nhiều dịch vụ
                </h3>
                <span className="text-xs text-[#6b5c54]">
                  Đã chọn: <strong className="text-[#b08d4f] font-bold">{selectedServices.length} dịch vụ</strong>
                </span>
              </div>

              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                {availableServices.filter((s) => s.itemType !== 'product' && s.duration > 0).map((service) => {
                  const isSelected = selectedServices.some((s) => s.id === service.id);
                  return (
                    <div
                      key={service.id}
                      onClick={() => toggleService(service)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-white border-[#c9a86c] shadow-md ring-1 ring-[#c9a86c]'
                          : 'bg-white/80 border-[#ebe3d9] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border text-white transition-colors shrink-0 ${
                          isSelected ? 'bg-[#c9a86c] border-[#c9a86c]' : 'border-[#ebe3d9]'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        <div>
                          <h4 className="font-serif text-sm font-bold text-[#3a2f2a]">
                            {service.title}
                          </h4>
                          <div className="flex items-center gap-3 text-xs text-[#6b5c54] mt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#c9a86c]" />
                              {service.duration} phút
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-[#b08d4f]">
                          {new Intl.NumberFormat('vi-VN').format(service.price)}đ
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: CHỌN CHUYÊN VIÊN */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#3a2f2a]">
                Bước 2: Chọn Chuyên viên / KTV yêu thích
              </h3>
              <p className="text-xs text-[#6b5c54]">
                Bạn có thể chọn KTV quen thuộc hoặc để Lumé tự động sắp xếp KTV trống lịch nhanh nhất.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SPECIALISTS_DATA.map((spec) => {
                  const isSelected = selectedSpecialist.id === spec.id;
                  return (
                    <div
                      key={spec.id}
                      onClick={() => setSelectedSpecialist(spec)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                        isSelected
                          ? 'bg-white border-[#c9a86c] shadow-md ring-1 ring-[#c9a86c]'
                          : 'bg-white/80 border-[#ebe3d9] hover:bg-white'
                      }`}
                    >
                      <img
                        src={spec.avatar}
                        alt={spec.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
                        }}
                        className="w-12 h-12 rounded-full object-cover shrink-0 border border-[#c9a86c]/30"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-sm font-bold text-[#3a2f2a] truncate">
                          {spec.name}
                        </h4>
                        <p className="text-[11px] text-[#6b5c54] truncate">
                          {spec.title}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-[#b08d4f] mt-1">
                          <span>★ {spec.rating}</span>
                          <span className="text-[#6b5c54]/70">({spec.reviewsCount} lượt)</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: CHỌN NGÀY & KHUNG GIỜ & CHI NHÁNH */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#3a2f2a] mb-3">
                  Bước 3: Chọn Chi nhánh & Thời gian đến
                </h3>

                {/* Branch Selection */}
                <label className="block text-xs font-semibold text-[#3a2f2a] mb-1">
                  Địa điểm chi nhánh Lumé
                </label>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c] text-[#3a2f2a]"
                >
                  <option value="CN 1: 123 Nguyễn Huệ, Quận 1, TP.HCM">
                    Chi nhánh 1: 123 Nguyễn Huệ, Quận 1, TP.HCM
                  </option>
                  <option value="CN 2: 45 Thảo Điền, Quận 2, TP.HCM">
                    Chi nhánh 2: 45 Thảo Điền, Quận 2, TP.HCM
                  </option>
                </select>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#3a2f2a] mb-1">
                  Chọn Ngày Hẹn
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c] text-[#3a2f2a]"
                />
              </div>

              {/* Time Slots Grid */}
              <div>
                <label className="block text-xs font-semibold text-[#3a2f2a] mb-2">
                  Chọn Khung Giờ Còn Trống
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#c9a86c] text-white shadow-md'
                            : 'bg-white text-[#3a2f2a] border border-[#ebe3d9] hover:bg-[#f7f1eb]'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: THÔNG TIN KHÁCH HÀNG & MÃ GIẢM GIÁ */}
          {step === 4 && (
            <form id="booking-form" onSubmit={handleConfirmBooking} className="space-y-5">
              <h3 className="font-serif text-lg font-bold text-[#3a2f2a]">
                Bước 4: Thông tin khách hàng & Mã ưu đãi
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3a2f2a] mb-1">
                    Họ và Tên *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Thị Lan"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3a2f2a] mb-1">
                    Số Điện Thoại (Để nhận mã lịch hẹn) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="VD: 0901234567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3a2f2a] mb-1">
                  Email (Để nhận vé xác nhận lịch hẹn tức thì)
                </label>
                <input
                  type="email"
                  placeholder="VD: lan.nguyen@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                />
              </div>

              {/* Promo Code Input */}
              <div>
                <label className="block text-xs font-semibold text-[#3a2f2a] mb-1">
                  Mã Giảm Giá / Voucher (Nếu có)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập mã VD: LUME2026, GLOW50..."
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c] uppercase font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyPromo(promoCode)}
                    className="px-5 py-2.5 rounded-xl bg-[#3a2f2a] hover:bg-[#4a3c35] text-white text-xs font-semibold cursor-pointer shrink-0"
                  >
                    Áp dụng
                  </button>
                </div>

                {/* Quick Select Voucher List from user's account */}
                {currentUser?.redeemedVouchers && currentUser.redeemedVouchers.filter(v => !v.isUsed).length > 0 && (
                  <div className="mt-2.5 p-2.5 bg-amber-50/80 border border-amber-200/80 rounded-xl">
                    <div className="text-[11px] font-bold text-amber-900 mb-1 flex items-center gap-1">
                      <span>🎟️ Voucher Tích Điểm Trong Kho Của Bạn:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentUser.redeemedVouchers.filter(v => !v.isUsed).map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => {
                            setPromoCode(v.code);
                            handleApplyPromo(v.code);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer border ${
                            promoCode.toUpperCase() === v.code.toUpperCase()
                              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                              : 'bg-white text-amber-900 border-amber-300 hover:bg-amber-100'
                          }`}
                        >
                          {v.code} (-{v.discountValue.toLocaleString('vi-VN')}đ)
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {promoMessage && (
                  <p className={`text-xs mt-1.5 font-medium ${
                    promoDiscount > 0 || fixedDiscountAmount > 0 ? 'text-emerald-700' : 'text-rose-600'
                  }`}>
                    {promoMessage}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3a2f2a] mb-1">
                  Ghi chú cho Spa
                </label>
                <textarea
                  rows={2}
                  placeholder="Yêu cầu đặc biệt về da, lực massage nhẹ/mạnh, đón tiếp..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 text-xs sm:text-sm bg-white rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                />
              </div>

              {/* Booking Summary Box */}
              <div className="p-4 rounded-2xl bg-white border border-[#c9a86c]/30 space-y-2">
                <div className="flex justify-between text-xs text-[#6b5c54]">
                  <span>Tổng tiền dịch vụ ({selectedServices.length}):</span>
                  <span className="font-semibold text-[#3a2f2a]">{new Intl.NumberFormat('vi-VN').format(subtotalPrice)}đ</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-700 font-semibold">
                    <span>Giảm giá voucher:</span>
                    <span>-{new Intl.NumberFormat('vi-VN').format(discountAmount)}đ</span>
                  </div>
                )}

                <div className="pt-2 border-t border-[#ebe3d9] flex justify-between text-sm sm:text-base font-bold text-[#b08d4f]">
                  <span>Thanh toán tại Spa:</span>
                  <span>{new Intl.NumberFormat('vi-VN').format(finalPrice)}đ</span>
                </div>
              </div>
            </form>
          )}

          {/* STEP 5: CREATED TICKET CONFIRMATION */}
          {step === 5 && createdAppointment && (
            <div className="space-y-6 text-center py-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-[#c9a86c] tracking-widest uppercase">
                  Mã Lịch Hẹn Của Bạn
                </span>
                <h3 className="font-mono text-3xl font-extrabold text-[#3a2f2a] mt-1">
                  {createdAppointment.id}
                </h3>
                <p className="text-xs text-[#6b5c54] mt-1">
                  Cảm ơn chị <strong>{createdAppointment.customerName}</strong>! Lịch hẹn đã được lưu trực tuyến.
                </p>
              </div>

              {/* Email Sent Dispatch Notification Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-left flex items-start gap-3 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1 text-xs space-y-1">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <span>Đã tự động gửi vé xác nhận về Email</span>
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-emerald-800">
                    Thư xác nhận lịch hẹn chi tiết đã được gửi tới: <strong className="underline">{createdAppointment.customerEmail || 'Chưa cung cấp email'}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowEmailModal(true)}
                    className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-[11px] shadow-xs cursor-pointer transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Xem & Gửi Lại Thư Xác Nhận (Email Ticket)</span>
                  </button>
                </div>
              </div>

              {/* Ticket Card Details */}
              <div className="bg-white p-6 rounded-3xl border border-[#ebe3d9] text-left space-y-3 text-xs sm:text-sm shadow-xs">
                <div className="flex justify-between pb-2 border-b border-[#f7f1eb]">
                  <span className="text-[#6b5c54]">Địa điểm:</span>
                  <span className="font-bold text-[#3a2f2a] text-right">{createdAppointment.branch}</span>
                </div>

                <div className="flex justify-between pb-2 border-b border-[#f7f1eb]">
                  <span className="text-[#6b5c54]">Thời gian hẹn:</span>
                  <span className="font-bold text-[#b08d4f]">
                    {createdAppointment.timeSlot} - {createdAppointment.date}
                  </span>
                </div>

                <div className="flex justify-between pb-2 border-b border-[#f7f1eb]">
                  <span className="text-[#6b5c54]">KTV Phụ trách:</span>
                  <span className="font-semibold text-[#3a2f2a]">{createdAppointment.specialistName}</span>
                </div>

                <div>
                  <span className="text-[#6b5c54] block mb-1">Dịch vụ đã chọn:</span>
                  <ul className="space-y-1">
                    {createdAppointment.selectedServices.map((s) => (
                      <li key={s.id} className="flex justify-between text-xs font-medium text-[#3a2f2a]">
                        <span>• {s.title} ({s.duration}p)</span>
                        <span>{new Intl.NumberFormat('vi-VN').format(s.price)}đ</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-[#ebe3d9] flex justify-between font-bold text-sm text-[#b08d4f]">
                  <span>Tổng thanh toán:</span>
                  <span>{new Intl.NumberFormat('vi-VN').format(createdAppointment.finalPrice)}đ</span>
                </div>
              </div>

              <p className="text-[11px] text-[#6b5c54] bg-[#f3e6e0] p-3 rounded-xl">
                💡 Nhân viên Lumé Spa sẽ gọi điện thoại hoặc nhắn Zalo xác nhận lại với quý khách trong vòng 15 phút.
              </p>
            </div>
          )}

        </div>

        {/* Footer Navigation Buttons */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#ebe3d9] flex items-center justify-between gap-4 shrink-0">
          {step < 5 ? (
            <>
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium text-[#6b5c54] hover:bg-[#f7f1eb] transition-colors cursor-pointer"
                >
                  Quay lại
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium text-[#6b5c54] hover:bg-[#f7f1eb] transition-colors cursor-pointer"
                >
                  Đóng
                </button>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-[#c9a86c] hover:bg-[#b08d4f] text-white shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Tiếp tục</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  form="booking-form"
                  className="px-7 py-2.5 rounded-full text-xs sm:text-sm font-semibold bg-[#c9a86c] hover:bg-[#b08d4f] text-white shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Xác nhận đặt lịch</span>
                  <Check className="w-4 h-4" />
                </button>
              )}
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-[#c9a86c] hover:bg-[#b08d4f] text-white text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer"
            >
              Hoàn tất & Đóng
            </button>
          )}
        </div>

      </div>

      <EmailConfirmationModal
        appointment={createdAppointment}
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
      />
    </div>
  );
};
