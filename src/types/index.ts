export type ProductCategory = 
  | 'Tablets'
  | 'Capsules'
  | 'Syrups & Suspensions'
  | 'Injectables'
  | 'Nutraceuticals & Specialty';

export type TherapeuticSegment = 
  | 'All Segments'
  | 'Cardiology & Metabolic'
  | 'Gastroenterology'
  | 'Orthopedics & Bone Health'
  | 'Pediatrics & Neurology'
  | 'Gynecology & Women\'s Health'
  | 'Hepatology'
  | 'Anti-Infectives & Critical Care';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  therapeuticSegment: TherapeuticSegment;
  genericComposition: string;
  activeMolecules: string[];
  dosageForm: string;
  packaging: string;
  pharmacopoeiaStandard: 'USP' | 'IP' | 'BP' | 'In-House';
  shelfLife: string;
  storageCondition: string;
  moq: string;
  unit: string;
  badge?: string;
  regulatoryStatus: string;
  indication: string;
  clinicalHighlights: string[];
  features: string[];
}

export interface CleanroomSpecifications {
  particles: string;
  pressure: string;
  temperature: string;
  humidity: string;
  filtration: string;
}

export interface ManufacturingFacility {
  id: string;
  name: string;
  title: string;
  type: string;
  classification: string;
  capacity: string;
  cleanroomGrade: string;
  description: string;
  capabilities: string[];
  equipment: string[];
  features: string[];
  specifications: CleanroomSpecifications;
}

export interface ManufacturingStage {
  step: number;
  title: string;
  subtitle: string;
  description: string;
  verification: string;
  specs: string[];
  iconName: string;
}

export interface QualityProtocol {
  id: string;
  title: string;
  description: string;
  badge?: string;
  spec?: string;
}

export interface ComplianceCertification {
  title: string;
  description: string;
  badge: string;
}

export interface QualityStandard {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  instruments: string[];
  compliance: string;
}

export interface RegionalHub {
  id: string;
  zone: string;
  hubCity: string;
  coverageDistricts: string[];
  transitTime: string;
  facilityType: string;
  description: string;
}

export interface SupplyChannel {
  title: string;
  subtitle: string;
  description: string;
  badge: string;
}

export interface PartnerBenefit {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  metric: string;
  keyPoints: string[];
}

export interface ComparisonItem {
  feature: string;
  us: string;
  others: string;
}
