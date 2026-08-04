import React, { useState } from 'react';
import {
  X, Calendar, DollarSign, Users, Sparkles, Search, Filter, CheckCircle2,
  Clock3, AlertCircle, Play, UserCheck, PlusCircle, Edit3, Trash2, TrendingUp, BarChart3, ShieldCheck, Mail,
  ShoppingBag, Package, Tag, FileText, Check, MessageSquare, Star, Eye, EyeOff, Instagram, Image as ImageIcon
} from 'lucide-react';
import { useAuth, NewArrivalItem, InstaPhotoItem } from '../context/AuthContext';
import { EmailConfirmationModal } from './EmailConfirmationModal';
import { SERVICES_DATA as INITIAL_SERVICES } from '../data/servicesData';
import { SPECIALISTS_DATA as INITIAL_SPECIALISTS } from '../data/specialistsData';
import { ServiceItem, Specialist, Appointment, ProductOrder, UserRole } from '../types';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    allUsers,
    approveUser,
    rejectOrDeleteUser,
    adminAddUser,
    appointments,
    productOrders,
    productsCatalog,
    updateAppointmentStatus,
    updateProductOrderStatus,
    issueInvoice,
    assignSpecialist,
    addProduct,
    updateProductStock,
    deleteProduct,
    reviews,
    deleteReview,
    updateReviewStatus,
    newArrivals,
    addNewArrival,
    updateNewArrival,
    deleteNewArrival,
    instaPhotos,
    addInstaPhoto,
    deleteInstaPhoto,
  } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'bookings' | 'product_orders' | 'services' | 'products' | 'staff' | 'reviews' | 'analytics' | 'new_arrivals' | 'insta'>('bookings');
  
  // New Arrivals management state
  const [showAddArrival, setShowAddArrival] = useState(false);
  const [editingArrival, setEditingArrival] = useState<NewArrivalItem | null>(null);
  const [arrTitle, setArrTitle] = useState('');
  const [arrSubtitle, setArrSubtitle] = useState('');
  const [arrPrice, setArrPrice] = useState('');
  const [arrOriginalPrice, setArrOriginalPrice] = useState('');
  const [arrDiscountTag, setArrDiscountTag] = useState('50% Off');
  const [arrRating, setArrRating] = useState('4.9');
  const [arrReviewCount, setArrReviewCount] = useState('50');
  const [arrImage, setArrImage] = useState('');
  const [arrIcon, setArrIcon] = useState('💧');
  const [arrDesc, setArrDesc] = useState('');
  const [arrCategory, setArrCategory] = useState<'facial' | 'spa' | 'hair' | 'nail'>('facial');

  // Instagram Gallery management state
  const [showAddInsta, setShowAddInsta] = useState(false);
  const [instaUrl, setInstaUrl] = useState('');
  
  // Direct Add Staff local states
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffRole, setStaffRole] = useState<UserRole>('staff');
  
  // Bookings & Product Orders search & filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Email Ticket Modal state
  const [selectedEmailApp, setSelectedEmailApp] = useState<Appointment | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Services management local state (Only Spa / Facial / Nail / Hair services)
  const [servicesList, setServicesList] = useState<ServiceItem[]>(
    INITIAL_SERVICES.filter(item => item.itemType !== 'product' && item.duration > 0)
  );
  const [showAddService, setShowAddService] = useState(false);
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState<'spa' | 'facial' | 'nail' | 'hair'>('spa');
  const [newServiceDuration, setNewServiceDuration] = useState('60');
  const [newServiceIcon, setNewServiceIcon] = useState('✨');
  const [newServiceDesc, setNewServiceDesc] = useState('');

  // Products management local state (Only Physical Products)
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdTitle, setNewProdTitle] = useState('');
  const [newProdSubtitle, setNewProdSubtitle] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('50');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1608248597262-838d12328827?auto=format&fit=crop&w=800&q=80');
  const [newProdCategory, setNewProdCategory] = useState<'facial' | 'hair' | 'spa' | 'nail'>('facial');
  const [newProdIcon, setNewProdIcon] = useState('🧴');
  const [newProdDesc, setNewProdDesc] = useState('');

  // Staff management local state
  const [specialistsList, setSpecialistsList] = useState<Specialist[]>(INITIAL_SPECIALISTS);

  if (!isOpen || !currentUser) return null;

  // Key KPI Calculations
  const completedApps = appointments.filter(a => a.status === 'completed');
  const serviceRevenue = completedApps.reduce((sum, a) => sum + a.finalPrice, 0);

  const completedOrders = productOrders.filter(o => o.status === 'completed' || o.paymentStatus === 'paid');
  const productRevenue = completedOrders.reduce((sum, o) => sum + o.finalPrice, 0);

  const totalRevenue = serviceRevenue + productRevenue;

  // Filtered appointments for Bookings tab
  const filteredAppointments = appointments.filter(app => {
    const matchesSearch =
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.customerPhone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered product orders
  const filteredProductOrders = productOrders.filter(ord => {
    const matchesSearch =
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerPhone.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Submit Handler for Add Spa Service
  const handleAddServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceTitle || !newServicePrice) return;

    const newService: ServiceItem = {
      id: `srv_${Date.now()}`,
      itemType: 'service',
      category: newServiceCategory,
      title: newServiceTitle,
      price: parseInt(newServicePrice, 10),
      duration: parseInt(newServiceDuration, 10),
      icon: newServiceIcon || '✨',
      description: newServiceDesc || 'Dịch vụ spa cao cấp được khởi tạo từ Bảng Quản Trị Admin.',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
      popular: true,
      protocolSteps: [
        'Khai thông huyệt đạo & làm sạch dịu nhẹ',
        'Thực hiện quy trình trị liệu chuyên sâu',
        'Thư giãn với trà thảo mộc organic'
      ]
    };

    setServicesList(prev => [newService, ...prev]);
    setNewServiceTitle('');
    setNewServicePrice('');
    setNewServiceDesc('');
    setShowAddService(false);
  };

  // Submit Handler for Add Product
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdTitle || !newProdPrice) return;

    const newProduct: ServiceItem = {
      id: `prod_${Date.now()}`,
      itemType: 'product',
      category: newProdCategory,
      title: newProdTitle,
      subtitle: newProdSubtitle || 'Mỹ phẩm cao cấp Lumé',
      price: parseInt(newProdPrice, 10),
      duration: 0,
      stockQuantity: parseInt(newProdStock, 10) || 50,
      icon: newProdIcon || '🧴',
      description: newProdDesc || 'Sản phẩm mỹ phẩm cao cấp phân phối chính hãng tại Lumé Spa.',
      image: newProdImage || 'https://images.unsplash.com/photo-1608248597262-838d12328827?auto=format&fit=crop&w=800&q=80',
      popular: true,
      benefits: ['Nguyên liệu thiên nhiên dịu nhẹ', 'Bảo vệ & nuôi dưỡng da sâu', 'An toàn chuẩn y khoa']
    };

    addProduct(newProduct);
    setNewProdTitle('');
    setNewProdSubtitle('');
    setNewProdPrice('');
    setNewProdStock('50');
    setNewProdDesc('');
    setShowAddProduct(false);
  };

  const handleSaveArrival = (e: React.FormEvent) => {
    e.preventDefault();
    if (!arrTitle || !arrPrice) return;

    const itemData: NewArrivalItem = {
      id: editingArrival ? editingArrival.id : `arr_${Date.now()}`,
      category: arrCategory,
      title: arrTitle,
      subtitle: arrSubtitle || 'Sản phẩm mới ra mắt',
      price: parseInt(arrPrice, 10),
      originalPrice: arrOriginalPrice ? parseInt(arrOriginalPrice, 10) : undefined,
      duration: 0,
      itemType: 'product',
      icon: arrIcon || '✨',
      description: arrDesc || 'Sản phẩm cao cấp mới ra mắt tại Lumé Spa.',
      image: arrImage || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&q=80',
      discountTag: arrDiscountTag || '50% Off',
      rating: parseFloat(arrRating) || 5.0,
      reviewCount: parseInt(arrReviewCount, 10) || 50,
    };

    if (editingArrival) {
      updateNewArrival(itemData);
    } else {
      addNewArrival(itemData);
    }

    setEditingArrival(null);
    setShowAddArrival(false);
    setArrTitle('');
    setArrSubtitle('');
    setArrPrice('');
    setArrOriginalPrice('');
    setArrImage('');
    setArrDesc('');
  };

  const openEditArrival = (item: NewArrivalItem) => {
    setEditingArrival(item);
    setArrTitle(item.title);
    setArrSubtitle(item.subtitle || '');
    setArrPrice(item.price.toString());
    setArrOriginalPrice(item.originalPrice ? item.originalPrice.toString() : '');
    setArrDiscountTag(item.discountTag || '50% Off');
    setArrRating((item.rating || 5.0).toString());
    setArrReviewCount((item.reviewCount || 50).toString());
    setArrImage(item.image || '');
    setArrIcon(item.icon || '💧');
    setArrDesc(item.description || '');
    setArrCategory((item.category as any) || 'facial');
    setShowAddArrival(true);
  };

  const handleAddInstaPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instaUrl) return;
    const newPhoto: InstaPhotoItem = {
      id: `insta_${Date.now()}`,
      url: instaUrl,
    };
    addInstaPhoto(newPhoto);
    setInstaUrl('');
    setShowAddInsta(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#ebe3d9] h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#1f1917] text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#c9a86c]/20 text-[#c9a86c] rounded-2xl border border-[#c9a86c]/30">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <span className="inline-block text-[10px] font-bold tracking-[0.2em] text-[#c9a86c] uppercase">
                  Bảng Quản Trị Hệ Thống Admin
                </span>
                <h2 className="font-serif text-2xl font-bold tracking-tight">
                  Lumé Spa & Beauty Operations
                </h2>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <div className="text-[10px] text-white/60">Doanh thu tổng</div>
                <div className="font-bold text-[#c9a86c] text-sm">{totalRevenue.toLocaleString('vi-VN')}đ</div>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <div className="text-[10px] text-white/60">Lịch Spa</div>
                <div className="font-bold text-white text-sm">{appointments.length} ca</div>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <div className="text-[10px] text-white/60">Đơn mỹ phẩm</div>
                <div className="font-bold text-amber-400 text-sm">{productOrders.length} đơn</div>
              </div>
              <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                <div className="text-[10px] text-white/60">Doanh thu shop</div>
                <div className="font-bold text-emerald-400 text-sm">{productRevenue.toLocaleString('vi-VN')}đ</div>
              </div>
              <div className="bg-rose-500/20 p-2.5 rounded-xl border border-rose-400/30 col-span-2 sm:col-span-1">
                <div className="text-[10px] text-rose-200">Staff chờ Admin duyệt</div>
                <div className="font-bold text-rose-300 text-sm flex items-center gap-1">
                  <span>{allUsers.filter(u => (u.role === 'staff' || u.role === 'sales' || u.role === 'accountant') && u.isApproved === false).length} tài khoản</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-[#ebe3d9] bg-[#f7f1eb] px-4 sm:px-6 shrink-0 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('bookings'); setSearchQuery(''); setStatusFilter('all'); }}
            className={`py-3 px-3 sm:px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
              activeTab === 'bookings'
                ? 'border-[#c9a86c] text-[#3a2f2a] bg-white'
                : 'border-transparent text-[#6b5c54] hover:text-[#3a2f2a]'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#c9a86c]" />
            <span>Lịch Hẹn Dịch Vụ ({appointments.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('product_orders'); setSearchQuery(''); setStatusFilter('all'); }}
            className={`py-3 px-3 sm:px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
              activeTab === 'product_orders'
                ? 'border-[#c9a86c] text-[#3a2f2a] bg-white'
                : 'border-transparent text-[#6b5c54] hover:text-[#3a2f2a]'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#c9a86c]" />
            <span>Đơn Mua Sản Phẩm ({productOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
              activeTab === 'services'
                ? 'border-[#c9a86c] text-[#3a2f2a] bg-white'
                : 'border-transparent text-[#6b5c54] hover:text-[#3a2f2a]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#c9a86c]" />
            <span>Danh Mục Dịch Vụ ({servicesList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
              activeTab === 'products'
                ? 'border-[#c9a86c] text-[#3a2f2a] bg-white'
                : 'border-transparent text-[#6b5c54] hover:text-[#3a2f2a]'
            }`}
          >
            <Package className="w-4 h-4 text-[#c9a86c]" />
            <span>Danh Mục Sản Phẩm ({(productsCatalog || []).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
              activeTab === 'staff'
                ? 'border-[#c9a86c] text-[#3a2f2a] bg-white'
                : 'border-transparent text-[#6b5c54] hover:text-[#3a2f2a]'
            }`}
          >
            <Users className="w-4 h-4 text-[#c9a86c]" />
            <span>Quản Lý & Phê Duyệt Staff</span>
            {allUsers.filter(u => (u.role === 'staff' || u.role === 'sales' || u.role === 'accountant') && u.isApproved === false).length > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] bg-rose-500 text-white font-black rounded-full animate-pulse">
                🔴 {allUsers.filter(u => (u.role === 'staff' || u.role === 'sales' || u.role === 'accountant') && u.isApproved === false).length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
              activeTab === 'reviews'
                ? 'border-[#c9a86c] text-[#3a2f2a] bg-white'
                : 'border-transparent text-[#6b5c54] hover:text-[#3a2f2a]'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-[#c9a86c]" />
            <span>Quản Lý Đánh Giá ({(reviews || []).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('new_arrivals')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
              activeTab === 'new_arrivals'
                ? 'border-[#c9a86c] text-[#3a2f2a] bg-white'
                : 'border-transparent text-[#6b5c54] hover:text-[#3a2f2a]'
            }`}
          >
            <Tag className="w-4 h-4 text-[#c9a86c]" />
            <span>Sản Phẩm Mới ({(newArrivals || []).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('insta')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
              activeTab === 'insta'
                ? 'border-[#c9a86c] text-[#3a2f2a] bg-white'
                : 'border-transparent text-[#6b5c54] hover:text-[#3a2f2a]'
            }`}
          >
            <Instagram className="w-4 h-4 text-[#c9a86c]" />
            <span>Thư Viện Instagram ({(instaPhotos || []).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
              activeTab === 'analytics'
                ? 'border-[#c9a86c] text-[#3a2f2a] bg-white'
                : 'border-transparent text-[#6b5c54] hover:text-[#3a2f2a]'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-[#c9a86c]" />
            <span>Báo Cáo Doanh Thu</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#f7f1eb]/30">
          
          {/* TAB 1: QUẢN LÝ LỊCH HẸN DỊCH VỤ SPA */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#ebe3d9]">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[#6b5c54]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm mã lịch (LUME-...), tên hoặc số điện thoại khách..."
                    className="w-full pl-10 pr-4 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#c9a86c]" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c] font-medium"
                  >
                    <option value="all">Tất cả trạng thái lịch</option>
                    <option value="confirmed">⏳ Chờ phục vụ (Confirmed)</option>
                    <option value="in_progress">⚡ Đang thực hiện (In Progress)</option>
                    <option value="completed">✅ Hoàn thành (Completed)</option>
                    <option value="cancelled">❌ Đã hủy (Cancelled)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredAppointments.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#ebe3d9]">
                    <p className="text-xs text-[#6b5c54]">Không tìm thấy lịch hẹn dịch vụ nào phù hợp.</p>
                  </div>
                ) : (
                  filteredAppointments.map((app) => (
                    <div
                      key={app.id}
                      className="bg-white p-5 rounded-2xl border border-[#ebe3d9] shadow-xs hover:border-[#c9a86c]/50 transition-all space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#f7f1eb]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#c9a86c]">#{app.id}</span>
                          <span className="text-xs font-bold text-[#3a2f2a]">{app.customerName}</span>
                          <span className="text-xs text-[#6b5c54]">({app.customerPhone})</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={app.status}
                            onChange={(e) => updateAppointmentStatus(app.id, e.target.value as Appointment['status'])}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-[#f7f1eb] border border-[#ebe3d9] text-[#3a2f2a] cursor-pointer"
                          >
                            <option value="confirmed">⏳ Chờ phục vụ</option>
                            <option value="in_progress">⚡ Đang làm ca</option>
                            <option value="completed">✅ Hoàn thành</option>
                            <option value="cancelled">❌ Đã hủy</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-[#6b5c54] block">Dịch vụ đã chọn:</span>
                          <span className="font-bold text-[#3a2f2a]">
                            {app.selectedServices.map(s => s.title).join(', ')}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] text-[#6b5c54] block">Thời gian & Chi nhánh:</span>
                          <span className="text-[#3a2f2a]">{app.date} lúc <strong>{app.timeSlot}</strong></span>
                        </div>

                        <div>
                          <span className="text-[10px] text-[#6b5c54] block">Phân công KTV:</span>
                          <select
                            value={app.specialistId || ''}
                            onChange={(e) => {
                              const spec = specialistsList.find(s => s.id === e.target.value);
                              if (spec) {
                                assignSpecialist(app.id, spec.id, spec.name);
                              }
                            }}
                            className="w-full px-2 py-1 text-xs bg-[#f7f1eb] rounded-lg border border-[#ebe3d9]"
                          >
                            <option value="">Chưa chọn KTV</option>
                            {specialistsList.map(s => (
                              <option key={s.id} value={s.id}>{s.name} ({s.specialty})</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#f7f1eb] flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-[#6b5c54]">Ghi chú: {app.notes || 'Không có'}</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setSelectedEmailApp(app);
                              setIsEmailModalOpen(true);
                            }}
                            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Mail className="w-3.5 h-3.5 text-slate-600" />
                            <span>Gửi Mail Vé</span>
                          </button>
                          <span className="font-bold text-[#3a2f2a]">Thanh toán: {app.finalPrice.toLocaleString('vi-VN')}đ</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: QUẢN LÝ ĐƠN MUA SẢN PHẨM */}
          {activeTab === 'product_orders' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#ebe3d9]">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[#6b5c54]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm mã đơn (ORD-...), tên khách, số điện thoại..."
                    className="w-full pl-10 pr-4 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#c9a86c]" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] focus:outline-none focus:border-[#c9a86c] font-medium"
                  >
                    <option value="all">Tất cả trạng thái đơn</option>
                    <option value="pending_confirmation">⏳ Chờ xác nhận</option>
                    <option value="shipping">🚚 Đang giao hàng</option>
                    <option value="completed">✅ Đã hoàn thành</option>
                    <option value="cancelled">❌ Đã hủy</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredProductOrders.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#ebe3d9]">
                    <p className="text-xs text-[#6b5c54]">Không tìm thấy đơn mua sản phẩm nào.</p>
                  </div>
                ) : (
                  filteredProductOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white p-5 rounded-2xl border border-[#ebe3d9] shadow-xs space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#f7f1eb]">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#c9a86c]">#{ord.id}</span>
                          <span className="text-xs font-bold text-[#3a2f2a]">{ord.customerName}</span>
                          <span className="text-xs text-[#6b5c54]">({ord.customerPhone})</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={ord.status}
                            onChange={(e) => updateProductOrderStatus(ord.id, e.target.value as any)}
                            className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-[#f7f1eb] border border-[#ebe3d9] text-[#3a2f2a] cursor-pointer"
                          >
                            <option value="pending_confirmation">⏳ Chờ xác nhận</option>
                            <option value="shipping">🚚 Đang giao hàng</option>
                            <option value="completed">✅ Đã hoàn tất</option>
                            <option value="cancelled">❌ Đã hủy</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-[#6b5c54] block">Sản phẩm đặt mua:</span>
                          <ul className="mt-0.5 space-y-1">
                            {ord.items.map((it) => (
                              <li key={it.id} className="font-semibold text-[#3a2f2a]">
                                • {it.title} (x{it.quantity}) - {it.price.toLocaleString('vi-VN')}đ
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <span className="text-[10px] text-[#6b5c54] block">Địa chỉ giao hàng:</span>
                          <p className="text-[#3a2f2a] mt-0.5 font-medium">{ord.shippingAddress}</p>
                          <div className="text-[10px] text-[#6b5c54] mt-1">
                            Hình thức: <strong className="uppercase">{ord.paymentMethod}</strong> | Trạng thái: {ord.paymentStatus === 'paid' ? <span className="text-emerald-600 font-bold">Đã TT</span> : <span className="text-amber-600 font-bold">Chưa TT</span>}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#f7f1eb] flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="text-[#6b5c54]">Ghi chú giao: {ord.notes || 'Không có'}</span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              const code = issueInvoice(ord.id, 'product_order');
                              alert(`Đã xuất hóa đơn điện tử cho đơn #${ord.id}: Mã ${code}`);
                            }}
                            className="px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>{ord.invoiceCode ? `Mã HD: ${ord.invoiceCode}` : 'Xuất Hóa Đơn VAT'}</span>
                          </button>
                          <span className="font-bold text-[#b08d4f] text-sm">Tổng đơn: {ord.finalPrice.toLocaleString('vi-VN')}đ</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: QUẢN LÝ DANH MỤC DỊCH VỤ SPA */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#ebe3d9]">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#3a2f2a]">Danh Mục Dịch Vụ Lumé Spa & Massage</h3>
                  <p className="text-xs text-[#6b5c54]">Quản lý giá, thời lượng thực hiện và mô tả các gói dịch vụ spa/nail.</p>
                </div>

                <button
                  onClick={() => setShowAddService(!showAddService)}
                  className="px-4 py-2 rounded-full bg-[#c9a86c] hover:bg-[#b08d4f] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Thêm Dịch Vụ Spa Mới</span>
                </button>
              </div>

              {/* Form Thêm Dịch Vụ Spa Mới */}
              {showAddService && (
                <form onSubmit={handleAddServiceSubmit} className="bg-white p-5 rounded-2xl border-2 border-[#c9a86c] space-y-3 animate-in fade-in duration-150">
                  <div className="flex justify-between items-center pb-2 border-b border-[#f7f1eb]">
                    <h4 className="font-serif font-bold text-sm text-[#3a2f2a] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#c9a86c]" />
                      <span>Thêm Dịch Vụ Trải Nghiệm Spa Mới</span>
                    </h4>
                    <button type="button" onClick={() => setShowAddService(false)} className="text-[#6b5c54] hover:text-[#3a2f2a]">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Tên Dịch Vụ Spa *</label>
                      <input
                        type="text"
                        required
                        placeholder="VD: Massage Body Thư Giãn Đá Nóng Alpine"
                        value={newServiceTitle}
                        onChange={(e) => setNewServiceTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Giá Tiền (VNĐ) *</label>
                      <input
                        type="number"
                        required
                        placeholder="VD: 550000"
                        value={newServicePrice}
                        onChange={(e) => setNewServicePrice(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Danh Mục Dịch Vụ</label>
                      <select
                        value={newServiceCategory}
                        onChange={(e) => setNewServiceCategory(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9]"
                      >
                        <option value="spa">Spa & Massage Body</option>
                        <option value="facial">Chăm Sóc Da Facial</option>
                        <option value="nail">Nail & Chăm Sóc Móng</option>
                        <option value="hair">Gội Đầu Dưỡng Sinh</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Thời Lượng Thực Hiện (Phút)</label>
                      <input
                        type="number"
                        placeholder="VD: 60"
                        value={newServiceDuration}
                        onChange={(e) => setNewServiceDuration(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Biểu Tượng (Emoji Icon)</label>
                      <select
                        value={newServiceIcon}
                        onChange={(e) => setNewServiceIcon(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9]"
                      >
                        <option value="🪷">🪷 Hoa sen thư giãn</option>
                        <option value="✨">✨ Lấp lánh dưỡng da</option>
                        <option value="🔥">🔥 Đá nóng truyền nhiệt</option>
                        <option value="🌿">🌿 Thảo mộc tự nhiên</option>
                        <option value="💎">💎 Kim cương vàng 24k</option>
                        <option value="💅">💅 Chăm sóc móng nghệ thuật</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Mô Tả Dịch Vụ</label>
                      <input
                        type="text"
                        placeholder="Mô tả công dụng và liệu trình ngắn gọn..."
                        value={newServiceDesc}
                        onChange={(e) => setNewServiceDesc(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddService(false)}
                      className="px-4 py-2 rounded-full text-xs text-[#6b5c54] hover:bg-[#f7f1eb]"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-full bg-[#3a2f2a] text-white text-xs font-bold"
                    >
                      Lưu Dịch Vụ Spa
                    </button>
                  </div>
                </form>
              )}

              {/* Danh sách Dịch vụ Spa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {servicesList.map((s) => (
                  <div key={s.id} className="bg-white p-4 rounded-2xl border border-[#ebe3d9] flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f7f1eb] flex items-center justify-center text-lg shrink-0">
                        {s.icon}
                      </div>
                      <div>
                        <div className="font-serif font-bold text-xs text-[#3a2f2a]">{s.title}</div>
                        <div className="text-[11px] text-[#6b5c54]">
                          {s.duration} phút · <strong className="text-[#c9a86c]">{s.price.toLocaleString('vi-VN')}đ</strong>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setServicesList(prev => prev.filter(item => item.id !== s.id))}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Xóa dịch vụ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: QUẢN LÝ DANH MỤC SẢN PHẨM MỸ PHẨM */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#ebe3d9]">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#3a2f2a]">Danh Mục Sản Phẩm Mỹ Phẩm & Chăm Sóc</h3>
                  <p className="text-xs text-[#6b5c54]">Quản lý giá niêm yết, tồn kho và quy cách các dòng sản phẩm bán lẻ.</p>
                </div>

                <button
                  onClick={() => setShowAddProduct(!showAddProduct)}
                  className="px-4 py-2 rounded-full bg-[#c9a86c] hover:bg-[#b08d4f] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Thêm Sản Phẩm Mới</span>
                </button>
              </div>

              {/* Form Thêm Sản Phẩm Mới */}
              {showAddProduct && (
                <form onSubmit={handleAddProductSubmit} className="bg-white p-5 rounded-2xl border-2 border-[#c9a86c] space-y-3 animate-in fade-in duration-150">
                  <div className="flex justify-between items-center pb-2 border-b border-[#f7f1eb]">
                    <h4 className="font-serif font-bold text-sm text-[#3a2f2a] flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#c9a86c]" />
                      <span>Tạo Sản Phẩm Mỹ Phẩm Mới</span>
                    </h4>
                    <button type="button" onClick={() => setShowAddProduct(false)} className="text-[#6b5c54] hover:text-[#3a2f2a]">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Tên Sản Phẩm *</label>
                      <input
                        type="text"
                        required
                        placeholder="VD: Kem Dưỡng Tế Bào Gốc Nhau Thai Cừu Lumé"
                        value={newProdTitle}
                        onChange={(e) => setNewProdTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Quy Cách / Dung Tích (Subtitle)</label>
                      <input
                        type="text"
                        placeholder="VD: Hũ 50ml - Trẻ hóa làn da"
                        value={newProdSubtitle}
                        onChange={(e) => setNewProdSubtitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Giá Bán Niêm Yết (VNĐ) *</label>
                      <input
                        type="number"
                        required
                        placeholder="VD: 680000"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Số Lượng Nhập Kho Tồn (Stock) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        placeholder="VD: 50"
                        value={newProdStock}
                        onChange={(e) => setNewProdStock(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] font-bold text-emerald-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Danh Mục Sản Phẩm</label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9]"
                      >
                        <option value="facial">Chăm Sóc Da Facial</option>
                        <option value="hair">Chăm Sóc Tóc & Da Đầu</option>
                        <option value="spa">Tinh Dầu Spa & Body</option>
                        <option value="nail">Nail & Sơn Gel Móng</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Biểu Tượng (Icon)</label>
                      <select
                        value={newProdIcon}
                        onChange={(e) => setNewProdIcon(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9]"
                      >
                        <option value="🧴">🧴 Chai hũ kem dưỡng</option>
                        <option value="🌿">🌿 Tinh dầu thảo mộc</option>
                        <option value="🪷">🪷 Serum xịt organic</option>
                        <option value="💅">💅 Bộ sơn móng tay</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="block text-[11px] font-bold text-[#3a2f2a]">
                        Hình Ảnh Sản Phẩm (Image URL / Ảnh Đại Diện) *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          required
                          value={newProdImage}
                          onChange={(e) => setNewProdImage(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="flex-1 px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9]"
                        />
                        <img
                          src={newProdImage}
                          alt="Preview"
                          className="w-9 h-9 object-cover rounded-xl border border-[#ebe3d9] shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1608248597262-838d12328827?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] text-[#6b5c54] self-center">Gợi ý ảnh mẫu:</span>
                        <button
                          type="button"
                          onClick={() => setNewProdImage('https://images.unsplash.com/photo-1608248597262-838d12328827?auto=format&fit=crop&w=800&q=80')}
                          className="px-2 py-0.5 bg-[#f7f1eb] hover:bg-[#ebe3d9] text-[10px] font-semibold text-[#3a2f2a] rounded-md transition-colors"
                        >
                          Hũ Kem Dưỡng
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewProdImage('https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80')}
                          className="px-2 py-0.5 bg-[#f7f1eb] hover:bg-[#ebe3d9] text-[10px] font-semibold text-[#3a2f2a] rounded-md transition-colors"
                        >
                          Chai Tinh Dầu
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewProdImage('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80')}
                          className="px-2 py-0.5 bg-[#f7f1eb] hover:bg-[#ebe3d9] text-[10px] font-semibold text-[#3a2f2a] rounded-md transition-colors"
                        >
                          Serum Dưỡng Da
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewProdImage('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80')}
                          className="px-2 py-0.5 bg-[#f7f1eb] hover:bg-[#ebe3d9] text-[10px] font-semibold text-[#3a2f2a] rounded-md transition-colors"
                        >
                          Sơn Gel Móng
                        </button>
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Mô Tả Sản Phẩm & Công Dụng</label>
                      <input
                        type="text"
                        placeholder="Mô tả công dụng sản phẩm chi tiết..."
                        value={newProdDesc}
                        onChange={(e) => setNewProdDesc(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddProduct(false)}
                      className="px-4 py-2 rounded-full text-xs text-[#6b5c54] hover:bg-[#f7f1eb]"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-full bg-[#3a2f2a] text-white text-xs font-bold shadow-sm"
                    >
                      Lưu Sản Phẩm Vào DB
                    </button>
                  </div>
                </form>
              )}

              {/* Danh sách Sản phẩm với Số Lượng Tồn Kho Live & Ảnh */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(productsCatalog || []).map((p) => {
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
                            <span className="text-[10px] text-[#6b5c54] font-semibold">Tồn kho:</span>
                            <div className="flex items-center gap-1 bg-[#f7f1eb] p-0.5 rounded-lg border border-[#ebe3d9]">
                              <button
                                onClick={() => updateProductStock(p.id, Math.max(0, stock - 1))}
                                className="w-5 h-5 bg-white rounded font-bold text-xs text-[#3a2f2a] hover:bg-[#ebe3d9] flex items-center justify-center transition-colors"
                                title="Giảm 1"
                              >
                                -
                              </button>
                              <span className={`px-1.5 text-xs font-extrabold ${stock === 0 ? 'text-rose-600' : stock < 10 ? 'text-amber-600' : 'text-emerald-700'}`}>
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
                                className="px-1 text-[9px] font-bold text-emerald-800 hover:underline"
                                title="Thêm 10"
                              >
                                +10
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Xóa sản phẩm khỏi DB"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: STAFF MANAGEMENT & APPROVAL PORTAL */}
          {activeTab === 'staff' && (
            <div className="space-y-6">
              {/* Top Banner & Direct Add Button */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#ebe3d9] flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#3a2f2a] flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[#c9a86c]" />
                    <span>Quản Lý & Duyệt Tài Khoản Nhân Viên</span>
                  </h3>
                  <p className="text-xs text-[#6b5c54]">
                    Phê duyệt đăng ký nhân viên mới (KTV/Sales/Kế toán) và khởi tạo tài khoản nhân sự.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddStaffModal(!showAddStaffModal)}
                  className="px-4 py-2 rounded-full bg-[#3a2f2a] hover:bg-[#4a3c35] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-[#c9a86c]" />
                  <span>+ Khởi Tạo Nhân Viên Mới</span>
                </button>
              </div>

              {/* Direct Add Staff Modal/Form */}
              {showAddStaffModal && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!staffName || !staffEmail || !staffPhone) return;
                    adminAddUser({
                      name: staffName,
                      email: staffEmail,
                      phone: staffPhone,
                      role: staffRole,
                    });
                    setStaffName('');
                    setStaffEmail('');
                    setStaffPhone('');
                    setShowAddStaffModal(false);
                  }}
                  className="bg-white p-5 rounded-2xl border-2 border-[#c9a86c] space-y-3 animate-in fade-in duration-150"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-[#f7f1eb]">
                    <h4 className="font-serif font-bold text-sm text-[#3a2f2a] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Thêm Nhân Viên Mới Vào Hệ Thống (Duyệt Tự Động)</span>
                    </h4>
                    <button type="button" onClick={() => setShowAddStaffModal(false)} className="text-[#6b5c54] hover:text-[#3a2f2a]">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Họ và Tên Nhân Viên *</label>
                      <input
                        type="text"
                        required
                        placeholder="VD: Nguyễn Kim Anh"
                        value={staffName}
                        onChange={(e) => setStaffName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Vai Trò Phân Quyền *</label>
                      <select
                        value={staffRole}
                        onChange={(e) => setStaffRole(e.target.value as UserRole)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] font-bold text-[#3a2f2a]"
                      >
                        <option value="staff">💆‍♀️ KTV Chuyên Viên Spa</option>
                        <option value="sales">💼 Sales Executive</option>
                        <option value="accountant">🧾 Kế Toán Viên</option>
                        <option value="admin">👑 Quản Trị Admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Email Công Việc *</label>
                      <input
                        type="email"
                        required
                        placeholder="kimanh@lumespa.vn"
                        value={staffEmail}
                        onChange={(e) => setStaffEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Số Điện Thoại Liên Hệ *</label>
                      <input
                        type="tel"
                        required
                        placeholder="0908889999"
                        value={staffPhone}
                        onChange={(e) => setStaffPhone(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9]"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddStaffModal(false)}
                      className="px-4 py-2 rounded-full text-xs text-[#6b5c54] hover:bg-[#f7f1eb]"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-full bg-[#3a2f2a] text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Xác Nhận Kích Hoạt Nhân Viên
                    </button>
                  </div>
                </form>
              )}

              {/* 1. CHỜ PHÊ DUYỆT TÀI KHOẢN NHÂN VIÊN */}
              {(() => {
                const pendingStaff = allUsers.filter(
                  u => (u.role === 'staff' || u.role === 'sales' || u.role === 'accountant') && u.isApproved === false
                );

                return (
                  <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock3 className="w-5 h-5 text-amber-700" />
                        <h4 className="font-serif font-bold text-sm text-amber-950">
                          Tài Khoản Nhân Viên Đăng Ký CHỜ ADMIN DUYỆT
                        </h4>
                        <span className="px-2 py-0.5 bg-amber-200 text-amber-900 font-extrabold text-xs rounded-full">
                          {pendingStaff.length}
                        </span>
                      </div>
                    </div>

                    {pendingStaff.length === 0 ? (
                      <div className="bg-white/80 p-4 rounded-2xl text-center text-xs text-amber-800/80 italic border border-amber-100">
                        ✨ Hiện tại không có yêu cầu đăng ký nhân viên nào đang chờ phê duyệt.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {pendingStaff.map(user => (
                          <div
                            key={user.id}
                            className="bg-white p-4 rounded-2xl border border-amber-300 shadow-xs flex flex-col justify-between space-y-3"
                          >
                            <div className="flex items-start gap-3">
                              <img
                                src={user.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80'}
                                alt={user.name}
                                className="w-12 h-12 rounded-xl object-cover border border-[#ebe3d9] shrink-0"
                              />
                              <div className="space-y-0.5 min-w-0 flex-1">
                                <div className="font-bold text-xs text-[#3a2f2a] truncate">{user.name}</div>
                                <div className="text-[11px] text-[#6b5c54] truncate">{user.email}</div>
                                <div className="text-[11px] text-[#6b5c54]">SĐT: {user.phone}</div>
                                <div className="inline-block px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-md uppercase tracking-wider">
                                  {user.role === 'staff' ? '💆‍♀️ KTV Staff' : user.role === 'sales' ? '💼 Sales' : '🧾 Kế Toán'}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2 border-t border-[#f7f1eb]">
                              <button
                                onClick={() => approveUser(user.id)}
                                className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Phê Duyệt</span>
                              </button>

                              <button
                                onClick={() => rejectOrDeleteUser(user.id)}
                                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl border border-rose-200 transition-all cursor-pointer"
                              >
                                Từ Chối
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* 2. DANH SÁCH NHÂN VIÊN HOẠT ĐỘNG HỆ THỐNG */}
              <div className="bg-white p-5 rounded-3xl border border-[#ebe3d9] space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-sm text-[#3a2f2a] flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#c9a86c]" />
                    <span>Danh Sách Nhân Sự & KTV Đã Kích Hoạt ({allUsers.filter(u => u.role !== 'customer' && u.isApproved !== false).length})</span>
                  </h4>
                </div>

                <div className="divide-y divide-[#f7f1eb]">
                  {allUsers
                    .filter(u => u.role !== 'customer' && u.isApproved !== false)
                    .map(user => (
                      <div key={user.id} className="py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={user.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80'}
                            alt={user.name}
                            className="w-10 h-10 rounded-xl object-cover border border-[#ebe3d9] shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-[#3a2f2a] truncate flex items-center gap-1.5">
                              <span>{user.name}</span>
                              <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded-full">
                                🟢 Đã Duyệt Active
                              </span>
                            </div>
                            <div className="text-[11px] text-[#6b5c54] truncate">
                              {user.email} · {user.phone}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2 py-0.5 bg-[#f7f1eb] text-[#3a2f2a] text-[10px] font-bold rounded-lg uppercase">
                            {user.role === 'admin' ? '👑 Admin' : user.role === 'staff' ? 'KTV Staff' : user.role === 'sales' ? 'Sales' : 'Kế Toán'}
                          </span>

                          {user.role !== 'admin' && (
                            <button
                              onClick={() => rejectOrDeleteUser(user.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Khóa / Xóa tài khoản"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Specialist Roster Cards */}
              <div className="bg-white p-5 rounded-3xl border border-[#ebe3d9] space-y-3">
                <h4 className="font-serif font-bold text-sm text-[#3a2f2a]">KTV Chuyên Viên Trực Thuộc Chi Nhánh (Lumé Specialists)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {specialistsList.map((spec) => (
                    <div key={spec.id} className="bg-[#f7f1eb]/50 p-4 rounded-2xl border border-[#ebe3d9] flex items-center gap-3">
                      <img
                        src={spec.avatar}
                        alt={spec.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#ebe3d9]"
                      />
                      <div className="space-y-0.5">
                        <div className="font-serif font-bold text-xs text-[#3a2f2a]">{spec.name}</div>
                        <div className="text-[11px] text-[#c9a86c] font-medium">{spec.title}</div>
                        <div className="text-[10px] text-[#6b5c54]">
                          Kinh nghiệm: {spec.experienceYears} năm · Đánh giá: ★ {spec.rating} ({spec.reviewsCount})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: REVIEWS MANAGEMENT */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-[#ebe3d9] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#3a2f2a] flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-[#c9a86c]" />
                      <span>Quản Lý Ý Kiến & Đánh Giá Khách Hàng</span>
                    </h3>
                    <p className="text-xs text-[#6b5c54] mt-0.5">
                      Xem danh sách phản hồi thực tế từ khách hàng, duyệt hiển thị hoặc ẩn các bình luận không phù hợp.
                    </p>
                  </div>
                  <div className="text-xs font-bold text-[#2d4a3e] bg-[#f7f1eb] px-3.5 py-1.5 rounded-full border border-[#ebe3d9]">
                    Tổng cộng: {(reviews || []).length} đánh giá
                  </div>
                </div>

                {(!reviews || reviews.length === 0) ? (
                  <div className="p-8 text-center text-xs text-[#6b5c54] bg-[#f7f1eb] rounded-2xl italic border border-[#ebe3d9]">
                    Chưa có đánh giá nào từ khách hàng.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start justify-between gap-4 ${
                          rev.status === 'hidden'
                            ? 'bg-gray-50 border-gray-200 opacity-60'
                            : 'bg-white border-[#ebe3d9] shadow-xs'
                        }`}
                      >
                        <div className="flex items-start gap-3.5 min-w-0 flex-1">
                          <img
                            src={rev.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80'}
                            alt={rev.customerName}
                            className="w-12 h-12 rounded-full object-cover border border-[#ebe3d9] shrink-0"
                          />
                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-serif font-bold text-sm text-[#3a2f2a]">{rev.customerName}</span>
                              <span className="px-2 py-0.5 text-[10px] font-bold bg-[#f7f1eb] text-[#6b5c54] rounded-md">
                                {rev.role || 'Khách hàng'}
                              </span>
                              {rev.serviceName && (
                                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-800 rounded-md border border-amber-200/60">
                                  {rev.serviceName}
                                </span>
                              )}
                              <span className="text-[10px] text-[#8c827a] ml-auto sm:ml-0">{rev.date}</span>
                            </div>

                            <div className="flex items-center gap-1 text-amber-500">
                              {[...Array(rev.rating || 5)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-current" />
                              ))}
                              <span className="text-xs font-bold text-[#3a2f2a] ml-1">"{rev.title}"</span>
                            </div>

                            <p className="text-xs text-[#524943] leading-relaxed italic bg-[#fbf9f5] p-2.5 rounded-xl border border-[#f0e8dc]">
                              "{rev.comment}"
                            </p>
                          </div>
                        </div>

                        {/* Admin Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-start pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f7f1eb] w-full sm:w-auto justify-end">
                          {rev.status === 'hidden' ? (
                            <button
                              onClick={() => updateReviewStatus(rev.id, 'approved')}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                              title="Hiển thị đánh giá này"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Hiển Thị</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => updateReviewStatus(rev.id, 'hidden')}
                              className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-semibold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                              title="Ẩn đánh giá này"
                            >
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Ẩn</span>
                            </button>
                          )}

                          <button
                            onClick={() => deleteReview(rev.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-rose-200"
                            title="Xóa đánh giá"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6.5: NEW ARRIVALS MANAGEMENT */}
          {activeTab === 'new_arrivals' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-[#ebe3d9] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#3a2f2a] flex items-center gap-2">
                      <Tag className="w-5 h-5 text-[#c9a86c]" />
                      <span>Quản Lý Sản Phẩm Mới (New Arrivals)</span>
                    </h3>
                    <p className="text-xs text-[#6b5c54] mt-0.5">
                      Tùy chỉnh danh sách các sản phẩm mới ra mắt hiển thị ở trang chủ.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingArrival(null);
                      setArrTitle('');
                      setArrSubtitle('');
                      setArrPrice('');
                      setArrOriginalPrice('');
                      setArrImage('');
                      setArrDesc('');
                      setShowAddArrival(true);
                    }}
                    className="px-4 py-2 bg-[#2d4a3e] hover:bg-[#1f352c] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Thêm Mới Mùa Này</span>
                  </button>
                </div>

                {/* Add/Edit Arrival Modal/Form */}
                {showAddArrival && (
                  <form onSubmit={handleSaveArrival} className="p-4 bg-[#fbf9f5] rounded-2xl border border-[#c9a86c]/30 space-y-3 animate-in fade-in">
                    <div className="flex justify-between items-center border-b border-[#ebe3d9] pb-2">
                      <h4 className="font-serif font-bold text-sm text-[#3a2f2a]">
                        {editingArrival ? 'Chỉnh Sửa Sản Phẩm Mới' : 'Thêm Sản Phẩm Mới Vào Trang Chủ'}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowAddArrival(false)}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#6b5c54] mb-1">Tên sản phẩm *</label>
                        <input
                          type="text"
                          required
                          value={arrTitle}
                          onChange={(e) => setArrTitle(e.target.value)}
                          placeholder="Ví dụ: Aquafresh Wellness Serum"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-[#ebe3d9] rounded-xl focus:outline-none focus:border-[#c9a86c]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#6b5c54] mb-1">Mô tả ngắn (Subtitle)</label>
                        <input
                          type="text"
                          value={arrSubtitle}
                          onChange={(e) => setArrSubtitle(e.target.value)}
                          placeholder="Ví dụ: Tinh chất cấp nước khóa ẩm 72h"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-[#ebe3d9] rounded-xl focus:outline-none focus:border-[#c9a86c]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#6b5c54] mb-1">Danh mục</label>
                        <select
                          value={arrCategory}
                          onChange={(e) => setArrCategory(e.target.value as any)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-[#ebe3d9] rounded-xl focus:outline-none focus:border-[#c9a86c]"
                        >
                          <option value="facial">Chăm sóc da mặt (Facial)</option>
                          <option value="spa">Trị liệu body (Spa)</option>
                          <option value="hair">Chăm sóc tóc (Hair)</option>
                          <option value="nail">Chăm sóc móng (Nail)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#6b5c54] mb-1">Giá bán (VNĐ) *</label>
                        <input
                          type="number"
                          required
                          value={arrPrice}
                          onChange={(e) => setArrPrice(e.target.value)}
                          placeholder="350000"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-[#ebe3d9] rounded-xl focus:outline-none focus:border-[#c9a86c]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#6b5c54] mb-1">Giá gốc (VNĐ)</label>
                        <input
                          type="number"
                          value={arrOriginalPrice}
                          onChange={(e) => setArrOriginalPrice(e.target.value)}
                          placeholder="700000"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-[#ebe3d9] rounded-xl focus:outline-none focus:border-[#c9a86c]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#6b5c54] mb-1">Nhãn ưu đãi (Discount Tag)</label>
                        <input
                          type="text"
                          value={arrDiscountTag}
                          onChange={(e) => setArrDiscountTag(e.target.value)}
                          placeholder="50% Off / NEW"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-[#ebe3d9] rounded-xl focus:outline-none focus:border-[#c9a86c]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#6b5c54] mb-1">Link Ảnh Sản Phẩm (URL)</label>
                        <input
                          type="url"
                          value={arrImage}
                          onChange={(e) => setArrImage(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-3 py-1.5 text-xs bg-white border border-[#ebe3d9] rounded-xl focus:outline-none focus:border-[#c9a86c]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#6b5c54] mb-1">Đánh giá (Star Rating)</label>
                        <input
                          type="text"
                          value={arrRating}
                          onChange={(e) => setArrRating(e.target.value)}
                          placeholder="4.9"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-[#ebe3d9] rounded-xl focus:outline-none focus:border-[#c9a86c]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#6b5c54] mb-1">Số lượt mua/đánh giá</label>
                        <input
                          type="number"
                          value={arrReviewCount}
                          onChange={(e) => setArrReviewCount(e.target.value)}
                          placeholder="64"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-[#ebe3d9] rounded-xl focus:outline-none focus:border-[#c9a86c]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#6b5c54] mb-1">Mô tả chi tiết</label>
                      <textarea
                        rows={2}
                        value={arrDesc}
                        onChange={(e) => setArrDesc(e.target.value)}
                        placeholder="Mô tả công dụng sản phẩm..."
                        className="w-full px-3 py-1.5 text-xs bg-white border border-[#ebe3d9] rounded-xl focus:outline-none focus:border-[#c9a86c]"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddArrival(false)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#2d4a3e] hover:bg-[#1f352c] text-white text-xs font-bold rounded-xl shadow-xs"
                      >
                        {editingArrival ? 'Cập Nhật' : 'Lưu Sản Phẩm'}
                      </button>
                    </div>
                  </form>
                )}

                {/* List of New Arrival items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(newArrivals || []).map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl border border-[#ebe3d9] overflow-hidden shadow-xs p-3.5 flex flex-col justify-between space-y-3">
                      <div className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 rounded-xl object-cover border border-[#ebe3d9] shrink-0"
                        />
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <span className="px-2 py-0.5 bg-[#f7f1eb] text-[#2d4a3e] text-[10px] font-extrabold rounded-md uppercase">
                            {item.discountTag || 'NEW'}
                          </span>
                          <h4 className="font-serif font-bold text-xs text-[#3a2f2a] truncate">{item.title}</h4>
                          <p className="text-[11px] text-[#6b5c54] truncate">{item.subtitle}</p>
                          <div className="text-xs font-bold text-[#2d4a3e]">
                            {item.price.toLocaleString('vi-VN')}đ
                            {item.originalPrice && (
                              <span className="text-[10px] text-gray-400 line-through ml-1.5">
                                {item.originalPrice.toLocaleString('vi-VN')}đ
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#f7f1eb] flex items-center justify-between">
                        <div className="text-[10px] text-amber-500 font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{item.rating || 5.0} ({item.reviewCount || 0})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditArrival(item)}
                            className="p-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                            title="Sửa"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteNewArrival(item.id)}
                            className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                            title="Xóa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6.8: INSTAGRAM GALLERY MANAGEMENT */}
          {activeTab === 'insta' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-[#ebe3d9] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#3a2f2a] flex items-center gap-2">
                      <Instagram className="w-5 h-5 text-[#c9a86c]" />
                      <span>Quản Lý Thư Viện Ảnh Instagram</span>
                    </h3>
                    <p className="text-xs text-[#6b5c54] mt-0.5">
                      Thêm hoặc xóa các bức ảnh hiển thị trong mục "Theo Dõi Trên Instagram" ở trang chủ.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setInstaUrl('');
                      setShowAddInsta(true);
                    }}
                    className="px-4 py-2 bg-[#2d4a3e] hover:bg-[#1f352c] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Thêm Ảnh Instagram Mới</span>
                  </button>
                </div>

                {/* Add Insta Photo Form */}
                {showAddInsta && (
                  <form onSubmit={handleAddInstaPhotoSubmit} className="p-4 bg-[#fbf9f5] rounded-2xl border border-[#c9a86c]/30 space-y-3 animate-in fade-in">
                    <div className="flex justify-between items-center border-b border-[#ebe3d9] pb-2">
                      <h4 className="font-serif font-bold text-sm text-[#3a2f2a]">Thêm Ảnh Mới Vào Thư Viện Instagram</h4>
                      <button
                        type="button"
                        onClick={() => setShowAddInsta(false)}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#6b5c54] mb-1">Đường dẫn ảnh (Image URL) *</label>
                      <input
                        type="url"
                        required
                        value={instaUrl}
                        onChange={(e) => setInstaUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full px-3 py-2 text-xs bg-white border border-[#ebe3d9] rounded-xl focus:outline-none focus:border-[#c9a86c]"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddInsta(false)}
                        className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#2d4a3e] hover:bg-[#1f352c] text-white text-xs font-bold rounded-xl shadow-xs"
                      >
                        Lưu Ảnh
                      </button>
                    </div>
                  </form>
                )}

                {/* Instagram Photos Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                  {(instaPhotos || []).map((photo) => (
                    <div key={photo.id} className="relative aspect-square rounded-2xl overflow-hidden border border-[#ebe3d9] group shadow-xs">
                      <img
                        src={photo.url}
                        alt="Insta"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => deleteInstaPhoto(photo.id)}
                          className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md cursor-pointer transition-transform hover:scale-110"
                          title="Xóa ảnh khỏi Instagram Gallery"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: REVENUE ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-[#ebe3d9] space-y-4">
                <h3 className="font-serif font-bold text-lg text-[#3a2f2a]">Báo Cáo Tổng Quan Doanh Thu Hệ Thống</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#f7f1eb] rounded-2xl border border-[#ebe3d9]">
                    <div className="text-xs text-[#6b5c54]">Doanh thu từ Dịch Vụ Spa</div>
                    <div className="font-serif text-xl font-bold text-[#3a2f2a] mt-1">
                      {serviceRevenue.toLocaleString('vi-VN')}đ
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold mt-1">
                      {appointments.length} ca trải nghiệm dịch vụ
                    </div>
                  </div>

                  <div className="p-4 bg-[#f7f1eb] rounded-2xl border border-[#ebe3d9]">
                    <div className="text-xs text-[#6b5c54]">Doanh thu từ Bán Sản Phẩm</div>
                    <div className="font-serif text-xl font-bold text-[#3a2f2a] mt-1">
                      {productRevenue.toLocaleString('vi-VN')}đ
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold mt-1">
                      {productOrders.length} đơn hàng sản phẩm
                    </div>
                  </div>

                  <div className="p-4 bg-[#f7f1eb] rounded-2xl border border-[#ebe3d9]">
                    <div className="text-xs text-[#6b5c54]">Tổng Doanh Thu Hợp Nhất</div>
                    <div className="font-serif text-xl font-bold text-emerald-700 mt-1">
                      {totalRevenue.toLocaleString('vi-VN')}đ
                    </div>
                    <div className="text-[10px] text-[#6b5c54] mt-1">Toàn hệ thống Lumé Beauty & Spa</div>
                  </div>
                </div>
              </div>
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
