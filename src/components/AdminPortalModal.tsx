import React, { useState, useRef } from 'react';
import {
  X, Calendar, DollarSign, Users, Sparkles, Search, Filter, CheckCircle2,
  Clock3, AlertCircle, Play, UserCheck, PlusCircle, Edit3, Trash2, TrendingUp, BarChart3, ShieldCheck, Mail,
  ShoppingBag, Package, Tag, FileText, Check, MessageSquare, Star, Eye, EyeOff, Instagram, Image as ImageIcon, BookOpen
} from 'lucide-react';
import { useAuth, NewArrivalItem, InstaPhotoItem } from '../context/AuthContext';
import { EmailConfirmationModal } from './EmailConfirmationModal';
import { SERVICES_DATA as INITIAL_SERVICES } from '../data/servicesData';
import { SPECIALISTS_DATA as INITIAL_SPECIALISTS } from '../data/specialistsData';
import { ServiceItem, Specialist, Appointment, ProductOrder, UserRole, BlogArticle } from '../types';

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
    servicesCatalog,
    updateAppointmentStatus,
    updateProductOrderStatus,
    issueInvoice,
    assignSpecialist,
    addProduct,
    updateProductStock,
    updateProduct,
    deleteProduct,
    addService,
    updateService,
    deleteService,
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
    blogsCatalog,
    addBlogArticle,
    updateBlogArticle,
    deleteBlogArticle,
  } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'bookings' | 'product_orders' | 'services' | 'products' | 'blogs' | 'staff' | 'reviews' | 'analytics' | 'new_arrivals' | 'insta'>('bookings');

  // Blog Management State
  const blogFormRef = useRef<HTMLDivElement>(null);
  const [showAddBlog, setShowAddBlog] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogArticle | null>(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogAuthor, setBlogAuthor] = useState('Jenny Alexander');
  const [blogCategory, setBlogCategory] = useState('Skincare Tips');
  const [blogImage, setBlogImage] = useState('https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80');
  const [blogSummary, setBlogSummary] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogReadTime, setBlogReadTime] = useState('5 phút đọc');
  const [blogTags, setBlogTags] = useState('skincare, spa, lam-dep');
  
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

  // Derived values for analytics, revenue and filtering
  const servicesList = servicesCatalog || [];

  const serviceRevenue = appointments.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
  const productRevenue = productOrders.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
  const totalRevenue = serviceRevenue + productRevenue;

  const filteredAppointments = appointments.filter((app) => {
    const matchesSearch =
      app.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.customerPhone.includes(searchQuery) ||
      app.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredProductOrders = productOrders.filter((ord) => {
    const matchesSearch =
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerPhone.includes(searchQuery) ||
      ord.items.some(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || ord.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Email Ticket Modal state
  const [selectedEmailApp, setSelectedEmailApp] = useState<Appointment | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  // Services management state (Only Spa / Facial / Nail / Hair services)
  const servicesListToUse = (servicesCatalog && servicesCatalog.length > 0) ? servicesCatalog : INITIAL_SERVICES.filter(item => item.itemType !== 'product' && item.duration > 0);
  const [showAddService, setShowAddService] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [servTitle, setServTitle] = useState('');
  const [servPrice, setServPrice] = useState('');
  const [servOriginalPrice, setServOriginalPrice] = useState('');
  const [servSalePercent, setServSalePercent] = useState('');
  const [servCategory, setServCategory] = useState<'spa' | 'facial' | 'nail' | 'hair'>('spa');
  const [servDuration, setServDuration] = useState('60');
  const [servIcon, setServIcon] = useState('✨');
  const [servDesc, setServDesc] = useState('');

  // Products management state (Only Physical Products)
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ServiceItem | null>(null);
  const [prodTitle, setProdTitle] = useState('');
  const [prodSubtitle, setProdSubtitle] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodOriginalPrice, setProdOriginalPrice] = useState('');
  const [prodSalePercent, setProdSalePercent] = useState('');
  const [prodStock, setProdStock] = useState('50');
  const [prodImage, setProdImage] = useState('https://images.unsplash.com/photo-1608248597262-838d12328827?auto=format&fit=crop&w=800&q=80');
  const [prodCategory, setProdCategory] = useState<string>('facial');
  const [prodIcon, setProdIcon] = useState('🧴');
  const [prodDesc, setProdDesc] = useState('');
  const [adminProdCategoryFilter, setAdminProdCategoryFilter] = useState<string>('all');

  // Staff management local state
  const [specialistsList, setSpecialistsList] = useState<Specialist[]>(INITIAL_SPECIALISTS);

  // Auto calculation helpers for Service price & sale %
  const handleServOriginalPriceChange = (origVal: string) => {
    setServOriginalPrice(origVal);
    if (!origVal) {
      setServSalePercent('');
      return;
    }
    const orig = parseInt(origVal, 10);
    if (servPrice) {
      const price = parseInt(servPrice, 10);
      if (!isNaN(orig) && !isNaN(price)) {
        if (orig > price) {
          setServSalePercent(Math.round(((orig - price) / orig) * 100).toString());
        } else {
          setServSalePercent('');
        }
      }
    }
  };

  const handleServSalePercentChange = (pctVal: string) => {
    setServSalePercent(pctVal);
    if (pctVal === '' || pctVal === '0') {
      setServOriginalPrice('');
      setServSalePercent('');
    } else if (servOriginalPrice && pctVal !== '') {
      const orig = parseInt(servOriginalPrice, 10);
      const pct = parseFloat(pctVal);
      if (!isNaN(orig) && !isNaN(pct) && pct >= 0 && pct <= 100) {
        setServPrice(Math.round(orig * (1 - pct / 100)).toString());
      }
    }
  };

  const handleServPriceChange = (priceVal: string) => {
    setServPrice(priceVal);
    if (servOriginalPrice && priceVal) {
      const orig = parseInt(servOriginalPrice, 10);
      const price = parseInt(priceVal, 10);
      if (!isNaN(orig) && !isNaN(price)) {
        if (orig > price) {
          setServSalePercent(Math.round(((orig - price) / orig) * 100).toString());
        } else {
          setServSalePercent('');
          setServOriginalPrice('');
        }
      }
    }
  };

  const openAddService = () => {
    setEditingService(null);
    setServTitle('');
    setServPrice('');
    setServOriginalPrice('');
    setServSalePercent('');
    setServDuration('60');
    setServIcon('✨');
    setServDesc('');
    setServCategory('spa');
    setShowAddService(true);
  };

  const openEditService = (service: ServiceItem) => {
    setEditingService(service);
    setServTitle(service.title);
    setServPrice(service.price.toString());
    const hasDiscount = service.originalPrice && service.originalPrice > service.price;
    setServOriginalPrice(hasDiscount ? service.originalPrice!.toString() : '');
    if (hasDiscount) {
      const pct = Math.round(((service.originalPrice! - service.price) / service.originalPrice!) * 100);
      setServSalePercent(pct.toString());
    } else {
      setServSalePercent('');
    }
    setServDuration(service.duration.toString());
    setServIcon(service.icon || '✨');
    setServDesc(service.description || '');
    setServCategory((service.category as any) || 'spa');
    setShowAddService(true);
  };

  const handleSaveServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!servTitle || !servPrice) return;

    const priceVal = parseInt(servPrice, 10);
    let origVal: number | undefined = servOriginalPrice ? parseInt(servOriginalPrice, 10) : undefined;
    if (!origVal || isNaN(origVal) || origVal <= priceVal || !servSalePercent || servSalePercent === '0') {
      origVal = undefined;
    }

    const itemData: ServiceItem = {
      ...(editingService || {}),
      id: editingService ? editingService.id : `serv_${Date.now()}`,
      itemType: 'service',
      category: servCategory,
      title: servTitle,
      price: priceVal,
      originalPrice: origVal,
      duration: parseInt(servDuration, 10) || 60,
      icon: servIcon || '✨',
      description: servDesc || 'Dịch vụ spa cao cấp Lumé Spa.',
      image: editingService?.image || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
      popular: true,
      protocolSteps: editingService?.protocolSteps || [
        'Khai thông huyệt đạo & làm sạch dịu nhẹ',
        'Thực hiện quy trình trị liệu chuyên sâu',
        'Thư giãn với trà thảo mộc organic'
      ]
    };

    if (editingService) {
      updateService(itemData);
    } else {
      addService(itemData);
    }

    setEditingService(null);
    setShowAddService(false);
  };

  // Auto calculation helpers for Product price & sale %
  const handleProdOriginalPriceChange = (origVal: string) => {
    setProdOriginalPrice(origVal);
    if (!origVal) {
      setProdSalePercent('');
      return;
    }
    const orig = parseInt(origVal, 10);
    if (prodPrice) {
      const price = parseInt(prodPrice, 10);
      if (!isNaN(orig) && !isNaN(price)) {
        if (orig > price) {
          setProdSalePercent(Math.round(((orig - price) / orig) * 100).toString());
        } else {
          setProdSalePercent('');
        }
      }
    }
  };

  const handleProdSalePercentChange = (pctVal: string) => {
    setProdSalePercent(pctVal);
    if (pctVal === '' || pctVal === '0') {
      setProdOriginalPrice('');
      setProdSalePercent('');
    } else if (prodOriginalPrice && pctVal !== '') {
      const orig = parseInt(prodOriginalPrice, 10);
      const pct = parseFloat(pctVal);
      if (!isNaN(orig) && !isNaN(pct) && pct >= 0 && pct <= 100) {
        setProdPrice(Math.round(orig * (1 - pct / 100)).toString());
      }
    }
  };

  const handleProdPriceChange = (priceVal: string) => {
    setProdPrice(priceVal);
    if (prodOriginalPrice && priceVal) {
      const orig = parseInt(prodOriginalPrice, 10);
      const price = parseInt(priceVal, 10);
      if (!isNaN(orig) && !isNaN(price)) {
        if (orig > price) {
          setProdSalePercent(Math.round(((orig - price) / orig) * 100).toString());
        } else {
          setProdSalePercent('');
          setProdOriginalPrice('');
        }
      }
    }
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProdTitle('');
    setProdSubtitle('');
    setProdPrice('');
    setProdOriginalPrice('');
    setProdSalePercent('');
    setProdStock('50');
    setProdImage('https://images.unsplash.com/photo-1608248597262-838d12328827?auto=format&fit=crop&w=800&q=80');
    setProdCategory('facial');
    setProdIcon('🧴');
    setProdDesc('');
    setShowAddProduct(true);
  };

  const openEditProduct = (product: ServiceItem) => {
    setEditingProduct(product);
    setProdTitle(product.title);
    setProdSubtitle(product.subtitle || '');
    setProdPrice(product.price.toString());
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    setProdOriginalPrice(hasDiscount ? product.originalPrice!.toString() : '');
    if (hasDiscount) {
      const pct = Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100);
      setProdSalePercent(pct.toString());
    } else {
      setProdSalePercent('');
    }
    setProdStock((product.stockQuantity ?? 50).toString());
    setProdImage(product.image || 'https://images.unsplash.com/photo-1608248597262-838d12328827?auto=format&fit=crop&w=800&q=80');
    setProdCategory((product.category as any) || 'facial');
    setProdIcon(product.icon || '🧴');
    setProdDesc(product.description || '');
    setShowAddProduct(true);
  };

  const handleSaveProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle || !prodPrice) return;

    const priceVal = parseInt(prodPrice, 10);
    let origVal: number | undefined = prodOriginalPrice ? parseInt(prodOriginalPrice, 10) : undefined;
    if (!origVal || isNaN(origVal) || origVal <= priceVal || !prodSalePercent || prodSalePercent === '0') {
      origVal = undefined;
    }

    const itemData: ServiceItem = {
      ...(editingProduct || {}),
      id: editingProduct ? editingProduct.id : `prod_${Date.now()}`,
      itemType: 'product',
      category: prodCategory,
      title: prodTitle,
      subtitle: prodSubtitle || 'Mỹ phẩm cao cấp Lumé',
      price: priceVal,
      originalPrice: origVal,
      duration: 0,
      stockQuantity: parseInt(prodStock, 10) || 50,
      icon: prodIcon || '🧴',
      description: prodDesc || 'Sản phẩm mỹ phẩm cao cấp phân phối chính hãng tại Lumé Spa.',
      image: prodImage || 'https://images.unsplash.com/photo-1608248597262-838d12328827?auto=format&fit=crop&w=800&q=80',
      popular: true,
      benefits: editingProduct?.benefits || ['Nguyên liệu thiên nhiên dịu nhẹ', 'Bảo vệ & nuôi dưỡng da sâu', 'An toàn chuẩn y khoa']
    };

    if (editingProduct) {
      updateProduct(itemData);
    } else {
      addProduct(itemData);
    }

    setEditingProduct(null);
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

  const openAddBlog = () => {
    setEditingBlog(null);
    setBlogTitle('');
    setBlogAuthor('Jenny Alexander');
    setBlogCategory('Skincare Tips');
    setBlogImage('https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80');
    setBlogSummary('');
    setBlogContent('');
    setBlogReadTime('5 phút đọc');
    setBlogTags('skincare, spa, lam-dep');
    setShowAddBlog(true);
    setTimeout(() => {
      blogFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const openEditBlog = (b: BlogArticle) => {
    setEditingBlog(b);
    setBlogTitle(b.title);
    setBlogAuthor(b.author || 'Lumé Spa');
    setBlogCategory(b.category || 'Skincare Tips');
    setBlogImage(b.image || '');
    setBlogSummary(b.summary || '');
    setBlogContent(b.content || '');
    setBlogReadTime(b.readTime || '5 phút đọc');
    setBlogTags((b.tags || []).join(', '));
    setShowAddBlog(true);
    setTimeout(() => {
      blogFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleSaveBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim()) {
      alert('Vui lòng nhập tiêu đề bài viết!');
      return;
    }

    const tagsArray = blogTags.split(',').map(t => t.trim()).filter(Boolean);

    const blogData: BlogArticle = {
      id: editingBlog ? editingBlog.id : `blog-${Date.now()}`,
      title: blogTitle.trim(),
      author: blogAuthor.trim() || 'Lumé Spa',
      date: editingBlog ? editingBlog.date : new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }),
      category: blogCategory.trim() || 'Chăm sóc da',
      image: blogImage.trim() || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80',
      summary: blogSummary.trim() || blogTitle.trim(),
      content: blogContent.trim() || blogSummary.trim() || blogTitle.trim(),
      readTime: blogReadTime.trim() || '5 phút đọc',
      views: editingBlog ? (editingBlog.views || 120) : Math.floor(100 + Math.random() * 500),
      tags: tagsArray.length > 0 ? tagsArray : ['skincare', 'lumé'],
    };

    if (editingBlog) {
      updateBlogArticle(blogData);
      alert('Cập nhật bài viết thành công!');
    } else {
      addBlogArticle(blogData);
      alert('Thêm bài viết mới thành công!');
    }

    setShowAddBlog(false);
    setEditingBlog(null);
  };

  const handleDeleteBlog = (blogId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
      deleteBlogArticle(blogId);
    }
  };

  if (!isOpen || !currentUser) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#ebe3d9] h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#1f1917] text-white p-6 relative shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            title="Đóng Bảng Quản Trị Admin"
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
            onClick={() => setActiveTab('blogs')}
            className={`py-3 px-3 sm:px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 shrink-0 ${
              activeTab === 'blogs'
                ? 'border-[#c9a86c] text-[#3a2f2a] bg-white'
                : 'border-transparent text-[#6b5c54] hover:text-[#3a2f2a]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#c9a86c]" />
            <span>Quản Lý Bài Viết ({(blogsCatalog || []).length})</span>
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
                  <p className="text-xs text-[#6b5c54]">Quản lý giá bán, giá gốc chưa giảm, phần trăm giảm giá (% Sale) và thời lượng dịch vụ.</p>
                </div>

                <button
                  onClick={openAddService}
                  className="px-4 py-2 rounded-full bg-[#c9a86c] hover:bg-[#b08d4f] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Thêm Dịch Vụ Spa Mới</span>
                </button>
              </div>

              {/* Form Thêm / Chỉnh Sửa Dịch Vụ Spa Mới */}
              {showAddService && (
                <form onSubmit={handleSaveServiceSubmit} className="bg-white p-5 rounded-2xl border-2 border-[#c9a86c] space-y-3 animate-in fade-in duration-150">
                  <div className="flex justify-between items-center pb-2 border-b border-[#f7f1eb]">
                    <h4 className="font-serif font-bold text-sm text-[#3a2f2a] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#c9a86c]" />
                      <span>{editingService ? `Chỉnh Sửa Dịch Vụ: ${editingService.title}` : 'Thêm Dịch Vụ Trải Nghiệm Spa Mới'}</span>
                    </h4>
                    <button type="button" onClick={() => setShowAddService(false)} className="text-[#6b5c54] hover:text-[#3a2f2a]">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Tên Dịch Vụ Spa *</label>
                      <input
                        type="text"
                        required
                        placeholder="VD: Massage Body Thư Giãn Đá Nóng Alpine"
                        value={servTitle}
                        onChange={(e) => setServTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Danh Mục Dịch Vụ</label>
                      <select
                        value={servCategory}
                        onChange={(e) => setServCategory(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9]"
                      >
                        <option value="spa">Spa & Massage Body</option>
                        <option value="facial">Chăm Sóc Da Facial</option>
                        <option value="nail">Nail & Chăm Sóc Móng</option>
                        <option value="hair">Gội Đầu Dưỡng Sinh</option>
                      </select>
                    </div>

                    {/* GIÁ CẢ & SALE % CONTROLS */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">
                        Giá Bán Thực Tế (VNĐ) *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="VD: 550000"
                        value={servPrice}
                        onChange={(e) => handleServPriceChange(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] font-extrabold text-[#c9a86c]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">
                        Giá Niêm Yết Gốc chưa giảm (VNĐ)
                      </label>
                      <input
                        type="number"
                        placeholder="VD: 700000 (Để trống nếu không giảm giá)"
                        value={servOriginalPrice}
                        onChange={(e) => handleServOriginalPriceChange(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] text-[#6b5c54]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-rose-700 mb-1 flex items-center justify-between">
                        <span>Giảm Giá (% Sale)</span>
                        <Tag className="w-3 h-3 text-rose-500" />
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="VD: 20"
                          value={servSalePercent}
                          onChange={(e) => handleServSalePercentChange(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-rose-50/50 rounded-xl border border-rose-200 text-rose-700 font-extrabold pr-8"
                        />
                        <span className="absolute right-3 top-2 text-xs font-bold text-rose-500">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Thời Lượng Thực Hiện (Phút)</label>
                      <input
                        type="number"
                        placeholder="VD: 60"
                        value={servDuration}
                        onChange={(e) => setServDuration(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Biểu Tượng (Emoji Icon)</label>
                      <select
                        value={servIcon}
                        onChange={(e) => setServIcon(e.target.value)}
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
                        value={servDesc}
                        onChange={(e) => setServDesc(e.target.value)}
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
                      className="px-5 py-2 rounded-full bg-[#3a2f2a] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{editingService ? 'Lưu Cập Nhật Giá & Sale' : 'Lưu Dịch Vụ Spa'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Danh sách Dịch vụ Spa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {servicesListToUse.map((s) => {
                  const hasDiscount = s.originalPrice && s.originalPrice > s.price;
                  const discountPct = hasDiscount ? Math.round(((s.originalPrice! - s.price) / s.originalPrice!) * 100) : 0;

                  return (
                    <div key={s.id} className="bg-white p-4 rounded-2xl border border-[#ebe3d9] flex items-center justify-between shadow-xs gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-[#f7f1eb] flex items-center justify-center text-lg shrink-0">
                          {s.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-serif font-bold text-xs text-[#3a2f2a] truncate">{s.title}</div>
                          <div className="text-[11px] text-[#6b5c54] flex flex-wrap items-center gap-1.5 mt-0.5">
                            <span>{s.duration} phút</span>
                            <span>·</span>
                            <strong className="text-[#c9a86c] font-extrabold">{s.price.toLocaleString('vi-VN')}đ</strong>
                            {hasDiscount && (
                              <>
                                <span className="line-through text-[#6b5c54]/60 text-[10px]">{s.originalPrice?.toLocaleString('vi-VN')}đ</span>
                                <span className="px-1.5 py-0.5 bg-rose-500 text-white font-extrabold text-[9px] rounded-md shrink-0">
                                  -{discountPct}% SALE
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => openEditService(s)}
                          className="px-2.5 py-1.5 bg-[#f7f1eb] hover:bg-[#ebe3d9] text-[#3a2f2a] rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Điều chỉnh Giá & % Sale"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#c9a86c]" />
                          <span className="hidden sm:inline text-[11px]">Sửa Giá/Sale</span>
                        </button>

                        <button
                          onClick={() => deleteService(s.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa dịch vụ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: QUẢN LÝ DANH MỤC SẢN PHẨM MỸ PHẨM */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#ebe3d9]">
                <div>
                  <h3 className="font-serif font-bold text-base text-[#3a2f2a]">Danh Mục Sản Phẩm Mỹ Phẩm & Chăm Sóc</h3>
                  <p className="text-xs text-[#6b5c54]">Quản lý giá thực tế, giá niêm yết, phần trăm giảm giá (% Sale) và số lượng tồn kho.</p>
                </div>

                <button
                  onClick={openAddProduct}
                  className="px-4 py-2 rounded-full bg-[#c9a86c] hover:bg-[#b08d4f] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Thêm Sản Phẩm Mới</span>
                </button>
              </div>

              {/* Form Thêm / Chỉnh Sửa Sản Phẩm Mới */}
              {showAddProduct && (
                <form onSubmit={handleSaveProductSubmit} className="bg-white p-5 rounded-2xl border-2 border-[#c9a86c] space-y-3 animate-in fade-in duration-150">
                  <div className="flex justify-between items-center pb-2 border-b border-[#f7f1eb]">
                    <h4 className="font-serif font-bold text-sm text-[#3a2f2a] flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#c9a86c]" />
                      <span>{editingProduct ? `Chỉnh Sửa Sản Phẩm: ${editingProduct.title}` : 'Tạo Sản Phẩm Mỹ Phẩm Mới'}</span>
                    </h4>
                    <button type="button" onClick={() => setShowAddProduct(false)} className="text-[#6b5c54] hover:text-[#3a2f2a]">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Tên Sản Phẩm *</label>
                      <input
                        type="text"
                        required
                        placeholder="VD: Kem Dưỡng Tế Bào Gốc Nhau Thai Cừu Lumé"
                        value={prodTitle}
                        onChange={(e) => setProdTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Quy Cách / Dung Tích</label>
                      <input
                        type="text"
                        placeholder="VD: Hũ 50ml - Trẻ hóa làn da"
                        value={prodSubtitle}
                        onChange={(e) => setProdSubtitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9]"
                      />
                    </div>

                    {/* GIÁ CẢ & SALE % CONTROLS */}
                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">
                        Giá Bán Thực Tế (VNĐ) *
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="VD: 680000"
                        value={prodPrice}
                        onChange={(e) => handleProdPriceChange(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] font-extrabold text-[#c9a86c]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">
                        Giá Niêm Yết Gốc chưa giảm (VNĐ)
                      </label>
                      <input
                        type="number"
                        placeholder="VD: 850000 (Để trống nếu không giảm giá)"
                        value={prodOriginalPrice}
                        onChange={(e) => handleProdOriginalPriceChange(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] text-[#6b5c54]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-rose-700 mb-1 flex items-center justify-between">
                        <span>Giảm Giá (% Sale)</span>
                        <Tag className="w-3 h-3 text-rose-500" />
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="VD: 20"
                          value={prodSalePercent}
                          onChange={(e) => handleProdSalePercentChange(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-rose-50/50 rounded-xl border border-rose-200 text-rose-700 font-extrabold pr-8"
                        />
                        <span className="absolute right-3 top-2 text-xs font-bold text-rose-500">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Số Lượng Nhập Kho Tồn (Stock) *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        placeholder="VD: 50"
                        value={prodStock}
                        onChange={(e) => setProdStock(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9] font-bold text-emerald-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Danh Mục Sản Phẩm</label>
                      <select
                        value={prodCategory}
                        onChange={(e) => setProdCategory(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9]"
                      >
                        <option value="facial">Chăm Sóc Da Facial</option>
                        <option value="makeup">Trang Điểm (Makeup)</option>
                        <option value="fragrances">Nước Hoa & Hương Thơm</option>
                        <option value="hair">Chăm Sóc Tóc & Da Đầu</option>
                        <option value="spa">Tinh Dầu Spa & Body</option>
                        <option value="nail">Nail & Sơn Gel Móng</option>
                        <option value="accessories">Phụ Kiện & Dụng Cụ</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Biểu Tượng (Icon)</label>
                      <select
                        value={prodIcon}
                        onChange={(e) => setProdIcon(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9]"
                      >
                        <option value="🧴">🧴 Chai hũ kem dưỡng</option>
                        <option value="🌿">🌿 Tinh dầu thảo mộc</option>
                        <option value="🪷">🪷 Serum xịt organic</option>
                        <option value="💅">💅 Bộ sơn móng tay</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3 space-y-1.5">
                      <label className="block text-[11px] font-bold text-[#3a2f2a]">
                        Hình Ảnh Sản Phẩm (Image URL / Ảnh Đại Diện) *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          required
                          value={prodImage}
                          onChange={(e) => setProdImage(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="flex-1 px-3 py-2 text-xs bg-[#f7f1eb] rounded-xl border border-[#ebe3d9]"
                        />
                        <img
                          src={prodImage}
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
                          onClick={() => setProdImage('https://images.unsplash.com/photo-1608248597262-838d12328827?auto=format&fit=crop&w=800&q=80')}
                          className="px-2 py-0.5 bg-[#f7f1eb] hover:bg-[#ebe3d9] text-[10px] font-semibold text-[#3a2f2a] rounded-md transition-colors"
                        >
                          Hũ Kem Dưỡng
                        </button>
                        <button
                          type="button"
                          onClick={() => setProdImage('https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80')}
                          className="px-2 py-0.5 bg-[#f7f1eb] hover:bg-[#ebe3d9] text-[10px] font-semibold text-[#3a2f2a] rounded-md transition-colors"
                        >
                          Chai Tinh Dầu
                        </button>
                        <button
                          type="button"
                          onClick={() => setProdImage('https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80')}
                          className="px-2 py-0.5 bg-[#f7f1eb] hover:bg-[#ebe3d9] text-[10px] font-semibold text-[#3a2f2a] rounded-md transition-colors"
                        >
                          Serum Dưỡng Da
                        </button>
                        <button
                          type="button"
                          onClick={() => setProdImage('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80')}
                          className="px-2 py-0.5 bg-[#f7f1eb] hover:bg-[#ebe3d9] text-[10px] font-semibold text-[#3a2f2a] rounded-md transition-colors"
                        >
                          Sơn Gel Móng
                        </button>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-bold text-[#3a2f2a] mb-1">Mô Tả Sản Phẩm & Công Dụng</label>
                      <input
                        type="text"
                        placeholder="Mô tả công dụng sản phẩm chi tiết..."
                        value={prodDesc}
                        onChange={(e) => setProdDesc(e.target.value)}
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
                      className="px-5 py-2 rounded-full bg-[#3a2f2a] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{editingProduct ? 'Lưu Cập Nhật Giá & Sale' : 'Lưu Sản Phẩm Vào DB'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Category Filter Bar for Admin Products */}
              <div className="bg-white p-3 rounded-2xl border border-[#ebe3d9] flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[#6b5c54] font-bold text-[11px] mr-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#c9a86c]" /> Lọc Danh Mục:
                </span>
                {[
                  { id: 'all', label: `Tất Cả (${productsCatalog.length})` },
                  { id: 'facial', label: '💆 Chăm Sóc Da' },
                  { id: 'makeup', label: '💄 Trang Điểm' },
                  { id: 'fragrances', label: '🌸 Nước Hoa' },
                  { id: 'hair', label: '✂️ Tóc & Da Đầu' },
                  { id: 'spa', label: '🪷 Body & Massage' },
                  { id: 'nail', label: '💅 Nail & Móng' },
                  { id: 'accessories', label: '✨ Phụ Kiện' },
                ].map((cat) => {
                  const isActive = adminProdCategoryFilter === cat.id;
                  const count = cat.id === 'all'
                    ? productsCatalog.length
                    : productsCatalog.filter(p => p.category === cat.id).length;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setAdminProdCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#3a2f2a] text-white shadow-xs'
                          : 'bg-[#f7f1eb] text-[#6b5c54] hover:bg-[#ebe3d9] hover:text-[#3a2f2a]'
                      }`}
                    >
                      {cat.label} {cat.id !== 'all' && `(${count})`}
                    </button>
                  );
                })}
              </div>

              {/* Danh sách Sản phẩm với Số Lượng Tồn Kho Live & Ảnh */}
              {(() => {
                const categoryLabelsMap: Record<string, string> = {
                  facial: '💆 Chăm Sóc Da',
                  makeup: '💄 Trang Điểm',
                  fragrances: '🌸 Nước Hoa',
                  hair: '✂️ Tóc & Da Đầu',
                  spa: '🪷 Body & Massage',
                  nail: '💅 Nail & Móng',
                  accessories: '✨ Phụ Kiện',
                };

                const filteredProds = (productsCatalog || []).filter((p) => {
                  if (adminProdCategoryFilter === 'all') return true;
                  return p.category === adminProdCategoryFilter;
                });

                if (filteredProds.length === 0) {
                  return (
                    <div className="text-center py-10 bg-white rounded-2xl border border-[#ebe3d9] p-6">
                      <p className="text-xs text-[#6b5c54]">Không có sản phẩm nào thuộc danh mục này.</p>
                      <button
                        onClick={() => setAdminProdCategoryFilter('all')}
                        className="mt-2 px-3 py-1 bg-[#3a2f2a] text-white text-xs font-bold rounded-lg"
                      >
                        Xem tất cả sản phẩm
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {filteredProds.map((p) => {
                      const stock = p.stockQuantity ?? 50;
                      const hasDiscount = p.originalPrice && p.originalPrice > p.price;
                      const discountPct = hasDiscount ? Math.round(((p.originalPrice! - p.price) / p.originalPrice!) * 100) : 0;
                      const catBadge = categoryLabelsMap[p.category] || p.category;

                      return (
                        <div key={p.id} className="bg-white p-4 rounded-2xl border border-[#ebe3d9] flex items-center justify-between shadow-xs gap-3">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="relative shrink-0">
                              <img
                                src={p.image}
                                alt={p.title}
                                className="w-14 h-14 object-cover rounded-xl border border-[#ebe3d9] shadow-xs"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1608248597262-838d12328827?auto=format&fit=crop&w=800&q=80';
                                }}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="px-1.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 text-[9px] font-extrabold rounded-md truncate max-w-[120px]">
                                  {catBadge}
                                </span>
                              </div>
                              <div className="font-serif font-bold text-xs text-[#3a2f2a] truncate">{p.title}</div>
                              <div className="text-[11px] text-[#6b5c54] truncate">{p.subtitle}</div>
                              <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                                <span className="text-xs font-extrabold text-[#c9a86c]">{p.price.toLocaleString('vi-VN')} đ</span>
                                {hasDiscount && (
                                  <>
                                    <span className="line-through text-[#6b5c54]/60 text-[10px]">{p.originalPrice?.toLocaleString('vi-VN')}đ</span>
                                    <span className="px-1.5 py-0.5 bg-rose-500 text-white font-extrabold text-[9px] rounded-md shrink-0">
                                      -{discountPct}% SALE
                                    </span>
                                  </>
                                )}
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

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => openEditProduct(p)}
                              className="px-2.5 py-1.5 bg-[#f7f1eb] hover:bg-[#ebe3d9] text-[#3a2f2a] rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Sửa Thông Tin, Danh Mục, Giá & % Sale"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-[#c9a86c]" />
                              <span className="hidden sm:inline text-[11px]">Sửa SP & DM</span>
                            </button>

                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Xóa sản phẩm khỏi DB"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB: BLOGS CATALOG MANAGEMENT */}
          {activeTab === 'blogs' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-[#ebe3d9] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#3a2f2a] flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[#c9a86c]" />
                      <span>Quản Lý Bài Viết & Tin Tức Lumé Spa</span>
                    </h3>
                    <p className="text-xs text-[#6b5c54] mt-0.5">
                      Đăng bài viết mới, chỉnh sửa nội dung hoặc xóa các bài viết hiển thị ở mục Tin Tức & Blog trên trang chủ.
                    </p>
                  </div>
                  <button
                    onClick={openAddBlog}
                    className="px-4 py-2 bg-[#2d4a3e] hover:bg-[#1f352c] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Thêm Bài Viết Mới</span>
                  </button>
                </div>

                {/* Add / Edit Blog Form */}
                {showAddBlog && (
                  <form ref={blogFormRef} onSubmit={handleSaveBlog} className="p-5 bg-[#fbf9f5] rounded-2xl border border-[#c9a86c]/30 space-y-4 animate-in fade-in">
                    <div className="flex justify-between items-center border-b border-[#ebe3d9] pb-3">
                      <h4 className="font-serif font-bold text-base text-[#3a2f2a] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#c9a86c]" />
                        <span>{editingBlog ? 'Chỉnh Sửa Bài Viết' : 'Thêm Bài Viết Mới'}</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddBlog(false);
                          setEditingBlog(null);
                        }}
                        className="text-xs text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-[#6b5c54] mb-1">Tiêu đề bài viết *</label>
                        <input
                          type="text"
                          required
                          value={blogTitle}
                          onChange={(e) => setBlogTitle(e.target.value)}
                          placeholder="Ví dụ: Bí Quyết Chăm Sóc Da Căng Bóng Mùa Đông"
                          className="w-full px-3 py-2 text-xs bg-white border border-[#ebe3d9] rounded-xl focus:outline-none focus:border-[#c9a86c]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#6b5c54] mb-1">Tác giả *</label>
                        <input
                          type="text"
                          required
                          value={blogAuthor}
                          onChange={(e) => setBlogAuthor(e.target.value)}
                          placeholder="Chuyên gia Jenny Alexander"
                          className="w-full px-3 py-2 text-xs bg-white border border-[#ebe3d9] rounded-xl focus:outline-none focus:border-[#c9a86c]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#6b5c54] mb-1">Danh mục *</label>
                        <select
                          value={blogCategory}
                          onChange={(e) => setBlogCategory(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-[#ebe3d9] rounded-xl focus:outline-none focus:border-[#c9a86c]"
                        >
                          <option value="Skincare Tips">Skincare Tips (Chăm sóc da)</option>
                          <option value="Body Care">Body Care (Chăm sóc cơ thể)</option>
                          <option value="Beauty Guide">Beauty Guide (Hướng dẫn làm đẹp)</option>
                          <option value="Phục Hồi Da">Phục Hồi Da (Skin Healing)</option>
                          <option value="Khuyến Mãi Spa">Khuyến Mãi Spa</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-[#6b5c54] mb-1">Thời gian đọc</label>
                        <input
                          type="text"
                          value={blogReadTime}
                          onChange={(e) => setBlogReadTime(e.target.value)}
                          placeholder="5 phút đọc"
                          className="w-full px-3 py-2 text-xs bg-white border border-[#ebe3d9] rounded-xl focus:outline-none focus:border-[#c9a86c]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-[#6b5c54] mb-1">Đường dẫn hình ảnh bìa (URL) *</label>
                        <input
                          type="url"
                          required
                          value={blogImage}
                          onChange={(e) => setBlogImage(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full px-3 py-2 text-xs bg-white border border-[#ebe3d9] rounded-xl focus:outline-none focus:border-[#c9a86c]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-[#6b5c54] mb-1">Các thẻ bài viết (Tags, phân cách bằng dấu phẩy)</label>
                        <input
                          type="text"
                          value={blogTags}
                          onChange={(e) => setBlogTags(e.target.value)}
                          placeholder="skincare, lumé, tre-hoa-da"
                          className="w-full px-3 py-2 text-xs bg-white border border-[#ebe3d9] rounded-xl focus:outline-none focus:border-[#c9a86c]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-[#6b5c54] mb-1">Tóm tắt ngắn (Hiển thị ở trang chủ) *</label>
                        <textarea
                          rows={2}
                          required
                          value={blogSummary}
                          onChange={(e) => setBlogSummary(e.target.value)}
                          placeholder="Tóm tắt ngắn 2-3 câu gây ấn tượng người đọc..."
                          className="w-full px-3 py-2 text-xs bg-white border border-[#ebe3d9] rounded-xl focus:outline-none focus:border-[#c9a86c]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-[#6b5c54] mb-1">Nội dung chi tiết bài viết (Dùng ## cho tiêu đề chính, ### cho mục nhỏ, - cho danh sách) *</label>
                        <textarea
                          rows={6}
                          required
                          value={blogContent}
                          onChange={(e) => setBlogContent(e.target.value)}
                          placeholder="Nội dung bài viết đầy đủ..."
                          className="w-full px-3 py-2 text-xs bg-white border border-[#ebe3d9] rounded-xl focus:outline-none focus:border-[#c9a86c] font-mono text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-[#ebe3d9]">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddBlog(false);
                          setEditingBlog(null);
                        }}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Hủy Bỏ
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#2d4a3e] hover:bg-[#1f352c] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>{editingBlog ? 'Cập Nhật Bài Viết' : 'Lưu Bài Viết'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Blog Articles Catalog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(blogsCatalog || []).map((b) => (
                    <div key={b.id} className="bg-white rounded-2xl border border-[#ebe3d9] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
                      <div>
                        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                          <img
                            src={b.image}
                            alt={b.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80';
                            }}
                          />
                          <span className="absolute top-2.5 left-2.5 bg-[#2d4a3e] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                            {b.category}
                          </span>
                        </div>

                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between text-[11px] text-gray-500">
                            <span>Tác giả: {b.author}</span>
                            <span>{b.date}</span>
                          </div>
                          <h4 className="font-serif font-bold text-sm text-[#3a2f2a] line-clamp-2 leading-snug">
                            {b.title}
                          </h4>
                          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                            {b.summary}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 bg-[#fcfbfa] border-t border-[#ebe3d9] flex items-center justify-between gap-2">
                        <span className="text-[11px] text-gray-500 flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-gray-400" />
                          {b.views || 0} xem
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEditBlog(b)}
                            className="px-2.5 py-1 bg-[#f7f1eb] hover:bg-[#ebe3d9] text-[#3a2f2a] text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                            title="Sửa bài viết"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#c9a86c]" />
                            <span>Sửa</span>
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(b.id)}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Xóa bài viết"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

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
                            {item.originalPrice && item.originalPrice > item.price && (
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
