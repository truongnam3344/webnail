import React, { useState } from 'react';
import { X, FileText, CheckCircle2, CreditCard, DollarSign, Printer, Search, Building, ShieldCheck, Download, AlertCircle, PieChart, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ProductOrder, Appointment } from '../types';

interface AccountantPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountantPortalModal: React.FC<AccountantPortalModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, productOrders, appointments, updateProductOrderStatus, updateAppointmentStatus, issueInvoice } = useAuth();

  const [activeTab, setActiveTab] = useState<'payments' | 'invoices' | 'reports'>('payments');
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'unpaid' | 'paid'>('all');
  const [selectedInvoiceItem, setSelectedInvoiceItem] = useState<{
    id: string;
    code: string;
    customerName: string;
    customerPhone: string;
    itemsSummary: string;
    totalAmount: number;
    vatAmount: number;
    finalAmount: number;
    date: string;
    paymentMethod: string;
  } | null>(null);

  if (!isOpen) return null;

  // Filter Product Orders
  const filteredOrders = productOrders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.invoiceCode && order.invoiceCode.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPayment =
      paymentFilter === 'all' ||
      (paymentFilter === 'paid' && order.paymentStatus === 'paid') ||
      (paymentFilter === 'unpaid' && order.paymentStatus !== 'paid');
    return matchesSearch && matchesPayment;
  });

  // Filter Appointments
  const filteredAppointments = appointments.filter(app => {
    const matchesSearch =
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.invoiceCode && app.invoiceCode.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPayment =
      paymentFilter === 'all' ||
      (paymentFilter === 'paid' && app.paymentStatus === 'paid') ||
      (paymentFilter === 'unpaid' && app.paymentStatus !== 'paid');
    return matchesSearch && matchesPayment;
  });

  // Financial Metrics Calculation
  const totalProductPaidRevenue = productOrders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.finalPrice, 0);

  const totalServicePaidRevenue = appointments
    .filter(a => a.paymentStatus === 'paid')
    .reduce((sum, a) => sum + a.finalPrice, 0);

  const totalRevenue = totalProductPaidRevenue + totalServicePaidRevenue;

  const totalUnpaidReceivables =
    productOrders.filter(o => o.paymentStatus !== 'paid').reduce((sum, o) => sum + o.finalPrice, 0) +
    appointments.filter(a => a.paymentStatus !== 'paid').reduce((sum, a) => sum + a.finalPrice, 0);

  const issuedInvoicesCount =
    productOrders.filter(o => o.invoiceIssued).length +
    appointments.filter(a => a.invoiceIssued).length;

  const handleApproveProductPayment = (orderId: string) => {
    updateProductOrderStatus(orderId, 'paid', 'paid');
  };

  const handleApproveAppPayment = (appId: string) => {
    updateAppointmentStatus(appId, 'paid', 'paid');
  };

  const handleGenerateInvoice = (id: string, type: 'appointment' | 'product_order') => {
    const code = issueInvoice(id, type);
    alert(`Đã xuất hóa đơn GTGT điện tử mã: ${code} thành công!`);
  };

  const openInvoicePreview = (
    id: string,
    code: string,
    customerName: string,
    customerPhone: string,
    itemsSummary: string,
    totalAmount: number,
    date: string,
    paymentMethod: string
  ) => {
    const vat = Math.round(totalAmount * 0.08); // 8% VAT
    setSelectedInvoiceItem({
      id,
      code: code || `HDGTGT-${id.replace(/[^0-9]/g, '')}`,
      customerName,
      customerPhone,
      itemsSummary,
      totalAmount,
      vatAmount: vat,
      finalAmount: totalAmount + vat,
      date,
      paymentMethod
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#fdfbf7] rounded-3xl shadow-2xl overflow-hidden border border-[#ebe3d9] max-h-[92vh] flex flex-col">
        {/* Header Banner */}
        <div className="bg-[#1f2937] text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#c9a86c]/20 border border-[#c9a86c]/40 flex items-center justify-center text-[#c9a86c]">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#c9a86c] text-[#1f2937] text-[10px] font-extrabold rounded uppercase tracking-wider">
                    Phòng Kế Toán & Tài Chính
                  </span>
                  <span className="text-xs text-[#ebe3d9]/70">Hệ Thống Lumé Spa</span>
                </div>
                <h2 className="font-serif text-2xl font-bold tracking-tight mt-0.5">
                  Quản Lý Thu Chi, Thanh Toán & Hóa Đơn GTGT
                </h2>
                <p className="text-xs text-[#ebe3d9]/80 mt-0.5">
                  Kế toán trưởng: <strong className="text-[#c9a86c]">{currentUser?.name || 'Trần Thu Hà'}</strong> • MST: 0318999888
                </p>
              </div>
            </div>

            {/* Quick Financial Summary */}
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/10">
              <div className="text-right">
                <div className="text-[10px] text-[#ebe3d9]/70 uppercase font-bold">Tổng Thu Thực Tế</div>
                <div className="text-lg font-extrabold text-emerald-400">{totalRevenue.toLocaleString('vi-VN')} đ</div>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="text-right">
                <div className="text-[10px] text-[#ebe3d9]/70 uppercase font-bold">Công Nợ Chưa Thu</div>
                <div className="text-lg font-extrabold text-amber-400">{totalUnpaidReceivables.toLocaleString('vi-VN')} đ</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#ebe3d9] bg-white px-6">
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-3.5 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'payments'
                ? 'border-[#c9a86c] text-[#1f2937] bg-[#f7f1eb]/50'
                : 'border-transparent text-[#6b5c54] hover:text-[#1f2937]'
            }`}
          >
            <CreditCard className="w-4 h-4 text-[#c9a86c]" />
            <span>Duyệt Thu Tiền Đơn Hàng & Lịch Hẹn</span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`py-3.5 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'invoices'
                ? 'border-[#c9a86c] text-[#1f2937] bg-[#f7f1eb]/50'
                : 'border-transparent text-[#6b5c54] hover:text-[#1f2937]'
            }`}
          >
            <FileText className="w-4 h-4 text-[#c9a86c]" />
            <span>Sổ Quỹ Hóa Đơn Điện Tử GTGT ({issuedInvoicesCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`py-3.5 px-4 text-xs font-bold transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'reports'
                ? 'border-[#c9a86c] text-[#1f2937] bg-[#f7f1eb]/50'
                : 'border-transparent text-[#6b5c54] hover:text-[#1f2937]'
            }`}
          >
            <PieChart className="w-4 h-4 text-[#c9a86c]" />
            <span>Báo Cáo Doanh Thu & Cân Đối Tài Chính</span>
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab !== 'reports' && (
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-2xl border border-[#ebe3d9]">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[#6b5c54]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm mã đơn, hóa đơn, tên khách..."
                  className="w-full pl-10 pr-4 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#6b5c54]">Lọc thanh toán:</span>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value as any)}
                  className="px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] font-medium text-[#1f2937] focus:outline-none focus:border-[#c9a86c]"
                >
                  <option value="all">Tất cả đơn thu chi</option>
                  <option value="unpaid">Chưa thu tiền (Unpaid)</option>
                  <option value="paid">Đã thu tiền (Paid)</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB 1: PAYMENT VERIFICATION */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              {/* Product Purchases Invoicing Section */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#1f2937] uppercase tracking-wider flex items-center justify-between border-b border-[#ebe3d9] pb-2">
                  <span>1. Đơn Mua Hàng Sản Phẩm ({productOrders.length})</span>
                  <span className="text-[#6b5c54] normal-case font-normal">Chuyển khoản QR, MoMo & COD</span>
                </h3>

                <div className="space-y-3">
                  {filteredOrders.map(order => (
                    <div
                      key={order.id}
                      className="bg-white p-4 rounded-2xl border border-[#ebe3d9] hover:border-[#c9a86c]/50 transition-all shadow-sm space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 bg-[#1f2937] text-[#c9a86c] text-xs font-mono font-bold rounded-lg">
                            {order.id}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-[#1f2937]">{order.customerName} ({order.customerPhone})</div>
                            <div className="text-[11px] text-[#6b5c54]">
                              PTTT: <strong className="text-[#1f2937]">{order.paymentMethod.toUpperCase()}</strong> • Sale xác nhận: {order.salesPersonName || 'Nguyễn Văn Hải'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              order.paymentStatus === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.paymentStatus === 'paid' ? '✓ Đã thu tiền' : '⏳ Chưa thu tiền'}
                          </span>

                          <span className="text-sm font-extrabold text-[#c9a86c]">
                            {order.finalPrice.toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#f7f1eb] pt-2 text-xs">
                        <div className="text-[#6b5c54]">
                          {order.invoiceIssued ? (
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                              ✓ Mã Hóa Đơn VAT: {order.invoiceCode}
                            </span>
                          ) : (
                            <span>Chưa xuất hóa đơn GTGT</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {order.paymentStatus !== 'paid' && (
                            <button
                              onClick={() => handleApproveProductPayment(order.id)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                            >
                              Duyệt Thu Tiền
                            </button>
                          )}

                          {!order.invoiceIssued && (
                            <button
                              onClick={() => handleGenerateInvoice(order.id, 'product_order')}
                              className="px-3.5 py-1.5 bg-[#1f2937] hover:bg-[#374151] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5 text-[#c9a86c]" />
                              <span>Xuất Hóa Đơn GTGT</span>
                            </button>
                          )}

                          {order.invoiceIssued && (
                            <button
                              onClick={() =>
                                openInvoicePreview(
                                  order.id,
                                  order.invoiceCode || 'HDGTGT-901',
                                  order.customerName,
                                  order.customerPhone,
                                  order.items.map(i => `${i.title} x${i.quantity}`).join(', '),
                                  order.finalPrice,
                                  order.createdAt,
                                  order.paymentMethod
                                )
                              }
                              className="px-3.5 py-1.5 bg-[#f7f1eb] hover:bg-[#ebe3d9] text-[#1f2937] text-xs font-bold rounded-xl transition-all border border-[#ebe3d9] cursor-pointer flex items-center gap-1"
                            >
                              <Printer className="w-3.5 h-3.5 text-[#c9a86c]" />
                              <span>Xem In Hóa Đơn</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Appointments Section */}
              <div className="space-y-3 pt-4">
                <h3 className="text-xs font-bold text-[#1f2937] uppercase tracking-wider flex items-center justify-between border-b border-[#ebe3d9] pb-2">
                  <span>2. Doanh Thu Dịch Vụ Spa Lịch Hẹn ({appointments.length})</span>
                  <span className="text-[#6b5c54] normal-case font-normal">Thu tại quầy / Chuyển khoản</span>
                </h3>

                <div className="space-y-3">
                  {filteredAppointments.map(app => (
                    <div
                      key={app.id}
                      className="bg-white p-4 rounded-2xl border border-[#ebe3d9] hover:border-[#c9a86c]/50 transition-all shadow-sm space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 bg-[#1f2937] text-[#c9a86c] text-xs font-mono font-bold rounded-lg">
                            {app.id}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-[#1f2937]">{app.customerName} ({app.customerPhone})</div>
                            <div className="text-[11px] text-[#6b5c54]">
                              Dịch vụ: {app.selectedServices.map(s => s.title).join(', ')} • {app.branch}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              app.paymentStatus === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {app.paymentStatus === 'paid' ? '✓ Đã thu tiền' : '⏳ Chưa thu tiền'}
                          </span>

                          <span className="text-sm font-extrabold text-[#c9a86c]">
                            {app.finalPrice.toLocaleString('vi-VN')} đ
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#f7f1eb] pt-2 text-xs">
                        <div className="text-[#6b5c54]">
                          {app.invoiceIssued ? (
                            <span className="text-emerald-600 font-bold flex items-center gap-1">
                              ✓ Mã Hóa Đơn VAT: {app.invoiceCode}
                            </span>
                          ) : (
                            <span>Chưa xuất hóa đơn GTGT</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {app.paymentStatus !== 'paid' && (
                            <button
                              onClick={() => handleApproveAppPayment(app.id)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                            >
                              Duyệt Thu Tiền Quầy
                            </button>
                          )}

                          {!app.invoiceIssued && (
                            <button
                              onClick={() => handleGenerateInvoice(app.id, 'appointment')}
                              className="px-3.5 py-1.5 bg-[#1f2937] hover:bg-[#374151] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5 text-[#c9a86c]" />
                              <span>Xuất Hóa Đơn GTGT</span>
                            </button>
                          )}

                          {app.invoiceIssued && (
                            <button
                              onClick={() =>
                                openInvoicePreview(
                                  app.id,
                                  app.invoiceCode || 'HDGTGT-8821',
                                  app.customerName,
                                  app.customerPhone,
                                  app.selectedServices.map(s => s.title).join(', '),
                                  app.finalPrice,
                                  app.date,
                                  app.paymentMethod || 'momo'
                                )
                              }
                              className="px-3.5 py-1.5 bg-[#f7f1eb] hover:bg-[#ebe3d9] text-[#1f2937] text-xs font-bold rounded-xl transition-all border border-[#ebe3d9] cursor-pointer flex items-center gap-1"
                            >
                              <Printer className="w-3.5 h-3.5 text-[#c9a86c]" />
                              <span>Xem In Hóa Đơn</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVOICES LEDGER */}
          {activeTab === 'invoices' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-[#ebe3d9] space-y-4">
                <div className="flex justify-between items-center border-b border-[#ebe3d9] pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#1f2937] flex items-center gap-2">
                    <Building className="w-5 h-5 text-[#c9a86c]" />
                    <span>Sổ Quỹ Hóa Đơn Giá Trị Gia Tăng (GTGT 8%)</span>
                  </h3>
                  <span className="text-xs text-[#6b5c54]">Cơ quan thuế cấp mã điện tử</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#f7f1eb] text-[#1f2937] border-b border-[#ebe3d9]">
                        <th className="p-3 font-bold">Số Hóa Đơn</th>
                        <th className="p-3 font-bold">Khách Hàng</th>
                        <th className="p-3 font-bold">Diễn Giải Nội Dung</th>
                        <th className="p-3 font-bold text-right">Thành Tiền</th>
                        <th className="p-3 font-bold text-right">VAT (8%)</th>
                        <th className="p-3 font-bold text-center">Trạng Thái</th>
                        <th className="p-3 font-bold text-right">Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ebe3d9]">
                      {productOrders.filter(o => o.invoiceIssued).map(order => {
                        const vat = Math.round(order.finalPrice * 0.08);
                        return (
                          <tr key={order.id} className="hover:bg-[#f7f1eb]/50">
                            <td className="p-3 font-mono font-bold text-[#c9a86c]">{order.invoiceCode}</td>
                            <td className="p-3 font-semibold text-[#1f2937]">{order.customerName}</td>
                            <td className="p-3 text-[#6b5c54] max-w-xs truncate">
                              Mua sản phẩm mỹ phẩm Lumé (#{order.id})
                            </td>
                            <td className="p-3 text-right font-semibold">{order.finalPrice.toLocaleString('vi-VN')} đ</td>
                            <td className="p-3 text-right text-[#6b5c54]">{vat.toLocaleString('vi-VN')} đ</td>
                            <td className="p-3 text-center">
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                                Đã phát hành
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() =>
                                  openInvoicePreview(
                                    order.id,
                                    order.invoiceCode!,
                                    order.customerName,
                                    order.customerPhone,
                                    order.items.map(i => i.title).join(', '),
                                    order.finalPrice,
                                    order.createdAt,
                                    order.paymentMethod
                                  )
                                }
                                className="px-2.5 py-1 bg-[#1f2937] text-white text-[11px] font-bold rounded hover:bg-[#374151] cursor-pointer"
                              >
                                Xem In
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                      {appointments.filter(a => a.invoiceIssued).map(app => {
                        const vat = Math.round(app.finalPrice * 0.08);
                        return (
                          <tr key={app.id} className="hover:bg-[#f7f1eb]/50">
                            <td className="p-3 font-mono font-bold text-[#c9a86c]">{app.invoiceCode}</td>
                            <td className="p-3 font-semibold text-[#1f2937]">{app.customerName}</td>
                            <td className="p-3 text-[#6b5c54] max-w-xs truncate">
                              Thanh toán dịch vụ Spa/Nail/Hair (#{app.id})
                            </td>
                            <td className="p-3 text-right font-semibold">{app.finalPrice.toLocaleString('vi-VN')} đ</td>
                            <td className="p-3 text-right text-[#6b5c54]">{vat.toLocaleString('vi-VN')} đ</td>
                            <td className="p-3 text-center">
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                                Đã phát hành
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() =>
                                  openInvoicePreview(
                                    app.id,
                                    app.invoiceCode!,
                                    app.customerName,
                                    app.customerPhone,
                                    app.selectedServices.map(s => s.title).join(', '),
                                    app.finalPrice,
                                    app.date,
                                    app.paymentMethod || 'momo'
                                  )
                                }
                                className="px-2.5 py-1 bg-[#1f2937] text-white text-[11px] font-bold rounded hover:bg-[#374151] cursor-pointer"
                              >
                                Xem In
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FINANCIAL REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#ebe3d9] shadow-sm">
                  <span className="text-xs font-bold text-[#6b5c54]">Doanh Thu Bán Sản Phẩm</span>
                  <div className="text-2xl font-extrabold text-[#1f2937] mt-1">
                    {totalProductPaidRevenue.toLocaleString('vi-VN')} đ
                  </div>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-1">Chiếm 45% tổng doanh thu</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#ebe3d9] shadow-sm">
                  <span className="text-xs font-bold text-[#6b5c54]">Doanh Thu Dịch Vụ Spa</span>
                  <div className="text-2xl font-extrabold text-[#c9a86c] mt-1">
                    {totalServicePaidRevenue.toLocaleString('vi-VN')} đ
                  </div>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-1">Chiếm 55% tổng doanh thu</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#ebe3d9] shadow-sm">
                  <span className="text-xs font-bold text-[#6b5c54]">Thuế GTGT 8% Phải Nộp</span>
                  <div className="text-2xl font-extrabold text-blue-600 mt-1">
                    {Math.round(totalRevenue * 0.08).toLocaleString('vi-VN')} đ
                  </div>
                  <p className="text-[10px] text-blue-600 font-semibold mt-1">Đã kê khai hóa đơn điện tử</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#ebe3d9] space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#1f2937]">Cơ Cấu Kênh Thanh Toán (Payment Channels)</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>VietQR Chuyển Khoản Ngân Hàng (VCB)</span>
                      <span>60% (1,580,000 đ)</span>
                    </div>
                    <div className="w-full bg-[#f7f1eb] h-2.5 rounded-full overflow-hidden">
                      <div className="bg-[#c9a86c] h-full" style={{ width: '60%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Ví Điện Tử MoMo</span>
                      <span>25% (650,000 đ)</span>
                    </div>
                    <div className="w-full bg-[#f7f1eb] h-2.5 rounded-full overflow-hidden">
                      <div className="bg-pink-600 h-full" style={{ width: '25%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Tiền Mặt Tại Quầy Spa & COD</span>
                      <span>15% (380,000 đ)</span>
                    </div>
                    <div className="w-full bg-[#f7f1eb] h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full" style={{ width: '15%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Printable VAT Invoice Modal / Sheet Overlay */}
        {selectedInvoiceItem && (
          <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl border border-[#ebe3d9]">
              {/* Invoice Header */}
              <div className="border-b-2 border-[#1f2937] pb-4 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#c9a86c] tracking-widest">
                    Hóa Đơn Giá Trị Gia Tăng (GTGT)
                  </span>
                  <h2 className="font-serif text-2xl font-bold text-[#1f2937]">LUMÉ BEAUTY SPA</h2>
                  <p className="text-[11px] text-[#6b5c54] mt-0.5">MST: 0318999888 • 123 Nguyễn Huệ, Q.1, TP.HCM</p>
                </div>

                <button
                  onClick={() => setSelectedInvoiceItem(null)}
                  className="p-1.5 bg-[#f7f1eb] hover:bg-[#ebe3d9] rounded-full text-[#1f2937]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Invoice Details */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#6b5c54]">Mã Số Hóa Đơn:</span>
                  <strong className="font-mono text-[#c9a86c]">{selectedInvoiceItem.code}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b5c54]">Ngày lập:</span>
                  <span className="font-semibold">{new Date(selectedInvoiceItem.date).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b5c54]">Khách hàng thanh toán:</span>
                  <strong className="text-[#1f2937]">{selectedInvoiceItem.customerName} ({selectedInvoiceItem.customerPhone})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b5c54]">Hình thức thanh toán:</span>
                  <span className="uppercase font-bold text-[#1f2937]">{selectedInvoiceItem.paymentMethod}</span>
                </div>

                <div className="bg-[#f7f1eb] p-3 rounded-xl border border-[#ebe3d9] space-y-1.5 mt-3">
                  <div className="text-[11px] font-bold text-[#1f2937] uppercase">Chi tiết danh mục:</div>
                  <div className="text-xs text-[#3a2f2a]">{selectedInvoiceItem.itemsSummary}</div>
                </div>

                <div className="border-t border-[#ebe3d9] pt-3 space-y-1 text-xs">
                  <div className="flex justify-between text-[#6b5c54]">
                    <span>Cộng tiền hàng / dịch vụ:</span>
                    <span>{selectedInvoiceItem.totalAmount.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex justify-between text-[#6b5c54]">
                    <span>Thế GTGT (VAT 8%):</span>
                    <span>{selectedInvoiceItem.vatAmount.toLocaleString('vi-VN')} đ</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-[#1f2937] border-t border-[#1f2937] pt-2">
                    <span>TỔNG CỘNG THANH TOÁN:</span>
                    <span className="text-[#c9a86c]">{selectedInvoiceItem.finalAmount.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>
              </div>

              {/* Digital Stamp Simulation */}
              <div className="flex items-center justify-between bg-[#f7f1eb] p-3 rounded-xl border border-[#ebe3d9]">
                <div className="text-[10px] text-[#6b5c54]">
                  Chữ ký số bởi: <strong>CÔNG TY TNHH LUMÉ BEAUTY SPA</strong><br />
                  Kế toán trưởng: <strong>Trần Thu Hà</strong>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-emerald-600 text-emerald-700 flex items-center justify-center font-bold text-[9px] uppercase tracking-tighter text-center leading-tight">
                  Đã Ký Số<br />VAT 8%
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    alert('Đã gửi lệnh in hóa đơn VAT ra máy in nhiệt quầy thu ngân!');
                  }}
                  className="flex-1 py-3 bg-[#1f2937] hover:bg-[#374151] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#c9a86c]" />
                  <span>In Hóa Đơn VAT</span>
                </button>
                <button
                  onClick={() => setSelectedInvoiceItem(null)}
                  className="px-6 py-3 bg-[#f7f1eb] hover:bg-[#ebe3d9] text-[#1f2937] text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
