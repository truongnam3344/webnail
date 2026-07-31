import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Truck, CreditCard, CheckCircle2, MapPin, Tag, ShieldCheck, ArrowRight, User, Phone, Mail, QrCode } from 'lucide-react';
import { ServiceItem, ProductOrder, ProductOrderItem } from '../types';
import { useAuth } from '../context/AuthContext';

interface ProductPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  productItem: ServiceItem | null;
}

export const ProductPurchaseModal: React.FC<ProductPurchaseModalProps> = ({
  isOpen,
  onClose,
  productItem,
}) => {
  const { currentUser, addProductOrder } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Order details & info, 2: Payment & QR, 3: Confirmation Ticket
  const [quantity, setQuantity] = useState<number>(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer' | 'momo'>('bank_transfer');
  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<ProductOrder | null>(null);

  useEffect(() => {
    if (currentUser) {
      setCustomerName(currentUser.name || '');
      setCustomerPhone(currentUser.phone || '');
      setCustomerEmail(currentUser.email || '');
    }
    setQuantity(1);
    setStep(1);
    setPromoApplied(false);
    setDiscountAmount(0);
  }, [currentUser, productItem, isOpen]);

  if (!isOpen || !productItem) return null;

  const price = productItem.price;
  const subtotal = price * quantity;
  const shippingFee = subtotal >= 500000 ? 0 : 30000; // Free ship over 500k
  const finalPrice = Math.max(0, subtotal + shippingFee - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    const code = promoCode.trim().toUpperCase();
    if (code === 'LUMESALE10' || code === 'LUMEVIP100') {
      const disc = code === 'LUMEVIP100' ? 100000 : Math.round(subtotal * 0.1);
      setDiscountAmount(disc);
      setPromoApplied(true);
    } else {
      alert('Mã giảm giá không hợp lệ hoặc đã hết hạn!');
    }
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !shippingAddress) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng!');
      return;
    }

    const orderId = `ORD-${Math.floor(100 + Math.random() * 900)}`;
    const orderItems: ProductOrderItem[] = [
      {
        id: productItem.id,
        title: productItem.title,
        price: productItem.price,
        quantity: quantity,
        image: productItem.image,
        category: productItem.category,
      },
    ];

    const newOrder: ProductOrder = {
      id: orderId,
      userId: currentUser?.id,
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      items: orderItems,
      subtotal,
      shippingFee,
      discountAmount,
      finalPrice,
      paymentMethod,
      paymentStatus: paymentMethod === 'bank_transfer' || paymentMethod === 'momo' ? 'unpaid' : 'unpaid',
      notes,
      status: 'pending_confirmation', // Chờ Sales xác nhận
      createdAt: new Date().toISOString(),
    };

    addProductOrder(newOrder);
    setCreatedOrder(newOrder);
    setStep(3);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#ebe3d9] max-h-[90vh] flex flex-col">
        {/* Header Banner */}
        <div className="bg-[#3a2f2a] text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-[11px] font-semibold text-[#c9a86c] uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Form Mua Hàng & Đặt Đơn Sản Phẩm</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight">
            Đặt Mua Mỹ Phẩm Lumé Salon & Spa
          </h2>
          <p className="text-xs text-[#ebe3d9]/80 mt-1">
            Giao hàng tận nơi toàn quốc • Kiểm tra hàng trước khi thanh toán
          </p>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {step === 1 && (
            <form onSubmit={handleConfirmOrder} className="space-y-6">
              {/* Product Card Overview */}
              <div className="bg-[#f7f1eb] p-4 rounded-2xl border border-[#ebe3d9] flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={productItem.image}
                  alt={productItem.title}
                  className="w-20 h-20 object-cover rounded-xl shrink-0 shadow-sm"
                />
                <div className="flex-1 text-center sm:text-left">
                  <span className="inline-block px-2 py-0.5 bg-[#c9a86c]/20 text-[#3a2f2a] text-[10px] font-bold rounded-md uppercase mb-1">
                    Sản phẩm cao cấp
                  </span>
                  <h3 className="font-bold text-[#3a2f2a] text-sm sm:text-base leading-snug">
                    {productItem.title}
                  </h3>
                  <p className="text-xs text-[#6b5c54] mt-0.5">{productItem.subtitle}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                    <span className="text-base font-extrabold text-[#c9a86c]">
                      {productItem.price.toLocaleString('vi-VN')} đ
                    </span>
                    {productItem.originalPrice && (
                      <span className="text-xs text-[#6b5c54] line-through">
                        {productItem.originalPrice.toLocaleString('vi-VN')} đ
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#ebe3d9]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-lg bg-[#f7f1eb] hover:bg-[#ebe3d9] font-bold text-[#3a2f2a] transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-[#3a2f2a]">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-[#f7f1eb] hover:bg-[#ebe3d9] font-bold text-[#3a2f2a] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Recipient Information */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-[#3a2f2a] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#ebe3d9] pb-2">
                  <User className="w-4 h-4 text-[#c9a86c]" />
                  <span>Thông Tin Người Nhận Hàng</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#3a2f2a] mb-1">
                      Họ và Tên *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#3a2f2a] mb-1">
                      Số điện thoại nhận hàng *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0901234567"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3a2f2a] mb-1">
                    Địa chỉ nhận hàng đầy đủ *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-[#6b5c54]" />
                    <input
                      type="text"
                      required
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, TP.HCM..."
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3a2f2a] mb-1">
                    Ghi chú giao hàng (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ví dụ: Giao giờ hành chính, gọi trước 15 phút..."
                    className="w-full px-3.5 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#3a2f2a] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#ebe3d9] pb-2">
                  <CreditCard className="w-4 h-4 text-[#c9a86c]" />
                  <span>Hình Thức Thanh Toán</span>
                </h4>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      paymentMethod === 'bank_transfer'
                        ? 'bg-[#3a2f2a] text-white border-[#3a2f2a] shadow-sm'
                        : 'bg-[#f7f1eb] text-[#3a2f2a] border-[#ebe3d9] hover:border-[#c9a86c]'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-[#c9a86c] mb-2" />
                    <div>
                      <div className="text-xs font-bold">Chuyển Khoản QR</div>
                      <div className={`text-[10px] ${paymentMethod === 'bank_transfer' ? 'text-white/70' : 'text-[#6b5c54]'}`}>
                        VietQR tự động
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('momo')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      paymentMethod === 'momo'
                        ? 'bg-[#3a2f2a] text-white border-[#3a2f2a] shadow-sm'
                        : 'bg-[#f7f1eb] text-[#3a2f2a] border-[#ebe3d9] hover:border-[#c9a86c]'
                    }`}
                  >
                    <span className="text-lg mb-1">👛</span>
                    <div>
                      <div className="text-xs font-bold">Ví MoMo</div>
                      <div className={`text-[10px] ${paymentMethod === 'momo' ? 'text-white/70' : 'text-[#6b5c54]'}`}>
                        Thanh toán Ví
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      paymentMethod === 'cod'
                        ? 'bg-[#3a2f2a] text-white border-[#3a2f2a] shadow-sm'
                        : 'bg-[#f7f1eb] text-[#3a2f2a] border-[#ebe3d9] hover:border-[#c9a86c]'
                    }`}
                  >
                    <Truck className="w-5 h-5 text-[#c9a86c] mb-2" />
                    <div>
                      <div className="text-xs font-bold">Thanh Toán COD</div>
                      <div className={`text-[10px] ${paymentMethod === 'cod' ? 'text-white/70' : 'text-[#6b5c54]'}`}>
                        Nhận hàng trả tiền
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Voucher Input */}
              <div className="pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Mã giảm giá (VD: LUMESALE10, LUMEVIP100)"
                    className="flex-1 px-3.5 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] uppercase font-mono focus:outline-none focus:border-[#c9a86c]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-[#3a2f2a] hover:bg-[#4a3c35] text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                  >
                    Áp Dụng
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                    ✓ Đã áp dụng giảm giá {discountAmount.toLocaleString('vi-VN')} đ
                  </p>
                )}
              </div>

              {/* Total Price Summary */}
              <div className="p-4 bg-[#f7f1eb] rounded-2xl border border-[#ebe3d9] space-y-2">
                <div className="flex justify-between text-xs text-[#6b5c54]">
                  <span>Tạm tính ({quantity} sản phẩm):</span>
                  <span className="font-semibold text-[#3a2f2a]">{subtotal.toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="flex justify-between text-xs text-[#6b5c54]">
                  <span>Phí vận chuyển:</span>
                  <span className="font-semibold text-[#3a2f2a]">
                    {shippingFee === 0 ? 'Miễn phí (Đơn > 500k)' : `${shippingFee.toLocaleString('vi-VN')} đ`}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                    <span>Giảm giá:</span>
                    <span>-{discountAmount.toLocaleString('vi-VN')} đ</span>
                  </div>
                )}
                <div className="border-t border-[#ebe3d9] pt-2 flex justify-between items-center">
                  <span className="text-xs font-extrabold text-[#3a2f2a] uppercase">Tổng Thanh Toán:</span>
                  <span className="text-lg font-extrabold text-[#c9a86c]">
                    {finalPrice.toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#c9a86c] hover:bg-[#b08d4f] text-white text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Xác Nhận Đặt Mua Sản Phẩm</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 3 && createdOrder && (
            <div className="text-center py-4 space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 bg-[#c9a86c]/20 text-[#3a2f2a] text-xs font-bold rounded-full mb-2">
                  Đơn Hàng: {createdOrder.id}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#3a2f2a]">
                  Đặt Mua Hàng Thành Công!
                </h3>
                <p className="text-xs text-[#6b5c54] mt-1 max-w-md mx-auto">
                  Đơn hàng của bạn đã chuyển tới bộ phận <strong className="text-[#3a2f2a]">Sale & Kế toán Lumé</strong> để gọi điện xác nhận & bàn giao vận chuyển.
                </p>
              </div>

              {/* Payment Details QR if Bank Transfer or MoMo */}
              {(paymentMethod === 'bank_transfer' || paymentMethod === 'momo') && (
                <div className="p-4 bg-[#f7f1eb] rounded-2xl border border-[#ebe3d9] text-left max-w-md mx-auto space-y-3">
                  <div className="text-xs font-bold text-[#3a2f2a] flex items-center gap-1.5 border-b border-[#ebe3d9] pb-2">
                    <QrCode className="w-4 h-4 text-[#c9a86c]" />
                    <span>Thông Tin Chuyển Khoản VietQR</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-white p-2 rounded-xl border border-[#ebe3d9] flex items-center justify-center shrink-0">
                      <div className="text-center">
                        <QrCode className="w-12 h-12 text-[#3a2f2a] mx-auto" />
                        <span className="text-[9px] text-[#6b5c54] font-mono">VietQR Lumé</span>
                      </div>
                    </div>
                    <div className="text-xs space-y-1 text-[#6b5c54]">
                      <div>Ngân hàng: <strong className="text-[#3a2f2a]">Vietcombank (VCB)</strong></div>
                      <div>Số TK: <strong className="text-[#3a2f2a] font-mono">9988 666 888</strong></div>
                      <div>Tên TK: <strong className="text-[#3a2f2a]">LUME BEAUTY SPA LTD</strong></div>
                      <div>Nội dung: <strong className="text-[#c9a86c] font-mono">{createdOrder.id} - {createdOrder.customerPhone}</strong></div>
                      <div>Số tiền: <strong className="text-[#c9a86c] font-bold">{createdOrder.finalPrice.toLocaleString('vi-VN')} đ</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Order Info Summary Box */}
              <div className="bg-white p-4 rounded-2xl border border-[#ebe3d9] text-left space-y-2 text-xs max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-[#6b5c54]">Sản phẩm:</span>
                  <span className="font-semibold text-[#3a2f2a]">{productItem.title} x {quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b5c54]">Người nhận:</span>
                  <span className="font-semibold text-[#3a2f2a]">{createdOrder.customerName} ({createdOrder.customerPhone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b5c54]">Địa chỉ giao:</span>
                  <span className="font-semibold text-[#3a2f2a] truncate max-w-[200px]">{createdOrder.shippingAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b5c54]">Hình thức thanh toán:</span>
                  <span className="font-bold text-[#c9a86c]">
                    {createdOrder.paymentMethod === 'cod' ? 'Thanh toán COD' : createdOrder.paymentMethod === 'momo' ? 'Ví MoMo' : 'Chuyển khoản QR'}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#ebe3d9] pt-2">
                  <span className="font-bold text-[#3a2f2a]">Trạng thái đơn:</span>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded text-[11px]">
                    Chờ Sales xác nhận
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="px-8 py-3 rounded-full bg-[#3a2f2a] hover:bg-[#4a3c35] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Hoàn Tất & Đóng
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
