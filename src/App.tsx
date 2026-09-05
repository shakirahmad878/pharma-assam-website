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
import { PRODUCTS } from './data/products';
import { Product, ProductCategory } from './types';

export function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState<boolean>(false);
  const [enquiryProductName, setEnquiryProductName] = useState<string>(PRODUCTS[0].name);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All Products'>('All Products');

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
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

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-[#c72828] selection:text-white font-sans antialiased">
      
      {/* 1. Official Red Top Bar (GST, Phone, Email, Quick Links) */}
      <PMTopBar onOpenEnquiry={() => handleOpenEnquiryModal()} />

      {/* 2. Official Corporate Header & Mega Dropdown Navigation */}
      <PMHeader
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onSelectProduct={handleSelectProduct}
        onOpenEnquiry={handleOpenEnquiryModal}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        
        {/* 3. Hero Showcase Slider (Featuring core formulations) */}
        <section id="home">
          <PMHeroSlider
            onSelectProduct={handleSelectProduct}
            onOpenEnquiry={handleOpenEnquiryModal}
            onNavigate={handleNavigate}
          />
        </section>

        {/* 4. Product Categories Showcase (Capsules, Syrups, Tablets, Injectable) */}
        <PMCategoryShowcase
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onNavigate={handleNavigate}
        />

        {/* 5. Full Product Catalog Directory (10 Formulations) */}
        <PMProductCatalog
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onSelectProduct={handleSelectProduct}
          onOpenEnquiry={handleOpenEnquiryModal}
        />

        {/* 6. Official About Us & Factsheet Section */}
        <PMAboutSection
          onOpenEnquiry={() => handleOpenEnquiryModal()}
          onNavigate={handleNavigate}
        />

        {/* 7. Clinical Flipbook / Visual Aid Viewer */}
        <PMFlipbook
          onOpenEnquiry={handleOpenEnquiryModal}
          onSelectProduct={handleSelectProduct}
        />

        {/* 8. Quick Requirement / Direct Enquiry Form */}
        <PMEnquiryForm defaultProduct={enquiryProductName} />

        {/* 9. Official Contact Details, Registered Address & Map */}
        <PMContactSection />

      </main>

      {/* 10. Official Footer */}
      <PMFooter
        onNavigate={handleNavigate}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Modals */}
      <PMProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenEnquiry={handleOpenEnquiryModal}
      />

      <PMSendEnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        defaultProductName={enquiryProductName}
      />

    </div>
  );
}

export default App;
