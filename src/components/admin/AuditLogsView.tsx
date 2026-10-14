import React, { useState } from 'react';
import { AuditLogEntry, User } from '../../types';
import { 
  History, 
  Search, 
  Edit3, 
  Trash2, 
  PlusCircle, 
  Key
} from 'lucide-react';

interface AuditLogsViewProps {
  auditLogs: AuditLogEntry[];
  currentUser: User;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ auditLogs = [], currentUser }) => {
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActionFilter, setSelectedActionFilter] = useState<string>('ALL');
  const [selectedEntityType, setSelectedEntityType] = useState<string>('ALL');

  const safeLogs = Array.isArray(auditLogs) ? auditLogs : [];

  // Filter logs by company if not Super Admin
  const scopedLogs = isSuperAdmin
    ? safeLogs
    : safeLogs.filter(log => !log.companyId || log.companyId === currentUser?.companyId);

  const filteredLogs = scopedLogs.filter(log => {
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
      <div className="neu-card p-6 border border-[#282319] shadow-neu-raised">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#6C5636]/20 border border-[#6C5636]/40 text-[#B99D73] flex items-center justify-center font-bold shadow-neu-sunken">
                <History className="w-5 h-5 text-[#B99D73]" />
              </div>
              <h2 className="text-xl font-bold text-[#F2ECE1]">Security & Database Audit Ledger</h2>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-[#181712] text-[#B99D73] border border-[#282319] px-2.5 py-0.5 rounded-full shadow-neu-sunken">
                Immutable Trail
              </span>
            </div>
            <p className="text-xs text-[#857866] mt-1.5">
              Full cryptographic tamper-evident activity log of user access grants, database modifications, and tenant provisioning.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-[#857866] block font-medium">Logged System Events</span>
            <span className="text-lg font-bold text-[#B99D73] font-mono">{scopedLogs.length} Events</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#857866]" />
            <input
              type="text"
              placeholder="Search actor, entity or change detail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="neu-input w-full pl-10 pr-3 py-2 text-xs"
            />
          </div>

          <select
            value={selectedActionFilter}
            onChange={(e) => setSelectedActionFilter(e.target.value)}
            className="neu-input px-3 py-2 text-xs bg-[#0c0c09] cursor-pointer font-medium"
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
            className="neu-input px-3 py-2 text-xs bg-[#0c0c09] cursor-pointer font-medium"
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

        <div className="text-xs text-[#857866] font-medium">
          Showing {filteredLogs.length} audit entries
        </div>
      </div>

      {/* Audit Log Timeline */}
      {filteredLogs.length === 0 ? (
        <div className="neu-card border border-[#282319] p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#181712] border border-[#282319] text-[#B99D73] mx-auto flex items-center justify-center shadow-neu-sunken">
            <History className="w-6 h-6 text-[#B99D73]" />
          </div>
          <h3 className="font-bold text-[#F2ECE1] text-sm">No Audit Trail Records</h3>
          <p className="text-xs text-[#857866] max-w-sm mx-auto">
            All system actions (creating doctors, chemists, modifying permissions, or updating database records) will automatically be recorded here in real-time.
          </p>
        </div>
      ) : (
        <div className="neu-card border border-[#282319] overflow-hidden divide-y divide-[#282319]">
          {filteredLogs.map((log) => {
            const isCreate = log.action === 'CREATE';
            const isUpdate = log.action === 'UPDATE';
            const isDelete = log.action === 'DELETE';
            const isPerm = log.action === 'PERMISSIONS_UPDATE' || log.action === 'ROLE_CHANGE';

            return (
              <div key={log.id} className="p-4 hover:bg-[#181712]/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-neu-sunken ${
                    isCreate ? 'bg-[#101912] text-[#A6C48A] border border-[#384D2B]/60' :
                    isUpdate ? 'bg-[#181712] text-[#B99D73] border border-[#6C5636]/60' :
                    isDelete ? 'bg-[#1c0f0f] text-[#E08A8A] border border-[#662B2B]/60' :
                    'bg-[#1a140b] text-[#D4BD95] border border-[#8A7049]/60'
                  }`}>
                    {isCreate && <PlusCircle className="w-4 h-4" />}
                    {isUpdate && <Edit3 className="w-4 h-4" />}
                    {isDelete && <Trash2 className="w-4 h-4" />}
                    {isPerm && <Key className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#F2ECE1]">{log.actorName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#181712] text-[#857866] border border-[#282319]">
                        {log.actorRole}
                      </span>
                      <span className="text-[#857866]">•</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        isCreate ? 'bg-[#101912] text-[#A6C48A] border border-[#384D2B]/60' :
                        isUpdate ? 'bg-[#181712] text-[#B99D73] border border-[#6C5636]/60' :
                        isDelete ? 'bg-[#1c0f0f] text-[#E08A8A] border border-[#662B2B]/60' :
                        'bg-[#1a140b] text-[#D4BD95] border border-[#8A7049]/60'
                      }`}>
                        {log.action}
                      </span>
                      <span className="text-[#B99D73] font-medium">[{log.entityType} : {log.entityName}]</span>
                    </div>

                    <p className="text-[#857866] mt-1 font-normal leading-relaxed">
                      {log.details}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-[#857866] mt-1">
                      <span>{new Date(log.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</span>
                      {log.companyName && (
                        <>
                          <span>•</span>
                          <span className="text-[#B99D73] font-medium">{log.companyName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="font-mono text-[10px] text-[#857866] shrink-0 self-start sm:self-center">
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
