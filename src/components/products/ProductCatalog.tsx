import React, { useState } from 'react';
import { Product, VisualAidSlide, User } from '../../types';
import { Badge } from '../common/Badge';
import { Pill, Eye, X, Plus, Edit2, Trash2, AlertTriangle, Search } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  currentUser?: User | null;
  onAddProduct?: (prod: Product) => void;
  onUpdateProduct?: (prod: Product) => void;
  onDeleteProduct?: (prodId: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ 
  products = [],
  currentUser,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVisualAidProduct, setSelectedVisualAidProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brandName: '',
    genericName: '',
    dosageForm: 'Tablet',
    strength: '10mg',
    indication: '',
    mrp: 150,
    ptr: 110,
    pts: 95,
    packSize: '10x10 Strips',
    division: 'Cardio-Diabetic',
  });

  const canModify = !currentUser || currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN' || currentUser.role === 'MANAGER' || !!currentUser.permissions?.canModifyDatabase;

  const safeProducts = Array.isArray(products) ? products : [];

  const filteredProducts = safeProducts.filter(p => 
    p && (
      (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.brandName && p.brandName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.genericName && p.genericName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.indication && p.indication.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      brandName: '',
      genericName: '',
      dosageForm: 'Tablet',
      strength: '10mg',
      indication: 'Cardiovascular / Metabolic care',
      mrp: 150,
      ptr: 110,
      pts: 95,
      packSize: '10x10 Strips',
      division: 'Cardio-Diabetic',
    });
    setIsAddModalOpen(true);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !onAddProduct) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: formData.name,
      brandName: formData.brandName || formData.name,
      genericName: formData.genericName,
      genericComposition: formData.genericName || formData.name,
      activeMolecules: [formData.genericName || formData.name],
      category: 'Pharmaceutical Tablets',
      dosageForm: formData.dosageForm,
      packSize: formData.packSize,
      indication: formData.indication,
      clinicalHighlights: ['High Bioavailability', 'Once Daily Dose'],
      imageUrl: '/images/products/tablet-sample.jpg',
      mrp: Number(formData.mrp) || 100,
      ptr: Number(formData.ptr) || 75,
      pts: Number(formData.pts) || 65,
      visualAidSlides: [
        {
          id: `sl-${Date.now()}`,
          title: `${formData.name} Clinical Advantage`,
          description: 'High patient compliance with once-daily dosing regimen.',
          imageUrl: '/images/products/tablet-sample.jpg',
          bulletPoints: [
            'Bioequivalent to international innovator standards',
            'Superior bioavailability profile',
            'Economical pricing for Northeast healthcare ecosystem'
          ]
        }
      ]
    };

    onAddProduct(newProd);
    setIsAddModalOpen(false);
  };

  const handleStartEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name || '',
      brandName: prod.brandName || prod.name || '',
      genericName: prod.genericName || prod.genericComposition || '',
      dosageForm: prod.dosageForm || 'Tablet',
      strength: '10mg',
      indication: prod.indication || '',
      mrp: prod.mrp ?? 150,
      ptr: prod.ptr ?? 110,
      pts: prod.pts ?? 95,
      packSize: prod.packSize || prod.packaging || '10x10 Strips',
      division: 'Cardio-Diabetic',
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !onUpdateProduct) return;

    const updated: Product = {
      ...editingProduct,
      name: formData.name,
      brandName: formData.brandName,
      genericName: formData.genericName,
      genericComposition: formData.genericName || editingProduct.genericComposition,
      dosageForm: formData.dosageForm,
      indication: formData.indication,
      mrp: Number(formData.mrp) || editingProduct.mrp,
      ptr: Number(formData.ptr) || editingProduct.ptr,
      pts: Number(formData.pts) || editingProduct.pts,
      packSize: formData.packSize,
    };

    onUpdateProduct(updated);
    setEditingProduct(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingProduct && onDeleteProduct) {
      onDeleteProduct(deletingProduct.id);
      setDeletingProduct(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="neu-card p-5 border border-[#DCE4EB] bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#10243A] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center font-bold">
              <Pill className="w-4 h-4 text-[#137F83]" />
            </div>
            Pharmaceutical Products & E-Detailing
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            Standard drug compositions, pricing tiers (MRP / PTR / PTS), packaging standards, and digital detailing slides.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="primary" size="md">{safeProducts.length} Active SKUs</Badge>
          {canModify && onAddProduct && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer bg-[#10243A] hover:bg-[#182F49] text-white transition-all shadow-xs"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Add Product
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="neu-card p-4 border border-[#DCE4EB] bg-white shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search product SKU, brand name, composition, or therapeutic indication..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs bg-[#F8FAFC] border border-[#DCE4EB] rounded-xl text-[#10243A] focus:outline-none focus:border-[#18A6A6]"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="neu-card border border-[#DCE4EB] bg-white p-5 flex flex-col justify-between hover:border-teal-500/50 hover:shadow-md transition-all duration-200 shadow-xs"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#10243A]">{prod.brandName || prod.name}</h3>
                  <p className="text-xs text-[#137F83] font-medium mt-0.5">{prod.genericName || prod.genericComposition}</p>
                </div>
                <Badge variant="neutral">{prod.dosageForm}</Badge>
              </div>

              <div className="mt-3 text-xs bg-[#F8FAFC] p-3 rounded-xl border border-[#DCE4EB]">
                <span className="font-semibold text-[#64748B] block">Indication:</span>
                <p className="text-[11px] text-[#10243A] mt-0.5 leading-relaxed">{prod.indication || 'Primary clinical therapy'}</p>
              </div>

              {/* Pricing breakdown */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-center p-2.5 rounded-xl bg-[#F1F6F8] border border-[#DCE4EB] text-xs">
                <div>
                  <span className="text-[10px] text-[#64748B] block uppercase font-bold">MRP</span>
                  <span className="font-bold text-[#10243A]">₹{(prod.mrp ?? 0).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] block uppercase font-bold">PTR</span>
                  <span className="font-bold text-[#137F83]">₹{(prod.ptr ?? 0).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] block uppercase font-bold">PTS</span>
                  <span className="font-bold text-[#10243A]">₹{(prod.pts ?? 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Visual Aid Presentation Action & Edit/Delete Controls */}
            <div className="mt-4 pt-3.5 border-t border-[#DCE4EB] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#64748B]">Pack: {prod.packSize || prod.packaging || 'Standard'}</span>
                <button
                  onClick={() => setSelectedVisualAidProduct(prod)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[#137F83] hover:text-[#10243A] bg-teal-50 border border-teal-200 text-xs font-semibold cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View E-Detailing
                </button>
              </div>

              {canModify && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DCE4EB]">
                  {onUpdateProduct && (
                    <button
                      type="button"
                      onClick={() => handleStartEdit(prod)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold text-[#10243A] hover:bg-[#F1F6F8] border border-[#DCE4EB] cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#137F83]" />
                      <span>Edit</span>
                    </button>
                  )}
                  {onDeleteProduct && (
                    <button
                      type="button"
                      onClick={() => setDeletingProduct(prod)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#10243A]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#DCE4EB] rounded-2xl max-w-lg w-full p-6 shadow-xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#DCE4EB]">
              <h3 className="font-bold text-base text-[#10243A] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#137F83]" />
                Add Product SKU
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1.5 rounded-xl text-[#64748B] hover:text-[#10243A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNew} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CardioPulse-AM"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value, brandName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] focus:outline-none focus:border-[#18A6A6]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Generic Composition</label>
                  <input
                    type="text"
                    placeholder="e.g. Telmisartan 40mg + Amlodipine 5mg"
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] focus:outline-none focus:border-[#18A6A6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Dosage Form</label>
                  <select
                    value={formData.dosageForm}
                    onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] cursor-pointer focus:outline-none focus:border-[#18A6A6]"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Ointment">Ointment</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Pack Size</label>
                  <input
                    type="text"
                    value={formData.packSize}
                    onChange={(e) => setFormData({ ...formData, packSize: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] focus:outline-none focus:border-[#18A6A6]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Division</label>
                  <input
                    type="text"
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] focus:outline-none focus:border-[#18A6A6]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#10243A] block mb-1">Indication</label>
                <input
                  type="text"
                  value={formData.indication}
                  onChange={(e) => setFormData({ ...formData, indication: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] focus:outline-none focus:border-[#18A6A6]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] font-mono focus:outline-none focus:border-[#18A6A6]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">PTR (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.ptr}
                    onChange={(e) => setFormData({ ...formData, ptr: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] font-mono focus:outline-none focus:border-[#18A6A6]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">PTS (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.pts}
                    onChange={(e) => setFormData({ ...formData, pts: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] font-mono focus:outline-none focus:border-[#18A6A6]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-[#DCE4EB]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#10243A] bg-[#F1F6F8] hover:bg-[#E8EEF4] border border-[#DCE4EB] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold cursor-pointer bg-[#10243A] hover:bg-[#182F49] text-white shadow-xs"
                >
                  Save Product SKU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-[#10243A]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#DCE4EB] rounded-2xl max-w-lg w-full p-6 shadow-xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#DCE4EB]">
              <h3 className="font-bold text-base text-[#10243A] flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#137F83]" />
                Edit Product: {editingProduct.name}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="p-1.5 rounded-xl text-[#64748B] hover:text-[#10243A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value, brandName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] focus:outline-none focus:border-[#18A6A6]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Generic Composition</label>
                  <input
                    type="text"
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] focus:outline-none focus:border-[#18A6A6]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Dosage Form</label>
                  <select
                    value={formData.dosageForm}
                    onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] cursor-pointer focus:outline-none focus:border-[#18A6A6]"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Ointment">Ointment</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Pack Size</label>
                  <input
                    type="text"
                    value={formData.packSize}
                    onChange={(e) => setFormData({ ...formData, packSize: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] focus:outline-none focus:border-[#18A6A6]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Division</label>
                  <input
                    type="text"
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] focus:outline-none focus:border-[#18A6A6]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#10243A] block mb-1">Indication</label>
                <input
                  type="text"
                  value={formData.indication}
                  onChange={(e) => setFormData({ ...formData, indication: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] focus:outline-none focus:border-[#18A6A6]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] font-mono focus:outline-none focus:border-[#18A6A6]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">PTR (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.ptr}
                    onChange={(e) => setFormData({ ...formData, ptr: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] font-mono focus:outline-none focus:border-[#18A6A6]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">PTS (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.pts}
                    onChange={(e) => setFormData({ ...formData, pts: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] font-mono focus:outline-none focus:border-[#18A6A6]"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-[#DCE4EB]">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#10243A] bg-[#F1F6F8] hover:bg-[#E8EEF4] border border-[#DCE4EB] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold cursor-pointer bg-[#10243A] hover:bg-[#182F49] text-white shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Product Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 bg-[#10243A]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#DCE4EB] rounded-2xl max-w-sm w-full p-6 shadow-xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h3 className="text-base font-bold text-center text-[#10243A]">
              Delete Product SKU?
            </h3>
            <p className="text-xs text-[#64748B] text-center mt-2 leading-relaxed">
              Are you sure you want to remove <strong className="text-[#10243A]">{deletingProduct.name}</strong> from the catalog?
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-[#64748B] hover:text-[#10243A] bg-[#F1F6F8] hover:bg-[#E8EEF4] border border-[#DCE4EB] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* E-Detailing Slide Viewer Modal */}
      {selectedVisualAidProduct && (
        <div className="fixed inset-0 z-50 bg-[#10243A]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#DCE4EB] rounded-2xl max-w-2xl w-full p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#DCE4EB]">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-[#137F83]">Digital Visual Aid</span>
                <h3 className="text-lg font-bold text-[#10243A]">{selectedVisualAidProduct.brandName || selectedVisualAidProduct.name}</h3>
              </div>
              <button onClick={() => setSelectedVisualAidProduct(null)} className="p-1.5 rounded-xl text-[#64748B] hover:text-[#10243A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {(selectedVisualAidProduct.visualAidSlides || []).map((slide: VisualAidSlide, idx: number) => (
                <div key={slide.id} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DCE4EB] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-sm text-[#10243A]">{slide.title}</h4>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">{slide.description}</p>
                  
                  <ul className="mt-2 space-y-1 text-xs text-[#137F83] pl-4 list-disc">
                    {slide.bulletPoints.map((bp: string, bidx: number) => (
                      <li key={bidx}>{bp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3.5 border-t border-[#DCE4EB] text-right">
              <button
                onClick={() => setSelectedVisualAidProduct(null)}
                className="px-4 py-2 rounded-xl font-bold text-xs cursor-pointer bg-[#10243A] hover:bg-[#182F49] text-white shadow-xs"
              >
                Close Visual Aid
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
