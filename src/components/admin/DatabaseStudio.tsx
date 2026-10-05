import React, { useState } from 'react';
import { Doctor, Chemist, Product, Territory, Company, User, MedicalSpecialty, DoctorTier, ProductCategory } from '../../types';
import { AuthService } from '../../services/authService';
import { 
  Database, 
  Stethoscope, 
  Store, 
  Pill, 
  Map, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Filter,
  Layers,
  Sparkles,
  MapPin,
  Lock
} from 'lucide-react';

interface DatabaseStudioProps {
  currentUser: User;
  companies: Company[];
  doctors: Doctor[];
  chemists: Chemist[];
  products: Product[];
  territories: Territory[];
  onAddDoctor: (doc: Doctor) => void;
  onUpdateDoctor: (doc: Doctor) => void;
  onDeleteDoctor: (docId: string) => void;
  onAddChemist: (chem: Chemist) => void;
  onUpdateChemist: (chem: Chemist) => void;
  onDeleteChemist: (chemId: string) => void;
  onAddProduct: (prod: Product) => void;
  onUpdateProduct: (prod: Product) => void;
  onDeleteProduct: (prodId: string) => void;
  onAddTerritory: (terr: Territory) => void;
  onUpdateTerritory: (terr: Territory) => void;
  onDeleteTerritory: (terrId: string) => void;
}

type DBTab = 'doctors' | 'chemists' | 'products' | 'territories';

export const DatabaseStudio: React.FC<DatabaseStudioProps> = ({
  currentUser,
  companies,
  doctors,
  chemists,
  products,
  territories,
  onAddDoctor,
  onUpdateDoctor,
  onDeleteDoctor,
  onAddChemist,
  onUpdateChemist,
  onDeleteChemist,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddTerritory,
  onUpdateTerritory,
  onDeleteTerritory,
}) => {
  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';
  const isAdmin = currentUser.role === 'ADMIN';
  const canModifyDB = AuthService.canModifyDatabase(currentUser);

  const [activeTable, setActiveTable] = useState<DBTab>('doctors');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>(
    isSuperAdmin ? 'ALL' : (currentUser.companyId || 'comp-01')
  );

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form State for Doctor
  const [docName, setDocName] = useState('');
  const [docQual, setDocQual] = useState('');
  const [docSpecialty, setDocSpecialty] = useState<MedicalSpecialty>('Cardiology');
  const [docTier, setDocTier] = useState<DoctorTier>('A');
  const [docClinic, setDocClinic] = useState('');
  const [docAddress, setDocAddress] = useState('');
  const [docLat, setDocLat] = useState('24.814674');
  const [docLng, setDocLng] = useState('92.803754');
  const [docGeofence, setDocGeofence] = useState('100');
  const [docPhone, setDocPhone] = useState('');
  const [docTerritoryId, setDocTerritoryId] = useState(territories[0]?.id || '');
  const [docTarget, setDocTarget] = useState('4');

  // Form State for Chemist
  const [chemName, setChemName] = useState('');
  const [chemShop, setChemShop] = useState('');
  const [chemDL, setChemDL] = useState('');
  const [chemGST, setChemGST] = useState('');
  const [chemPhone, setChemPhone] = useState('');
  const [chemAddress, setChemAddress] = useState('');
  const [chemLat, setChemLat] = useState('24.816200');
  const [chemLng, setChemLng] = useState('92.801500');
  const [chemTurnover, setChemTurnover] = useState('450000');
  const [chemTerritoryId, setChemTerritoryId] = useState(territories[0]?.id || '');

  // Form State for Product
  const [prodName, setProdName] = useState('');
  const [prodGeneric, setProdGeneric] = useState('');
  const [prodCategory, setProdCategory] = useState<ProductCategory>('Pharmaceutical Tablets');
  const [prodSegment, setProdSegment] = useState('Cardiology & Metabolic');
  const [prodDosage, setProdDosage] = useState('Tablets');
  const [prodPack, setProdPack] = useState('10x10 Tablets');
  const [prodMRP, setProdMRP] = useState('150.00');
  const [prodPTR, setProdPTR] = useState('120.00');
  const [prodPTS, setProdPTS] = useState('105.00');

  // Form State for Territory
  const [terrName, setTerrName] = useState('');
  const [terrCode, setTerrCode] = useState('');
  const [terrZone, setTerrZone] = useState('Barak Valley Zone');
  const [terrState, setTerrState] = useState('Assam');
  const [terrHQ, setTerrHQ] = useState('Silchar HQ');

  // Scoped Data
  const scopedDoctors = AuthService.getCompanyScopedData(doctors, currentUser, selectedCompanyFilter);
  const scopedChemists = AuthService.getCompanyScopedData(chemists, currentUser, selectedCompanyFilter);
  const scopedProducts = AuthService.getCompanyScopedData(products, currentUser, selectedCompanyFilter);
  const scopedTerritories = AuthService.getCompanyScopedData(territories, currentUser, selectedCompanyFilter);

  // Search filters
  const filteredDoctors = scopedDoctors.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredChemists = scopedChemists.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.drugLicenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = scopedProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.genericComposition.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.therapeuticSegment && p.therapeuticSegment.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredTerritories = scopedTerritories.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.headquarter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingItem(null);
    if (activeTable === 'doctors') {
      setDocName('');
      setDocQual('MBBS, MD');
      setDocSpecialty('Cardiology');
      setDocTier('A');
      setDocClinic('');
      setDocAddress('');
      setDocLat('24.814674');
      setDocLng('92.803754');
      setDocGeofence('100');
      setDocPhone('+91 94350 ');
      setDocTerritoryId(territories[0]?.id || '');
      setDocTarget('4');
    } else if (activeTable === 'chemists') {
      setChemName('');
      setChemShop('');
      setChemDL(`DL-${Math.floor(Math.random() * 89999 + 10000)}/AS`);
      setChemGST(`18AABCS${Math.floor(Math.random() * 8999 + 1000)}D1Z2`);
      setChemPhone('+91 94350 ');
      setChemAddress('');
      setChemLat('24.816200');
      setChemLng('92.801500');
      setChemTurnover('450000');
      setChemTerritoryId(territories[0]?.id || '');
    } else if (activeTable === 'products') {
      setProdName('');
      setProdGeneric('');
      setProdCategory('Pharmaceutical Tablets');
      setProdSegment('Cardiology & Metabolic');
      setProdDosage('Tablets');
      setProdPack('10x10 Tablets');
      setProdMRP('150.00');
      setProdPTR('120.00');
      setProdPTS('105.00');
    } else if (activeTable === 'territories') {
      setTerrName('');
      setTerrCode(`TER-${Math.floor(Math.random() * 89 + 10)}`);
      setTerrZone('Barak Valley Zone');
      setTerrState('Assam');
      setTerrHQ('Silchar HQ');
    }
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    if (activeTable === 'doctors') {
      setDocName(item.name || '');
      setDocQual(item.qualification || '');
      setDocSpecialty(item.specialty || 'Cardiology');
      setDocTier(item.tier || 'A');
      setDocClinic(item.clinicName || '');
      setDocAddress(item.clinicLocation?.address || item.clinicAddress || item.address || '');
      setDocLat(String(item.clinicLocation?.latitude || item.latitude || '24.814674'));
      setDocLng(String(item.clinicLocation?.longitude || item.longitude || '92.803754'));
      setDocGeofence(String(item.geofenceRadiusMeters || '100'));
      setDocPhone(item.phone || '');
      setDocTerritoryId(item.territoryId || territories[0]?.id || '');
      setDocTarget(String(item.monthlyVisitTarget || '4'));
    } else if (activeTable === 'chemists') {
      setChemName(item.name || '');
      setChemShop(item.shopName || '');
      setChemDL(item.drugLicenseNumber || item.dlNumber || '');
      setChemGST(item.gstNumber || '');
      setChemPhone(item.phone || '');
      setChemAddress(item.location?.address || item.address || '');
      setChemLat(String(item.location?.latitude || item.latitude || '24.816200'));
      setChemLng(String(item.location?.longitude || item.longitude || '92.801500'));
      setChemTurnover(String(item.averageMonthlyTurnover || '450000'));
      setChemTerritoryId(item.territoryId || territories[0]?.id || '');
    } else if (activeTable === 'products') {
      setProdName(item.name);
      setProdGeneric(item.genericComposition);
      setProdCategory(item.category);
      setProdSegment(item.therapeuticSegment || 'Cardiology & Metabolic');
      setProdDosage(item.dosageForm);
      setProdPack(item.packSize || '10x10 Tablets');
      setProdMRP(String(item.mrp || 150));
      setProdPTR(String(item.ptr || 120));
      setProdPTS(String(item.pts || 105));
    } else if (activeTable === 'territories') {
      setTerrName(item.name);
      setTerrCode(item.code);
      setTerrZone(item.zone);
      setTerrState(item.state);
      setTerrHQ(item.headquarter);
    }
    setIsModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedTerritory = territories.find(t => t.id === (activeTable === 'doctors' ? docTerritoryId : chemTerritoryId));
    const compId = currentUser.companyId || 'comp-01';
    const compName = currentUser.companyName || 'Pharma Assam Healthcare Pvt Ltd';

    if (activeTable === 'doctors') {
      if (!docName || !docClinic) return;
      if (editingItem) {
        onUpdateDoctor({
          ...editingItem,
          name: docName,
          qualification: docQual,
          specialty: docSpecialty,
          tier: docTier,
          clinicName: docClinic,
          clinicLocation: {
            latitude: parseFloat(docLat) || 24.814674,
            longitude: parseFloat(docLng) || 92.803754,
            address: docAddress,
          },
          geofenceRadiusMeters: parseInt(docGeofence) || 100,
          phone: docPhone,
          territoryId: docTerritoryId,
          territoryName: assignedTerritory?.name || editingItem.territoryName,
          monthlyVisitTarget: parseInt(docTarget) || 4,
        });
      } else {
        onAddDoctor({
          id: `doc-${Date.now()}`,
          name: docName,
          qualification: docQual,
          specialty: docSpecialty,
          tier: docTier,
          clinicName: docClinic,
          clinicLocation: {
            latitude: parseFloat(docLat) || 24.814674,
            longitude: parseFloat(docLng) || 92.803754,
            address: docAddress,
          },
          geofenceRadiusMeters: parseInt(docGeofence) || 100,
          phone: docPhone,
          territoryId: docTerritoryId,
          territoryName: assignedTerritory?.name || 'Silchar Central',
          visitingHours: '10:00 AM - 02:00 PM, 05:00 PM - 08:30 PM',
          preferredVisitDays: ['Mon', 'Wed', 'Fri'],
          averagePatientsPerDay: 40,
          potentialScore: docTier === 'A_PLUS' ? 95 : docTier === 'A' ? 85 : 70,
          monthlyVisitTarget: parseInt(docTarget) || 4,
          monthlyVisitsCompleted: 0,
          companyId: compId,
          companyName: compName,
        });
      }
    } else if (activeTable === 'chemists') {
      if (!chemName || !chemShop) return;
      if (editingItem) {
        onUpdateChemist({
          ...editingItem,
          name: chemName,
          shopName: chemShop,
          drugLicenseNumber: chemDL,
          gstNumber: chemGST,
          phone: chemPhone,
          location: {
            latitude: parseFloat(chemLat) || 24.816200,
            longitude: parseFloat(chemLng) || 92.801500,
            address: chemAddress,
          },
          averageMonthlyTurnover: parseFloat(chemTurnover) || 450000,
          territoryId: chemTerritoryId,
          territoryName: assignedTerritory?.name || editingItem.territoryName,
        });
      } else {
        onAddChemist({
          id: `chem-${Date.now()}`,
          name: chemName,
          shopName: chemShop,
          drugLicenseNumber: chemDL,
          gstNumber: chemGST,
          phone: chemPhone,
          contactPerson: chemName,
          associatedDoctors: ['doc-01', 'doc-02'],
          location: {
            latitude: parseFloat(chemLat) || 24.816200,
            longitude: parseFloat(chemLng) || 92.801500,
            address: chemAddress,
          },
          averageMonthlyTurnover: parseFloat(chemTurnover) || 450000,
          territoryId: chemTerritoryId,
          territoryName: assignedTerritory?.name || 'Silchar Central',
          companyId: compId,
          companyName: compName,
        });
      }
    } else if (activeTable === 'products') {
      if (!prodName || !prodGeneric) return;
      if (editingItem) {
        onUpdateProduct({
          ...editingItem,
          name: prodName,
          brandName: prodName,
          genericComposition: prodGeneric,
          category: prodCategory,
          therapeuticSegment: prodSegment,
          dosageForm: prodDosage,
          packSize: prodPack,
          mrp: parseFloat(prodMRP) || 150,
          ptr: parseFloat(prodPTR) || 120,
          pts: parseFloat(prodPTS) || 105,
        });
      } else {
        onAddProduct({
          id: `prod-${Date.now()}`,
          name: prodName,
          brandName: prodName,
          genericComposition: prodGeneric,
          activeMolecules: prodGeneric.split('+').map(s => s.trim()),
          category: prodCategory,
          therapeuticSegment: prodSegment,
          dosageForm: prodDosage,
          packSize: prodPack,
          mrp: parseFloat(prodMRP) || 150,
          ptr: parseFloat(prodPTR) || 120,
          pts: parseFloat(prodPTS) || 105,
          clinicalHighlights: ['Clinically proven bioavailability', 'High prescription adherence rate'],
          imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop',
          companyId: compId,
          companyName: compName,
        });
      }
    } else if (activeTable === 'territories') {
      if (!terrName || !terrCode) return;
      if (editingItem) {
        onUpdateTerritory({
          ...editingItem,
          name: terrName,
          code: terrCode,
          zone: terrZone,
          state: terrState,
          headquarter: terrHQ,
        });
      } else {
        onAddTerritory({
          id: `terr-${Date.now()}`,
          name: terrName,
          code: terrCode,
          zone: terrZone,
          state: terrState,
          headquarter: terrHQ,
          assignedManagerId: currentUser.id,
          assignedMRIds: [],
          doctorCount: 0,
          chemistCount: 0,
          companyId: compId,
          companyName: compName,
        });
      }
    }

    setIsModalOpen(false);
  };

  const handleExportJSON = () => {
    let exportData: any = {};
    if (activeTable === 'doctors') exportData = filteredDoctors;
    else if (activeTable === 'chemists') exportData = filteredChemists;
    else if (activeTable === 'products') exportData = filteredProducts;
    else if (activeTable === 'territories') exportData = filteredTerritories;

    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reppulse_${activeTable}_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-6 h-6 text-teal-400" />
              <h2 className="text-xl font-bold text-white">Master Database & Entity CRUD Studio</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded">
                {isSuperAdmin ? 'Platform Root DB' : isAdmin ? `Company DB (${currentUser.companyName || 'Pharma Assam'})` : 'Delegated DB Access'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Direct live database operations: Add, Edit, Remove, and Export Doctors, Chemists, Products, and Territory Alignments.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Export Current Table as JSON"
            >
              <Download className="w-3.5 h-3.5 text-teal-400" />
              <span>Export JSON</span>
            </button>

            {canModifyDB && (
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/30 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>
                  Add {activeTable === 'doctors' ? 'Doctor' : activeTable === 'chemists' ? 'Chemist' : activeTable === 'products' ? 'Product' : 'Territory'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* DB Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => setActiveTable('doctors')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTable === 'doctors'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Doctor Master DB ({scopedDoctors.length})</span>
          </button>

          <button
            onClick={() => setActiveTable('chemists')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTable === 'chemists'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Chemists & Stockists ({scopedChemists.length})</span>
          </button>

          <button
            onClick={() => setActiveTable('products')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTable === 'products'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>Product & Price Master ({scopedProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTable('territories')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTable === 'territories'
                ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Territories & HQ Beats ({scopedTerritories.length})</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${activeTable}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
            />
          </div>

          {isSuperAdmin && (
            <select
              value={selectedCompanyFilter}
              onChange={(e) => setSelectedCompanyFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-700"
            >
              <option value="ALL">All Companies</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Live Database synced with RepPulse Field SFA engine
        </div>
      </div>

      {/* Active Table Data Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* DOCTORS TABLE */}
        {activeTable === 'doctors' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Doctor & Qualification</th>
                  <th className="py-3 px-4">Specialty & Tier</th>
                  <th className="py-3 px-4">Clinic & Geofence Coordinates</th>
                  <th className="py-3 px-4">Territory / Beat</th>
                  <th className="py-3 px-4 text-center">Monthly Target</th>
                  <th className="py-3 px-4 text-right">DB Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredDoctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{doc.name}</div>
                      <div className="text-[11px] text-slate-500 font-normal">{doc.qualification}</div>
                      <div className="text-[10px] text-slate-400">{doc.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{doc.specialty}</div>
                      <span className={`inline-block mt-0.5 text-[10px] px-2 py-0.2 rounded-full font-bold ${
                        doc.tier === 'A_PLUS' ? 'bg-purple-100 text-purple-800' :
                        doc.tier === 'A' ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        Tier {doc.tier.replace('_', '+')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{doc.clinicName || 'Clinic'}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                        <span className="font-mono text-[10px]">
                          {(doc.clinicLocation?.latitude || 24.8146).toFixed(4)}, {(doc.clinicLocation?.longitude || 92.8037).toFixed(4)} ({doc.geofenceRadiusMeters || 100}m fence)
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{doc.territoryName || 'Assam Beat'}</div>
                      <div className="text-[10px] text-slate-400">{doc.companyName || 'Pharma Assam'}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">
                        {doc.monthlyVisitTarget || 4} Visits / mo
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {canModifyDB ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(doc)}
                            className="p-1.5 text-slate-600 hover:text-teal-600 hover:bg-slate-100 rounded-lg border border-slate-200"
                            title="Edit Doctor"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove ${doc.name} from the master database?`)) {
                                onDeleteDoctor(doc.id);
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200"
                            title="Delete Doctor"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">View Only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CHEMISTS TABLE */}
        {activeTable === 'chemists' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Pharmacy / Store Name</th>
                  <th className="py-3 px-4">Drug License & GSTIN</th>
                  <th className="py-3 px-4">Contact & Phone</th>
                  <th className="py-3 px-4">Territory / HQ</th>
                  <th className="py-3 px-4 text-right">Est. Monthly Turnover</th>
                  <th className="py-3 px-4 text-right">DB Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredChemists.map((chem) => (
                  <tr key={chem.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{chem.shopName || 'Chemist Store'}</div>
                      <div className="text-[11px] text-slate-500">{chem.location?.address || 'Hospital Road, Silchar'}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <div className="text-slate-800">DL: {chem.drugLicenseNumber}</div>
                      <div className="text-slate-500">GST: {chem.gstNumber}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{chem.name}</div>
                      <div className="text-[11px] text-slate-500">{chem.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{chem.territoryName}</div>
                      <div className="text-[10px] text-slate-400">{chem.companyName || 'Pharma Assam'}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      ₹{(chem.averageMonthlyTurnover || 400000).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {canModifyDB ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(chem)}
                            className="p-1.5 text-slate-600 hover:text-teal-600 hover:bg-slate-100 rounded-lg border border-slate-200"
                            title="Edit Chemist"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove ${chem.shopName}?`)) {
                                onDeleteChemist(chem.id);
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200"
                            title="Delete Chemist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">View Only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PRODUCTS TABLE */}
        {activeTable === 'products' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Brand & Generic Composition</th>
                  <th className="py-3 px-4">Category & Segment</th>
                  <th className="py-3 px-4">Pack Size & Form</th>
                  <th className="py-3 px-4 text-right">MRP (₹)</th>
                  <th className="py-3 px-4 text-right">PTR / PTS (₹)</th>
                  <th className="py-3 px-4 text-right">DB Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{prod.name}</div>
                      <div className="text-[11px] text-slate-500">{prod.genericComposition}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{prod.category}</div>
                      <div className="text-[10px] text-teal-700 font-medium">{prod.therapeuticSegment}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{prod.packSize || '10x10'}</div>
                      <div className="text-[10px] text-slate-400">{prod.dosageForm}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      ₹{prod.mrp?.toFixed(2) || '150.00'}
                    </td>
                    <td className="py-3 px-4 text-right font-medium text-slate-700">
                      <div>PTR: ₹{prod.ptr?.toFixed(2) || '120.00'}</div>
                      <div className="text-[10px] text-slate-500">PTS: ₹{prod.pts?.toFixed(2) || '105.00'}</div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {canModifyDB ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="p-1.5 text-slate-600 hover:text-teal-600 hover:bg-slate-100 rounded-lg border border-slate-200"
                            title="Edit Product"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove ${prod.name}?`)) {
                                onDeleteProduct(prod.id);
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">View Only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TERRITORIES TABLE */}
        {activeTable === 'territories' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Territory Name & Code</th>
                  <th className="py-3 px-4">Zone & State</th>
                  <th className="py-3 px-4">Headquarters</th>
                  <th className="py-3 px-4 text-center">Aligned Doctors & Chemists</th>
                  <th className="py-3 px-4 text-right">DB Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredTerritories.map((terr) => (
                  <tr key={terr.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{terr.name}</div>
                      <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                        {terr.code}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{terr.zone}</div>
                      <div className="text-[11px] text-slate-500">{terr.state}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {terr.headquarter}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-slate-700 font-medium">
                        {terr.doctorCount} Doctors • {terr.chemistCount} Chemists
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {canModifyDB ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(terr)}
                            className="p-1.5 text-slate-600 hover:text-teal-600 hover:bg-slate-100 rounded-lg border border-slate-200"
                            title="Edit Territory"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove territory ${terr.name}?`)) {
                                onDeleteTerritory(terr.id);
                              }
                            }}
                            className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200"
                            title="Delete Territory"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">View Only</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CRUD Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {editingItem ? `Edit ${activeTable.slice(0, -1)} Record` : `Add New ${activeTable.slice(0, -1)} to Database`}
                  </h3>
                  <p className="text-[11px] text-slate-500">Live master database schema synchronization</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-5 space-y-4 text-xs">
              {/* DOCTOR FORM */}
              {activeTable === 'doctors' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Doctor Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Debabrata Dutta"
                        value={docName}
                        onChange={(e) => setDocName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Qualifications</label>
                      <input
                        type="text"
                        placeholder="e.g. MBBS, MD (Medicine)"
                        value={docQual}
                        onChange={(e) => setDocQual(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Medical Specialty</label>
                      <select
                        value={docSpecialty}
                        onChange={(e) => setDocSpecialty(e.target.value as MedicalSpecialty)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-medium"
                      >
                        <option value="Cardiology">Cardiology</option>
                        <option value="Diabetology & Endocrinology">Diabetology & Endocrinology</option>
                        <option value="General Medicine">General Medicine</option>
                        <option value="Gastroenterology">Gastroenterology</option>
                        <option value="Orthopedics">Orthopedics</option>
                        <option value="Pediatrics">Pediatrics</option>
                        <option value="Neurology">Neurology</option>
                        <option value="Dermatology">Dermatology</option>
                        <option value="Pulmonology">Pulmonology</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Target Tier</label>
                      <select
                        value={docTier}
                        onChange={(e) => setDocTier(e.target.value as DoctorTier)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-bold"
                      >
                        <option value="A_PLUS">👑 Tier A+ (Core Key Opinion Leader)</option>
                        <option value="A">⭐ Tier A (High Value Prescriber)</option>
                        <option value="B">🔹 Tier B (Regular Prescriber)</option>
                        <option value="C">🔸 Tier C (Secondary Focus)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Clinic / Hospital Chamber *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Barak Heart Clinic, Rangirkhari Point"
                      value={docClinic}
                      onChange={(e) => setDocClinic(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Latitude</label>
                      <input
                        type="text"
                        placeholder="24.814674"
                        value={docLat}
                        onChange={(e) => setDocLat(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Longitude</label>
                      <input
                        type="text"
                        placeholder="92.803754"
                        value={docLng}
                        onChange={(e) => setDocLng(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Geofence (Meters)</label>
                      <input
                        type="number"
                        value={docGeofence}
                        onChange={(e) => setDocGeofence(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Territory Alignment</label>
                      <select
                        value={docTerritoryId}
                        onChange={(e) => setDocTerritoryId(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-medium"
                      >
                        {territories.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Monthly Visit Target</label>
                      <input
                        type="number"
                        min="1"
                        max="8"
                        value={docTarget}
                        onChange={(e) => setDocTarget(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none font-bold"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* CHEMIST FORM */}
              {activeTable === 'chemists' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Pharmacy / Shop Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. LifeCare Medicos"
                        value={chemShop}
                        onChange={(e) => setChemShop(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Proprietor / Contact Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Biplab Roy"
                        value={chemName}
                        onChange={(e) => setChemName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Drug License Number</label>
                      <input
                        type="text"
                        placeholder="e.g. DL-20B-3498/AS"
                        value={chemDL}
                        onChange={(e) => setChemDL(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">GSTIN</label>
                      <input
                        type="text"
                        placeholder="e.g. 18AABCS9876Q1Z3"
                        value={chemGST}
                        onChange={(e) => setChemGST(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="text"
                        placeholder="e.g. +91 94350 12345"
                        value={chemPhone}
                        onChange={(e) => setChemPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Est. Monthly Turnover (₹)</label>
                      <input
                        type="number"
                        value={chemTurnover}
                        onChange={(e) => setChemTurnover(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Territory Alignment</label>
                    <select
                      value={chemTerritoryId}
                      onChange={(e) => setChemTerritoryId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white font-medium"
                    >
                      {territories.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* PRODUCT FORM */}
              {activeTable === 'products' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Brand Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. CardioPulse-AM"
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Generic Composition *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Telmisartan 40mg + Amlodipine 5mg"
                        value={prodGeneric}
                        onChange={(e) => setProdGeneric(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Therapeutic Segment</label>
                      <input
                        type="text"
                        placeholder="e.g. Cardiology & Metabolic"
                        value={prodSegment}
                        onChange={(e) => setProdSegment(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Pack Size</label>
                      <input
                        type="text"
                        placeholder="e.g. 10x10 Tablets"
                        value={prodPack}
                        onChange={(e) => setProdPack(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">MRP (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={prodMRP}
                        onChange={(e) => setProdMRP(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">PTR (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={prodPTR}
                        onChange={(e) => setProdPTR(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">PTS (₹)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={prodPTS}
                        onChange={(e) => setProdPTS(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none font-bold"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* TERRITORY FORM */}
              {activeTable === 'territories' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Territory Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Silchar Central & Hospital Road"
                        value={terrName}
                        onChange={(e) => setTerrName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Territory Code *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. SIL-01"
                        value={terrCode}
                        onChange={(e) => setTerrCode(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Zone</label>
                      <input
                        type="text"
                        value={terrZone}
                        onChange={(e) => setTerrZone(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Headquarters</label>
                      <input
                        type="text"
                        value={terrHQ}
                        onChange={(e) => setTerrHQ(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">State</label>
                      <input
                        type="text"
                        value={terrState}
                        onChange={(e) => setTerrState(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingItem ? 'Update Database Record' : 'Save to Master DB'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
