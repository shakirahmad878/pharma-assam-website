import React, { useState } from 'react';
import { TourPlanItem, Doctor, Chemist, User } from '../../types';
import { Badge } from '../common/Badge';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Stethoscope, 
  Store,
  X,
  Send
} from 'lucide-react';

interface TourPlannerProps {
  tourPlans: TourPlanItem[];
  doctors: Doctor[];
  chemists: Chemist[];
  currentUser: User;
  onAddTourPlan: (tp: TourPlanItem) => void;
  onUpdateStatus: (id: string, newStatus: 'APPROVED' | 'REJECTED', comments?: string) => void;
}

export const TourPlanner: React.FC<TourPlannerProps> = ({
  tourPlans = [],
  doctors = [],
  chemists = [],
  currentUser,
  onAddTourPlan,
  onUpdateStatus,
}) => {
  const isManager = currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'AREA_MANAGER' || currentUser.role === 'REGIONAL_MANAGER' || currentUser.role === 'MANAGER';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planDate, setPlanDate] = useState(new Date().toISOString().split('T')[0]);
  const [routeTitle, setRouteTitle] = useState('Hospital Road & Rangirkhari Beat');
  const [selectedDoctorIds, setSelectedDoctorIds] = useState<string[]>([]);
  const [selectedChemistIds] = useState<string[]>([]);

  const safeTourPlans = Array.isArray(tourPlans) ? tourPlans : [];
  const safeDoctors = Array.isArray(doctors) ? doctors : [];
  const safeChemists = Array.isArray(chemists) ? chemists : [];

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDoctorIds.length === 0) {
      alert('Please select at least 1 doctor for the tour plan.');
      return;
    }

    const newPlan: TourPlanItem = {
      id: `tp-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      date: planDate,
      territoryId: currentUser.territoryId || 'terr-01',
      territoryName: currentUser.territoryName || 'Assam Regional HQ',
      routeTitle,
      plannedDoctorsCount: selectedDoctorIds.length,
      plannedChemistsCount: selectedChemistIds.length,
      doctorIds: selectedDoctorIds,
      chemistIds: selectedChemistIds,
      status: 'PENDING_APPROVAL',
    };

    onAddTourPlan(newPlan);
    setIsModalOpen(false);
  };

  const toggleDoctorSelection = (docId: string) => {
    setSelectedDoctorIds(prev => 
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="neu-card p-5 border border-[#282319] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#F2ECE1] flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#6C5636]/20 border border-[#6C5636]/40 text-[#B99D73] flex items-center justify-center font-bold shadow-neu-sunken">
              <CalendarIcon className="w-4 h-4 text-[#B99D73]" />
            </div>
            Tour Planning (TP) & Route Scheduler
          </h2>
          <p className="text-xs text-[#857866] mt-1">
            Build weekly doctor routes, schedule clinic meetings, and manage Area Sales Manager (ASM) approvals.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="neu-btn-gold flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Create New Tour Plan
        </button>
      </div>

      {/* Tour Plans Cards List */}
      <div className="space-y-4">
        {safeTourPlans.length === 0 ? (
          <div className="neu-card p-8 text-center border border-[#282319] space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#181712] border border-[#282319] text-[#B99D73] flex items-center justify-center mx-auto shadow-neu-sunken">
              <CalendarIcon className="w-6 h-6 text-[#B99D73]" />
            </div>
            <h4 className="font-bold text-base text-[#F2ECE1]">No Tour Plans Scheduled</h4>
            <p className="text-xs text-[#857866] max-w-md mx-auto">
              You haven't scheduled any weekly field tours yet. Click "Create New Tour Plan" above to map your doctor beats.
            </p>
          </div>
        ) : (
          safeTourPlans.map((tp) => {
            const statusBadge = 
              tp.status === 'APPROVED' ? 'success' : 
              tp.status === 'REJECTED' ? 'danger' : 'warning';

            return (
              <div key={tp.id} className="neu-card border border-[#282319] p-5 space-y-4 hover:border-[#6C5636]/60 transition-all duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-[#282319]">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-[#F2ECE1]">{tp.routeTitle}</h3>
                      <Badge variant={statusBadge}>{tp.status.replace('_', ' ')}</Badge>
                    </div>
                    <p className="text-xs text-[#857866] mt-1">
                      Date: <strong className="text-[#F2ECE1]">{tp.date}</strong> • Field MR: <strong className="text-[#F2ECE1]">{tp.userName}</strong> • Territory: <strong className="text-[#B99D73]">{tp.territoryName}</strong>
                    </p>
                  </div>

                  {/* Manager Actions */}
                  {isManager && tp.status === 'PENDING_APPROVAL' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateStatus(tp.id, 'APPROVED', 'Route approved.')}
                        className="neu-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-400 hover:text-emerald-300 border-emerald-900/60 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve Route
                      </button>
                      <button
                        onClick={() => onUpdateStatus(tp.id, 'REJECTED', 'Please reschedule.')}
                        className="neu-btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 border-rose-900/60 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>

                {/* Planned Visits Preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Planned Doctors */}
                  <div className="p-3.5 rounded-xl bg-[#0c0c09] border border-[#282319] shadow-neu-sunken">
                    <span className="font-bold text-[#F2ECE1] block mb-2.5 flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-[#B99D73]" />
                      Planned Doctors ({tp.plannedDoctorsCount || (tp.doctorIds || []).length})
                    </span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {(tp.doctorIds || []).map(docId => {
                        const doc = safeDoctors.find(d => d.id === docId);
                        return (
                          <div key={docId} className="flex items-center justify-between text-[#F2ECE1] bg-[#181712] p-2 rounded-lg border border-[#282319]">
                            <span className="font-semibold text-xs">{doc?.name || docId}</span>
                            <span className="text-[10px] text-[#B99D73] bg-[#0c0c09] px-2 py-0.5 rounded border border-[#282319]">{doc?.specialty || 'General'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Planned Chemists */}
                  <div className="p-3.5 rounded-xl bg-[#0c0c09] border border-[#282319] shadow-neu-sunken">
                    <span className="font-bold text-[#F2ECE1] block mb-2.5 flex items-center gap-1.5">
                      <Store className="w-3.5 h-3.5 text-[#B99D73]" />
                      Planned Pharmacies & RCPA ({tp.plannedChemistsCount || (tp.chemistIds || []).length})
                    </span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {(tp.chemistIds || []).map(chemId => {
                        const chem = safeChemists.find(c => c.id === chemId);
                        return (
                          <div key={chemId} className="flex items-center justify-between text-[#F2ECE1] bg-[#181712] p-2 rounded-lg border border-[#282319]">
                            <span className="font-semibold text-xs">{chem?.shopName || chemId}</span>
                            <span className="text-[10px] text-[#857866]">{chem?.contactPerson || 'Chemist'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {tp.approvalComments && (
                  <div className="text-xs bg-[#181712] p-3 rounded-xl border border-[#282319] text-[#B99D73] shadow-neu-sunken">
                    <strong className="text-[#F2ECE1]">Manager Remarks:</strong> {tp.approvalComments}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Create Tour Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#090907]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="neu-card border border-[#282319] max-w-lg w-full p-6 shadow-neu-raised animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#282319]">
              <h3 className="font-bold text-base text-[#F2ECE1] flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#B99D73]" />
                Schedule New Tour Plan
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="neu-btn p-1.5 rounded-xl text-[#857866] hover:text-[#F2ECE1]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#B99D73] block mb-1">Route Title / Objective</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bandra Linking Rd Cardio & Ortho Focus"
                  value={routeTitle}
                  onChange={(e) => setRouteTitle(e.target.value)}
                  className="neu-input w-full px-3 py-2"
                />
              </div>

              <div>
                <label className="font-semibold text-[#B99D73] block mb-1">Visit Date</label>
                <input
                  type="date"
                  required
                  value={planDate}
                  onChange={(e) => setPlanDate(e.target.value)}
                  className="neu-input w-full px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-[#B99D73] block mb-1.5">Select Doctors to Visit</label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 border border-[#282319] rounded-xl p-2.5 bg-[#0c0c09] shadow-neu-sunken">
                  {safeDoctors.length === 0 ? (
                    <p className="text-xs text-[#857866] p-2">No doctors available in directory.</p>
                  ) : (
                    safeDoctors.map(doc => {
                      const isChecked = selectedDoctorIds.includes(doc.id);
                      return (
                        <label key={doc.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#181712] cursor-pointer transition-colors">
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleDoctorSelection(doc.id)}
                              className="accent-[#6C5636]"
                            />
                            <span className="font-medium text-[#F2ECE1]">{doc.name}</span>
                          </div>
                          <span className="text-[10px] text-[#B99D73]">{doc.specialty}</span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="pt-3.5 border-t border-[#282319] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="neu-btn px-4 py-2 rounded-xl text-[#857866] hover:text-[#F2ECE1] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neu-btn-gold px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                  Submit for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
