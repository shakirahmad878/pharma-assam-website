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
  products,
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

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.brandName && p.brandName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.genericName && p.genericName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.indication && p.indication.toLowerCase().includes(searchTerm.toLowerCase()))
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
      name: prod.name,
      brandName: prod.brandName || prod.name,
      genericName: prod.genericName || prod.genericComposition || '',
      dosageForm: prod.dosageForm,
      strength: 'Standard',
      indication: prod.indication || '',
      mrp: prod.mrp ?? 0,
      ptr: prod.ptr ?? 0,
      pts: prod.pts ?? 0,
      packSize: prod.packSize || prod.packaging || '10x10',
      division: 'Pharma',
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
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-600" />
            Pharmaceutical Products & E-Detailing
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Standard drug compositions, pricing tiers (MRP / PTR / PTS), packaging standards, and digital detailing slides.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="primary" size="md">{products.length} Active SKUs</Badge>
          {canModify && onAddProduct && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-md shadow-teal-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search product SKU, brand name, composition, or therapeutic indication..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{prod.brandName || prod.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{prod.genericName || prod.genericComposition}</p>
                </div>
                <Badge variant="neutral">{prod.dosageForm}</Badge>
              </div>

              <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-700 block">Indication:</span>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{prod.indication || 'Primary clinical therapy'}</p>
              </div>

              {/* Pricing breakdown */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-center p-2 rounded-xl bg-teal-50/50 border border-teal-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">MRP</span>
                  <span className="font-bold text-slate-900">₹{(prod.mrp ?? 0).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">PTR</span>
                  <span className="font-bold text-teal-700">₹{(prod.ptr ?? 0).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">PTS</span>
                  <span className="font-bold text-blue-700">₹{(prod.pts ?? 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Visual Aid Presentation Action & Edit/Delete Controls */}
            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Pack: {prod.packSize || prod.packaging || 'Standard'}</span>
                <button
                  onClick={() => setSelectedVisualAidProduct(prod)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-teal-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View E-Detailing
                </button>
              </div>

              {canModify && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-50">
                  {onUpdateProduct && (
                    <button
                      type="button"
                      onClick={() => handleStartEdit(prod)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-teal-600" />
                      <span>Edit</span>
                    </button>
                  )}
                  {onDeleteProduct && (
                    <button
                      type="button"
                      onClick={() => setDeletingProduct(prod)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-600" />
                Add Product SKU
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNew} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CardioPulse-AM"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value, brandName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Generic Composition</label>
                  <input
                    type="text"
                    placeholder="e.g. Telmisartan 40mg + Amlodipine 5mg"
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Dosage Form</label>
                  <select
                    value={formData.dosageForm}
                    onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Ointment">Ointment</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pack Size</label>
                  <input
                    type="text"
                    value={formData.packSize}
                    onChange={(e) => setFormData({ ...formData, packSize: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Division</label>
                  <input
                    type="text"
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Indication</label>
                <input
                  type="text"
                  value={formData.indication}
                  onChange={(e) => setFormData({ ...formData, indication: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">PTR (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.ptr}
                    onChange={(e) => setFormData({ ...formData, ptr: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">PTS (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.pts}
                    onChange={(e) => setFormData({ ...formData, pts: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-600/20"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-teal-600" />
                Edit Product: {editingProduct.name}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value, brandName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Generic Composition</label>
                  <input
                    type="text"
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Dosage Form</label>
                  <select
                    value={formData.dosageForm}
                    onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Ointment">Ointment</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pack Size</label>
                  <input
                    type="text"
                    value={formData.packSize}
                    onChange={(e) => setFormData({ ...formData, packSize: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Division</label>
                  <input
                    type="text"
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Indication</label>
                <input
                  type="text"
                  value={formData.indication}
                  onChange={(e) => setFormData({ ...formData, indication: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">PTR (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.ptr}
                    onChange={(e) => setFormData({ ...formData, ptr: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">PTS (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.pts}
                    onChange={(e) => setFormData({ ...formData, pts: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-600/20"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h3 className="text-base font-bold text-center text-slate-900">
              Delete Product SKU?
            </h3>
            <p className="text-xs text-slate-500 text-center mt-2 leading-relaxed">
              Are you sure you want to remove <strong className="text-slate-800">{deletingProduct.name}</strong> from the catalog?
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* E-Detailing Slide Viewer Modal */}
      {selectedVisualAidProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-teal-600">Digital Visual Aid</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedVisualAidProduct.brandName || selectedVisualAidProduct.name}</h3>
              </div>
              <button onClick={() => setSelectedVisualAidProduct(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto">
              {(selectedVisualAidProduct.visualAidSlides || []).map((slide: VisualAidSlide, idx: number) => (
                <div key={slide.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{slide.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{slide.description}</p>
                  
                  <ul className="mt-2 space-y-1 text-xs text-slate-600 pl-4 list-disc">
                    {slide.bulletPoints.map((bp: string, bidx: number) => (
                      <li key={bidx}>{bp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedVisualAidProduct(null)}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs"
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
