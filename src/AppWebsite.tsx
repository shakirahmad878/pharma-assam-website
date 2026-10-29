import React, { useState } from 'react';
import { PMTopBar } from './components/PMTopBar';
import { PMHeader } from './components/PMHeader';
import { PMHeroSlider } from './components/PMHeroSlider';
import { PMCategoryShowcase } from './components/PMCategoryShowcase';
import { PMProductCatalog } from './components/PMProductCatalog';
import { PMAboutSection } from './components/PMAboutSection';
import { PMFlipbook } from './components/PMFlipbook';
import { PMEnquiryForm } from './components/PMEnquiryForm';
import { PMContactSection } from './components/PMContactSection';
import { PMFooter } from './components/PMFooter';
import { PMProductModal } from './components/PMProductModal';
import { PMSendEnquiryModal } from './components/PMSendEnquiryModal';
import { PMSidebarNav } from './components/PMSidebarNav';
import { PRODUCTS } from './data/products';
import { Product, ProductCategory } from './types';

const SFA_PORTAL_URL = 'https://shakirahmad878.github.io/reppulse-pharma-sfa/';

export default function AppWebsite() {
  const [activePublicSection, setActivePublicSection] = useState<string>('home');
  const [selectedPublicProduct, setSelectedPublicProduct] = useState<Product | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState<boolean>(false);
  const [enquiryProductName, setEnquiryProductName] = useState<string>(PRODUCTS[0].name);
  const [selectedPublicCategory, setSelectedPublicCategory] = useState<ProductCategory | 'All Products'>('All Products');
  const [isPublicSidebarOpen, setIsPublicSidebarOpen] = useState<boolean>(false);

  const handleNavigatePublic = (sectionId: string) => {
    setActivePublicSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = el.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleOpenEnquiryModal = (productName?: string) => {
    setEnquiryProductName(productName || PRODUCTS[0].name);
    setIsEnquiryModalOpen(true);
  };

  const handleOpenPortal = () => {
    window.location.href = SFA_PORTAL_URL;
  };

  return (
    <div className="min-h-screen bg-[#F5F8FA] text-[#1E293B] flex flex-col justify-between selection:bg-[#18A6A6] selection:text-white font-sans antialiased">
      
      {/* 1. Official Top Bar */}
      <PMTopBar 
        onOpenEnquiry={() => handleOpenEnquiryModal()}
        onOpenPortal={handleOpenPortal}
      />

      {/* 2. Official Corporate Header & Mega Dropdown Navigation */}
      <PMHeader
        activeSection={activePublicSection}
        onNavigate={handleNavigatePublic}
        onSelectProduct={(product) => setSelectedPublicProduct(product)}
        onOpenEnquiry={handleOpenEnquiryModal}
        onOpenSidebar={() => setIsPublicSidebarOpen(true)}
        onOpenPortal={handleOpenPortal}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        
        {/* 3. Hero Showcase Slider */}
        <section id="home">
          <PMHeroSlider
            onSelectProduct={(product) => setSelectedPublicProduct(product)}
            onOpenEnquiry={handleOpenEnquiryModal}
            onNavigate={handleNavigatePublic}
          />
        </section>

        {/* 4. Product Categories Showcase */}
        <PMCategoryShowcase
          onSelectCategory={(cat) => setSelectedPublicCategory(cat)}
          onNavigate={handleNavigatePublic}
        />

        {/* 5. Full Product Catalog Directory */}
        <PMProductCatalog
          selectedCategory={selectedPublicCategory}
          onSelectCategory={(cat) => setSelectedPublicCategory(cat)}
          onSelectProduct={(product) => setSelectedPublicProduct(product)}
          onOpenEnquiry={handleOpenEnquiryModal}
        />

        {/* 6. Official About Us & Factsheet Section */}
        <PMAboutSection
          onOpenEnquiry={() => handleOpenEnquiryModal()}
          onNavigate={handleNavigatePublic}
        />

        {/* 7. Clinical Flipbook / Visual Aid Viewer */}
        <PMFlipbook
          onOpenEnquiry={handleOpenEnquiryModal}
          onSelectProduct={(product) => setSelectedPublicProduct(product)}
        />

        {/* 8. Quick Requirement / Direct Enquiry Form */}
        <PMEnquiryForm defaultProduct={enquiryProductName} />

        {/* 9. Official Contact Details, Registered Address & Map */}
        <PMContactSection />

      </main>

      {/* 10. Official Footer */}
      <PMFooter
        onNavigate={handleNavigatePublic}
        onSelectCategory={(cat) => setSelectedPublicCategory(cat)}
        onOpenPortal={handleOpenPortal}
      />

      {/* Modals & Drawers */}
      <PMProductModal
        product={selectedPublicProduct}
        onClose={() => setSelectedPublicProduct(null)}
        onOpenEnquiry={handleOpenEnquiryModal}
      />

      <PMSendEnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        defaultProductName={enquiryProductName}
      />

      <PMSidebarNav
        isOpen={isPublicSidebarOpen}
        onClose={() => setIsPublicSidebarOpen(false)}
        activeSection={activePublicSection}
        onNavigate={handleNavigatePublic}
        onSelectCategory={(cat) => setSelectedPublicCategory(cat)}
        onOpenEnquiry={() => handleOpenEnquiryModal()}
      />

    </div>
  );
}
