import { 
  HrmsUser, 
  LeaveBalanceRow, 
  LeaveRequest, 
  EmployeeKYC, 
  PayslipRecord, 
  BiometricDevice,
  AttendanceRosterRow,
  AttendanceCounters,
  RegularizationRequest,
  ReimbursementClaim,
  PerformanceGoal,
  WishesItem,
  HolidayItem,
  ExitWorkflow
} from '../types';

/**
 * Standard Leave Quotas as specified:
 * - Casual Leave (CL): 12 Days
 * - Earned Leave (EL): 15 Days
 * - Sick Leave (SL): 12 Days
 * With fractional half-day (0.5d) support.
 */
export const createDefaultLeaveBalances = (userId: string): LeaveBalanceRow[] => [
  { id: `lb-cl-${userId}`, leaveType: 'Casual Leave', annualQuota: 12, carriedForward: 0, availedTillDate: 0, currentBalance: 12 },
  { id: `lb-el-${userId}`, leaveType: 'Earned Leave', annualQuota: 15, carriedForward: 0, availedTillDate: 0, currentBalance: 15 },
  { id: `lb-sl-${userId}`, leaveType: 'Sick Leave', annualQuota: 12, carriedForward: 0, availedTillDate: 0, currentBalance: 12 },
];

/**
 * Official Employee Directory (NLCL-xxxx Hierarchy):
 * NLCL-0001: Samsuj Sadiol (Director)
 * NLCL-0002: Shakir Ahmad Barbhuiya (HR Manager / Super Admin)
 * NLCL-0003: Bodrud Jaman Sadiol (Regional Sales Manager)
 * NLCL-0004: Pranjal Malakar (Medical Representative)
 * NLCL-0005: Satyam (Medical Representative)
 */
export const PRIMARY_SUPER_ADMIN_USER: HrmsUser = {
  id: 'usr-nlcl-0002',
  employeeCode: 'NLCL-0002',
  name: 'Shakir Ahmad Barbhuiya',
  email: 'shakir.hr@pappudacompany.com',
  role: 'HR_SUPER_ADMIN', // Internal administrative clearance
  designation: 'HR Manager', // Public displayed role
  grade: 'M2 | Manager',
  department: 'Human Resources & Corporate People Operations',
  organizationUnit: 'Pappu Da Company > People Operations',
  locationHierarchy: 'India > Assam > Silchar > Corporate HQ',
  l1Manager: { name: 'Samsuj Sadiol (Director)', code: 'NLCL-0001' },
  l2Manager: { name: 'Board of Directors', code: 'BOD' },
  hrbp: { name: 'Self', code: 'NLCL-0002' },
  joiningDate: 'Jan 15, 2024',
  isActive: true,
  phone: '9101494287',
  costCenter: 'CC-HR-CORP-SILCHAR',
  workMode: 'OFFICE_STAFF',
  baseSalary: 75000,
};

export const USER_SAMSUJ_CEO: HrmsUser = {
  id: 'usr-nlcl-0001',
  employeeCode: 'NLCL-0001',
  name: 'Samsuj Sadiol',
  email: 'samsuj.ceo@pappudacompany.com',
  role: 'HR_SUPER_ADMIN',
  designation: 'Director',
  grade: 'L7 | Director & Executive Leadership',
  department: 'Executive Leadership & Corporate Management',
  organizationUnit: 'Pappu Da Company > Executive Board',
  locationHierarchy: 'India > Assam > Silchar > Regional HQ',
  l1Manager: { name: 'Board of Directors', code: 'BOD' },
  l2Manager: { name: 'Board of Directors', code: 'BOD' },
  hrbp: { name: 'Shakir Ahmad Barbhuiya', code: 'NLCL-0002' },
  joiningDate: 'Jan 01, 2024',
  isActive: true,
  phone: '6900700102',
  costCenter: 'CC-EXEC-SILCHAR',
  workMode: 'OFFICE_STAFF',
  baseSalary: 150000,
};

export const USER_BODRUD_RSM: HrmsUser = {
  id: 'usr-nlcl-0003',
  employeeCode: 'NLCL-0003',
  name: 'Bodrud Jaman Sadiol',
  email: 'bodrud.rsm@pappudacompany.com',
  role: 'HR_MANAGER',
  designation: 'Regional Sales Manager',
  grade: 'M1 | Regional Manager',
  department: 'Field Sales & Distribution Operations',
  organizationUnit: 'Pappu Da Company > Field Sales',
  locationHierarchy: 'India > Assam > Silchar > Regional HQ',
  l1Manager: { name: 'Samsuj Sadiol (Director)', code: 'NLCL-0001' },
  l2Manager: { name: 'Board of Directors', code: 'BOD' },
  hrbp: { name: 'Shakir Ahmad Barbhuiya', code: 'NLCL-0002' },
  joiningDate: 'Jan 15, 2024',
  isActive: true,
  phone: '8099139305',
  costCenter: 'CC-PHARMA-SILCHAR',
  workMode: 'FIELD_EXECUTIVE',
  baseSalary: 75000,
};

export const USER_PRANJAL_MR: HrmsUser = {
  id: 'usr-nlcl-0004',
  employeeCode: 'NLCL-0004',
  name: 'Pranjal Malakar',
  email: 'pranjal.mr@pappudacompany.com',
  role: 'EMPLOYEE',
  designation: 'Medical Representative',
  grade: 'B1 | Field Executive',
  department: 'Pharmaceutical Field Sales',
  organizationUnit: 'Pappu Da Company > Field Sales > Karimganj',
  locationHierarchy: 'India > Assam > Karimganj > Karimganj HQ',
  l1Manager: { name: 'Bodrud Jaman Sadiol (RSM)', code: 'NLCL-0003' },
  l2Manager: { name: 'Samsuj Sadiol (Director)', code: 'NLCL-0001' },
  hrbp: { name: 'Shakir Ahmad Barbhuiya', code: 'NLCL-0002' },
  joiningDate: 'Feb 01, 2024',
  isActive: true,
  phone: '9864378424',
  costCenter: 'CC-PHARMA-KARIMGANJ',
  workMode: 'FIELD_EXECUTIVE',
  baseSalary: 42000,
};

export const USER_SATYAM_MR: HrmsUser = {
  id: 'usr-nlcl-0005',
  employeeCode: 'NLCL-0005',
  name: 'Satyam',
  email: 'satyam.mr@pappudacompany.com',
  role: 'EMPLOYEE',
  designation: 'Medical Representative',
  grade: 'B1 | Field Executive',
  department: 'Pharmaceutical Field Sales',
  organizationUnit: 'Pappu Da Company > Field Sales > Silchar',
  locationHierarchy: 'India > Assam > Silchar > Silchar HQ',
  l1Manager: { name: 'Bodrud Jaman Sadiol (RSM)', code: 'NLCL-0003' },
  l2Manager: { name: 'Samsuj Sadiol (Director)', code: 'NLCL-0001' },
  hrbp: { name: 'Shakir Ahmad Barbhuiya', code: 'NLCL-0002' },
  joiningDate: 'Feb 15, 2024',
  isActive: true,
  phone: '9394831412',
  costCenter: 'CC-PHARMA-SILCHAR',
  workMode: 'FIELD_EXECUTIVE',
  baseSalary: 42000,
};

export const INITIAL_USERS: HrmsUser[] = [
  USER_SAMSUJ_CEO,
  PRIMARY_SUPER_ADMIN_USER,
  USER_BODRUD_RSM,
  USER_PRANJAL_MR,
  USER_SATYAM_MR,
];

export const INITIAL_LEAVE_BALANCES: Record<string, LeaveBalanceRow[]> = {
  'usr-nlcl-0001': createDefaultLeaveBalances('usr-nlcl-0001'),
  'usr-nlcl-0002': createDefaultLeaveBalances('usr-nlcl-0002'),
  'usr-nlcl-0003': createDefaultLeaveBalances('usr-nlcl-0003'),
  'usr-nlcl-0004': createDefaultLeaveBalances('usr-nlcl-0004'),
  'usr-nlcl-0005': createDefaultLeaveBalances('usr-nlcl-0005'),
};

export const INITIAL_ATTENDANCE_COUNTERS: AttendanceCounters = {
  mis: 0,
  absent: 0,
  halfDay: 0,
  regularizationRequests: 0,
};

export const INITIAL_ATTENDANCE_ROSTER: AttendanceRosterRow[] = [];

export const INITIAL_WISHES: WishesItem[] = [];

export const INITIAL_HOLIDAYS: HolidayItem[] = [
  {
    id: 'hol-1',
    name: 'Diwali (Deepavali)',
    dateStr: 'Mon, 09 Nov',
    dayOfWeek: 'Monday',
    type: 'NATIONAL',
  },
  {
    id: 'hol-2',
    name: 'Guru Nanak Jayanti',
    dateStr: 'Mon, 30 Nov',
    dayOfWeek: 'Monday',
    type: 'RESTRICTED',
  },
  {
    id: 'hol-3',
    name: 'Christmas Day',
    dateStr: 'Fri, 25 Dec',
    dayOfWeek: 'Friday',
    type: 'NATIONAL',
  },
  {
    id: 'hol-4',
    name: 'Republic Day',
    dateStr: 'Tue, 26 Jan',
    dayOfWeek: 'Tuesday',
    type: 'NATIONAL',
  }
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [];

export const INITIAL_REIMBURSEMENT_CLAIMS: ReimbursementClaim[] = [];

export const INITIAL_GOALS: PerformanceGoal[] = [];

export const INITIAL_PAYSLIPS: PayslipRecord[] = [];

export const INITIAL_REGULARIZATIONS: RegularizationRequest[] = [];

export const INITIAL_EXIT_WORKFLOWS: ExitWorkflow[] = [];
