import React, { useState, useEffect } from 'react';
import { PMTopBar } from './components/PMTopBar';
import { PMHeader } from './components/PMHeader';
import { PMHeroPfizer } from './components/PMHeroPfizer';
import { PMAudiencePortals } from './components/PMAudiencePortals';
import { PMCategoryShowcase } from './components/PMCategoryShowcase';
import { PMSqueezeShowcase } from './components/PMSqueezeShowcase';
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

      {/* Main Content Sections */}
      <main className="flex-grow">
        
        {/* 3. Pfizer-Style Corporate Purpose Hero with 3D Molecular Simulation */}
        <section id="home">
          <PMHeroPfizer
            onSelectProduct={(product) => setSelectedPublicProduct(product)}
            onOpenEnquiry={handleOpenEnquiryModal}
            onNavigate={handleNavigatePublic}
          />
        </section>

        {/* 3.5. Tri-Portal Stakeholder Audience Pathways */}
        <PMAudiencePortals
          onNavigate={handleNavigatePublic}
          onOpenEnquiry={handleOpenEnquiryModal}
        />

        {/* 4. 21st.dev Squeeze Carousel Flagship Portfolio Showcase */}
        <PMSqueezeShowcase
          onSelectProduct={(product) => setSelectedPublicProduct(product)}
          onOpenEnquiry={handleOpenEnquiryModal}
          onNavigate={handleNavigatePublic}
        />

        {/* 4.5. Product Categories Showcase */}
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

        {/* 6. 3D Drug Delivery Platforms & Formulation Science */}
        <PMInnovation3D
          onOpenEnquiry={handleOpenEnquiryModal}
          onNavigate={handleNavigatePublic}
        />

        {/* 7. Official About Us & Factsheet Section */}
        <PMAboutSection
          onOpenEnquiry={() => handleOpenEnquiryModal()}
          onNavigate={handleNavigatePublic}
        />

        {/* 8. Clinical Flipbook / Visual Aid Viewer */}
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
