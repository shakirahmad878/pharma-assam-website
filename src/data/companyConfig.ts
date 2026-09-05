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
  name: 'Progressive Molecules Pvt. Ltd.',
  shortName: 'Progressive Molecules',
  tagline: 'Advancing Therapeutics Through Progressive Quality Formulations',
  headline: 'Advancing Healthcare Through Progressive Pharmaceutical Formulations.',
  subheadline: 'Progressive Molecules Pvt. Ltd. is a premier pharmaceutical manufacturer, marketer, and distributor delivering high-efficacy Oral Solid Dosages, Softgel Capsules, Digestive & Nutritional Syrups, and Sterile Lyophilized Injectables across healthcare institutions, PCD franchise networks, and medical professionals.',
  missionStatement: '"To empower clinical practice and patient health with therapeutically proven, strictly quality-tested pharmaceutical formulations delivered through transparent ethical partnerships."',
  corporateStory: 'Progressive Molecules Pvt. Ltd. was established to provide reliable, therapeutic-grade medicines conforming strictly to Indian Pharmacopoeia (IP) and World Health Organization (WHO-GMP) standards. Operating with robust manufacturing infrastructure and authorized supply hubs, we cater to hospital formularies, doctor prescriptions, and PCD franchise partners across Assam, Maharashtra, and pan-India.',
  yearsOfExperience: 'Established & Trusted',
  productsCount: '10+ Core Formulations',
  marketsServed: 'Assam, North-East & Pan-India',
  manufacturingSuitesCount: 'WHO-GMP & Revised Schedule M',
  certifications: [
    'WHO-GMP Compliant Facilities',
    'CDSCO & State DCA Approved',
    'GST: 18AANCP7298K1ZE',
    'IP/BP Monograph Compliance',
    'ISO 9001:2015 Quality Systems',
    'Assam & Pan-India Distribution'
  ],
  headquarters: 'Bandra West, Mumbai / Guwahati, Assam',
  registeredAddress: '67-B, Gopal Mansion CHS Ltd, Gurunanak Road, Opp Kooper Chimani, Bandra West, Mumbai, Maharashtra - 400050, India',
  email: 'progressivemolecules23@gmail.com',
  phone: '+91 6001137678',
  registrationNumber: 'GST: 18AANCP7298K1ZE',
  operatingHours: 'Monday – Saturday: 09:30 – 18:30 IST'
};
