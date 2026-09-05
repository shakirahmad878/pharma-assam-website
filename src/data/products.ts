import { Product, ProductCategory, TherapeuticSegment } from '../types';

export const CATEGORIES: { id: string; label: ProductCategory | 'All Categories' }[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'tablets', label: 'Tablets' },
  { id: 'capsules', label: 'Capsules' },
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
    id: 'coq10-carnitine-softgel',
    name: 'Coenzyme Q10 + L-Carnitine Softgel Capsules',
    category: 'Capsules',
    therapeuticSegment: 'Cardiology & Metabolic',
    genericComposition: 'Co-Enzyme Q10 100mg + L-Carnitine L-Tartrate 500mg + Lycopene 10% 5000mcg + Zinc & Selenium Softgel Capsules',
    activeMolecules: ['Coenzyme Q10 (Ubiquinone)', 'L-Carnitine L-Tartrate', 'Lycopene 10%', 'Zinc Sulphate Monohydrate', 'Sodium Selenite'],
    dosageForm: 'Softgel Capsules',
    packaging: '10 x 1 x 10 Softgels in Alu-Alu / Mono Carton with Moisture-Barrier Foil',
    pharmacopoeiaStandard: 'USP',
    shelfLife: '24 Months from manufacturing date',
    storageCondition: 'Store in a cool, dry place below 25°C. Protect from direct sunlight and heat.',
    moq: '[500 Packs / Batch MOQ]',
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
    id: 'rabeprazole-domperidone-capsules',
    name: 'Rabeprazole (EC) + Domperidone (SR) Capsules',
    category: 'Capsules',
    therapeuticSegment: 'Gastroenterology',
    genericComposition: 'Rabeprazole Sodium IP 20mg (Enteric Coated) + Domperidone IP 30mg (Sustained Release) Capsules',
    activeMolecules: ['Rabeprazole Sodium IP (Enteric Coated Pellets)', 'Domperidone IP (Sustained Release Pellets)'],
    dosageForm: 'Hard Gelatin Capsules (Dual-Pellet Formulation)',
    packaging: '10 x 10 Capsules in Drip-off Box / Alu-Alu Strip Pack',
    pharmacopoeiaStandard: 'IP',
    shelfLife: '36 Months from manufacturing date',
    storageCondition: 'Store in a cool, dry place below 25°C. Protect from moisture and direct light.',
    moq: '[1,000 Strips]',
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
    id: 'cholecalciferol-softgel-60k',
    name: 'Cholecalciferol (Vitamin D3) 60,000 IU Softgels',
    category: 'Capsules',
    therapeuticSegment: 'Orthopedics & Bone Health',
    genericComposition: 'Cholecalciferol (Vitamin D3) IP 60,000 IU Softgel Capsules',
    activeMolecules: ['Cholecalciferol (Vitamin D3) IP 60,000 International Units'],
    dosageForm: 'Softgel Capsules (Lipid Suspension)',
    packaging: '10 x 1 x 4 Softgels in Light-Protected Blister Pack',
    pharmacopoeiaStandard: 'IP',
    shelfLife: '24 Months from manufacturing date',
    storageCondition: 'Store in a dry place at or below 25°C. Protect from light.',
    moq: '[500 Strips]',
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
      'Strict HPLC assay compliance ensuring exact 60,000 IU potency per softgel',
      'High patient compliance due to compact easy-to-swallow capsule geometry',
      'Certified gelatin source complying with pharmacopeial microbial limits'
    ]
  },
  {
    id: 'myo-inositol-folate-tablets',
    name: 'Myo-Inositol + D-Chiro Inositol + L-Methylfolate Tablets',
    category: 'Tablets',
    therapeuticSegment: 'Gynecology & Women\'s Health',
    genericComposition: 'Myo-Inositol 1000mg + D-Chiro Inositol 25mg + L-Methylfolate Calcium 1mg + Vitamin D3 1000 IU Tablets',
    activeMolecules: ['Myo-Inositol (USP)', 'D-Chiro-Inositol', 'L-Methylfolate Calcium', 'Cholecalciferol (Vitamin D3)'],
    dosageForm: 'Film-Coated Bilayer Tablets',
    packaging: '10 x 1 x 10 Tablets in Alu-Alu Blister Box',
    pharmacopoeiaStandard: 'USP',
    shelfLife: '24 Months from manufacturing date',
    storageCondition: 'Store in a cool, dry place below 25°C. Keep container tightly closed.',
    moq: '[500 Packs]',
    unit: 'Pack / Box',
    badge: 'Gynecology Benchmark',
    regulatoryStatus: 'Standard Pharmaceutical Formulation',
    indication: 'Polycystic Ovarian Syndrome (PCOS/PCOD), insulin resistance, ovulatory dysfunction, hyperandrogenism, and hormonal balancing.',
    clinicalHighlights: [
      'Clinically benchmarked 40:1 physiological ratio of Myo-Inositol to D-Chiro-Inositol',
      'Contains 4th generation bioactive L-Methylfolate bypassing MTHFR gene polymorphism',
      'First-line prescription therapy for insulin-sensitizing ovarian support'
    ],
    features: [
      'Film coating protects active inositols from moisture-induced degradation',
      'Rigorous uniform weight and content uniformity compliance',
      'Consistent stability data under accelerated conditions'
    ]
  },
  {
    id: 'ursodeoxycholic-acid-300-tablets',
    name: 'Ursodeoxycholic Acid 300mg Film-Coated Tablets',
    category: 'Tablets',
    therapeuticSegment: 'Hepatology',
    genericComposition: 'Ursodeoxycholic Acid IP 300mg Tablets',
    activeMolecules: ['Ursodeoxycholic Acid IP (UDCA) 300mg'],
    dosageForm: 'Film-Coated Tablets',
    packaging: '10 x 10 Tablets in Alu-Alu Moisture Barrier Strip',
    pharmacopoeiaStandard: 'IP',
    shelfLife: '36 Months from manufacturing date',
    storageCondition: 'Store below 30°C in original packaging. Protect from direct moisture.',
    moq: '[1,000 Strips]',
    unit: 'Strip / Box',
    badge: 'Hepatology Specialist',
    regulatoryStatus: 'Schedule Prescription Drug',
    indication: 'Primary Biliary Cholangitis (PBC), dissolution of radiolucent non-calcified gallstones, and cholestatic liver diseases.',
    clinicalHighlights: [
      'Hepatoprotective hydrophilic bile acid replaces cytotoxic hydrophobic bile acids in liver pool',
      'Protects hepatocyte and cholangiocyte cell membranes from oxidative and toxic bile injury',
      'Manufactured with micronized UDCA API ensuring rapid gastrointestinal dissolution'
    ],
    features: [
      'Strict pharmacopeial dissolution rate >80% in 30 minutes',
      'High chemical purity API with verified absence of toxic lithocholic acid impurities',
      'Export-grade blister packaging with anti-counterfeiting holographic strip'
    ]
  },
  {
    id: 'lycopene-multivitamin-syrup',
    name: 'Lycopene + Multivitamin & Minerals Oral Suspension',
    category: 'Syrups & Suspensions',
    therapeuticSegment: 'Cardiology & Metabolic',
    genericComposition: 'Lycopene 10% 2000mcg + Niacinamide IP 25mg + Pyridoxine HCl IP 1.5mg + Cyanocobalamin IP 1mcg + Folic Acid IP 100mcg + Zinc & Minerals Liquid',
    activeMolecules: ['Lycopene 10% Extract', 'Niacinamide IP', 'Pyridoxine Hydrochloride IP', 'Cyanocobalamin IP', 'Folic Acid IP', 'Zinc Gluconate'],
    dosageForm: 'Liquid Syrup Suspension',
    packaging: '200 ml Amber PET Bottle with Calibrated Measuring Cup & High-Gloss Outer Carton',
    pharmacopoeiaStandard: 'IP',
    shelfLife: '18 Months from manufacturing date',
    storageCondition: 'Store in a cool, dry place. Protect from light. Shake well before use.',
    moq: '[1,200 Bottles]',
    unit: 'Bottle',
    badge: 'High Volume Liquid',
    regulatoryStatus: 'Standard Pharmaceutical Liquid',
    indication: 'Post-illness convalescence, physical fatigue, vascular endothelial antioxidant support, micronutrient deficiency, and immune strengthening.',
    clinicalHighlights: [
      'Micro-emulsified lycopene suspension for maximum oral bioavailability',
      'Zero metallic aftertaste with pharmaceutical-grade mixed-berry organoleptic vehicle',
      'Amber PET bottle prevents photochemical degradation of active vitamins'
    ],
    features: [
      'Homogeneous suspension with verified viscosity and uniform pouring characteristics',
      'Automated volumetric liquid filling in HEPA-filtered cleanroom environment',
      'Calibrated pharmaceutical dosing cap included with every individual bottle'
    ]
  },
  {
    id: 'digestive-enzymes-syrup',
    name: 'Fungal Diastase + Pepsin Digestive Enzyme Syrup',
    category: 'Syrups & Suspensions',
    therapeuticSegment: 'Gastroenterology',
    genericComposition: 'Fungal Diastase (1:1200) IP 50mg + Pepsin (1:3000) IP 10mg Digestive Enzyme Syrup',
    activeMolecules: ['Fungal Diastase IP (Derived from Aspergillus oryzae)', 'Pepsin IP (Proteolytic Enzyme)'],
    dosageForm: 'Liquid Enzyme Elixir',
    packaging: '200 ml Round Amber Bottle in Embossed Metallic Outer Mono Carton',
    pharmacopoeiaStandard: 'IP',
    shelfLife: '18 Months from manufacturing date',
    storageCondition: 'Store below 25°C in a dry place. Protect from heat and sunlight.',
    moq: '[1,000 Bottles]',
    unit: 'Bottle',
    badge: 'Fast Moving Digestive',
    regulatoryStatus: 'Standard Formulation',
    indication: 'Enzyme-deficient dyspepsia, post-prandial heaviness, functional flatulence, loss of appetite, and chronic digestive insufficiency.',
    clinicalHighlights: [
      'Dual-enzyme digestive action: Fungal Diastase digests dietary starches while Pepsin breaks down complex dietary proteins',
      'Acid-stable enzyme complex active across broad physiological gastric pH ranges',
      'Palatable aromatic carminative vehicle soothing gastrointestinal mucosa'
    ],
    features: [
      'Standardized enzymatic activity assay verification per batch',
      'Tamper-evident ROPP cap with leak-proof inner sealing plug',
      'Consistently high reorder rate from hospital pharmacies & retail stockists'
    ]
  },
  {
    id: 'l-carnosine-pediatric-syrup',
    name: 'L-Carnosine 100mg/5ml Neuroprotective Oral Solution',
    category: 'Syrups & Suspensions',
    therapeuticSegment: 'Pediatrics & Neurology',
    genericComposition: 'L-Carnosine 100mg per 5ml Cognitive & Neuroprotective Liquid Formulation',
    activeMolecules: ['L-Carnosine (Beta-Alanyl-L-Histidine Dipeptide) 100mg/5ml'],
    dosageForm: 'Oral Pediatric Liquid Solution',
    packaging: '100 ml Amber PET Bottle with Child-Resistant Measuring Cap & Mono Carton',
    pharmacopoeiaStandard: 'In-House',
    shelfLife: '24 Months from manufacturing date',
    storageCondition: 'Store in a cool, dry place. Keep out of reach of children.',
    moq: '[600 Bottles]',
    unit: 'Bottle',
    badge: 'Specialty Pediatric Neuro',
    regulatoryStatus: 'Proprietary Pharmaceutical Formulation',
    indication: 'Neurodevelopmental delay, cognitive function support, and neuroprotective antioxidant adjuvant therapy.',
    clinicalHighlights: [
      'High-purity synthetic dipeptide L-Carnosine freely crossing blood-brain barrier',
      'Protects neuronal synaptic membranes from lipid peroxidation and advanced glycation end-products (AGEs)',
      'High clinical adoption among developmental pediatricians'
    ],
    features: [
      'Sugar-free, dye-free formulation safe for pediatric therapeutic regimens',
      'Validated stability at diverse ambient temperature profiles',
      'High-precision volumetric automated liquid dosing assurance'
    ]
  },
  {
    id: 'rabeprazole-iv-injection',
    name: 'Rabeprazole Sodium 20mg Lyophilized IV Injection',
    category: 'Injectables',
    therapeuticSegment: 'Anti-Infectives & Critical Care',
    genericComposition: 'Rabeprazole Sodium for Injection IP 20mg (Sterile Lyophilized Powder) + 5ml Sterile Water for Injections (WFI)',
    activeMolecules: ['Rabeprazole Sodium IP (Sterile Lyophilized Cake) 20mg', 'Sterile Water for Injections IP 5ml Ampoule'],
    dosageForm: 'Sterile Lyophilized Powder for Reconstitution (IV Injection)',
    packaging: 'Single-Dose USP Type-I Borosilicate Glass Vial + 5ml Plastic/Glass Ampoule in Mono Carton',
    pharmacopoeiaStandard: 'IP',
    shelfLife: '24 Months from manufacturing date',
    storageCondition: 'Store below 25°C. Protect from light. Reconstituted solution must be used immediately.',
    moq: '[2,000 Vials]',
    unit: 'Pack / Vial',
    badge: 'Critical Care Hospital Grade',
    regulatoryStatus: 'Schedule Prescription Injectable',
    indication: 'Acute upper gastrointestinal hemorrhage, severe acute erosive GERD, prophylaxis of stress-induced gastrointestinal ulcers in ICU surgical settings.',
    clinicalHighlights: [
      'Lyophilized in sterile Class 100 (Grade A) laminar airflow cleanrooms',
      'Rapid intravenous onset of action with 100% systemic bioavailability within minutes',
      'Non-pyrogenic, bacterial endotoxin tested (<0.2 EU/mg) for patient safety'
    ],
    features: [
      'USP Type-I neutral borosilicate glass prevents alkali leaching into active solution',
      'Bromobutyl rubber stoppers with aluminum flip-off seals for aseptic integrity',
      'Supplied to leading multi-specialty hospitals and trauma care centers'
    ]
  }
];
