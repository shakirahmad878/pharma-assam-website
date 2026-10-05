import { UserProfile, Doctor, StockistFirm } from '../types';

export type DivisionType = 'ALL' | 'Cachar' | 'Hailakandi' | 'Karimganj';

export interface DivisionInfo {
  id: DivisionType;
  label: string;
  district: string;
  description: string;
}

export const DIVISIONS: DivisionInfo[] = [
  { id: 'ALL', label: 'All Divisions', district: 'ALL', description: 'Full Barak Valley Division' },
  { id: 'Cachar', label: 'Silchar (Cachar)', district: 'Cachar', description: 'SMCH, Hospital Rd & Silchar North' },
  { id: 'Hailakandi', label: 'Hailakandi', district: 'Hailakandi', description: 'S.K. Roy Hospital & Lala Bazar Belt' },
  { id: 'Karimganj', label: 'Karimganj (Shribhumi)', district: 'Karimganj', description: 'Station Rd, Main Rd & Badarpur' },
];

export class DivisionService {
  public static isManager(user: UserProfile | null): boolean {
    if (!user) return false;
    return user.role === 'REGIONAL_MANAGER' || user.role === 'AREA_MANAGER' || user.role === 'SUPER_ADMIN';
  }

  public static getUserDivision(user: UserProfile | null): DivisionType {
    if (!user) return 'Cachar';
    if (this.isManager(user)) return 'ALL';

    const territory = (user.territory || '').toLowerCase();
    const hq = (user.headquarter || '').toLowerCase();

    if (territory.includes('hailakandi') || hq.includes('hailakandi')) return 'Hailakandi';
    if (territory.includes('karimganj') || hq.includes('karimganj') || territory.includes('shribhumi')) return 'Karimganj';
    if (territory.includes('silchar') || territory.includes('cachar') || hq.includes('silchar') || hq.includes('cachar')) return 'Cachar';

    return 'Cachar';
  }

  public static getDivisionLabel(div: DivisionType): string {
    const found = DIVISIONS.find((d) => d.id === div);
    return found ? found.label : div;
  }

  public static filterDoctorsByDivision(
    doctors: Doctor[],
    selectedDivision: DivisionType,
    user: UserProfile | null
  ): Doctor[] {
    if (!doctors) return [];

    // If user is MR, they are strictly restricted to their own division
    if (!this.isManager(user)) {
      const userDiv = this.getUserDivision(user);
      return doctors.filter((doc) => this.matchesDivision(doc.district, doc.area, userDiv));
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

    // If user is MR, strictly restricted to their own division
    if (!this.isManager(user)) {
      const userDiv = this.getUserDivision(user);
      return firms.filter((f) => this.matchesDivision(f.district, f.area || f.address, userDiv));
    }

    if (selectedDivision === 'ALL') return firms;
    return firms.filter((f) => this.matchesDivision(f.district, f.area || f.address, selectedDivision));
  }

  public static matchesDivision(district?: string, area?: string, targetDiv?: DivisionType): boolean {
    if (!targetDiv || targetDiv === 'ALL') return true;
    const distLower = (district || '').toLowerCase();
    const areaLower = (area || '').toLowerCase();
    const targetLower = targetDiv.toLowerCase();

    if (targetLower === 'cachar' || targetLower.includes('silchar')) {
      return (
        distLower.includes('cachar') ||
        distLower.includes('silchar') ||
        areaLower.includes('silchar') ||
        areaLower.includes('smch') ||
        areaLower.includes('hospital road') ||
        areaLower.includes('ghungoor') ||
        areaLower.includes('tarapur') ||
        areaLower.includes('rangirkhari')
      );
    }
    if (targetLower === 'hailakandi') {
      return (
        distLower.includes('hailakandi') ||
        areaLower.includes('hailakandi') ||
        areaLower.includes('lala') ||
        areaLower.includes('katlicherra') ||
        areaLower.includes('algapur')
      );
    }
    if (targetLower === 'karimganj') {
      return (
        distLower.includes('karimganj') ||
        distLower.includes('shribhumi') ||
        areaLower.includes('karimganj') ||
        areaLower.includes('badarpur') ||
        areaLower.includes('shribhumi') ||
        areaLower.includes('nilambazar') ||
        areaLower.includes('patharkandi')
      );
    }
    return distLower === targetLower;
  }
}
