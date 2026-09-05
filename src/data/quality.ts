import { QualityStandard, QualityProtocol, ComplianceCertification } from '../types';

export const QUALITY_STANDARDS: QualityStandard[] = [
  {
    id: 'chromatographic-assay',
    title: 'HPLC & Chromatographic Assay Verification',
    subtitle: 'Chemical Purity & Active Potency Testing',
    description: 'Every formulation batch is subjected to high-performance liquid chromatography (HPLC) with photodiode array detection, ensuring accurate active assay concentration and zero unauthorized degradation products.',
    instruments: [
      'High-Performance Liquid Chromatography (HPLC)',
      'Gas Chromatography with Headspace (GC-HS)',
      'UV-Visible Double Beam Spectrophotometer',
      'Fourier-Transform Infrared Spectrometer (FTIR)'
    ],
    compliance: 'Pharmacopeial Monograph Assay Compliance (IP / BP / USP)'
  },
  {
    id: 'dissolution-kinetics',
    title: 'In-Vitro Dissolution & Release Kinetics',
    subtitle: 'Bioequivalence & Drug Release Profiling',
    description: 'Multi-vessel automated dissolution testing units simulate human gastric and intestinal pH profiles, validating that enteric-coated and sustained-release pellets release their active payload within precise kinetic windows.',
    instruments: [
      '8-Station USP Type I & II Automated Dissolution Testers',
      'Automated Disintegration Time Apparatus',
      'Precision Electronic Hardness & Thickness Testers',
      'Digital Friability Apparatus with Speed Control'
    ],
    compliance: 'Conforms to USP <711> & IP Dissolution Requirements'
  },
  {
    id: 'microbiological-sterility',
    title: 'Sterility & Bioburden Assurance Testing',
    subtitle: 'Aseptic Class 100 Microbiology Laboratory',
    description: 'Dedicated positive-pressure laminar airflow clean benches host comprehensive microbial limit testing, total viable aerobic count (TVAC), pathogen screening, and bacterial endotoxin (LAL) testing for sterile injectables.',
    instruments: [
      'Class II Type A2 Biosafety Laminar Cabinets',
      'Bacterial Endotoxin Testing (LAL Kinetic Gel-Clot)',
      'BOD & Bacteriological Incubators',
      'Continuous Airborne Particle Counters'
    ],
    compliance: 'Zero Pathogen & Endotoxin Clearance (<0.2 EU/mg)'
  },
  {
    id: 'stability-climatic',
    title: 'ICH Climatic Zone IVb Real-Time Stability',
    subtitle: 'Accelerated & Long-Term Shelf-Life Verification',
    description: 'Walk-in climatic chambers maintain continuous 40°C ± 2°C / 75% RH ± 5% RH (Accelerated) and 30°C ± 2°C / 65% RH ± 5% RH (Zone IVb) conditions to substantiate product shelf-life and packaging integrity.',
    instruments: [
      'Walk-In ICH Stability Chambers with 21 CFR Part 11 Data Logging',
      'Photo-Stability Light Exposure Chambers',
      'Karl Fischer Coulometric Moisture Titrators',
      'High-Precision Analytical Micro-Balances'
    ],
    compliance: 'ICH Q1A(R2) Stability Testing Guidelines'
  }
];

export const QUALITY_PROTOCOLS: QualityProtocol[] = [
  {
    id: 'qp-1',
    title: '100% Chromatographic Purity Assay (HPLC/GC)',
    description: 'Ensuring active API content matches labeled pharmacopeial claim (98.0% - 102.0%).',
    badge: 'cGLP Standard',
    spec: 'Assay ≥ 98.0%'
  },
  {
    id: 'qp-2',
    title: 'In-Vitro Dissolution Rate Kinetics (USP Type I/II)',
    description: 'Validating uniform gastric and intestinal release bioavailability.',
    badge: 'USP <711>',
    spec: '> 80% in 30 min'
  },
  {
    id: 'qp-3',
    title: 'Accelerated & Real-Time Stability (Zone IVb)',
    description: 'Tested at 40°C / 75% RH for tropical export market stability clearance.',
    badge: 'ICH Q1A(R2)',
    spec: 'Zone IVb Validated'
  },
  {
    id: 'qp-4',
    title: 'Bacterial Endotoxin & Sterility Clearance',
    description: 'Kinetic chromogenic LAL testing ensuring endotoxin < 0.25 EU/mL.',
    badge: 'USP <85>',
    spec: '< 0.25 EU/mL'
  }
];

export const COMPLIANCE_CERTIFICATIONS: ComplianceCertification[] = [
  {
    title: 'WHO-GMP Compliant',
    description: 'World Health Organization Good Manufacturing Practices audited and certified.',
    badge: 'WHO Guidelines'
  },
  {
    title: 'ISO 9001:2015 & 14001',
    description: 'Integrated Quality and Environmental Management Systems.',
    badge: 'ISO Standards'
  },
  {
    title: 'Pharmacopeial Monographs',
    description: 'Formulations validated to IP, BP, and USP pharmacopeias.',
    badge: 'IP / BP / USP'
  },
  {
    title: 'ICH CTD / ACTD Dossiers',
    description: 'Module 1-5 Common Technical Documents ready for MOH registration.',
    badge: 'eCTD Ready'
  }
];

export const QUALITY_PILLARS = [
  {
    title: 'Raw Material Quarantine & Assay',
    desc: '100% chromatographic identification and microbial clearance of all incoming APIs and excipients.',
    badge: 'Stage 1 QC'
  },
  {
    title: 'In-Process Quality Controls (IPQC)',
    desc: 'Continuous hourly testing of tablet weight, hardness, friability, disintegration, and fill volume.',
    badge: 'Stage 2 QC'
  },
  {
    title: 'Finished Product Release Testing',
    desc: 'Full assay validation, impurity profiling, and dissolution matching against pharmacopoeial monographs.',
    badge: 'Stage 3 QC'
  },
  {
    title: 'Batch Certificate of Analysis (CoA)',
    desc: 'Every commercial dispatch includes authorized CoA, batch release documentation, and retention samples.',
    badge: 'Stage 4 QC'
  }
];
