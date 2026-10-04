import React, { useState } from 'react';
import { DCRRecord, Doctor, Product, User } from '../../types';
import { Badge } from '../common/Badge';
import { DCREntryModal } from './DCREntryModal';
import { FileText, CheckCircle2, Plus, CalendarCheck, MapPin, Stethoscope, ChevronRight, X } from 'lucide-react';

interface DCRViewProps {
  dcrLogs: DCRRecord[];
  doctors: Doctor[];
  products: Product[];
  currentUser: User;
  plannedDoctorIds?: string[];
  onRemovePlannedDoctor?: (doctorId: string) => void;
  onClearPlannedDoctors?: () => void;
  onAddDCR: (dcr: DCRRecord) => void;
}

export const DCRView: React.FC<DCRViewProps> = ({
  dcrLogs,
  doctors,
  products,
  currentUser,
  plannedDoctorIds = [],
  onRemovePlannedDoctor,
  onClearPlannedDoctors,
  onAddDCR,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInitialDocId, setSelectedInitialDocId] = useState<string | undefined>(undefined);

  const plannedDoctors = doctors.filter(doc => plannedDoctorIds.includes(doc.id));

  const handleStartPlannedVisit = (doctorId: string) => {
    setSelectedInitialDocId(doctorId);
    setIsModalOpen(true);
  };

  const handleGenericLogVisit = () => {
    setSelectedInitialDocId(doctors[0]?.id);
    setIsModalOpen(true);
  };

  const handleSubmitDCR = (dcr: DCRRecord) => {
    onAddDCR(dcr);
    if (dcr.doctorOrChemistId && onRemovePlannedDoctor) {
      onRemovePlannedDoctor(dcr.doctorOrChemistId);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            Daily Call Reports (DCR) Audit & Visits
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Execute planned calls, verify GPS geofences, log sample drops, and track chemist POB orders.
          </p>
        </div>

        <button
          onClick={handleGenericLogVisit}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Log Doctor DCR Visit
        </button>
      </div>

      {/* Planned Visits Queue Banner */}
      {plannedDoctors.length > 0 && (
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-2xl p-5 text-white shadow-lg border border-teal-700/50">
          <div className="flex items-center justify-between pb-3 border-b border-teal-700/60 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-teal-600/40 rounded-lg text-teal-300 border border-teal-500/30">
                <CalendarCheck className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  Today's Planned Visits Queue
                  <span className="px-2 py-0.5 rounded-full bg-teal-500 text-slate-950 font-extrabold text-xs">
                    {plannedDoctors.length} Doctors Selected
                  </span>
                </h3>
                <p className="text-xs text-teal-200/80">
                  Doctors selected from the directory ready for call execution and geofence check-in.
                </p>
              </div>
            </div>

            {onClearPlannedDoctors && (
              <button
                onClick={onClearPlannedDoctors}
                className="text-xs text-teal-300 hover:text-white px-2.5 py-1 rounded bg-teal-800/60 hover:bg-teal-700/60 transition-colors border border-teal-600/40"
              >
                Clear Queue
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {plannedDoctors.map((doc) => (
              <div 
                key={doc.id}
                className="bg-slate-800/80 hover:bg-slate-800 rounded-xl p-3.5 border border-teal-500/30 backdrop-blur flex flex-col justify-between transition-all hover:border-teal-400"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-teal-400" />
                        {doc.name}
                      </h4>
                      <p className="text-[11px] text-teal-300 font-medium">
                        {doc.specialty} • Tier {doc.tier}
                      </p>
                    </div>
                    {onRemovePlannedDoctor && (
                      <button 
                        onClick={() => onRemovePlannedDoctor(doc.id)}
                        title="Remove from queue"
                        className="text-slate-400 hover:text-red-400 p-1 rounded-lg hover:bg-slate-700/60 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 flex items-center gap-1.5 pt-1">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{doc.clinicName || 'Clinic'} {doc.clinicLocation?.address ? `• ${doc.clinicLocation.address}` : ''}</span>
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-700/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Target: {doc.monthlyVisitTarget} calls/mo
                  </span>
                  <button
                    onClick={() => handleStartPlannedVisit(doc.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow transition-all hover:scale-105 active:scale-95"
                  >
                    <span>Check-in Call</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submitted Call Logs Audit List */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-700 flex items-center gap-2">
          <span>Logged DCR Calls History</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
            {dcrLogs.length} Records
          </span>
        </h3>

        {dcrLogs.map((dcr) => (
          <div key={dcr.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900">{dcr.clientName}</h3>
                  <Badge variant={dcr.clientType === 'DOCTOR' ? 'primary' : 'neutral'}>
                    {dcr.clientType}
                  </Badge>
                  {dcr.isGeofenceVerified && (
                    <Badge variant="success">
                      <CheckCircle2 className="w-3 h-3" /> Geofence Verified ({dcr.distanceFromClinicMeters}m)
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Logged by: <strong>{dcr.userName}</strong> • Date: {dcr.date}
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                  Status: {dcr.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block">Check-in / Check-out:</span>
                <span className="font-semibold text-slate-800">{dcr.checkInTime} – {dcr.checkOutTime || 'Active'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Samples Distributed:</span>
                <span className="font-semibold text-teal-700">
                  {dcr.samplesGiven.map((s: { productId: string; quantity: number }) => `${s.quantity} units`).join(', ') || 'None'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Product Order Booking (POB):</span>
                <span className="font-semibold text-blue-700">
                  {dcr.pobAmount ? `₹${dcr.pobAmount.toLocaleString()}` : 'None'}
                </span>
              </div>
            </div>

            {dcr.doctorFeedback && (
              <p className="text-xs text-slate-600 bg-teal-50/50 p-2.5 rounded-lg border border-teal-100">
                <strong>Doctor Feedback:</strong> {dcr.doctorFeedback}
              </p>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <DCREntryModal
          doctors={doctors}
          products={products}
          currentUser={currentUser}
          initialDoctorId={selectedInitialDocId}
          onClose={() => setIsModalOpen(false)}
          onSubmitDCR={handleSubmitDCR}
        />
      )}

    </div>
  );
};
