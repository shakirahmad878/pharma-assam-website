import { ManufacturingFacility, ManufacturingStage } from '../types';

export const MANUFACTURING_FACILITIES: ManufacturingFacility[] = [
  {
    id: 'class-a-aseptic',
    name: 'Class A (Grade A) Sterile Filling Core',
    title: 'Class A (Grade A) Sterile Filling Core',
    type: 'Sterile Injectables & Lyophilized Vials',
    classification: 'ISO 4.8 / Grade A Laminar Flow',
    capacity: '[CAPACITY: E.G. 60 MILLION UNITS / ANNUM]',
    cleanroomGrade: 'Class 100 (ISO Class 4.8)',
    description: 'High-sterility isolator zone dedicated to aseptic vial filling, sterile liquid dosing, and freeze-drying (lyophilization) with continuous laminar airflow velocity (0.45 m/s).',
    capabilities: [
      'Automated robotic vial filling & rubber stoppering',
      'Integrated freeze-drying (lyophilization) under nitrogen',
      'Continuous airborne viable & non-viable particle monitoring',
      'Full CIP (Clean-in-Place) and SIP (Sterilize-in-Place) automation'
    ],
    equipment: [
      'BOSCH High-Speed Aseptic Filling Line',
      'Lyophilizer (Freeze Dryer) with Automated Loading',
      'Particle Measuring Systems Continuous Airborne Sampler',
      'Automated Terminal Capping System'
    ],
    features: [
      'Aseptic freeze-drying (Lyophilization) for moisture-sensitive molecules',
      'Automated volumetric liquid filling with nitrogen purging',
      'Online automated visual inspection for particulate integrity'
    ],
    specifications: {
      particles: '< 3,520 / m³',
      pressure: '+45 Pa (Differential)',
      temperature: '20°C ± 2°C',
      humidity: '40% ± 5% RH',
      filtration: 'Terminal HEPA 99.997% @ 0.3μm'
    }
  },
  {
    id: 'class-b-compounding',
    name: 'Class B Sterile Formulation Cleanroom',
    title: 'Class B Sterile Formulation Cleanroom',
    type: 'Sterile Compounding & Filtration Suite',
    classification: 'ISO 6 / Grade B Background',
    capacity: '[CAPACITY: E.G. 120 MILLION UNITS / ANNUM]',
    cleanroomGrade: 'Class 1,000 (ISO Class 6)',
    description: 'Sterile background environment for API dissolution, compounding, double sterile membrane filtration (0.22 micron), and equipment preparation.',
    capabilities: [
      'Closed-system magnetic stirring compounding vessels',
      'Dual 0.22-micron PES membrane integrity challenge testing',
      'Double-door pass boxes with UV decontamination cycles',
      'Automated differential pressure cascading'
    ],
    equipment: [
      'Bio-reactor Compounding Vessel (316L SS)',
      'Sartorius Automated Filter Integrity Tester',
      'Pure Steam Generator (WFI Grade)',
      'High-Pressure Double Door Autoclave'
    ],
    features: [
      '316L mirror-polished electro-polished stainless steel reactors',
      'Pure steam sterilization cycles at 121°C',
      'Automated clean-in-place batch records'
    ],
    specifications: {
      particles: '< 352,000 / m³',
      pressure: '+30 Pa (Differential)',
      temperature: '21°C ± 2°C',
      humidity: '45% ± 5% RH',
      filtration: 'EU Grade H14 HEPA System'
    }
  },
  {
    id: 'class-c-osd',
    name: 'Class C Solid Dosage & Softgel Suite',
    title: 'Class C Solid Dosage & Softgel Suite',
    type: 'Tablets, Softgels & Pellets',
    classification: 'ISO 7 / Grade C Controlled Area',
    capacity: '[CAPACITY: E.G. 1.2 BILLION UNITS / ANNUM]',
    cleanroomGrade: 'Class 10,000 (ISO Class 7)',
    description: 'Dedicated pressure-zoned cleanroom suites engineered for high-speed tablet compression, rotary softgel encapsulation, and automated aqueous/solvent film coating.',
    capabilities: [
      'High-speed rotary tablet compression with automated weight feedback',
      'Precision gelatin ribbon casting with laser thickness control',
      'Dehumidified softgel tumble drying (RH < 20%)',
      'Automated perforated pan tablet film coating'
    ],
    equipment: [
      'Fette High-Speed Rotary Tablet Press',
      'Changsung Rotary Die Softgel Machine',
      'Glatt Fluid Bed Processor & Granulator',
      'O’Hara Perforated Film Coating Machine'
    ],
    features: [
      'High-speed rotary tablet compression machines with automated weight control',
      'Dual-pellet capsule filling with optical weight sorting',
      'Aqueous and solvent-based automated film coating systems'
    ],
    specifications: {
      particles: '< 3,520,000 / m³',
      pressure: '+20 Pa (Differential)',
      temperature: '22°C ± 2°C',
      humidity: '45% ± 5% RH (Softgels < 20%)',
      filtration: 'Central HVAC with EU H13 Filter'
    }
  },
  {
    id: 'class-d-packaging',
    name: 'Class D Primary Barrier Packaging Line',
    title: 'Class D Primary Barrier Packaging Line',
    type: 'Alu-Alu, Blister & Amber Glass Packaging',
    classification: 'ISO 8 / Grade D Packaging',
    capacity: '[CAPACITY: E.G. 80 MILLION PACKS / ANNUM]',
    cleanroomGrade: 'Class 100,000 (ISO Class 8)',
    description: 'Fully automated blistering and packaging suite with online high-resolution camera inspection, 2D datamatrix serialization, and tamper-evident sealing.',
    capabilities: [
      'Cold-form Alu-Alu and thermoform PVC/PVDC packaging',
      '100% online optical camera inspection for broken/empty pockets',
      'High-speed cartoning with pharmacode and leaflet folding',
      'Tamper-evident carton sealing & batch aggregation'
    ],
    equipment: [
      'Uhlmann High-Speed Blister Packaging Line',
      'Cognex Vision Camera Inspection System',
      'IMA High-Speed Continuous Motion Cartoner',
      'Domino 2D DataMatrix Laser Serialization'
    ],
    features: [
      'Tri-laminated cold-form Alu-Alu moisture barriers',
      'Amber USP Type-I glass for photosensitive injectables',
      'Tamper-evident carton seals and 2D datamatrix'
    ],
    specifications: {
      particles: '< 35,200,000 / m³',
      pressure: '+15 Pa (Differential)',
      temperature: '23°C ± 2°C',
      humidity: '< 50% RH',
      filtration: 'Multi-stage AHU with F9/H11 Filtration'
    }
  }
];

export const MANUFACTURING_PROCESS_STEPS: ManufacturingStage[] = [
  {
    step: 1,
    title: 'API Quarantine & Assay Verification',
    subtitle: 'Pre-Formulation & Raw Material Quality',
    description: '100% of incoming active ingredients and excipients undergo HPLC chromatographic testing, FTIR fingerprinting, and microbial clearance before release into production.',
    verification: 'CoA & Chromatographic Identity Confirmed',
    specs: [
      'Pre-formulation compatibility matrices',
      'ICH stability chambers (Zone IVb)',
      'Bioavailability optimization protocols'
    ],
    iconName: 'FlaskConical'
  },
  {
    step: 2,
    title: 'Controlled Dispensing & Micronization',
    subtitle: '100% API & Excipient Assay Check',
    description: 'Reverse laminar airflow dispensing booths with computerized barcode verification eliminate operator error and prevent cross-contamination.',
    verification: 'Barcoded Dispensing & Zero Discrepancy',
    specs: [
      'HPLC & GC chromatographic verification',
      'Pharmacopoeial monograph testing (IP/BP/USP)',
      'Barcode-controlled reverse laminar dispensing'
    ],
    iconName: 'ShieldCheck'
  },
  {
    step: 3,
    title: 'Cleanroom Compounding & Processing',
    subtitle: 'Controlled Rotary Compression & Encapsulation',
    description: 'Granulation, blending, high-speed tablet compression, or softgel die encapsulation operates under computerized environmental telemetry.',
    verification: 'Continuous In-Process Control (IPQC)',
    specs: [
      'HEPA filtered ISO 14644 cleanrooms',
      'In-process weight, hardness & friability checks',
      'Clean-in-Place (CIP) & Sterilize-in-Place (SIP)'
    ],
    iconName: 'Factory'
  },
  {
    step: 4,
    title: 'Primary Barrier Encapsulation & Coating',
    subtitle: 'Moisture & Oxidation Protection',
    description: 'Aqueous film coating, enteric coating for GI target delivery, or sterile nitrogen purged sealing for maximum active molecule stability.',
    verification: 'Disintegration & Uniformity Confirmed',
    specs: [
      'Multi-station in-vitro dissolution profiling',
      'Sterility & bacterial endotoxin (LAL) testing',
      'Complete electronic batch record (eBMR)'
    ],
    iconName: 'Cpu'
  },
  {
    step: 5,
    title: 'Automated Blistering & Visual Inspection',
    subtitle: 'Alu-Alu, Blister & Amber Borosilicate Packaging',
    description: 'Online high-speed camera sensors inspect every individual blister cavity for micro-pinholes, seal integrity, and print alignment.',
    verification: '100% Camera Optical Inspection Pass',
    specs: [
      'Tri-laminated cold-form Alu-Alu moisture barriers',
      'Amber USP Type-I glass for photosensitive injectables',
      'Tamper-evident carton seals and 2D datamatrix'
    ],
    iconName: 'Package'
  },
  {
    step: 6,
    title: 'QA Batch Release & CoA Certification',
    subtitle: 'Temperature-Monitored Global Transit',
    description: 'Quality Assurance conducts finished product assay, dissolution profiling, and sterility tests before authorizing the commercial Batch Release.',
    verification: 'QP / QA Final Certificate of Analysis',
    specs: [
      '2°C–8°C / 15°C–25°C validated cold-chain nodes',
      'Real-time IoT temperature data loggers',
      'Complete export dossier documentation'
    ],
    iconName: 'Truck'
  }
];

export const MANUFACTURING_STAGES = MANUFACTURING_PROCESS_STEPS;
