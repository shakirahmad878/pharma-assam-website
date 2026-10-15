import React, { useState } from 'react';
import { Chemist, User } from '../../types';
import { Badge } from '../common/Badge';
import { Store, Phone, MapPin, Building2, Plus, Edit2, Trash2, X, AlertTriangle, Search } from 'lucide-react';

interface ChemistDirectoryProps {
  chemists: Chemist[];
  currentUser?: User | null;
  onAddChemist?: (chemist: Chemist) => void;
  onUpdateChemist?: (chemist: Chemist) => void;
  onDeleteChemist?: (chemId: string) => void;
}

export const ChemistDirectory: React.FC<ChemistDirectoryProps> = ({ 
  chemists,
  currentUser,
  onAddChemist,
  onUpdateChemist,
  onDeleteChemist
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingChemist, setEditingChemist] = useState<Chemist | null>(null);
  const [deletingChemist, setDeletingChemist] = useState<Chemist | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    shopName: '',
    drugLicenseNumber: '',
    contactPerson: '',
    phone: '',
    address: '',
    latitude: '24.8146',
    longitude: '92.8037',
    averageMonthlyTurnover: 350000,
  });

  const canModify = !currentUser || currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN' || currentUser.role === 'MANAGER' || !!currentUser.permissions?.canModifyDatabase;

  const filteredChemists = chemists.filter(c => {
    if (!c) return false;
    return (
      (c.shopName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.drugLicenseNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.contactPerson || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      shopName: '',
      drugLicenseNumber: 'AS/CA/2026/DL-',
      contactPerson: '',
      phone: '+91 94350 ',
      address: '',
      latitude: '24.8146',
      longitude: '92.8037',
      averageMonthlyTurnover: 350000,
    });
    setIsAddModalOpen(true);
  };

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.shopName || !onAddChemist) return;

    const newChem: Chemist = {
      id: `chem-${Date.now()}`,
      name: formData.name || formData.shopName,
      shopName: formData.shopName,
      drugLicenseNumber: formData.drugLicenseNumber || 'AS/CA/2026/DL-999',
      gstNumber: '18AAACC1234F1Z5',
      contactPerson: formData.contactPerson || 'Store Manager',
      phone: formData.phone || '+91 94350 00000',
      location: {
        latitude: parseFloat(formData.latitude) || 24.8146,
        longitude: parseFloat(formData.longitude) || 92.8037,
        address: formData.address || '',
      },
      territoryId: 'terr-cachar-01',
      territoryName: 'Silchar Central & Hospital Road',
      averageMonthlyTurnover: Number(formData.averageMonthlyTurnover) || 300000,
      associatedDoctors: ['Dr. Rajesh Kothari', 'Dr. Bodrud Sadiol'],
    };

    onAddChemist(newChem);
    setIsAddModalOpen(false);
  };

  const handleStartEdit = (chem: Chemist) => {
    setEditingChemist(chem);
    setFormData({
      name: chem.name || '',
      shopName: chem.shopName || '',
      drugLicenseNumber: chem.drugLicenseNumber || '',
      contactPerson: chem.contactPerson || '',
      phone: chem.phone || '',
      address: chem.location?.address || '',
      latitude: (chem.location?.latitude || 24.8162).toString(),
      longitude: (chem.location?.longitude || 92.8015).toString(),
      averageMonthlyTurnover: chem.averageMonthlyTurnover || 450000,
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingChemist || !onUpdateChemist) return;

    const updated: Chemist = {
      ...editingChemist,
      name: formData.name || editingChemist.name,
      shopName: formData.shopName || editingChemist.shopName,
      drugLicenseNumber: formData.drugLicenseNumber || editingChemist.drugLicenseNumber,
      contactPerson: formData.contactPerson || editingChemist.contactPerson,
      phone: formData.phone || editingChemist.phone,
      location: {
        ...(editingChemist.location || {}),
        address: formData.address || '',
        latitude: parseFloat(formData.latitude) || editingChemist.location?.latitude || 24.8162,
        longitude: parseFloat(formData.longitude) || editingChemist.location?.longitude || 92.8015,
      },
      averageMonthlyTurnover: Number(formData.averageMonthlyTurnover) || editingChemist.averageMonthlyTurnover || 450000,
    };

    onUpdateChemist(updated);
    setEditingChemist(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingChemist && onDeleteChemist) {
      onDeleteChemist(deletingChemist.id);
      setDeletingChemist(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="neu-card p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#10243A] flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center font-bold shadow-xs">
                <Store className="w-5 h-5 text-[#137F83]" />
              </div>
              Chemist & Retail Pharmacy Master
            </h2>
            <p className="text-xs text-[#64748B] mt-1.5">
              Track retail chemist outlets, drug license numbers, monthly volume, and RCPA stock audits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-teal-50 text-[#137F83] border border-teal-200">
              {chemists.length} Registered Pharmacies
            </span>
            {canModify && onAddChemist && (
              <button
                onClick={handleOpenAdd}
                className="neu-btn-gold flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Add Chemist
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="neu-card p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search chemist shop name, license number, or contact person..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="neu-input w-full pl-10 pr-3 py-2 text-xs"
          />
        </div>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredChemists.map((chem) => (
          <div
            key={chem.id}
            className="neu-card p-5 flex flex-col justify-between hover:border-[#18A6A6] transition-all duration-200"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-[#10243A]">{chem.shopName}</h3>
                  <p className="text-xs text-[#64748B] font-medium flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-[#18A6A6]" />
                    {chem.name}
                  </p>
                </div>
                <Badge variant="success">Active Partner</Badge>
              </div>

              <div className="mt-4 space-y-2.5 text-xs text-[#64748B]">
                <p className="flex items-start gap-1.5 text-[#64748B]">
                  <MapPin className="w-3.5 h-3.5 text-[#18A6A6] shrink-0 mt-0.5" />
                  <span>{chem.location?.address || 'Hospital Road, Silchar'}</span>
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-[#DCE4EB] text-[11px]">
                  <div>
                    <span className="text-[#64748B] block font-medium">Drug License No:</span>
                    <span className="font-mono font-semibold text-[#137F83]">{chem.drugLicenseNumber}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block font-medium">Contact Person:</span>
                    <span className="font-semibold text-[#10243A]">{chem.contactPerson}</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-[#DCE4EB] flex items-center justify-between text-xs">
                  <span className="text-[#64748B] flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-[#18A6A6]" /> {chem.phone}
                  </span>
                  <span className="font-semibold text-[#137F83] bg-[#F1F6F8] border border-[#DCE4EB] px-2.5 py-0.5 rounded-lg">
                    Monthly Vol: ₹{(chem.averageMonthlyTurnover / 100000).toFixed(1)}L
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {canModify && (
              <div className="mt-4 pt-3.5 border-t border-[#DCE4EB] flex items-center justify-end gap-2">
                {onUpdateChemist && (
                  <button
                    type="button"
                    onClick={() => handleStartEdit(chem)}
                    className="neu-btn flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs text-[#10243A] cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#18A6A6]" />
                    <span>Edit</span>
                  </button>
                )}
                {onDeleteChemist && (
                  <button
                    type="button"
                    onClick={() => setDeletingChemist(chem)}
                    className="neu-btn flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Chemist Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#10243A]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="neu-card max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 border border-[#DCE4EB] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE4EB]">
              <h3 className="font-bold text-base text-[#10243A] flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center">
                  <Plus className="w-4 h-4 text-[#137F83]" />
                </div>
                Add Chemist Pharmacy
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="neu-btn p-1.5 rounded-xl text-[#64748B] hover:text-[#10243A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNew} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#10243A] block mb-1">Pharmacy / Shop Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apollo Pharmacy / City Medicos"
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                  className="neu-input w-full px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Drug License Number</label>
                  <input
                    type="text"
                    placeholder="e.g. DL-2026-9901"
                    value={formData.drugLicenseNumber}
                    onChange={(e) => setFormData({ ...formData, drugLicenseNumber: e.target.value })}
                    className="neu-input w-full px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Ghosh"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="neu-input w-full px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#10243A] block mb-1">Address</label>
                <input
                  type="text"
                  placeholder="e.g. Hospital Road, Near Civil Hospital"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="neu-input w-full px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="neu-input w-full px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Average Monthly Volume (₹)</label>
                  <input
                    type="number"
                    value={formData.averageMonthlyTurnover}
                    onChange={(e) => setFormData({ ...formData, averageMonthlyTurnover: parseInt(e.target.value, 10) || 0 })}
                    className="neu-input w-full px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-[#DCE4EB]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="neu-btn px-4 py-2 rounded-xl text-xs text-[#64748B] hover:text-[#10243A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neu-btn-gold px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Register Chemist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Chemist Modal */}
      {editingChemist && (
        <div className="fixed inset-0 z-50 bg-[#10243A]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="neu-card max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 border border-[#DCE4EB] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE4EB]">
              <h3 className="font-bold text-base text-[#10243A] flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center">
                  <Edit2 className="w-4 h-4 text-[#137F83]" />
                </div>
                Edit Chemist: {editingChemist.shopName}
              </h3>
              <button onClick={() => setEditingChemist(null)} className="neu-btn p-1.5 rounded-xl text-[#64748B] hover:text-[#10243A]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#10243A] block mb-1">Pharmacy / Shop Name *</label>
                <input
                  type="text"
                  required
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                  className="neu-input w-full px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Drug License Number</label>
                  <input
                    type="text"
                    value={formData.drugLicenseNumber}
                    onChange={(e) => setFormData({ ...formData, drugLicenseNumber: e.target.value })}
                    className="neu-input w-full px-3 py-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="neu-input w-full px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#10243A] block mb-1">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="neu-input w-full px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="neu-input w-full px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#10243A] block mb-1">Monthly Volume (₹)</label>
                  <input
                    type="number"
                    value={formData.averageMonthlyTurnover}
                    onChange={(e) => setFormData({ ...formData, averageMonthlyTurnover: parseInt(e.target.value, 10) || 0 })}
                    className="neu-input w-full px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-[#DCE4EB]">
                <button
                  type="button"
                  onClick={() => setEditingChemist(null)}
                  className="neu-btn px-4 py-2 rounded-xl text-xs text-[#64748B] hover:text-[#10243A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neu-btn-gold px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletingChemist && (
        <div className="fixed inset-0 z-50 bg-[#10243A]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="neu-card max-w-sm w-full p-6 animate-in fade-in zoom-in-95 border border-[#DCE4EB] shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h3 className="text-base font-bold text-center text-[#10243A]">
              Remove Chemist Pharmacy?
            </h3>
            <p className="text-xs text-[#64748B] text-center mt-2 leading-relaxed">
              Are you sure you want to remove <strong className="text-[#10243A]">{deletingChemist.shopName}</strong> from the database?
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingChemist(null)}
                className="neu-btn flex-1 py-2.5 rounded-xl text-xs text-[#64748B] hover:text-[#10243A] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
