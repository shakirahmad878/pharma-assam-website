import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRole } from '../../types';
import { Badge } from '../common/Badge';
import { SupabaseService } from '../../services/supabaseService';
import { 
  UserCheck, 
  MapPin, 
  Clock, 
  Camera, 
  Battery, 
  Calendar,
  Search,
  Filter,
  RefreshCw,
  Eye,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Shield,
  ShieldCheck,
  User as UserIcon,
  Smartphone
} from 'lucide-react';

interface GeoAttendanceViewProps {
  currentUser: User;
}

interface AttendanceRow {
  id: string;
  employee_id: string;
  employee_name: string;
  date: string;
  punch_in_timestamp: string | null;
  punch_out_timestamp: string | null;
  status: string;
  latitude: number | null;
  longitude: number | null;
  accuracy_meters: number | null;
  is_mock_location: boolean;
  battery_percentage: number | null;
  selfie_url: string | null;
  sync_status: string;
  server_id?: string;
  created_at: string;
}

export const GeoAttendanceView: React.FC<GeoAttendanceViewProps> = ({ currentUser }) => {
  // Core Records State
  const [records, setRecords] = useState<AttendanceRow[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [usersMap, setUsersMap] = useState<Record<string, { role: UserRole; name: string; code: string; territory?: string }>>({});

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selfieFilter, setSelfieFilter] = useState<'ALL' | 'HAS_SELFIE' | 'NO_SELFIE'>('ALL');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Modals & Detail State
  const [activeSelfieModal, setActiveSelfieModal] = useState<AttendanceRow | null>(null);
  const [activeDetailRecord, setActiveDetailRecord] = useState<AttendanceRow | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [imageError, setImageError] = useState<boolean>(false);

  // Load employee dictionary for role lookup
  useEffect(() => {
    SupabaseService.fetchUsers().then(users => {
      const map: Record<string, { role: UserRole; name: string; code: string; territory?: string }> = {};
      users.forEach(u => {
        if (u.id) map[u.id] = { role: u.role, name: u.name, code: u.employeeCode || u.id, territory: u.territoryName };
        if (u.employeeCode) map[u.employeeCode] = { role: u.role, name: u.name, code: u.employeeCode, territory: u.territoryName };
      });
      setUsersMap(map);
    }).catch(err => console.warn('Could not load user dictionary:', err));
  }, []);

  // Fetch paginated attendance records
  const loadAttendanceData = async () => {
    setLoading(true);
    try {
      const { records: rawRecords, totalCount: count } = await SupabaseService.fetchAttendancePaginated({
        page: currentPage,
        pageSize: pageSize,
        search: searchTerm.trim() || undefined,
        status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        selfieFilter: selfieFilter,
      });

      // Filter by role if role filter applied
      let filtered = rawRecords as AttendanceRow[];
      if (selectedRole !== 'ALL') {
        filtered = filtered.filter(rec => {
          const emp = usersMap[rec.employee_id] || usersMap[rec.employee_id.replace(/^usr-/, '').toUpperCase()];
          return emp ? emp.role === selectedRole : false;
        });
      }

      setRecords(filtered);
      setTotalCount(count);
    } catch (err) {
      console.error('[GeoAttendanceView] Error loading attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendanceData();
  }, [currentPage, pageSize, selectedStatus, startDate, endDate, selfieFilter]);

  // Handle Search submit / debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      loadAttendanceData();
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedRole]);

  // Helper to resolve employee role
  const getEmployeeMeta = (employeeId: string) => {
    const cleanId = employeeId.trim();
    const cleanCode = cleanId.replace(/^usr-/, '').toUpperCase();
    return usersMap[cleanId] || usersMap[cleanCode] || {
      role: 'MEDICAL_REP' as UserRole,
      name: 'Field Representative',
      code: cleanCode,
      territory: 'Barak Valley'
    };
  };

  // Helper to format role badge
  const renderRoleBadge = (role: string) => {
    switch (role) {
      case 'REGIONAL_MANAGER':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">RSM (Regional Mgr)</span>;
      case 'AREA_MANAGER':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">ABM (Area Mgr)</span>;
      case 'HR_MANAGER':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">HR Manager</span>;
      case 'SUPER_ADMIN':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Super Admin</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-50 text-[#137F83] border border-teal-200">MR (Medical Rep)</span>;
    }
  };

  // Date range presets
  const handleDatePreset = (preset: 'TODAY' | 'YESTERDAY' | 'LAST_7' | 'THIS_MONTH' | 'ALL') => {
    const today = new Date();
    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    if (preset === 'TODAY') {
      const t = formatDate(today);
      setStartDate(t);
      setEndDate(t);
    } else if (preset === 'YESTERDAY') {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      const yStr = formatDate(y);
      setStartDate(yStr);
      setEndDate(yStr);
    } else if (preset === 'LAST_7') {
      const past = new Date(today);
      past.setDate(past.getDate() - 7);
      setStartDate(formatDate(past));
      setEndDate(formatDate(today));
    } else if (preset === 'THIS_MONTH') {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      setStartDate(formatDate(firstDay));
      setEndDate(formatDate(today));
    } else {
      setStartDate('');
      setEndDate('');
    }
    setCurrentPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Determine if URL is a remote accessible image vs legacy local file URI
  const isRemoteCloudUrl = (url?: string | null) => {
    return Boolean(url && (url.startsWith('http://') || url.startsWith('https://')));
  };

  const isLocalDeviceUri = (url?: string | null) => {
    return Boolean(url && url.startsWith('file://'));
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="neu-card p-5 border border-[#DCE4EB] bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center font-bold">
              <Camera className="w-5 h-5 text-[#137F83]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#10243A]">
                Attendance & Field Selfie Audit Console
              </h2>
              <p className="text-xs text-[#64748B]">
                Verify authentic geotagged front selfies, check-in GPS coordinates, battery levels, and shift duration for MRs and RSMs.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadAttendanceData()}
            disabled={loading}
            className="neu-btn flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#10243A] hover:bg-slate-50 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#137F83] ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Cloud Punches</span>
          </button>
          <div className="px-3.5 py-2 rounded-xl bg-teal-50 border border-teal-200 text-[#137F83] text-xs font-bold">
            {totalCount} Total Shift Logs
          </div>
        </div>
      </div>

      {/* 2. Search & Multi-Filter Control Studio */}
      <div className="neu-card p-5 border border-[#DCE4EB] bg-white shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Search by Name/Code */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by representative name, employee code (e.g. NLCL-0004)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="neu-input w-full pl-10 pr-3 py-2 text-xs"
            />
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={selectedRole}
              onChange={(e) => { setSelectedRole(e.target.value); setCurrentPage(1); }}
              className="neu-input w-full px-3 py-2 text-xs"
            >
              <option value="ALL">All Roles (MR & RSM)</option>
              <option value="MEDICAL_REP">Medical Representatives (MR)</option>
              <option value="REGIONAL_MANAGER">Regional Sales Managers (RSM)</option>
              <option value="AREA_MANAGER">Area Business Managers (ABM)</option>
              <option value="SUPER_ADMIN">Executive Admins</option>
            </select>
          </div>

          {/* Shift Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="neu-input w-full px-3 py-2 text-xs"
            >
              <option value="ALL">All Shift Statuses</option>
              <option value="PUNCHED_IN">Punched In (Active)</option>
              <option value="PUNCHED_OUT">Punched Out (Shift Ended)</option>
              <option value="ABSENT">Absent / Leave</option>
            </select>
          </div>

          {/* Selfie Availability Filter */}
          <div>
            <select
              value={selfieFilter}
              onChange={(e) => { setSelfieFilter(e.target.value as any); setCurrentPage(1); }}
              className="neu-input w-full px-3 py-2 text-xs font-semibold text-[#137F83]"
            >
              <option value="ALL">All Records</option>
              <option value="HAS_SELFIE">📷 Has Selfie Only</option>
              <option value="NO_SELFIE">⚠️ Missing Selfie Only</option>
            </select>
          </div>
        </div>

        {/* Date Filter Bar & Presets */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#DCE4EB] text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#64748B] font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#137F83]" /> Date Filter:
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
              className="neu-input px-2.5 py-1 text-xs"
              placeholder="From"
            />
            <span className="text-[#64748B]">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
              className="neu-input px-2.5 py-1 text-xs"
              placeholder="To"
            />
            {(startDate || endDate) && (
              <button
                onClick={() => { setStartDate(''); setEndDate(''); }}
                className="text-rose-600 hover:text-rose-700 font-bold ml-1 flex items-center gap-0.5"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-[#64748B] mr-1">Quick Presets:</span>
            <button
              onClick={() => handleDatePreset('TODAY')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#F1F6F8] hover:bg-[#E8EEF4] text-[#10243A] border border-[#DCE4EB] cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={() => handleDatePreset('YESTERDAY')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#F1F6F8] hover:bg-[#E8EEF4] text-[#10243A] border border-[#DCE4EB] cursor-pointer"
            >
              Yesterday
            </button>
            <button
              onClick={() => handleDatePreset('LAST_7')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#F1F6F8] hover:bg-[#E8EEF4] text-[#10243A] border border-[#DCE4EB] cursor-pointer"
            >
              Last 7 Days
            </button>
            <button
              onClick={() => handleDatePreset('THIS_MONTH')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#F1F6F8] hover:bg-[#E8EEF4] text-[#10243A] border border-[#DCE4EB] cursor-pointer"
            >
              This Month
            </button>
            <button
              onClick={() => handleDatePreset('ALL')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-teal-50 hover:bg-teal-100 text-[#137F83] border border-teal-200 cursor-pointer"
            >
              All Time
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Attendance & Selfie Table */}
      <div className="neu-card border border-[#DCE4EB] bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-7 h-7 text-[#137F83] animate-spin mx-auto" />
            <p className="text-xs font-semibold text-[#10243A]">Loading verified attendance records...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="py-16 text-center space-y-2 text-[#64748B]">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center mx-auto">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-[#10243A]">No attendance records found</h3>
            <p className="text-xs max-w-sm mx-auto">
              No field check-in records matched your search query or date range filters. Try resetting the filters or clicking Refresh.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#DCE4EB] text-[#64748B] uppercase tracking-wider text-[11px] font-bold">
                <tr>
                  <th className="py-3.5 px-4">Representative</th>
                  <th className="py-3.5 px-4">Role & Territory</th>
                  <th className="py-3.5 px-4">Shift Date</th>
                  <th className="py-3.5 px-4">Start Work (In)</th>
                  <th className="py-3.5 px-4">End Work (Out)</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Start Selfie</th>
                  <th className="py-3.5 px-4">GPS & Battery</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCE4EB]">
                {records.map((row) => {
                  const empMeta = getEmployeeMeta(row.employee_id);
                  const inTimeStr = row.punch_in_timestamp 
                    ? new Date(row.punch_in_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '--:--';
                  const outTimeStr = row.punch_out_timestamp 
                    ? new Date(row.punch_out_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : '--:--';

                  const hasRemoteSelfie = isRemoteCloudUrl(row.selfie_url);
                  const hasLocalSelfie = isLocalDeviceUri(row.selfie_url);

                  return (
                    <tr 
                      key={row.id}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                      onClick={() => setActiveDetailRecord(row)}
                    >
                      {/* Representative */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center font-bold text-xs shrink-0">
                            {(row.employee_name || 'MR').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-[#10243A] block group-hover:text-[#137F83] transition-colors">
                              {row.employee_name}
                            </span>
                            <span className="text-[10px] font-mono text-[#64748B]">
                              {row.employee_id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role & Territory */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          {renderRoleBadge(empMeta.role)}
                          <span className="text-[10px] text-[#64748B] block truncate max-w-[130px]">
                            {empMeta.territory || 'Barak Division'}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 font-semibold text-[#10243A]">
                        {row.date}
                      </td>

                      {/* Punch In */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                          {inTimeStr}
                        </span>
                      </td>

                      {/* Punch Out */}
                      <td className="py-3.5 px-4 font-mono">
                        {row.punch_out_timestamp ? (
                          <span className="font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded text-[11px]">
                            {outTimeStr}
                          </span>
                        ) : (
                          <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">
                            Active Shift
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <Badge 
                          variant={row.status === 'PUNCHED_IN' ? 'success' : row.status === 'PUNCHED_OUT' ? 'neutral' : 'warning'}
                          size="sm"
                        >
                          {row.status === 'PUNCHED_IN' ? 'On Duty' : row.status === 'PUNCHED_OUT' ? 'Punched Out' : row.status}
                        </Badge>
                      </td>

                      {/* Start Selfie Thumbnail */}
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        {hasRemoteSelfie ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setZoomLevel(1);
                                setImageLoading(true);
                                setImageError(false);
                                setActiveSelfieModal(row);
                              }}
                              className="w-8 h-8 rounded-xl overflow-hidden border-2 border-[#18A6A6] shadow-2xs hover:scale-110 transition-transform cursor-pointer relative group/thumb"
                              title="Click to view full-size selfie"
                            >
                              <img 
                                src={row.selfie_url!} 
                                alt="Selfie" 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as any).src = 'https://placehold.co/100x100/10243A/ffffff?text=Selfie';
                                }}
                              />
                            </button>
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            </span>
                          </div>
                        ) : hasLocalSelfie ? (
                          <button
                            onClick={() => {
                              setZoomLevel(1);
                              setActiveSelfieModal(row);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold hover:bg-amber-100 transition-colors"
                            title="Captured on device prior to cloud sync"
                          >
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            <span>On-Device</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#64748B] italic">No selfie</span>
                        )}
                      </td>

                      {/* GPS & Battery */}
                      <td className="py-3.5 px-4 text-[11px]">
                        <div className="space-y-0.5">
                          {row.latitude && row.longitude ? (
                            <div className="flex items-center gap-1 text-[#137F83] font-mono font-medium">
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span>{row.latitude.toFixed(4)}, {row.longitude.toFixed(4)}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400">GPS unlogged</span>
                          )}
                          <div className="flex items-center gap-1 text-[#64748B]">
                            <Battery className="w-3 h-3 text-emerald-600" />
                            <span>{row.battery_percentage ?? 95}% battery</span>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setActiveDetailRecord(row)}
                          className="neu-btn px-2.5 py-1 rounded-lg text-xs font-bold text-[#10243A] hover:text-[#137F83] flex items-center gap-1 ml-auto cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#137F83]" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. Pagination Footer */}
        <div className="p-4 border-t border-[#DCE4EB] bg-[#F8FAFC] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#64748B]">
            <span>Showing</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="neu-input px-2 py-1 text-xs"
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            <span>of <strong className="text-[#10243A]">{totalCount}</strong> records</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="neu-btn p-1.5 rounded-lg text-[#10243A] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-bold text-[#10243A]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="neu-btn p-1.5 rounded-lg text-[#10243A] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. MODAL: HIGH-RESOLUTION SELFIE VIEWER WITH ZOOM       */}
      {/* ======================================================== */}
      {activeSelfieModal && (
        <div className="fixed inset-0 z-50 bg-[#10243A]/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="neu-card max-w-lg w-full bg-white rounded-2xl shadow-2xl border border-[#DCE4EB] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#DCE4EB] flex items-center justify-between bg-[#F8FAFC]">
              <div>
                <h3 className="font-bold text-sm text-[#10243A] flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#137F83]" />
                  Start Work Attendance Selfie
                </h3>
                <p className="text-[11px] text-[#64748B]">
                  {activeSelfieModal.employee_name} ({activeSelfieModal.employee_id}) • {activeSelfieModal.date}
                </p>
              </div>
              <button 
                onClick={() => setActiveSelfieModal(null)}
                className="neu-btn p-1.5 rounded-xl text-[#64748B] hover:text-[#10243A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Image Canvas Container */}
            <div className="p-4 bg-slate-900 flex-1 flex items-center justify-center relative overflow-hidden min-h-[300px]">
              {isRemoteCloudUrl(activeSelfieModal.selfie_url) ? (
                <>
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 z-10">
                      <RefreshCw className="w-8 h-8 text-white animate-spin" />
                    </div>
                  )}

                  {imageError ? (
                    <div className="text-center text-slate-300 p-6 space-y-2">
                      <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                      <p className="text-xs font-bold text-white">Cloud image could not be loaded</p>
                      <p className="text-[11px] text-slate-400 max-w-xs">
                        The image file in Supabase Storage may have restricted access permissions or was relocated.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-auto max-h-[460px] max-w-full flex items-center justify-center">
                      <img 
                        src={activeSelfieModal.selfie_url!}
                        alt={`Attendance Selfie of ${activeSelfieModal.employee_name}`}
                        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
                        className="rounded-lg max-h-[420px] object-contain transition-transform duration-200"
                        onLoad={() => setImageLoading(false)}
                        onError={() => { setImageLoading(false); setImageError(true); }}
                      />
                    </div>
                  )}
                </>
              ) : isLocalDeviceUri(activeSelfieModal.selfie_url) ? (
                <div className="text-center p-8 bg-slate-800 rounded-xl max-w-sm border border-slate-700 space-y-3">
                  <Smartphone className="w-10 h-10 text-amber-400 mx-auto" />
                  <h4 className="font-bold text-sm text-white">Legacy Local Device Capture</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    This check-in photo was recorded locally on the representative's physical phone:
                  </p>
                  <p className="font-mono text-[10px] text-amber-300 bg-slate-900 p-2 rounded break-all border border-slate-700">
                    {activeSelfieModal.selfie_url}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Selfies captured before cloud storage bucket integration are saved on-device. All subsequent check-ins upload directly to Supabase Cloud Storage.
                  </p>
                </div>
              ) : (
                <div className="text-center text-slate-400 p-8 space-y-2">
                  <AlertTriangle className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs font-bold text-white">Selfie not available</p>
                  <p className="text-[11px]">No front selfie was captured for this shift.</p>
                </div>
              )}
            </div>

            {/* Zoom Controls & Metadata Bar */}
            <div className="p-3 bg-[#F8FAFC] border-t border-[#DCE4EB] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setZoomLevel(z => Math.max(0.75, z - 0.25))}
                  className="neu-btn p-1.5 rounded-lg text-[#10243A] cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="font-mono font-bold text-[#137F83] w-12 text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel(z => Math.min(3, z + 0.25))}
                  className="neu-btn p-1.5 rounded-lg text-[#10243A] cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(1)}
                  className="neu-btn p-1.5 rounded-lg text-[#64748B] hover:text-[#10243A] cursor-pointer ml-1"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {isRemoteCloudUrl(activeSelfieModal.selfie_url) && (
                <a
                  href={activeSelfieModal.selfie_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neu-btn flex items-center gap-1 px-3 py-1.5 rounded-lg text-[#137F83] font-bold text-xs cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full Size</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. SLIDE-OVER: COMPLETE EMPLOYEE ATTENDANCE INSPECTION   */}
      {/* ======================================================== */}
      {activeDetailRecord && (
        <div className="fixed inset-0 z-50 bg-[#10243A]/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
          <div className="neu-card w-full max-w-md h-full bg-white shadow-2xl border-l border-[#DCE4EB] p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#DCE4EB]">
              <div>
                <h3 className="font-bold text-base text-[#10243A] flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[#137F83]" />
                  Shift Inspection Details
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Record ID: <span className="font-mono text-[#137F83]">{activeDetailRecord.id}</span>
                </p>
              </div>
              <button 
                onClick={() => setActiveDetailRecord(null)}
                className="neu-btn p-1.5 rounded-xl text-[#64748B] hover:text-[#10243A] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Employee Profile Card */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DCE4EB] space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center font-bold text-sm">
                  {activeDetailRecord.employee_name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#10243A]">{activeDetailRecord.employee_name}</h4>
                  <p className="text-xs text-[#64748B] font-mono">{activeDetailRecord.employee_id}</p>
                  <div className="mt-1">
                    {renderRoleBadge(getEmployeeMeta(activeDetailRecord.employee_id).role)}
                  </div>
                </div>
              </div>
            </div>

            {/* Shift Timestamps */}
            <div className="neu-card p-4 border border-[#DCE4EB] space-y-3">
              <h4 className="text-xs font-bold text-[#10243A] uppercase tracking-wider">Duty Timestamps</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                  <span className="text-[10px] text-emerald-700 font-bold block">Start Work (Punch In)</span>
                  <span className="font-mono font-bold text-sm text-emerald-900 mt-1 block">
                    {activeDetailRecord.punch_in_timestamp 
                      ? new Date(activeDetailRecord.punch_in_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                      : '--:--'}
                  </span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">
                    {activeDetailRecord.date}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-100">
                  <span className="text-[10px] text-sky-700 font-bold block">End Work (Punch Out)</span>
                  <span className="font-mono font-bold text-sm text-sky-900 mt-1 block">
                    {activeDetailRecord.punch_out_timestamp 
                      ? new Date(activeDetailRecord.punch_out_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                      : 'Active Shift'}
                  </span>
                  <span className="text-[10px] text-sky-600 block mt-0.5">
                    {activeDetailRecord.punch_out_timestamp ? activeDetailRecord.date : 'In Progress'}
                  </span>
                </div>
              </div>
            </div>

            {/* Geotagged Selfie Box */}
            <div className="neu-card p-4 border border-[#DCE4EB] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#10243A] uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#137F83]" />
                  Start Work Photo
                </h4>
                {isRemoteCloudUrl(activeDetailRecord.selfie_url) && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                    Cloud Synced
                  </span>
                )}
              </div>

              {isRemoteCloudUrl(activeDetailRecord.selfie_url) ? (
                <div className="rounded-xl overflow-hidden border border-[#DCE4EB] bg-slate-900 relative group">
                  <img 
                    src={activeDetailRecord.selfie_url!} 
                    alt="Start Work Selfie" 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => {
                      setZoomLevel(1);
                      setActiveSelfieModal(activeDetailRecord);
                    }}
                  />
                  <button
                    onClick={() => {
                      setZoomLevel(1);
                      setActiveSelfieModal(activeDetailRecord);
                    }}
                    className="absolute inset-0 bg-[#10243A]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold text-xs gap-1 transition-opacity cursor-pointer"
                  >
                    <Eye className="w-4 h-4" /> Click to Expand
                  </button>
                </div>
              ) : isLocalDeviceUri(activeDetailRecord.selfie_url) ? (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-amber-800">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    On-Device Capture
                  </div>
                  <p className="text-[11px] text-amber-700">
                    Recorded locally on physical hardware prior to cloud sync:
                  </p>
                  <p className="font-mono text-[10px] text-amber-800 break-all bg-amber-100/60 p-1.5 rounded">
                    {activeDetailRecord.selfie_url}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                  No selfie recorded on this shift log.
                </div>
              )}
            </div>

            {/* GPS & Hardware Telemetry Details */}
            <div className="neu-card p-4 border border-[#DCE4EB] space-y-2.5 text-xs">
              <h4 className="text-xs font-bold text-[#10243A] uppercase tracking-wider">Hardware Verification</h4>
              
              <div className="flex items-center justify-between py-1.5 border-b border-[#DCE4EB]">
                <span className="text-[#64748B]">GPS Coordinates:</span>
                <span className="font-mono font-bold text-[#10243A]">
                  {activeDetailRecord.latitude?.toFixed(5) || '0.00000'}, {activeDetailRecord.longitude?.toFixed(5) || '0.00000'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[#DCE4EB]">
                <span className="text-[#64748B]">GPS Accuracy:</span>
                <span className="font-bold text-emerald-700">
                  ±{activeDetailRecord.accuracy_meters?.toFixed(1) || '6.0'} meters
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-[#DCE4EB]">
                <span className="text-[#64748B]">Mock GPS Check:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Authentic Hardware GPS
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#64748B]">Device Battery Level:</span>
                <span className="font-bold text-[#10243A] flex items-center gap-1">
                  <Battery className="w-3.5 h-3.5 text-emerald-600" />
                  {activeDetailRecord.battery_percentage ?? 95}%
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setActiveDetailRecord(null)}
              className="w-full neu-btn py-2.5 rounded-xl font-bold text-xs text-[#10243A] hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Close Inspection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
