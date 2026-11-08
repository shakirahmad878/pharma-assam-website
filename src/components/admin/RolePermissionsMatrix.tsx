import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Check, 
  X, 
  Lock, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Users,
  MapPin,
  Calendar,
  FileText,
  ShoppingBag,
  Sliders
} from 'lucide-react';
import { SupabaseService } from '../../services/supabaseService';
import { User } from '../../types';

interface RolePermissionRecord {
  id: string;
  role: 'MEDICAL_REP' | 'REGIONAL_MANAGER' | 'AREA_MANAGER' | 'HR_MANAGER' | 'SUPER_ADMIN';
  can_punch_attendance: boolean;
  can_view_all_telemetry: boolean;
  can_request_live_location: boolean;
  can_approve_late_login: boolean;
  can_approve_tour_reschedule: boolean;
  can_delete_doctors: boolean;
  can_approve_doctor_deletion: boolean;
  can_book_pob: boolean;
  can_view_mis_reports: boolean;
  can_manage_territories: boolean;
  description?: string;
}

interface RolePermissionsMatrixProps {
  currentUser?: User;
}

const PERMISSION_DEFINITIONS = [
  {
    key: 'can_punch_attendance' as const,
    label: 'Field Attendance Punch-In',
    category: 'Attendance & HR',
    description: 'Allow geotagged selfie and daily duty start/end punch.',
  },
  {
    key: 'can_view_all_telemetry' as const,
    label: 'Live Fleet GPS Telemetry',
    category: 'Tracking & Telemetry',
    description: 'View 15-minute periodic GPS breadcrumbs and MR live shifts.',
  },
  {
    key: 'can_request_live_location' as const,
    label: 'On-Demand Location Ping',
    category: 'Tracking & Telemetry',
    description: 'Trigger immediate satellite telemetry ping to field devices.',
  },
  {
    key: 'can_approve_late_login' as const,
    label: 'Late Login Approval (10:30 AM Cutoff)',
    category: 'Attendance & HR',
    description: 'Approve late start exceptions or bypass 10:30 AM deadline.',
  },
  {
    key: 'can_approve_tour_reschedule' as const,
    label: 'Tour Plan (MTP) Rescheduling',
    category: 'Field Operations',
    description: 'Approve beat route changes and monthly tour adjustments.',
  },
  {
    key: 'can_delete_doctors' as const,
    label: 'Delete Doctor / Chemist Master',
    category: 'Master Data',
    description: 'Directly delete HCPs and retail firms from directory.',
  },
  {
    key: 'can_approve_doctor_deletion' as const,
    label: 'Approve Doctor Deletion Requests',
    category: 'Master Data',
    description: 'Review and approve field deletion requests from MRs.',
  },
  {
    key: 'can_book_pob' as const,
    label: 'Product Order Booking (POB)',
    category: 'Commercial',
    description: 'Book retail chemist orders with PTS/PTR formulas in field.',
  },
  {
    key: 'can_view_mis_reports' as const,
    label: 'Executive MIS & Sales Analytics',
    category: 'Reporting',
    description: 'Access division performance, DCR summaries, and POB totals.',
  },
  {
    key: 'can_manage_territories' as const,
    label: 'Territory & Staff Alignment',
    category: 'Administration',
    description: 'Assign headquarters (Silchar, Hailakandi, Karimganj, Aizawl) and routes.',
  },
];

const CANONICAL_ROLES: ('SUPER_ADMIN' | 'REGIONAL_MANAGER' | 'AREA_MANAGER' | 'HR_MANAGER' | 'MEDICAL_REP')[] = [
  'SUPER_ADMIN',
  'REGIONAL_MANAGER',
  'AREA_MANAGER',
  'HR_MANAGER',
  'MEDICAL_REP',
];

export const RolePermissionsMatrix: React.FC<RolePermissionsMatrixProps> = ({ currentUser }) => {
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'REGIONAL_MANAGER';
  const [roles, setRoles] = useState<RolePermissionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const loadPermissions = async () => {
    setLoading(true);
    try {
      const data = await SupabaseService.fetchRolePermissions();
      if (Array.isArray(data) && data.length > 0) {
        setRoles(data);
      } else {
        // Fallback default structure if cloud is loading
        setRoles(
          CANONICAL_ROLES.map((role) => ({
            id: `perm_${role.toLowerCase()}`,
            role,
            can_punch_attendance: role === 'MEDICAL_REP' || role.includes('MANAGER'),
            can_view_all_telemetry: role !== 'MEDICAL_REP',
            can_request_live_location: role === 'SUPER_ADMIN' || role.includes('MANAGER'),
            can_approve_late_login: role === 'SUPER_ADMIN' || role.includes('MANAGER'),
            can_approve_tour_reschedule: role === 'SUPER_ADMIN' || role === 'REGIONAL_MANAGER',
            can_delete_doctors: role === 'SUPER_ADMIN',
            can_approve_doctor_deletion: role === 'SUPER_ADMIN' || role === 'REGIONAL_MANAGER',
            can_book_pob: role === 'MEDICAL_REP' || role === 'SUPER_ADMIN',
            can_view_mis_reports: role !== 'MEDICAL_REP',
            can_manage_territories: role === 'SUPER_ADMIN' || role === 'REGIONAL_MANAGER',
          }))
        );
      }
    } catch (err) {
      console.warn('Failed to load role permissions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  const handleToggle = async (roleName: string, permKey: keyof RolePermissionRecord) => {
    if (!isSuperAdmin) return;

    const currentRole = roles.find((r) => r.role === roleName);
    if (!currentRole) return;

    const updatedValue = !Boolean(currentRole[permKey]);
    const updatedRole: RolePermissionRecord = {
      ...currentRole,
      [permKey]: updatedValue,
    };

    // Optimistic UI update
    setRoles((prev) => prev.map((r) => (r.role === roleName ? updatedRole : r)));

    setSavingKey(`${roleName}-${String(permKey)}`);
    try {
      const success = await SupabaseService.saveRolePermission(updatedRole);
      if (success) {
        setSaveSuccess(`Updated ${roleName} ${String(permKey)}`);
        setTimeout(() => setSaveSuccess(null), 2500);
      }
    } catch (e) {
      console.error('Failed to save role permission:', e);
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
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
              Live database governance enforcing role permissions and capabilities across Mobile and Web.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {saveSuccess && (
              <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {saveSuccess}
              </span>
            )}
            <button
              onClick={loadPermissions}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-teal-50 text-[#137F83] border border-teal-200 font-medium hover:bg-teal-100 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Syncing...' : 'Reload from Cloud'}
            </button>
          </div>
        </div>

        {/* Roles Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-6">
          {CANONICAL_ROLES.map((roleName) => (
            <div key={roleName} className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#DCE4EB]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#10243A] uppercase tracking-wider">
                  {roleName.replace('_', ' ')}
                </span>
                <span className="text-[9px] bg-white text-[#137F83] px-2 py-0.5 rounded-full border border-[#DCE4EB] font-bold">
                  Active
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] mt-1.5 leading-relaxed line-clamp-2">
                {roleName === 'SUPER_ADMIN'
                  ? 'Master Administrator with unrestricted governance.'
                  : roleName === 'REGIONAL_MANAGER'
                  ? 'Oversees Barak Valley, Tripura & Mizoram field operations.'
                  : roleName === 'AREA_MANAGER'
                  ? 'Supervises assigned territory beats and field MRs.'
                  : roleName === 'HR_MANAGER'
                  ? 'Manages attendance compliance and payroll rosters.'
                  : 'Conducts doctor visits, chemist calls, and POB booking.'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="neu-card border border-[#DCE4EB] bg-white overflow-hidden shadow-xs">
        <div className="p-5 border-b border-[#DCE4EB] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#10243A]">Enterprise Access Control Matrix</h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Click any toggle to update authorization directly in Supabase PostgreSQL
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-xl bg-teal-50 text-[#137F83] border border-teal-200">
            {PERMISSION_DEFINITIONS.length} Managed Capabilities
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F1F6F8] border-b border-[#DCE4EB] text-[#10243A] font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 w-64">Permission & Description</th>
                <th className="py-3.5 px-4 text-center">Super Admin</th>
                <th className="py-3.5 px-4 text-center">Regional Mgr</th>
                <th className="py-3.5 px-4 text-center">Area Mgr</th>
                <th className="py-3.5 px-4 text-center">HR Mgr</th>
                <th className="py-3.5 px-4 text-center">Medical Rep</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE4EB] font-medium text-[#10243A]">
              {PERMISSION_DEFINITIONS.map((def) => (
                <tr key={def.key} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#10243A] block">{def.label}</span>
                    <span className="text-[11px] text-[#64748B]">{def.description}</span>
                  </td>

                  {CANONICAL_ROLES.map((roleName) => {
                    const r = roles.find((item) => item.role === roleName);
                    const isGranted = Boolean(r && r[def.key]);
                    const isSavingThis = savingKey === `${roleName}-${String(def.key)}`;

                    return (
                      <td key={roleName} className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggle(roleName, def.key)}
                          disabled={!isSuperAdmin || isSavingThis}
                          className={`inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                            isGranted
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          } ${!isSuperAdmin ? 'opacity-85 cursor-default' : 'cursor-pointer'}`}
                        >
                          {isSavingThis ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
                          ) : isGranted ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Granted</span>
                            </>
                          ) : (
                            <>
                              <X className="w-3.5 h-3.5 text-rose-500" />
                              <span>Denied</span>
                            </>
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
