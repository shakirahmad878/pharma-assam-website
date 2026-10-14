import React, { useState } from 'react';
import { Company, User } from '../../types';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Users, 
  Stethoscope, 
  Store, 
  MapPin, 
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
  companies = [],
  currentUser,
  onAddCompany,
  onUpdateCompany,
  onDeleteCompany,
  onSelectActiveCompany,
  selectedCompanyId,
}) => {
  const safeCompanies = Array.isArray(companies) ? companies : [];

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

  const filteredCompanies = safeCompanies.filter(c =>
    c && (
      (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.code && c.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.headquarters && c.headquarters.toLowerCase().includes(searchTerm.toLowerCase()))
    )
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
        registrationNumber: regNo,
        gstNumber: gstNo,
        contactEmail: email,
        contactPhone: phone,
        headquarters,
        state,
        subscriptionPlan,
        maxUsers,
      };
      onUpdateCompany(updated);
    } else {
      const newComp: Company = {
        id: `comp-${Date.now().toString().slice(-4)}`,
        name,
        code: code.toUpperCase(),
        registrationNumber: regNo,
        gstNumber: gstNo,
        contactEmail: email,
        contactPhone: phone,
        headquarters,
        state,
        status: 'ACTIVE',
        subscriptionPlan,
        maxUsers,
        activeUsersCount: 1,
        activeDoctorsCount: 0,
        activeChemistsCount: 0,
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
      <div className="neu-card p-6 border border-[#282319] shadow-neu-raised">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#6C5636]/20 border border-[#6C5636]/40 text-[#B99D73] flex items-center justify-center font-bold shadow-neu-sunken">
                <Building2 className="w-5 h-5 text-[#B99D73]" />
              </div>
              <h2 className="text-xl font-bold text-[#F2ECE1]">Multi-Tenant Company Management</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-[#181712] text-[#B99D73] border border-[#282319] px-2.5 py-0.5 rounded-full shadow-neu-sunken">
                Super Admin Exclusive
              </span>
            </div>
            <p className="text-xs text-[#857866] mt-1.5">
              Configure and provision isolated enterprise tenant organizations, manage license tiers, seat limits, and company status.
            </p>
          </div>
          
          <button
            onClick={handleOpenAddModal}
            className="neu-btn-gold flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add New Pharma Company</span>
          </button>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-[#282319] text-xs">
          <div className="bg-[#0c0c09] p-3 rounded-xl border border-[#282319] shadow-neu-sunken">
            <span className="text-[#857866]">Total Companies</span>
            <p className="text-lg font-bold text-[#F2ECE1] mt-0.5">{safeCompanies.length}</p>
          </div>
          <div className="bg-[#0c0c09] p-3 rounded-xl border border-[#282319] shadow-neu-sunken">
            <span className="text-[#857866]">Active Tenants</span>
            <p className="text-lg font-bold text-[#A6C48A] mt-0.5">
              {safeCompanies.filter(c => c.status === 'ACTIVE').length}
            </p>
          </div>
          <div className="bg-[#0c0c09] p-3 rounded-xl border border-[#282319] shadow-neu-sunken">
            <span className="text-[#857866]">Total Provisioned Seats</span>
            <p className="text-lg font-bold text-[#B99D73] mt-0.5">
              {safeCompanies.reduce((acc, c) => acc + (c.maxUsers || 0), 0)} Seats
            </p>
          </div>
          <div className="bg-[#0c0c09] p-3 rounded-xl border border-[#282319] shadow-neu-sunken">
            <span className="text-[#857866]">Active Field Personnel</span>
            <p className="text-lg font-bold text-[#D4BD95] mt-0.5">
              {safeCompanies.reduce((acc, c) => acc + (c.activeUsersCount || 0), 0)} Users
            </p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#857866]" />
          <input
            type="text"
            placeholder="Search company by name, code or HQ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="neu-input w-full pl-10 pr-3 py-2 text-xs"
          />
        </div>
        <div className="text-xs text-[#857866] font-medium">
          Showing {filteredCompanies.length} of {safeCompanies.length} tenant organizations
        </div>
      </div>

      {/* Companies Grid Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredCompanies.map((company) => {
          const isSelected = selectedCompanyId === company.id;

          return (
            <div
              key={company.id}
              className={`neu-card border p-5 transition-all flex flex-col justify-between ${
                isSelected 
                  ? 'border-[#6C5636] ring-1 ring-[#B99D73]/30 shadow-neu-gold' 
                  : 'border-[#282319] hover:border-[#6C5636]/60'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#6C5636]/20 border border-[#6C5636]/40 flex items-center justify-center text-[#B99D73] font-bold text-sm shadow-neu-sunken">
                      {company.code.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#F2ECE1]">{company.name}</h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#181712] text-[#B99D73] border border-[#282319] shadow-neu-sunken">
                          {company.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#857866] mt-0.5">
                        <MapPin className="w-3 h-3 text-[#B99D73]" />
                        <span>{company.headquarters}, {company.state}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      company.status === 'ACTIVE' 
                        ? 'bg-[#101912] text-[#A6C48A] border border-[#384D2B]/60' 
                        : 'bg-[#1c0f0f] text-[#E08A8A] border border-[#662B2B]/60'
                    }`}>
                      {company.status}
                    </span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-[#181712] text-[#B99D73] border border-[#282319]">
                      {company.subscriptionPlan}
                    </span>
                  </div>
                </div>

                {/* Company Details & Stats */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-3 bg-[#0c0c09] rounded-xl border border-[#282319] text-center shadow-neu-sunken">
                  <div>
                    <span className="text-[10px] text-[#857866] block font-medium">Field MRs & Staff</span>
                    <span className="text-xs font-bold text-[#F2ECE1] flex items-center justify-center gap-1 mt-0.5">
                      <Users className="w-3 h-3 text-[#B99D73]" />
                      {company.activeUsersCount} / {company.maxUsers}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#857866] block font-medium">Mapped Doctors</span>
                    <span className="text-xs font-bold text-[#F2ECE1] flex items-center justify-center gap-1 mt-0.5">
                      <Stethoscope className="w-3 h-3 text-[#B99D73]" />
                      {company.activeDoctorsCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#857866] block font-medium">Chemists</span>
                    <span className="text-xs font-bold text-[#F2ECE1] flex items-center justify-center gap-1 mt-0.5">
                      <Store className="w-3 h-3 text-[#D4BD95]" />
                      {company.activeChemistsCount}
                    </span>
                  </div>
                </div>

                {/* Meta details */}
                <div className="mt-3.5 space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#857866]">GST Registration:</span>
                    <span className="font-mono font-medium text-[#F2ECE1]">{company.gstNumber}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#857866]">Corporate Email:</span>
                    <span className="font-medium text-[#F2ECE1]">{company.contactEmail}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#857866]">Tenant Created:</span>
                    <span className="text-[#857866]">{company.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3.5 border-t border-[#282319] flex items-center justify-between gap-2">
                {onSelectActiveCompany && (
                  <button
                    onClick={() => onSelectActiveCompany(company.id)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#181712] text-[#B99D73] border-[#6C5636] font-bold shadow-neu-sunken'
                        : 'neu-btn text-[#857866] hover:text-[#F2ECE1]'
                    }`}
                  >
                    {isSelected ? '✓ Filtered Company' : 'Scope Admin View'}
                  </button>
                )}

                <div className="flex items-center gap-1.5 ml-auto">
                  <button
                    onClick={() => handleToggleStatus(company)}
                    className={`text-xs font-medium px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                      company.status === 'ACTIVE'
                        ? 'neu-btn text-amber-400 border-amber-900/60'
                        : 'neu-btn text-emerald-400 border-emerald-900/60'
                    }`}
                    title="Toggle Active / Suspended status"
                  >
                    {company.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleOpenEditModal(company)}
                    className="neu-btn p-1.5 rounded-xl text-[#857866] hover:text-[#B99D73] cursor-pointer"
                    title="Edit Company Details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  {safeCompanies.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to remove ${company.name}? This will delete all tenant mappings.`)) {
                          onDeleteCompany(company.id);
                        }
                      }}
                      className="neu-btn p-1.5 rounded-xl text-rose-400 hover:text-rose-300 border-rose-900/60 cursor-pointer"
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
        <div className="fixed inset-0 bg-[#090907]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="neu-card border border-[#282319] rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-neu-raised animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-[#282319] flex items-center justify-between sticky top-0 bg-[#11110e] z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#6C5636]/20 border border-[#6C5636]/40 flex items-center justify-center text-[#B99D73] shadow-neu-sunken">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-[#F2ECE1] text-sm">
                    {editingCompany ? 'Edit Pharma Company Tenant' : 'Provision New Pharma Company Tenant'}
                  </h3>
                  <p className="text-[11px] text-[#857866]">Configure company organization and license limits</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="neu-btn p-1.5 rounded-xl text-[#857866] hover:text-[#F2ECE1]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCompany} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#B99D73] mb-1">Company Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pharma Assam Healthcare Pvt Ltd"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="neu-input w-full px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#B99D73] mb-1">Company Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PAH-AS"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="neu-input w-full px-3 py-2 uppercase font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#B99D73] mb-1">Corporate Registration No. (CIN)</label>
                  <input
                    type="text"
                    placeholder="e.g. U24239AS2020PTC019842"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                    className="neu-input w-full px-3 py-2 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#B99D73] mb-1">GSTIN</label>
                  <input
                    type="text"
                    placeholder="e.g. 18AAACP1234F1Z8"
                    value={gstNo}
                    onChange={(e) => setGstNo(e.target.value)}
                    className="neu-input w-full px-3 py-2 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#B99D73] mb-1">Contact Email *</label>
                  <input
                    type="email"
                    placeholder="e.g. admin@pharmaassam.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="neu-input w-full px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#B99D73] mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 3842 267890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="neu-input w-full px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#B99D73] mb-1">Headquarters City</label>
                  <input
                    type="text"
                    placeholder="e.g. Silchar"
                    value={headquarters}
                    onChange={(e) => setHeadquarters(e.target.value)}
                    className="neu-input w-full px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#B99D73] mb-1">State / Territory</label>
                  <input
                    type="text"
                    placeholder="e.g. Assam"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="neu-input w-full px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-[#282319]">
                <div>
                  <label className="block font-semibold text-[#B99D73] mb-1">License Subscription Plan</label>
                  <select
                    value={subscriptionPlan}
                    onChange={(e) => setSubscriptionPlan(e.target.value as any)}
                    className="neu-input w-full px-3 py-2 bg-[#0c0c09] cursor-pointer font-semibold"
                  >
                    <option value="ENTERPRISE">👑 Enterprise (Unlimited Modules + Telemetry)</option>
                    <option value="PRO">⚡ Pro (SFA + HRMS + Orders)</option>
                    <option value="STANDARD">📦 Standard (Doctor Master + DCR)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#B99D73] mb-1">Max Field User Seats</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={maxUsers}
                    onChange={(e) => setMaxUsers(Number(e.target.value))}
                    className="neu-input w-full px-3 py-2 font-bold font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#282319] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="neu-btn px-4 py-2 rounded-xl text-[#857866] hover:text-[#F2ECE1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neu-btn-gold px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
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
