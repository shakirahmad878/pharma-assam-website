import React from 'react';
import { Shield, Check, X, AlertCircle, Lock } from 'lucide-react';

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
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-teal-400" />
              <h2 className="text-xl font-bold text-white">Role-Based Access Control (RBAC) Matrix</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic multi-tenant authorization rules governing data ownership and database operations in RepPulse.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 font-medium">
              <Check className="w-3.5 h-3.5" /> Enforced by Backend & Client Gate
            </span>
          </div>
        </div>

        {/* Roles Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-lg bg-slate-800/80 border border-amber-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Super Admin</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">Global Root</span>
            </div>
            <h3 className="text-sm font-bold text-white mt-1">Platform Administrator</h3>
            <p className="text-[11px] text-slate-300 mt-1">
              Unrestricted access to all companies, master databases, system licenses, telemetry, and platform configurations.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-800/80 border border-teal-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Admin</span>
              <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-bold">Company Scope</span>
            </div>
            <h3 className="text-sm font-bold text-white mt-1">Pharma Company Admin</h3>
            <p className="text-[11px] text-slate-300 mt-1">
              Full control over their company's database: add, edit, remove doctors, chemists, products, territories, and manage Managers/MRs.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-800/80 border border-indigo-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Manager</span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-bold">Territory Scope</span>
            </div>
            <h3 className="text-sm font-bold text-white mt-1">Area / Regional Manager</h3>
            <p className="text-[11px] text-slate-300 mt-1">
              Operates within company data permitted by Admin. Approves DCRs, Tour Plans, Expenses, and manages team operations.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-800/80 border border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Medical Rep</span>
              <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-bold">Beat Scope</span>
            </div>
            <h3 className="text-sm font-bold text-white mt-1">Field Representative</h3>
            <p className="text-[11px] text-slate-300 mt-1">
              Executes field calls, books POB orders, conducts RCPA, punches attendance, and submits daily reports.
            </p>
          </div>
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Enterprise Access Control Matrix</h3>
            <p className="text-xs text-slate-500 mt-0.5">Detailed mapping of permissions across all RepPulse modules</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
            10 Active Core Modules
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Module & Scope</th>
                <th className="py-3.5 px-4">Feature / Action</th>
                <th className="py-3.5 px-4 text-amber-700 bg-amber-50/50">Super Admin</th>
                <th className="py-3.5 px-4 text-teal-700 bg-teal-50/50">Company Admin</th>
                <th className="py-3.5 px-4 text-indigo-700 bg-indigo-50/50">Manager</th>
                <th className="py-3.5 px-4 text-slate-700">Medical Rep (Field)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
              {permissionsList.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{row.module}</td>
                  <td className="py-3 px-4 text-slate-700">{row.feature}</td>
                  <td className="py-3 px-4 bg-amber-50/30">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-amber-800 font-semibold bg-amber-100 border border-amber-200">
                      <Check className="w-3.5 h-3.5 text-amber-700" />
                      {row.superAdmin}
                    </span>
                  </td>
                  <td className="py-3 px-4 bg-teal-50/30">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-teal-800 font-semibold bg-teal-100 border border-teal-200">
                      <Check className="w-3.5 h-3.5 text-teal-700" />
                      {row.admin}
                    </span>
                  </td>
                  <td className="py-3 px-4 bg-indigo-50/30">
                    {row.manager.includes('No Access') ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-slate-500 font-normal bg-slate-100 border border-slate-200">
                        <Lock className="w-3 h-3 text-slate-400" />
                        {row.manager}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-indigo-800 font-semibold bg-indigo-100 border border-indigo-200">
                        <Check className="w-3.5 h-3.5 text-indigo-700" />
                        {row.manager}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {row.rep.includes('No Access') ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-slate-400 bg-slate-100">
                        <X className="w-3 h-3 text-slate-400" />
                        {row.rep}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-slate-700 bg-slate-100 font-semibold">
                        <Check className="w-3.5 h-3.5 text-slate-600" />
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
