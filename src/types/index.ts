export type ProductCategory = 
  | 'Pharmaceutical Capsules'
  | 'Pharmaceutical Syrup'
  | 'Pharmaceutical Tablets'
  | 'Pharmaceutical Injectable';

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
  packagingSize?: string;
  countryOfOrigin?: string;
  purity?: string;
  form?: string;
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
  imageUrl: string;
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
