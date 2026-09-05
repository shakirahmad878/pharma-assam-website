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
  name: '[PHARMA COMPANY NAME]',
  shortName: '[PHARMA COMPANY NAME]',
  tagline: 'Reliable Therapeutic Formulations & Ethical Distribution',
  headline: 'Advancing Healthcare Through Quality Pharmaceutical Formulations.',
  subheadline: 'A dedicated pharmaceutical manufacturer and distributor supplying high-efficacy Oral Solid Dosages, Softgel Capsules, Digestive & Nutritional Syrups, and Sterile Injectables across hospital formularies, stockists, and medical institutions in Assam and the North-East.',
  missionStatement: '"To empower clinical practice and patient health with therapeutically proven, strictly quality-tested pharmaceutical formulations delivered through transparent ethical partnerships."',
  corporateStory: 'Established to provide reliable, therapeutic-grade medicines conforming strictly to Indian Pharmacopoeia (IP) and World Health Organization (WHO-GMP) standards. Operating with robust distribution infrastructure and authorized supply hubs across Guwahati and the entire Assam & North-East region.',
  yearsOfExperience: 'Established & Trusted',
  productsCount: '10+ Core Formulations',
  marketsServed: 'Assam & North-East Region',
  manufacturingSuitesCount: 'WHO-GMP & Schedule M Compliant',
  certifications: [
    'WHO-GMP Compliant Manufacturing',
    'State DCA & CDSCO Regulatory Approval',
    'IP/BP Monograph Compliance',
    'ISO 9001:2015 Quality Systems',
    'Assam Regional Supply Network'
  ],
  headquarters: 'Guwahati, Assam [CENTRAL DEPOT]',
  registeredAddress: '[REGISTERED OFFICE & CENTRAL DEPOT, GUWAHATI, ASSAM - 781001]',
  email: '[OFFICIAL COMPANY EMAIL]',
  phone: '[ASSAM TRADE HELPLINE / CONTACT]',
  registrationNumber: 'DL / GST: [ASSAM DRUG LICENSE & GST NO]',
  operatingHours: 'Monday – Saturday: 09:30 – 18:30 IST',
  directors: '[AUTHORIZED DIRECTORS & MANAGEMENT]'
};
