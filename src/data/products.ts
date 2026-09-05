import { Product, ProductCategory, TherapeuticSegment } from '../types';

export const CATEGORIES: { id: string; label: ProductCategory | 'All Categories' }[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'capsules', label: 'Capsules' },
  { id: 'tablets', label: 'Tablets' },
  { id: 'syrups', label: 'Syrups & Suspensions' },
  { id: 'injectables', label: 'Injectables' },
  { id: 'nutraceuticals', label: 'Nutraceuticals & Specialty' },
];

export const THERAPEUTIC_SEGMENTS: TherapeuticSegment[] = [
  'All Segments',
  'Cardiology & Metabolic',
  'Gastroenterology',
  'Orthopedics & Bone Health',
  'Pediatrics & Neurology',
  'Gynecology & Women\'s Health',
  'Hepatology',
  'Anti-Infectives & Critical Care',
];

export const PRODUCTS: Product[] = [
  {
    id: 'pro-l-q10-capsules',
    name: 'PRO-L Q10 Capsules',
    category: 'Capsules',
    therapeuticSegment: 'Cardiology & Metabolic',
    genericComposition: 'Co-Enzyme Q10 100mg + L-Carnitine L-Tartrate 500mg + Lycopene 10% 5000mcg + Zinc & Selenium Softgel Capsules',
    activeMolecules: ['Coenzyme Q10 (Ubiquinone)', 'L-Carnitine L-Tartrate', 'Lycopene 10%', 'Zinc Sulphate Monohydrate', 'Sodium Selenite'],
    dosageForm: 'Softgel Capsules',
    packaging: '10 x 1 x 10 Softgels in Alu-Alu / Mono Carton with Moisture-Barrier Foil',
    pharmacopoeiaStandard: 'USP',
    shelfLife: '24 Months from manufacturing date',
    storageCondition: 'Store in a cool, dry place below 25°C. Protect from direct sunlight and heat.',
    moq: '500 Packs / Batch MOQ',
    unit: 'Pack / Box',
    badge: 'Cardio Vitality',
    regulatoryStatus: 'Standard Pharmacopeial Formulation',
    indication: 'Mitochondrial cellular ATP energy restoration, cardiovascular support, reproductive vitality, and high-potency systemic antioxidant protection.',
    clinicalHighlights: [
      'High-bioavailability lipid formulation for superior gastrointestinal permeability',
      'Synergistic CoQ10 + L-Carnitine cellular respiration mechanism',
      'Manufactured in temperature-humidity stabilized cleanroom environments'
    ],
    features: [
      'Pure active pharmaceutical ingredient with chromatographic purity >99.5%',
      'Dual-action metabolic and mitochondrial support',
      'Tamper-evident pharmaceutical grade blister packaging'
    ]
  },
  {
    id: 'rabefill-dsr-capsules',
    name: 'Rabefill DSR Capsules',
    category: 'Capsules',
    therapeuticSegment: 'Gastroenterology',
    genericComposition: 'Rabeprazole Sodium IP 20mg (Enteric Coated) + Domperidone IP 30mg (Sustained Release) Capsules',
    activeMolecules: ['Rabeprazole Sodium IP (Enteric Coated Pellets)', 'Domperidone IP (Sustained Release Pellets)'],
    dosageForm: 'Hard Gelatin Capsules (Dual-Pellet Formulation)',
    packaging: '10 x 10 Capsules in Drip-off Box / Alu-Alu Strip Pack',
    pharmacopoeiaStandard: 'IP',
    shelfLife: '36 Months from manufacturing date',
    storageCondition: 'Store in a cool, dry place below 25°C. Protect from moisture and direct light.',
    moq: '1,000 Strips',
    unit: 'Strip / Box',
    badge: 'High Prescribing Demand',
    regulatoryStatus: 'Schedule Prescription Drug',
    indication: 'Gastroesophageal Reflux Disease (GERD), non-ulcer dyspepsia, hyperacidity, peptic ulcer disease, and gastroparesis.',
    clinicalHighlights: [
      'Dual-pellet release mechanism: immediate antiemetic relief + 24-hour continuous acid suppression',
      'Advanced enteric polymer coating prevents gastric acid degradation of active proton pump inhibitor',
      'Consistent dissolution profile across physiological pH ranges'
    ],
    features: [
      'Multi-unit pellet system ensures uniform gastrointestinal dispersion',
      'Zero dose dumping with validated in-vitro dissolution profile',
      'Triple-laminated cold-form Alu-Alu packaging against ambient humidity'
    ]
  },
  {
    id: 'calcibone-d3-softgels',
    name: 'Calcibone D3 Softgel Capsules',
    category: 'Capsules',
    therapeuticSegment: 'Orthopedics & Bone Health',
    genericComposition: 'Cholecalciferol (Vitamin D3) IP 60,000 IU Softgel Capsules',
    activeMolecules: ['Cholecalciferol (Vitamin D3) IP 60,000 International Units'],
    dosageForm: 'Softgel Capsules (Lipid Suspension)',
    packaging: '10 x 1 x 4 Softgels in Light-Protected Blister Pack',
    pharmacopoeiaStandard: 'IP',
    shelfLife: '24 Months from manufacturing date',
    storageCondition: 'Store in a dry place at or below 25°C. Protect from light.',
    moq: '500 Strips',
    unit: 'Strip / Box',
    badge: 'Essential Ortho Molecule',
    regulatoryStatus: 'Therapeutic High-Potency Dosage',
    indication: 'Correction of clinical hypovitaminosis D, management of osteoporosis, osteomalacia, hypocalcemic tetany, and musculoskeletal weakness.',
    clinicalHighlights: [
      'Medium-chain triglyceride (MCT) lipid carrier maximizes cholecalciferol bioavailability',
      'Standard weekly pulse therapeutic dosing for rapid serum 25(OH)D restoration',
      'Hermetically sealed oval soft gelatin shell prevents atmospheric oxidation'
    ],
    features: [
      'Precision dose uniformity tested per IP monograph',
      'Zero heavy metal contamination verified via atomic absorption spectroscopy',
      'Attractive packaging with anti-counterfeiting holographic strip'
    ]
  },
  {
    id: 'ovamain-tablets',
    name: 'Ovamain Tablets',
    category: 'Tablets',
    therapeuticSegment: 'Gynecology & Women\'s Health',
    genericComposition: 'Myo-Inositol 1000mg + D-Chiro-Inositol 25mg + L-Methylfolate Calcium 1mg + Vitamin D3 1000 IU Film Coated Tablets',
    activeMolecules: ['Myo-Inositol', 'D-Chiro-Inositol (40:1 Ratio)', 'L-Methylfolate Calcium', 'Vitamin D3 (Cholecalciferol)'],
    dosageForm: 'Film-Coated Tablets',
    packaging: '10 x 1 x 10 Tablets in Alu-Alu Blister Strip with Monocarton',
    pharmacopoeiaStandard: 'USP',
    shelfLife: '24 Months from manufacturing date',
    storageCondition: 'Store in a cool, dry place protected from light and moisture.',
    moq: '500 Packs / Batch MOQ',
    unit: 'Pack / Box',
    badge: 'PCOS & Ovulatory Care',
    regulatoryStatus: 'Specialized Gynecological Formulation',
    indication: 'Polycystic Ovary Syndrome (PCOS), insulin resistance-associated hyperandrogenism, ovulatory restoration, and metabolic follicular health.',
    clinicalHighlights: [
      'Scientifically established 40:1 physiological ratio of Myo-Inositol to D-Chiro-Inositol',
      'L-Methylfolate active co-factor form bypasses MTHFR genetic polymorphism',
      'Improves insulin sensitivity and optimizes ovulatory regularity'
    ],
    features: [
      'Smooth aqueous film coating for easy swallowing and taste masking',
      'Moisture-impermeable cold-formed aluminum barrier packaging',
      'HPLC assay validated active concentration'
    ]
  },
  {
    id: 'ursocure-300-tablets',
    name: 'Ursocure 300 Tablets',
    category: 'Tablets',
    therapeuticSegment: 'Hepatology',
    genericComposition: 'Ursodeoxycholic Acid IP 300mg Tablets',
    activeMolecules: ['Ursodeoxycholic Acid IP (UDCA) 300mg'],
    dosageForm: 'Uncoated / Film-Coated Tablets',
    packaging: '10 x 10 Tablets in Blister / Alu-Alu Pack',
    pharmacopoeiaStandard: 'IP',
    shelfLife: '36 Months from manufacturing date',
    storageCondition: 'Store below 25°C in a dry place. Protect from light.',
    moq: '1,000 Strips',
    unit: 'Strip / Box',
    badge: 'Hepatoprotective Core',
    regulatoryStatus: 'Schedule Prescription Medicine',
    indication: 'Primary Biliary Cholangitis (PBC), non-alcoholic fatty liver disease (NAFLD), dissolution of radiolucent cholesterol gallstones, and toxic cholestatic liver disorders.',
    clinicalHighlights: [
      'Hydrophilic bile acid that displaces toxic hydrophobic bile acids from the hepatobiliary pool',
      'Cytoprotective and membrane-stabilizing action on damaged hepatocytes and cholangiocytes',
      'Immunomodulatory effect suppressing aberrant HLA class I/II expression on liver cells'
    ],
    features: [
      'High chemical purity meeting strict IP/BP assay specifications',
      'Rapid disintegration and uniform bioavailability profile',
      'Robust stability testing substantiating 36-month shelf life'
    ]
  },
  {
    id: 'lycoreach-syrup',
    name: 'Lycoreach Syrup',
    category: 'Syrups & Suspensions',
    therapeuticSegment: 'Pediatrics & Neurology',
    genericComposition: 'Lycopene 10% + Multivitamins + Multiminerals + Antioxidants Liquid Oral Suspension',
    activeMolecules: ['Lycopene (Natural Carotenoid)', 'Vitamin A, C, E Complex', 'B-Complex Vitamins (B1, B2, B6, Nicotinamide)', 'Zinc Gluconate', 'Sodium Selenite', 'Manganese Sulphate'],
    dosageForm: 'Oral Liquid / Syrup',
    packaging: '200ml Amber PET Bottle with Measuring Cap & Sealed Monocarton',
    pharmacopoeiaStandard: 'In-House',
    shelfLife: '24 Months from manufacturing date',
    storageCondition: 'Store in a cool place, protected from direct sunlight. Do not freeze.',
    moq: '1,000 Bottles',
    unit: 'Bottle',
    badge: 'Universal Antioxidant',
    regulatoryStatus: 'Nutraceutical / Dietary Supplement',
    indication: 'Convalescence, oxidative stress defense, general physical asthenia, immune deficiency, post-surgical recovery, and nutritional deficit management.',
    clinicalHighlights: [
      'Micro-emulsified lycopene suspension ensures high gastrointestinal absorption',
      'Balanced synergistic vitamin-mineral antioxidant cascade',
      'Pleasant palatable flavor profile ensuring high pediatric and geriatric compliance'
    ],
    features: [
      'Non-settling homogeneous syrup matrix with verified suspension stability',
      'Tamper-evident shrink sleeve cap with accurate measuring unit',
      'Comprehensive microbial testing clearing bioburden and pathogens'
    ]
  },
  {
    id: 'mytro-q10-syrup',
    name: 'Mytro Q10 Syrup',
    category: 'Syrups & Suspensions',
    therapeuticSegment: 'Cardiology & Metabolic',
    genericComposition: 'Coenzyme Q10 + L-Carnitine + Cyanocobalamin (Vitamin B12) Liquid Oral Formulation',
    activeMolecules: ['Coenzyme Q10', 'L-Carnitine Base', 'Cyanocobalamin (Vitamin B12) IP', 'Elemental Zinc'],
    dosageForm: 'Oral Liquid Formulation',
    packaging: '150ml / 200ml Amber Bottle in Unit Carton with Measuring Dispenser',
    pharmacopoeiaStandard: 'In-House',
    shelfLife: '24 Months from manufacturing date',
    storageCondition: 'Store below 25°C in a dry place. Protect from heat and light.',
    moq: '1,000 Bottles',
    unit: 'Bottle',
    badge: 'Liquid Cellular Energy',
    regulatoryStatus: 'Nutritional Health Supplement',
    indication: 'Cardiovascular fatigue, chronic muscular asthenia, peripheral neuropathies, geriatric vigor revival, and mitochondrial metabolic support in liquid form.',
    clinicalHighlights: [
      'Liquid micellar dispersion of lipid-soluble CoQ10 for patients with swallowing difficulties',
      'Dual active transport mechanism boosting mitochondrial beta-oxidation',
      'Rapid systemic uptake compared to conventional solid dosage forms'
    ],
    features: [
      'Advanced flavor-masking technology eliminating unpleasant metallic notes',
      'Physically and chemically stable formulation without phase separation',
      'Amber UV-filtering PET container preserving light-sensitive bioactives'
    ]
  },
  {
    id: 'peptin-gold-syrup',
    name: 'Peptin Gold Syrup',
    category: 'Syrups & Suspensions',
    therapeuticSegment: 'Gastroenterology',
    genericComposition: 'Fungal Diastase IP (1:1200) 50mg + Pepsin IP (1:3000) 10mg Digestive Enzyme Syrup',
    activeMolecules: ['Fungal Diastase IP (Starch Degrading Enzyme)', 'Pepsin IP (Proteolytic Enzyme)'],
    dosageForm: 'Enzyme Oral Liquid',
    packaging: '200ml Amber Bottle with Measuring Cap & Drip-Off Monocarton',
    pharmacopoeiaStandard: 'IP',
    shelfLife: '18 Months from manufacturing date',
    storageCondition: 'Store in a cool, dry place. Keep container tightly closed after use.',
    moq: '1,000 Bottles',
    unit: 'Bottle',
    badge: 'Digestive Enzyme Core',
    regulatoryStatus: 'Digestive Formulation',
    indication: 'Functional dyspepsia, chronic post-prandial bloating, enzyme insufficiency, anorexia, gastrointestinal fullness, and post-illness digestive weakness.',
    clinicalHighlights: [
      'Fungal diastase actively digests complex starches into readily absorbable simple carbohydrates',
      'Pepsin facilitates complete protein breakdown in acidic stomach environments',
      'Fast-acting enzymatic relief from feeling of abdominal heaviness and distension'
    ],
    features: [
      'High enzymatic activity confirmed through standardized IP enzymatic assay testing',
      'Aromatic pleasant syrup base promoting digestive appetite stimulation',
      'Certified microbial purity and heavy metal clearance'
    ]
  },
  {
    id: 'pro-carnoshine-syrup',
    name: 'PRO Carnoshine Syrup',
    category: 'Syrups & Suspensions',
    therapeuticSegment: 'Pediatrics & Neurology',
    genericComposition: 'L-Carnosine 100mg Liquid Oral Formulation',
    activeMolecules: ['L-Carnosine (Beta-Alanyl-L-Histidine) 100mg'],
    dosageForm: 'Oral Liquid Formulation',
    packaging: '100ml Amber Bottle with Child-Resistant Measuring Cap & Monocarton',
    pharmacopoeiaStandard: 'USP',
    shelfLife: '24 Months from manufacturing date',
    storageCondition: 'Store in a cool, dry place below 25°C. Protect from moisture and direct sunlight.',
    moq: '1,000 Bottles',
    unit: 'Bottle',
    badge: 'Neuro-Cognitive Support',
    regulatoryStatus: 'Specialized Neuro-Nutritional Formulation',
    indication: 'Neurological developmental support, speech and socialization enhancement in pediatric neuro-atypical conditions, cellular antiglycation, and neuroprotection.',
    clinicalHighlights: [
      'Di-peptide antioxidant with proven blood-brain barrier permeability',
      'Protects neuronal membrane lipids against toxic lipid peroxidation and free radical injury',
      'Enhances frontal lobe neuronal synchronization and neurotransmitter receptor sensitivity'
    ],
    features: [
      'HPLC assay verified purity and dipeptide potency',
      'Pleasant child-friendly taste formulation ensuring continuous therapeutic compliance',
      'Strict quality parameters meeting international USP monograph standards'
    ]
  },
  {
    id: 'rabefill-iv-injection',
    name: '20mg Rabefill IV Injection',
    category: 'Injectables',
    therapeuticSegment: 'Anti-Infectives & Critical Care',
    genericComposition: 'Rabeprazole Sodium IP 20mg Lyophilized Sterile Powder for Injection with Sterile Water for Injections IP',
    activeMolecules: ['Rabeprazole Sodium IP (Sterile Lyophilized Powder)', 'Sterile Water for Injections IP (Diluent)'],
    dosageForm: 'Lyophilized Sterile Powder for IV Injection (Vial + Diluent Ampoule)',
    packaging: 'Single Dose 10ml Neutral Glass Vial + 5ml FFS Sterile Water Ampoule in Rigid Monocarton',
    pharmacopoeiaStandard: 'IP',
    shelfLife: '24 Months from manufacturing date',
    storageCondition: 'Store below 25°C. Protect from light. Reconstituted solution should be used immediately.',
    moq: '500 Vials / Batch MOQ',
    unit: 'Vial / Pack',
    badge: 'Critical Care IV',
    regulatoryStatus: 'Schedule Prescription Hospital Injectable',
    indication: 'Severe gastrointestinal ulcer bleeding, acute reflux esophagitis with aspiration risk, Zollinger-Ellison syndrome, and stress ulcer prophylaxis in ICU patients.',
    clinicalHighlights: [
      'Aseptic freeze-drying (lyophilization) preserves molecule integrity and ensures instant reconstitution',
      'Rapid intravenous onset delivering maximum gastric acid suppression within 1 hour',
      'Direct proton pump inhibition without reliance on hepatic CYP2C19 extensive metabolism'
    ],
    features: [
      'Manufactured inside Class 100 (Grade A) laminar cleanroom isolators',
      '100% bacterial endotoxin tested (LAL test) ensuring endotoxin <0.2 EU/mg',
      'Type-I USP borosilicate glass neutral vial ensuring zero alkali leaching'
    ]
  }
];
