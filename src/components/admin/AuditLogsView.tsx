import React, { useState } from 'react';
import { AuditLogEntry, User } from '../../types';
import { 
  History, 
  Search, 
  Filter, 
  ShieldAlert, 
  CheckCircle2, 
  UserCheck, 
  Edit3, 
  Trash2, 
  PlusCircle, 
  Key, 
  Database,
  Building2,
  Lock
} from 'lucide-react';

interface AuditLogsViewProps {
  auditLogs: AuditLogEntry[];
  currentUser: User;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ auditLogs, currentUser }) => {
  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActionFilter, setSelectedActionFilter] = useState<string>('ALL');
  const [selectedEntityType, setSelectedEntityType] = useState<string>('ALL');

  // Filter logs by company if not Super Admin
  const scopedLogs = isSuperAdmin
    ? auditLogs
    : auditLogs.filter(log => !log.companyId || log.companyId === currentUser.companyId);

  const filteredLogs = scopedLogs.filter(log => {
    const matchesSearch =
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = selectedActionFilter === 'ALL' || log.action === selectedActionFilter;
    const matchesEntity = selectedEntityType === 'ALL' || log.entityType === selectedEntityType;

    return matchesSearch && matchesAction && matchesEntity;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-6 h-6 text-teal-400" />
              <h2 className="text-xl font-bold text-white">Security & Database Audit Ledger</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded">
                Immutable Trail
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Full cryptographic tamper-evident activity log of user access grants, database modifications, and tenant provisioning.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-medium">Logged System Events</span>
            <span className="text-lg font-bold text-teal-400 font-mono">{scopedLogs.length} Events</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search actor, entity or change detail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-900"
            />
          </div>

          <select
            value={selectedActionFilter}
            onChange={(e) => setSelectedActionFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-700"
          >
            <option value="ALL">All Actions</option>
            <option value="CREATE">Create Record</option>
            <option value="UPDATE">Update Record</option>
            <option value="DELETE">Delete Record</option>
            <option value="PERMISSIONS_UPDATE">Permissions Updated</option>
            <option value="ROLE_CHANGE">Role Changed</option>
          </select>

          <select
            value={selectedEntityType}
            onChange={(e) => setSelectedEntityType(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium text-slate-700"
          >
            <option value="ALL">All Entity Types</option>
            <option value="USER">User / Staff</option>
            <option value="DOCTOR">Doctor Master</option>
            <option value="CHEMIST">Chemist Master</option>
            <option value="PRODUCT">Product SKU</option>
            <option value="TERRITORY">Territory</option>
            <option value="COMPANY">Company Tenant</option>
            <option value="DATABASE_RECORD">Master Database</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing {filteredLogs.length} audit entries
        </div>
      </div>

      {/* Audit Log Timeline */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <History className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">No Audit Trail Records</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            All system actions (creating doctors, chemists, modifying permissions, or updating database records) will automatically be recorded here in real-time.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
          {filteredLogs.map((log) => {
            const isCreate = log.action === 'CREATE';
            const isUpdate = log.action === 'UPDATE';
            const isDelete = log.action === 'DELETE';
            const isPerm = log.action === 'PERMISSIONS_UPDATE' || log.action === 'ROLE_CHANGE';

            return (
              <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    isCreate ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                    isUpdate ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' :
                    isDelete ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                    'bg-amber-50 text-amber-600 border border-amber-200'
                  }`}>
                    {isCreate && <PlusCircle className="w-4 h-4" />}
                    {isUpdate && <Edit3 className="w-4 h-4" />}
                    {isDelete && <Trash2 className="w-4 h-4" />}
                    {isPerm && <Key className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.actorName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-slate-100 text-slate-700">
                        {log.actorRole}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                        isCreate ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        isUpdate ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                        isDelete ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {log.action}
                      </span>
                      <span className="text-slate-500 font-medium">[{log.entityType} : {log.entityName}]</span>
                    </div>

                    <p className="text-slate-700 mt-1 font-normal leading-relaxed">
                      {log.details}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span>{new Date(log.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
                      {log.companyName && (
                        <>
                          <span>•</span>
                          <span className="text-slate-600 font-medium">{log.companyName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="font-mono text-[10px] text-slate-400 shrink-0 self-start sm:self-center">
                  ID: {log.id}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
