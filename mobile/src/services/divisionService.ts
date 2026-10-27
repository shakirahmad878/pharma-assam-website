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

  public static getUserDivision(user: UserProfile | null): DivisionType {
    if (!user) return 'Cachar';
    if (this.isManager(user)) return 'ALL';

    const territory = (user.territory || '').toLowerCase();
    const hq = (user.headquarter || '').toLowerCase();

    if (territory.includes('agartala') || hq.includes('agartala')) return 'Agartala';
    if (territory.includes('dharmanagar') || hq.includes('dharmanagar') || territory.includes('tripura') || hq.includes('tripura')) return 'Dharmanagar';
    if (territory.includes('aizawl') || hq.includes('aizawl') || territory.includes('mizoram')) return 'Aizawl';
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
