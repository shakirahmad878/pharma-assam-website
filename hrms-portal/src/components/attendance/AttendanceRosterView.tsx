import React, { useState, useEffect } from 'react';
import { HrmsUser, AttendanceRosterRow, AttendanceStatusCode } from '../../types';
import { HrmsService } from '../../services/hrmsService';
import { 
  Clock, 
  Calendar, 
  Camera, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  ChevronDown, 
  Filter, 
  MapPin, 
  Send,
  Eye,
  ArrowUpDown
} from 'lucide-react';

interface AttendanceRosterViewProps {
  currentUser: HrmsUser;
  onOpenGeoSelfie: () => void;
}

type FilterPill = 'ALL' | 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'MISSED_OUT' | 'WEEKLY_OFF' | 'HOLIDAY' | 'LEAVE';

export const AttendanceRosterView: React.FC<AttendanceRosterViewProps> = ({ 
  currentUser,
  onOpenGeoSelfie 
}) => {
  const [roster, setRoster] = useState<AttendanceRosterRow[]>(() => HrmsService.getAttendanceRoster());
  
  useEffect(() => {
    const handleSync = () => {
      setRoster(HrmsService.getAttendanceRoster());
    };
    window.addEventListener('attendance-updated', handleSync);
    return () => window.removeEventListener('attendance-updated', handleSync);
  }, []);
  const [activeFilter, setActiveFilter] = useState<FilterPill>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortAsc, setSortAsc] = useState(false);
  
  // Regularize modal state
  const [showRegModal, setShowRegModal] = useState(false);
  const [targetRow, setTargetRow] = useState<AttendanceRosterRow | null>(null);
  const [regInTime, setRegInTime] = useState('10:00');
  const [regOutTime, setRegOutTime] = useState('19:30');
  const [regReason, setRegReason] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Selfie preview modal
  const [previewSelfie, setPreviewSelfie] = useState<string | null>(null);

  // Compute Counts for Darwinbox Top Filter Pills
  const totalCount = roster.length;
  const presentCount = roster.filter(r => r.status === 'P').length;
  const absentCount = roster.filter(r => r.status === 'A').length;
  const halfDayCount = roster.filter(r => r.status === 'HD').length;
  const missedOutCount = roster.filter(r => r.status === 'MPO' || (r.status === 'P' && r.punchOutTime === '00:00')).length;
  const weeklyOffCount = roster.filter(r => r.status === 'WO').length;
  const holidayCount = roster.filter(r => r.status === 'H').length;
  const leaveCount = roster.filter(r => r.status === 'L').length;

  const filterTabs: { id: FilterPill; label: string; count: number }[] = [
    { id: 'ALL', label: 'All', count: totalCount },
    { id: 'PRESENT', label: 'Present', count: presentCount },
    { id: 'ABSENT', label: 'Absent', count: absentCount },
    { id: 'HALF_DAY', label: 'Half Day', count: halfDayCount },
    { id: 'MISSED_OUT', label: 'Miss Punch Out', count: missedOutCount },
    { id: 'WEEKLY_OFF', label: 'Weekly Off', count: weeklyOffCount },
    { id: 'HOLIDAY', label: 'Holiday', count: holidayCount },
    { id: 'LEAVE', label: 'Leave', count: leaveCount },
  ];

  const filteredRoster = roster.filter(row => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'PRESENT') return row.status === 'P';
    if (activeFilter === 'ABSENT') return row.status === 'A';
    if (activeFilter === 'HALF_DAY') return row.status === 'HD';
    if (activeFilter === 'MISSED_OUT') return row.status === 'MPO' || (row.status === 'P' && row.punchOutTime === '00:00');
    if (activeFilter === 'WEEKLY_OFF') return row.status === 'WO';
    if (activeFilter === 'HOLIDAY') return row.status === 'H';
    if (activeFilter === 'LEAVE') return row.status === 'L';
    return true;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredRoster.map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const openRegularizeForRow = (row: AttendanceRosterRow) => {
    setTargetRow(row);
    setRegInTime(row.punchInTime !== '00:00' ? row.punchInTime : '10:00');
    setRegOutTime(row.punchOutTime !== '00:00' ? row.punchOutTime : '19:30');
    setRegReason(row.status === 'A' ? 'Forgot to punch - on duty' : 'Outdoor client meet');
    setShowRegModal(true);
  };

  const handleRegularizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRow) return;

    HrmsService.applyRegularization({
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      date: targetRow.date,
      shift: targetRow.shift,
      requestedPunchIn: regInTime,
      requestedPunchOut: regOutTime,
      reason: regReason,
    });

    setShowRegModal(false);
    setSuccessToast(`Regularization for ${targetRow.date} submitted for L1 approval.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const getStatusBadge = (status: AttendanceStatusCode) => {
    switch (status) {
      case 'P':
        return <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center">P</span>;
      case 'A':
        return <span className="w-6 h-6 rounded-md bg-rose-100 text-rose-800 font-black text-xs flex items-center justify-center">A</span>;
      case 'WO':
        return <span className="w-6 h-6 rounded-md bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">WO</span>;
      case 'HD':
        return <span className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center">HD</span>;
      case 'MPO':
        return <span className="w-6 h-6 rounded-md bg-purple-100 text-purple-800 font-black text-xs flex items-center justify-center">MPO</span>;
      case 'H':
        return <span className="w-6 h-6 rounded-md bg-teal-100 text-teal-800 font-black text-xs flex items-center justify-center">H</span>;
      case 'L':
        return <span className="w-6 h-6 rounded-md bg-sky-100 text-sky-800 font-black text-xs flex items-center justify-center">L</span>;
      default:
        return <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center">-</span>;
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Success Toast */}
      {successToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold shadow-2xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-600" />
            My Attendance Roster
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time biometric & Geo-Selfie verified audit trail for <span className="font-semibold text-slate-700">October 2026</span>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              if (selectedIds.length > 0) {
                const row = roster.find(r => r.id === selectedIds[0]);
                if (row) openRegularizeForRow(row);
              } else {
                const firstAbsent = roster.find(r => r.status === 'A');
                if (firstAbsent) openRegularizeForRow(firstAbsent);
              }
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#FDE8E8] text-[#9B1C1C] hover:bg-[#FBD5D5] transition-all cursor-pointer shadow-2xs hover:scale-102 flex items-center gap-1.5"
          >
            REGULARIZE
          </button>

          {/* Geo-Selfie Button (Enterprise GPS Facial Verification) */}
          <button
            onClick={onOpenGeoSelfie}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#0B192C] text-white hover:bg-slate-800 transition-all cursor-pointer shadow-2xs hover:scale-102 flex items-center gap-2"
          >
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>Geo-Selfie Punch</span>
          </button>
        </div>
      </div>

      {/* Darwinbox Screen 3 Filter Pills Strip */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {filterTabs.map(tab => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Darwinbox Screen 3 Signature Amber Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              {/* Amber Darwinbox Header Bar: #F5A623 */}
              <tr className="bg-[#F5A623] text-white font-bold text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredRoster.length && filteredRoster.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-amber-300 text-sky-700 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th 
                  onClick={() => setSortAsc(!sortAsc)}
                  className="py-3.5 px-4 cursor-pointer hover:bg-amber-600/40 transition-colors select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>DATE</span>
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-80" />
                  </div>
                </th>
                <th className="py-3.5 px-4">SHIFT</th>
                <th className="py-3.5 px-4">IN TIME</th>
                <th className="py-3.5 px-4">OUT TIME</th>
                <th className="py-3.5 px-4">WORK HOURS</th>
                <th className="py-3.5 px-4 text-center">STATUS</th>
                <th className="py-3.5 px-4">VERIFICATION / AUDIT</th>
                <th className="py-3.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRoster.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-slate-700">No attendance punches recorded yet</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Click <span className="text-slate-800 font-bold">"Geo-Selfie Punch"</span> above to capture your first verified check-in.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRoster.map(row => {
                  const isSelected = selectedIds.includes(row.id);
                  return (
                    <tr 
                      key={row.id} 
                      className={`hover:bg-slate-50/70 transition-colors ${isSelected ? 'bg-sky-50/40' : ''}`}
                    >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleRow(row.id)}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.date}</td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        row.shift === 'Weekly Off' ? 'bg-slate-100 text-slate-500' : 'bg-slate-50 text-slate-700 border border-slate-200'
                      }`}>
                        {row.shift}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      {row.punchInTime !== '00:00' ? (
                        <span className="text-emerald-700 font-bold">{row.punchInTime}</span>
                      ) : (
                        <span className="text-slate-400">--:--</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      {row.punchOutTime !== '00:00' ? (
                        <span className="text-sky-700 font-bold">{row.punchOutTime}</span>
                      ) : (
                        <span className="text-slate-400">--:--</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {row.workHours}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex justify-center">
                        {getStatusBadge(row.status)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {row.selfieUrl ? (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setPreviewSelfie(row.selfieUrl!)}
                            className="w-7 h-7 rounded-full overflow-hidden border border-emerald-400 shadow-2xs hover:scale-110 transition-transform cursor-pointer"
                          >
                            <img src={row.selfieUrl} alt="Selfie" className="w-full h-full object-cover" />
                          </button>
                          <div className="text-[10px]">
                            <div className="font-bold text-emerald-700 flex items-center gap-0.5">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              Geo-Selfie Verified
                            </div>
                            <div className="text-slate-400 font-mono text-[9px]">
                              {row.latitude?.toFixed(4)}, {row.longitude?.toFixed(4)} (100m)
                            </div>
                          </div>
                        </div>
                      ) : row.status === 'WO' ? (
                        <span className="text-slate-400 text-[11px]">System Scheduled</span>
                      ) : row.status === 'A' ? (
                        <span className="text-rose-500 font-semibold text-[11px] flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          No Punches Recorded
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          Office Terminal Punch
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {row.status === 'A' || row.status === 'HD' || row.punchOutTime === '00:00' ? (
                        <button
                          onClick={() => openRegularizeForRow(row)}
                          className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#FDE8E8] text-[#9B1C1C] hover:bg-[#FBD5D5] transition-all cursor-pointer"
                        >
                          Regularize
                        </button>
                      ) : (
                        <span className="text-slate-300 text-[11px]">Logged</span>
                      )}
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Regularize Selected Date */}
      {showRegModal && targetRow && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">Regularize Attendance for {targetRow.date}</h3>
              </div>
              <button onClick={() => setShowRegModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegularizeSubmit} className="mt-4 space-y-4 text-xs">
              <div className="bg-amber-50/70 border border-amber-200/80 p-3 rounded-xl text-amber-800 text-[11px]">
                <p className="font-bold">Original Status: {targetRow.status} ({targetRow.shift})</p>
                <p className="mt-0.5 text-amber-700">Submit actual work timings. Once approved by your L1 manager, the roster will update to Present.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expected In Time</label>
                  <input
                    type="time"
                    value={regInTime}
                    onChange={e => setRegInTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Expected Out Time</label>
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
                <label className="block font-bold text-slate-700 mb-1">Reason for Regularization</label>
                <textarea
                  value={regReason}
                  onChange={e => setRegReason(e.target.value)}
                  placeholder="Explain why you could not punch in or out..."
                  rows={3}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-amber-500 text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRegModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: View Selfie Verification Snapshot */}
      {previewSelfie && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 animate-scale-up text-center">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Geo-Selfie Biometric Record
              </span>
              <button onClick={() => setPreviewSelfie(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 rounded-xl overflow-hidden border-2 border-emerald-500 shadow-md">
              <img src={previewSelfie} alt="Verified Geo Selfie" className="w-full h-64 object-cover" />
            </div>
            <div className="mt-3 text-[11px] text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">Facial Reticle Match: 99.4%</p>
              <p className="text-slate-400">GPS Locked within 100m Office Geofence</p>
            </div>
            <button
              onClick={() => setPreviewSelfie(null)}
              className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
