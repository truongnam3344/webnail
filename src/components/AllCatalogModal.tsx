import React, { useState, useMemo } from 'react';
import { X, Search, Filter, Tag, Sparkles, ShoppingBag, Calendar, Check, ArrowUpDown, ChevronRight, RefreshCw, Star, Clock, Box } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ServiceItem } from '../types';

interface AllCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: ServiceItem) => void;
  onBookService: (serviceId?: string) => void;
  onPurchaseProduct: (product: ServiceItem) => void;
}

export const AllCatalogModal: React.FC<AllCatalogModalProps> = ({
  isOpen,
  onClose,
  onSelectItem,
  onBookService,
  onPurchaseProduct,
}) => {
  const { productsCatalog, servicesCatalog } = useAuth();

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [activeType, setActiveType] = useState<'all' | 'service' | 'product'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlySale, setOnlySale] = useState(false);
  const [priceRange, setPriceRange] = useState<'all' | 'under300' | '300to500' | 'over500'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'priceAsc' | 'priceDesc' | 'name'>('popular');

  if (!isOpen) return null;

  // Combine products and services catalogs
  const allItems: ServiceItem[] = [
    ...(servicesCatalog || []).map(s => ({ ...s, itemType: s.itemType || 'service' as const })),
    ...(productsCatalog || []).map(p => ({ ...p, itemType: p.itemType || 'product' as const }))
  ];

  // Unique list by ID
  const uniqueItems = Array.from(new Map(allItems.map(item => [item.id, item])).values());

  // Filter & Search Logic
  const filteredItems = uniqueItems.filter(item => {
    // 1. Search term
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSub = (item.subtitle || '').toLowerCase().includes(q);
      const matchDesc = (item.description || '').toLowerCase().includes(q);
      if (!matchTitle && !matchSub && !matchDesc) return false;
    }

    // 2. Type filter (all vs service vs product)
    if (activeType === 'service' && item.itemType === 'product') return false;
    if (activeType === 'product' && item.itemType !== 'product') return false;

    // 3. Category filter
    if (selectedCategory !== 'all') {
      if (item.category !== selectedCategory) return false;
    }

    // 4. Sale filter
    if (onlySale) {
      const isSale = item.originalPrice && item.originalPrice > item.price;
      if (!isSale) return false;
    }

    // 5. Price Range
    if (priceRange === 'under300' && item.price >= 300000) return false;
    if (priceRange === '300to500' && (item.price < 300000 || item.price > 500000)) return false;
    if (priceRange === 'over500' && item.price <= 500000) return false;

    return true;
  });

  // Sort Logic
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'priceAsc') return a.price - b.price;
    if (sortBy === 'priceDesc') return b.price - a.price;
    if (sortBy === 'name') return a.title.localeCompare(b.title, 'vi');
    // Default 'popular'
    if (a.popular && !b.popular) return -1;
    if (!a.popular && b.popular) return 1;
    return 0;
  });

  const categories = [
    { id: 'all', label: 'Tất Cả Danh Mục' },
    { id: 'facial', label: '💆 Chăm Sóc Da Mặt' },
    { id: 'spa', label: '🪷 Body & Massage' },
    { id: 'nail', label: '💅 Chăm Sóc Móng' },
    { id: 'hair', label: '✂️ Tóc & Gội Đầu' },
  ];

  const handleResetFilters = () => {
    setSearchTerm('');
    setActiveType('all');
    setSelectedCategory('all');
    setOnlySale(false);
    setPriceRange('all');
    setSortBy('popular');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-fade-in">
      <div className="bg-[#f7f4ee] w-full max-w-6xl rounded-3xl shadow-2xl border border-[#e6dec8] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-white px-5 py-4 border-b border-[#e8dfcb] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2d4a3e]/10 text-[#2d4a3e] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1f2923]">
                Tất Cả Sản Phẩm & Dịch Vụ Lumé Spa
              </h2>
              <p className="text-xs text-[#6b5c54]">
                Khám phá trọn bộ menu dịch vụ thư giãn & sản phẩm chăm sóc cao cấp ({sortedItems.length} mục)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#f5f0e6] hover:bg-[#e8dfcb] text-[#1f2923] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white/80 backdrop-blur-xs p-4 border-b border-[#e8dfcb] shrink-0 space-y-3">
          {/* Row 1: Search & Type Tabs */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, dịch vụ spa, từ khóa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#f5f0e6] border border-[#e8dfcb] rounded-xl text-sm focus:outline-hidden focus:border-[#2d4a3e] text-[#1f2923]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Type Filter Buttons */}
            <div className="flex items-center bg-[#f5f0e6] p-1 rounded-xl border border-[#e8dfcb] shrink-0">
              <button
                onClick={() => setActiveType('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeType === 'all'
                    ? 'bg-[#2d4a3e] text-white shadow-xs'
                    : 'text-[#6b5c54] hover:text-[#1f2923]'
                }`}
              >
                Tất Cả ({uniqueItems.length})
              </button>
              <button
                onClick={() => setActiveType('service')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeType === 'service'
                    ? 'bg-[#2d4a3e] text-white shadow-xs'
                    : 'text-[#6b5c54] hover:text-[#1f2923]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Dịch Vụ Spa
              </button>
              <button
                onClick={() => setActiveType('product')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeType === 'product'
                    ? 'bg-[#2d4a3e] text-white shadow-xs'
                    : 'text-[#6b5c54] hover:text-[#1f2923]'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Sản Phẩm
              </button>
            </div>
          </div>

          {/* Row 2: Secondary Filters (Category, Sale toggle, Price Range, Sort) */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#f0e8d8] text-xs">
            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#f5f0e6] border border-[#e8dfcb] text-[#1f2923] rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-hidden"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>

            {/* Price Range Filter */}
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value as any)}
              className="bg-[#f5f0e6] border border-[#e8dfcb] text-[#1f2923] rounded-lg px-3 py-1.5 text-xs font-medium focus:outline-hidden"
            >
              <option value="all">Tất cả mức giá</option>
              <option value="under300">Dưới 300.000đ</option>
              <option value="300to500">300.000đ - 500.000đ</option>
              <option value="over500">Trên 500.000đ</option>
            </select>

            {/* Sort Filter */}
            <div className="flex items-center gap-1 bg-[#f5f0e6] border border-[#e8dfcb] rounded-lg px-2.5 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[#1f2923] text-xs font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="popular">Nổi bật nhất</option>
                <option value="priceAsc">Giá: Thấp đến Cao</option>
                <option value="priceDesc">Giá: Cao đến Thấp</option>
                <option value="name">Tên A-Z</option>
              </select>
            </div>

            {/* Sale Checkbox Toggle */}
            <button
              onClick={() => setOnlySale(!onlySale)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                onlySale
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-[#f5f0e6] text-[#6b5c54] border-[#e8dfcb] hover:border-amber-500'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              Đang Giảm Giá (% Sale)
            </button>

            {/* Reset Button */}
            {(searchTerm || activeType !== 'all' || selectedCategory !== 'all' || onlySale || priceRange !== 'all' || sortBy !== 'popular') && (
              <button
                onClick={handleResetFilters}
                className="ml-auto text-xs text-[#2d4a3e] font-bold hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />Đặt lại lọc
              </button>
            )}
          </div>
        </div>

        {/* Content Items Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {sortedItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#e8dfcb] p-8">
              <div className="w-16 h-16 bg-[#f5f0e6] rounded-full flex items-center justify-center mx-auto mb-3 text-[#2d4a3e]">
                <Search className="w-8 h-8 opacity-50" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#1f2923] mb-1">
                Không tìm thấy sản phẩm hoặc dịch vụ phù hợp
              </h3>
              <p className="text-xs text-[#6b5c54] max-w-md mx-auto mb-4">
                Hãy thử bỏ bớt bộ lọc hoặc nhập từ khóa tìm kiếm khác.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-[#2d4a3e] text-white text-xs font-bold rounded-xl hover:bg-[#1f342b] transition-colors"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {sortedItems.map((item) => {
                const isProduct = item.itemType === 'product';
                const hasDiscount = item.originalPrice && item.originalPrice > item.price;
                const discountPct = hasDiscount
                  ? Math.round(((item.originalPrice! - item.price) / item.originalPrice!) * 100)
                  : 0;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-[#e8dfcb] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                    onClick={() => onSelectItem(item)}
                  >
                    <div>
                      {/* Image Header */}
                      <div className="relative aspect-4/3 bg-[#f5f0e6] overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">
                            {item.icon || '✨'}
                          </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                          {hasDiscount && (
                            <span className="px-2 py-0.5 bg-[#2d4a3e] text-white text-[10px] font-extrabold rounded-md uppercase">
                              {discountPct}% OFF
                            </span>
                          )}
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase border ${
                            isProduct
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          }`}>
                            {isProduct ? 'Sản Phẩm' : 'Dịch Vụ Spa'}
                          </span>
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-4">
                        <div className="flex items-center justify-between text-[11px] text-[#6b5c54] mb-1">
                          <span className="capitalize bg-[#f5f0e6] px-2 py-0.5 rounded-full font-medium">
                            {item.category === 'facial' ? 'Chăm Sóc Da' :
                             item.category === 'spa' ? 'Body & Spa' :
                             item.category === 'nail' ? 'Chăm Sóc Móng' :
                             item.category === 'hair' ? 'Tóc & Gội Đầu' : item.category}
                          </span>
                          {!isProduct && item.duration > 0 && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              {item.duration} phút
                            </span>
                          )}
                          {isProduct && item.stockQuantity !== undefined && (
                            <span className="flex items-center gap-1 text-[#2d4a3e] font-semibold">
                              <Box className="w-3 h-3" />
                              Còn {item.stockQuantity} sp
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif font-bold text-sm text-[#1f2923] group-hover:text-[#2d4a3e] transition-colors line-clamp-1 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#6b5c54] line-clamp-2 min-h-[32px] mb-3">
                          {item.subtitle || item.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer price & action */}
                    <div className="p-4 pt-0 border-t border-gray-100 flex items-center justify-between mt-auto">
                      <div>
                        <div className="text-sm font-bold text-[#2d4a3e]">
                          {item.price.toLocaleString('vi-VN')}đ
                        </div>
                        {hasDiscount && (
                          <div className="text-[10px] text-gray-400 line-through">
                            {item.originalPrice!.toLocaleString('vi-VN')}đ
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isProduct) {
                            onPurchaseProduct(item);
                          } else {
                            onBookService(item.id);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 ${
                          isProduct
                            ? 'bg-[#b08d4f] hover:bg-[#96773f] text-white'
                            : 'bg-[#2d4a3e] hover:bg-[#1f342b] text-white'
                        }`}
                      >
                        {isProduct ? 'Mua Ngay' : 'Đặt Lịch'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-white px-5 py-3 border-t border-[#e8dfcb] flex flex-col sm:flex-row items-center justify-between text-xs text-[#6b5c54] gap-2">
          <div>
            Hiển thị <span className="font-bold text-[#1f2923]">{sortedItems.length}</span> / {uniqueItems.length} sản phẩm & dịch vụ
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#f5f0e6] hover:bg-[#e8dfcb] text-[#1f2923] font-bold rounded-xl transition-colors"
          >
            Đóng cửa sổ
          </button>
        </div>

      </div>
    </div>
  );
};
