import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, UserCheck, Play, CheckCircle2, AlertCircle, FileText, Sparkles, DollarSign, Award, Search, Mail, ShieldCheck, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { EmailConfirmationModal } from './EmailConfirmationModal';
import { Appointment } from '../types';

interface StaffPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StaffPortalModal: React.FC<StaffPortalModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, appointments, updateAppointmentStatus, assignSpecialist } = useAuth();
  const [activeTab, setActiveTab] = useState<'today' | 'my' | 'all'>('today');
  const [searchQuery, setSearchQuery] = useState('');

  // Email Ticket Modal state
  const [selectedEmailApp, setSelectedEmailApp] = useState<Appointment | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  if (!isOpen || !currentUser) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter appointments according to activeTab and searchQuery
  const getDisplayedAppointments = () => {
    let list: Appointment[] = [];

    if (activeTab === 'today') {
      list = appointments.filter(app => app.date === todayStr);
    } else if (activeTab === 'my') {
      list = appointments.filter(
        app => app.specialistId === currentUser.specialistId ||
               app.specialistName === currentUser.name
      );
    } else {
      // 'all' -> Return ALL customer appointments in system
      list = appointments;
    }

    if (!searchQuery.trim()) return list;

    const q = searchQuery.trim().toLowerCase();
    return list.filter(
      app =>
        app.id.toLowerCase().includes(q) ||
        app.customerName.toLowerCase().includes(q) ||
        app.customerPhone.includes(q) ||
        app.branch.toLowerCase().includes(q) ||
        app.specialistName.toLowerCase().includes(q) ||
        app.selectedServices.some(s => s.title.toLowerCase().includes(q))
    );
  };

  const displayedAppointments = getDisplayedAppointments();

  // Calculate staff commission estimation (20% of completed services assigned to this staff member today)
  const myTodayApps = appointments.filter(
    a => (a.specialistId === currentUser.specialistId || a.specialistName === currentUser.name) && a.date === todayStr
  );
  const completedToday = myTodayApps.filter(a => a.status === 'completed');
  const totalCompletedRevenueToday = completedToday.reduce((sum, a) => sum + a.finalPrice, 0);
  const estimatedCommissionToday = Math.round(totalCompletedRevenueToday * 0.20);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#ebe3d9] max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#1e293b] text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80'}
                alt={currentUser.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-400 shrink-0"
              />
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white uppercase tracking-wider mb-1">
                  Cổng Nhân Viên / KTV Lumé Spa
                </div>
                <h2 className="font-serif text-2xl font-bold tracking-tight">
                  KTV {currentUser.name}
                </h2>
                <p className="text-xs text-slate-300">
                  Quyền xem & quản lý toàn bộ các lịch khách hàng đã đặt trên hệ thống
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <div className="text-right">
                <div className="text-[10px] text-slate-400 font-medium">Hoa hồng ca hôm nay</div>
                <div className="text-sm font-bold text-emerald-400">{estimatedCommissionToday.toLocaleString('vi-VN')}đ</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="bg-[#f7f1eb] px-6 pt-3 pb-3 border-b border-[#ebe3d9] space-y-3 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('today')}
                className={`pb-2 px-3 text-xs font-bold transition-all border-b-2 ${
                  activeTab === 'today'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-[#6b5c54] hover:text-[#3a2f2a]'
                }`}
              >
                Lịch Hôm Nay ({appointments.filter(a => a.date === todayStr).length})
              </button>

              <button
                onClick={() => setActiveTab('my')}
                className={`pb-2 px-3 text-xs font-bold transition-all border-b-2 ${
                  activeTab === 'my'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-[#6b5c54] hover:text-[#3a2f2a]'
                }`}
              >
                Lịch Ca Của Tôi ({appointments.filter(a => a.specialistId === currentUser.specialistId || a.specialistName === currentUser.name).length})
              </button>

              <button
                onClick={() => setActiveTab('all')}
                className={`pb-2 px-3 text-xs font-bold transition-all border-b-2 ${
                  activeTab === 'all'
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-[#6b5c54] hover:text-[#3a2f2a]'
                }`}
              >
                Tất Cả Lịch Khách Đặt ({appointments.length})
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative min-w-[220px]">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#6b5c54]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên khách, SĐT, mã đặt..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Appointments List Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {displayedAppointments.length === 0 ? (
            <div className="text-center py-12 bg-[#f7f1eb]/50 rounded-2xl border border-dashed border-[#ebe3d9]">
              <Calendar className="w-12 h-12 text-slate-400/50 mx-auto mb-2" />
              <h3 className="font-serif text-base font-bold text-[#3a2f2a]">Không tìm thấy lịch hẹn nào</h3>
              <p className="text-xs text-[#6b5c54] mt-1 max-w-sm mx-auto">
                Không có lịch hẹn nào thỏa mãn bộ lọc hiện tại. Thử đổi tab hoặc từ khóa tìm kiếm.
              </p>
            </div>
          ) : (
            displayedAppointments.map((app) => {
              const isAssignedToMe = app.specialistId === currentUser.specialistId || app.specialistName === currentUser.name;

              return (
                <div
                  key={app.id}
                  className="bg-white p-5 rounded-2xl border border-[#ebe3d9] shadow-xs space-y-3 relative hover:border-blue-300 transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#f7f1eb]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600">#{app.id}</span>
                      <span className="text-xs text-[#3a2f2a] font-bold">Khách hàng: {app.customerName}</span>
                      <span className="text-xs text-[#6b5c54]">({app.customerPhone})</span>
                      {app.customerEmail && (
                        <span className="text-xs text-slate-500">· {app.customerEmail}</span>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      {isAssignedToMe && (
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                          👤 Ca của bạn
                        </span>
                      )}
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        app.status === 'confirmed' ? 'bg-amber-100 text-amber-800' :
                        app.status === 'in_progress' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                        app.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {app.status === 'confirmed' && '⏳ Chờ phục vụ'}
                        {app.status === 'in_progress' && '⚡ Đang thực hiện'}
                        {app.status === 'completed' && '✅ Hoàn thành'}
                        {app.status === 'cancelled' && '❌ Đã hủy'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="font-serif font-bold text-sm text-[#3a2f2a]">
                      Gói dịch vụ: {app.selectedServices.map(s => s.title).join(' + ')}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#6b5c54]">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>{app.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>Giờ hẹn: <strong className="text-[#3a2f2a]">{app.timeSlot}</strong></span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span>{app.branch}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>KTV: <strong>{app.specialistName || 'Chưa chọn KTV'}</strong></span>
                      </div>
                    </div>

                    {app.notes && (
                      <div className="p-2.5 bg-[#f7f1eb] rounded-xl text-xs text-[#6b5c54] border border-[#ebe3d9] italic">
                        💬 Ghi chú từ khách: "{app.notes}"
                      </div>
                    )}
                  </div>

                  {/* Quick Status Control & Email Ticket */}
                  <div className="pt-3 border-t border-[#f7f1eb] flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-[#6b5c54]">
                      Thành tiền: <strong className="text-[#3a2f2a]">{app.finalPrice.toLocaleString('vi-VN')}đ</strong>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedEmailApp(app);
                          setIsEmailModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Xem vé & gửi email cho khách"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-600" />
                        <span>Gửi Mail Vé</span>
                      </button>

                      {!isAssignedToMe && app.status !== 'cancelled' && app.status !== 'completed' && (
                        <button
                          onClick={() => {
                            assignSpecialist(app.id, currentUser.specialistId || currentUser.id, currentUser.name);
                          }}
                          className="px-3 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                          title="Tự phân công tôi làm ca này"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Nhận ca này</span>
                        </button>
                      )}

                      {app.status === 'confirmed' && (
                        <button
                          onClick={() => updateAppointmentStatus(app.id, 'in_progress')}
                          className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Bắt đầu ca</span>
                        </button>
                      )}

                      {app.status === 'in_progress' && (
                        <button
                          onClick={() => updateAppointmentStatus(app.id, 'completed')}
                          className="px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Hoàn thành ca</span>
                        </button>
                      )}

                      {app.status === 'completed' && (
                        <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Đã hoàn thành
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
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
