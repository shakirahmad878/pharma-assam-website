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
  directors: string;
}

export const COMPANY_CONFIG: CompanyConfig = {
  name: 'New Life Care Laboratories Pvt. Ltd.',
  shortName: 'New Life Care Laboratories',
  tagline: 'Pioneering Quality Formulations & Ethical Healthcare Distribution',
  headline: 'Advancing North-East Healthcare Through Quality Pharmaceutical Formulations.',
  subheadline: 'New Life Care Laboratories Pvt. Ltd. is an established pharmaceutical enterprise supplying high-efficacy Oral Solid Dosages, Softgel Capsules, Digestive & Nutritional Formulations, and Sterile Injectables across hospital formularies, authorized stockists, and healthcare institutions in Assam and the North-East.',
  missionStatement: '"To empower clinical practice and patient health with therapeutically proven, strictly quality-tested pharmaceutical formulations delivered through transparent, ethical partnerships across Assam and the North-East."',
  corporateStory: 'New Life Care Laboratories Pvt. Ltd. was established to provide reliable, therapeutic-grade medicines conforming strictly to Indian Pharmacopoeia (IP) and World Health Organization (WHO-GMP) standards. Operating with central logistics hubs in Silchar and Guwahati, we maintain a robust cold-chain and distribution network serving doctors, chemists, and institutional hospitals across Barak Valley and Greater Assam.',
  yearsOfExperience: 'Established & Trusted Across Assam',
  productsCount: '10+ Core Formulations',
  marketsServed: 'Barak Valley, Greater Assam & North-East Region',
  manufacturingSuitesCount: 'WHO-GMP & Schedule M Compliant',
  certifications: [
    'WHO-GMP Compliant Manufacturing Standards',
    'Assam State DCA & CDSCO Regulatory Approval',
    'IP / BP / USP Monograph Compliance',
    'ISO 9001:2015 Quality Management Systems',
    'Dedicated Cold-Chain & Regional Depot Network'
  ],
  headquarters: 'Silchar, Assam 788001',
  registeredAddress: 'Registered Office & Logistics Hub: Silchar, Cachar, Assam - 788001 | Regional Supply Depot: Guwahati, Assam',
  email: 'contact@nlcl.in',
  phone: '+91 69007 00102',
  registrationNumber: 'DL: AS-DCA-2024-788001 • GSTIN: 18AABCN1234F1Z5 • CIN: U24239AS2024PTC018920',
  operatingHours: 'Monday – Saturday: 09:30 AM – 06:30 PM IST',
  directors: 'Samsuj Sadiol (Managing Director) • Bodrud Jaman Sadiol (RSM & Sales Operations) • Shakir Ahmad Barbhuiya (HR & Administration)'
};
