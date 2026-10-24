import { 
  HrmsUser, 
  LeaveBalanceRow, 
  LeaveRequest, 
  EmployeeKYC, 
  PayslipRecord, 
  AttendanceRosterRow,
  AttendanceCounters,
  RegularizationRequest,
  ReimbursementClaim,
  PerformanceGoal,
  WishesItem,
  HolidayItem,
  ExitWorkflow
} from '../types';
import { 
  INITIAL_USERS,
  PRIMARY_SUPER_ADMIN_USER,
  INITIAL_LEAVE_BALANCES, 
  INITIAL_LEAVE_REQUESTS, 
  INITIAL_ATTENDANCE_ROSTER,
  INITIAL_ATTENDANCE_COUNTERS,
  INITIAL_REGULARIZATIONS,
  INITIAL_REIMBURSEMENT_CLAIMS,
  INITIAL_GOALS,
  INITIAL_PAYSLIPS,
  INITIAL_WISHES,
  INITIAL_HOLIDAYS,
  INITIAL_EXIT_WORKFLOWS,
  createDefaultLeaveBalances
} from '../data/mockData';
import { SUPABASE_CONFIG, API_SERVER_URL } from '../config/supabase';

const KEYS = {
  USERS: 'pdc_hrms_users_v2',
  LEAVE_BALANCES: 'pdc_hrms_leave_balances_v2',
  LEAVES: 'pdc_hrms_leaves_v2',
  ATTENDANCE_ROSTER: 'pdc_hrms_attendance_roster_v2',
  ATTENDANCE_COUNTERS: 'pdc_hrms_attendance_counters_v2',
  REGULARIZATIONS: 'pdc_hrms_regularizations_v2',
  REIMBURSEMENTS: 'pdc_hrms_reimbursements_v2',
  GOALS: 'pdc_hrms_goals_v2',
  PAYSLIPS: 'pdc_hrms_payslips_v2',
  WISHES: 'pdc_hrms_wishes_v2',
  HOLIDAYS: 'pdc_hrms_holidays_v2',
  EXITS: 'pdc_hrms_exits_v2',
  KYC: 'pdc_hrms_kyc_v2',
};

function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Storage error', err);
  }
}

function getSupabaseHeaders() {
  return {
    apikey: SUPABASE_CONFIG.apiKey,
    Authorization: `Bearer ${SUPABASE_CONFIG.apiKey}`,
    'Content-Type': 'application/json',
  };
}

export class HrmsService {
  // ==========================================
  // 1. SUPABASE DATABASE & LIVE SERVER SYNC
  // ==========================================

  /**
   * Syncs live employees from Supabase database `employees` table.
   * If live records exist in Supabase, maps them into HrmsUser profiles!
   */
  static async syncWithSupabase(): Promise<HrmsUser[]> {
    try {
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/employees?order=employee_code.asc`, {
        method: 'GET',
        headers: getSupabaseHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Supabase query returned status ${res.status}`);
      }

      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        const liveUsers: HrmsUser[] = rows.map((e: any) => {
          const isCEO = e.employee_code === 'NLCL-0001';
          const isHRAdmin = e.employee_code === 'NLCL-0002' || e.role === 'SUPER_ADMIN';
          const isRSM = e.employee_code === 'NLCL-0003' || e.role === 'REGIONAL_MANAGER';

          let role: 'HR_SUPER_ADMIN' | 'HR_MANAGER' | 'EMPLOYEE' = 'EMPLOYEE';
          let designation = 'Medical Representative';
          let grade = 'B1 | Field Executive';
          let l1Manager = { name: 'Bodrud Jaman Sadiol (RSM)', code: 'NLCL-0003' };

          if (isCEO) {
            role = 'HR_SUPER_ADMIN';
            designation = 'Director';
            grade = 'L7 | Director & Executive Leadership';
            l1Manager = { name: 'Board of Directors', code: 'BOD' };
          } else if (isHRAdmin) {
            role = 'HR_SUPER_ADMIN';
            designation = 'HR Manager';
            grade = 'M2 | Manager';
            l1Manager = { name: 'Samsuj Sadiol (Director)', code: 'NLCL-0001' };
          } else if (isRSM) {
            role = 'HR_MANAGER';
            designation = 'Regional Sales Manager';
            grade = 'M1 | Regional Manager';
            l1Manager = { name: 'Samsuj Sadiol (Director)', code: 'NLCL-0001' };
          }

          return {
            id: e.id,
            name: e.name,
            employeeCode: e.employee_code,
            email: e.email || `${e.employee_code.toLowerCase()}@pappudacompany.com`,
            role,
            designation,
            grade,
            department: isCEO || isHRAdmin ? 'Corporate Leadership & Operations' : 'Pharmaceutical Field Sales & Distribution',
            organizationUnit: isCEO ? 'Pappu Da Company > Executive Board' : (isHRAdmin ? 'Pappu Da Company > People Operations' : 'Pappu Da Company > Field Sales'),
            locationHierarchy: (e.territory || e.headquarter || 'India > Assam > Silchar > Regional HQ').replace(/\bTripura\b/g, 'Agartala, Dharmanagar'),
            l1Manager,
            l2Manager: { name: isCEO ? 'Board of Directors' : 'Samsuj Sadiol (Director)', code: isCEO ? 'BOD' : 'NLCL-0001' },
            hrbp: { name: 'Shakir Ahmad Barbhuiya', code: 'NLCL-0002' },
            joiningDate: e.created_at ? new Date(e.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Jan 15, 2024',
            isActive: Boolean(e.is_active ?? true),
            phone: e.phone || '+91 94350 00000',
            costCenter: isCEO || isHRAdmin ? 'CC-CORP-SILCHAR' : 'CC-PHARMA-SILCHAR',
            workMode: isCEO || isHRAdmin ? 'OFFICE_STAFF' : 'FIELD_EXECUTIVE',
            baseSalary: isCEO ? 150000 : (isRSM || isHRAdmin ? 75000 : 42000),
          };
        });

        // Ensure all live users are sorted in order: NLCL-0001 to NLCL-0005
        const mergedUsers: HrmsUser[] = liveUsers.sort((a, b) => a.employeeCode.localeCompare(b.employeeCode));
        setItem(KEYS.USERS, mergedUsers);

        // Ensure each employee has standard leave quota balances (CL: 12d, EL: 15d, SL: 12d)
        mergedUsers.forEach(u => this.getLeaveBalances(u.id));
        return mergedUsers;
      }
    } catch (err) {
      console.warn('[HrmsService] Supabase employees sync warning:', err);
    }
    return this.getUsers();
  }

  /**
   * Syncs live attendance records from Supabase database `attendance` table.
   */
  static async syncAttendanceFromSupabase(): Promise<AttendanceRosterRow[]> {
    try {
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/attendance?order=created_at.desc&limit=50`, {
        method: 'GET',
        headers: getSupabaseHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Supabase attendance status ${res.status}`);
      }

      const rows = await res.json();
      if (Array.isArray(rows) && rows.length > 0) {
        const liveRoster: AttendanceRosterRow[] = rows.map((a: any) => {
          const punchIn = a.punch_in_timestamp 
            ? new Date(a.punch_in_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            : '10:00';
          const punchOut = a.punch_out_timestamp 
            ? new Date(a.punch_out_timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            : '00:00';

          const dateStr = a.date ? new Date(a.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today';

          return {
            id: a.id,
            date: dateStr,
            shift: 'Field Territory (GPS)',
            expectedInTime: '10:00',
            punchInTime: punchIn,
            expectedOutTime: '19:30',
            punchOutTime: punchOut,
            workHours: punchOut !== '00:00' ? '08:45' : 'Active Shift',
            status: a.status === 'ABSENT' ? 'A' : (a.status === 'LEAVE' ? 'L' : 'P'),
            selfieUrl: a.selfie_url,
            latitude: a.latitude,
            longitude: a.longitude,
            isGeofenced: true,
          };
        });

        // Merge with existing local punches
        const existing = this.getAttendanceRoster();
        const mergedMap = new Map<string, AttendanceRosterRow>();
        liveRoster.forEach(r => mergedMap.set(r.id, r));
        existing.forEach(r => {
          if (!mergedMap.has(r.id)) mergedMap.set(r.id, r);
        });

        const merged = Array.from(mergedMap.values());
        setItem(KEYS.ATTENDANCE_ROSTER, merged);
        return merged;
      }
    } catch (err) {
      console.warn('[HrmsService] Supabase attendance sync warning:', err);
    }
    return this.getAttendanceRoster();
  }

  // Check Database & Server Health
  static async checkConnectivity(): Promise<{ supabase: boolean; server: boolean }> {
    let supabaseOk = false;
    let serverOk = false;

    try {
      const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/employees?select=count`, {
        method: 'HEAD',
        headers: getSupabaseHeaders(),
      });
      supabaseOk = res.ok || res.status === 200 || res.status === 206;
    } catch {
      supabaseOk = false;
    }

    try {
      const res = await fetch('http://localhost:5000/api/health', { method: 'GET' });
      serverOk = res.ok;
    } catch {
      serverOk = false;
    }

    return { supabase: supabaseOk, server: serverOk };
  }

  // ==========================================
  // 2. EMPLOYEES & USERS
  // ==========================================

  static getUsers(): HrmsUser[] {
    const users = getItem<HrmsUser[]>(KEYS.USERS, INITIAL_USERS);
    const existingIndex = users.findIndex(
      u => u.employeeCode === PRIMARY_SUPER_ADMIN_USER.employeeCode || u.id === PRIMARY_SUPER_ADMIN_USER.id
    );

    let updated: HrmsUser[];
    if (existingIndex === -1) {
      updated = [PRIMARY_SUPER_ADMIN_USER, ...users];
    } else {
      updated = [...users];
      // Always guarantee authoritative fields match requirements:
      updated[existingIndex] = {
        ...updated[existingIndex],
        ...PRIMARY_SUPER_ADMIN_USER,
      };
      // Ensure Shakir is at index 0 as primary profile
      if (existingIndex !== 0) {
        const [shakir] = updated.splice(existingIndex, 1);
        updated.unshift(shakir);
      }
    }

    setItem(KEYS.USERS, updated);
    return updated;
  }

  static addUser(user: HrmsUser): HrmsUser[] {
    const users = this.getUsers();
    const updated = [...users, user];
    setItem(KEYS.USERS, updated);
    // Initialize default leave balances (CL 12d, EL 15d, SL 12d)
    this.getLeaveBalances(user.id);

    // Save directly to live Supabase database
    fetch(`${SUPABASE_CONFIG.url}/rest/v1/employees`, {
      method: 'POST',
      headers: { ...getSupabaseHeaders(), Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify({
        id: user.id,
        employee_code: user.employeeCode,
        name: user.name,
        email: user.email,
        role: user.role === 'HR_SUPER_ADMIN' ? 'SUPER_ADMIN' : (user.role === 'HR_MANAGER' ? 'REGIONAL_MANAGER' : 'MEDICAL_REP'),
        phone: user.phone || '9435000000',
        pin: '1234',
        territory: user.locationHierarchy,
        headquarter: user.locationHierarchy,
        is_active: true,
        updated_at: new Date().toISOString(),
      }),
    }).catch(err => console.warn('[HrmsService] Supabase employee insert warning:', err));

    return updated;
  }

  // ==========================================
  // 3. WISHES & HOLIDAYS
  // ==========================================

  static getWishes(): WishesItem[] {
    return getItem<WishesItem[]>(KEYS.WISHES, INITIAL_WISHES);
  }

  static getHolidays(): HolidayItem[] {
    return getItem<HolidayItem[]>(KEYS.HOLIDAYS, INITIAL_HOLIDAYS);
  }

  // ==========================================
  // 4. LEAVE BALANCES & APPLICATIONS
  // ==========================================

  static getLeaveBalances(userId: string): LeaveBalanceRow[] {
    const all = getItem<Record<string, LeaveBalanceRow[]>>(KEYS.LEAVE_BALANCES, INITIAL_LEAVE_BALANCES);
    if (!all[userId]) {
      const defaults = createDefaultLeaveBalances(userId);
      all[userId] = defaults;
      setItem(KEYS.LEAVE_BALANCES, all);
      return defaults;
    }
    return all[userId];
  }

  static getLeaveRequests(): LeaveRequest[] {
    return getItem<LeaveRequest[]>(KEYS.LEAVES, INITIAL_LEAVE_REQUESTS);
  }

  static applyLeave(req: Omit<LeaveRequest, 'id' | 'appliedDate' | 'status'>): LeaveRequest {
    const list = this.getLeaveRequests();
    const newReq: LeaveRequest = {
      ...req,
      id: `leave-${Date.now()}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'PENDING',
    };
    const updated = [newReq, ...list];
    setItem(KEYS.LEAVES, updated);

    // Deduct from balance
    const balances = this.getLeaveBalances(req.employeeId);
    const updatedBalances = balances.map(b => {
      if (b.leaveType === req.leaveType) {
        return {
          ...b,
          availedTillDate: b.availedTillDate + req.totalDays,
          currentBalance: Math.max(0, b.currentBalance - req.totalDays)
        };
      }
      return b;
    });
    const all = getItem<Record<string, LeaveBalanceRow[]>>(KEYS.LEAVE_BALANCES, INITIAL_LEAVE_BALANCES);
    all[req.employeeId] = updatedBalances;
    setItem(KEYS.LEAVE_BALANCES, all);

    return newReq;
  }

  static updateLeaveStatus(id: string, status: 'APPROVED' | 'REJECTED', approver: string): LeaveRequest[] {
    const list = this.getLeaveRequests();
    const updated = list.map(l => l.id === id ? { ...l, status, approvedBy: approver } : l);
    setItem(KEYS.LEAVES, updated);
    return updated;
  }

  // ==========================================
  // 5. ATTENDANCE & LIVE GEO-SELFIE PUNCH
  // ==========================================

  static getAttendanceCounters(): AttendanceCounters {
    return getItem<AttendanceCounters>(KEYS.ATTENDANCE_COUNTERS, INITIAL_ATTENDANCE_COUNTERS);
  }

  static getAttendanceRoster(): AttendanceRosterRow[] {
    return getItem<AttendanceRosterRow[]>(KEYS.ATTENDANCE_ROSTER, INITIAL_ATTENDANCE_ROSTER);
  }

  /**
   * Live Geo-Selfie Attendance Punch Engine:
   * 1. Records verified check-in to local roster
   * 2. Persists live record to Supabase database `attendance` table
   * 3. Forwards telemetry to Express server `/api/v1/hrms/attendance/punch`
   */
  static recordGeoSelfiePunch(params: {
    employeeId: string;
    employeeName: string;
    selfieUrl: string;
    latitude: number;
    longitude: number;
    isGeofenced: boolean;
    workMode?: 'FIELD_EXECUTIVE' | 'OFFICE_STAFF';
  }): AttendanceRosterRow {
    const roster = this.getAttendanceRoster();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}`;
    const punchId = `att_${Date.now()}`;

    const newRow: AttendanceRosterRow = {
      id: punchId,
      date: dateStr,
      shift: params.workMode === 'FIELD_EXECUTIVE' ? 'Field Territory (GPS)' : 'Office General',
      expectedInTime: '10:00',
      punchInTime: timeStr,
      expectedOutTime: '19:30',
      punchOutTime: '00:00',
      workHours: 'Active Shift',
      status: 'P',
      selfieUrl: params.selfieUrl,
      latitude: params.latitude,
      longitude: params.longitude,
      isGeofenced: params.workMode === 'FIELD_EXECUTIVE' ? true : params.isGeofenced,
    };

    const updated = [newRow, ...roster];
    setItem(KEYS.ATTENDANCE_ROSTER, updated);

    // Broadcast local update event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('attendance-updated'));
    }

    // 1. Post to live Supabase Database
    fetch(`${SUPABASE_CONFIG.url}/rest/v1/attendance`, {
      method: 'POST',
      headers: { ...getSupabaseHeaders(), Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify({
        id: punchId,
        employee_id: params.employeeId,
        employee_name: params.employeeName,
        date: new Date().toISOString().split('T')[0],
        punch_in_timestamp: new Date().toISOString(),
        status: 'PUNCHED_IN',
        latitude: params.latitude,
        longitude: params.longitude,
        accuracy_meters: 6,
        is_mock_location: false,
        battery_percentage: 95,
        selfie_url: params.selfieUrl,
        sync_status: 'SYNCED',
        server_id: `srv_${Date.now()}`,
      }),
    }).catch(err => console.warn('[HrmsService] Supabase attendance save warning:', err));

    // 2. Post to Local Express API Server if active
    fetch(`${API_SERVER_URL}/hrms/attendance/punch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'PUNCH_IN',
        latitude: params.latitude,
        longitude: params.longitude,
        selfieBase64: params.selfieUrl,
        isMockLocation: false,
      }),
    }).catch(() => {});

    return newRow;
  }

  static recordPunchOut(rowId: string): AttendanceRosterRow[] {
    const roster = this.getAttendanceRoster();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = roster.map(r => {
      if (r.id === rowId) {
        return {
          ...r,
          punchOutTime: timeStr,
          workHours: '08:45',
        };
      }
      return r;
    });
    setItem(KEYS.ATTENDANCE_ROSTER, updated);

    // Update in Supabase
    fetch(`${SUPABASE_CONFIG.url}/rest/v1/attendance?id=eq.${encodeURIComponent(rowId)}`, {
      method: 'PATCH',
      headers: getSupabaseHeaders(),
      body: JSON.stringify({
        punch_out_timestamp: new Date().toISOString(),
        status: 'PUNCHED_OUT',
      }),
    }).catch(() => {});

    return updated;
  }

  // ==========================================
  // 6. REGULARIZATIONS
  // ==========================================

  static getRegularizations(): RegularizationRequest[] {
    return getItem<RegularizationRequest[]>(KEYS.REGULARIZATIONS, INITIAL_REGULARIZATIONS);
  }

  static applyRegularization(req: Omit<RegularizationRequest, 'id' | 'appliedDate' | 'status'>): RegularizationRequest {
    const list = this.getRegularizations();
    const newReq: RegularizationRequest = {
      ...req,
      id: `reg-${Date.now()}`,
      appliedDate: '21 Oct 2026',
      status: 'PENDING',
    };
    const updated = [newReq, ...list];
    setItem(KEYS.REGULARIZATIONS, updated);

    const counters = this.getAttendanceCounters();
    setItem(KEYS.ATTENDANCE_COUNTERS, { ...counters, regularizationRequests: counters.regularizationRequests + 1 });

    return newReq;
  }

  static approveRegularization(id: string): RegularizationRequest[] {
    const list = this.getRegularizations();
    const updated = list.map(r => r.id === id ? { ...r, status: 'APPROVED' as const, managerRemarks: 'Approved by L1' } : r);
    setItem(KEYS.REGULARIZATIONS, updated);

    const reg = list.find(r => r.id === id);
    if (reg) {
      const roster = this.getAttendanceRoster();
      const updatedRoster = roster.map(row => {
        if (row.date === reg.date) {
          return {
            ...row,
            status: 'P' as const,
            punchInTime: reg.requestedPunchIn,
            punchOutTime: reg.requestedPunchOut,
            workHours: '09:30',
          };
        }
        return row;
      });
      setItem(KEYS.ATTENDANCE_ROSTER, updatedRoster);
    }
    return updated;
  }

  // ==========================================
  // 7. REIMBURSEMENTS & CLAIMS
  // ==========================================

  static getReimbursementClaims(): ReimbursementClaim[] {
    return getItem<ReimbursementClaim[]>(KEYS.REIMBURSEMENTS, INITIAL_REIMBURSEMENT_CLAIMS);
  }

  static submitReimbursementClaim(claim: Omit<ReimbursementClaim, 'id' | 'claimNumber' | 'appliedDate' | 'status'>): ReimbursementClaim {
    const list = this.getReimbursementClaims();
    const newClaim: ReimbursementClaim = {
      ...claim,
      id: `clm-${Date.now()}`,
      claimNumber: `CLM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'SUBMITTED',
    };
    const updated = [newClaim, ...list];
    setItem(KEYS.REIMBURSEMENTS, updated);

    // Forward to server expense API if online
    fetch(`${API_SERVER_URL}/hrms/expenses/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: newClaim.appliedDate,
        miscellaneousAmount: newClaim.totalClaimAmount,
        remarks: newClaim.expenseCategory,
      }),
    }).catch(() => {});

    return newClaim;
  }

  // ==========================================
  // 8. PERFORMANCE GOALS
  // ==========================================

  static getGoals(): PerformanceGoal[] {
    return getItem<PerformanceGoal[]>(KEYS.GOALS, INITIAL_GOALS);
  }

  static addGoal(goal: Omit<PerformanceGoal, 'id' | 'status'>): PerformanceGoal {
    const list = this.getGoals();
    const newGoal: PerformanceGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
      status: 'IN_PROGRESS',
    };
    const updated = [...list, newGoal];
    setItem(KEYS.GOALS, updated);
    return newGoal;
  }

  // ==========================================
  // 9. PAYSLIPS & STATUTORY PAYROLL
  // ==========================================

  static getPayslips(): PayslipRecord[] {
    return getItem<PayslipRecord[]>(KEYS.PAYSLIPS, INITIAL_PAYSLIPS);
  }

  static runMonthlyPayroll(monthYear: string, year: number): PayslipRecord[] {
    const users = this.getUsers().filter(u => u.isActive);
    const existing = this.getPayslips();

    const newPayslips: PayslipRecord[] = users.map((u, idx) => {
      let gross = u.baseSalary || 45000;
      if (u.role === 'HR_SUPER_ADMIN') gross = 120000;
      else if (u.role === 'HR_MANAGER') gross = 75000;

      const basic = Math.round(gross * 0.45);
      const hra = Math.round(gross * 0.22);
      const da = Math.round(gross * 0.10);
      const conveyance = 4000;
      const medical = 2500;
      const special = gross - (basic + hra + da + conveyance + medical);

      const epfEmployee = basic >= 15000 ? 1800 : Math.round(basic * 0.12);
      const epfEmployer = basic >= 15000 ? 550 : Math.round(basic * 0.0367);
      const epsEmployer = basic >= 15000 ? 1250 : Math.round(basic * 0.0833);
      const epfAdminCharges = Math.round(basic * 0.005);

      const isEsic = gross <= 21000;
      const esicEmployee = isEsic ? Math.round(gross * 0.0075) : 0;
      const esicEmployer = isEsic ? Math.round(gross * 0.0325) : 0;

      const pt = 200;
      const tds = gross > 100000 ? 14000 : 3800;
      const totalDeductions = epfEmployee + esicEmployee + pt + tds;

      const userKyc = this.getKYC(u.id);

      return {
        id: `pay-${year}-${idx + 1}-${Date.now()}`,
        employeeId: u.id,
        employeeName: u.name,
        employeeCode: u.employeeCode,
        designation: u.designation,
        department: u.department,
        location: u.locationHierarchy,
        month: monthYear,
        year: year,
        payPeriod: `01 ${monthYear} - End of Month`,
        bankAccount: userKyc?.accountNumber ? `••••${userKyc.accountNumber.slice(-4)}` : 'Pending Registration',
        bankName: userKyc?.bankName || 'Pending Registration',
        panNumber: userKyc?.panNumber || 'Pending Submission',
        uanNumber: userKyc?.uanNumber || 'Pending Submission',
        totalWorkingDays: 30,
        presentDays: 29,
        paidLeaveDays: 1,
        lossOfPayDays: 0,
        earnings: {
          basic,
          hra,
          da,
          conveyance,
          medicalAllowance: medical,
          specialAllowance: special,
          grossEarnings: gross,
        },
        deductions: {
          epfEmployee,
          esicEmployee,
          professionalTax: pt,
          tds,
          otherDeductions: 0,
          totalDeductions,
        },
        employerContributions: {
          epfEmployer,
          epsEmployer,
          epfAdminCharges,
          esicEmployer,
        },
        netPay: gross - totalDeductions,
        paymentStatus: 'PAID',
        paymentDate: new Date().toISOString().split('T')[0],
      };
    });

    const merged = [...newPayslips, ...existing.filter(p => p.month !== monthYear)];
    setItem(KEYS.PAYSLIPS, merged);
    return merged;
  }

  // ==========================================
  // 10. EXITS
  // ==========================================

  static getExitWorkflows(): ExitWorkflow[] {
    return getItem<ExitWorkflow[]>(KEYS.EXITS, INITIAL_EXIT_WORKFLOWS);
  }

  // ==========================================
  // 11. EMPLOYEE STATUTORY KYC & BANK DETAILS
  // ==========================================

  static getKYC(employeeId: string): EmployeeKYC | null {
    const all = getItem<Record<string, EmployeeKYC>>(KEYS.KYC, {});
    return all[employeeId] || null;
  }

  static saveKYC(kyc: EmployeeKYC): EmployeeKYC {
    const all = getItem<Record<string, EmployeeKYC>>(KEYS.KYC, {});
    all[kyc.employeeId] = kyc;
    setItem(KEYS.KYC, all);
    return kyc;
  }
}
