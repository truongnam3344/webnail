import React, { useState } from 'react';
import { X, ShoppingBag, Calendar, CheckCircle, Truck, Phone, MessageSquare, Search, TrendingUp, Award, UserCheck, Clock, FileText, ArrowUpRight, DollarSign, PackageCheck, AlertTriangle, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { OrderStatus, ProductOrder, Appointment } from '../types';

interface SalesPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SalesPortalModal: React.FC<SalesPortalModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, productOrders, appointments, productsCatalog, updateProductOrderStatus, updateAppointmentStatus, updateProductStock } = useAuth();

  const [activeTab, setActiveTab] = useState<'products' | 'inventory' | 'services' | 'analytics'>('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [salesNoteInput, setSalesNoteInput] = useState<{ [id: string]: string }>({});

  if (!isOpen) return null;

  // Filter Product Orders
  const filteredOrders = (productOrders || []).filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter Inventory Products
  const filteredInventory = (productsCatalog || []).filter(p => {
    const term = searchTerm.toLowerCase();
    return p.title.toLowerCase().includes(term) || (p.subtitle && p.subtitle.toLowerCase().includes(term));
  });

  // Filter Service Appointments
  const filteredAppointments = (appointments || []).filter(app => {
    const matchesSearch =
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Analytics Math
  const totalSalesRevenue = productOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.finalPrice, 0);

  const pendingConfirmationCount = productOrders.filter(o => o.status === 'pending_confirmation').length +
    appointments.filter(a => a.status === 'pending_confirmation').length;

  const estimatedCommission = Math.round(totalSalesRevenue * 0.05); // 5% Commission

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus) => {
    const note = salesNoteInput[orderId] || '';
    updateProductOrderStatus(orderId, status, undefined, note);
  };

  const handleUpdateAppStatus = (appId: string, status: OrderStatus) => {
    updateAppointmentStatus(appId, status);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#fdfbf7] rounded-3xl shadow-2xl overflow-hidden border border-[#ebe3d9] max-h-[92vh] flex flex-col">
        {/* Header Banner */}
        <div className="bg-[#3a2f2a] text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#c9a86c]/20 border border-[#c9a86c]/40 flex items-center justify-center text-[#c9a86c]">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#c9a86c] text-[#3a2f2a] text-[10px] font-extrabold rounded uppercase tracking-wider">
                    Nhân Viên Sale & Chăm Sóc Khách Hàng
                  </span>
                  <span className="text-xs text-[#ebe3d9]/70">Phân Quyền Sale</span>
                </div>
                <h2 className="font-serif text-2xl font-bold tracking-tight mt-0.5">
                  Portal Tư Vấn Bán Hàng & Chốt Đơn
                </h2>
                <p className="text-xs text-[#ebe3d9]/80 mt-0.5">
                  Xin chào, <strong className="text-[#c9a86c]">{currentUser?.name || 'Nhân viên Sale'}</strong> • Mã NV: SALE-2026
                </p>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/10">
              <div className="text-right">
                <div className="text-[10px] text-[#ebe3d9]/70 uppercase font-bold">Đơn chờ Sales duyệt</div>
                <div className="text-lg font-extrabold text-[#c9a86c]">{pendingConfirmationCount} đơn</div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-right">
                <div className="text-[10px] text-[#ebe3d9]/70 uppercase font-bold">Hoa hồng ước tính (5%)</div>
                <div className="text-lg font-extrabold text-emerald-400">{estimatedCommission.toLocaleString('vi-VN')} đ</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#ebe3d9] bg-white px-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3.5 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-[#c9a86c] text-[#3a2f2a] bg-[#f7f1eb]/50'
                : 'border-transparent text-[#6b5c54] hover:text-[#3a2f2a]'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#c9a86c]" />
            <span>Đơn Mua Hàng Sản Phẩm ({(productOrders || []).length})</span>
            {(productOrders || []).filter(o => o.status === 'pending_confirmation').length > 0 && (
              <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[10px] rounded-full font-extrabold animate-pulse">
                {(productOrders || []).filter(o => o.status === 'pending_confirmation').length} mới
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3.5 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'border-[#c9a86c] text-[#3a2f2a] bg-[#f7f1eb]/50'
                : 'border-transparent text-[#6b5c54] hover:text-[#3a2f2a]'
            }`}
          >
            <PackageCheck className="w-4 h-4 text-[#c9a86c]" />
            <span>Kho Hàng & Tồn Kho ({(productsCatalog || []).length})</span>
            {(productsCatalog || []).some(p => (p.stockQuantity ?? 50) < 10) && (
              <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[10px] rounded-full font-extrabold">
                Cảnh báo tồn
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`py-3.5 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'services'
                ? 'border-[#c9a86c] text-[#3a2f2a] bg-[#f7f1eb]/50'
                : 'border-transparent text-[#6b5c54] hover:text-[#3a2f2a]'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#c9a86c]" />
            <span>Đơn Đặt Lịch Hẹn Spa ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3.5 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'border-[#c9a86c] text-[#3a2f2a] bg-[#f7f1eb]/50'
                : 'border-transparent text-[#6b5c54] hover:text-[#3a2f2a]'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#c9a86c]" />
            <span>Báo Cáo Doanh Số & Hoa Hồng</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Controls & Filter Bar */}
          {activeTab !== 'analytics' && (
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-2xl border border-[#ebe3d9]">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[#6b5c54]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={
                    activeTab === 'inventory'
                      ? 'Tìm tên sản phẩm, công dụng...'
                      : 'Tìm mã đơn, tên, số điện thoại...'
                  }
                  className="w-full pl-10 pr-4 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                />
              </div>

              {activeTab === 'products' && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-semibold text-[#6b5c54] whitespace-nowrap">Trạng thái:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] font-medium text-[#3a2f2a] focus:outline-none focus:border-[#c9a86c]"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending_confirmation">Chờ Sales xác nhận</option>
                    <option value="confirmed">Đã xác nhận chốt đơn</option>
                    <option value="shipping">Đang giao hàng</option>
                    <option value="paid">Kế toán đã duyệt thu tiền</option>
                    <option value="completed">Hoàn tất</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* TAB 1: PRODUCT ORDERS */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-[#ebe3d9]">
                  <ShoppingBag className="w-12 h-12 text-[#ebe3d9] mx-auto mb-3" />
                  <p className="text-xs text-[#6b5c54] font-medium">Không tìm thấy đơn mua hàng phù hợp.</p>
                </div>
              ) : (
                filteredOrders.map(order => (
                  <div
                    key={order.id}
                    className="bg-white p-5 rounded-2xl border border-[#ebe3d9] hover:border-[#c9a86c]/50 transition-all shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f7f1eb] pb-3">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 bg-[#3a2f2a] text-[#c9a86c] text-xs font-mono font-bold rounded-lg">
                          {order.id}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-[#3a2f2a]">{order.customerName}</div>
                          <div className="text-[11px] text-[#6b5c54] flex items-center gap-3 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-[#c9a86c]" /> {order.customerPhone}
                            </span>
                            {order.customerEmail && (
                              <span>• {order.customerEmail}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === 'pending_confirmation'
                              ? 'bg-amber-100 text-amber-800'
                              : order.status === 'confirmed'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'shipping'
                              ? 'bg-purple-100 text-purple-800'
                              : order.status === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'completed'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {order.status === 'pending_confirmation' && '⏳ Chờ Sales xác nhận'}
                          {order.status === 'confirmed' && '✓ Sales đã chốt đơn'}
                          {order.status === 'shipping' && '🚚 Đang giao hàng'}
                          {order.status === 'paid' && '💰 Kế toán đã thu tiền'}
                          {order.status === 'completed' && '🎉 Hoàn tất'}
                          {order.status === 'cancelled' && '✕ Đã hủy'}
                        </span>
                        <span className="text-[10px] text-[#6b5c54]">
                          {new Date(order.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    {/* Order Product List with live DB stock check */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#f7f1eb]/60 p-3.5 rounded-xl border border-[#ebe3d9]">
                      <div>
                        <div className="text-[11px] font-bold text-[#3a2f2a] uppercase mb-1">
                          Sản phẩm đặt mua & Tồn kho hiện tại:
                        </div>
                        {order.items.map((item, idx) => {
                          const matchingCatItem = productsCatalog.find(p => p.id === item.id);
                          const currentStock = matchingCatItem?.stockQuantity ?? 50;
                          return (
                            <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-[#3a2f2a] my-1">
                              <img src={item.image} alt={item.title} className="w-8 h-8 rounded object-cover border border-[#ebe3d9]" />
                              <div className="flex-1 min-w-0">
                                <div className="truncate">{item.title}</div>
                                <div className="text-[10px] text-[#6b5c54]">
                                  Số lượng đặt: <strong className="text-[#c9a86c]">x{item.quantity}</strong> · Tồn kho DB: <strong className={currentStock < item.quantity ? 'text-rose-600 font-extrabold' : 'text-emerald-700 font-extrabold'}>{currentStock} sp</strong>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#6b5c54]">Địa chỉ giao hàng:</span>
                          <span className="font-medium text-[#3a2f2a] max-w-[220px] text-right truncate">
                            {order.shippingAddress}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6b5c54]">Thanh toán:</span>
                          <span className="font-bold text-[#3a2f2a]">
                            {order.paymentMethod === 'cod' ? 'COD (Thanh toán khi nhận)' : order.paymentMethod === 'momo' ? 'Ví MoMo' : 'Chuyển khoản QR'}
                            {order.paymentStatus === 'paid' && <span className="text-emerald-600 ml-1">(Đã duyệt)</span>}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm font-extrabold border-t border-[#ebe3d9] pt-1">
                          <span className="text-[#3a2f2a]">Tổng tiền đơn:</span>
                          <span className="text-[#c9a86c]">{order.finalPrice.toLocaleString('vi-VN')} đ</span>
                        </div>
                      </div>
                    </div>

                    {/* Sales Action Controls */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          placeholder="Thêm ghi chú tư vấn sale..."
                          value={salesNoteInput[order.id] || ''}
                          onChange={(e) => setSalesNoteInput({ ...salesNoteInput, [order.id]: e.target.value })}
                          className="flex-1 px-3 py-1.5 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        {order.status === 'pending_confirmation' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                            className="px-4 py-2 bg-[#3a2f2a] hover:bg-[#4a3c35] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-[#c9a86c]" />
                            <span>Xác Nhận Chốt Đơn</span>
                          </button>
                        )}

                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'shipping')}
                            className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Gửi Bưu Tá Giao Hàng</span>
                          </button>
                        )}

                        {order.status !== 'cancelled' && order.status !== 'completed' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                            className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition-all border border-rose-200 cursor-pointer"
                          >
                            Hủy Đơn
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB INVENTORY: KHO HÀNG & TỒN KHO DB FOR SALE ROLE */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-950 text-white rounded-2xl border border-emerald-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold flex items-center gap-2 text-emerald-300">
                    <PackageCheck className="w-4 h-4 text-emerald-400" />
                    <span>Tra Cứu Tồn Kho Thực Tế (Live Stock DB)</span>
                  </div>
                  <p className="text-[11px] text-emerald-100/80 mt-0.5">
                    Tất cả sản phẩm bán ra sẽ tự động trừ số lượng tồn trong kho DB. Nhân viên Sales có thể tra cứu nhanh trước khi chốt đơn cho khách hàng.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-emerald-200 uppercase font-semibold">Mặt hàng sẵn sàng:</span>
                  <div className="text-lg font-black text-emerald-300">{productsCatalog.length} sản phẩm</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredInventory.map(p => {
                  const stock = p.stockQuantity ?? 50;
                  return (
                    <div key={p.id} className="bg-white p-4 rounded-2xl border border-[#ebe3d9] flex items-center justify-between shadow-xs gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-14 h-14 object-cover rounded-xl border border-[#ebe3d9] shrink-0 shadow-xs"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1608248597262-838d12328827?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-serif font-bold text-xs text-[#3a2f2a] truncate">{p.title}</div>
                          <div className="text-[11px] text-[#6b5c54] truncate">{p.subtitle}</div>
                          <div className="text-xs font-extrabold text-[#c9a86c] mt-0.5">
                            {p.price.toLocaleString('vi-VN')} đ
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] font-semibold text-[#6b5c54]">Tồn kho:</span>
                            <div className="flex items-center gap-1 bg-[#f7f1eb] p-0.5 rounded-lg border border-[#ebe3d9]">
                              <button
                                onClick={() => updateProductStock(p.id, Math.max(0, stock - 1))}
                                className="w-5 h-5 bg-white rounded font-bold text-xs text-[#3a2f2a] hover:bg-[#ebe3d9] flex items-center justify-center transition-colors"
                                title="Giảm 1"
                              >
                                -
                              </button>
                              <span className={`px-2 text-xs font-extrabold ${stock === 0 ? 'text-rose-600' : stock < 10 ? 'text-amber-600 animate-pulse' : 'text-emerald-700'}`}>
                                {stock}
                              </span>
                              <button
                                onClick={() => updateProductStock(p.id, stock + 1)}
                                className="w-5 h-5 bg-white rounded font-bold text-xs text-[#3a2f2a] hover:bg-[#ebe3d9] flex items-center justify-center transition-colors"
                                title="Tăng 1"
                              >
                                +
                              </button>
                              <button
                                onClick={() => updateProductStock(p.id, stock + 10)}
                                className="px-1.5 text-[9px] font-bold text-emerald-800 hover:underline"
                                title="Thêm 10 sản phẩm vào kho"
                              >
                                +10
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {stock === 0 ? (
                          <span className="px-2 py-1 bg-rose-100 text-rose-800 text-[10px] font-extrabold rounded-lg inline-block">
                            Hết hàng
                          </span>
                        ) : stock < 10 ? (
                          <span className="px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded-lg inline-block">
                            Sắp hết
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-lg inline-block">
                            Sẵn hàng
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SERVICE BOOKINGS */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              {filteredAppointments.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-[#ebe3d9]">
                  <Calendar className="w-12 h-12 text-[#ebe3d9] mx-auto mb-3" />
                  <p className="text-xs text-[#6b5c54] font-medium">Không tìm thấy lịch hẹn phù hợp.</p>
                </div>
              ) : (
                filteredAppointments.map(app => (
                  <div
                    key={app.id}
                    className="bg-white p-5 rounded-2xl border border-[#ebe3d9] hover:border-[#c9a86c]/50 transition-all shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f7f1eb] pb-3">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 bg-[#3a2f2a] text-[#c9a86c] text-xs font-mono font-bold rounded-lg">
                          {app.id}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-[#3a2f2a]">{app.customerName}</div>
                          <div className="text-[11px] text-[#6b5c54] flex items-center gap-2">
                            <Phone className="w-3 h-3 text-[#c9a86c]" /> {app.customerPhone} • {app.branch}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                          {app.status === 'confirmed' ? '✓ Lịch đã xác nhận' : app.status}
                        </span>
                        <span className="text-[11px] font-bold text-[#c9a86c]">{app.date} ({app.timeSlot})</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#f7f1eb] p-3 rounded-xl border border-[#ebe3d9]">
                      <div>
                        <div className="text-[11px] font-bold text-[#3a2f2a]">Dịch vụ đã chọn:</div>
                        <div className="text-xs text-[#6b5c54]">
                          {app.selectedServices.map(s => s.title).join(', ')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-[#6b5c54]">Thành tiền:</div>
                        <div className="text-sm font-extrabold text-[#c9a86c]">
                          {app.finalPrice.toLocaleString('vi-VN')} đ
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleUpdateAppStatus(app.id, 'confirmed')}
                        className="px-4 py-2 bg-[#3a2f2a] hover:bg-[#4a3c35] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Tư Vấn & Xác Nhận Lịch
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: SALES ANALYTICS & COMMISSION */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#ebe3d9] shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#6b5c54]">Tổng Doanh Số Đơn Mua</span>
                    <DollarSign className="w-5 h-5 text-[#c9a86c]" />
                  </div>
                  <div className="text-2xl font-extrabold text-[#3a2f2a]">
                    {totalSalesRevenue.toLocaleString('vi-VN')} đ
                  </div>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-1">↑ +18% so với tháng trước</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#ebe3d9] shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#6b5c54]">Hoa Hồng Tích Lũy (5%)</span>
                    <Award className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-600">
                    {estimatedCommission.toLocaleString('vi-VN')} đ
                  </div>
                  <p className="text-[10px] text-[#6b5c54] mt-1">Sẽ quyết toán ngày 05 tháng sau</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#ebe3d9] shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#6b5c54]">Tỷ Lệ Chốt Đơn Successful</span>
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-extrabold text-blue-600">92.4%</div>
                  <p className="text-[10px] text-blue-600 font-semibold mt-1">Xếp hạng #1 Toàn Hệ Thống Sale</p>
                </div>
              </div>

              {/* Leaderboard & Customer Outreach */}
              <div className="bg-white p-6 rounded-2xl border border-[#ebe3d9] space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#3a2f2a] flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#c9a86c]" />
                  <span>Danh Sách Khách Hàng Tiềm Năng Cần Gọi Lại</span>
                </h3>

                <div className="divide-y divide-[#ebe3d9]">
                  <div className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-[#3a2f2a]">Chị Nguyễn Thị Lan</strong>
                      <div className="text-[#6b5c54]">Đã mua Kem dưỡng 24K & Tinh dầu Lavender</div>
                    </div>
                    <button className="px-3 py-1.5 bg-[#c9a86c]/20 text-[#3a2f2a] font-bold rounded-lg hover:bg-[#c9a86c] hover:text-white transition-all cursor-pointer">
                      Gọi Chăm Sóc Sức Khỏe Da
                    </button>
                  </div>
                  <div className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-[#3a2f2a]">Chị Phạm Hồng Nhung</strong>
                      <div className="text-[#6b5c54]">Đang chờ gọi xác nhận đơn COD 600.000đ</div>
                    </div>
                    <button className="px-3 py-1.5 bg-[#3a2f2a] text-white font-bold rounded-lg hover:bg-[#4a3c35] transition-all cursor-pointer">
                      Gọi Chốt Đơn Giao Ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
