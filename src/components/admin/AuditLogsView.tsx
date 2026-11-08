import React, { useState, useEffect } from 'react';
import { AuditLogEntry, User } from '../../types';
import { 
  History, 
  Search, 
  Edit3, 
  Trash2, 
  PlusCircle, 
  Key,
  RefreshCw,
  Database,
  Calendar,
  UserCheck
} from 'lucide-react';
import { SupabaseService } from '../../services/supabaseService';

interface AuditLogsViewProps {
  auditLogs: AuditLogEntry[];
  currentUser: User;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ auditLogs = [], currentUser }) => {
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActionFilter, setSelectedActionFilter] = useState<string>('ALL');
  const [selectedEntityType, setSelectedEntityType] = useState<string>('ALL');
  const [dbAuditLogs, setDbAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCloudAuditLogs = async () => {
    setLoading(true);
    try {
      const rawLogs = await SupabaseService.fetchSystemAuditLogs(150);
      if (Array.isArray(rawLogs) && rawLogs.length > 0) {
        const mapped: AuditLogEntry[] = rawLogs.map((item: any) => ({
          id: item.id || `audit_${Date.now()}_${Math.random()}`,
          timestamp: item.recorded_at || new Date().toISOString(),
          actorId: item.employee_id || 'sys-db-trigger',
          actorName: item.employee_id ? `Employee (${item.employee_id})` : 'PostgreSQL DB Engine',
          actorRole: 'SUPER_ADMIN',
          action: item.action === 'INSERT' ? 'CREATE' : item.action === 'DELETE' ? 'DELETE' : 'UPDATE',
          entityType: 'DATABASE_RECORD',
          entityId: item.record_id || 'unknown',
          entityName: `${item.table_name?.toUpperCase()} Record #${item.record_id?.substring(0, 16) || ''}`,
          companyId: currentUser?.companyId,
          companyName: 'New Life Care Laboratories',
          details: `Database trigger recorded ${item.action} on ${item.table_name}. Record ID: ${item.record_id}`,
        }));
        setDbAuditLogs(mapped);
      }
    } catch (err) {
      console.warn('Failed to load system audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCloudAuditLogs();
  }, []);

  const safeLogs = Array.isArray(auditLogs) ? auditLogs : [];
  // Merge user app logs with live PostgreSQL trigger logs
  const combinedLogs = [...dbAuditLogs, ...safeLogs];

  // Deduplicate by ID
  const uniqueLogs = Array.from(new Map(combinedLogs.map((item) => [item.id, item])).values());

  // Filter logs by company if not Super Admin
  const scopedLogs = isSuperAdmin
    ? uniqueLogs
    : uniqueLogs.filter((log) => !log.companyId || log.companyId === currentUser?.companyId);

  // Sort descending by timestamp
  scopedLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const filteredLogs = scopedLogs.filter((log) => {
    const matchesSearch =
      (log.actorName && log.actorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.entityName && log.entityName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.details && log.details.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAction = selectedActionFilter === 'ALL' || log.action === selectedActionFilter;
    const matchesEntity = selectedEntityType === 'ALL' || log.entityType === selectedEntityType;

    return matchesSearch && matchesAction && matchesEntity;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="neu-card p-6 border border-[#DCE4EB] bg-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center font-bold">
                <History className="w-5 h-5 text-[#137F83]" />
              </div>
              <h2 className="text-xl font-bold text-[#10243A]">Security & Database Audit Ledger</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-[#F1F6F8] text-[#137F83] border border-[#DCE4EB] px-2.5 py-0.5 rounded-full">
                PostgreSQL Triggers
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-1.5">
              Cryptographic tamper-evident activity log tracking every attendance, doctor, chemist, and order mutation.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={loadCloudAuditLogs}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-teal-50 text-[#137F83] border border-teal-200 font-medium hover:bg-teal-100 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh Audit Ledger'}
            </button>
            <div className="text-right">
              <span className="text-xs text-[#64748B] block font-medium">Logged System Events</span>
              <span className="text-lg font-bold text-[#10243A] font-mono">{scopedLogs.length} Events</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search actor, entity or change detail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-xs bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] focus:outline-none focus:border-[#18A6A6]"
            />
          </div>

          <select
            value={selectedActionFilter}
            onChange={(e) => setSelectedActionFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] cursor-pointer font-medium focus:outline-none focus:border-[#18A6A6]"
          >
            <option value="ALL">All Actions</option>
            <option value="CREATE">Create / Insert</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="PERMISSIONS_UPDATE">Permissions Updated</option>
            <option value="ROLE_CHANGE">Role Changed</option>
          </select>

          <select
            value={selectedEntityType}
            onChange={(e) => setSelectedEntityType(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-[#DCE4EB] rounded-xl text-[#10243A] cursor-pointer font-medium focus:outline-none focus:border-[#18A6A6]"
          >
            <option value="ALL">All Entity Types</option>
            <option value="DATABASE_RECORD">PostgreSQL DB Trigger</option>
            <option value="USER">User / Staff</option>
            <option value="DOCTOR">Doctor Master</option>
            <option value="CHEMIST">Chemist Master</option>
            <option value="PRODUCT">Product SKU</option>
            <option value="TERRITORY">Territory</option>
            <option value="COMPANY">Company Tenant</option>
          </select>
        </div>

        <div className="text-xs text-[#64748B] font-medium">
          Showing {filteredLogs.length} audit entries
        </div>
      </div>

      {/* Audit Log Timeline */}
      {filteredLogs.length === 0 ? (
        <div className="neu-card border border-[#DCE4EB] bg-white p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-[#137F83] mx-auto flex items-center justify-center">
            <History className="w-6 h-6 text-[#137F83]" />
          </div>
          <h3 className="font-bold text-[#10243A] text-sm">No Audit Trail Records Found</h3>
          <p className="text-xs text-[#64748B] max-w-sm mx-auto">
            All system actions (creating doctors, chemists, modifying permissions, or updating database records) are recorded in Supabase in real-time.
          </p>
        </div>
      ) : (
        <div className="neu-card border border-[#DCE4EB] bg-white overflow-hidden divide-y divide-[#DCE4EB] shadow-xs">
          {filteredLogs.map((log) => {
            const isCreate = log.action === 'CREATE';
            const isUpdate = log.action === 'UPDATE';
            const isDelete = log.action === 'DELETE';
            const isPerm = log.action === 'PERMISSIONS_UPDATE' || log.action === 'ROLE_CHANGE';

            return (
              <div key={log.id} className="p-4 hover:bg-[#F8FAFC] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${
                    isCreate ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                    isUpdate ? 'bg-blue-50 text-blue-600 border-blue-200' :
                    isDelete ? 'bg-rose-50 text-rose-600 border-rose-200' :
                    'bg-amber-50 text-amber-600 border-amber-200'
                  }`}>
                    {isCreate && <PlusCircle className="w-4 h-4" />}
                    {isUpdate && <Edit3 className="w-4 h-4" />}
                    {isDelete && <Trash2 className="w-4 h-4" />}
                    {isPerm && <Key className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#10243A]">{log.entityName}</span>
                      <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase tracking-wider ${
                        isCreate ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        isUpdate ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        isDelete ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {log.action}
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-1">{log.details}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#94A3B8]">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3" />
                        {log.actorName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F1F6F8] border border-[#DCE4EB] text-[#137F83] font-mono text-[10px]">
                    <Database className="w-3 h-3" />
                    ID: {log.entityId?.substring(0, 12)}...
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
