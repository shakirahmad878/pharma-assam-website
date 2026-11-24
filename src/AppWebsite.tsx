import React, { useState, useEffect } from 'react';
import { PMTopBar } from './components/PMTopBar';
import { PMHeader } from './components/PMHeader';
import { PMHeroIndia } from './components/PMHeroIndia';
import { PMHomeSections } from './components/PMHomeSections';
import { PMPartnersAndFlagship } from './components/PMPartnersAndFlagship';
import { PMSqueezeShowcase } from './components/PMSqueezeShowcase';
import { PMPrecisionDial } from './components/PMPrecisionDial';
import { PMCategoryShowcase } from './components/PMCategoryShowcase';
import { PMProductCatalog } from './components/PMProductCatalog';
import { PMInnovation3D } from './components/PMInnovation3D';
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

export default function AppWebsite() {
  useEffect(() => {
    document.title = 'NLCL | New Life Care Laboratories Pvt. Ltd. - Quality Formulations & Pharmaceutical Distribution (Assam)';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'NLCL (New Life Care Laboratories Pvt. Ltd. - nlcl.in) is an established pharmaceutical company supplying WHO-GMP compliant formulations, capsules, syrups, tablets, and injectables across Assam and the North-East.');
    }
  }, []);

  const [activePublicSection, setActivePublicSection] = useState<string>('home');
  const [selectedPublicProduct, setSelectedPublicProduct] = useState<Product | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState<boolean>(false);
  const [enquiryProductName, setEnquiryProductName] = useState<string>(PRODUCTS[0].name);
  const [selectedPublicCategory, setSelectedPublicCategory] = useState<ProductCategory | 'All Products'>('All Products');
  const [isPublicSidebarOpen, setIsPublicSidebarOpen] = useState<boolean>(false);
  const [selectedFlagshipIndex, setSelectedFlagshipIndex] = useState<number>(0);

  useEffect(() => {
    const TABS = ['home', 'partners', 'flagship', 'precision', 'products', 'about', 'contact', 'flipbook'];

    const route = () => {
      let id = window.location.hash.slice(1);
      if (id === 'catalog') id = 'products';
      if (!TABS.includes(id)) id = 'home';
      setActivePublicSection(id);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', route);
    if (window.location.hash) {
      route();
    }

    return () => window.removeEventListener('hashchange', route);
  }, []);

  const handleNavigatePublic = (sectionId: string) => {
    let target = sectionId;
    if (target === 'catalog') target = 'products';
    setActivePublicSection(target);
    window.location.hash = target;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEnquiryModal = (productName?: string) => {
    setEnquiryProductName(productName || PRODUCTS[0].name);
    setIsEnquiryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col justify-between selection:bg-[#18A6A6] selection:text-white font-sans antialiased overflow-x-hidden w-full max-w-full">
      
      {/* 1. Official Top Bar */}
      <PMTopBar 
        onOpenEnquiry={() => handleOpenEnquiryModal()}
      />

      {/* 2. Official Corporate Header & Mega Dropdown Navigation */}
      <PMHeader
        activeSection={activePublicSection}
        onNavigate={handleNavigatePublic}
        onSelectProduct={(product) => setSelectedPublicProduct(product)}
        onOpenEnquiry={handleOpenEnquiryModal}
        onOpenSidebar={() => setIsPublicSidebarOpen(true)}
      />

      {/* Main Content Sections with Tab Router */}
      <main className="flex-grow">
        
        {/* Tab: Home */}
        <section id="home" hidden={activePublicSection !== 'home'}>
          <PMHeroIndia
            onNavigate={handleNavigatePublic}
            onOpenEnquiry={handleOpenEnquiryModal}
          />
        </section>

        {/* Home Overview Sections (only visible on Home tab) */}
        <div hidden={activePublicSection !== 'home'}>
          <PMHomeSections
            onNavigate={handleNavigatePublic}
            onSelectCategory={(cat) => setSelectedPublicCategory(cat)}
            onSelectFlagshipProduct={(idx) => setSelectedFlagshipIndex(idx)}
          />
        </div>

        {/* Tab: Partners & Flagship Formulations Showcase */}
        <PMPartnersAndFlagship
          activeSection={activePublicSection}
          selectedFlagshipIndex={selectedFlagshipIndex}
          onNavigate={handleNavigatePublic}
          onOpenEnquiry={handleOpenEnquiryModal}
        />

        {/* Tab: Flagship Squeeze Carousel (Visible on Flagship tab) */}
        <div hidden={activePublicSection !== 'flagship'}>
          <PMSqueezeShowcase
            onSelectProduct={(product) => setSelectedPublicProduct(product)}
            onOpenEnquiry={handleOpenEnquiryModal}
            onNavigate={handleNavigatePublic}
          />
        </div>

        {/* Tab: Quality Architecture (Precision Dial) */}
        <PMPrecisionDial
          hidden={activePublicSection !== 'precision'}
          onNavigate={handleNavigatePublic}
          onOpenEnquiry={handleOpenEnquiryModal}
        />

        {/* Tab: Product Catalog Directory */}
        <div hidden={activePublicSection !== 'products'}>
          <PMCategoryShowcase
            onSelectCategory={(cat) => setSelectedPublicCategory(cat)}
            onNavigate={handleNavigatePublic}
          />
          <PMProductCatalog
            selectedCategory={selectedPublicCategory}
            onSelectCategory={(cat) => setSelectedPublicCategory(cat)}
            onSelectProduct={(product) => setSelectedPublicProduct(product)}
            onOpenEnquiry={handleOpenEnquiryModal}
          />
          <PMInnovation3D
            onOpenEnquiry={handleOpenEnquiryModal}
            onNavigate={handleNavigatePublic}
          />
        </div>

        {/* Tab: About Us & Factsheet */}
        <div hidden={activePublicSection !== 'about'}>
          <PMAboutSection
            onOpenEnquiry={() => handleOpenEnquiryModal()}
            onNavigate={handleNavigatePublic}
          />
        </div>

        {/* Tab: Clinical Flipbook (Visual Aid) */}
        <div hidden={activePublicSection !== 'flipbook'}>
          <PMFlipbook
            onOpenEnquiry={handleOpenEnquiryModal}
            onSelectProduct={(product) => setSelectedPublicProduct(product)}
          />
        </div>

        {/* Tab: Contact & Direct Enquiry */}
        <div hidden={activePublicSection !== 'contact'}>
          <PMContactSection />
          <PMEnquiryForm defaultProduct={enquiryProductName} />
        </div>

      </main>

      {/* 10. Official Footer */}
      <PMFooter
        onNavigate={handleNavigatePublic}
        onSelectCategory={(cat) => setSelectedPublicCategory(cat)}
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
