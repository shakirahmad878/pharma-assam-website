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
      <div className="neu-card p-6 border border-[#DCE4EB] bg-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-[#137F83] flex items-center justify-center font-bold">
                <Shield className="w-5 h-5 text-[#137F83]" />
              </div>
              <h2 className="text-xl font-bold text-[#10243A]">Role-Based Access Control (RBAC) Matrix</h2>
            </div>
            <p className="text-xs text-[#64748B] mt-1.5">
              Deterministic multi-tenant authorization rules governing data ownership and database operations in RepPulse.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-teal-50 text-[#137F83] border border-teal-200 font-medium">
              <Check className="w-3.5 h-3.5 text-[#137F83]" /> Enforced by Backend & Client Gate
            </span>
          </div>
        </div>

        {/* Roles Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DCE4EB]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#10243A] uppercase tracking-wider">Super Admin</span>
              <span className="text-[10px] bg-white text-[#137F83] px-2 py-0.5 rounded-full border border-[#DCE4EB] font-bold shadow-xs">Global Root</span>
            </div>
            <h3 className="text-sm font-bold text-[#10243A] mt-1.5">Platform Administrator</h3>
            <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
              Unrestricted access to all companies, master databases, system licenses, telemetry, and platform configurations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DCE4EB]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#10243A] uppercase tracking-wider">Admin</span>
              <span className="text-[10px] bg-white text-[#137F83] px-2 py-0.5 rounded-full border border-[#DCE4EB] font-bold shadow-xs">Company Scope</span>
            </div>
            <h3 className="text-sm font-bold text-[#10243A] mt-1.5">Pharma Company Admin</h3>
            <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
              Full control over company database: add, edit, remove doctors, chemists, products, territories, and manage Managers/MRs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DCE4EB]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#10243A] uppercase tracking-wider">Manager</span>
              <span className="text-[10px] bg-white text-[#137F83] px-2 py-0.5 rounded-full border border-[#DCE4EB] font-bold shadow-xs">Territory Scope</span>
            </div>
            <h3 className="text-sm font-bold text-[#10243A] mt-1.5">Area / Regional Manager</h3>
            <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
              Operates within company data permitted by Admin. Approves DCRs, Tour Plans, Expenses, and manages team operations.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#DCE4EB]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Medical Rep</span>
              <span className="text-[10px] bg-white text-[#64748B] px-2 py-0.5 rounded-full border border-[#DCE4EB] font-bold shadow-xs">Beat Scope</span>
            </div>
            <h3 className="text-sm font-bold text-[#10243A] mt-1.5">Field Representative</h3>
            <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
              Executes field calls, books POB orders, conducts RCPA, punches attendance, and submits daily reports.
            </p>
          </div>
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="neu-card border border-[#DCE4EB] bg-white overflow-hidden shadow-xs">
        <div className="p-5 border-b border-[#DCE4EB] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#10243A]">Enterprise Access Control Matrix</h3>
            <p className="text-xs text-[#64748B] mt-0.5">Detailed mapping of permissions across all RepPulse modules</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-teal-50 text-[#137F83] border border-teal-200">
            10 Active Core Modules
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F1F6F8] border-b border-[#DCE4EB] text-[#10243A] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Module & Scope</th>
                <th className="py-3.5 px-4">Feature / Action</th>
                <th className="py-3.5 px-4 text-[#10243A]">Super Admin</th>
                <th className="py-3.5 px-4 text-[#10243A]">Company Admin</th>
                <th className="py-3.5 px-4 text-[#10243A]">Manager</th>
                <th className="py-3.5 px-4 text-[#64748B]">Medical Rep (Field)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE4EB] font-medium text-[#10243A]">
              {permissionsList.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-4 font-bold text-[#10243A]">{row.module}</td>
                  <td className="py-3 px-4 text-[#64748B]">{row.feature}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[#137F83] font-semibold bg-teal-50 border border-teal-200">
                      <Check className="w-3.5 h-3.5 text-[#137F83]" />
                      {row.superAdmin}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[#137F83] font-semibold bg-teal-50 border border-teal-200">
                      <Check className="w-3.5 h-3.5 text-[#137F83]" />
                      {row.admin}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {row.manager.includes('No Access') ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[#94A3B8] font-normal bg-[#F1F6F8] border border-[#DCE4EB]">
                        <Lock className="w-3 h-3 text-[#94A3B8]" />
                        {row.manager}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[#137F83] font-semibold bg-teal-50 border border-teal-200">
                        <Check className="w-3.5 h-3.5 text-[#137F83]" />
                        {row.manager}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {row.rep.includes('No Access') ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[#94A3B8] bg-[#F1F6F8] border border-[#DCE4EB]">
                        <X className="w-3 h-3 text-[#94A3B8]" />
                        {row.rep}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[#10243A] bg-teal-50 border border-teal-200 font-semibold">
                        <Check className="w-3.5 h-3.5 text-[#137F83]" />
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
