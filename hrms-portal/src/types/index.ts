// =================== DARWINBOX-STYLE ENTERPRISE HRMS TYPES ===================

export type UserRole = 
  | 'HR_SUPER_ADMIN' 
  | 'HR_MANAGER' 
  | 'PAYROLL_OFFICER' 
  | 'EMPLOYEE';

export type WorkMode = 'FIELD_EXECUTIVE' | 'OFFICE_STAFF';

export interface HrmsUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  employeeCode: string;
  designation: string;
  grade: string;
  department: string;
  organizationUnit: string;
  locationHierarchy: string;
  l1Manager: { name: string; code: string };
  l2Manager: { name: string; code: string };
  hrbp: { name: string; code: string };
  joiningDate: string;
  avatarUrl?: string;
  isActive: boolean;
  phone: string;
  costCenter: string;
  workMode?: WorkMode;
  baseSalary?: number;
}

export type LeaveType = 
  | 'Casual Leave' 
  | 'Earned Leave' 
  | 'Sick Leave';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface LeaveBalanceRow {
  id: string;
  leaveType: LeaveType;
  annualQuota: number; // e.g. 14d
  carriedForward: number; // e.g. 0
  availedTillDate: number; // e.g. 1d or 4d
  currentBalance: number; // e.g. 12d or 0.5d
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  approvedBy?: string;
  managerRemarks?: string;
}

export interface EmployeeKYC {
  employeeId: string;
  panNumber: string;
  aadhaarNumber: string;
  uanNumber: string;
  esicNumber: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: 'SALARY' | 'SAVINGS' | 'CURRENT';
  nomineeName: string;
  nomineeRelation: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  bloodGroup: string;
  permanentAddress: string;
  status: 'VERIFIED' | 'UNDER_REVIEW' | 'PENDING';
  updatedAt: string;
}

export type AttendanceStatusCode = 'P' | 'A' | 'WO' | 'HD' | 'MPO' | 'H' | 'L';

export interface AttendanceRosterRow {
  id: string;
  date: string;
  shift: string; // e.g. "General" or "Weekly Off"
  expectedInTime: string; // "10:00"
  punchInTime: string; // "10:00" or "00:00"
  expectedOutTime: string; // "19:30"
  punchOutTime: string; // "17:30" or "00:00"
  workHours: string; // "07:30" or "NA"
  status: AttendanceStatusCode;
  selfieUrl?: string;
  latitude?: number;
  longitude?: number;
  isGeofenced?: boolean;
}

export interface AttendanceCounters {
  mis: number; // Missed Punches
  absent: number; // Absents
  halfDay: number; // Half Days
  regularizationRequests: number; // RR
}

export interface RegularizationRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  shift: string;
  requestedPunchIn: string;
  requestedPunchOut: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedDate: string;
  managerRemarks?: string;
}

export interface ClaimItem {
  id: string;
  expenseHead: string; // e.g. "Travel - Intercity", "Client Meal", "Mobile Bill"
  billNumber: string;
  billPeriod: string;
  eligibleAmount: number;
  claimAmount: number;
  billDate: string;
  receiptUrl?: string;
}

export interface ReimbursementClaim {
  id: string;
  claimNumber: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  costCenter: string;
  expenseCategory: string;
  totalClaimAmount: number;
  totalEligibleAmount: number;
  items: ClaimItem[];
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'DISBURSED';
  appliedDate: string;
}

export interface EarningsBreakdown {
  basic: number;
  hra: number;
  da: number;
  conveyance: number;
  medicalAllowance: number;
  specialAllowance: number;
  grossEarnings: number;
}

export interface DeductionsBreakdown {
  epfEmployee: number;
  esicEmployee: number;
  professionalTax: number;
  tds: number;
  otherDeductions: number;
  totalDeductions: number;
}

export interface EmployerContributions {
  epfEmployer: number;
  epsEmployer: number;
  epfAdminCharges: number;
  esicEmployer: number;
}

export interface PayslipRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  designation: string;
  department: string;
  location: string;
  month: string;
  year: number;
  payPeriod: string;
  bankAccount: string;
  bankName: string;
  panNumber: string;
  uanNumber: string;
  totalWorkingDays: number;
  presentDays: number;
  paidLeaveDays: number;
  lossOfPayDays: number;
  earnings: EarningsBreakdown;
  deductions: DeductionsBreakdown;
  employerContributions: EmployerContributions;
  netPay: number;
  paymentStatus: 'PAID' | 'PROCESSED' | 'PENDING';
  paymentDate?: string;
}

export interface BiometricDevice {
  id: string;
  deviceName: string;
  model: string;
  ipAddress: string;
  port: number;
  location: string;
  serialNumber: string;
  lastSyncTime: string;
  status: 'ONLINE' | 'OFFLINE' | 'SYNCING';
  totalPunchesToday: number;
}

export interface PerformanceGoal {
  id: string;
  employeeId: string;
  fiscalYear: string; // e.g. "Apr 2026 - Mar 2027"
  cycle: 'H1' | 'H2' | 'Annual';
  title: string;
  description: string;
  weightPercent: number;
  targetMetric: string;
  achievedMetric: string;
  score: number;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface WishesItem {
  id: string;
  type: 'BIRTHDAY' | 'WORK_ANNIVERSARY' | 'NEW_JOINER';
  name: string;
  employeeCode: string;
  designation: string;
  avatarUrl?: string;
  dateStr: string;
  detail: string;
}

export interface HolidayItem {
  id: string;
  name: string;
  dateStr: string;
  dayOfWeek: string;
  type: 'NATIONAL' | 'RESTRICTED';
}

export interface ExitWorkflow {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  resignationDate: string;
  expectedLastDay: string;
  reason: string;
  departmentClearances: {
    department: 'HR' | 'FINANCE' | 'IT_ASSETS' | 'REPORTING_MANAGER';
    cleared: boolean;
    remarks: string;
    clearedDate?: string;
  }[];
  fnfGratuity: number;
  fnfLeaveEncashment: number;
  fnfBonus: number;
  fnfNoticeDeductions: number;
  fnfNetPayable: number;
  status: 'INITIATED' | 'IN_CLEARANCE' | 'RELIEVED' | 'SETTLED';
}
