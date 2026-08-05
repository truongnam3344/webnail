import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Header } from './components/Header';
import { CategoryCircles } from './components/CategoryCircles';
import { HeroDealsBanners } from './components/HeroDealsBanners';
import { AboutUsSection } from './components/AboutUsSection';
import { BestSellersSection } from './components/BestSellersSection';
import { SummerGlowCountdown } from './components/SummerGlowCountdown';
import { MarqueeTicker } from './components/MarqueeTicker';
import { DealsOfDaySection } from './components/DealsOfDaySection';
import { NewArrivalsSection } from './components/NewArrivalsSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { NewsBlogsSection } from './components/NewsBlogsSection';
import { InstagramGallery } from './components/InstagramGallery';
import { FaqSection } from './components/FaqSection';
import { FeaturesAndNewsletter } from './components/FeaturesAndNewsletter';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { BookingModal } from './components/BookingModal';
import { ProductPurchaseModal } from './components/ProductPurchaseModal';
import { AppointmentLookupModal } from './components/AppointmentLookupModal';
import { AuthModal } from './components/AuthModal';
import { CustomerPortalModal } from './components/CustomerPortalModal';
import { StaffPortalModal } from './components/StaffPortalModal';
import { SalesPortalModal } from './components/SalesPortalModal';
import { AccountantPortalModal } from './components/AccountantPortalModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { AllCatalogModal } from './components/AllCatalogModal';
import { ServiceItem, Appointment } from './types';

function AppContent() {
  const { currentUser } = useAuth();

  // Modal states
  const [selectedServiceDetail, setSelectedServiceDetail] = useState<ServiceItem | null>(null);
  
  // Booking Form (Dịch vụ)
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingInitialServiceId, setBookingInitialServiceId] = useState<string | undefined>(undefined);
  const [bookingInitialPromoCode, setBookingInitialPromoCode] = useState<string | undefined>(undefined);

  // Purchase Form (Sản phẩm Mua Hàng)
  const [selectedProductForPurchase, setSelectedProductForPurchase] = useState<ServiceItem | null>(null);

  const [lookupModalOpen, setLookupModalOpen] = useState(false);

  // Role Auth & Portal Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [customerPortalOpen, setCustomerPortalOpen] = useState(false);
  const [staffPortalOpen, setStaffPortalOpen] = useState(false);
  const [salesPortalOpen, setSalesPortalOpen] = useState(false);
  const [accountantPortalOpen, setAccountantPortalOpen] = useState(false);
  const [adminPortalOpen, setAdminPortalOpen] = useState(false);

  // Selected Category
  const [activeCategory, setActiveCategory] = useState('all');
  const [allCatalogModalOpen, setAllCatalogModalOpen] = useState(false);

  // Open appropriate portal according to logged in user role
  const handleOpenPortal = () => {
    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    if (currentUser.role === 'admin') {
      setAdminPortalOpen(true);
    } else if (currentUser.role === 'staff') {
      setStaffPortalOpen(true);
    } else if (currentUser.role === 'sales') {
      setSalesPortalOpen(true);
    } else if (currentUser.role === 'accountant') {
      setAccountantPortalOpen(true);
    } else {
      setCustomerPortalOpen(true);
    }
  };

  // Open booking modal helper for services
  const handleOpenBooking = (serviceId?: string, promoCode?: string) => {
    setBookingInitialServiceId(serviceId);
    setBookingInitialPromoCode(promoCode);
    setBookingModalOpen(true);
  };

  // Differentiate item selection: if product -> open ProductPurchaseModal, if service -> open BookingModal
  const handleItemSelect = (item: ServiceItem) => {
    if (item.itemType === 'product') {
      setSelectedProductForPurchase(item);
    } else {
      handleOpenBooking(item.id);
    }
  };

  // Toast notice on successful booking
  const handleBookingSuccess = (appointment: Appointment) => {
    console.log('New appointment created:', appointment);
  };

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-[#1f2923] font-sans selection:bg-[#2d4a3e]/20">
      {/* Header */}
      <Header
        onOpenBooking={() => handleOpenBooking()}
        onOpenLookup={() => setLookupModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenPortal={handleOpenPortal}
        onOpenAllCatalog={() => setAllCatalogModalOpen(true)}
      />

      {/* Main Content matching video design */}
      <main className="pt-20 sm:pt-24">
        {/* 1. Category Circles Bar */}
        <CategoryCircles
          activeCategory={activeCategory}
          onSelectCategory={(id) => {
            setActiveCategory(id);
            const elem = document.getElementById('best-sellers');
            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 2. Hero Deals Banners */}
        <HeroDealsBanners onOpenBooking={handleOpenBooking} />

        {/* 3. About Us Section */}
        <AboutUsSection />

        {/* 4. Best Sellers Products */}
        <BestSellersSection
          onSelectService={(service) => setSelectedServiceDetail(service)}
          onBookService={handleItemSelect}
          onOpenAllCatalog={() => setAllCatalogModalOpen(true)}
        />

        {/* 5. Summer Glow Deals Countdown */}
        <SummerGlowCountdown onOpenBooking={handleOpenBooking} />

        {/* 6. Marquee Scrolling Ticker */}
        <MarqueeTicker />

        {/* 7. Deals of the Day */}
        <DealsOfDaySection onBookService={handleItemSelect} />

        {/* 8. New Arrival Products */}
        <NewArrivalsSection
          onSelectService={(service) => setSelectedServiceDetail(service)}
          onBookService={handleItemSelect}
        />

        {/* 9. Testimonials from Our Loyal Customers */}
        <TestimonialsSection />

        {/* 10. Our Latest News & Blogs */}
        <NewsBlogsSection onOpenBooking={handleOpenBooking} />

        {/* 11. Follow Us On Instagram */}
        <InstagramGallery />

        {/* 12. Question? Look here (FAQS) */}
        <FaqSection
          onOpenContact={() => {
            const contactElem = document.getElementById('contact');
            if (contactElem) contactElem.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 13. Value Props & Newsletter */}
        <FeaturesAndNewsletter />

        {/* 14. Contact, Locations & Map */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons */}
      <FloatingActions onOpenBooking={() => handleOpenBooking()} />

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedServiceDetail}
        onClose={() => setSelectedServiceDetail(null)}
        onSelectBooking={(service) => {
          setSelectedServiceDetail(null);
          handleItemSelect(service);
        }}
      />

      {/* Form Đặt Lịch Hẹn (Dịch vụ Spa/Nail/Hair) */}
      <BookingModal
        isOpen={bookingModalOpen}
        initialServiceId={bookingInitialServiceId}
        initialPromoCode={bookingInitialPromoCode}
        onClose={() => {
          setBookingModalOpen(false);
          setBookingInitialServiceId(undefined);
          setBookingInitialPromoCode(undefined);
        }}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Form Mua Hàng Sản Phẩm (Mỹ phẩm) */}
      <ProductPurchaseModal
        isOpen={!!selectedProductForPurchase}
        productItem={selectedProductForPurchase}
        onClose={() => setSelectedProductForPurchase(null)}
      />

      {/* Tra cứu lịch hẹn / Đơn hàng */}
      <AppointmentLookupModal
        isOpen={lookupModalOpen}
        onClose={() => setLookupModalOpen(false)}
      />

      {/* Role Auth & Portal Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={() => handleOpenPortal()}
      />

      <CustomerPortalModal
        isOpen={customerPortalOpen}
        onClose={() => setCustomerPortalOpen(false)}
        onOpenBooking={() => handleOpenBooking()}
      />

      <StaffPortalModal
        isOpen={staffPortalOpen}
        onClose={() => setStaffPortalOpen(false)}
      />

      <SalesPortalModal
        isOpen={salesPortalOpen}
        onClose={() => setSalesPortalOpen(false)}
      />

      <AccountantPortalModal
        isOpen={accountantPortalOpen}
        onClose={() => setAccountantPortalOpen(false)}
      />

      <AdminPortalModal
        isOpen={adminPortalOpen}
        onClose={() => setAdminPortalOpen(false)}
      />

      {/* Tất Cả Sản Phẩm & Dịch Vụ Modal */}
      <AllCatalogModal
        isOpen={allCatalogModalOpen}
        onClose={() => setAllCatalogModalOpen(false)}
        onSelectItem={(item) => setSelectedServiceDetail(item)}
        onBookService={(serviceId) => {
          setAllCatalogModalOpen(false);
          handleOpenBooking(serviceId);
        }}
        onPurchaseProduct={(product) => {
          setAllCatalogModalOpen(false);
          setSelectedProductForPurchase(product);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

