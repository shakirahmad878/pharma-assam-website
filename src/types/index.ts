// Unified Domain Types for SefMed SFA & Pharma Ecosystem

export type ProductCategory = 
  | 'Pharmaceutical Capsules'
  | 'Pharmaceutical Syrup'
  | 'Pharmaceutical Tablets'
  | 'Pharmaceutical Injectable'
  | string;

export type TherapeuticSegment = 
  | 'All Segments'
  | 'Cardiology & Metabolic'
  | 'Gastroenterology'
  | 'Orthopedics & Bone Health'
  | 'Pediatrics & Neurology'
  | 'Gynecology & Women\'s Health'
  | 'Hepatology'
  | 'Anti-Infectives & Critical Care'
  | string;

export interface VisualAidSlide {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  bulletPoints: string[];
}

export interface Product {
  id: string;
  name: string;
  brandName?: string;
  genericName?: string;
  genericComposition: string;
  activeMolecules: string[];
  category: ProductCategory;
  therapeuticSegment?: TherapeuticSegment;
  dosageForm: string;
  packaging?: string;
  packagingSize?: string;
  packSize?: string;
  countryOfOrigin?: string;
  purity?: string;
  form?: string;
  pharmacopoeiaStandard?: 'USP' | 'IP' | 'BP' | 'In-House' | string;
  shelfLife?: string;
  storageCondition?: string;
  moq?: string;
  unit?: string;
  badge?: string;
  regulatoryStatus?: string;
  indication?: string;
  clinicalHighlights: string[];
  features?: string[];
  imageUrl: string;
  mrp?: number;
  ptr?: number;
  pts?: number;
  companyId?: string;
  companyName?: string;
  visualAidSlides?: VisualAidSlide[];
}

export interface InquiryFormData {
  productName: string;
  quantity: number;
  unit: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

// =================== SFA & TELEMETRY DOMAIN TYPES ===================

export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'ADMIN' 
  | 'MANAGER' 
  | 'REGIONAL_MANAGER' 
  | 'AREA_MANAGER' 
  | 'MEDICAL_REP';

export interface UserPermissions {
  canManageUsers: boolean;
  canManageDoctors: boolean;
  canManageChemists: boolean;
  canManageProducts: boolean;
  canManageTerritories: boolean;
  canApproveDCR: boolean;
  canApproveTourPlans: boolean;
  canApproveExpenses: boolean;
  canExportData: boolean;
  canModifyDatabase: boolean;
  canViewAuditLogs: boolean;
}

export interface Company {
  id: string;
  name: string;
  code: string;
  registrationNumber: string;
  gstNumber: string;
  contactEmail: string;
  contactPhone: string;
  headquarters: string;
  state: string;
  subscriptionPlan: 'ENTERPRISE' | 'PRO' | 'STANDARD';
  maxUsers: number;
  activeUsersCount: number;
  activeDoctorsCount: number;
  activeChemistsCount: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'TRIAL';
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'ROLE_CHANGE' | 'PERMISSIONS_UPDATE' | 'ACCESS_REVOKED';
  entityType: 'COMPANY' | 'USER' | 'DOCTOR' | 'CHEMIST' | 'PRODUCT' | 'TERRITORY' | 'DATABASE_RECORD';
  entityId: string;
  entityName: string;
  companyId?: string;
  companyName?: string;
  details: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  username?: string;
  password?: string;
  companyId?: string;
  companyName?: string;
  territoryId: string;
  territoryName: string;
  employeeCode: string;
  avatarUrl?: string;
  isActive: boolean;
  assignedManagerId?: string;
  permissions?: Partial<UserPermissions>;
}

export type DoctorTier = 'A_PLUS' | 'A' | 'B' | 'C';

export type MedicalSpecialty =
  | 'Cardiology'
  | 'Diabetology & Endocrinology'
  | 'Neurology'
  | 'Orthopedics'
  | 'Pediatrics'
  | 'Gastroenterology'
  | 'Dermatology'
  | 'General Medicine'
  | 'Pulmonology';

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  address?: string;
}

export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  specialty: MedicalSpecialty;
  tier: DoctorTier;
  clinicName: string;
  clinicLocation: GeoLocation;
  geofenceRadiusMeters: number;
  territoryId: string;
  territoryName: string;
  phone: string;
  email?: string;
  visitingHours: string;
  preferredVisitDays: string[];
  averagePatientsPerDay: number;
  potentialScore: number;
  lastVisitedDate?: string;
  monthlyVisitTarget: number;
  monthlyVisitsCompleted: number;
  companyId?: string;
  companyName?: string;
}

export interface Chemist {
  id: string;
  name: string;
  shopName: string;
  drugLicenseNumber: string;
  gstNumber: string;
  location: GeoLocation;
  territoryId: string;
  territoryName: string;
  phone: string;
  contactPerson: string;
  associatedDoctors: string[];
  averageMonthlyTurnover: number;
  companyId?: string;
  companyName?: string;
}

export interface Stockist {
  id: string;
  name: string;
  firmName: string;
  dlNumber: string;
  location: GeoLocation;
  territoryId: string;
  phone: string;
  email: string;
  creditLimit: number;
  outstandingBalance: number;
  companyId?: string;
  companyName?: string;
}

export interface Territory {
  id: string;
  code: string;
  name: string;
  zone: string;
  state: string;
  headquarter: string;
  assignedManagerId: string;
  assignedMRIds: string[];
  doctorCount: number;
  chemistCount: number;
  companyId?: string;
  companyName?: string;
}

export interface LocationTelemetryPoint {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  territoryName: string;
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  speedKmh: number;
  batteryPercentage: number;
  isMockLocation: boolean;
  isCharging: boolean;
  capturedAt: string;
  nearbyDoctorId?: string;
  isWithinDoctorGeofence?: boolean;
  activityStatus?: 'IN_TRANSIT' | 'AT_CLINIC' | 'AT_PHARMACY' | 'IDLE';
}

export interface RouteStopover {
  id: string;
  placeName: string;
  placeType: 'DOCTOR' | 'CHEMIST' | 'TRANSIT_STOP';
  arrivalTime: string;
  departureTime: string;
  durationMinutes: number;
  latitude: number;
  longitude: number;
  isGeofenceVerified: boolean;
  associatedDoctorId?: string;
}

export interface DCRRecord {
  id: string;
  userId: string;
  userName: string;
  date: string;
  doctorOrChemistId: string;
  clientType: 'DOCTOR' | 'CHEMIST' | 'STOCKIST';
  clientName: string;
  visitType: 'PLANNED' | 'UNPLANNED';
  checkInTime: string;
  checkOutTime?: string;
  checkInLocation: GeoLocation;
  isGeofenceVerified: boolean;
  distanceFromClinicMeters: number;
  productsDiscussed: string[];
  samplesGiven: { productId: string; quantity: number }[];
  pobAmount?: number;
  doctorFeedback?: string;
  nextFollowUpDate?: string;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
}

export interface TourPlanItem {
  id: string;
  userId: string;
  userName: string;
  date: string;
  territoryId: string;
  territoryName: string;
  routeTitle: string;
  plannedDoctorsCount: number;
  plannedChemistsCount: number;
  doctorIds: string[];
  chemistIds: string[];
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  approvalComments?: string;
}

export interface POBOrderItem {
  productId: string;
  productName: string;
  packSize: string;
  quantity: number;
  freeQuantity: number;
  rate: number;
  totalAmount: number;
}

export interface POBOrder {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  chemistOrStockistId: string;
  buyerName: string;
  buyerType: 'CHEMIST' | 'STOCKIST';
  territoryName: string;
  orderDate: string;
  expectedDeliveryDate: string;
  items: POBOrderItem[];
  subTotal: number;
  gstAmount: number;
  grandTotal: number;
  status: 'BOOKED' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
}

export interface CompetitorDrugEntry {
  competitorBrandName: string;
  competitorCompany: string;
  prescriptionCountPerMonth: number;
  estimatedPrice: number;
}

export interface RCPAAuditRecord {
  id: string;
  userId: string;
  userName: string;
  chemistId: string;
  chemistName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  auditDate: string;
  ourProductBrand: string;
  ourRxCountPerMonth: number;
  competitorDrugs: CompetitorDrugEntry[];
  totalMarketRx: number;
  ourMarketSharePercent: number;
  chemistRemarks?: string;
}

// =================== PHASE 4: HRMS & EXPENSES ===================

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  date: string;
  punchInTime: string;
  punchOutTime?: string;
  punchInLocation: GeoLocation;
  punchOutLocation?: GeoLocation;
  selfieUrl: string;
  batteryPercentage: number;
  totalDistanceKm: number;
  status: 'PRESENT' | 'ON_LEAVE' | 'HALF_DAY';
}

export interface ExpenseItem {
  id: string;
  category: 'DAILY_ALLOWANCE' | 'TRAVEL_KM_RATE' | 'LODGING' | 'TOLL_PARKING' | 'DOCTOR_HOSPITALITY';
  description: string;
  amount: number;
  receiptUrl?: string;
  verifiedKm?: number;
}

export interface ExpenseClaim {
  id: string;
  claimNumber: string;
  userId: string;
  userName: string;
  territoryName: string;
  date: string;
  totalDistanceKm: number;
  ratePerKm: number; // e.g. ₹7.50 / km
  mileageAmount: number;
  dailyAllowance: number;
  otherExpensesTotal: number;
  grandTotal: number;
  items: ExpenseItem[];
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  managerComments?: string;
}
