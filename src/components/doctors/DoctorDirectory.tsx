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
  AlertTriangle
} from 'lucide-react';

interface DoctorDirectoryProps {
  doctors: Doctor[];
  currentUser?: User | null;
  onAddDoctor: (doc: Doctor) => void;
  onUpdateDoctor?: (doc: Doctor) => void;
  onDeleteDoctor?: (docId: string) => void;
}

export const DoctorDirectory: React.FC<DoctorDirectoryProps> = ({ 
  doctors, 
  currentUser,
  onAddDoctor, 
  onUpdateDoctor, 
  onDeleteDoctor 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');
  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [deletingDoctorId, setDeletingDoctorId] = useState<Doctor | null>(null);

  // New Doctor Form State
  const [newDocName, setNewDocName] = useState('');
  const [newDocQual, setNewDocQual] = useState('MBBS, MD');
  const [newDocSpecialty, setNewDocSpecialty] = useState<MedicalSpecialty>('Cardiology');
  const [newDocTier, setNewDocTier] = useState<DoctorTier>('A');
  const [newDocClinic, setNewDocClinic] = useState('');
  const [newDocAddress, setNewDocAddress] = useState('');
  const [newDocLat, setNewDocLat] = useState('24.8146');
  const [newDocLng, setNewDocLng] = useState('92.8037');
  const [newDocPhone, setNewDocPhone] = useState('+91 94350 ');
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
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());

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
    setNewDocAddress('');
    setNewDocLat('24.8146');
    setNewDocLng('92.8037');
    setNewDocPhone('+91 94350 ');
    setNewDocHours('10:00 AM - 01:00 PM, 05:00 PM - 08:00 PM');
    setNewDocTarget('2');
    setIsAddModalOpen(true);
  };

  const handleSaveNewDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName || !newDocClinic) return;

    const newDoc: Doctor = {
      id: `doc-${Date.now()}`,
      name: newDocName,
      qualification: newDocQual || 'MBBS, MD',
      specialty: newDocSpecialty,
      tier: newDocTier,
      clinicName: newDocClinic,
      clinicLocation: {
        latitude: parseFloat(newDocLat) || 24.8146,
        longitude: parseFloat(newDocLng) || 92.8037,
        address: newDocAddress || 'Hospital Road, Silchar, Assam',
      },
      geofenceRadiusMeters: 100,
      territoryId: 'terr-cachar-01',
      territoryName: 'Silchar Central & Hospital Road',
      phone: newDocPhone || '+91 94350 00000',
      visitingHours: newDocHours,
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
      name: editForm.name,
      qualification: editForm.qualification,
      specialty: editForm.specialty,
      tier: editForm.tier,
      clinicName: editForm.clinicName,
      clinicLocation: {
        ...editingDoctor.clinicLocation,
        latitude: parseFloat(editForm.latitude) || editingDoctor.clinicLocation.latitude,
        longitude: parseFloat(editForm.longitude) || editingDoctor.clinicLocation.longitude,
        address: editForm.address,
      },
      phone: editForm.phone,
      visitingHours: editForm.visitingHours,
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

  return (
    <div className="space-y-6">
      
      {/* Top Header & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            Doctor Master Directory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Maintain verified healthcare practitioners, clinic geofence coordinates, target call frequency, and full CRUD database management.
          </p>
        </div>

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

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search doctor name, specialty, or clinic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Specialty Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
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

          {/* Tier Filter */}
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="text-xs rounded-xl border border-slate-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">All Tiers</option>
            <option value="A_PLUS">Tier A+ (Key Opinion Leader)</option>
            <option value="A">Tier A (Priority)</option>
            <option value="B">Tier B (Standard)</option>
            <option value="C">Tier C</option>
          </select>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.map((doc) => {
          const tierVariant = doc.tier === 'A_PLUS' ? 'purple' : doc.tier === 'A' ? 'primary' : 'neutral';

          return (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-base text-slate-900">{doc.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">{doc.qualification}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge variant={tierVariant} size="sm">
                      Tier {doc.tier.replace('_', '+')}
                    </Badge>
                  </div>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-teal-700 font-semibold bg-teal-50/70 px-2.5 py-1 rounded-lg border border-teal-100">
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>{doc.specialty}</span>
                  </div>

                  <div className="text-slate-600">
                    <p className="font-semibold text-slate-800">{doc.clinicName}</p>
                    <p className="text-[11px] text-slate-500 flex items-start gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                      <span>{doc.clinicLocation.address}</span>
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {doc.visitingHours}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {doc.phone}</span>
                      <span className="font-mono text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded text-[10px]">
                        Geofence: {doc.geofenceRadiusMeters}m
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Visit Target Meter */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500">Monthly Target</span>
                  <span className="font-bold text-slate-800">
                    {doc.monthlyVisitsCompleted} / {doc.monthlyVisitTarget} Visits
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-teal-600 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (doc.monthlyVisitsCompleted / doc.monthlyVisitTarget) * 100)}%` }}
                  />
                </div>

                {/* Card Action Controls: Edit & Delete */}
                {canModify && (
                  <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleStartEdit(doc)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
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
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Doctor Modal */}
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

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Address</label>
                <input
                  type="text"
                  placeholder="e.g. Hospital Road, Near Civil Hospital, Silchar"
                  value={newDocAddress}
                  onChange={(e) => setNewDocAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">GPS Latitude (Assam)</label>
                  <input
                    type="text"
                    value={newDocLat}
                    onChange={(e) => setNewDocLat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-700"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">GPS Longitude (Assam)</label>
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
                    value={newDocPhone}
                    onChange={(e) => setNewDocPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Monthly Visit Target</label>
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
                  value={newDocHours}
                  onChange={(e) => setNewDocHours(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
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
              Are you sure you want to remove <strong className="text-slate-800">{deletingDoctorId.name}</strong> from the database? This action will remove their profile and territory geofence mapping.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingDoctorId(null)}
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

    </div>
  );
};
