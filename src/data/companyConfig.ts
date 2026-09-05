export interface CompanyConfig {
  name: string;
  shortName: string;
  tagline: string;
  headline: string;
  subheadline: string;
  missionStatement: string;
  corporateStory: string;
  yearsOfExperience: string;
  productsCount: string;
  marketsServed: string;
  manufacturingSuitesCount: string;
  certifications: string[];
  headquarters: string;
  registeredAddress: string;
  email: string;
  phone: string;
  registrationNumber: string;
  operatingHours: string;
}

export const COMPANY_CONFIG: CompanyConfig = {
  name: '[PHARMA COMPANY NAME]',
  shortName: '[COMPANY SHORTNAME]',
  tagline: 'Advancing Healthcare Across Assam & North-East India',
  headline: 'Advancing Healthcare Across Assam & North-East India Through Quality Pharmaceuticals.',
  subheadline: 'Premier pharmaceutical manufacturing and supply partner serving hospital networks, government healthcare institutions, PCD pharma franchise distributors, and authorized retail stockists across Assam and the North-East.',
  missionStatement: '"To deliver accessible, pharmacopeially superior therapeutics through rigorous scientific formulation, strict quality control, and dependable distribution across Assam and North-East India."',
  corporateStory: 'Operating under strict Good Manufacturing Practices (GMP), Revised Schedule M, and State Drug Control Administration standards, our manufacturing infrastructure delivers high-potency Tablets, Softgels, Capsules, Oral Liquids, and Injectables. Every product batch is validated per Indian Pharmacopoeia (IP) standards with authentic Certificates of Analysis (CoA).',
  yearsOfExperience: '[XX+ YEARS EXPERIENCE]',
  productsCount: '[XX+ FORMULATIONS]',
  marketsServed: 'All Assam Districts & North-East States',
  manufacturingSuitesCount: '[XX+ PRODUCTION LINES]',
  certifications: [
    'WHO-GMP Compliant',
    'CDSCO & Assam State DCA Approved',
    'ISO 9001:2015 Certified',
    'Revised Schedule M Compliant',
    'IP/BP Pharmacopoeia Standards',
    'Assam & NE Distribution Network'
  ],
  headquarters: 'Guwahati, Assam, India',
  registeredAddress: '[REGIONAL OFFICE / PLANT ADDRESS], Guwahati, Assam - 781001, India',
  email: 'contact@[companydomain].com',
  phone: '+91 [PHONE NUMBER]',
  registrationNumber: 'DL / GST: [ASSAM DRUG LICENSE & GST NO]',
  operatingHours: 'Monday – Saturday: 09:00 – 18:30 IST'
};
