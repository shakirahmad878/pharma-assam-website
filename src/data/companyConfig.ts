export interface CompanyConfig {
  name: string;
  shortName: string;
  website: string;
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
  logoUrl: string;
}

export const COMPANY_CONFIG: CompanyConfig = {
  name: 'New Life Care Laboratories Pvt. Ltd.',
  shortName: 'NLCL',
  website: 'nlcl.in',
  tagline: 'Creating health. Inspiring life.',
  headline: 'Your Health. Our Mission. Creating Health, Inspiring Life.',
  subheadline: 'New Life Care Laboratories Pvt. Ltd. (NLCL) produces and distributes an advanced pharmaceutical & nutraceutical portfolio spanning Nutritional Support, Cardiovascular Health, Omega-3 Essentials, Skin Brightening, Digestive Wellness, and Specialized Women\'s Health.',
  missionStatement: '"To create high-quality pharmaceutical and nutraceutical products that inspire healthier, happier lives for all through clinical excellence, strict monograph compliance, and trusted healthcare distribution."',
  corporateStory: 'New Life Care Laboratories Pvt. Ltd. was founded with the core commitment to create therapeutic-grade formulations adhering to WHO-GMP, ISO, and Pharmacopoeial standards. Our portfolio delivers targeted healthcare solutions—from cardiovascular energy co-factors and pharmaceutical-grade omega-3 fatty acids to specialized vaginal probiotics and bio-enhanced digestive enzymes.',
  yearsOfExperience: 'Established & Trusted Nationwide',
  productsCount: '13 Core Formulations',
  marketsServed: 'Pan-India Distribution, Hospital Formularies & Retail Pharmacy Networks',
  manufacturingSuitesCount: 'WHO-GMP & Schedule M Certified Facilities',
  certifications: [
    'WHO-GMP Certified Manufacturing Facilities',
    'ISO 9001:2015 Quality Management Systems',
    'IP / BP / USP Monograph Formulations',
    'FSSAI & Nutraceutical Quality Standards',
    'Temperature-Controlled Cold-Chain Supply Network'
  ],
  headquarters: 'Maulana Shaukat Ali Road, Nav Jeevan Society, Grant Road (E), Kamathipura, Mumbai, Maharashtra - 400007',
  registeredAddress: 'Corporate Office: Maulana Shaukat Ali Road, Nav Jeevan Society, Grant Road (E), Kamathipura, Mumbai - 400007 | Regional Supply Hubs: Guwahati & Silchar, Assam',
  email: 'contact@nlcl.in',
  phone: '+91 69007 00102',
  registrationNumber: 'CIN: U24239AS2024PTC018920 • GMP & ISO Certified',
  operatingHours: 'Monday – Saturday: 09:30 AM – 06:30 PM IST',
  directors: 'Executive Management: New Life Care Laboratories Pvt. Ltd.',
  logoUrl: './images/nlcl-logo.jpg'
};
