import React, { useState } from 'react';
import { Doctor, MedicalSpecialty, DoctorTier, User } from '../../types';
import { Badge } from '../common/Badge';
import { 
  Stethoscope, 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Phone, 
  Clock, 
  X,
  Edit2,
  Trash2,
  AlertTriangle,
  CalendarCheck,
  Check,
  ArrowRight,
  UserCheck,
  Building2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';

interface DoctorDirectoryProps {
  doctors: Doctor[];
  currentUser?: User | null;
  plannedVisitDoctorIds?: string[];
  onTogglePlanVisit?: (doctorId: string) => void;
  onBatchAddPlannedVisits?: (doctorIds: string[]) => void;
  onNavigateToVisits?: () => void;
  onAddDoctor: (doc: Doctor) => void;
  onUpdateDoctor?: (doc: Doctor) => void;
  onDeleteDoctor?: (docId: string) => void;
}

export const DoctorDirectory: React.FC<DoctorDirectoryProps> = ({ 
  doctors, 
  currentUser,
  plannedVisitDoctorIds = [],
  onTogglePlanVisit,
  onBatchAddPlannedVisits,
  onNavigateToVisits,
  onAddDoctor, 
  onUpdateDoctor, 
  onDeleteDoctor 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  
  // Selection state for batch "Add to Visit"
  const [selectedDoctorIds, setSelectedDoctorIds] = useState<string[]>([]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [deletingDoctorId, setDeletingDoctorId] = useState<Doctor | null>(null);
  const [viewingDoctor, setViewingDoctor] = useState<Doctor | null>(null);

  // New Doctor Form State (No hardcoded address!)
  const [newDocName, setNewDocName] = useState('');
  const [newDocQual, setNewDocQual] = useState('MBBS, MD');
  const [newDocSpecialty, setNewDocSpecialty] = useState<MedicalSpecialty>('Cardiology');
  const [newDocTier, setNewDocTier] = useState<DoctorTier>('A');
  const [newDocClinic, setNewDocClinic] = useState('');
  const [newDocAddress, setNewDocAddress] = useState('');
  const [newDocLat, setNewDocLat] = useState('24.8146');
  const [newDocLng, setNewDocLng] = useState('92.8037');
  const [newDocPhone, setNewDocPhone] = useState('');
  const [newDocHours, setNewDocHours] = useState('10:00 AM - 01:00 PM, 05:00 PM - 08:00 PM');
  const [newDocTarget, setNewDocTarget] = useState('2');

  // Edit Doctor Form State
  const [editForm, setEditForm] = useState<{
    name: string;
    qualification: string;
    specialty: MedicalSpecialty;
    tier: DoctorTier;
    clinicName: string;
    address: string;
    latitude: string;
    longitude: string;
    phone: string;
    visitingHours: string;
    monthlyVisitTarget: number;
    geofenceRadiusMeters: number;
  }>({
    name: '',
    qualification: '',
    specialty: 'Cardiology',
    tier: 'A',
    clinicName: '',
    address: '',
    latitude: '',
    longitude: '',
    phone: '',
    visitingHours: '',
    monthlyVisitTarget: 2,
    geofenceRadiusMeters: 100
  });

  const canModify = !currentUser || currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN' || currentUser.role === 'MANAGER' || !!currentUser.permissions?.canModifyDatabase;

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.clinicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.clinicLocation.address && doc.clinicLocation.address.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSpecialty = selectedSpecialty === 'ALL' || doc.specialty === selectedSpecialty;
    const matchesTier = selectedTier === 'ALL' || doc.tier === selectedTier;

    return matchesSearch && matchesSpecialty && matchesTier;
  });

  const handleOpenAdd = () => {
    setNewDocName('');
    setNewDocQual('MBBS, MD');
    setNewDocSpecialty('Cardiology');
    setNewDocTier('A');
    setNewDocClinic('');
    setNewDocAddress(''); // Empty address
    setNewDocLat('24.8146');
    setNewDocLng('92.8037');
    setNewDocPhone('');
    setNewDocHours('10:00 AM - 01:00 PM, 05:00 PM - 08:00 PM');
    setNewDocTarget('2');
    setIsAddModalOpen(true);
  };

  const handleSaveNewDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim() || !newDocClinic.trim()) return;

    const newDoc: Doctor = {
      id: `doc-${Date.now()}`,
      name: newDocName.trim(),
      qualification: newDocQual.trim() || 'MBBS, MD',
      specialty: newDocSpecialty,
      tier: newDocTier,
      clinicName: newDocClinic.trim(),
      clinicLocation: {
        latitude: parseFloat(newDocLat) || 24.8146,
        longitude: parseFloat(newDocLng) || 92.8037,
        address: newDocAddress.trim(), // Exact address entered by user
      },
      geofenceRadiusMeters: 100,
      territoryId: 'terr-cachar-01',
      territoryName: 'Silchar Central & Cachar',
      phone: newDocPhone.trim() || '+91 94350 00000',
      visitingHours: newDocHours.trim() || '10:00 AM - 01:00 PM',
      preferredVisitDays: ['Mon', 'Wed', 'Fri'],
      averagePatientsPerDay: 35,
      potentialScore: 85,
      monthlyVisitTarget: parseInt(newDocTarget, 10) || (newDocTier === 'A_PLUS' ? 3 : 2),
      monthlyVisitsCompleted: 0,
    };

    onAddDoctor(newDoc);
    setIsAddModalOpen(false);
  };

  const handleStartEdit = (doc: Doctor) => {
    setEditingDoctor(doc);
    setEditForm({
      name: doc.name,
      qualification: doc.qualification,
      specialty: doc.specialty,
      tier: doc.tier,
      clinicName: doc.clinicName,
      address: doc.clinicLocation.address || '',
      latitude: doc.clinicLocation.latitude.toString(),
      longitude: doc.clinicLocation.longitude.toString(),
      phone: doc.phone,
      visitingHours: doc.visitingHours,
      monthlyVisitTarget: doc.monthlyVisitTarget,
      geofenceRadiusMeters: doc.geofenceRadiusMeters || 100
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor || !onUpdateDoctor) return;

    const updated: Doctor = {
      ...editingDoctor,
      name: editForm.name.trim(),
      qualification: editForm.qualification.trim(),
      specialty: editForm.specialty,
      tier: editForm.tier,
      clinicName: editForm.clinicName.trim(),
      clinicLocation: {
        ...editingDoctor.clinicLocation,
        latitude: parseFloat(editForm.latitude) || editingDoctor.clinicLocation.latitude,
        longitude: parseFloat(editForm.longitude) || editingDoctor.clinicLocation.longitude,
        address: editForm.address.trim(),
      },
      phone: editForm.phone.trim(),
      visitingHours: editForm.visitingHours.trim(),
      monthlyVisitTarget: Number(editForm.monthlyVisitTarget) || editingDoctor.monthlyVisitTarget,
      geofenceRadiusMeters: Number(editForm.geofenceRadiusMeters) || 100,
    };

    onUpdateDoctor(updated);
    setEditingDoctor(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingDoctorId && onDeleteDoctor) {
      onDeleteDoctor(deletingDoctorId.id);
      setDeletingDoctorId(null);
    }
  };

  // Toggle selection for batch add to visit
  const handleToggleSelectDoctor = (id: string) => {
    setSelectedDoctorIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    if (selectedDoctorIds.length === filteredDoctors.length) {
      setSelectedDoctorIds([]);
    } else {
      setSelectedDoctorIds(filteredDoctors.map(d => d.id));
    }
  };

  const handleBatchAddToVisit = () => {
    if (selectedDoctorIds.length === 0) return;
    if (onBatchAddPlannedVisits) {
      onBatchAddPlannedVisits(selectedDoctorIds);
    } else if (onTogglePlanVisit) {
      selectedDoctorIds.forEach(id => {
        if (!plannedVisitDoctorIds.includes(id)) {
          onTogglePlanVisit(id);
        }
      });
    }
    setSelectedDoctorIds([]);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Master Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Doctor Master Directory
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              {doctors.length} Doctors
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Maintain doctors, update clinics & geofences, and select doctors to queue into your <strong>Daily Call Visits (DCR)</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {canModify && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-md shadow-teal-600/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add New Doctor
            </button>
          )}
        </div>
      </div>

      {/* Daily Visit Planning Banner (When doctors are queued or selected) */}
      {(plannedVisitDoctorIds.length > 0 || selectedDoctorIds.length > 0) && (
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 text-white p-4 rounded-2xl border border-teal-500/30 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/40">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>Today's Planned Visits Queue</span>
                <span className="bg-teal-500 text-slate-950 font-black px-2 py-0.5 rounded-full text-xs">
                  {plannedVisitDoctorIds.length} Queued
                </span>
              </h3>
              <p className="text-xs text-teal-200/80 mt-0.5">
                {selectedDoctorIds.length > 0 
                  ? `${selectedDoctorIds.length} doctor(s) selected to add into your today's call plan.`
                  : 'Doctors queued here are ready for check-in & call logging in the Visits tab.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            {selectedDoctorIds.length > 0 && (
              <button
                onClick={handleBatchAddToVisit}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add {selectedDoctorIds.length} to Today's Visit</span>
              </button>
            )}

            {onNavigateToVisits && (
              <button
                onClick={onNavigateToVisits}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black transition-all shadow-md cursor-pointer"
              >
                <span>Go to Visits Tab (DCR)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filters & Batch Selection Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search doctor name, clinic, address, or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Filters & Selection Trigger */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <button
            type="button"
            onClick={handleSelectAllFiltered}
            className="text-xs font-semibold px-2.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
          >
            {selectedDoctorIds.length === filteredDoctors.length && filteredDoctors.length > 0
              ? 'Deselect All'
              : `Select All (${filteredDoctors.length})`}
          </button>

          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">All Specialties</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Diabetology & Endocrinology">Diabetology & Endocrinology</option>
            <option value="Orthopedics">Orthopedics</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Neurology">Neurology</option>
            <option value="General Medicine">General Medicine</option>
          </select>

          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">All Tiers</option>
            <option value="A_PLUS">Tier A+ (Key Opinion Leader)</option>
            <option value="A">Tier A (High Potential)</option>
            <option value="B">Tier B (Regular)</option>
            <option value="C">Tier C</option>
          </select>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.map((doc) => {
          const tierVariant = doc.tier === 'A_PLUS' ? 'purple' : doc.tier === 'A' ? 'primary' : 'neutral';
          const isPlanned = plannedVisitDoctorIds.includes(doc.id);
          const isSelected = selectedDoctorIds.includes(doc.id);

          return (
            <div
              key={doc.id}
              className={`bg-white rounded-2xl border transition-all flex flex-col justify-between p-5 relative group ${
                isPlanned 
                  ? 'border-teal-500 ring-2 ring-teal-500/20 shadow-md bg-teal-50/10' 
                  : isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/10'
                  : 'border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              <div>
                {/* Card Top: Checkbox, Name, Tier */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 flex-1">
                    {/* Batch Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelectDoctor(doc.id)}
                      className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300 cursor-pointer"
                      title="Select doctor to add to today's visit queue"
                    />

                    <div className="cursor-pointer" onClick={() => setViewingDoctor(doc)}>
                      <h3 className="font-bold text-base text-slate-900 hover:text-teal-600 transition-colors">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{doc.qualification}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Badge variant={tierVariant} size="sm">
                      Tier {doc.tier.replace('_', '+')}
                    </Badge>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-teal-700 font-semibold bg-teal-50/70 px-2.5 py-1 rounded-lg border border-teal-100">
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>{doc.specialty}</span>
                  </div>

                  <div className="text-slate-600">
                    <p className="font-semibold text-slate-800">{doc.clinicName}</p>
                    {doc.clinicLocation.address ? (
                      <p className="text-[11px] text-slate-500 flex items-start gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                        <span>{doc.clinicLocation.address}</span>
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic mt-0.5">No specific clinic address recorded</p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {doc.visitingHours || 'Flexible Call Time'}</span>
                    </div>
                    {doc.phone && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {doc.phone}</span>
                        <span className="font-mono text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded text-[10px]">
                          Geofence: {doc.geofenceRadiusMeters || 100}m
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Add to Visit, Edit, Delete */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                
                {/* "Add to Visit" Button (Workflow Fix) */}
                <button
                  type="button"
                  onClick={() => onTogglePlanVisit && onTogglePlanVisit(doc.id)}
                  className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                    isPlanned
                      ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-teal-600/20'
                      : 'bg-slate-900 hover:bg-teal-600 text-white shadow-slate-900/20'
                  }`}
                  title={isPlanned ? 'Doctor is in today visit plan. Click to remove.' : 'Queue this doctor for today visit call.'}
                >
                  {isPlanned ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>✓ In Today's Visit Plan</span>
                    </>
                  ) : (
                    <>
                      <CalendarCheck className="w-4 h-4" />
                      <span>+ Add to Visit</span>
                    </>
                  )}
                </button>

                {/* Edit & Delete Controls for Admins/Managers */}
                {canModify && (
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setViewingDoctor(doc)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-800"
                    >
                      View Profile
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(doc)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                        title="Edit Doctor Details"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-teal-600" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingDoctorId(doc)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                        title="Delete Doctor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Doctor Modal (No hardcoded address glitch!) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-600" />
                Add New Doctor to Directory
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewDoctor} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Doctor Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Kothari"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Qualifications</label>
                <input
                  type="text"
                  placeholder="e.g. MBBS, MD (Medicine), DM (Cardio)"
                  value={newDocQual}
                  onChange={(e) => setNewDocQual(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Specialty</label>
                  <select
                    value={newDocSpecialty}
                    onChange={(e) => setNewDocSpecialty(e.target.value as MedicalSpecialty)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Diabetology & Endocrinology">Diabetology & Endocrinology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Neurology">Neurology</option>
                    <option value="General Medicine">General Medicine</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tier Rating</label>
                  <select
                    value={newDocTier}
                    onChange={(e) => setNewDocTier(e.target.value as DoctorTier)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                  >
                    <option value="A_PLUS">Tier A+ (Key Opinion Leader)</option>
                    <option value="A">Tier A (High Potential)</option>
                    <option value="B">Tier B (Regular)</option>
                    <option value="C">Tier C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Clinic / Hospital Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kothari Heart & Diabetes Care"
                  value={newDocClinic}
                  onChange={(e) => setNewDocClinic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              {/* Address Field: Clean, with no hardcoded pre-fill */}
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Clinic Address</label>
                <input
                  type="text"
                  placeholder="Enter full clinic address, road name, landmark..."
                  value={newDocAddress}
                  onChange={(e) => setNewDocAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">GPS Latitude (PostGIS)</label>
                  <input
                    type="text"
                    value={newDocLat}
                    onChange={(e) => setNewDocLat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">GPS Longitude (PostGIS)</label>
                  <input
                    type="text"
                    value={newDocLng}
                    onChange={(e) => setNewDocLng(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 94350 12345"
                    value={newDocPhone}
                    onChange={(e) => setNewDocPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Monthly Target Visits</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newDocTarget}
                    onChange={(e) => setNewDocTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Visiting Hours</label>
                <input
                  type="text"
                  placeholder="e.g. 10:00 AM - 01:00 PM, 05:00 PM - 08:00 PM"
                  value={newDocHours}
                  onChange={(e) => setNewDocHours(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-600/20 cursor-pointer"
                >
                  Save Doctor Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Doctor Modal */}
      {editingDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-teal-600" />
                Edit Doctor: {editingDoctor.name}
              </h3>
              <button onClick={() => setEditingDoctor(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Doctor Name *</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Qualifications</label>
                <input
                  type="text"
                  value={editForm.qualification}
                  onChange={(e) => setEditForm({ ...editForm, qualification: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Specialty</label>
                  <select
                    value={editForm.specialty}
                    onChange={(e) => setEditForm({ ...editForm, specialty: e.target.value as MedicalSpecialty })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Diabetology & Endocrinology">Diabetology & Endocrinology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Neurology">Neurology</option>
                    <option value="General Medicine">General Medicine</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tier Rating</label>
                  <select
                    value={editForm.tier}
                    onChange={(e) => setEditForm({ ...editForm, tier: e.target.value as DoctorTier })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                  >
                    <option value="A_PLUS">Tier A+ (Key Opinion Leader)</option>
                    <option value="A">Tier A (High Potential)</option>
                    <option value="B">Tier B (Regular)</option>
                    <option value="C">Tier C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Clinic / Hospital Name *</label>
                <input
                  type="text"
                  required
                  value={editForm.clinicName}
                  onChange={(e) => setEditForm({ ...editForm, clinicName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Clinic Address</label>
                <input
                  type="text"
                  placeholder="Enter clinic address..."
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">GPS Latitude</label>
                  <input
                    type="text"
                    value={editForm.latitude}
                    onChange={(e) => setEditForm({ ...editForm, latitude: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">GPS Longitude</label>
                  <input
                    type="text"
                    value={editForm.longitude}
                    onChange={(e) => setEditForm({ ...editForm, longitude: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Monthly Target Visits</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editForm.monthlyVisitTarget}
                    onChange={(e) => setEditForm({ ...editForm, monthlyVisitTarget: parseInt(e.target.value, 10) || 2 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Visiting Hours</label>
                <input
                  type="text"
                  value={editForm.visitingHours}
                  onChange={(e) => setEditForm({ ...editForm, visitingHours: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingDoctor(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-600/20 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Doctor Profile Modal */}
      {viewingDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">{viewingDoctor.name}</h3>
                  <p className="text-xs text-slate-500">{viewingDoctor.qualification}</p>
                </div>
              </div>
              <button onClick={() => setViewingDoctor(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Specialty:</span>
                  <span className="font-bold text-teal-700">{viewingDoctor.specialty}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Tier Category:</span>
                  <Badge variant={viewingDoctor.tier === 'A_PLUS' ? 'purple' : 'primary'} size="sm">
                    Tier {viewingDoctor.tier.replace('_', '+')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Clinic / Hospital:</span>
                  <span className="font-semibold text-slate-800">{viewingDoctor.clinicName}</span>
                </div>
                {viewingDoctor.clinicLocation.address && (
                  <div>
                    <span className="text-slate-500 block mb-0.5">Address:</span>
                    <span className="text-slate-700">{viewingDoctor.clinicLocation.address}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <span className="text-slate-500">Visiting Hours:</span>
                  <span className="font-semibold text-slate-800">{viewingDoctor.visitingHours}</span>
                </div>
                {viewingDoctor.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Contact Phone:</span>
                    <span className="font-semibold text-slate-800">{viewingDoctor.phone}</span>
                  </div>
                )}
              </div>

              {/* Action */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onTogglePlanVisit) onTogglePlanVisit(viewingDoctor.id);
                    setViewingDoctor(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20"
                >
                  {plannedVisitDoctorIds.includes(viewingDoctor.id) ? 'Remove from Visit Plan' : '+ Add to Today\'s Visit Plan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingDoctorId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h3 className="text-base font-bold text-center text-slate-900">
              Delete Doctor Record?
            </h3>
            <p className="text-xs text-slate-500 text-center mt-2 leading-relaxed">
              Are you sure you want to remove <strong className="text-slate-800">{deletingDoctorId.name}</strong> from the database?
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingDoctorId(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 cursor-pointer"
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
