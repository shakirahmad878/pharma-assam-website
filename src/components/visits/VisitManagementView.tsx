import React, { useState, useEffect, useMemo } from 'react';
import { User } from '../../types';
import { SupabaseService } from '../../services/supabaseService';
import { Badge } from '../common/Badge';
import {
  Calendar,
  Filter,
  Search,
  RefreshCw,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Stethoscope,
  Store,
  Clock,
  Package,
  FileText,
  DollarSign,
  UserCheck,
} from 'lucide-react';

interface VisitManagementViewProps {
  currentUser: User;
}

export const VisitManagementView: React.FC<VisitManagementViewProps> = ({ currentUser }) => {
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [employeeFilter, setEmployeeFilter] = useState('ALL');
  const [customerTypeFilter, setCustomerTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [datePreset, setDatePreset] = useState<'TODAY' | 'YESTERDAY' | 'WEEK' | 'ALL'>('TODAY');
  const [search, setSearch] = useState('');

  // Employees list for filter dropdown
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);

  // Selected visit for inspection modal
  const [selectedVisit, setSelectedVisit] = useState<any | null>(null);

  // Load employees once
  useEffect(() => {
    SupabaseService.fetchUsers().then(users => {
      if (users && users.length > 0) {
        setEmployees(users.map(u => ({ id: u.id, name: u.name })));
      }
    }).catch(() => {});
  }, []);

  // Compute date range from preset
  const { startDate, endDate } = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    if (datePreset === 'TODAY') {
      return { startDate: todayStr, endDate: todayStr };
    }
    if (datePreset === 'YESTERDAY') {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const yStr = y.toISOString().split('T')[0];
      return { startDate: yStr, endDate: yStr };
    }
    if (datePreset === 'WEEK') {
      const w = new Date();
      w.setDate(w.getDate() - 7);
      return { startDate: w.toISOString().split('T')[0], endDate: todayStr };
    }
    return { startDate: undefined, endDate: undefined };
  }, [datePreset]);

  // Fetch paginated visits
  const loadVisits = async () => {
    setLoading(true);
    try {
      const result = await SupabaseService.fetchVisitsPaginated({
        page,
        pageSize,
        employeeId: employeeFilter,
        customerType: customerTypeFilter,
        status: statusFilter,
        startDate,
        endDate,
        search,
      });
      setVisits(result.records || []);
      setTotalCount(result.totalCount || 0);
    } catch (err) {
      console.warn('[VisitManagementView] loadVisits error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisits();
  }, [page, employeeFilter, customerTypeFilter, statusFilter, datePreset]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadVisits();
  };

  // Metrics
  const stats = useMemo(() => {
    let doctorCalls = 0;
    let chemistCalls = 0;
    let verifiedCount = 0;
    let totalPob = 0;

    visits.forEach(v => {
      if (v.customer_type === 'CHEMIST' || v.chemist_id) {
        chemistCalls++;
      } else {
        doctorCalls++;
      }
      if (v.is_geofence_verified) {
        verifiedCount++;
      }
      if (v.pob_amount) {
        totalPob += Number(v.pob_amount) || 0;
      }
    });

    const geofenceCompliance = visits.length > 0 ? Math.round((verifiedCount / visits.length) * 100) : 100;

    return {
      total: totalCount,
      doctorCalls,
      chemistCalls,
      geofenceCompliance,
      totalPob,
    };
  }, [visits, totalCount]);

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return (
    <div className="space-y-6">
      {/* Top Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#DCE4EB] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#10243A]">Field Visits & Call Audit</h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real-time daily call reports (DCR), doctor detailing, and chemist POB monitoring
          </p>
        </div>
        <button
          onClick={loadVisits}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#10243A] rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Calls</span>
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#DCE4EB] shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-semibold">
            <span>Total Calls</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-[#10243A] mt-2">{stats.total}</div>
          <p className="text-[11px] text-[#64748B] mt-1">Logged field visits</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#DCE4EB] shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-semibold">
            <span>Doctor Detailing</span>
            <Stethoscope className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-[#10243A] mt-2">{stats.doctorCalls}</div>
          <p className="text-[11px] text-[#64748B] mt-1">Physician consultations</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#DCE4EB] shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-semibold">
            <span>Chemist Calls</span>
            <Store className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-[#10243A] mt-2">{stats.chemistCalls}</div>
          <p className="text-[11px] text-[#64748B] mt-1">Retail pharmacies & POB</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#DCE4EB] shadow-xs">
          <div className="flex items-center justify-between text-[#64748B] text-xs font-semibold">
            <span>GPS Compliance</span>
            <MapPin className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-teal-600 mt-2">{stats.geofenceCompliance}%</div>
          <p className="text-[11px] text-[#64748B] mt-1">Verified within chamber</p>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-white p-4 rounded-2xl border border-[#DCE4EB] shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Date Presets */}
          <div className="flex items-center bg-[#F1F5F9] rounded-xl p-1 gap-1">
            {(['TODAY', 'YESTERDAY', 'WEEK', 'ALL'] as const).map(preset => (
              <button
                key={preset}
                onClick={() => { setDatePreset(preset); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  datePreset === preset ? 'bg-white text-[#10243A] shadow-xs' : 'text-[#64748B] hover:text-[#10243A]'
                }`}
              >
                {preset === 'TODAY' ? 'Today' : preset === 'YESTERDAY' ? 'Yesterday' : preset === 'WEEK' ? 'Last 7 Days' : 'All Time'}
              </button>
            ))}
          </div>

          {/* Customer Type Filter */}
          <select
            value={customerTypeFilter}
            onChange={e => { setCustomerTypeFilter(e.target.value); setPage(1); }}
            className="px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-semibold text-[#10243A] cursor-pointer"
          >
            <option value="ALL">All Customer Types</option>
            <option value="DOCTOR">Doctors Only</option>
            <option value="CHEMIST">Chemists Only</option>
          </select>

          {/* Employee Filter */}
          <select
            value={employeeFilter}
            onChange={e => { setEmployeeFilter(e.target.value); setPage(1); }}
            className="px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-semibold text-[#10243A] cursor-pointer"
          >
            <option value="ALL">All Field Staff</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs font-semibold text-[#10243A] cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="MISSED">Missed</option>
            <option value="SKIPPED">Skipped</option>
          </select>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5 ml-auto">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search customer, MR..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#10243A] w-48 focus:w-64 transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 bg-[#10243A] text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Visits Table */}
      <div className="bg-white rounded-2xl border border-[#DCE4EB] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#64748B]">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#10243A]" />
            <p className="text-xs font-semibold">Loading field visits...</p>
          </div>
        ) : visits.length === 0 ? (
          <div className="p-12 text-center text-[#64748B]">
            <Calendar className="w-10 h-10 text-[#CBD5E1] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#10243A]">No Field Calls Found</p>
            <p className="text-xs text-[#94A3B8] mt-1">Try adjusting the date range or filters above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] font-bold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Field Rep</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Objective</th>
                  <th className="py-3 px-4">POB (₹)</th>
                  <th className="py-3 px-4">GPS Status</th>
                  <th className="py-3 px-4">Call Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {visits.map(v => {
                  const isDoctor = v.customer_type === 'DOCTOR' || !v.chemist_id;
                  const customerName = isDoctor ? (v.doctor_name || 'Doctor') : (v.chemist_name || v.doctor_name || 'Chemist');

                  return (
                    <tr key={v.id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                            isDoctor ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            {isDoctor ? <Stethoscope className="w-3.5 h-3.5" /> : <Store className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <span className="font-bold text-[#10243A] block">{customerName}</span>
                            <span className="text-[10px] text-[#64748B]">{v.district || 'Cachar'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-[#10243A]">
                        {v.employee_name || 'Field MR'}
                      </td>

                      <td className="py-3.5 px-4 text-[#64748B]">
                        <span className="block font-medium text-[#10243A]">
                          {v.visit_date || v.timestamp?.split('T')[0]}
                        </span>
                        <span className="text-[10px]">
                          {v.timestamp ? new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[#475569]">
                        {v.visit_objective ? v.visit_objective.replace(/_/g, ' ') : 'Routine Call'}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-[#059669]">
                        {v.pob_amount ? `₹${Number(v.pob_amount).toLocaleString()}` : '-'}
                      </td>

                      <td className="py-3.5 px-4">
                        {v.is_geofence_verified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle className="w-3 h-3" />
                            {Math.round(v.distance_meters || 0)}m Out
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <Badge
                          label={v.status || 'COMPLETED'}
                          variant={v.status === 'COMPLETED' ? 'success' : v.status === 'MISSED' ? 'danger' : 'warning'}
                          size="small"
                        />
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedVisit(v)}
                          className="px-2.5 py-1.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#10243A] rounded-lg text-xs font-semibold inline-flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="flex items-center justify-between p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <span className="text-xs text-[#64748B]">
            Showing {visits.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, totalCount)} of {totalCount} calls
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#475569] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-[#10243A] px-2">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#475569] disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Visit Details Modal */}
      {selectedVisit && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-[#DCE4EB] shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#E2E8F0]">
              <div>
                <h3 className="text-base font-bold text-[#10243A]">
                  {selectedVisit.customer_type === 'CHEMIST' || selectedVisit.chemist_id
                    ? (selectedVisit.chemist_name || selectedVisit.doctor_name || 'Chemist Call')
                    : (selectedVisit.doctor_name || 'Doctor Detailing Call')}
                </h3>
                <p className="text-xs text-[#64748B]">
                  Logged by {selectedVisit.employee_name} • {selectedVisit.visit_date}
                </p>
              </div>
              <button
                onClick={() => setSelectedVisit(null)}
                className="p-1.5 hover:bg-[#F1F5F9] rounded-lg text-[#64748B] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* GPS & Verification Banner */}
              <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#10243A] flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#10243A]" />
                    GPS Location & Perimeter Verification
                  </span>
                  {selectedVisit.is_geofence_verified ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Within Geofence
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      {Math.round(selectedVisit.distance_meters || 0)}m Out of Range
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#64748B]">
                  <div>Lat: {selectedVisit.latitude || '24.8333'}</div>
                  <div>Lng: {selectedVisit.longitude || '92.7789'}</div>
                  <div>Territory: {selectedVisit.district || 'Cachar'}</div>
                  <div>Duration: {selectedVisit.duration_minutes ? `${selectedVisit.duration_minutes} mins` : 'Completed'}</div>
                </div>
              </div>

              {/* Joint Working */}
              {selectedVisit.accompanied_by && (
                <div>
                  <h4 className="text-xs font-bold text-[#10243A] mb-1">Joint Field Working</h4>
                  <p className="text-xs text-[#475569]">{selectedVisit.accompanied_by.replace(/_/g, ' ')}</p>
                </div>
              )}

              {/* Products Discussed */}
              {Array.isArray(selectedVisit.products_discussed) && selectedVisit.products_discussed.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#10243A] mb-1.5 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-blue-600" />
                    Products Detailed
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedVisit.products_discussed.map((p: any, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg border border-blue-200">
                        {typeof p === 'string' ? p : p.productName || p.brandName || 'Product'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Samples Given */}
              {Array.isArray(selectedVisit.samples_given) && selectedVisit.samples_given.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#10243A] mb-1.5">Samples Distributed</h4>
                  <div className="space-y-1">
                    {selectedVisit.samples_given.map((s: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center bg-[#F8FAFC] p-2 rounded-lg text-xs">
                        <span className="font-semibold text-[#10243A]">{s.productName || s.productId}</span>
                        <span className="font-bold text-blue-600">Qty: {s.quantity} (Batch: {s.batchNumber || s.batchNo || 'B-2026'})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* POB Booked */}
              {selectedVisit.pob_amount && Number(selectedVisit.pob_amount) > 0 && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">POB Order Value Booked</span>
                  <span className="text-sm font-black text-emerald-700">₹{Number(selectedVisit.pob_amount).toLocaleString()}</span>
                </div>
              )}

              {/* Feedback & Notes */}
              {(selectedVisit.notes || selectedVisit.feedback) && (
                <div>
                  <h4 className="text-xs font-bold text-[#10243A] mb-1 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                    Discussion Remarks & Feedback
                  </h4>
                  <p className="text-xs text-[#334155] bg-[#F8FAFC] p-3 rounded-xl border border-[#E2E8F0] italic">
                    "{selectedVisit.feedback || selectedVisit.notes}"
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] text-right">
              <button
                onClick={() => setSelectedVisit(null)}
                className="px-4 py-2 bg-[#10243A] text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
