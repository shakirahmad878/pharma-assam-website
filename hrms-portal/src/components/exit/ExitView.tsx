import React, { useState } from 'react';
import { HrmsUser, ExitWorkflow } from '../../types';
import { HrmsService } from '../../services/hrmsService';
import { 
  CreditCard, 
  UserMinus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileCheck, 
  Laptop, 
  DollarSign, 
  ShieldCheck, 
  Building2,
  Calendar,
  Send,
  X
} from 'lucide-react';

interface ExitViewProps {
  currentUser: HrmsUser;
}

export const ExitView: React.FC<ExitViewProps> = ({ currentUser }) => {
  const [exits, setExits] = useState<ExitWorkflow[]>(() => HrmsService.getExitWorkflows());
  const activeExit = exits.find(e => e.employeeId === currentUser.id);
  const [notification, setNotification] = useState<string | null>(null);

  // Resignation Modal State
  const [showResignModal, setShowResignModal] = useState(false);
  const [reason, setReason] = useState('Career Advancement');
  const [personalRemarks, setPersonalRemarks] = useState('');
  const [noticeDays, setNoticeDays] = useState(45);

  const handleClearanceToggle = (dept: string) => {
    setNotification(`Clearance sign-off updated for ${dept}!`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInitiateResignation = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date();
    const lwd = new Date();
    lwd.setDate(today.getDate() + noticeDays);

    const newExit: ExitWorkflow = {
      id: `exit-${Date.now()}`,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      designation: currentUser.designation,
      reason: reason,
      resignationDate: today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      expectedLastDay: lwd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'IN_CLEARANCE',
      departmentClearances: [
        { department: 'REPORTING_MANAGER', cleared: false, remarks: 'Pending handover of territory doctors and stockist ledgers' },
        { department: 'IT_ASSETS', cleared: false, remarks: 'Pending inspection of mobile SFA device & credentials' },
        { department: 'FINANCE', cleared: false, remarks: 'Audit of travel imprest and pending expense vouchers' },
        { department: 'HR', cleared: false, remarks: 'Exit interview & statutory PF transfer initiation' }
      ],
      fnfGratuity: currentUser.baseSalary ? Math.round(currentUser.baseSalary * 0.5) : 35000,
      fnfLeaveEncashment: currentUser.baseSalary ? Math.round((currentUser.baseSalary / 30) * 12) : 18000,
      fnfBonus: 15000,
      fnfNoticeDeductions: 0,
      fnfNetPayable: currentUser.baseSalary ? Math.round(currentUser.baseSalary * 1.5) : 68000,
    };

    const updated = [newExit, ...exits];
    setExits(updated);
    localStorage.setItem('pdc_hrms_exits_v2', JSON.stringify(updated));
    setShowResignModal(false);
    setNotification(`Resignation notice registered for ${currentUser.name}. L1 Manager and HR notified.`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {notification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold shadow-2xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-500 hover:text-emerald-700">
            &times;
          </button>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UserMinus className="w-5 h-5 text-rose-600" />
            Separation & Settlement Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full & Final (F&F) statutory settlement, asset handover verification, and no-dues clearance
          </p>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
          activeExit ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
        }`}>
          Status: {activeExit ? activeExit.status : 'ACTIVE EMPLOYEE'}
        </span>
      </div>

      {/* Active Employee State (When No Exit Is Pending) */}
      {!activeExit ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Employment Standing: Active & In Good Standing</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser.name} ({currentUser.employeeCode}) • {currentUser.designation} • {currentUser.department}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-semibold block text-[11px]">Joining Date</span>
              <span className="font-bold text-slate-800">{currentUser.joiningDate}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-semibold block text-[11px]">Statutory Policy Notice Period</span>
              <span className="font-bold text-slate-800">45 Calendar Days</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 font-semibold block text-[11px]">Reporting Manager</span>
              <span className="font-bold text-slate-800">{currentUser.l1Manager.name}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50/60 rounded-xl border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold text-slate-800 block">No Active Separation Registered</span>
              <span className="text-[11px] text-slate-500">
                If you intend to transition or initiate your resignation notice with HR, click the button to submit.
              </span>
            </div>
            <button
              onClick={() => setShowResignModal(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0"
            >
              Initiate Resignation Notice
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Separation Metadata Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">Employee Name</span>
                <span className="font-bold text-slate-800">{activeExit.employeeName}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">Resignation Date</span>
                <span className="font-semibold text-slate-800">{activeExit.resignationDate}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">Last Working Day (LWD)</span>
                <span className="font-bold text-rose-700">{activeExit.expectedLastDay}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">Notice Period</span>
                <span className="font-semibold text-slate-800">45 Days (Serving Notice)</span>
              </div>
            </div>
          </div>

          {/* Multi-Department No-Dues Clearance Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-sky-600" />
                Multi-Department No-Dues Clearances
              </h2>
              <span className="text-xs text-slate-400 font-medium">
                {activeExit.departmentClearances.filter(c => c.cleared).length} of {activeExit.departmentClearances.length} Clearances Completed
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {activeExit.departmentClearances.map((c, idx) => (
                <div key={idx} className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors text-xs">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${
                      c.cleared ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {c.cleared ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-2">
                        {c.department.replace('_', ' ')}
                        {c.cleared ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            Cleared ({c.clearedDate || 'Verified'})
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                            Pending Handover
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">{c.remarks}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleClearanceToggle(c.department)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      c.cleared 
                        ? 'border border-slate-200 text-slate-500 hover:bg-slate-100' 
                        : 'bg-sky-600 hover:bg-sky-700 text-white shadow-2xs'
                    }`}
                  >
                    {c.cleared ? 'Revoke Sign-off' : 'Authorize Clearance'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Statutory Full & Final (FnF) Computation Ledger */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Statutory Full & Final Settlement (F&F) Calculation
              </h2>
              <span className="text-xs font-bold text-slate-500">Payment of Gratuity Act Compliant</span>
            </div>

            <div className="p-5 text-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Credits */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2.5">
                  <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-emerald-800">
                    1. Payable Earnings & Statutory Accruals
                  </h3>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Statutory Gratuity Provision:</span>
                    <span className="font-bold text-slate-900">₹{(activeExit.fnfGratuity || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Earned Leave Encashment:</span>
                    <span className="font-bold text-slate-900">₹{(activeExit.fnfLeaveEncashment || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Statutory Annual Bonus / Prorated PLI:</span>
                    <span className="font-bold text-slate-900">₹{(activeExit.fnfBonus || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Deductions */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2.5">
                  <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-rose-800">
                    2. Recoveries & Notice Deductions
                  </h3>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Notice Period Shortfall Recovery:</span>
                    <span className="font-bold text-slate-900">₹{(activeExit.fnfNoticeDeductions || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Unsettled Travel / Imprest Advance:</span>
                    <span className="font-bold text-slate-900">₹0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Professional Tax (Final Quarter):</span>
                    <span className="font-bold text-slate-900">₹400</span>
                  </div>
                </div>

              </div>

              {/* Net Final Settlement Amount */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-900 block">Net Full & Final Settlement (Payable via NEFT)</span>
                  <span className="text-[11px] text-emerald-700">Scheduled for bank disbursement within 48 hours of Last Working Day</span>
                </div>
                <span className="text-2xl font-black text-emerald-800">
                  ₹{(activeExit.fnfNetPayable || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Resignation Submission Modal */}
      {showResignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserMinus className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-sm">Submit Formal Resignation Notice</h3>
              </div>
              <button onClick={() => setShowResignModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInitiateResignation} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Reason for Leaving</label>
                <select
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:border-rose-500"
                >
                  <option value="Career Advancement">Career Advancement / Higher Studies</option>
                  <option value="Relocation">Geographic Relocation</option>
                  <option value="Personal Reasons">Personal / Family Commitment</option>
                  <option value="Health">Health & Wellness</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Period (Days)</label>
                <input
                  type="number"
                  value={noticeDays}
                  onChange={e => setNoticeDays(Number(e.target.value))}
                  min="0"
                  max="90"
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-rose-500 font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">NLCL Standard Employment Notice: 45 Days</span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Remarks / Note to Reporting Manager & HR</label>
                <textarea
                  value={personalRemarks}
                  onChange={e => setPersonalRemarks(e.target.value)}
                  placeholder="Provide context regarding your transition and planned project handover..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-rose-500 text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowResignModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
