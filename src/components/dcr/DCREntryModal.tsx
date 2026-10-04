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
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(initialDoctorId || doctors[0]?.id || '');
  const [checkInTime, setCheckInTime] = useState('09:30 AM');
  const [checkOutTime, setCheckOutTime] = useState('09:55 AM');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([products[0]?.id || '']);
  const [sampleQuantity, setSampleQuantity] = useState(3);
  const [pobAmount, setPobAmount] = useState<string>('0');
  const [doctorFeedback, setDoctorFeedback] = useState('Dr. expressed keen interest in the micro-pelletized formulation.');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('2026-09-22');

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

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
        address: selectedDoctor.clinicLocation.address,
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">Field SFA Reporting</span>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              Log Doctor Daily Call Report (DCR)
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          
          {/* Doctor Selection */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Select Doctor</label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 font-medium focus:ring-1 focus:ring-teal-500 focus:outline-none"
            >
              {doctors.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.specialty} - {d.clinicName})
                </option>
              ))}
            </select>
          </div>

          {/* Live Geofence Distance Verification Bar */}
          <div className={`p-3 rounded-xl border flex items-center justify-between ${
            geofenceCheck.isWithin 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <div className="flex items-center gap-2">
              {geofenceCheck.isWithin ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              )}
              <div>
                <span className="font-bold">
                  {geofenceCheck.isWithin ? 'Geofence Validated' : 'Distance Alert'}
                </span>
                <p className="text-[11px] opacity-80">
                  Current GPS fix is <strong>{geofenceCheck.distanceMeters}m</strong> from clinic (Max Geofence: 100m)
                </p>
              </div>
            </div>
            <span className="font-mono font-bold text-[11px] bg-white/80 px-2 py-0.5 rounded border border-current">
              {geofenceCheck.isWithin ? 'VERIFIED' : 'OUTSIDE'}
            </span>
          </div>

          {/* Timings */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Check-in Time</label>
              <input
                type="text"
                value={checkInTime}
                onChange={(e) => setCheckInTime(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Check-out Time</label>
              <input
                type="text"
                value={checkOutTime}
                onChange={(e) => setCheckOutTime(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Product Discussed & Samples */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Product Detailed</label>
              <select
                value={selectedProductIds[0]}
                onChange={(e) => setSelectedProductIds([e.target.value])}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.brandName || p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Sample Drop (Units)</label>
              <input
                type="number"
                min="0"
                value={sampleQuantity}
                onChange={(e) => setSampleQuantity(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 font-mono"
              />
            </div>
          </div>

          {/* Doctor Feedback */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Doctor Remarks & Conversion Potential</label>
            <textarea
              rows={2}
              value={doctorFeedback}
              onChange={(e) => setDoctorFeedback(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 focus:ring-1 focus:ring-teal-500 focus:outline-none"
              placeholder="e.g. Dr. Verma committed to prescribing 15 strips this month..."
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              Submit DCR Call Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
