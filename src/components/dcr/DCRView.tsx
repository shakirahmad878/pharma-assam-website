import React, { useState } from 'react';
import { DCRRecord, Doctor, Product, User } from '../../types';
import { Badge } from '../common/Badge';
import { DCREntryModal } from './DCREntryModal';
import { FileText, CheckCircle2, Plus, CalendarCheck, MapPin, Stethoscope, ChevronRight, X, AlertCircle } from 'lucide-react';

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
  dcrLogs = [],
  doctors = [],
  products = [],
  currentUser,
  plannedDoctorIds = [],
  onRemovePlannedDoctor,
  onClearPlannedDoctors,
  onAddDCR,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInitialDocId, setSelectedInitialDocId] = useState<string | undefined>(undefined);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const safeDcrLogs = Array.isArray(dcrLogs) ? dcrLogs : [];
  const safeDoctors = Array.isArray(doctors) ? doctors : [];
  const safeProducts = Array.isArray(products) ? products : [];
  const safePlannedIds = Array.isArray(plannedDoctorIds) ? plannedDoctorIds : [];

  const plannedDoctors = safeDoctors.filter(doc => doc && safePlannedIds.includes(doc.id));

  const handleStartPlannedVisit = (doctorId: string) => {
    setSelectedInitialDocId(doctorId);
    setIsModalOpen(true);
  };

  const handleGenericLogVisit = () => {
    if (safeDoctors.length === 0) {
      alert("No doctors available in the Doctor Master directory. Please add a doctor in the Doctor Master tab first, or wait for the database to sync.");
      return;
    }
    setSelectedInitialDocId(safeDoctors[0]?.id);
    setIsModalOpen(true);
  };

  const handleSubmitDCR = (dcr: DCRRecord) => {
    onAddDCR(dcr);
    if (dcr.doctorOrChemistId && onRemovePlannedDoctor) {
      onRemovePlannedDoctor(dcr.doctorOrChemistId);
    }
    setFeedbackToast(`Successfully recorded DCR call for ${dcr.clientName}!`);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {feedbackToast && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between shadow-xs animate-in fade-in duration-200 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">{feedbackToast}</span>
          </div>
          <button onClick={() => setFeedbackToast(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl border border-[#DCE4EB] p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#10243A] flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center font-bold shadow-2xs">
                <FileText className="w-4 h-4 text-[#18A6A6]" />
              </div>
              Daily Call Reports (DCR) Audit & Visits
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Execute planned calls, verify GPS geofences, log sample drops, and track chemist POB orders.
            </p>
          </div>

          <button
            onClick={handleGenericLogVisit}
            className="bg-[#10243A] hover:bg-[#182F49] text-white flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#18A6A6]" />
            Log Doctor DCR Visit
          </button>
        </div>
      </div>

      {/* Planned Visits Queue Banner */}
      {plannedDoctors.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-teal-200 shadow-2xs">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#DCE4EB] mb-4">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-teal-50 rounded-xl text-[#18A6A6] border border-teal-200">
                <CalendarCheck className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-base text-[#10243A] flex items-center gap-2">
                  Today's Planned Visits Queue
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-[#137F83] font-bold text-xs">
                    {plannedDoctors.length} Doctors Selected
                  </span>
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Doctors selected from the directory ready for call execution and geofence check-in.
                </p>
              </div>
            </div>

            {onClearPlannedDoctors && (
              <button
                onClick={onClearPlannedDoctors}
                className="text-xs text-[#64748B] hover:text-[#10243A] bg-[#F1F6F8] px-3 py-1.5 rounded-lg border border-[#DCE4EB] cursor-pointer"
              >
                Clear Queue
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {plannedDoctors.map((doc) => (
              <div 
                key={doc.id}
                className="p-4 rounded-xl bg-[#F5F8FA] border border-[#DCE4EB] flex flex-col justify-between transition-all hover:border-[#18A6A6]"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#10243A] flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-[#18A6A6]" />
                        {doc.name}
                      </h4>
                      <p className="text-[11px] text-[#64748B] font-medium mt-0.5">
                        {doc.specialty} • Tier {doc.tier}
                      </p>
                    </div>
                    {onRemovePlannedDoctor && (
                      <button 
                        onClick={() => onRemovePlannedDoctor(doc.id)}
                        title="Remove from queue"
                        className="text-[#94A3B8] hover:text-rose-600 p-1 rounded-lg cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-[#64748B] flex items-center gap-1.5 pt-1">
                    <MapPin className="w-3 h-3 text-[#18A6A6] shrink-0" />
                    <span className="truncate">{doc.clinicName || 'Clinic'} {doc.clinicLocation?.address ? `• ${doc.clinicLocation.address}` : ''}</span>
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#DCE4EB] flex items-center justify-between">
                  <span className="text-[10px] text-[#64748B] font-mono">
                    Target: {doc.monthlyVisitTarget} calls/mo
                  </span>
                  <button
                    onClick={() => handleStartPlannedVisit(doc.id)}
                    className="bg-[#18A6A6] hover:bg-[#137F83] text-white flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
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
      <div className="space-y-3.5">
        <h3 className="font-bold text-sm text-[#10243A] flex items-center gap-2">
          <span>Logged DCR Calls History</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8EEF4] border border-[#DCE4EB] text-[#10243A] font-semibold">
            {safeDcrLogs.length} Records
          </span>
        </h3>

        {safeDcrLogs.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-[#DCE4EB] space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 text-[#18A6A6] flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-[#10243A]">No DCR Visits Logged Yet</h4>
            <p className="text-xs text-[#64748B] max-w-md mx-auto">
              Your Daily Call Report log is currently empty. Click "Log Doctor DCR Visit" above or select a doctor from the Doctor Master directory to start recording field activities.
            </p>
            <button
              onClick={handleGenericLogVisit}
              className="bg-[#10243A] hover:bg-[#182F49] text-white px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2 mt-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#18A6A6]" />
              Log First DCR Visit
            </button>
          </div>
        ) : (
          safeDcrLogs.map((dcr) => (
            <div key={dcr.id || Math.random().toString()} className="bg-white rounded-xl border border-[#DCE4EB] p-5 space-y-3 hover:border-[#18A6A6] transition-all shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-[#10243A]">{dcr.clientName || 'Doctor Visit'}</h3>
                    <Badge variant={dcr.clientType === 'DOCTOR' ? 'primary' : 'neutral'}>
                      {dcr.clientType || 'DOCTOR'}
                    </Badge>
                    {dcr.isGeofenceVerified && (
                      <Badge variant="success">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Geofence Verified ({dcr.distanceFromClinicMeters ?? 0}m)
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">
                    Logged by: <strong className="text-[#10243A]">{dcr.userName || currentUser?.name || 'Field MR'}</strong> • Date: <span className="font-mono">{dcr.date || 'Today'}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#F1F6F8] border border-[#DCE4EB] text-[#10243A]">
                    Status: {dcr.status || 'SUBMITTED'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#F5F8FA] border border-[#DCE4EB] text-xs">
                <div>
                  <span className="text-[#64748B] block">Check-in / Check-out:</span>
                  <span className="font-semibold text-[#10243A]">{dcr.checkInTime || '--'} – {dcr.checkOutTime || 'Active'}</span>
                </div>
                <div>
                  <span className="text-[#64748B] block">Samples Distributed:</span>
                  <span className="font-semibold text-[#18A6A6]">
                    {Array.isArray(dcr.samplesGiven) && dcr.samplesGiven.length > 0
                      ? dcr.samplesGiven.map((s: { productId: string; quantity: number }) => `${s?.quantity ?? 0} units`).join(', ')
                      : 'None'}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block">Product Order Booking (POB):</span>
                  <span className="font-semibold text-[#10243A]">
                    {dcr.pobAmount != null ? `₹${Number(dcr.pobAmount).toLocaleString()}` : 'None'}
                  </span>
                </div>
              </div>

              {dcr.doctorFeedback && (
                <p className="text-xs text-[#64748B] bg-[#F1F6F8] p-3 rounded-xl border border-[#DCE4EB]">
                  <strong className="text-[#10243A]">Doctor Feedback:</strong> {dcr.doctorFeedback}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <DCREntryModal
          doctors={safeDoctors}
          products={safeProducts}
          currentUser={currentUser}
          initialDoctorId={selectedInitialDocId}
          onClose={() => setIsModalOpen(false)}
          onSubmitDCR={handleSubmitDCR}
        />
      )}

    </div>
  );
};
