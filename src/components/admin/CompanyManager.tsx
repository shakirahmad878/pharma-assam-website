import React, { useState } from 'react';
import { Company, User } from '../../types';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Stethoscope, 
  Store, 
  ShieldAlert,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  X
} from 'lucide-react';

interface CompanyManagerProps {
  companies: Company[];
  currentUser: User;
  onAddCompany: (company: Company) => void;
  onUpdateCompany: (company: Company) => void;
  onDeleteCompany: (companyId: string) => void;
  onSelectActiveCompany?: (companyId: string) => void;
  selectedCompanyId?: string;
}

export const CompanyManager: React.FC<CompanyManagerProps> = ({
  companies,
  currentUser,
  onAddCompany,
  onUpdateCompany,
  onDeleteCompany,
  onSelectActiveCompany,
  selectedCompanyId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // New Company Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [regNo, setRegNo] = useState('');
  const [gstNo, setGstNo] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [headquarters, setHeadquarters] = useState('');
  const [state, setState] = useState('Assam');
  const [subscriptionPlan, setSubscriptionPlan] = useState<'ENTERPRISE' | 'PRO' | 'STANDARD'>('ENTERPRISE');
  const [maxUsers, setMaxUsers] = useState<number>(50);

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.headquarters.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setName('');
    setCode('');
    setRegNo('');
    setGstNo('');
    setEmail('');
    setPhone('');
    setHeadquarters('');
    setState('Assam');
    setSubscriptionPlan('ENTERPRISE');
    setMaxUsers(50);
    setEditingCompany(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (comp: Company) => {
    setEditingCompany(comp);
    setName(comp.name);
    setCode(comp.code);
    setRegNo(comp.registrationNumber);
    setGstNo(comp.gstNumber);
    setEmail(comp.contactEmail);
    setPhone(comp.contactPhone);
    setHeadquarters(comp.headquarters);
    setState(comp.state);
    setSubscriptionPlan(comp.subscriptionPlan);
    setMaxUsers(comp.maxUsers);
    setIsAddModalOpen(true);
  };

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    if (editingCompany) {
      const updated: Company = {
        ...editingCompany,
        name,
        code: code.toUpperCase(),
        registrationNumber: regNo || editingCompany.registrationNumber,
        gstNumber: gstNo || editingCompany.gstNumber,
        contactEmail: email || editingCompany.contactEmail,
        contactPhone: phone || editingCompany.contactPhone,
        headquarters: headquarters || editingCompany.headquarters,
        state,
        subscriptionPlan,
        maxUsers: Number(maxUsers) || editingCompany.maxUsers,
      };
      onUpdateCompany(updated);
    } else {
      const newComp: Company = {
        id: `comp-${Date.now().toString().slice(-4)}`,
        name,
        code: code.toUpperCase(),
        registrationNumber: regNo || `U24239AS2026PTC0${Math.floor(Math.random() * 89999 + 10000)}`,
        gstNumber: gstNo || `18AAACP${Math.floor(Math.random() * 8999 + 1000)}F1Z8`,
        contactEmail: email || `contact@${code.toLowerCase()}.com`,
        contactPhone: phone || '+91 94350 00000',
        headquarters: headquarters || 'Silchar, Assam',
        state,
        subscriptionPlan,
        maxUsers: Number(maxUsers) || 50,
        activeUsersCount: 1,
        activeDoctorsCount: 0,
        activeChemistsCount: 0,
        status: 'ACTIVE',
        createdAt: new Date().toISOString().split('T')[0],
      };
      onAddCompany(newComp);
    }

    setIsAddModalOpen(false);
  };

  const handleToggleStatus = (comp: Company) => {
    const newStatus = comp.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    onUpdateCompany({ ...comp, status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">Multi-Tenant Company Management</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded">
                Super Admin Exclusive
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Configure and provision isolated enterprise tenant organizations, manage license tiers, seat limits, and company status.
            </p>
          </div>
          
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Pharma Company</span>
          </button>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-800 text-xs">
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
            <span className="text-slate-400">Total Companies</span>
            <p className="text-lg font-bold text-white mt-0.5">{companies.length}</p>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
            <span className="text-slate-400">Active Tenants</span>
            <p className="text-lg font-bold text-emerald-400 mt-0.5">
              {companies.filter(c => c.status === 'ACTIVE').length}
            </p>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
            <span className="text-slate-400">Total Provisioned Seats</span>
            <p className="text-lg font-bold text-teal-400 mt-0.5">
              {companies.reduce((acc, c) => acc + c.maxUsers, 0)} Seats
            </p>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50">
            <span className="text-slate-400">Active Field Personnel</span>
            <p className="text-lg font-bold text-indigo-400 mt-0.5">
              {companies.reduce((acc, c) => acc + c.activeUsersCount, 0)} Users
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search company by name, code or HQ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing {filteredCompanies.length} of {companies.length} tenant organizations
        </div>
      </div>

      {/* Companies Grid Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredCompanies.map((company) => {
          const isSelected = selectedCompanyId === company.id;

          return (
            <div
              key={company.id}
              className={`bg-white rounded-xl border p-5 transition-all shadow-sm flex flex-col justify-between ${
                isSelected 
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-indigo-500/10' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                      {company.code.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{company.name}</h3>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {company.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{company.headquarters}, {company.state}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      company.status === 'ACTIVE' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {company.status}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {company.subscriptionPlan}
                    </span>
                  </div>
                </div>

                {/* Company Details & Stats */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-medium">Field MRs & Staff</span>
                    <span className="text-xs font-bold text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                      <Users className="w-3 h-3 text-indigo-600" />
                      {company.activeUsersCount} / {company.maxUsers}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-medium">Mapped Doctors</span>
                    <span className="text-xs font-bold text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                      <Stethoscope className="w-3 h-3 text-teal-600" />
                      {company.activeDoctorsCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-medium">Chemists</span>
                    <span className="text-xs font-bold text-slate-900 flex items-center justify-center gap-1 mt-0.5">
                      <Store className="w-3 h-3 text-amber-600" />
                      {company.activeChemistsCount}
                    </span>
                  </div>
                </div>

                {/* Meta details */}
                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">GST Registration:</span>
                    <span className="font-mono font-medium text-slate-700">{company.gstNumber}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Corporate Email:</span>
                    <span className="font-medium text-slate-700">{company.contactEmail}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Tenant Created:</span>
                    <span className="text-slate-600">{company.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {onSelectActiveCompany && (
                  <button
                    onClick={() => onSelectActiveCompany(company.id)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected ? '✓ Filtered Company' : 'Scope Admin View'}
                  </button>
                )}

                <div className="flex items-center gap-1.5 ml-auto">
                  <button
                    onClick={() => handleToggleStatus(company)}
                    className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all ${
                      company.status === 'ACTIVE'
                        ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    }`}
                    title="Toggle Active / Suspended status"
                  >
                    {company.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(company)}
                    className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg border border-slate-200"
                    title="Edit Company Details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {companies.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to remove ${company.name}? This will delete all tenant mappings.`)) {
                          onDeleteCompany(company.id);
                        }
                      }}
                      className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200"
                      title="Delete Company"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Company Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {editingCompany ? 'Edit Pharma Company Tenant' : 'Provision New Pharma Company Tenant'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Configure company organization and license limits</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCompany} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Company Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pharma Assam Healthcare Pvt Ltd"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PAH-AS"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Corporate Registration No. (CIN)</label>
                  <input
                    type="text"
                    placeholder="e.g. U24239AS2020PTC019842"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GSTIN</label>
                  <input
                    type="text"
                    placeholder="e.g. 18AAACP1234F1Z8"
                    value={gstNo}
                    onChange={(e) => setGstNo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Email *</label>
                  <input
                    type="email"
                    placeholder="e.g. admin@pharmaassam.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 3842 267890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Headquarters City</label>
                  <input
                    type="text"
                    placeholder="e.g. Silchar"
                    value={headquarters}
                    onChange={(e) => setHeadquarters(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State / Territory</label>
                  <input
                    type="text"
                    placeholder="e.g. Assam"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">License Subscription Plan</label>
                  <select
                    value={subscriptionPlan}
                    onChange={(e) => setSubscriptionPlan(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white font-semibold"
                  >
                    <option value="ENTERPRISE">👑 Enterprise (Unlimited Modules + Telemetry)</option>
                    <option value="PRO">⚡ Pro (SFA + HRMS + Orders)</option>
                    <option value="STANDARD">📦 Standard (Doctor Master + DCR)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Field User Seats</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={maxUsers}
                    onChange={(e) => setMaxUsers(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingCompany ? 'Update Tenant' : 'Provision Company'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
