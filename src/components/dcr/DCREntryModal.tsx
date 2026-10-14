import React, { useState } from 'react';
import { Doctor, Product, DCRRecord, User } from '../../types';
import { TelemetryService } from '../../services/telemetryService';
import { OfflineSyncService } from '../../services/offlineSyncService';
import { Stethoscope, CheckCircle2, AlertTriangle, X, Send, MapPin, Pill } from 'lucide-react';

interface DCREntryModalProps {
  doctors: Doctor[];
  products: Product[];
  currentUser: User;
  initialDoctorId?: string;
  onClose: () => void;
  onSubmitDCR: (dcr: DCRRecord) => void;
}

export const DCREntryModal: React.FC<DCREntryModalProps> = ({
  doctors,
  products,
  currentUser,
  initialDoctorId,
  onClose,
  onSubmitDCR,
}) => {
  const safeDoctors = Array.isArray(doctors) ? doctors : [];
  const safeProducts = Array.isArray(products) ? products : [];

  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(initialDoctorId || safeDoctors[0]?.id || '');
  const [checkInTime, setCheckInTime] = useState('09:30 AM');
  const [checkOutTime, setCheckOutTime] = useState('09:55 AM');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([safeProducts[0]?.id || 'prod-01']);
  const [sampleQuantity, setSampleQuantity] = useState(3);
  const [pobAmount, setPobAmount] = useState<string>('0');
  const [doctorFeedback, setDoctorFeedback] = useState('Dr. expressed keen interest in the micro-pelletized formulation.');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('2026-09-22');

  const selectedDoctor = safeDoctors.find(d => d.id === selectedDoctorId) || safeDoctors[0];

  // Live Location Check (Simulate Rep at clinic vs away)
  const repLat = 19.0595;
  const repLng = 72.8294;
  const geofenceCheck = selectedDoctor 
    ? TelemetryService.checkDoctorGeofence(repLat, repLng, selectedDoctor)
    : { isWithin: true, distanceMeters: 12 };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    const record: DCRRecord = {
      id: `dcr-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      doctorOrChemistId: selectedDoctor.id,
      clientType: 'DOCTOR',
      clientName: selectedDoctor.name,
      visitType: 'PLANNED',
      checkInTime,
      checkOutTime,
      checkInLocation: {
        latitude: repLat,
        longitude: repLng,
        address: selectedDoctor.clinicLocation?.address || '',
      },
      isGeofenceVerified: geofenceCheck.isWithin,
      distanceFromClinicMeters: geofenceCheck.distanceMeters,
      productsDiscussed: selectedProductIds,
      samplesGiven: [{ productId: selectedProductIds[0] || 'prod-01', quantity: sampleQuantity }],
      pobAmount: parseFloat(pobAmount) || 0,
      doctorFeedback,
      nextFollowUpDate,
      status: 'SUBMITTED',
    };

    // If offline, save in sync queue
    if (!OfflineSyncService.isOnline()) {
      OfflineSyncService.enqueue('DCR', record);
    }

    onSubmitDCR(record);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090907]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="neu-card max-w-xl w-full p-6 animate-in fade-in zoom-in-95 border border-[#282319] shadow-neu-raised">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#282319]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B99D73]">Field SFA Reporting</span>
            <h3 className="text-base font-bold text-[#F2ECE1] flex items-center gap-1.5 mt-0.5">
              <Stethoscope className="w-4 h-4 text-[#B99D73]" />
              Log Doctor Daily Call Report (DCR)
            </h3>
          </div>
          <button onClick={onClose} className="neu-btn p-1.5 rounded-xl text-[#857866] hover:text-[#F2ECE1]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          
          {/* Doctor Selection */}
          <div>
            <label className="font-semibold text-[#B99D73] block mb-1">Select Doctor</label>
            {safeDoctors.length === 0 ? (
              <p className="text-[#D4BD95] bg-[#1a160d] p-2.5 rounded-lg border border-[#8A7049]/40">
                No doctors registered in the database. Please add a doctor in Doctor Master before logging visits.
              </p>
            ) : (
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="neu-input w-full px-3 py-2 text-xs appearance-none bg-[#0c0c09] cursor-pointer"
              >
                {safeDoctors.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.specialty} - {d.clinicName || 'Clinic'})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Live Geofence Distance Verification Bar */}
          <div className={`p-3.5 rounded-xl border flex items-center justify-between shadow-neu-sunken ${
            geofenceCheck.isWithin 
              ? 'bg-[#101912] border-emerald-900/60 text-emerald-300' 
              : 'bg-[#1a140b] border-amber-900/60 text-amber-300'
          }`}>
            <div className="flex items-center gap-2.5">
              {geofenceCheck.isWithin ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              )}
              <div>
                <span className="font-bold">
                  {geofenceCheck.isWithin ? 'Geofence Validated' : 'Distance Alert'}
                </span>
                <p className="text-[11px] opacity-80 mt-0.5">
                  Current GPS fix is <strong>{geofenceCheck.distanceMeters}m</strong> from clinic (Max Geofence: 100m)
                </p>
              </div>
            </div>
            <span className="font-mono font-bold text-[10px] bg-[#0c0c09] px-2 py-0.5 rounded border border-[#282319]">
              {geofenceCheck.isWithin ? 'VERIFIED' : 'OUTSIDE'}
            </span>
          </div>

          {/* Timings */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#B99D73] block mb-1">Check-in Time</label>
              <input
                type="text"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="neu-input w-full px-3 py-2 text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-[#B99D73] block mb-1">Check-out Time</label>
              <input
                type="text"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                className="neu-input w-full px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>

          {/* Product Discussed & Samples */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-[#B99D73] block mb-1">Product Detailed</label>
              <select
                value={selectedProductIds[0]}
                onChange={(e) => setSelectedProductIds([e.target.value])}
                className="neu-input w-full px-3 py-2 text-xs appearance-none bg-[#0c0c09] cursor-pointer"
              >
                {safeProducts.map(p => (
                  <option key={p.id} value={p.id}>{p.brandName || p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-[#B99D73] block mb-1">Sample Drop (Units)</label>
              <input
                type="number"
                min="0"
                value={sampleQuantity}
                onChange={(e) => setSampleQuantity(parseInt(e.target.value) || 0)}
                className="neu-input w-full px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>

          {/* Doctor Feedback */}
          <div>
            <label className="font-semibold text-[#B99D73] block mb-1">Doctor Remarks & Conversion Potential</label>
            <textarea
              rows={2}
              value={doctorFeedback}
              onChange={(e) => setDoctorFeedback(e.target.value)}
              className="neu-input w-full px-3 py-2 text-xs"
              placeholder="e.g. Dr. Verma committed to prescribing 15 strips this month..."
            />
          </div>

          <div className="pt-3.5 border-t border-[#282319] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="neu-btn px-4 py-2 rounded-xl text-xs text-[#857866] hover:text-[#F2ECE1] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="neu-btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
              Submit DCR Call Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
