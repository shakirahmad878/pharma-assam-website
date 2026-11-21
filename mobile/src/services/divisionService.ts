import { UserProfile, Doctor, StockistFirm } from '../types';

export type DivisionType = 'ALL' | 'Cachar' | 'Hailakandi' | 'Karimganj' | 'Aizawl' | 'Agartala' | 'Dharmanagar' | 'Tripura';

export interface DivisionInfo {
  id: DivisionType;
  label: string;
  district: string;
  description: string;
}

export const DIVISIONS: DivisionInfo[] = [
  { id: 'ALL', label: 'All Divisions', district: 'ALL', description: 'Full Operational Territory' },
  { id: 'Cachar', label: 'Silchar (Cachar)', district: 'Cachar', description: 'SMCH, Hospital Rd & Silchar North' },
  { id: 'Hailakandi', label: 'Hailakandi', district: 'Hailakandi', description: 'S.K. Roy Hospital & Lala Bazar Belt' },
  { id: 'Karimganj', label: 'Karimganj (Shribhumi)', district: 'Karimganj', description: 'Station Rd, Main Rd & Badarpur' },
  { id: 'Aizawl', label: 'Aizawl (Mizoram)', district: 'Aizawl', description: 'Civil Hospital, ZMC, Chanmari & Bawngkawn' },
  { id: 'Agartala', label: 'Agartala HQ (West Tripura)', district: 'Agartala', description: 'Capital healthcare corridor: AGMC & GBP Hospital, ILS, Akhaura Rd' },
  { id: 'Dharmanagar', label: 'Dharmanagar HQ (North Tripura)', district: 'Dharmanagar', description: 'North Tripura hub: District Hospital, Station Rd & Town Belt' },
];

export class DivisionService {
  public static isManager(user: UserProfile | null): boolean {
    if (!user) return false;
    return (
      user.role === 'DIRECTOR' ||
      user.role === 'HR_MANAGER' ||
      user.role === 'SUPER_ADMIN' ||
      user.role === 'REGIONAL_MANAGER' ||
      user.role === 'AREA_MANAGER'
    );
  }

  /**
   * Intelligently detects operational pharma division from real GPS coordinates.
   */
  public static detectDistrictFromGps(lat: number, lng: number): 'Cachar' | 'Karimganj' | 'Hailakandi' | 'Aizawl' | 'Agartala' | 'Dharmanagar' {
    if (!lat || !lng) return 'Cachar';

    // Tripura Corridor (West of 92.1° E)
    if (lng < 92.1) {
      return lat < 24.0 ? 'Agartala' : 'Dharmanagar';
    }

    // Mizoram Corridor (South of 24.15° N, e.g. Aizawl is ~23.73° N)
    if (lat < 24.15) {
      return 'Aizawl';
    }

    // Karimganj / Shribhumi District (West of 92.52° E, e.g. Nilmoni Rd is ~92.35° E, Badarpur is ~92.50° E)
    if (lng < 92.52) {
      return 'Karimganj';
    }

    // Hailakandi District (Lat 24.45 - 24.75, Lng 92.52 - 92.70)
    if (lat >= 24.45 && lat <= 24.75 && lng >= 92.52 && lng <= 92.70) {
      return 'Hailakandi';
    }

    // Default to Cachar / Silchar HQ (Silchar is ~24.82° N, 92.80° E, Bagha is ~24.55° N, 92.84° E)
    return 'Cachar';
  }

  public static getUserDivision(user: UserProfile | null): DivisionType {
    if (!user) return 'Cachar';
    if (this.isManager(user)) return 'ALL';

    const empCode = (user.employeeCode || '').toUpperCase();
    if (empCode === 'NLCL-0005') return 'Cachar'; // Satyam Shil: Primary HQ is Silchar (Cachar)
    if (empCode === 'NLCL-0004') return 'Karimganj'; // Pranjal Malakar: Primary HQ is Karimganj

    const hq = (user.headquarter || '').toLowerCase();
    const territory = (user.territory || '').toLowerCase();

    // 1. Check primary HQ first
    if (hq.includes('silchar') || hq.includes('cachar')) return 'Cachar';
    if (hq.includes('karimganj') || hq.includes('shribhumi')) return 'Karimganj';
    if (hq.includes('hailakandi')) return 'Hailakandi';
    if (hq.includes('aizawl') || hq.includes('mizoram')) return 'Aizawl';
    if (hq.includes('agartala') || hq.includes('west tripura')) return 'Agartala';
    if (hq.includes('dharmanagar') || hq.includes('north tripura')) return 'Dharmanagar';

    // 2. Check base territory (Prioritize Silchar/Cachar for Barak base)
    if (territory.includes('silchar') || territory.includes('cachar')) return 'Cachar';
    if (territory.includes('karimganj') || territory.includes('shribhumi')) return 'Karimganj';
    if (territory.includes('hailakandi')) return 'Hailakandi';
    if (territory.includes('aizawl') || territory.includes('mizoram')) return 'Aizawl';
    if (territory.includes('agartala')) return 'Agartala';
    if (territory.includes('dharmanagar')) return 'Dharmanagar';

    return 'Cachar';
  }

  public static getUserAllowedDivisions(user: UserProfile | null): DivisionType[] {
    if (!user) return ['Cachar'];
    if (this.isManager(user)) return ['ALL'];

    const empCode = (user.employeeCode || '').toUpperCase();
    if (empCode === 'NLCL-0005') {
      // Satyam Shil: Primary HQ Silchar, Extended fields Hailakandi & Aizawl
      return ['Cachar', 'Hailakandi', 'Aizawl'];
    }
    if (empCode === 'NLCL-0004') {
      // Pranjal Malakar: Primary HQ Karimganj, Extended field Dharmanagar
      return ['Karimganj', 'Dharmanagar'];
    }

    const territory = (user.territory || '').toLowerCase();
    const hq = (user.headquarter || '').toLowerCase();
    const combined = `${territory} ${hq}`;

    const divs: DivisionType[] = [];
    if (combined.includes('silchar') || combined.includes('cachar')) divs.push('Cachar');
    if (combined.includes('hailakandi')) divs.push('Hailakandi');
    if (combined.includes('aizawl') || combined.includes('mizoram')) divs.push('Aizawl');
    if (combined.includes('karimganj') || combined.includes('shribhumi')) divs.push('Karimganj');
    if (combined.includes('dharmanagar') || combined.includes('north tripura')) divs.push('Dharmanagar');
    if (combined.includes('agartala') || combined.includes('west tripura')) divs.push('Agartala');

    return divs.length > 0 ? divs : ['Cachar'];
  }

  public static getDivisionLabel(div: DivisionType): string {
    const found = DIVISIONS.find((d) => d.id === div);
    return found ? found.label : div;
  }

  public static isDoctorAssignedToOrOwnedByEmployee(doc: Doctor, user: UserProfile | null): boolean {
    if (!user) return false;
    const userCode = (user.employeeCode || '').trim().toUpperCase();
    const userId = (user.id || '').trim().toLowerCase();
    const userName = (user.name || '').trim().toLowerCase();

    const assignedId = (doc.assignedToEmployeeId || '').trim();
    const assignedName = (doc.assignedToEmployeeName || '').trim().toLowerCase();

    // 1. Direct ID / Code match (supports NLCL-0005, usr-nlcl-0005, etc.)
    if (assignedId) {
      const cleanAssigned = assignedId.toUpperCase();
      if (cleanAssigned === userCode || assignedId.toLowerCase() === userId) return true;
      if (cleanAssigned.includes(userCode) || userCode.includes(cleanAssigned.replace(/^USR-/, ''))) return true;
    }

    // 2. Name match (if assigned by name)
    if (assignedName && (assignedName === userName || assignedName.includes(userName.split(' ')[0]))) {
      return true;
    }

    // 3. Created by user or assigned to me
    if (doc.createdBy && (doc.createdBy.toUpperCase() === userCode || doc.createdBy.toLowerCase() === userId)) {
      return true;
    }

    return Boolean(doc.isAssignedToMe);
  }

  public static filterDoctorsByDivision(
    doctors: Doctor[],
    selectedDivision: DivisionType,
    user: UserProfile | null
  ): Doctor[] {
    if (!doctors) return [];

    // If user is MR:
    // Any doctor assigned to or created by this MR MUST ALWAYS be visible in their profile,
    // regardless of whether located at HQ, Ex-Station, Outstation, or any other district.
    if (!this.isManager(user)) {
      const allowedDivs = this.getUserAllowedDivisions(user);
      return doctors.filter((doc) => {
        if (this.isDoctorAssignedToOrOwnedByEmployee(doc, user)) {
          return true;
        }
        if (selectedDivision !== 'ALL' && allowedDivs.includes(selectedDivision)) {
          return this.matchesDivision(doc.district, doc.area, selectedDivision);
        }
        return allowedDivs.some((d) => this.matchesDivision(doc.district, doc.area, d));
      });
    }

    // For Managers, filter by the selected division
    if (selectedDivision === 'ALL') return doctors;
    return doctors.filter((doc) => this.matchesDivision(doc.district, doc.area, selectedDivision));
  }

  public static filterFirmsByDivision<T extends { district?: string; area?: string; address?: string }>(
    firms: T[],
    selectedDivision: DivisionType,
    user: UserProfile | null
  ): T[] {
    if (!firms) return [];

    // If user is MR, authorized across all their assigned divisions
    if (!this.isManager(user)) {
      const allowedDivs = this.getUserAllowedDivisions(user);
      return firms.filter((f) => allowedDivs.some((d) => this.matchesDivision(f.district, f.area || f.address, d)));
    }

    if (selectedDivision === 'ALL') return firms;
    return firms.filter((f) => this.matchesDivision(f.district, f.area || f.address, selectedDivision));
  }

  public static matchesDivision(district?: string, area?: string, targetDiv?: DivisionType): boolean {
    if (!targetDiv || targetDiv === 'ALL') return true;
    const distLower = (district || '').trim().toLowerCase();
    const areaLower = (area || '').trim().toLowerCase();
    const targetLower = targetDiv.trim().toLowerCase();

    // 1. Silchar / Cachar
    if (targetLower === 'cachar' || targetLower.includes('silchar')) {
      if (distLower === 'cachar' || distLower.includes('silchar')) return true;
      if (['dharmanagar', 'agartala', 'karimganj', 'hailakandi', 'aizawl'].includes(distLower)) return false;
      return (
        areaLower.includes('silchar') ||
        areaLower.includes('smch') ||
        areaLower.includes('hospital road') ||
        areaLower.includes('ghungoor') ||
        areaLower.includes('tarapur') ||
        areaLower.includes('rangirkhari')
      );
    }

    // 2. Hailakandi
    if (targetLower === 'hailakandi') {
      if (distLower === 'hailakandi') return true;
      if (['dharmanagar', 'agartala', 'cachar', 'karimganj', 'aizawl'].includes(distLower)) return false;
      return (
        areaLower.includes('hailakandi') ||
        areaLower.includes('lala') ||
        areaLower.includes('katlicherra') ||
        areaLower.includes('algapur')
      );
    }

    // 3. Karimganj (Shribhumi)
    if (targetLower === 'karimganj') {
      if (distLower === 'karimganj' || distLower.includes('shribhumi')) return true;
      if (['dharmanagar', 'agartala', 'cachar', 'hailakandi', 'aizawl'].includes(distLower)) return false;
      return (
        areaLower.includes('karimganj') ||
        areaLower.includes('badarpur') ||
        areaLower.includes('shribhumi') ||
        areaLower.includes('nilambazar') ||
        areaLower.includes('patharkandi')
      );
    }

    // 4. Aizawl (Mizoram)
    if (targetLower === 'aizawl' || targetLower.includes('mizo')) {
      if (distLower === 'aizawl' || distLower.includes('mizoram')) return true;
      if (['dharmanagar', 'agartala', 'cachar', 'karimganj', 'hailakandi'].includes(distLower)) return false;
      return (
        areaLower.includes('aizawl') ||
        areaLower.includes('chanmari') ||
        areaLower.includes('bawngkawn') ||
        areaLower.includes('dawrpui') ||
        areaLower.includes('falkawn') ||
        areaLower.includes('zmc') ||
        areaLower.includes('bara bazar') ||
        areaLower.includes('treasury square')
      );
    }

    // 5. Agartala HQ (West Tripura)
    if (targetLower.includes('agartala')) {
      // If doctor is explicitly in Dharmanagar or another district, NEVER match Agartala!
      if (distLower === 'dharmanagar' || distLower.includes('north tripura')) return false;
      if (['cachar', 'karimganj', 'hailakandi', 'aizawl'].includes(distLower)) return false;
      if (distLower === 'agartala' || distLower.includes('west tripura')) return true;

      // Road names like "Assam - Agartala Rd" in Sanichhara/North Tripura should NOT match Agartala city
      const cleanArea = areaLower.replace(/assam\s*-\s*agartala\s*(rd|road)?/g, '').replace(/agartala\s*(rd|road)/g, '');
      return (
        cleanArea.includes('agartala') ||
        areaLower.includes('kunjaban') ||
        areaLower.includes('gbp') ||
        areaLower.includes('agmc') ||
        areaLower.includes('hapania') ||
        areaLower.includes('akhaura') ||
        areaLower.includes('chowmuhani') ||
        areaLower.includes('bamyal') ||
        areaLower.includes('bhati abhoynagar')
      );
    }

    // 6. Dharmanagar HQ (North Tripura) - captures all North Tripura + legacy Tripura data
    if (targetLower.includes('dharmanagar') || targetLower === 'tripura') {
      if (distLower === 'agartala' || distLower.includes('west tripura')) return false;
      if (['cachar', 'karimganj', 'hailakandi', 'aizawl'].includes(distLower)) return false;
      if (distLower === 'dharmanagar' || distLower.includes('north tripura') || distLower === 'tripura') return true;

      return (
        areaLower.includes('dharmanagar') ||
        areaLower.includes('uptakhali') ||
        areaLower.includes('upthakhali') ||
        areaLower.includes('sanichhara') ||
        areaLower.includes('sanicherra') ||
        areaLower.includes('tilthai') ||
        areaLower.includes('kadamtala') ||
        areaLower.includes('churaibari') ||
        areaLower.includes('panisagar') ||
        areaLower.includes('deochhara') ||
        areaLower.includes('kanchanpur') ||
        areaLower.includes('rajbari')
      );
    }

    return distLower === targetLower;
  }
}
