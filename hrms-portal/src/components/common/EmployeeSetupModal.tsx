import React, { useState } from 'react';
import { HrmsUser, UserRole, WorkMode } from '../../types';
import { HrmsService } from '../../services/hrmsService';
import { 
  UserPlus, 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck, 
  DollarSign, 
  X,
  CheckCircle2,
  Navigation,
  Briefcase
} from 'lucide-react';

interface EmployeeSetupModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onEmployeeCreated: (newUser: HrmsUser) => void;
  isFirstEmployee?: boolean;
}

export const EmployeeSetupModal: React.FC<EmployeeSetupModalProps> = ({
  isOpen,
  onClose,
  onEmployeeCreated,
  isFirstEmployee = false
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [employeeCode, setEmployeeCode] = useState('PDC-001');
  const [role, setRole] = useState<UserRole>('EMPLOYEE');
  const [workMode, setWorkMode] = useState<WorkMode>('FIELD_EXECUTIVE');
  const [designation, setDesignation] = useState('Senior Territory Sales Specialist');
  const [department, setDepartment] = useState('Field Sales & Distribution');
  const [organizationUnit, setOrganizationUnit] = useState('Pappu Da Company > Pharmaceuticals');
  const [locationHierarchy, setLocationHierarchy] = useState('India > Assam > Silchar > Central Hub');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [l1ManagerName, setL1ManagerName] = useState('Area Sales Manager');
  const [l1ManagerCode, setL1ManagerCode] = useState('MGR-01');
  const [baseSalary, setBaseSalary] = useState<number>(45000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newUser: HrmsUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@pappudacompany.com`,
      role,
      employeeCode: employeeCode.trim() || `PDC-${Math.floor(100 + Math.random() * 900)}`,
      designation: designation.trim() || 'Executive',
      grade: role === 'HR_SUPER_ADMIN' ? 'L6 | Executive' : 'B1 | Lead',
      department: department.trim() || 'Operations',
      organizationUnit: organizationUnit.trim() || 'Pappu Da Company',
      locationHierarchy: locationHierarchy.trim() || 'Silchar, Assam',
      l1Manager: { name: l1ManagerName.trim() || 'Director', code: l1ManagerCode.trim() || 'MGR-01' },
      l2Manager: { name: 'Managing Director', code: 'MD-01' },
      hrbp: { name: 'People Operations', code: 'HR-01' },
      joiningDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      phone: phone.trim() || '+91 98000 00000',
      costCenter: 'CC-DEFAULT-01',
      workMode,
      baseSalary,
      isActive: true,
    };

    HrmsService.addUser(newUser);
    onEmployeeCreated(newUser);
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 animate-scale-up">
        
        {/* Header */}
        <div className="bg-[#0B192C] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-xl">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base tracking-tight">
                {isFirstEmployee ? 'Welcome! Set Up Your Employee Profile' : 'Add New Employee Profile'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isFirstEmployee 
                  ? 'Enter your real organizational details to initialize the HRMS portal' 
                  : 'Add team members with customized designations & attendance modes'}
              </p>
            </div>
          </div>
          {!isFirstEmployee && onClose && (
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Statutory Leave Quota Highlight Banner */}
          <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl p-3 flex items-center justify-between text-sky-900">
            <div>
              <span className="font-bold block text-[11px]">Configured Company Leave Policy:</span>
              <span className="text-[11px] text-sky-700">CL (12 Days) • EL (15 Days) • SL (12 Days) with half-day support</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-600 text-white">Active</span>
          </div>

          {/* Full Name & Employee Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 font-semibold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Employee Code / ID *</label>
              <input
                type="text"
                value={employeeCode}
                onChange={e => setEmployeeCode(e.target.value)}
                placeholder="e.g. PDC-001"
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 font-mono font-bold"
              />
            </div>
          </div>

          {/* Work Mode & System Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-sky-600" />
                Attendance Work Mode *
              </label>
              <select
                value={workMode}
                onChange={e => setWorkMode(e.target.value as WorkMode)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 font-bold focus:outline-none focus:border-sky-500"
              >
                <option value="FIELD_EXECUTIVE">Field Executive (Anywhere GPS Check-In)</option>
                <option value="OFFICE_STAFF">Office Staff (Fixed 100m Geofence)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">System Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:border-sky-500 font-semibold"
              >
                <option value="EMPLOYEE">Employee / Field Staff</option>
                <option value="HR_MANAGER">Manager / Approver</option>
                <option value="HR_SUPER_ADMIN">HR Super Admin</option>
              </select>
            </div>
          </div>

          {/* Designation & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                value={designation}
                onChange={e => setDesignation(e.target.value)}
                placeholder="e.g. Senior Medical Representative"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={e => setDepartment(e.target.value)}
                placeholder="e.g. Field Sales & Distribution"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Location & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Base / Territory Location</label>
              <input
                type="text"
                value={locationHierarchy}
                onChange={e => setLocationHierarchy(e.target.value)}
                placeholder="e.g. Silchar, Assam / Head Office"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="e.g. rahul@pappudacompany.com"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Phone & Base Monthly Salary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                Monthly Gross CTC (₹)
              </label>
              <input
                type="number"
                min="10000"
                value={baseSalary}
                onChange={e => setBaseSalary(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 font-mono font-bold"
              />
            </div>
          </div>

          {/* L1 Reporting Manager */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">L1 Reporting Manager Name</label>
            <input
              type="text"
              value={l1ManagerName}
              onChange={e => setL1ManagerName(e.target.value)}
              placeholder="e.g. Area Sales Manager"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            {!isFirstEmployee && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-bold cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isFirstEmployee ? 'Complete Setup & Launch Portal' : 'Save Employee Profile'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
