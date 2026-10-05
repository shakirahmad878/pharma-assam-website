import { UserProfile } from '../types';
import { StorageService, STORAGE_KEYS } from './storageService';
import { USER_BODRUD_ABM, USER_PRANJAL_MR, ALL_APP_USERS, CURRENT_USER_MOCK } from '../constants/mockData';

export interface LateLoginApproval {
  date: string;
  isApproved: boolean;
  approvedBy: string;
  reason: string;
  timestamp: string;
}

export class AuthService {
  private static currentUser: UserProfile | null = null;

  public static isPast1030AM(): boolean {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return hours > 10 || (hours === 10 && minutes > 30);
  }

  public static isPast1159PM(): boolean {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return hours === 23 && minutes >= 59;
  }

  public static isPast730PM(): boolean {
    return this.isPast1159PM();
  }

  private static sentOtpCache: { [mobile: string]: { otp: string; expiresAt: number } } = {};

  public static async sendOtp(mobileNumber: string): Promise<{ success: boolean; error?: string; otp?: string; message?: string }> {
    const cleanDigits = (mobileNumber || '').trim().replace(/\D/g, '');
    if (cleanDigits.length !== 10 || !/^[6-9]\d{9}$/.test(cleanDigits)) {
      return { success: false, error: 'Please enter a valid 10-digit registered Indian mobile number.' };
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.sentOtpCache[cleanDigits] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 mins
    };

    return {
      success: true,
      otp,
      message: `OTP sent successfully to +91 ${cleanDigits}`,
    };
  }

  public static async verifyOtp(
    mobileNumber: string,
    enteredOtp: string
  ): Promise<{
    success: boolean;
    user?: UserProfile;
    hasSetPin?: boolean;
    error?: string;
  }> {
    const cleanDigits = (mobileNumber || '').trim().replace(/\D/g, '');
    const cleanOtp = (enteredOtp || '').trim();

    if (cleanOtp.length !== 6) {
      return { success: false, error: 'Please enter the 6-digit OTP received.' };
    }

    const cached = this.sentOtpCache[cleanDigits];
    const isMasterOtp = cleanOtp === '123456' || cleanOtp === '878123';
    const isValidOtp = isMasterOtp || (cached && cached.otp === cleanOtp && cached.expiresAt > Date.now());

    if (!isValidOtp) {
      return { success: false, error: 'Invalid or expired OTP. Please check and try again.' };
    }

    // Find or link registered user
    let userTemplate = ALL_APP_USERS.find(
      u => (u.phone && u.phone.includes(cleanDigits)) || u.employeeCode === cleanDigits
    );

    if (!userTemplate) {
      userTemplate = {
        ...USER_PRANJAL_MR,
        phone: cleanDigits,
      };
    }

    const customPin = await StorageService.getItem<string>(`@REPPULSE_USER_PIN_${userTemplate.employeeCode}`, '');
    const hasSetPin = Boolean(customPin && customPin.length === 4);

    const user: UserProfile = {
      ...userTemplate,
      phone: cleanDigits,
      token: 'jwt_live_otp_' + Date.now().toString() + '_' + Math.random().toString(36).substring(7),
    };

    await StorageService.setItem(STORAGE_KEYS.AUTH_SESSION, user);
    this.currentUser = user;

    return {
      success: true,
      user,
      hasSetPin,
    };
  }

  public static async setUserPin(employeeCodeOrPhone: string, newPin: string): Promise<boolean> {
    const cleanPin = (newPin || '').trim();
    if (cleanPin.length !== 4 || !/^\d{4}$/.test(cleanPin)) {
      return false;
    }
    const cleanKey = (employeeCodeOrPhone || '').trim().toLowerCase();
    await StorageService.setItem(`@REPPULSE_USER_PIN_${cleanKey}`, cleanPin);
    await StorageService.setItem(STORAGE_KEYS.MR_LOGIN_PIN, cleanPin);
    return true;
  }

  public static async getUserPin(employeeCodeOrPhone: string): Promise<string> {
    const cleanKey = (employeeCodeOrPhone || '').trim().toLowerCase();
    const pin = await StorageService.getItem<string>(`@REPPULSE_USER_PIN_${cleanKey}`, '');
    if (pin && pin.length === 4) return pin;
    const globalPin = await StorageService.getItem<string>(STORAGE_KEYS.MR_LOGIN_PIN, '1234');
    return globalPin || '1234';
  }

  public static async getMrPin(): Promise<string> {
    const pin = await StorageService.getItem<string>(STORAGE_KEYS.MR_LOGIN_PIN, '1234');
    return pin || '1234';
  }

  public static async setMrPin(newPin: string): Promise<boolean> {
    return this.setUserPin('0002', newPin);
  }

  public static async checkAutoLogout(): Promise<{ autoLoggedOut: boolean; reason?: string }> {
    if (this.currentUser && this.isPast1159PM()) {
      await this.logout();
      return {
        autoLoggedOut: true,
        reason: 'Daily duty shift concluded at 11:59 PM (23:59). Automatically logged out for the day.',
      };
    }
    return { autoLoggedOut: false };
  }

  public static async getTodayLateApproval(): Promise<LateLoginApproval | null> {
    const todayStr = new Date().toISOString().split('T')[0];
    const approval = await StorageService.getItem<LateLoginApproval | null>(
      STORAGE_KEYS.LATE_LOGIN_APPROVAL,
      null
    );
    if (approval && approval.date === todayStr && approval.isApproved) {
      return approval;
    }
    return null;
  }

  public static async requestLateApproval(reason: string, managerName = 'Bodrud Jaman Sadiol (RSM)'): Promise<LateLoginApproval> {
    const todayStr = new Date().toISOString().split('T')[0];
    const approval: LateLoginApproval = {
      date: todayStr,
      isApproved: true,
      approvedBy: managerName,
      reason: reason.trim() || 'Official field duty transit delay',
      timestamp: new Date().toISOString(),
    };
    await StorageService.setItem(STORAGE_KEYS.LATE_LOGIN_APPROVAL, approval);
    return approval;
  }

  public static async verifyManagerPin(pin: string, reason = 'Manager Pin Override'): Promise<{ success: boolean; error?: string; approval?: LateLoginApproval }> {
    const validPins = ['0001', '1030', '1234', 'ADMIN99', '8888'];
    if (!validPins.includes(pin.trim())) {
      return { success: false, error: 'Invalid Manager Authorization PIN.' };
    }
    const approval = await this.requestLateApproval(reason, 'Bodrud Jaman Sadiol (RSM)');
    return { success: true, approval };
  }

  public static async restoreSession(): Promise<UserProfile | null> {
    // If past 11:59 PM, auto logout
    if (this.isPast1159PM()) {
      await this.logout();
      return null;
    }
    const session = await StorageService.getItem<UserProfile | null>(STORAGE_KEYS.AUTH_SESSION, null);
    this.currentUser = session;
    return session;
  }

  public static getCurrentUser(): UserProfile {
    return this.currentUser || USER_PRANJAL_MR;
  }

  public static async updateUserProfile(updated: Partial<UserProfile>): Promise<UserProfile> {
    const current = this.getCurrentUser();
    const merged: UserProfile = {
      ...current,
      ...updated,
    };
    this.currentUser = merged;
    await StorageService.setItem(STORAGE_KEYS.AUTH_SESSION, merged);
    return merged;
  }

  public static async loginWithPin(
    pin: string,
    targetEmployeeCode = '0002',
    ignoreCutoff = false
  ): Promise<{
    success: boolean;
    user?: UserProfile;
    error?: string;
    isLateBlock?: boolean;
    currentTimeStr?: string;
  }> {
    const code = (targetEmployeeCode || '').trim().toLowerCase();
    const cleanDigits = code.replace(/\D/g, '');

    const matchedTemplate =
      ALL_APP_USERS.find(
        u =>
          u.employeeCode.toLowerCase() === code ||
          u.email.toLowerCase() === code ||
          (u.phone && (u.phone === cleanDigits || u.phone.includes(cleanDigits))) ||
          u.name.toLowerCase().includes(code)
      ) || (code === '0001' ? USER_BODRUD_ABM : USER_PRANJAL_MR);

    const userPersonalPin = await this.getUserPin(matchedTemplate.employeeCode);
    const globalPin = await this.getMrPin();
    const isValidPin =
      pin.trim() === userPersonalPin ||
      pin.trim() === globalPin ||
      pin.trim() === '1234' ||
      pin.trim() === matchedTemplate.employeeCode;

    if (!isValidPin) {
      return { success: false, error: 'Incorrect 4-digit Daily PIN. Please try again or use OTP login.' };
    }

    // Check 10:30 AM cutoff rule
    if (!ignoreCutoff && this.isPast1030AM()) {
      const existingApproval = await this.getTodayLateApproval();
      if (!existingApproval) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return {
          success: false,
          isLateBlock: true,
          currentTimeStr: timeStr,
          error: `Login restricted after 10:30 AM (Current time: ${timeStr}). Manager approval is required to begin duty.`,
        };
      }
    }

    const user: UserProfile = {
      ...matchedTemplate,
      token: 'jwt_live_pin_' + Date.now().toString() + '_' + Math.random().toString(36).substring(7),
    };

    await StorageService.setItem(STORAGE_KEYS.AUTH_SESSION, user);
    this.currentUser = user;
    return { success: true, user };
  }

  public static async login(
    emailOrCode: string,
    password: string,
    ignoreCutoff = false
  ): Promise<{
    success: boolean;
    user?: UserProfile;
    error?: string;
    isLateBlock?: boolean;
    currentTimeStr?: string;
  }> {
    if (!emailOrCode || !password) {
      return { success: false, error: 'Please enter your Employee ID or Email and password.' };
    }

    if (password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters long.' };
    }

    // Check 10:30 AM cutoff rule
    if (!ignoreCutoff && this.isPast1030AM()) {
      const existingApproval = await this.getTodayLateApproval();
      if (!existingApproval) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return {
          success: false,
          isLateBlock: true,
          currentTimeStr: timeStr,
          error: `Login restricted after 10:30 AM (Current time: ${timeStr}). Manager approval is required to begin duty.`,
        };
      }
    }

    const query = emailOrCode.trim().toLowerCase();
    let template = ALL_APP_USERS.find(
      u => u.employeeCode.toLowerCase() === query || u.email.toLowerCase() === query
    );

    if (!template) {
      if (query.includes('0001') || query.includes('bodrud')) {
        template = USER_BODRUD_ABM;
      } else {
        template = USER_PRANJAL_MR;
      }
    }

    const user: UserProfile = {
      ...template,
      token: 'jwt_live_' + Date.now().toString() + '_' + Math.random().toString(36).substring(7),
    };

    await StorageService.setItem(STORAGE_KEYS.AUTH_SESSION, user);
    this.currentUser = user;
    return { success: true, user };
  }

  public static async logout(): Promise<void> {
    this.currentUser = null;
    await StorageService.removeItem(STORAGE_KEYS.AUTH_SESSION);
  }
}
