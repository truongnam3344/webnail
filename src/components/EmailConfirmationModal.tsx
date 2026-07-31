import React, { useState, useEffect } from 'react';
import { X, Mail, CheckCircle2, Send, Printer, ShieldCheck, Sparkles, MapPin, Calendar, Clock, UserCheck, ExternalLink, AlertTriangle } from 'lucide-react';
import { Appointment } from '../types';

interface EmailConfirmationModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({
  appointment,
  isOpen,
  onClose,
}) => {
  const [recipientEmail, setRecipientEmail] = useState<string>(
    appointment?.customerEmail || ''
  );
  const [isSending, setIsSending] = useState(false);
  const [sendSuccessMsg, setSendSuccessMsg] = useState('');
  const [sendErrorMsg, setSendErrorMsg] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (appointment?.customerEmail) {
      setRecipientEmail(appointment.customerEmail);
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const handleResendEmail = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetEmail = recipientEmail || appointment.customerEmail;
    if (!targetEmail) {
      setSendErrorMsg('Vui lòng nhập địa chỉ email nhận thư!');
      return;
    }

    setIsSending(true);
    setSendSuccessMsg('');
    setSendErrorMsg('');
    setPreviewUrl(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: targetEmail,
          appointment,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSendSuccessMsg(`Đã gửi vé xác nhận lịch hẹn #${appointment.id} thành công tới email: ${targetEmail}`);
        if (data.previewUrl) {
          setPreviewUrl(data.previewUrl);
        }
      } else {
        setSendErrorMsg(data.error || 'Gửi email không thành công. Vui lòng thử lại!');
      }
    } catch (err: any) {
      console.error('Email API call error:', err);
      setSendErrorMsg('Có lỗi khi kết nối tới máy chủ gửi mail.');
    } finally {
      setIsSending(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const effectiveEmail = recipientEmail || appointment.customerEmail || 'khachhang@lumespa.vn';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#c9a86c]/30 overflow-hidden flex flex-col max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="bg-[#3a2f2a] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#c9a86c]/20 flex items-center justify-center text-[#c9a86c]">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-white">
                Thư Xác Nhận Lịch Hẹn (Email Ticket)
              </h2>
              <p className="text-[11px] text-[#ebe3d9]/80">
                Lumé Spa Automated Mailer
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resend Email Bar */}
        <div className="bg-[#f7f1eb] p-3 sm:p-4 border-b border-[#ebe3d9] shrink-0">
          <form onSubmit={handleResendEmail} className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
            <div className="flex-1 flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#ebe3d9]">
              <span className="text-xs font-semibold text-[#6b5c54]">Gửi tới:</span>
              <input
                type="email"
                required
                value={recipientEmail || appointment.customerEmail || ''}
                onChange={(e) => {
                  setRecipientEmail(e.target.value);
                  setSendSuccessMsg('');
                }}
                placeholder="Nhập email khách nhận..."
                className="w-full text-xs text-[#3a2f2a] focus:outline-none bg-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={isSending}
              className="px-4 py-2 rounded-xl bg-[#c9a86c] hover:bg-[#b08d4f] text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Đang gửi...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi về Email</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl bg-white border border-[#ebe3d9] hover:bg-[#ebe3d9]/50 text-[#3a2f2a] text-xs font-medium flex items-center gap-1 cursor-pointer shrink-0"
              title="In vé"
            >
              <Printer className="w-3.5 h-3.5 text-[#6b5c54]" />
              <span className="hidden sm:inline">In vé</span>
            </button>
          </form>

          {sendSuccessMsg && (
            <div className="mt-2 p-2 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-medium flex flex-wrap items-center justify-between gap-1.5 animate-in fade-in">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{sendSuccessMsg}</span>
              </div>
              {previewUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[11px] font-semibold transition-colors"
                >
                  <span>Xem thư trên Ethereal Email</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {sendErrorMsg && (
            <div className="mt-2 p-2 bg-rose-100 border border-rose-300 text-rose-800 rounded-lg text-xs font-medium flex items-center gap-1.5 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{sendErrorMsg}</span>
            </div>
          )}
        </div>

        {/* Email Client Simulated Envelope Header */}
        <div className="px-6 py-3 bg-[#faf6f2] border-b border-[#ebe3d9] text-xs space-y-1 shrink-0 text-[#6b5c54]">
          <div className="flex justify-between">
            <span><strong>Người gửi:</strong> Lumé Beauty & Spa &lt;xacnhan@lumespa.vn&gt;</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Đã xác thực SSL
            </span>
          </div>
          <div><strong>Người nhận:</strong> {appointment.customerName} &lt;{effectiveEmail}&gt;</div>
          <div><strong>Tiêu đề:</strong> <span className="text-[#3a2f2a] font-semibold">[LUMÉ SPA] Xác Nhận Lịch Hẹn Thành Công #{appointment.id}</span></div>
        </div>

        {/* Styled HTML Email Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-[#3a2f2a]">
          {/* Email Header Brand Banner */}
          <div className="text-center pb-6 border-b border-[#ebe3d9]">
            <div className="inline-flex items-center gap-2 text-[#c9a86c] mb-1">
              <Sparkles className="w-5 h-5" />
              <span className="font-serif text-2xl font-bold tracking-wider uppercase text-[#3a2f2a]">LUMÉ</span>
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-xs text-[#6b5c54] font-serif italic">Beauty & Spa • Tỏa Sáng Vẻ Đẹp Tự Nhiên</p>
          </div>

          {/* Email Greeting */}
          <div className="space-y-2">
            <p className="text-sm font-semibold">
              Kính gửi chị <span className="text-[#c9a86c] font-bold">{appointment.customerName}</span>,
            </p>
            <p className="text-xs text-[#6b5c54] leading-relaxed">
              Cảm ơn chị đã tin tưởng lựa chọn dịch vụ tại <strong>Lumé Beauty & Spa</strong>. Hệ thống đã tiếp nhận và giữ chỗ lịch hẹn của chị. Dưới đây là thông tin chi tiết vé xác nhận:
            </p>
          </div>

          {/* Main Ticket Box in Email */}
          <div className="bg-[#f7f1eb] rounded-2xl p-5 border border-[#c9a86c]/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ebe3d9]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c9a86c] block">MÃ LỊCH HẸN</span>
                <span className="font-mono text-xl font-extrabold text-[#3a2f2a]">#{appointment.id}</span>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Đã Xác Nhận Giữ Chỗ
                </span>
              </div>
            </div>

            {/* Grid details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-[#ebe3d9] flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-[#c9a86c] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#6b5c54] text-[11px] block">Ngày hẹn:</span>
                  <span className="font-bold text-[#3a2f2a]">{appointment.date}</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#ebe3d9] flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#c9a86c] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#6b5c54] text-[11px] block">Khung giờ:</span>
                  <span className="font-bold text-[#3a2f2a]">{appointment.timeSlot}</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#ebe3d9] flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#c9a86c] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#6b5c54] text-[11px] block">Chi nhánh Spa:</span>
                  <span className="font-bold text-[#3a2f2a]">{appointment.branch}</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#ebe3d9] flex items-start gap-2.5">
                <UserCheck className="w-4 h-4 text-[#c9a86c] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#6b5c54] text-[11px] block">KTV phụ trách:</span>
                  <span className="font-bold text-[#3a2f2a]">{appointment.specialistName}</span>
                </div>
              </div>
            </div>

            {/* Selected Services list */}
            <div className="bg-white p-4 rounded-xl border border-[#ebe3d9] space-y-2">
              <span className="text-xs font-bold text-[#3a2f2a] block pb-1 border-b border-[#f7f1eb]">
                Danh sách dịch vụ đã đặt:
              </span>
              <ul className="space-y-1.5 text-xs">
                {appointment.selectedServices.map((s) => (
                  <li key={s.id} className="flex justify-between items-center text-[#3a2f2a]">
                    <span>• {s.title} ({s.duration} phút)</span>
                    <span className="font-semibold">{new Intl.NumberFormat('vi-VN').format(s.price)}đ</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t border-[#f7f1eb] flex justify-between items-center font-bold text-sm text-[#b08d4f]">
                <span>Tổng tiền thanh toán tại Spa:</span>
                <span>{new Intl.NumberFormat('vi-VN').format(appointment.finalPrice)}đ</span>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className="bg-[#faf6f2] p-4 rounded-2xl border border-[#ebe3d9] text-xs text-[#6b5c54] space-y-1.5">
            <h4 className="font-bold text-[#3a2f2a] flex items-center gap-1">
              📌 Hướng dẫn khi đến Spa:
            </h4>
            <p>• Vui lòng có mặt trước khung giờ hẹn khoảng 10 phút để nhận trà thảo mộc và chuẩn bị.</p>
            <p>• Nếu cần thay đổi hoặc hủy lịch, chị có thể tra cứu nhanh bằng SĐT <strong>{appointment.customerPhone}</strong> trên website Lumé Spa.</p>
          </div>

          {/* Email Footer */}
          <div className="pt-4 border-t border-[#ebe3d9] text-center text-xs text-[#6b5c54] space-y-1">
            <p className="font-semibold text-[#3a2f2a]">LUMÉ BEAUTY & SPA</p>
            <p>Hotline hỗ trợ khách hàng: <strong>0901 234 567</strong> | Zalo: 0901 234 567</p>
            <p className="text-[11px] text-[#6b5c54] italic">Thư này được hệ thống Lumé Spa tạo tự động.</p>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="p-4 bg-[#f7f1eb] border-t border-[#ebe3d9] text-center shrink-0">
          <button
            onClick={onClose}
            className="px-8 py-2.5 rounded-full bg-[#3a2f2a] hover:bg-[#4a3c35] text-white text-xs font-semibold cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};
