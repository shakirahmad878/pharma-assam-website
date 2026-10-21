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
  Calendar
} from 'lucide-react';

interface ExitViewProps {
  currentUser: HrmsUser;
}

export const ExitView: React.FC<ExitViewProps> = ({ currentUser }) => {
  const [exits, setExits] = useState<ExitWorkflow[]>(() => HrmsService.getExitWorkflows());
  const activeExit = exits.find(e => e.employeeId === currentUser.id) || exits[0];
  const [notification, setNotification] = useState<string | null>(null);

  const handleClearanceToggle = (dept: string) => {
    setNotification(`Clearance sign-off updated for ${dept}!`);
    setTimeout(() => setNotification(null), 3000);
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
            Employee Separation & F&F Settlement Hub
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full & Final (FnF) statutory settlement, asset handover verification, and no-dues clearance
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 self-start sm:self-auto">
          Status: {activeExit?.status || 'IN_CLEARANCE'}
        </span>
      </div>

      {/* Separation Metadata Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-semibold block text-[11px]">Employee Name</span>
            <span className="font-bold text-slate-800">{activeExit?.employeeName || currentUser.name}</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block text-[11px]">Resignation Date</span>
            <span className="font-semibold text-slate-800">{activeExit?.resignationDate || '15 Sep 2026'}</span>
          </div>
          <div>
            <span className="text-slate-400 font-semibold block text-[11px]">Last Working Day (LWD)</span>
            <span className="font-bold text-rose-700">{activeExit?.expectedLastDay || '31 Oct 2026'}</span>
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
          <span className="text-xs text-slate-400 font-medium">3 of 4 Clearances Completed</span>
        </div>

        <div className="divide-y divide-slate-100">
          {activeExit?.departmentClearances.map((c, idx) => (
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
                        Cleared ({c.clearedDate})
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
            Statutory Full & Final Settlement (FnF) Calculation
          </h2>
          <span className="text-xs font-bold text-slate-500">Section 4(1) Payment of Gratuity Act Compliant</span>
        </div>

        <div className="p-5 text-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Credits */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2.5">
              <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-emerald-800">
                1. Payable Earnings & Statutory Accruals
              </h3>
              <div className="flex justify-between">
                <span className="text-slate-600">Statutory Gratuity (5+ Yrs Continuous Service):</span>
                <span className="font-bold text-slate-900">₹{(activeExit?.fnfGratuity || 185000).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Earned Leave Encashment (12.5 Days Balance):</span>
                <span className="font-bold text-slate-900">₹{(activeExit?.fnfLeaveEncashment || 32500).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Statutory Annual Bonus / Prorated PLI:</span>
                <span className="font-bold text-slate-900">₹{(activeExit?.fnfBonus || 45000).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Deductions */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2.5">
              <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider text-rose-800">
                2. Recoveries & Notice Deductions
              </h3>
              <div className="flex justify-between">
                <span className="text-slate-600">Notice Period Shortfall Recovery:</span>
                <span className="font-bold text-slate-900">₹{(activeExit?.fnfNoticeDeductions || 0).toLocaleString('en-IN')}</span>
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
              <span className="text-[11px] text-emerald-700">Scheduled for bank transfer within 48 hours of Last Working Day</span>
            </div>
            <span className="text-2xl font-black text-emerald-800">
              ₹{(activeExit?.fnfNetPayable || 262100).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
