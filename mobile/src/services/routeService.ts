import { StorageService, STORAGE_KEYS } from './storageService';
import { SyncService } from './sync/syncService';
import { RoutePlan, RouteChangeRequest, MonthlyTourProgramme, MTPDayPlan } from '../types';
import { BARAK_ROUTES, CURRENT_USER, SEPTEMBER_2026_MTP } from '../constants/mockData';

const ROUTE_STORAGE_KEY = 'REPPULSE_ROUTES';
const ACTIVE_ROUTE_KEY = 'REPPULSE_ACTIVE_ROUTE_ID';
const ROUTE_REQUESTS_KEY = 'REPPULSE_ROUTE_CHANGE_REQUESTS';
const MTP_STORAGE_KEY = 'REPPULSE_MTP_SEPTEMBER_2026';

export class RouteService {
  public static async getRoutes(): Promise<RoutePlan[]> {
    let routes = await StorageService.getItem<RoutePlan[]>(ROUTE_STORAGE_KEY, []);
    if (!routes || routes.length === 0) {
      routes = BARAK_ROUTES;
      await StorageService.setItem(ROUTE_STORAGE_KEY, routes);
    }
    const activeRouteId = await this.getActiveRouteId();
    return routes.map(r => ({
      ...r,
      isActiveToday: r.id === activeRouteId,
    }));
  }

  public static async getActiveRouteId(): Promise<string> {
    const activeId = await StorageService.getItem<string>(ACTIVE_ROUTE_KEY, 'route-cachar-01');
    return activeId || 'route-cachar-01';
  }

  public static async getActiveRoute(): Promise<RoutePlan> {
    const routes = await this.getRoutes();
    const activeId = await this.getActiveRouteId();
    return routes.find(r => r.id === activeId) || routes[0];
  }

  public static async setActiveRoute(routeId: string): Promise<boolean> {
    const routes = await this.getRoutes();
    const target = routes.find(r => r.id === routeId);
    if (!target) return false;

    await StorageService.setItem(ACTIVE_ROUTE_KEY, routeId);
    const updated = routes.map(r => ({
      ...r,
      isActiveToday: r.id === routeId,
    }));
    await StorageService.setItem(ROUTE_STORAGE_KEY, updated);
    return true;
  }

  public static async getMonthlyTourPlan(monthName = 'September', year = 2026): Promise<MonthlyTourProgramme> {
    const key = `${MTP_STORAGE_KEY}_${monthName.toUpperCase()}_${year}`;
    let mtp = await StorageService.getItem<MonthlyTourProgramme | null>(key, null);
    if (!mtp) {
      if (monthName === 'September' && year === 2026) {
        mtp = SEPTEMBER_2026_MTP;
      } else {
        // Generate empty template for new month
        const daysInMonth = new Date(year, monthName === 'October' ? 10 : 9, 0).getDate();
        const days: MTPDayPlan[] = [];
        for (let i = 1; i <= daysInMonth; i++) {
          const d = new Date(year, monthName === 'October' ? 9 : 8, i);
          const isSun = d.getDay() === 0;
          days.push({
            dayNumber: i,
            dayOfWeek: d.toLocaleDateString('en-US', { weekday: 'short' }),
            dateString: `${i} ${monthName.substring(0, 3)} ${year}`,
            isSunday: isSun,
            routeId: isSun ? 'sunday-off' : '',
            routeName: isSun ? 'Weekly Rest / Sunday' : '',
            targetDoctorCalls: isSun ? 0 : 10,
            targetChemistCalls: isSun ? 0 : 4,
            status: isSun ? 'HOLIDAY' : 'SCHEDULED',
            district: 'Cachar',
          });
        }
        mtp = {
          month: monthName,
          monthName: monthName,
          year: year,
          employeeId: CURRENT_USER.id,
          employeeName: CURRENT_USER.name,
          status: 'DRAFT',
          totalWorkingDays: daysInMonth - 4,
          totalDoctorTargets: (daysInMonth - 4) * 10,
          totalChemistTargets: (daysInMonth - 4) * 4,
          days: days,
        };
      }
      await StorageService.setItem(key, mtp);
    }
    return mtp;
  }

  public static async saveMTPDraft(mtp: MonthlyTourProgramme): Promise<boolean> {
    const key = `${MTP_STORAGE_KEY}_${mtp.month.toUpperCase()}_${mtp.year}`;
    mtp.status = 'DRAFT';
    return await StorageService.setItem(key, mtp);
  }

  public static async submitMTPForApproval(mtp: MonthlyTourProgramme): Promise<boolean> {
    const key = `${MTP_STORAGE_KEY}_${mtp.month.toUpperCase()}_${mtp.year}`;
    mtp.status = 'PENDING_APPROVAL';
    const saved = await StorageService.setItem(key, mtp);
    if (saved) {
      await SyncService.enqueue('TOUR_PLAN', {
        id: `mtp_${mtp.month}_${mtp.year}_${Date.now()}`,
        month: mtp.month,
        year: mtp.year,
        totalWorkingDays: mtp.totalWorkingDays,
        status: mtp.status,
      });
    }
    return saved;
  }

  public static async getTodayMTPDay(): Promise<MTPDayPlan | null> {
    const mtp = await this.getMonthlyTourPlan();
    const todayNum = new Date().getDate(); // 1 to 30
    const day = mtp.days.find(d => d.dayNumber === todayNum);
    return day || mtp.days[0];
  }

  public static async requestMTPDeviation(
    dayNumber: number,
    newRouteId: string,
    reason: string
  ): Promise<RouteChangeRequest> {
    const mtp = await this.getMonthlyTourPlan();
    const day = mtp.days.find(d => d.dayNumber === dayNumber);
    const routes = await this.getRoutes();
    const targetRoute = routes.find(r => r.id === newRouteId);

    const request: RouteChangeRequest = {
      id: 'req_mtp_' + Date.now() + '_' + Math.random().toString(36).substring(7),
      employeeId: CURRENT_USER.id,
      employeeName: CURRENT_USER.name,
      dayNumber,
      dateString: day ? day.dateString : 'Day ' + dayNumber,
      currentRouteId: day ? day.routeId : 'unknown',
      currentRouteName: day ? day.routeName : 'Scheduled Route',
      requestedRouteId: targetRoute ? targetRoute.id : newRouteId,
      requestedRouteName: targetRoute ? targetRoute.name : 'Target Beat',
      reason: reason.trim() || 'Schedule adjustment requested for client priority.',
      requestTimestamp: new Date().toISOString(),
      status: 'PENDING_APPROVAL',
    };

    if (day) {
      day.status = 'DEVIATION_REQUESTED';
      day.deviationReason = reason;
      day.deviationTargetRouteId = newRouteId;
      day.deviationTargetRouteName = targetRoute ? targetRoute.name : 'Target Beat';
      await StorageService.setItem(MTP_STORAGE_KEY, mtp);
    }

    const existing = await this.getRouteChangeRequests();
    const updated = [request, ...existing];
    await StorageService.setItem(ROUTE_REQUESTS_KEY, updated);

    // Queue for cloud sync
    await SyncService.enqueue('ROUTE_REQUEST', request);

    return request;
  }

  public static async getRouteChangeRequests(): Promise<RouteChangeRequest[]> {
    return await StorageService.getItem<RouteChangeRequest[]>(ROUTE_REQUESTS_KEY, []);
  }

  public static async requestRouteChange(requestedRouteId: string, reason: string): Promise<RouteChangeRequest> {
    return await this.requestMTPDeviation(new Date().getDate(), requestedRouteId, reason);
  }

  public static async adminReviewRequest(
    requestId: string,
    approve: boolean,
    reviewComment?: string
  ): Promise<boolean> {
    const requests = await this.getRouteChangeRequests();
    const idx = requests.findIndex(r => r.id === requestId);
    if (idx === -1) return false;

    const req = requests[idx];
    req.status = approve ? 'APPROVED' : 'REJECTED';
    req.reviewedBy = 'Rajesh Sharma (RBM - East & Assam Zone)';
    req.reviewedTimestamp = new Date().toISOString();
    req.reviewComment = reviewComment || (approve ? 'MTP deviation approved by RBM.' : 'Deviation request rejected.');

    if (approve) {
      await this.setActiveRoute(req.requestedRouteId);
      const mtp = await this.getMonthlyTourPlan();
      if (req.dayNumber) {
        const day = mtp.days.find(d => d.dayNumber === req.dayNumber);
        if (day) {
          day.routeId = req.requestedRouteId;
          day.routeName = req.requestedRouteName;
          day.status = 'SCHEDULED';
          await StorageService.setItem(MTP_STORAGE_KEY, mtp);
        }
      }
    }

    requests[idx] = req;
    await StorageService.setItem(ROUTE_REQUESTS_KEY, requests);
    return true;
  }

  public static async getRouteRequests(): Promise<RouteChangeRequest[]> {
    return this.getRouteChangeRequests();
  }

  public static async approveRouteRequest(requestId: string, comment?: string): Promise<boolean> {
    return this.adminReviewRequest(requestId, true, comment);
  }

  public static async rejectRouteRequest(requestId: string, comment?: string): Promise<boolean> {
    return this.adminReviewRequest(requestId, false, comment);
  }
}
