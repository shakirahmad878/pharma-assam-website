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
    if (!doc) return false;
    const matchesSearch = 
      (doc.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.clinicName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.specialty || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      Boolean(doc.clinicLocation?.address && doc.clinicLocation.address.toLowerCase().includes(searchTerm.toLowerCase()));

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
      name: doc.name || '',
      qualification: doc.qualification || '',
      specialty: doc.specialty || 'Cardiology',
      tier: doc.tier || 'A',
      clinicName: doc.clinicName || '',
      address: doc.clinicLocation?.address || '',
      latitude: (doc.clinicLocation?.latitude || 24.8146).toString(),
      longitude: (doc.clinicLocation?.longitude || 92.8037).toString(),
      phone: doc.phone || '',
      visitingHours: doc.visitingHours || '',
      monthlyVisitTarget: doc.monthlyVisitTarget || 2,
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
        ...(editingDoctor.clinicLocation || {}),
        latitude: parseFloat(editForm.latitude) || editingDoctor.clinicLocation?.latitude || 24.8146,
        longitude: parseFloat(editForm.longitude) || editingDoctor.clinicLocation?.longitude || 92.8037,
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
      <div className="neu-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#6C5636]/20 text-[#B99D73] border border-[#6C5636]/40 flex items-center justify-center font-bold shadow-neu-sunken">
                <Stethoscope className="w-5 h-5 text-[#B99D73]" />
              </div>
              <h2 className="text-xl font-bold text-[#F2ECE1] tracking-tight">
                Doctor Master Directory
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#181712] text-[#B99D73] border border-[#282319] shadow-neu-sunken">
                {doctors.length} Doctors
              </span>
            </div>
            <p className="text-xs text-[#857866] mt-1.5">
              Maintain doctors, update clinics & geofences, and select doctors to queue into your <strong className="text-[#B99D73]">Daily Call Visits (DCR)</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {canModify && (
              <button
                onClick={handleOpenAdd}
                className="neu-btn-gold flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Add New Doctor
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Daily Visit Planning Banner (When doctors are queued or selected) */}
      {(plannedVisitDoctorIds.length > 0 || selectedDoctorIds.length > 0) && (
        <div className="neu-card bg-gradient-to-r from-[#18150f] via-[#14120d] to-[#0c0c09] p-4.5 border border-[#6C5636]/40 shadow-neu-raised flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6C5636]/30 text-[#B99D73] flex items-center justify-center border border-[#B99D73]/30 shadow-neu-sunken">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#F2ECE1] flex items-center gap-2">
                <span>Today's Planned Visits Queue</span>
                <span className="bg-[#6C5636] text-[#F2ECE1] border border-[#B99D73]/50 font-bold px-2.5 py-0.5 rounded-full text-xs shadow-sm">
                  {plannedVisitDoctorIds.length} Queued
                </span>
              </h3>
              <p className="text-xs text-[#857866] mt-0.5">
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
                className="neu-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[#B99D73] text-xs font-bold cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add {selectedDoctorIds.length} to Today's Visit</span>
              </button>
            )}

            {onNavigateToVisits && (
              <button
                onClick={onNavigateToVisits}
                className="neu-btn-gold flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                <span>Go to Visits Tab (DCR)</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filters & Batch Selection Bar */}
      <div className="neu-card p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#857866] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search doctor name, clinic, address, or specialty..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="neu-input w-full pl-10 pr-3 py-2 text-xs"
          />
        </div>

        {/* Filters & Selection Trigger */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          <button
            type="button"
            onClick={handleSelectAllFiltered}
            className="neu-btn text-xs px-3 py-2 rounded-xl text-[#F2ECE1] cursor-pointer"
          >
            {selectedDoctorIds.length === filteredDoctors.length && filteredDoctors.length > 0
              ? 'Deselect All'
              : `Select All (${filteredDoctors.length})`}
          </button>

          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="neu-input text-xs px-3 py-2 cursor-pointer appearance-none bg-[#0c0c09]"
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
            className="neu-input text-xs px-3 py-2 cursor-pointer appearance-none bg-[#0c0c09]"
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
              className={`neu-card p-5 flex flex-col justify-between relative group transition-all duration-200 ${
                isPlanned 
                  ? 'border-[#B99D73] ring-1 ring-[#B99D73]/40 shadow-neu-gold' 
                  : isSelected
                  ? 'border-[#6C5636] ring-1 ring-[#6C5636]/50'
                  : 'hover:border-[#6C5636]/60'
              }`}
            >
              <div>
                {/* Card Top: Checkbox, Name, Tier */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Batch Selection Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelectDoctor(doc.id)}
                      className="mt-1 w-4 h-4 rounded bg-[#0c0c09] border-[#282319] text-[#B99D73] focus:ring-[#B99D73] cursor-pointer accent-[#6C5636]"
                      title="Select doctor to add to today's visit queue"
                    />

                    <div className="cursor-pointer" onClick={() => setViewingDoctor(doc)}>
                      <h3 className="font-bold text-base text-[#F2ECE1] hover:text-[#B99D73] transition-colors">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-[#857866] font-medium">{doc.qualification}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Badge variant={tierVariant} size="sm">
                      Tier {doc.tier.replace('_', '+')}
                    </Badge>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="mt-3.5 space-y-2.5 text-xs">
                  <div className="flex items-center gap-2 text-[#B99D73] font-semibold bg-[#181712] px-2.5 py-1.5 rounded-xl border border-[#282319] shadow-neu-sunken">
                    <Stethoscope className="w-3.5 h-3.5 text-[#B99D73]" />
                    <span>{doc.specialty}</span>
                  </div>

                  <div className="text-[#857866]">
                    <p className="font-semibold text-[#F2ECE1]">{doc.clinicName || 'Clinic'}</p>
                    {doc.clinicLocation?.address ? (
                      <p className="text-[11px] text-[#857866] flex items-start gap-1.5 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#B99D73] shrink-0 mt-0.5" />
                        <span>{doc.clinicLocation.address}</span>
                      </p>
                    ) : (
                      <p className="text-[11px] text-[#857866]/60 italic mt-0.5">No specific clinic address recorded</p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[#282319]/80 text-[11px] text-[#857866] space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-[#B99D73]" /> {doc.visitingHours || 'Flexible Call Time'}</span>
                    </div>
                    {doc.phone && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-[#B99D73]" /> {doc.phone}</span>
                        <span className="font-mono text-[#B99D73] bg-[#181712] border border-[#282319] px-2 py-0.5 rounded text-[10px] shadow-neu-sunken">
                          Geofence: {doc.geofenceRadiusMeters || 100}m
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Add to Visit, Edit, Delete */}
              <div className="mt-4 pt-3.5 border-t border-[#282319] space-y-2.5">
                
                {/* "Add to Visit" Button */}
                <button
                  type="button"
                  onClick={() => onTogglePlanVisit && onTogglePlanVisit(doc.id)}
                  className={`w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isPlanned
                      ? 'neu-btn-gold text-[#F2ECE1] shadow-neu-gold'
                      : 'neu-btn text-[#B99D73] hover:text-[#F2ECE1]'
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
                      <CalendarCheck className="w-4 h-4 text-[#B99D73]" />
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
                      className="text-[11px] font-semibold text-[#857866] hover:text-[#B99D73] transition-colors cursor-pointer"
                    >
                      View Profile
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(doc)}
                        className="neu-btn flex items-center gap-1 px-2.5 py-1 text-xs text-[#F2ECE1] cursor-pointer"
                        title="Edit Doctor Details"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#B99D73]" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingDoctorId(doc)}
                        className="neu-btn flex items-center gap-1 px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 border-rose-950/40 cursor-pointer"
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

      {/* Add Doctor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#090907]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="neu-card max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 border border-[#282319] shadow-neu-raised">
            <div className="flex items-center justify-between pb-3 border-b border-[#282319]">
              <h3 className="font-bold text-base text-[#F2ECE1] flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#6C5636]/20 border border-[#6C5636]/40 flex items-center justify-center">
                  <Plus className="w-4 h-4 text-[#B99D73]" />
                </div>
                Add New Doctor to Directory
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="neu-btn p-1.5 rounded-xl text-[#857866] hover:text-[#F2ECE1]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewDoctor} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#B99D73] block mb-1">Doctor Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Kothari"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="neu-input w-full px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-[#B99D73] block mb-1">Qualifications</label>
                <input
                  type="text"
                  placeholder="e.g. MBBS, MD (Medicine), DM (Cardio)"
                  value={newDocQual}
                  onChange={(e) => setNewDocQual(e.target.value)}
                  className="neu-input w-full px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#B99D73] block mb-1">Specialty</label>
                  <select
                    value={newDocSpecialty}
                    onChange={(e) => setNewDocSpecialty(e.target.value as MedicalSpecialty)}
                    className="neu-input w-full px-3 py-2 text-xs cursor-pointer appearance-none bg-[#0c0c09]"
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
                  <label className="font-semibold text-[#B99D73] block mb-1">Tier Rating</label>
                  <select
                    value={newDocTier}
                    onChange={(e) => setNewDocTier(e.target.value as DoctorTier)}
                    className="neu-input w-full px-3 py-2 text-xs cursor-pointer appearance-none bg-[#0c0c09]"
                  >
                    <option value="A_PLUS">Tier A+ (Key Opinion Leader)</option>
                    <option value="A">Tier A (High Potential)</option>
                    <option value="B">Tier B (Regular)</option>
                    <option value="C">Tier C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#B99D73] block mb-1">Clinic / Hospital Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kothari Heart & Diabetes Care"
                  value={newDocClinic}
                  onChange={(e) => setNewDocClinic(e.target.value)}
                  className="neu-input w-full px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-[#B99D73] block mb-1">Clinic Address</label>
                <input
                  type="text"
                  placeholder="Enter full clinic address, road name, landmark..."
                  value={newDocAddress}
                  onChange={(e) => setNewDocAddress(e.target.value)}
                  className="neu-input w-full px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#B99D73] block mb-1">GPS Latitude (PostGIS)</label>
                  <input
                    type="text"
                    value={newDocLat}
                    onChange={(e) => setNewDocLat(e.target.value)}
                    className="neu-input w-full px-3 py-2 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#B99D73] block mb-1">GPS Longitude (PostGIS)</label>
                  <input
                    type="text"
                    value={newDocLng}
                    onChange={(e) => setNewDocLng(e.target.value)}
                    className="neu-input w-full px-3 py-2 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#B99D73] block mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 94350 12345"
                    value={newDocPhone}
                    onChange={(e) => setNewDocPhone(e.target.value)}
                    className="neu-input w-full px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#B99D73] block mb-1">Monthly Target Visits</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newDocTarget}
                    onChange={(e) => setNewDocTarget(e.target.value)}
                    className="neu-input w-full px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#B99D73] block mb-1">Visiting Hours</label>
                <input
                  type="text"
                  placeholder="e.g. 10:00 AM - 01:00 PM, 05:00 PM - 08:00 PM"
                  value={newDocHours}
                  onChange={(e) => setNewDocHours(e.target.value)}
                  className="neu-input w-full px-3 py-2 text-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-[#282319]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="neu-btn px-4 py-2 rounded-xl text-xs text-[#857866] hover:text-[#F2ECE1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neu-btn-gold px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-[#090907]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="neu-card max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 border border-[#282319] shadow-neu-raised">
            <div className="flex items-center justify-between pb-3 border-b border-[#282319]">
              <h3 className="font-bold text-base text-[#F2ECE1] flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#6C5636]/20 border border-[#6C5636]/40 flex items-center justify-center">
                  <Edit2 className="w-4 h-4 text-[#B99D73]" />
                </div>
                Edit Doctor: {editingDoctor.name}
              </h3>
              <button onClick={() => setEditingDoctor(null)} className="neu-btn p-1.5 rounded-xl text-[#857866] hover:text-[#F2ECE1]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-[#B99D73] block mb-1">Doctor Name *</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="neu-input w-full px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-[#B99D73] block mb-1">Qualifications</label>
                <input
                  type="text"
                  value={editForm.qualification}
                  onChange={(e) => setEditForm({ ...editForm, qualification: e.target.value })}
                  className="neu-input w-full px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#B99D73] block mb-1">Specialty</label>
                  <select
                    value={editForm.specialty}
                    onChange={(e) => setEditForm({ ...editForm, specialty: e.target.value as MedicalSpecialty })}
                    className="neu-input w-full px-3 py-2 text-xs cursor-pointer appearance-none bg-[#0c0c09]"
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
                  <label className="font-semibold text-[#B99D73] block mb-1">Tier Rating</label>
                  <select
                    value={editForm.tier}
                    onChange={(e) => setEditForm({ ...editForm, tier: e.target.value as DoctorTier })}
                    className="neu-input w-full px-3 py-2 text-xs cursor-pointer appearance-none bg-[#0c0c09]"
                  >
                    <option value="A_PLUS">Tier A+ (Key Opinion Leader)</option>
                    <option value="A">Tier A (High Potential)</option>
                    <option value="B">Tier B (Regular)</option>
                    <option value="C">Tier C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#B99D73] block mb-1">Clinic / Hospital Name *</label>
                <input
                  type="text"
                  required
                  value={editForm.clinicName}
                  onChange={(e) => setEditForm({ ...editForm, clinicName: e.target.value })}
                  className="neu-input w-full px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-[#B99D73] block mb-1">Clinic Address</label>
                <input
                  type="text"
                  placeholder="Enter clinic address..."
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="neu-input w-full px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#B99D73] block mb-1">GPS Latitude</label>
                  <input
                    type="text"
                    value={editForm.latitude}
                    onChange={(e) => setEditForm({ ...editForm, latitude: e.target.value })}
                    className="neu-input w-full px-3 py-2 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#B99D73] block mb-1">GPS Longitude</label>
                  <input
                    type="text"
                    value={editForm.longitude}
                    onChange={(e) => setEditForm({ ...editForm, longitude: e.target.value })}
                    className="neu-input w-full px-3 py-2 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#B99D73] block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="neu-input w-full px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#B99D73] block mb-1">Monthly Target Visits</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={editForm.monthlyVisitTarget}
                    onChange={(e) => setEditForm({ ...editForm, monthlyVisitTarget: parseInt(e.target.value, 10) || 2 })}
                    className="neu-input w-full px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#B99D73] block mb-1">Visiting Hours</label>
                <input
                  type="text"
                  value={editForm.visitingHours}
                  onChange={(e) => setEditForm({ ...editForm, visitingHours: e.target.value })}
                  className="neu-input w-full px-3 py-2 text-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-[#282319]">
                <button
                  type="button"
                  onClick={() => setEditingDoctor(null)}
                  className="neu-btn px-4 py-2 rounded-xl text-xs text-[#857866] hover:text-[#F2ECE1] cursor-pointer"
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

      {/* View Doctor Profile Modal */}
      {viewingDoctor && (
        <div className="fixed inset-0 z-50 bg-[#090907]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="neu-card max-w-md w-full p-6 animate-in fade-in zoom-in-95 border border-[#282319] shadow-neu-raised">
            <div className="flex items-center justify-between pb-3 border-b border-[#282319]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#6C5636]/20 border border-[#6C5636]/40 text-[#B99D73] flex items-center justify-center font-bold shadow-neu-sunken">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#F2ECE1]">{viewingDoctor.name}</h3>
                  <p className="text-xs text-[#857866]">{viewingDoctor.qualification}</p>
                </div>
              </div>
              <button onClick={() => setViewingDoctor(null)} className="neu-btn p-1.5 rounded-xl text-[#857866] hover:text-[#F2ECE1]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3.5 bg-[#0c0c09] rounded-xl border border-[#282319] shadow-neu-sunken space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#857866]">Specialty:</span>
                  <span className="font-bold text-[#B99D73]">{viewingDoctor.specialty}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#857866]">Tier Category:</span>
                  <Badge variant={viewingDoctor.tier === 'A_PLUS' ? 'purple' : 'primary'} size="sm">
                    Tier {viewingDoctor.tier.replace('_', '+')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#857866]">Clinic / Hospital:</span>
                  <span className="font-semibold text-[#F2ECE1]">{viewingDoctor.clinicName}</span>
                </div>
                {viewingDoctor.clinicLocation?.address && (
                  <div>
                    <span className="text-[#857866] block mb-0.5">Address:</span>
                    <span className="text-[#F2ECE1]">{viewingDoctor.clinicLocation.address}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1 border-t border-[#282319]">
                  <span className="text-[#857866]">Visiting Hours:</span>
                  <span className="font-semibold text-[#F2ECE1]">{viewingDoctor.visitingHours}</span>
                </div>
                {viewingDoctor.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#857866]">Contact Phone:</span>
                    <span className="font-semibold text-[#F2ECE1]">{viewingDoctor.phone}</span>
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
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs cursor-pointer ${
                    plannedVisitDoctorIds.includes(viewingDoctor.id)
                      ? 'neu-btn text-[#857866] hover:text-[#F2ECE1]'
                      : 'neu-btn-gold text-[#F2ECE1]'
                  }`}
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
        <div className="fixed inset-0 z-50 bg-[#090907]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="neu-card max-w-sm w-full p-6 animate-in fade-in zoom-in-95 border border-[#282319] shadow-neu-raised">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/40 border border-rose-800/40 text-rose-400 flex items-center justify-center mx-auto mb-4 shadow-neu-sunken">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h3 className="text-base font-bold text-center text-[#F2ECE1]">
              Delete Doctor Record?
            </h3>
            <p className="text-xs text-[#857866] text-center mt-2 leading-relaxed">
              Are you sure you want to remove <strong className="text-[#F2ECE1]">{deletingDoctorId.name}</strong> from the database?
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingDoctorId(null)}
                className="neu-btn flex-1 py-2.5 rounded-xl text-xs text-[#857866] hover:text-[#F2ECE1] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-800 to-rose-700 hover:from-rose-700 hover:to-rose-600 border border-rose-500/30 text-white text-xs font-bold shadow-md cursor-pointer"
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
