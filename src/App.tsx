import React, { useState } from 'react';
import { EditorialNavbar } from './components/EditorialNavbar';
import { BoldHero } from './components/BoldHero';
import { CleanTrustStrip } from './components/CleanTrustStrip';
import { EditorialAbout } from './components/EditorialAbout';
import { InteractiveBatchCalculator } from './components/InteractiveBatchCalculator';
import { EditorialCatalog } from './components/EditorialCatalog';
import { EditorialCleanroom } from './components/EditorialCleanroom';
import { EditorialQualityLab } from './components/EditorialQualityLab';
import { RegionalAssamNetwork } from './components/RegionalAssamNetwork';
import { EditorialComparison } from './components/EditorialComparison';
import { EditorialVisualAid } from './components/EditorialVisualAid';
import { EditorialContact } from './components/EditorialContact';
import { EnterpriseFooter } from './components/EnterpriseFooter';
import { ProductDetailModal } from './components/ProductDetailModal';
import { EnquiryModal } from './components/EnquiryModal';
import { SearchModal } from './components/SearchModal';
import { LiveRfqCartDrawer, RfqItem } from './components/LiveRfqCartDrawer';
import { PRODUCTS } from './data/products';
import { Product } from './types';

export function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState<boolean>(false);
  const [enquiryProductName, setEnquiryProductName] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isRfqDrawerOpen, setIsRfqDrawerOpen] = useState<boolean>(false);
  
  // Interactive RFQ Requisition Cart State
  const [rfqItems, setRfqItems] = useState<RfqItem[]>([
    { product: PRODUCTS[0], quantity: 25000, unit: 'Softgel Capsules' },
    { product: PRODUCTS[1], quantity: 50000, unit: 'Strips (Alu-Alu)' }
  ]);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        const offset = 90;
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

  const handleOpenEnquiry = (productName?: string) => {
    setEnquiryProductName(productName || PRODUCTS[0].name);
    setIsEnquiryOpen(true);
  };

  const handleAddToRfq = (product: Product) => {
    setRfqItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 5000 }
            : item
        );
      }
      return [...prev, { product, quantity: 10000, unit: product.unit }];
    });
  };

  const handleRemoveRfqItem = (productId: string) => {
    setRfqItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleUpdateRfqQuantity = (productId: string, quantity: number) => {
    setRfqItems((prev) => 
      prev.map((item) => 
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleClearRfqCart = () => {
    setRfqItems([]);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between selection:bg-teal-700 selection:text-white font-sans antialiased">
      
      {/* 1. Header with Regulatory Registration & Language Selector */}
      <EditorialNavbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenEnquiry={handleOpenEnquiry}
        rfqCount={rfqItems.length}
        onOpenRfqDrawer={() => setIsRfqDrawerOpen(true)}
      />

      {/* Main Interactive Sections */}
      <main className="flex-grow">
        
        {/* 2. Bold Editorial Hero Section with Live Formulation Spotlight */}
        <section id="home">
          <BoldHero
            onNavigate={handleNavigate}
            onOpenEnquiry={handleOpenEnquiry}
            onOpenDetails={(p) => setSelectedProduct(p)}
            onAddToRfq={handleAddToRfq}
          />
        </section>

        {/* 3. Verified Regulatory Compliance Strip */}
        <CleanTrustStrip />

        {/* 4. Corporate Governance & Verified Track Record */}
        <EditorialAbout 
          onNavigate={handleNavigate}
          onOpenEnquiry={handleOpenEnquiry}
        />

        {/* 5. Interactive Batch Sizing & Formulation Studio */}
        <InteractiveBatchCalculator 
          onOpenEnquiry={handleOpenEnquiry}
          onAddToRfq={handleAddToRfq}
        />

        {/* 6. Standardized Product Directory & Filter Matrix */}
        <EditorialCatalog
          onOpenDetails={(p) => setSelectedProduct(p)}
          onOpenEnquiry={handleOpenEnquiry}
          onAddToRfq={handleAddToRfq}
        />

        {/* 7. Cleanroom Facility & Environmental Telemetry HUD */}
        <EditorialCleanroom 
          onOpenEnquiry={handleOpenEnquiry}
        />

        {/* 8. cGLP Analytical Testing Lab with HPLC & Dissolution Simulators */}
        <EditorialQualityLab 
          onOpenEnquiry={handleOpenEnquiry}
        />

        {/* 9. Assam & North-East Regional Distribution Network */}
        <RegionalAssamNetwork 
          onOpenEnquiry={handleOpenEnquiry}
        />

        {/* 10. Institutional Sourcing Why Partner & Comparison Table */}
        <EditorialComparison 
          onOpenEnquiry={handleOpenEnquiry}
        />

        {/* 11. Digital Medical Representative Visual Monograph */}
        <EditorialVisualAid
          onOpenEnquiry={handleOpenEnquiry}
          onAddToRfq={handleAddToRfq}
        />

        {/* 12. Direct Institutional RFP/RFQ Portal */}
        <EditorialContact />

      </main>

      {/* 13. Luxury Corporate Footer */}
      <EnterpriseFooter onNavigate={handleNavigate} />

      {/* Interactive Modals & Slide-Out Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onOpenEnquiry={handleOpenEnquiry}
      />

      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        defaultProductName={enquiryProductName}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <LiveRfqCartDrawer
        isOpen={isRfqDrawerOpen}
        onClose={() => setIsRfqDrawerOpen(false)}
        items={rfqItems}
        onRemoveItem={handleRemoveRfqItem}
        onUpdateQuantity={handleUpdateRfqQuantity}
        onClearCart={handleClearRfqCart}
      />

    </div>
  );
}

export default App;
