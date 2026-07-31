import React, { useState } from 'react';
import {
  X, Calendar, Clock, MapPin, User, CheckCircle2, Clock3, AlertCircle,
  PlusCircle, Sparkles, Phone, Mail, Award, Gift, Ticket, History, Check, Copy, ChevronRight, Percent, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { EmailConfirmationModal } from './EmailConfirmationModal';
import { Appointment } from '../types';
import { REWARD_PACKAGES, RewardPackage, getUserTier, getNextTierInfo } from '../data/rewardsData';

interface CustomerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking: () => void;
}

export const CustomerPortalModal: React.FC<CustomerPortalModalProps> = ({
  isOpen,
  onClose,
  onOpenBooking,
}) => {
  const { currentUser, appointments, updateAppointmentStatus, redeemRewardPackage } = useAuth();

  const [activeTab, setActiveTab] = useState<'appointments' | 'rewards'>('appointments');
  const [rewardSubTab, setRewardSubTab] = useState<'catalog' | 'vouchers' | 'history'>('catalog');
  const [rewardCategory, setRewardCategory] = useState<'all' | 'voucher' | 'free_service' | 'combo'>('all');

  // Email Confirmation state
  const [selectedEmailApp, setSelectedEmailApp] = useState<Appointment | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Success Redemption Toast / Modal
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState<{ title: string; code: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen || !currentUser) return null;

  // Points & Tier calculations
  const userPoints = currentUser.rewardPoints || 0;
  const currentTier = getUserTier(userPoints);
  const { nextTier, pointsNeeded, progressPercent } = getNextTierInfo(userPoints);

  // Filter user's appointments by matching phone or email or userId
  const myAppointments = appointments.filter(
    app => app.userId === currentUser.id ||
           app.customerPhone === currentUser.phone ||
           (currentUser.email && app.customerEmail === currentUser.email)
  );

  const myVouchers = currentUser.redeemedVouchers || [];
  const pointTransactions = currentUser.pointTransactions || [];

  const handleRedeem = (pkg: RewardPackage) => {
    const res = redeemRewardPackage(pkg);
    if (res.success && res.voucher) {
      setRedeemSuccessMsg({
        title: pkg.title,
        code: res.voucher.code,
      });
      setTimeout(() => {
        setRedeemSuccessMsg(null);
      }, 7000);
    } else if (res.error) {
      alert(res.error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const filteredPackages = REWARD_PACKAGES.filter(pkg => {
    if (rewardCategory === 'all') return true;
    return pkg.category === rewardCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock3 className="w-3 h-3" />
            <span>Đã xác nhận (Sắp tới)</span>
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 animate-pulse">
            <Sparkles className="w-3 h-3" />
            <span>Đang làm dịch vụ</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Hoàn thành (+{Math.floor(100)} điểm)</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3 h-3" />
            <span>Đã hủy</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#ebe3d9] max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#3a2f2a] text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80'}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-[#c9a86c]"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${currentTier.bgColor} ${currentTier.color}`}>
                    {currentTier.badge} {currentTier.name}
                  </span>
                </div>
                <h2 className="font-serif text-2xl font-bold tracking-tight">
                  {currentUser.name}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#ebe3d9]/80 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#c9a86c]" /> {currentUser.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#c9a86c]" /> {currentUser.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Points Display Card */}
            <div className="bg-gradient-to-br from-[#c9a86c] to-[#967438] p-3.5 rounded-2xl text-white shadow-md flex items-center gap-3 min-w-[160px]">
              <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-xs text-xl">
                💎
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-white/80 tracking-wider">Điểm Thưởng Tích Luỹ</div>
                <div className="text-2xl font-serif font-bold leading-none">{userPoints.toLocaleString('vi-VN')}</div>
                <div className="text-[10px] text-white/90 mt-1 font-medium">1 điểm = 10.000đ</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Tab Navigation Bar */}
        <div className="flex border-b border-[#ebe3d9] bg-[#f7f1eb] px-6 pt-2 shrink-0 justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
                activeTab === 'appointments'
                  ? 'border-[#c9a86c] text-[#3a2f2a]'
                  : 'border-transparent text-[#6b5c54] hover:text-[#3a2f2a]'
              }`}
            >
              <Calendar className="w-4 h-4 text-[#c9a86c]" />
              <span>Lịch Hẹn Của Tôi ({myAppointments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('rewards')}
              className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer relative ${
                activeTab === 'rewards'
                  ? 'border-[#c9a86c] text-[#3a2f2a]'
                  : 'border-transparent text-[#6b5c54] hover:text-[#3a2f2a]'
              }`}
            >
              <Gift className="w-4 h-4 text-[#c9a86c]" />
              <span>Tích Điểm & Đổi Quà</span>
              {userPoints >= 50 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute top-1 right-2" />
              )}
            </button>
          </div>

          {activeTab === 'appointments' && (
            <button
              onClick={() => {
                onClose();
                onOpenBooking();
              }}
              className="mb-2 px-3.5 py-1.5 rounded-full bg-[#c9a86c] hover:bg-[#b08d4f] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Đặt Lịch Mới</span>
            </button>
          )}
        </div>

        {/* Toast Notification when redeeming voucher */}
        {redeemSuccessMsg && (
          <div className="mx-6 mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between shadow-md animate-in slide-in-from-top">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-emerald-900">Đổi quà thành công! 🎉</h4>
                <p className="text-xs text-emerald-700">
                  Gói quà <strong>{redeemSuccessMsg.title}</strong> đã được thêm vào Kho Voucher.
                </p>
                <div className="mt-1 flex items-center gap-2 text-xs font-mono font-bold bg-white px-2 py-1 rounded border border-emerald-300 w-fit text-emerald-900">
                  <span>Mã: {redeemSuccessMsg.code}</span>
                  <button
                    onClick={() => copyToClipboard(redeemSuccessMsg.code)}
                    className="text-xs text-emerald-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedCode === redeemSuccessMsg.code ? 'Đã chép!' : 'Chép mã'}</span>
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setRedeemSuccessMsg(null)}
              className="text-emerald-500 hover:text-emerald-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'appointments' ? (
            /* TAB 1: MY APPOINTMENTS */
            myAppointments.length === 0 ? (
              <div className="text-center py-12 bg-[#f7f1eb]/50 rounded-2xl border border-dashed border-[#ebe3d9]">
                <Calendar className="w-12 h-12 text-[#c9a86c]/50 mx-auto mb-2" />
                <h3 className="font-serif text-base font-bold text-[#3a2f2a]">Chưa có lịch hẹn nào</h3>
                <p className="text-xs text-[#6b5c54] mt-1 max-w-sm mx-auto">
                  Bạn chưa đặt lịch dịch vụ tại Lumé Spa & Nail. Hãy bấm nút Đặt Lịch Mới để trải nghiệm dịch vụ đỉnh cao!
                </p>
              </div>
            ) : (
              myAppointments.map((app) => (
                <div
                  key={app.id}
                  className="bg-white p-5 rounded-2xl border border-[#ebe3d9] shadow-xs space-y-3 relative hover:border-[#c9a86c]/50 transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#f7f1eb]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#c9a86c]">#{app.id}</span>
                      <span className="text-xs text-[#6b5c54]">· Tạo lúc {new Date(app.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>

                  <div className="space-y-2">
                    <div className="font-serif font-bold text-sm text-[#3a2f2a]">
                      {app.selectedServices.map(s => s.title).join(', ')}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-[#6b5c54]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#c9a86c]" />
                        <span>{app.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#c9a86c]" />
                        <span>Khung giờ: <strong>{app.timeSlot}</strong></span>
                      </div>
                      {app.specialistName && (
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#c9a86c]" />
                          <span>KTV: <strong>{app.specialistName}</strong></span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#6b5c54]">
                      <MapPin className="w-3.5 h-3.5 text-[#c9a86c] shrink-0" />
                      <span className="truncate">{app.branch}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#f7f1eb] flex items-center justify-between gap-2">
                    <div className="text-xs">
                      <span className="text-[#6b5c54]">Tổng thanh toán: </span>
                      <span className="font-bold text-[#3a2f2a]">{app.finalPrice.toLocaleString('vi-VN')}đ</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedEmailApp(app);
                          setIsEmailModalOpen(true);
                        }}
                        className="text-xs text-[#c9a86c] hover:text-[#b08d4f] flex items-center gap-1 font-semibold cursor-pointer transition-colors"
                        title="Xem vé và gửi lại qua Email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Gửi về Email</span>
                      </button>

                      {app.status === 'confirmed' && (
                        <button
                          onClick={() => updateAppointmentStatus(app.id, 'cancelled')}
                          className="text-xs text-rose-600 hover:text-rose-800 font-medium hover:underline cursor-pointer"
                        >
                          Hủy lịch này
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            /* TAB 2: LOYALTY POINTS & REWARD REDEMPTION */
            <div className="space-y-6">
              {/* Tier Progress Banner */}
              <div className="p-5 bg-gradient-to-r from-[#3a2f2a] to-[#241c18] text-white rounded-3xl space-y-3 relative overflow-hidden shadow-lg border border-[#c9a86c]/30">
                <div className="flex flex-wrap items-center justify-between gap-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#c9a86c]" />
                    <span className="font-serif font-bold text-sm">Hạng Cấp: {currentTier.name} ({currentTier.badge})</span>
                  </div>
                  {nextTier && (
                    <span className="text-xs text-[#ebe3d9]/80 font-medium">
                      Cần thêm <strong className="text-[#c9a86c]">{pointsNeeded} điểm</strong> để lên {nextTier.name} {nextTier.badge}
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                {nextTier && (
                  <div className="space-y-1 relative z-10">
                    <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden border border-white/10">
                      <div
                        className="bg-gradient-to-r from-[#c9a86c] to-[#e6ca94] h-full transition-all duration-500 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-[#ebe3d9]/70">
                      <span>{currentTier.name} ({currentTier.minPoints}đ)</span>
                      <span>{nextTier.name} ({nextTier.minPoints}đ)</span>
                    </div>
                  </div>
                )}

                {/* Tier Benefits Bullet Points */}
                <div className="pt-2 border-t border-white/10 text-xs text-[#ebe3d9]/90 space-y-1 relative z-10">
                  <div className="font-bold text-[#c9a86c]">Đặc quyền hạng thành viên hiện tại:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                    {currentTier.benefits.map((b, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#c9a86c] shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sub-tab Selection */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ebe3d9] pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRewardSubTab('catalog')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      rewardSubTab === 'catalog'
                        ? 'bg-[#c9a86c] text-white shadow-xs'
                        : 'bg-[#f7f1eb] text-[#6b5c54] hover:text-[#3a2f2a]'
                    }`}
                  >
                    🎁 Gói Đổi Điểm Thưởng
                  </button>

                  <button
                    onClick={() => setRewardSubTab('vouchers')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      rewardSubTab === 'vouchers'
                        ? 'bg-[#c9a86c] text-white shadow-xs'
                        : 'bg-[#f7f1eb] text-[#6b5c54] hover:text-[#3a2f2a]'
                    }`}
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Kho Voucher Của Tôi ({myVouchers.filter(v => !v.isUsed).length})</span>
                  </button>

                  <button
                    onClick={() => setRewardSubTab('history')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      rewardSubTab === 'history'
                        ? 'bg-[#c9a86c] text-white shadow-xs'
                        : 'bg-[#f7f1eb] text-[#6b5c54] hover:text-[#3a2f2a]'
                    }`}
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>Lịch Sử Điểm</span>
                  </button>
                </div>

                {rewardSubTab === 'catalog' && (
                  <div className="flex items-center gap-1 text-xs">
                    <button
                      onClick={() => setRewardCategory('all')}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                        rewardCategory === 'all' ? 'bg-[#3a2f2a] text-white' : 'text-[#6b5c54] hover:bg-[#f7f1eb]'
                      }`}
                    >
                      Tất cả
                    </button>
                    <button
                      onClick={() => setRewardCategory('voucher')}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                        rewardCategory === 'voucher' ? 'bg-[#3a2f2a] text-white' : 'text-[#6b5c54] hover:bg-[#f7f1eb]'
                      }`}
                    >
                      Voucher
                    </button>
                    <button
                      onClick={() => setRewardCategory('free_service')}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                        rewardCategory === 'free_service' ? 'bg-[#3a2f2a] text-white' : 'text-[#6b5c54] hover:bg-[#f7f1eb]'
                      }`}
                    >
                      Dịch vụ 0đ
                    </button>
                  </div>
                )}
              </div>

              {/* SUB-CONTENT 1: CATALOG OF REWARDS */}
              {rewardSubTab === 'catalog' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredPackages.map((pkg) => {
                    const canAfford = userPoints >= pkg.pointsRequired;

                    return (
                      <div
                        key={pkg.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 relative ${
                          canAfford
                            ? 'bg-white border-[#ebe3d9] hover:border-[#c9a86c] shadow-xs'
                            : 'bg-[#faf8f5] border-[#ebe3d9] opacity-80'
                        }`}
                      >
                        {pkg.popular && (
                          <div className="absolute top-3 right-3 bg-rose-500 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-xs">
                            🔥 Hot Quy Đổi
                          </div>
                        )}

                        <div className="flex items-start gap-3">
                          <div className="text-3xl p-2 bg-[#f7f1eb] rounded-2xl shrink-0">
                            {pkg.icon}
                          </div>

                          <div className="space-y-1 pr-12">
                            <h4 className="font-serif font-bold text-sm text-[#3a2f2a] leading-snug">
                              {pkg.title}
                            </h4>
                            <div className="inline-block font-bold text-xs text-[#c9a86c]">
                              {pkg.valueText}
                            </div>
                            <p className="text-[11px] text-[#6b5c54] leading-relaxed">
                              {pkg.description}
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#f7f1eb] flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#3a2f2a]">
                            <span>💎 {pkg.pointsRequired} điểm</span>
                          </div>

                          <button
                            onClick={() => handleRedeem(pkg)}
                            disabled={!canAfford}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                              canAfford
                                ? 'bg-[#c9a86c] hover:bg-[#b08d4f] text-white shadow-xs'
                                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            <span>{canAfford ? 'Đổi Ngay' : 'Thiếu điểm'}</span>
                            {canAfford && <ArrowRight className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* SUB-CONTENT 2: MY VOUCHERS */}
              {rewardSubTab === 'vouchers' && (
                <div className="space-y-3">
                  {myVouchers.length === 0 ? (
                    <div className="text-center py-10 bg-[#f7f1eb]/50 rounded-2xl border border-dashed border-[#ebe3d9] p-6">
                      <Ticket className="w-10 h-10 mx-auto text-[#c9a86c]/60 mb-2" />
                      <h4 className="font-serif font-bold text-sm text-[#3a2f2a]">Chưa có Voucher nào trong kho</h4>
                      <p className="text-xs text-[#6b5c54] mt-1 max-w-sm mx-auto">
                        Hãy tích lũy điểm thưởng qua mỗi lần đặt lịch và chọn "Gói Đổi Điểm Thưởng" để nhận các Voucher ưu đãi độc quyền.
                      </p>
                    </div>
                  ) : (
                    myVouchers.map((v) => (
                      <div
                        key={v.id}
                        className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
                          v.isUsed ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-[#ebe3d9] shadow-xs'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-[#f7f1eb] text-[#c9a86c] rounded-2xl text-xl">
                            🎟️
                          </div>
                          <div>
                            <div className="font-serif font-bold text-sm text-[#3a2f2a]">
                              {v.title}
                            </div>
                            <div className="text-xs font-bold text-emerald-600">
                              Trị giá: {v.discountValue.toLocaleString('vi-VN')}đ
                            </div>
                            <div className="text-[10px] text-[#6b5c54] mt-0.5">
                              Hạn dùng: {v.validUntil} · Đã đổi bằng {v.pointsSpent} điểm
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-mono text-xs font-extrabold bg-[#f7f1eb] px-3 py-1.5 rounded-lg border border-[#ebe3d9] text-[#3a2f2a]">
                              {v.code}
                            </div>
                            <button
                              onClick={() => copyToClipboard(v.code)}
                              className="text-[10px] text-[#c9a86c] hover:underline mt-1 font-semibold block ml-auto cursor-pointer"
                            >
                              {copiedCode === v.code ? 'Đã sao chép!' : 'Sao chép mã'}
                            </button>
                          </div>

                          {v.isUsed ? (
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600">
                              Đã sử dụng
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                onClose();
                                onOpenBooking();
                              }}
                              className="px-3.5 py-1.5 rounded-full bg-[#3a2f2a] hover:bg-[#241c18] text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                            >
                              Dùng Ngay
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* SUB-CONTENT 3: POINTS HISTORY */}
              {rewardSubTab === 'history' && (
                <div className="space-y-2">
                  {pointTransactions.length === 0 ? (
                    <div className="text-center py-8 text-xs text-[#6b5c54]">
                      Chưa có lịch sử giao dịch điểm.
                    </div>
                  ) : (
                    pointTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="p-3 bg-white rounded-xl border border-[#ebe3d9] flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-[#3a2f2a]">{tx.description}</div>
                          <div className="text-[10px] text-[#6b5c54]">{tx.date}</div>
                        </div>

                        <div className={`font-mono font-extrabold text-sm ${
                          tx.points > 0 ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {tx.points > 0 ? `+${tx.points}` : tx.points} điểm
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <EmailConfirmationModal
        appointment={selectedEmailApp}
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
      />
    </div>
  );
};

