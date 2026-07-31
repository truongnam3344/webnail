import React, { useState } from 'react';
import { X, Search, Calendar, Clock, MapPin, Trash2, ShieldAlert, CheckCircle2, Lock, Mail } from 'lucide-react';
import { Appointment } from '../types';
import { useAuth } from '../context/AuthContext';
import { EmailConfirmationModal } from './EmailConfirmationModal';

interface AppointmentLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentLookupModal: React.FC<AppointmentLookupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser, appointments, updateAppointmentStatus } = useAuth();

  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  // Verification dialog for guest cancellation
  const [verificationModalApp, setVerificationModalApp] = useState<Appointment | null>(null);
  const [verifyPhone, setVerifyPhone] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState('');

  // Email Ticket Modal state
  const [selectedEmailApp, setSelectedEmailApp] = useState<Appointment | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  if (!isOpen) return null;

  // Filter appointments according to user role and privacy rules
  const getFilteredAppointments = (): Appointment[] => {
    // 1. Admin or Staff: FULL ACCESS to view ALL appointments in system
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'staff')) {
      if (!query.trim()) return appointments;

      const q = query.trim().toLowerCase();
      return appointments.filter(
        (app) =>
          app.id.toLowerCase().includes(q) ||
          app.customerName.toLowerCase().includes(q) ||
          app.customerPhone.includes(q) ||
          app.branch.toLowerCase().includes(q) ||
          (app.customerEmail && app.customerEmail.toLowerCase().includes(q)) ||
          app.specialistName.toLowerCase().includes(q) ||
          app.selectedServices.some((s) => s.title.toLowerCase().includes(q))
      );
    }

    // 2. Logged in customer: Only return user's OWN appointments
    if (currentUser && currentUser.role === 'customer') {
      const myApps = appointments.filter(
        (app) =>
          app.userId === currentUser.id ||
          app.customerPhone === currentUser.phone ||
          (currentUser.email && app.customerEmail === currentUser.email)
      );

      if (!query.trim()) return myApps;

      const q = query.trim().toLowerCase();
      return myApps.filter(
        (app) =>
          app.id.toLowerCase().includes(q) ||
          app.customerPhone.includes(q) ||
          app.selectedServices.some((s) => s.title.toLowerCase().includes(q))
      );
    }

    // 3. Guest User (Not logged in): Require valid search input
    const cleanQuery = query.trim().toLowerCase().replace(/\s+/g, '');
    if (!cleanQuery || cleanQuery.length < 3) {
      return []; // Return empty by default - never expose all appointments!
    }

    // Match strictly by exact Booking ID or exact Phone Number
    return appointments.filter((app) => {
      const cleanAppPhone = app.customerPhone.replace(/\D/g, '');
      const cleanInputPhone = cleanQuery.replace(/\D/g, '');

      const isExactIdMatch = app.id.toLowerCase() === cleanQuery;
      const isPhoneMatch =
        cleanInputPhone.length >= 8 && cleanAppPhone === cleanInputPhone;

      return isExactIdMatch || isPhoneMatch;
    });
  };

  const filteredAppointments = getFilteredAppointments();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    setCancelSuccessMsg('');
  };

  // Open cancellation step
  const handleInitiateCancel = (app: Appointment) => {
    const isStaffOrAdmin = currentUser && (currentUser.role === 'admin' || currentUser.role === 'staff');
    const isOwner =
      currentUser &&
      (app.userId === currentUser.id ||
        app.customerPhone === currentUser.phone ||
        (currentUser.email && app.customerEmail === currentUser.email));

    if (isStaffOrAdmin || isOwner) {
      const roleText = currentUser?.role === 'admin' ? 'Quản trị viên' : currentUser?.role === 'staff' ? 'Nhân viên' : 'Khách hàng';
      if (window.confirm(`Xác nhận với quyền ${roleText}: Bạn có chắc muốn hủy lịch hẹn #${app.id}?`)) {
        updateAppointmentStatus(app.id, 'cancelled');
        setCancelSuccessMsg(`Đã hủy lịch hẹn #${app.id} thành công.`);
      }
    } else {
      // Guest: require phone verification before allowing cancellation
      setVerificationModalApp(app);
      setVerifyPhone('');
      setVerifyError('');
    }
  };

  const handleConfirmGuestCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationModalApp) return;

    const cleanInput = verifyPhone.trim().replace(/\D/g, '');
    const cleanAppPhone = verificationModalApp.customerPhone.replace(/\D/g, '');

    if (!cleanInput || cleanInput !== cleanAppPhone) {
      setVerifyError('Số điện thoại không khớp với thông tin đặt lịch! Vui lòng kiểm tra lại.');
      return;
    }

    updateAppointmentStatus(verificationModalApp.id, 'cancelled');
    setCancelSuccessMsg(`Đã hủy lịch hẹn #${verificationModalApp.id} thành công.`);
    setVerificationModalApp(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-[#f7f1eb] rounded-3xl max-w-xl w-full shadow-2xl border border-[#c9a86c]/20 overflow-hidden flex flex-col max-h-[85vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#3a2f2a] text-white p-5 sm:p-6 relative flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-[#c9a86c] mb-0.5">
              <Lock className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em]">
                Bảo mật lịch hẹn
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold">
              Tra Cứu Lịch Hẹn Đã Đặt
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar Input */}
        <div className="p-5 bg-white border-b border-[#ebe3d9] shrink-0">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#c9a86c]" />
              <input
                type="text"
                placeholder={
                  currentUser?.role === 'customer'
                    ? "Tìm kiếm trong lịch hẹn của bạn..."
                    : "Nhập Số điện thoại hoặc Mã lịch (VD: LUME-8821)..."
                }
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setHasSearched(false);
                }}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#c9a86c] hover:bg-[#b08d4f] text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              Tìm kiếm
            </button>
          </form>

          {currentUser?.role === 'customer' && (
            <div className="mt-2 text-[11px] text-[#6b5c54] flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-600" />
              <span>Đang hiển thị lịch hẹn thuộc tài khoản <strong>{currentUser.name}</strong></span>
            </div>
          )}

          {(currentUser?.role === 'admin' || currentUser?.role === 'staff') && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-[11px] flex items-center gap-1.5 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>
                Quyền <strong>{currentUser.role === 'admin' ? 'Quản trị viên (Admin)' : 'Nhân viên (Staff)'}</strong>: Đang hiển thị toàn bộ <strong>{filteredAppointments.length}</strong> lịch hẹn của khách trên hệ thống.
              </span>
            </div>
          )}
        </div>

        {/* Success Alert */}
        {cancelSuccessMsg && (
          <div className="m-5 mb-0 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{cancelSuccessMsg}</span>
          </div>
        )}

        {/* Results List */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {(!query.trim() && !currentUser) ? (
            <div className="text-center py-10 text-[#6b5c54] bg-white rounded-2xl border border-dashed border-[#ebe3d9] p-6">
              <ShieldAlert className="w-10 h-10 mx-auto text-[#c9a86c] mb-2" />
              <h3 className="font-serif font-bold text-sm text-[#3a2f2a]">Tra cứu bảo mật lịch hẹn</h3>
              <p className="text-xs text-[#6b5c54] mt-1 max-w-sm mx-auto leading-relaxed">
                Vì mục đích bảo mật thông tin cá nhân khách hàng, vui lòng nhập chính xác <strong>Số điện thoại</strong> hoặc <strong>Mã lịch hẹn</strong> (VD: <i>LUME-8821</i>) để xem chi tiết.
              </p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="text-center py-12 text-[#6b5c54]">
              <Calendar className="w-12 h-12 mx-auto text-[#c9a86c]/60 mb-2" />
              <p className="font-semibold text-sm">Không tìm thấy lịch hẹn phù hợp</p>
              <p className="text-xs mt-1 max-w-xs mx-auto text-[#6b5c54]">
                Vui lòng kiểm tra lại Số điện thoại hoặc Mã đặt hẹn đã nhập đúng chưa.
              </p>
            </div>
          ) : (
            filteredAppointments.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl p-5 border border-[#ebe3d9] shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#f7f1eb]">
                  <div>
                    <span className="font-mono text-xs font-extrabold text-[#3a2f2a]">
                      #{app.id}
                    </span>
                    <span className="text-xs text-[#6b5c54] ml-2">
                      ({app.customerName} - {app.customerPhone})
                    </span>
                  </div>

                  <span
                    className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      app.status === 'confirmed'
                        ? 'bg-amber-100 text-amber-800'
                        : app.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : app.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {app.status === 'confirmed'
                      ? 'Đã xác nhận'
                      : app.status === 'in_progress'
                      ? 'Đang thực hiện'
                      : app.status === 'completed'
                      ? 'Đã hoàn thành'
                      : 'Đã hủy'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#6b5c54]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#c9a86c]" />
                    <span>Thời gian: <strong className="text-[#3a2f2a]">{app.timeSlot} - {app.date}</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#c9a86c]" />
                    <span className="truncate">{app.branch}</span>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-[#6b5c54] block mb-1">Dịch vụ đã chọn:</span>
                  <ul className="text-xs text-[#3a2f2a] space-y-0.5">
                    {app.selectedServices.map((s) => (
                      <li key={s.id}>• {s.title} ({s.duration}p)</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-[#f7f1eb] flex items-center justify-between gap-2">
                  <span className="text-xs text-[#6b5c54]">
                    Tổng tiền: <strong className="text-[#b08d4f] font-bold">{new Intl.NumberFormat('vi-VN').format(app.finalPrice)}đ</strong>
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedEmailApp(app);
                        setIsEmailModalOpen(true);
                      }}
                      className="text-xs text-[#c9a86c] hover:text-[#b08d4f] flex items-center gap-1 font-semibold cursor-pointer transition-colors"
                      title="Xem và gửi vé xác nhận qua Email"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Gửi về Email</span>
                    </button>

                    {app.status === 'confirmed' && (
                      <button
                        onClick={() => handleInitiateCancel(app)}
                        className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hủy lịch</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Verification Modal for Guest Cancellation */}
        {verificationModalApp && (
          <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl border border-[#ebe3d9] space-y-4">
              <div className="flex items-center justify-between border-b border-[#f7f1eb] pb-3">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                  <ShieldAlert className="w-5 h-5" />
                  <span>Xác Nhận Hủy Lịch Hẹn #{verificationModalApp.id}</span>
                </div>
                <button
                  onClick={() => setVerificationModalApp(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-[#6b5c54] leading-relaxed">
                Để bảo vệ quyền lợi khách hàng và tránh việc hủy nhầm lịch của người khác, vui lòng <strong>nhập chính xác Số điện thoại</strong> đã đăng ký khi đặt lịch này:
              </p>

              <form onSubmit={handleConfirmGuestCancel} className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-[#3a2f2a] block mb-1">
                    Số điện thoại xác thực:
                  </label>
                  <input
                    type="tel"
                    placeholder="VD: 0901234567"
                    value={verifyPhone}
                    onChange={(e) => {
                      setVerifyPhone(e.target.value);
                      setVerifyError('');
                    }}
                    required
                    className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                  />
                  {verifyError && (
                    <span className="text-[11px] text-rose-600 font-medium block mt-1">
                      {verifyError}
                    </span>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setVerificationModalApp(null)}
                    className="px-4 py-2 text-xs font-semibold bg-[#f7f1eb] text-[#3a2f2a] rounded-xl hover:bg-[#ebe3d9]"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs cursor-pointer"
                  >
                    Xác nhận hủy lịch
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#ebe3d9] text-center shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#f7f1eb] text-[#3a2f2a] text-xs font-semibold hover:bg-[#ebe3d9]"
          >
            Đóng
          </button>
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
