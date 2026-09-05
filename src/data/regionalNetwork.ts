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

export const ASSAM_REGIONAL_HUBS: RegionalHub[] = [
  {
    id: 'guwahati-central',
    zone: 'Kamrup Metro & Central Logistics Gateway',
    hubCity: 'Guwahati Hub',
    coverageDistricts: ['Kamrup Metro', 'Kamrup Rural', 'Nalbari', 'Morigaon', 'Goalpara', 'Darrang'],
    transitTime: 'Same Day / 24 Hours Dispatch',
    facilityType: 'Central Staging & Temperature-Controlled Warehouse',
    description: 'Direct dispatch node connected to major transport links, serving medical colleges, multi-specialty hospitals, and stockists across Central Assam.'
  },
  {
    id: 'upper-assam',
    zone: 'Upper Assam & Tea Belt Corridor',
    hubCity: 'Dibrugarh & Jorhat Hub',
    coverageDistricts: ['Dibrugarh', 'Tinsukia', 'Jorhat', 'Sivasagar', 'Golaghat', 'Charaideo'],
    transitTime: '24–36 Hours Dispatch',
    facilityType: 'Regional Cold-Chain Stockist Depot',
    description: 'Supplying hospital networks, tea garden health dispensaries, PCD pharma franchise partners, and chemist retail chains across Upper Assam.'
  },
  {
    id: 'barak-valley',
    zone: 'Barak Valley Distribution Hub',
    hubCity: 'Silchar Hub',
    coverageDistricts: ['Cachar', 'Karimganj', 'Hailakandi', 'Dima Hasao'],
    transitTime: '24–48 Hours Dispatch',
    facilityType: 'Barak Valley Depot & Institutional Supply',
    description: 'Dedicated regional stockist network catering to Silchar Medical College & Hospital (SMCH), local nursing homes, and retail pharmacies.'
  },
  {
    id: 'north-bank',
    zone: 'North Bank & Tezpur Corridor',
    hubCity: 'Tezpur & Lakhimpur Hub',
    coverageDistricts: ['Sonitpur', 'Biswanath', 'Lakhimpur', 'Dhemaji', 'Udalguri'],
    transitTime: '24–48 Hours Dispatch',
    facilityType: 'Secondary Distribution Center',
    description: 'Ensuring seamless supply of vital solid dosages, pediatric syrups, and critical care therapeutics across northern Assam.'
  },
  {
    id: 'lower-assam',
    zone: 'Lower Assam & Western Border Corridor',
    hubCity: 'Bongaigaon Hub',
    coverageDistricts: ['Bongaigaon', 'Dhubri', 'Kokrajhar', 'Barpeta', 'Chirang', 'Baksa'],
    transitTime: '24–36 Hours Dispatch',
    facilityType: 'Lower Assam Depot',
    description: 'Supplying district civil hospitals, Barpeta Medical College (FAAMCH), private clinics, and authorized franchise holders.'
  }
];

export const SUPPLY_CHANNELS: SupplyChannel[] = [
  {
    title: 'PCD Pharma Franchise (District Monopoly)',
    subtitle: 'Exclusive Territory Distribution Rights',
    description: 'Monopoly marketing and distribution rights with comprehensive promotional visual aids, product glossaries, and zero territorial conflict for business partners across Assam.',
    badge: 'District Monopoly'
  },
  {
    title: 'Hospital & Medical College Formularies',
    subtitle: 'Direct Institutional Supply',
    description: 'Scheduled batch supply directly to government medical institutions, civil hospitals, private multi-specialty nursing homes, and corporate healthcare centers.',
    badge: 'Institutional Supply'
  },
  {
    title: 'Third-Party Contract Manufacturing',
    subtitle: 'Loan Licensing & P2P Sourcing',
    description: 'Manufacturing of custom formulations under your brand name adhering strictly to Revised Schedule M, WHO-GMP, and Indian Pharmacopoeia standards.',
    badge: 'Third-Party (P2P)'
  },
  {
    title: 'Tea Estate & Occupational Health Dispensaries',
    subtitle: 'Bulk Healthcare & Essential Formulations',
    description: 'Consistent, affordable bulk supply of essential antibiotics, analgesics, gastrointestinal, and nutritional medicines for estate hospitals and regional welfare clinics.',
    badge: 'Bulk Supply'
  }
];

export const STATUTORY_COMPLIANCE_LIST = [
  {
    title: 'Assam State Drug Control Administration (DCA)',
    description: 'Manufacturing & Sale Licenses (Form 25 & Form 28) issued by the Directorate of Health Services / State Drug Licensing Authority.',
    status: 'Valid & Approved'
  },
  {
    title: 'Revised Schedule M & Good Manufacturing Practices',
    description: 'State-of-the-art HVAC systems, cleanroom air classifications, and computerized batch manufacturing records.',
    status: 'GMP Certified'
  },
  {
    title: 'Indian Pharmacopoeia (IP) Monograph Compliance',
    description: 'Every formulation batch analyzed per IP/BP standards with complete batch Certificates of Analysis (CoA).',
    status: '100% Monograph Tested'
  },
  {
    title: 'GST & State Commercial Tax Registration',
    description: 'Fully compliant invoice generation with e-way bill generation for seamless transport across all North-East check-posts.',
    status: 'Active GST Registered'
  }
];
