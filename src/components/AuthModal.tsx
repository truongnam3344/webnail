import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, ShieldCheck, UserCheck, ArrowRight, KeyRound, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const { login, register } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('customer');
  const [adminSecretKey, setAdminSecretKey] = useState('');

  // Status feedback messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    
    if (!loginEmail) return;

    const res = login(loginEmail);
    if (!res.success) {
      setErrorMessage(res.error || 'Đăng nhập không thành công.');
      return;
    }

    if (onLoginSuccess) onLoginSuccess();
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regName || !regEmail || !regPhone) {
      setErrorMessage('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    const res = register(regName, regEmail, regPhone, regRole, adminSecretKey);

    if (!res.success) {
      setErrorMessage(res.error || 'Đăng ký không thành công.');
      return;
    }

    if (res.pendingApproval) {
      setSuccessMessage(res.message || 'Đăng ký thành công! Tài khoản đang chờ Admin phê duyệt.');
      // Reset fields
      setRegName('');
      setRegEmail('');
      setRegPhone('');
      setRegPassword('');
      setAdminSecretKey('');
      return;
    }

    // Auto logged in for Customer or Admin
    if (onLoginSuccess) onLoginSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#ebe3d9]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header banner */}
        <div className="bg-[#3a2f2a] text-white p-6 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a86c]/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="inline-block text-[10px] font-semibold tracking-[0.2em] text-[#c9a86c] uppercase mb-1">
            Hệ Thống Thành Viên & Phân Quyền
          </span>
          <h2 className="font-serif text-2xl font-bold tracking-tight">
            Tài Khoản Lumé Spa & Nail
          </h2>
          <p className="text-xs text-[#ebe3d9]/80 mt-1 max-w-xs mx-auto">
            Đăng nhập để đặt lịch dịch vụ, mua sắm mỹ phẩm hoặc quản lý công việc.
          </p>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-red-800 text-xs">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed font-medium">{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-emerald-800 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed font-medium">{successMessage}</div>
          </div>
        )}

        {/* Form Tabs */}
        <div className="flex border-b border-[#ebe3d9] bg-white mt-2">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold text-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'login'
                ? 'border-[#c9a86c] text-[#3a2f2a] bg-[#f7f1eb]/30'
                : 'border-transparent text-[#6b5c54] hover:text-[#3a2f2a]'
            }`}
          >
            Đăng Nhập
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-semibold text-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'register'
                ? 'border-[#c9a86c] text-[#3a2f2a] bg-[#f7f1eb]/30'
                : 'border-transparent text-[#6b5c54] hover:text-[#3a2f2a]'
            }`}
          >
            Đăng Ký Tài Khoản Mới
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3a2f2a] mb-1">
                  Email hoặc Số điện thoại đăng nhập
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-[#6b5c54]" />
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="lan.nguyen@gmail.com hoặc 0901234567"
                    className="w-full pl-10 pr-4 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3a2f2a] mb-1">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-[#6b5c54]" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-[#6b5c54]">
                  <input type="checkbox" defaultChecked className="rounded border-[#ebe3d9] text-[#c9a86c]" />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[#c9a86c] hover:underline font-medium">
                  Quên mật khẩu?
                </a>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#c9a86c] hover:bg-[#b08d4f] text-white text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Xác Nhận Đăng Nhập</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#3a2f2a] mb-1">
                  Lựa Chọn Vai Trò Đăng Ký
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  <button
                    type="button"
                    onClick={() => { setRegRole('customer'); setErrorMessage(null); }}
                    className={`py-2 px-1.5 text-[10px] font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                      regRole === 'customer'
                        ? 'bg-[#c9a86c] text-white border-[#c9a86c] shadow-xs'
                        : 'bg-[#f7f1eb] text-[#6b5c54] border-[#ebe3d9]'
                    }`}
                  >
                    👤 Khách Hàng
                  </button>

                  <button
                    type="button"
                    onClick={() => { setRegRole('staff'); setErrorMessage(null); }}
                    className={`py-2 px-1.5 text-[10px] font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                      regRole === 'staff'
                        ? 'bg-[#c9a86c] text-white border-[#c9a86c] shadow-xs'
                        : 'bg-[#f7f1eb] text-[#6b5c54] border-[#ebe3d9]'
                    }`}
                  >
                    💆‍♀️ KTV Staff
                  </button>

                  <button
                    type="button"
                    onClick={() => { setRegRole('sales'); setErrorMessage(null); }}
                    className={`py-2 px-1.5 text-[10px] font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                      regRole === 'sales'
                        ? 'bg-[#c9a86c] text-white border-[#c9a86c] shadow-xs'
                        : 'bg-[#f7f1eb] text-[#6b5c54] border-[#ebe3d9]'
                    }`}
                  >
                    💼 Sales
                  </button>

                  <button
                    type="button"
                    onClick={() => { setRegRole('accountant'); setErrorMessage(null); }}
                    className={`py-2 px-1.5 text-[10px] font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                      regRole === 'accountant'
                        ? 'bg-[#c9a86c] text-white border-[#c9a86c] shadow-xs'
                        : 'bg-[#f7f1eb] text-[#6b5c54] border-[#ebe3d9]'
                    }`}
                  >
                    🧾 Kế Toán
                  </button>

                  <button
                    type="button"
                    onClick={() => { setRegRole('admin'); setErrorMessage(null); }}
                    className={`py-2 px-1.5 text-[10px] font-semibold rounded-xl border text-center transition-all cursor-pointer ${
                      regRole === 'admin'
                        ? 'bg-[#3a2f2a] text-[#c9a86c] border-[#3a2f2a] shadow-xs font-bold'
                        : 'bg-[#f7f1eb] text-[#6b5c54] border-[#ebe3d9]'
                    }`}
                  >
                    👑 Admin
                  </button>
                </div>
              </div>

              {/* Role requirement notice */}
              {(regRole === 'staff' || regRole === 'sales' || regRole === 'accountant') && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Quy trình đăng ký Nhân viên:</strong> Tài khoản Nhân viên (KTV/Sales/Kế toán) cần được <strong>Quản trị viên (Admin) phê duyệt</strong> trước khi đăng nhập.
                  </span>
                </div>
              )}

              {regRole === 'admin' && (
                <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl space-y-2">
                  <div className="text-[11px] font-bold text-purple-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                    <span>Mã Bảo Mật Quản Trị Viên (Admin Security Code) *</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={adminSecretKey}
                    onChange={(e) => setAdminSecretKey(e.target.value)}
                    placeholder="Mặc định: LUME-ADMIN-2026"
                    className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-purple-300 focus:outline-none focus:border-purple-600 font-mono"
                  />
                  <div className="text-[10px] text-purple-700">
                    Mã xác thực hệ thống: <code className="font-bold bg-purple-100 px-1 py-0.5 rounded">LUME-ADMIN-2026</code>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#3a2f2a] mb-1">
                  Họ và Tên *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-2.5 w-4 h-4 text-[#6b5c54]" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-10 pr-4 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[#3a2f2a] mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3a2f2a] mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="0901234567"
                    className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3a2f2a] mb-1">
                  Mật khẩu khởi tạo *
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 rounded-full bg-[#3a2f2a] hover:bg-[#4a3c35] text-white text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
              >
                Tạo Tài Khoản {regRole === 'customer' ? 'Khách Hàng' : regRole === 'staff' ? 'KTV Staff' : regRole === 'sales' ? 'Sales' : regRole === 'accountant' ? 'Kế Toán' : 'Admin'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
