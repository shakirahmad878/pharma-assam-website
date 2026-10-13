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
      <div className="neu-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#F2ECE1] flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#6C5636]/20 border border-[#6C5636]/40 text-[#B99D73] flex items-center justify-center font-bold shadow-neu-sunken">
                <FileText className="w-4 h-4 text-[#B99D73]" />
              </div>
              Daily Call Reports (DCR) Audit & Visits
            </h2>
            <p className="text-xs text-[#857866] mt-1.5">
              Execute planned calls, verify GPS geofences, log sample drops, and track chemist POB orders.
            </p>
          </div>

          <button
            onClick={handleGenericLogVisit}
            className="neu-btn-gold flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Log Doctor DCR Visit
          </button>
        </div>
      </div>

      {/* Planned Visits Queue Banner */}
      {plannedDoctors.length > 0 && (
        <div className="neu-card bg-gradient-to-r from-[#18150f] via-[#14120d] to-[#0c0c09] p-5 border border-[#6C5636]/40 shadow-neu-raised">
          <div className="flex items-center justify-between pb-3.5 border-b border-[#282319] mb-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-[#6C5636]/30 rounded-xl text-[#B99D73] border border-[#B99D73]/30 shadow-neu-sunken">
                <CalendarCheck className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-base text-[#F2ECE1] flex items-center gap-2">
                  Today's Planned Visits Queue
                  <span className="px-2.5 py-0.5 rounded-full bg-[#6C5636] border border-[#B99D73]/50 text-[#F2ECE1] font-bold text-xs shadow-sm">
                    {plannedDoctors.length} Doctors Selected
                  </span>
                </h3>
                <p className="text-xs text-[#857866] mt-0.5">
                  Doctors selected from the directory ready for call execution and geofence check-in.
                </p>
              </div>
            </div>

            {onClearPlannedDoctors && (
              <button
                onClick={onClearPlannedDoctors}
                className="neu-btn text-xs text-[#857866] hover:text-[#F2ECE1] px-3 py-1.5 rounded-xl cursor-pointer"
              >
                Clear Queue
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {plannedDoctors.map((doc) => (
              <div 
                key={doc.id}
                className="p-4 rounded-xl bg-[#0c0c09] border border-[#282319] shadow-neu-sunken flex flex-col justify-between transition-all hover:border-[#6C5636]"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#F2ECE1] flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-[#B99D73]" />
                        {doc.name}
                      </h4>
                      <p className="text-[11px] text-[#B99D73] font-medium mt-0.5">
                        {doc.specialty} • Tier {doc.tier}
                      </p>
                    </div>
                    {onRemovePlannedDoctor && (
                      <button 
                        onClick={() => onRemovePlannedDoctor(doc.id)}
                        title="Remove from queue"
                        className="neu-btn text-[#857866] hover:text-rose-400 p-1.5 rounded-lg cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-[#857866] flex items-center gap-1.5 pt-1">
                    <MapPin className="w-3 h-3 text-[#B99D73] shrink-0" />
                    <span className="truncate">{doc.clinicName || 'Clinic'} {doc.clinicLocation?.address ? `• ${doc.clinicLocation.address}` : ''}</span>
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#282319] flex items-center justify-between">
                  <span className="text-[10px] text-[#857866] font-mono">
                    Target: {doc.monthlyVisitTarget} calls/mo
                  </span>
                  <button
                    onClick={() => handleStartPlannedVisit(doc.id)}
                    className="neu-btn-gold flex items-center gap-1 px-3 py-1.5 rounded-xl text-[#F2ECE1] font-bold text-xs cursor-pointer"
                  >
                    <span>Check-in Call</span>
                    <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submitted Call Logs Audit List */}
      <div className="space-y-3.5">
        <h3 className="font-bold text-sm text-[#B99D73] flex items-center gap-2">
          <span>Logged DCR Calls History</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#181712] border border-[#282319] text-[#B99D73] font-semibold shadow-neu-sunken">
            {dcrLogs.length} Records
          </span>
        </h3>

        {dcrLogs.map((dcr) => (
          <div key={dcr.id} className="neu-card p-5 space-y-3 hover:border-[#6C5636]/60 transition-all duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-[#F2ECE1]">{dcr.clientName}</h3>
                  <Badge variant={dcr.clientType === 'DOCTOR' ? 'primary' : 'neutral'}>
                    {dcr.clientType}
                  </Badge>
                  {dcr.isGeofenceVerified && (
                    <Badge variant="success">
                      <CheckCircle2 className="w-3 h-3" /> Geofence Verified ({dcr.distanceFromClinicMeters}m)
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-[#857866] mt-1">
                  Logged by: <strong className="text-[#F2ECE1]">{dcr.userName}</strong> • Date: <span className="font-mono">{dcr.date}</span>
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-[#181712] border border-[#282319] text-[#B99D73] shadow-neu-sunken">
                  Status: {dcr.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-[#0c0c09] border border-[#282319] shadow-neu-sunken text-xs">
              <div>
                <span className="text-[#857866] block">Check-in / Check-out:</span>
                <span className="font-semibold text-[#F2ECE1]">{dcr.checkInTime} – {dcr.checkOutTime || 'Active'}</span>
              </div>
              <div>
                <span className="text-[#857866] block">Samples Distributed:</span>
                <span className="font-semibold text-[#B99D73]">
                  {dcr.samplesGiven.map((s: { productId: string; quantity: number }) => `${s.quantity} units`).join(', ') || 'None'}
                </span>
              </div>
              <div>
                <span className="text-[#857866] block">Product Order Booking (POB):</span>
                <span className="font-semibold text-[#B99D73]">
                  {dcr.pobAmount ? `₹${dcr.pobAmount.toLocaleString()}` : 'None'}
                </span>
              </div>
            </div>

            {dcr.doctorFeedback && (
              <p className="text-xs text-[#857866] bg-[#181712] p-3 rounded-xl border border-[#282319] shadow-neu-sunken">
                <strong className="text-[#B99D73]">Doctor Feedback:</strong> {dcr.doctorFeedback}
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
