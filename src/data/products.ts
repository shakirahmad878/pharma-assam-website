import { Product, ProductCategory } from '../types';

export const CATEGORIES: { id: string; label: ProductCategory | 'All Products' }[] = [
  { id: 'all', label: 'All Products' },
  { id: 'capsules', label: 'Pharmaceutical Capsules' },
  { id: 'syrups', label: 'Pharmaceutical Syrup' },
  { id: 'tablets', label: 'Pharmaceutical Tablets' },
  { id: 'injectable', label: 'Pharmaceutical Injectable' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'ursocure-300-tablets',
    name: 'Ursocure 300 Tablets',
    category: 'Pharmaceutical Tablets',
    therapeuticSegment: 'Hepatology',
    genericComposition: 'Ursodeoxycholic Acid IP 300mg Tablets',
    activeMolecules: ['Ursodeoxycholic Acid IP (UDCA) 300mg'],
    dosageForm: 'Tablets',
    form: 'Tablets',
    packaging: '10 x 1 x 10 Pack',
    packagingSize: '10x1x10 Pack',
    countryOfOrigin: 'Made In India',
    pharmacopoeiaStandard: 'IP',
    shelfLife: '36 Months',
    storageCondition: 'Store below 25°C in a dry place. Protect from light.',
    moq: '1,000 Strips',
    unit: 'Strip',
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
    ],
    imageUrl: 'https://2.wlimg.com/product_images/bc-500/2026/2/12905670/ursocure-300-tablets-1772254611-7305720.jpeg'
  },
  {
    id: '20mg-rabefill-iv-injection',
    name: '20mg Rabefill IV Injection',
    category: 'Pharmaceutical Injectable',
    therapeuticSegment: 'Anti-Infectives & Critical Care',
    genericComposition: 'Rabeprazole Sodium IP 20mg Lyophilized Sterile Powder for Injection with Sterile Water for Injections IP',
    activeMolecules: ['Rabeprazole Sodium IP (Sterile Lyophilized Powder)', 'Sterile Water for Injections IP (Diluent)'],
    dosageForm: 'Liquid / Lyophilized Injection',
    form: 'Liquid',
    packaging: 'Single Dose 10ml Neutral Glass Vial + 5ml FFS Sterile Water Ampoule in Rigid Monocarton',
    packagingSize: '1 Vial',
    countryOfOrigin: 'India',
    purity: '100%',
    pharmacopoeiaStandard: 'IP',
    shelfLife: '24 Months',
    storageCondition: 'Store below 25°C. Protect from light. Reconstituted solution should be used immediately.',
    moq: '500 Vials',
    unit: 'Pack',
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
    ],
    imageUrl: 'https://2.wlimg.com/product_images/bc-500/2026/2/12905670/20mg-rabefill-iv-injection-1772254654-7301891.jpeg'
  },
  {
    id: 'calcibone-d3-softgel-capsules',
    name: 'Calcibone D3 Softgel Capsules',
    category: 'Pharmaceutical Capsules',
    therapeuticSegment: 'Orthopedics & Bone Health',
    genericComposition: 'Cholecalciferol (Vitamin D3) IP 60,000 IU Softgel Capsules',
    activeMolecules: ['Cholecalciferol (Vitamin D3) IP 60,000 International Units'],
    dosageForm: 'Softgel Capsules',
    form: 'Capsule',
    packaging: '10 x 1 x 4 Softgels in Light-Protected Blister Pack',
    packagingSize: '10 x 1 x 4 Capsules',
    countryOfOrigin: 'India',
    pharmacopoeiaStandard: 'IP',
    shelfLife: '24 Months',
    storageCondition: 'Store in a dry place at or below 25°C. Protect from light.',
    moq: '500 Strips',
    unit: 'Strip',
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
    ],
    imageUrl: 'https://2.wlimg.com/product_images/bc-500/2026/2/12905670/calcibone-d3-softgel-capsules-1772254397-7305637.jpeg'
  },
  {
    id: 'mytro-q10-syrup',
    name: 'Mytro Q10 Syrup',
    category: 'Pharmaceutical Syrup',
    therapeuticSegment: 'Cardiology & Metabolic',
    genericComposition: 'Co-Enzyme Q10, L-Carnitine, Benfotiamine, Riboflavin, Pyridoxine HCL, Ascorbic Acid & Vitamin Syrup',
    activeMolecules: ['Coenzyme Q10', 'L-Carnitine Base', 'Benfotiamine', 'Riboflavin', 'Pyridoxine HCL', 'Ascorbic Acid'],
    dosageForm: 'Syrup / Oral Liquid',
    form: 'Liquid',
    packaging: '200ml Amber PET Bottle with Measuring Cap & Sealed Monocarton',
    packagingSize: '200ml',
    countryOfOrigin: 'India',
    pharmacopoeiaStandard: 'In-House',
    shelfLife: '24 Months',
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
    ],
    imageUrl: 'https://2.wlimg.com/product_images/bc-500/2026/2/12905670/mytro-q10-syrup-1772254311-7305673.jpeg'
  },
  {
    id: 'ovamain-tablets',
    name: 'Ovamain Tablets',
    category: 'Pharmaceutical Tablets',
    therapeuticSegment: 'Gynecology & Women\'s Health',
    genericComposition: 'Myo-Inositol 1000mg + D-Chiro-Inositol 25mg + L-Methylfolate Calcium 1mg + Vitamin D3 1000 IU Film Coated Tablets',
    activeMolecules: ['Myo-Inositol', 'D-Chiro-Inositol (40:1 Ratio)', 'L-Methylfolate Calcium', 'Vitamin D3 (Cholecalciferol)'],
    dosageForm: 'Film-Coated Tablets',
    form: 'Tablets',
    packaging: '10 x 1 x 10 Tablets in Alu-Alu Blister Strip with Monocarton',
    packagingSize: '10 x 1 x 10 Pack',
    countryOfOrigin: 'India',
    pharmacopoeiaStandard: 'USP',
    shelfLife: '24 Months',
    storageCondition: 'Store in a cool, dry place protected from light and moisture.',
    moq: '500 Packs',
    unit: 'Strip',
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
    ],
    imageUrl: 'https://2.wlimg.com/product_images/bc-500/2026/2/12905670/ovamain-tablets-1772254436-7305687.jpeg'
  },
  {
    id: 'peptin-gold-syrup',
    name: 'Peptin Gold Syrup',
    category: 'Pharmaceutical Syrup',
    therapeuticSegment: 'Gastroenterology',
    genericComposition: 'Fungal Diastase IP (1:1200) 50mg + Pepsin IP (1:3000) 10mg Digestive Enzyme Syrup',
    activeMolecules: ['Fungal Diastase IP (Starch Degrading Enzyme)', 'Pepsin IP (Proteolytic Enzyme)'],
    dosageForm: 'Enzyme Oral Liquid / Syrup',
    form: 'Liquid',
    packaging: '200ml Amber Bottle with Measuring Cap & Drip-Off Monocarton',
    packagingSize: '200ml',
    countryOfOrigin: 'India',
    pharmacopoeiaStandard: 'IP',
    shelfLife: '18 Months',
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
    ],
    imageUrl: 'https://2.wlimg.com/product_images/bc-500/2026/2/12905670/peptin-gold-syrup-1772254350-7305693.jpeg'
  },
  {
    id: 'pro-carnoshine-syrup',
    name: 'PRO Carnoshine Syrup',
    category: 'Pharmaceutical Syrup',
    therapeuticSegment: 'Pediatrics & Neurology',
    genericComposition: 'L-Carnosine 100mg Liquid Oral Formulation',
    activeMolecules: ['L-Carnosine (Beta-Alanyl-L-Histidine) 100mg'],
    dosageForm: 'Oral Liquid / Syrup',
    form: 'Liquid',
    packaging: '100ml Amber Bottle with Child-Resistant Measuring Cap & Monocarton',
    packagingSize: '100ml',
    countryOfOrigin: 'India',
    pharmacopoeiaStandard: 'USP',
    shelfLife: '24 Months',
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
    ],
    imageUrl: 'https://2.wlimg.com/product_images/bc-500/2026/2/12905670/pro-carnoshine-syrup-1772254587-7305697.jpeg'
  },
  {
    id: 'pro-l-q10-capsules',
    name: 'PRO-L Q10 Capsules',
    category: 'Pharmaceutical Capsules',
    therapeuticSegment: 'Cardiology & Metabolic',
    genericComposition: 'Co-Enzyme Q10 100mg + L-Carnitine L-Tartrate 500mg + Lycopene 10% 5000mcg + Zinc & Selenium Softgel Capsules',
    activeMolecules: ['Coenzyme Q10 (Ubiquinone)', 'L-Carnitine L-Tartrate', 'Lycopene 10%', 'Zinc Sulphate Monohydrate', 'Sodium Selenite'],
    dosageForm: 'Softgel Capsules',
    form: 'Capsule',
    packaging: '10 x 1 x 10 Softgels in Alu-Alu / Mono Carton with Moisture-Barrier Foil',
    packagingSize: '10 x 1 x 10 Pack',
    countryOfOrigin: 'India',
    pharmacopoeiaStandard: 'USP',
    shelfLife: '24 Months',
    storageCondition: 'Store in a cool, dry place below 25°C. Protect from direct sunlight and heat.',
    moq: '500 Packs',
    unit: 'Strip',
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
    ],
    imageUrl: 'https://2.wlimg.com/product_images/bc-500/2026/2/12905670/pro-l-q10-capsules-1772254518-7305705.jpeg'
  },
  {
    id: 'rabefill-dsr-capsules',
    name: 'Rabefill DSR Capsules',
    category: 'Pharmaceutical Capsules',
    therapeuticSegment: 'Gastroenterology',
    genericComposition: 'Rabeprazole Sodium IP 20mg (Enteric Coated) + Domperidone IP 30mg (Sustained Release) Capsules',
    activeMolecules: ['Rabeprazole Sodium IP (Enteric Coated Pellets)', 'Domperidone IP (Sustained Release Pellets)'],
    dosageForm: 'Hard Gelatin Capsules (Dual-Pellet Formulation)',
    form: 'Capsule',
    packaging: '10 x 10 Capsules in Drip-off Box / Alu-Alu Strip Pack',
    packagingSize: '10 x 10 Pack',
    countryOfOrigin: 'India',
    pharmacopoeiaStandard: 'IP',
    shelfLife: '36 Months',
    storageCondition: 'Store in a cool, dry place below 25°C. Protect from moisture and direct light.',
    moq: '1,000 Strips',
    unit: 'Strip',
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
    ],
    imageUrl: 'https://2.wlimg.com/product_images/bc-500/2026/2/12905670/rabefill-dsr-capsules-1772254673-7305716.jpeg'
  },
  {
    id: 'lycoreach-syrup',
    name: 'Lycoreach Syrup',
    category: 'Pharmaceutical Syrup',
    therapeuticSegment: 'Pediatrics & Neurology',
    genericComposition: 'Lycopene 10% + Multivitamins + Multiminerals + Antioxidants Liquid Oral Suspension',
    activeMolecules: ['Lycopene (Natural Carotenoid)', 'Vitamin A, C, E Complex', 'B-Complex Vitamins (B1, B2, B6, Nicotinamide)', 'Zinc Gluconate', 'Sodium Selenite', 'Manganese Sulphate'],
    dosageForm: 'Oral Liquid / Syrup',
    form: 'Liquid',
    packaging: '200ml Amber PET Bottle with Measuring Cap & Sealed Monocarton',
    packagingSize: '200ml',
    countryOfOrigin: 'India',
    pharmacopoeiaStandard: 'In-House',
    shelfLife: '24 Months',
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
    ],
    imageUrl: 'https://2.wlimg.com/product_images/bc-500/2026/2/12905670/lycoreach-syrup-1772254477-7305655.jpeg'
  }
];
