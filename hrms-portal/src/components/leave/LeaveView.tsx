import React, { useState } from 'react';
import { HrmsUser, LeaveBalanceRow, LeaveRequest, LeaveType } from '../../types';
import { HrmsService } from '../../services/hrmsService';
import { 
  Calendar, 
  Clock, 
  AlertCircle, 
  Plus, 
  ChevronRight, 
  CheckCircle2, 
  X, 
  Info,
  ShieldCheck,
  Send,
  Building2,
  MapPin,
  UserCheck
} from 'lucide-react';

interface LeaveViewProps {
  currentUser: HrmsUser;
  onOpenRegularize?: () => void;
}

export const LeaveView: React.FC<LeaveViewProps> = ({ currentUser, onOpenRegularize }) => {
  const [balances, setBalances] = useState<LeaveBalanceRow[]>(() => HrmsService.getLeaveBalances(currentUser.id));
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => HrmsService.getLeaveRequests());
  const counters = HrmsService.getAttendanceCounters();

  // New Leave Modal State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveType>('Casual Leave');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [reason, setReason] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Regularize Modal State (Internal fallback if not opened globally)
  const [showRegularizeModal, setShowRegularizeModal] = useState(false);
  const [regDate, setRegDate] = useState('14 Oct 2026');
  const [regInTime, setRegInTime] = useState('10:00');
  const [regOutTime, setRegOutTime] = useState('19:30');
  const [regReason, setRegReason] = useState('Client on-site presentation & network delay');

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const days = isHalfDay ? 0.5 : 1;
    HrmsService.applyLeave({
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      employeeCode: currentUser.employeeCode,
      leaveType,
      startDate,
      endDate: isHalfDay ? startDate : endDate,
      totalDays: days,
      reason,
    });

    setBalances(HrmsService.getLeaveBalances(currentUser.id));
    setLeaveRequests(HrmsService.getLeaveRequests());
    setShowApplyModal(false);
    setReason('');
    setSuccessMsg(`Leave application for ${leaveType} (${days}d) submitted successfully!`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleApplyRegularization = (e: React.FormEvent) => {
    e.preventDefault();
    HrmsService.applyRegularization({
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      date: regDate,
      shift: 'General',
      requestedPunchIn: regInTime,
      requestedPunchOut: regOutTime,
      reason: regReason,
    });
    setShowRegularizeModal(false);
    setSuccessMsg(`Regularization request for ${regDate} logged with L1 Manager!`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Success Notification Alert */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold shadow-2xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Employee Context Dossier Banner (Darwinbox Signature Top Card) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-md border-2 border-white shrink-0">
              {currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">{currentUser.name}</h1>
                <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-0.5 rounded-full border border-slate-200">
                  {currentUser.employeeCode}
                </span>
                <span className="text-xs bg-sky-50 text-sky-700 font-bold px-2.5 py-0.5 rounded-full border border-sky-100">
                  {currentUser.grade}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">{currentUser.designation}</p>
              
              <div className="mt-3 space-y-1 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-500">Org Unit:</span>
                  <span className="truncate">{currentUser.organizationUnit}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-500">Location:</span>
                  <span className="truncate">{currentUser.locationHierarchy}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reporting Line Badges */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 text-xs space-y-2 shrink-0 md:min-w-[280px]">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 font-semibold">L1 Manager:</span>
              <span className="font-bold text-slate-800">
                {currentUser.l1Manager.code && currentUser.l1Manager.code !== currentUser.l1Manager.name 
                  ? `${currentUser.l1Manager.name} (${currentUser.l1Manager.code})` 
                  : currentUser.l1Manager.name}
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 font-semibold">L2 Manager:</span>
              <span className="font-bold text-slate-800">
                {currentUser.l2Manager.code && currentUser.l2Manager.code !== currentUser.l2Manager.name 
                  ? `${currentUser.l2Manager.name} (${currentUser.l2Manager.code})` 
                  : currentUser.l2Manager.name}
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-500 font-semibold">HRBP:</span>
              <span className="font-bold text-slate-800">
                {currentUser.hrbp.code && currentUser.hrbp.code !== currentUser.hrbp.name 
                  ? `${currentUser.hrbp.name} (${currentUser.hrbp.code})` 
                  : currentUser.hrbp.name}
              </span>
            </div>
          </div>
        </div>

        {/* Shift Ribbon (Darwinbox Screen 2) */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-slate-800">Current Shift:</span>
            <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono font-semibold">General (10:00 - 19:30)</span>
            <span className="text-slate-400">| Grace Time: 15 mins</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Attendance Cycle: <span className="font-semibold text-slate-700">01 Oct 2026 - 31 Oct 2026</span>
          </div>
        </div>
      </div>

      {/* 2. Middle Grid: Upcoming Leave + Attendance Indicator Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Upcoming Leave (Left 5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-sky-600" />
                Upcoming Leave
              </h2>
              <button
                onClick={() => setShowApplyModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FDE8E8] text-[#9B1C1C] hover:bg-[#FBD5D5] transition-all cursor-pointer shadow-2xs hover:scale-102"
              >
                <Plus className="w-3.5 h-3.5" />
                NEW LEAVE
              </button>
            </div>

            {/* Upcoming Leave List */}
            {leaveRequests.filter(l => l.status === 'APPROVED' || l.status === 'PENDING').length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="font-medium">You have no upcoming leaves scheduled.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Click "+ NEW LEAVE" to apply.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {leaveRequests.slice(0, 3).map(lr => (
                  <div key={lr.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-800">{lr.leaveType}</div>
                      <div className="text-[11px] text-slate-500">{lr.startDate} to {lr.endDate} ({lr.totalDays} day)</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      lr.status === 'APPROVED' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {lr.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Quota Cycle: Calendar Year 2026</span>
            <span className="text-sky-600 hover:underline cursor-pointer font-semibold">Leave Policy Guide</span>
          </div>
        </div>

        {/* Attendance Indicators Counter Row (Right 7 cols - Darwinbox Screen 2) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                Attendance Indicators (Current Month)
              </h2>
              <button
                onClick={() => {
                  if (onOpenRegularize) onOpenRegularize();
                  else setShowRegularizeModal(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FDE8E8] text-[#9B1C1C] hover:bg-[#FBD5D5] transition-all cursor-pointer shadow-2xs hover:scale-102"
              >
                REGULARIZE
              </button>
            </div>

            {/* MIS / A / HD / RR Darwinbox 4-Pill Row */}
            <div className="grid grid-cols-4 gap-3">
              
              {/* MIS */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-center hover:border-slate-300 transition-all">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">MIS</div>
                <div className="text-2xl font-black text-slate-800 mt-1">{counters.mis}</div>
                <div className="text-[9px] text-slate-400 mt-0.5">Missed Punches</div>
              </div>

              {/* A (Absent) */}
              <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-3.5 text-center hover:border-rose-300 transition-all">
                <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600">A</div>
                <div className="text-2xl font-black text-rose-700 mt-1">{counters.absent}</div>
                <div className="text-[9px] text-rose-500 mt-0.5">Absents</div>
              </div>

              {/* HD (Half Day) */}
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 text-center hover:border-amber-300 transition-all">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600">HD</div>
                <div className="text-2xl font-black text-amber-700 mt-1">{counters.halfDay}</div>
                <div className="text-[9px] text-amber-500 mt-0.5">Half Days</div>
              </div>

              {/* RR (Regularization Requests) */}
              <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-3.5 text-center hover:border-indigo-300 transition-all">
                <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">RR</div>
                <div className="text-2xl font-black text-indigo-700 mt-1">{counters.regularizationRequests}</div>
                <div className="text-[9px] text-indigo-500 mt-0.5">Pending Regs</div>
              </div>

            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Cut-off date for regularization is 25th of every month</span>
            <span className="text-amber-600 font-semibold">3 Absents eligible for regularization</span>
          </div>
        </div>

      </div>

      {/* 3. Statutory Leave Balance Ledger Table (Darwinbox Screen 2 Replica) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Leave Balance Ledger</h3>
            <p className="text-xs text-slate-500">Statutory annual allocation & fractional half-day balances</p>
          </div>
          <span className="text-xs text-slate-400 font-medium">As of {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-5">LEAVE TYPE</th>
                <th className="py-3 px-4 text-right">ANNUAL QUOTA</th>
                <th className="py-3 px-4 text-right">CARRIED FORWARD</th>
                <th className="py-3 px-4 text-right">AVAILED TILL DATE</th>
                <th className="py-3 px-5 text-right font-black text-sky-800">CURRENT BALANCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {balances.map(row => (
                <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                    {row.leaveType}
                  </td>
                  <td className="py-3.5 px-4 text-right font-medium text-slate-600">{row.annualQuota}d</td>
                  <td className="py-3.5 px-4 text-right font-medium text-slate-600">{row.carriedForward}d</td>
                  <td className="py-3.5 px-4 text-right font-medium text-rose-600 font-semibold">{row.availedTillDate}d</td>
                  <td className="py-3.5 px-5 text-right">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-sky-50 text-sky-700 border border-sky-100">
                      {row.currentBalance}d
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Apply New Leave */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">Apply for Leave</h3>
              </div>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={e => setLeaveType(e.target.value as LeaveType)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:border-sky-500 font-semibold"
                >
                  <option value="Casual Leave">Casual Leave (CL) - (Balance: {balances.find(b => b.leaveType === 'Casual Leave')?.currentBalance ?? 12} / 12d)</option>
                  <option value="Earned Leave">Earned Leave (EL) - (Balance: {balances.find(b => b.leaveType === 'Earned Leave')?.currentBalance ?? 15} / 15d)</option>
                  <option value="Sick Leave">Sick Leave (SL) - (Balance: {balances.find(b => b.leaveType === 'Sick Leave')?.currentBalance ?? 12} / 12d)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="halfDayToggle"
                  checked={isHalfDay}
                  onChange={e => setIsHalfDay(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="halfDayToggle" className="font-semibold text-slate-700 cursor-pointer">
                  Half Day Leave (0.5d)
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
                {!isHalfDay && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Leave</label>
                <textarea
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="e.g. Urgent personal family commitment / Doctor visit"
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500 text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Attendance Regularization */}
      {showRegularizeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">Regularize Attendance</h3>
              </div>
              <button onClick={() => setShowRegularizeModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyRegularization} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Date to Regularize</label>
                <select
                  value={regDate}
                  onChange={e => setRegDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800 focus:outline-none focus:border-amber-500"
                >
                  <option value="14 Oct 2026">14 Oct 2026 (Marked: Absent)</option>
                  <option value="13 Oct 2026">13 Oct 2026 (Marked: Absent)</option>
                  <option value="10 Oct 2026">10 Oct 2026 (Marked: Absent)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Actual Punch In</label>
                  <input
                    type="time"
                    value={regInTime}
                    onChange={e => setRegInTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Actual Punch Out</label>
                  <input
                    type="time"
                    value={regOutTime}
                    onChange={e => setRegOutTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Justification / Reason</label>
                <textarea
                  value={regReason}
                  onChange={e => setRegReason(e.target.value)}
                  placeholder="e.g. Biometric device was offline / Field client meeting"
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-amber-500 text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRegularizeModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Regularization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
