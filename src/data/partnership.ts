import { PartnerBenefit, ComparisonItem } from '../types';

export const PARTNERSHIP_PILLARS: PartnerBenefit[] = [
  {
    id: 'reliable-supply',
    title: 'Reliable Supply & Batch Continuity',
    subtitle: 'Uninterrupted Supply Chain',
    description: 'Consistent commercial manufacturing, raw material buffer inventories, and automated ERP scheduling ensure 99.4% on-time dispatch rates for contractual commitments.',
    metric: '99.4% On-Time Dispatch',
    keyPoints: [
      'Strategic raw material buffer stock',
      'Automated batch progression tracking',
      'Zero stock-out commitment for exclusive partners'
    ]
  },
  {
    id: 'quality-first',
    title: 'Pharmacopeial Monograph Integrity',
    subtitle: 'Zero-Compromise Formulation',
    description: 'Rigorous multi-stage analytical quality control, HPLC assay testing, and in-vitro dissolution profiling for every manufactured batch per IP, BP, and USP standards.',
    metric: '100% Batch Tested',
    keyPoints: [
      'cGLP compliant analytical testing laboratory',
      'Pharmacopoeial monographs (IP, BP, USP)',
      'Complete Certificate of Analysis (CoA) with every delivery'
    ]
  },
  {
    id: 'flexible-partnerships',
    title: 'Flexible Contract Manufacturing & CDMO',
    subtitle: 'Tailored Commercial Solutions',
    description: 'Customizable commercial frameworks designed around partner requirements: third-party manufacturing, P2P loan licensing, institutional hospital supply, or distributor franchises.',
    metric: 'Agile Commercial Terms',
    keyPoints: [
      'PCD pharma franchise territory monopolies',
      'Third-party & P2P contract manufacturing',
      'Custom institutional pack sizes and branding'
    ]
  },
  {
    id: 'regulatory-focus',
    title: 'Regulatory & Dossier Filing Support',
    subtitle: 'Complete Technical Documentation',
    description: 'Robust regulatory documentation, CTD/eCTD/ACTD technical dossiers, and audit-ready compliance records for swift MOH drug registration in target markets.',
    metric: 'CTD / ACTD Ready',
    keyPoints: [
      'Complete CTD/eCTD dossier modules available',
      'Certificate of Pharmaceutical Product (CoPP)',
      'Real-time Zone IVb stability data reports'
    ]
  },
  {
    id: 'scalable-manufacturing',
    title: 'Scalable High-Throughput Infrastructure',
    subtitle: 'Infrastructure to Support Growth',
    description: 'High-speed automated production suites capable of seamlessly scaling from pilot validation batches (5,000 units) to large commercial production runs (500,000+ units).',
    metric: 'High Volume Scalability',
    keyPoints: [
      'Rotary tableting, softgel & liquid filling lines',
      'Class 100 sterile injectable facilities',
      'Rapid turnaround on scale-up batches'
    ]
  },
  {
    id: 'long-term-relationship',
    title: 'Sustainable Long-Term Collaboration',
    subtitle: 'Transparent & Ethical Dealings',
    description: 'We believe in building enduring business relationships rooted in transparent pricing, technical support, dedicated account executives, and mutual growth.',
    metric: 'Dedicated Account Support',
    keyPoints: [
      'Dedicated B2B commercial key account manager',
      'Territory protection and zero encroachment',
      'Collaborative product pipeline planning'
    ]
  }
];

export const COMPARISON_ITEMS: ComparisonItem[] = [
  {
    feature: 'Active API Sourcing & Identification',
    us: '100% Tested via HPLC & FTIR against pharmacopeial reference standards before dispensing',
    others: 'Batch-level paperwork review without comprehensive in-house chromatographic verification'
  },
  {
    feature: '21 CFR Part 11 Electronic Audit Trail',
    us: 'Fully computerized, immutable analytical data logging with digital signatures',
    others: 'Manual paper logbooks prone to transcription discrepancies'
  },
  {
    feature: 'ICH Climatic Zone IVb Stability Validation',
    us: 'Standard 40°C / 75% RH stability testing data generated for tropical export jurisdictions',
    others: 'Charged as expensive supplementary add-on with lengthy lead times'
  },
  {
    feature: 'Technical Regulatory Dossiers (eCTD / ACTD)',
    us: 'Ready-to-file Module 1-5 dossiers, Free Sale Certificates, and WHO-format CoPPs',
    others: 'Limited to basic manufacturing licenses with extra fees for dossier authoring'
  },
  {
    feature: 'Sterility & Bacterial Endotoxin Clearance',
    us: 'Automated kinetic chromogenic LAL testing ensuring endotoxin < 0.25 EU/mL',
    others: 'Periodic qualitative gel-clot screening without automated kinetic profiling'
  },
  {
    feature: 'Primary Barrier Packaging Standards',
    us: 'Cold-formed Alu-Alu and Type-I borosilicate neutral glass with online camera inspection',
    others: 'Standard thermoform PVC blisters without automated optical vision verification'
  },
  {
    feature: 'Cold-Chain Logistics & IoT Telemetry',
    us: 'Continuous data logger temperature tracking (+2°C to +8°C / 15°C to 25°C) from plant to port',
    others: 'Ambient third-party road freight without calibrated continuous logger reports'
  },
  {
    feature: 'Batch Sizing Flexibility & Scale-up',
    us: 'Agile pilot runs from 5,000 units to multi-million commercial runs with guaranteed timelines',
    others: 'Rigid high MOQs with unpredictable lead time fluctuations'
  }
];

export const PARTNER_BENEFITS = PARTNERSHIP_PILLARS;
