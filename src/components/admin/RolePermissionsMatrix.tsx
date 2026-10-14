import React from 'react';
import { Shield, Check, X, Lock } from 'lucide-react';

export const RolePermissionsMatrix: React.FC = () => {
  const permissionsList = [
    {
      module: 'Platform & Multi-Tenancy',
      feature: 'Create & Manage Pharma Companies',
      superAdmin: 'Full Access (All Companies)',
      admin: 'Restricted (Own Company Only)',
      manager: 'No Access',
      rep: 'No Access',
    },
    {
      module: 'User & Staff Management',
      feature: 'Add / Edit / Remove Staff & Admins',
      superAdmin: 'Full Access (All Companies)',
      admin: 'Full Access (Own Company)',
      manager: 'Delegated / View Team Only',
      rep: 'No Access',
    },
    {
      module: 'Access Control & Permissions',
      feature: 'Grant / Revoke Granular Permissions',
      superAdmin: 'Full Access (Global)',
      admin: 'Full Access (For Managers & Reps)',
      manager: 'No Access',
      rep: 'No Access',
    },
    {
      module: 'Master Database Management',
      feature: 'Doctor, Chemist & Product Master CRUD',
      superAdmin: 'Full Database Access (All)',
      admin: 'Full Database Access (Own Company)',
      manager: 'Add/Edit Allowed if Granted',
      rep: 'View Only (Assigned Beats)',
    },
    {
      module: 'Territory & HQ Alignment',
      feature: 'Create Territories & Assign Beats',
      superAdmin: 'Full Access (All Zones)',
      admin: 'Full Access (Company Zones)',
      manager: 'View Assigned Territories',
      rep: 'View Assigned Beat Only',
    },
    {
      module: 'Live GPS Telemetry & Tracking',
      feature: '15-Min Live GPS Breadcrumbs & Replays',
      superAdmin: 'Full Access (All Staff)',
      admin: 'Full Access (Company Staff)',
      manager: 'Restricted by Privacy Gate',
      rep: 'Self-Telemetry Only',
    },
    {
      module: 'Field Reporting (DCR & TP)',
      feature: 'Daily Call Report & Tour Plan Approvals',
      superAdmin: 'Global View & Override',
      admin: 'Company-wide Approvals',
      manager: 'Assigned Team Approvals',
      rep: 'Create & Submit Own Reports',
    },
    {
      module: 'Orders & RCPA Audits',
      feature: 'Product Order Booking & Audit Analytics',
      superAdmin: 'Global Analytics & Export',
      admin: 'Company Orders & Exports',
      manager: 'Team Orders & Territory Audit',
      rep: 'Book POB & Log RCPA in Field',
    },
    {
      module: 'HRMS & Expenses',
      feature: 'Geo-Attendance & Travel Mileage Approval',
      superAdmin: 'Global Payroll Audit',
      admin: 'Company Expense Approvals',
      manager: 'Team Mileage Verification',
      rep: 'Punch In & Submit Claims',
    },
    {
      module: 'Security & Audit Trail',
      feature: 'View System Audit Logs & DB Backups',
      superAdmin: 'Full Global Audit Logs',
      admin: 'Company Activity Logs',
      manager: 'View Team Activity Logs',
      rep: 'No Access',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="neu-card p-6 border border-[#282319] shadow-neu-raised">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#6C5636]/20 border border-[#6C5636]/40 text-[#B99D73] flex items-center justify-center font-bold shadow-neu-sunken">
                <Shield className="w-5 h-5 text-[#B99D73]" />
              </div>
              <h2 className="text-xl font-bold text-[#F2ECE1]">Role-Based Access Control (RBAC) Matrix</h2>
            </div>
            <p className="text-xs text-[#857866] mt-1.5">
              Deterministic multi-tenant authorization rules governing data ownership and database operations in RepPulse.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-[#181712] text-[#B99D73] border border-[#282319] font-medium shadow-neu-sunken">
              <Check className="w-3.5 h-3.5 text-[#B99D73]" /> Enforced by Backend & Client Gate
            </span>
          </div>
        </div>

        {/* Roles Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-[#0c0c09] border border-[#282319] shadow-neu-sunken">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#B99D73] uppercase tracking-wider">Super Admin</span>
              <span className="text-[10px] bg-[#181712] text-[#B99D73] px-2 py-0.5 rounded-full border border-[#282319] font-bold">Global Root</span>
            </div>
            <h3 className="text-sm font-bold text-[#F2ECE1] mt-1.5">Platform Administrator</h3>
            <p className="text-[11px] text-[#857866] mt-1 leading-relaxed">
              Unrestricted access to all companies, master databases, system licenses, telemetry, and platform configurations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0c0c09] border border-[#282319] shadow-neu-sunken">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#B99D73] uppercase tracking-wider">Admin</span>
              <span className="text-[10px] bg-[#181712] text-[#B99D73] px-2 py-0.5 rounded-full border border-[#282319] font-bold">Company Scope</span>
            </div>
            <h3 className="text-sm font-bold text-[#F2ECE1] mt-1.5">Pharma Company Admin</h3>
            <p className="text-[11px] text-[#857866] mt-1 leading-relaxed">
              Full control over company database: add, edit, remove doctors, chemists, products, territories, and manage Managers/MRs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0c0c09] border border-[#282319] shadow-neu-sunken">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#B99D73] uppercase tracking-wider">Manager</span>
              <span className="text-[10px] bg-[#181712] text-[#B99D73] px-2 py-0.5 rounded-full border border-[#282319] font-bold">Territory Scope</span>
            </div>
            <h3 className="text-sm font-bold text-[#F2ECE1] mt-1.5">Area / Regional Manager</h3>
            <p className="text-[11px] text-[#857866] mt-1 leading-relaxed">
              Operates within company data permitted by Admin. Approves DCRs, Tour Plans, Expenses, and manages team operations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#0c0c09] border border-[#282319] shadow-neu-sunken">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#857866] uppercase tracking-wider">Medical Rep</span>
              <span className="text-[10px] bg-[#181712] text-[#857866] px-2 py-0.5 rounded-full border border-[#282319] font-bold">Beat Scope</span>
            </div>
            <h3 className="text-sm font-bold text-[#F2ECE1] mt-1.5">Field Representative</h3>
            <p className="text-[11px] text-[#857866] mt-1 leading-relaxed">
              Executes field calls, books POB orders, conducts RCPA, punches attendance, and submits daily reports.
            </p>
          </div>
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="neu-card border border-[#282319] overflow-hidden">
        <div className="p-5 border-b border-[#282319] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#F2ECE1]">Enterprise Access Control Matrix</h3>
            <p className="text-xs text-[#857866] mt-0.5">Detailed mapping of permissions across all RepPulse modules</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-[#181712] text-[#B99D73] border border-[#282319] shadow-neu-sunken">
            10 Active Core Modules
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0c0c09] border-b border-[#282319] text-[#857866] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Module & Scope</th>
                <th className="py-3.5 px-4">Feature / Action</th>
                <th className="py-3.5 px-4 text-[#B99D73]">Super Admin</th>
                <th className="py-3.5 px-4 text-[#D4BD95]">Company Admin</th>
                <th className="py-3.5 px-4 text-[#B99D73]">Manager</th>
                <th className="py-3.5 px-4 text-[#857866]">Medical Rep (Field)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282319] font-medium text-[#F2ECE1]">
              {permissionsList.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#181712]/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#F2ECE1]">{row.module}</td>
                  <td className="py-3 px-4 text-[#857866]">{row.feature}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[#B99D73] font-semibold bg-[#181712] border border-[#282319] shadow-neu-sunken">
                      <Check className="w-3.5 h-3.5 text-[#B99D73]" />
                      {row.superAdmin}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[#D4BD95] font-semibold bg-[#181712] border border-[#282319] shadow-neu-sunken">
                      <Check className="w-3.5 h-3.5 text-[#D4BD95]" />
                      {row.admin}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {row.manager.includes('No Access') ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[#857866] font-normal bg-[#0c0c09] border border-[#282319]">
                        <Lock className="w-3 h-3 text-[#857866]" />
                        {row.manager}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[#B99D73] font-semibold bg-[#181712] border border-[#282319] shadow-neu-sunken">
                        <Check className="w-3.5 h-3.5 text-[#B99D73]" />
                        {row.manager}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {row.rep.includes('No Access') ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[#857866] bg-[#0c0c09] border border-[#282319]">
                        <X className="w-3 h-3 text-[#857866]" />
                        {row.rep}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[#F2ECE1] bg-[#181712] border border-[#282319] font-semibold shadow-neu-sunken">
                        <Check className="w-3.5 h-3.5 text-[#B99D73]" />
                        {row.rep}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
