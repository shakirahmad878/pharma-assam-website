import React, { useState } from 'react';
import { TourPlanItem, Doctor, Chemist, User, UserRole } from '../../types';
import { Badge } from '../common/Badge';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  Stethoscope, 
  Store,
  UserCheck,
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
  tourPlans,
  doctors,
  chemists,
  currentUser,
  onAddTourPlan,
  onUpdateStatus,
}) => {
  const isManager = currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'AREA_MANAGER' || currentUser.role === 'REGIONAL_MANAGER';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [planDate, setPlanDate] = useState(new Date().toISOString().split('T')[0]);
  const [routeTitle, setRouteTitle] = useState('Hospital Road & Rangirkhari Beat');
  const [selectedDoctorIds, setSelectedDoctorIds] = useState<string[]>([]);
  const [selectedChemistIds, setSelectedChemistIds] = useState<string[]>([]);

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
      territoryId: currentUser.territoryId,
      territoryName: currentUser.territoryName,
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
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-teal-600" />
            Tour Planning (TP) & Route Scheduler
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Build weekly doctor routes, schedule clinic meetings, and manage Area Sales Manager (ASM) approvals.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New Tour Plan
        </button>
      </div>

      {/* Tour Plans Cards List */}
      <div className="space-y-4">
        {tourPlans.map((tp) => {
          const statusBadge = 
            tp.status === 'APPROVED' ? 'success' : 
            tp.status === 'REJECTED' ? 'danger' : 'warning';

          return (
            <div key={tp.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900">{tp.routeTitle}</h3>
                    <Badge variant={statusBadge}>{tp.status.replace('_', ' ')}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Date: <strong>{tp.date}</strong> • Field MR: <strong>{tp.userName}</strong> • Territory: <strong>{tp.territoryName}</strong>
                  </p>
                </div>

                {/* Manager Actions */}
                {isManager && tp.status === 'PENDING_APPROVAL' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateStatus(tp.id, 'APPROVED', 'Route approved. Focus on CardioVast detailing.')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve Route
                    </button>
                    <button
                      onClick={() => onUpdateStatus(tp.id, 'REJECTED', 'Please re-schedule Dr. Verma for Thursday.')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
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
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-700 block mb-2 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                    Planned Doctors ({tp.plannedDoctorsCount})
                  </span>
                  <div className="space-y-1.5">
                    {tp.doctorIds.map(docId => {
                      const doc = doctors.find(d => d.id === docId);
                      return (
                        <div key={docId} className="flex items-center justify-between text-slate-700 bg-white p-1.5 rounded border border-slate-100">
                          <span className="font-semibold">{doc?.name || docId}</span>
                          <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 rounded">{doc?.specialty}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Planned Chemists */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-700 block mb-2 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5 text-blue-600" />
                    Planned Pharmacies & RCPA ({tp.plannedChemistsCount})
                  </span>
                  <div className="space-y-1.5">
                    {tp.chemistIds.map(chemId => {
                      const chem = chemists.find(c => c.id === chemId);
                      return (
                        <div key={chemId} className="flex items-center justify-between text-slate-700 bg-white p-1.5 rounded border border-slate-100">
                          <span className="font-semibold">{chem?.shopName || chemId}</span>
                          <span className="text-[10px] text-slate-400">{chem?.contactPerson}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {tp.approvalComments && (
                <div className="text-xs bg-teal-50/70 p-2.5 rounded-lg border border-teal-100 text-teal-900">
                  <strong>Manager Remarks:</strong> {tp.approvalComments}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Create Tour Plan Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-teal-600" />
                Schedule New Tour Plan
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Route Title / Objective</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bandra Linking Rd Cardio & Ortho Focus"
                  value={routeTitle}
                  onChange={(e) => setRouteTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Visit Date</label>
                <input
                  type="date"
                  required
                  value={planDate}
                  onChange={(e) => setPlanDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-1 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">Select Doctors to Visit</label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 border border-slate-200 rounded-lg p-2 bg-slate-50">
                  {doctors.map(doc => {
                    const isChecked = selectedDoctorIds.includes(doc.id);
                    return (
                      <label key={doc.id} className="flex items-center justify-between p-1.5 rounded hover:bg-white cursor-pointer">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleDoctorSelection(doc.id)}
                            className="rounded text-teal-600 focus:ring-teal-500"
                          />
                          <span className="font-medium text-slate-800">{doc.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">{doc.specialty}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
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
