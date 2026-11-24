import { Product, ProductCategory } from '../types';

export const CATEGORIES: { id: string; label: ProductCategory | 'All Products' }[] = [
  { id: 'all', label: 'All Products' },
  { id: 'nutritional', label: 'Nutritional Support' },
  { id: 'omega3', label: 'Omega-3 Range' },
  { id: 'digestive', label: 'Digestive Wellness' },
  { id: 'cardio', label: 'Cardiovascular & Energy' },
  { id: 'skin', label: 'Skin Brightening' },
  { id: 'women', label: "Women's & Specialized Wellness" },
];

export const PRODUCTS: Product[] = [
  {
    id: 'lyco-kr-syrup',
    name: 'Lyco-KR Syrup',
    brandName: 'Lyco-KR',
    genericName: 'Lycopene, L-Lysine, Zinc & Vitamin B-Complex Syrup',
    category: 'Nutritional Support',
    therapeuticSegment: 'Nutritional Support',
    genericComposition: 'Lycopene (10%) 2000 IU, L-Lysine Hydrochloride 200 mg, Zinc (as Zinc Sulphate) 35 mg, Vitamin B1 2 mg, Vitamin B2 3 mg, Vitamin B6 1.5 mg, Vitamin B12 2.2 mcg, Nicotinamide 2.1 mg, D-Panthenol 2.25 mg Syrup',
    activeMolecules: [
      'Lycopene (10%) 2000 IU',
      'L-Lysine Hydrochloride 200 mg',
      'Zinc (as Zinc Sulphate) 35 mg',
      'Vitamin B-Complex (B1, B2, B6, B12, Nicotinamide, D-Panthenol)'
    ],
    dosageForm: 'Syrup',
    form: 'Liquid',
    packaging: '200 ml Amber PET Bottle in Rigid Outer Monocarton',
    packagingSize: '200 ml Syrup',
    packSize: '200 ml',
    countryOfOrigin: 'India',
    pharmacopoeiaStandard: 'IP',
    shelfLife: '24 Months',
    storageCondition: 'Store below 25°C in a cool and dark place. Protect from direct light.',
    moq: '500 Bottles',
    unit: 'Bottle',
    badge: 'Sugar Free Antioxidant',
    regulatoryStatus: 'Dietary & Therapeutic Supplement',
    indication: 'Nutritional deficiency, convalescence & general debility, low immunity, physical growth & tissue repair, oxidative cellular stress & loss of appetite.',
    clinicalHighlights: [
      'Lycopene (10%): Potent natural carotenoid antioxidant that scavenges free radicals, protecting cellular structures and DNA from oxidative stress while stimulating collagen synthesis.',
      'L-Lysine Hydrochloride: Essential amino acid promoting protein synthesis, accelerating tissue repair, improving calcium absorption, and shortening healing times for mucosal viral infections.',
      'Zinc & Vitamin B-Complex: Vital enzymatic cofactors supporting energy metabolism, erythropoiesis (RBC synthesis), cellular immune defense, and central nervous system integrity.',
      '100% Sugar-Free formulation ensuring safe administration for diabetic and health-conscious patients.'
    ],
    features: [
      'Sugar-Free formulation for wide clinical suitability',
      'Rich in high-potency Lycopene and essential L-Lysine',
      'Balanced B-Complex + Zinc for immune resilience'
    ],
    imageUrl: './images/products/lyco-kr-syrup.jpg'
  },
  {
    id: 'nl-nine-granules',
    name: 'NL-Nine Granules',
    brandName: 'NL-Nine',
    genericName: 'L-Arginine, DHA, Proanthocyanidin, Lycopene, Folic Acid, Zinc & Multivitamin Sachet',
    category: 'Nutritional Support',
    therapeuticSegment: 'Nutritional Support',
    genericComposition: 'L-Arginine 3 gm, DHA 20% 200 mg, Proanthocyanidin 75 mg, Lycopene 6% 2000 mcg, Folic Acid 300 mcg, Vitamin C 2 mg, Vitamin B6 3.1 mg, Cyanocobalamin 2.2 mcg, Zinc Sulphate Mono 5 mcg per 5 gm Sachet',
    activeMolecules: [
      'L-Arginine 3 gm',
      'DHA (Docosahexaenoic Acid 20%) 200 mg',
      'Proanthocyanidin 75 mg',
      'Lycopene 6% 2000 mcg',
      'Folic Acid 300 mcg',
      'Vitamin B6, B12, C & Zinc'
    ],
    dosageForm: 'Granules / Sachet',
    form: 'Granules',
    packaging: '10 x 5 gm Sachets in High-Barrier Foil Laminate Dispenser Box',
    packagingSize: '10 x 5 gm Sachets',
    packSize: '10 Sachets',
    countryOfOrigin: 'India',
    pharmacopoeiaStandard: 'Nutraceutical',
    shelfLife: '24 Months',
    storageCondition: 'Store in a cool, dry place away from heat and moisture.',
    moq: '500 Boxes',
    unit: 'Box',
    badge: 'Maternal & Vital Stamina',
    regulatoryStatus: 'Nutraceutical / Pregnancy Support',
    indication: 'Intrauterine growth restriction (IUGR), oligohydramnios, pre-eclampsia prevention, maternal & fetal nutritional support, endothelial vascular wellness, stamina.',
    clinicalHighlights: [
      'L-Arginine (3 gm): Nitric oxide (NO) precursor that enhances endothelial vasodilation, optimizing utero-placental perfusion and systemic blood flow.',
      'DHA (20% 200 mg): Critical structural omega-3 lipid necessary for fetal neurogenesis, cortical grey matter formation, and retinal development.',
      'Proanthocyanidin (75 mg) & Lycopene (2000 mcg): Polyphenolic antioxidants strengthening microvascular wall integrity and neutralizing gestational oxidative stress.',
      'Folic Acid (300 mcg) & Zinc: Essential for cellular mitosis, neural tube closure, DNA replication, and immunological support.'
    ],
    features: [
      'Refreshing Orange Flavour for high patient compliance',
      'Convenient pre-measured single-dose 5 gm sachets',
      'Clinically formulated for pregnancy and systemic circulation'
    ],
    imageUrl: './images/products/nl-nine-granules.jpg'
  },
  {
    id: 'myo-q10-syrup',
    name: 'Myo-Q10 Syrup',
    brandName: 'Myo-Q10',
    genericName: 'Co-Enzyme Q10, L-Carnitine, Riboflavin, Pyridoxine HCL, Ascorbic Acid & Vitamin E Syrup',
    category: 'Cardiovascular & Energy',
    therapeuticSegment: 'Cardiovascular & Energy',
    genericComposition: 'Co-Enzyme Q10 30 mg, L-Carnitine 500 mg, Riboflavin 20 mg, Pyridoxine HCL 40 mg, Ascorbic Acid 100 mg & Vitamin E 25 IU per 5 ml Syrup',
    activeMolecules: [
      'Co-Enzyme Q10 (Ubidecarenone) 30 mg',
      'L-Carnitine 500 mg',
      'Riboflavin (Vit B2) 20 mg',
      'Pyridoxine HCL (Vit B6) 40 mg',
      'Ascorbic Acid (Vit C) 100 mg',
      'Vitamin E 25 IU'
    ],
    dosageForm: 'Syrup',
    form: 'Liquid',
    packaging: '225 ml Bottle in Rigid Protective Monocarton',
    packagingSize: '225 ml Bottle',
    packSize: '225 ml',
    countryOfOrigin: 'India',
    pharmacopoeiaStandard: 'USP / IP',
    shelfLife: '24 Months',
    storageCondition: 'Store in a cool, dry place below 25°C. Protect from sunlight.',
    moq: '500 Bottles',
    unit: 'Bottle',
    badge: 'Heart Health & Energy Booster',
    regulatoryStatus: 'Cardio-Metabolic Formulation',
    indication: 'Myocardial support, heart health optimization, post-cardiac convalescence, statin-induced myopathy, chronic fatigue, metabolic asthenia, lipid antioxidant protection.',
    clinicalHighlights: [
      'Co-Enzyme Q10 (Ubidecarenone): Central electron shuttle in mitochondrial oxidative phosphorylation, powering continuous cardiac ATP synthesis.',
      'L-Carnitine (500 mg): Translocates long-chain fatty acids into mitochondria for beta-oxidation, preserving cardiac and skeletal muscle contractile efficiency.',
      'Vitamins B2 & B6: Coenzymes for cellular Krebs cycle enzymes and homocysteine clearance.',
      'Vitamins C & E Network: Lipid- and water-soluble antioxidant synergy protecting LDL particles and vascular endothelium from peroxidative damage.'
    ],
    features: [
      'Pleasant Orange Flavour & 100% Sugar-Free',
      'Large 225 ml pack size for uninterrupted therapeutic cycles',
      'Liquid suspension ensures rapid, reliable absorption'
    ],
    imageUrl: './images/products/myo-q10-syrup.jpg'
  },
  {
    id: 'life-kr-softgel',
    name: 'Life-KR Softgel Capsules',
    brandName: 'Life-KR Softgel',
    genericName: 'Omega-3 Fatty Acids (EPA 550 mg & DHA 350 mg) Softgel Capsules',
    category: 'Omega-3 Range',
    therapeuticSegment: 'Omega-3 Range',
    genericComposition: 'Total Omega-3 Fatty Acids 1300 mg providing Eicosapentaenoic Acid (EPA) 550 mg & Docosahexaenoic Acid (DHA) 350 mg Softgel Capsules',
    activeMolecules: [
      'Total Omega-3 Fatty Acids 1300 mg',
      'Eicosapentaenoic Acid (EPA) 550 mg',
      'Docosahexaenoic Acid (DHA) 350 mg'
    ],
    dosageForm: 'Softgel Capsules',
    form: 'Capsule',
    packaging: '30 Softgel Capsules in Bottle with Outer Monocarton',
    packagingSize: '30 Softgel Capsules',
    packSize: '30 Capsules',
    countryOfOrigin: 'India',
    pharmacopoeiaStandard: 'Nutraceutical / IP',
    shelfLife: '24 Months',
    storageCondition: 'Store in a cool, dry & dark place below 25°C. Protect from direct heat.',
    moq: '500 Packs',
    unit: 'Pack',
    badge: 'Triple Strength Omega-3',
    regulatoryStatus: 'Cardiovascular & Cognitive Care',
    indication: 'Cardiovascular wellness, hypertriglyceridemia, cognitive enhancement & memory retention, dry eye syndrome & macular support, joint inflammatory relief.',
    clinicalHighlights: [
      'High EPA Potency (550 mg): Regulates inflammatory eicosanoids (prostaglandins and leukotrienes), assisting in arterial flexibility and triglyceride reduction.',
      'High DHA Potency (350 mg): Concentrated structural lipid for cerebral synaptic membranes and ocular retinal photoreceptors.',
      'Ultra-purified marine oil molecularly distilled to ensure absence of heavy metals, mercury, and environmental toxins.',
      'Enteric-friendly softgel shell eliminating fishy regurgitation.'
    ],
    features: [
      '1300 mg Total Omega-3 with therapeutic EPA/DHA ratio',
      '30 Golden Softgel Capsules per pack',
      'Certified molecularly distilled purity'
    ],
    imageUrl: './images/products/life-kr-softgel.jpg'
  },
  {
    id: 'life-kr-syrup',
    name: 'Life-KR Syrup (150 ml)',
    brandName: 'Life-KR Syrup',
    genericName: 'Omega-3 Fatty Acid, EPA & DHA Advance Formula Syrup',
    category: 'Omega-3 Range',
    therapeuticSegment: 'Omega-3 Range',
    genericComposition: 'Total Omega-3 Fatty Acids 590 mg providing Eicosapentaenoic Acid (EPA) 250 mg & Docosahexaenoic Acid (DHA) 185 mg per 5 ml Syrup',
    activeMolecules: [
      'Total Omega-3 Fatty Acids 590 mg',
      'Eicosapentaenoic Acid (EPA) 250 mg',
      'Docosahexaenoic Acid (DHA) 185 mg'
    ],
    dosageForm: 'Syrup',
    form: 'Liquid',
    packaging: '150 ml Bottle in Rigid Protective Monocarton',
    packagingSize: '150 ml Syrup',
    packSize: '150 ml',
    countryOfOrigin: 'India',
    pharmacopoeiaStandard: 'Nutraceutical',
    shelfLife: '24 Months',
    storageCondition: 'Store below 25°C in a cool & dark place. Shake well before use.',
    moq: '500 Bottles',
    unit: 'Bottle',
    badge: 'Liquid Omega-3 Advance Formula',
    regulatoryStatus: 'Nutritional Brain & Heart Support',
    indication: 'Cognitive growth, visual acuity, heart health, easy nutrition for pediatric and elderly patients who face difficulty swallowing capsules.',
    clinicalHighlights: [
      'Micro-emulsified liquid Omega-3 delivering high elemental EPA (250 mg) and DHA (185 mg) per single teaspoon serving (5 ml).',
      'Superior absorption dynamics through micronized emulsion technology.',
      'Pleasant taste and smooth texture eliminating fishy odour and aftertaste.',
      'Ideal for children, adolescent learners, and geriatric populations.'
    ],
    features: [
      'Advance Liquid Formula with high patient palatability',
      'Complete nutritional support for Eye, Brain & Heart',
      'Easy dosing with graduated measuring cap'
    ],
    imageUrl: './images/products/life-kr-syrup.jpg'
  },
  {
    id: 'life-kr-drops',
    name: 'Life-KR Drops',
    brandName: 'Life-KR Drops',
    genericName: 'Omega-3 Fatty Acid, EPA & DHA Pediatric Drops',
    category: 'Omega-3 Range',
    therapeuticSegment: 'Pediatrics & Neurology',
    genericComposition: 'Omega-3 Fatty Acid 200 mg providing EPA (Eicosapentaenoic Acid) 50 mg & DHA (Docosahexaenoic Acid) 100 mg per ml Drops',
    activeMolecules: [
      'Omega-3 Fatty Acid 200 mg',
      'EPA (Eicosapentaenoic Acid) 50 mg',
      'DHA (Docosahexaenoic Acid) 100 mg'
    ],
    dosageForm: 'Drops',
    form: 'Liquid',
    packaging: '30 ml Amber Glass Bottle with Calibrated Dropper in Rigid Monocarton',
    packagingSize: '30 ml Dropper Bottle',
    packSize: '30 ml',
    countryOfOrigin: 'India',
    pharmacopoeiaStandard: 'Nutraceutical',
    shelfLife: '24 Months',
    storageCondition: 'Store in a cool & dark place below 25°C. Protect from direct heat.',
    moq: '500 Packs',
    unit: 'Pack',
    badge: 'Essential Pediatric Neuro-Support',
    regulatoryStatus: 'Pediatric Formula',
    indication: 'Infant neurodevelopment, milestone cognitive attainment, retinal photoreceptor maturation, childhood learning and focus, immunity.',
    clinicalHighlights: [
      'Optimal 2:1 DHA to EPA ratio custom-tailored for early infant and toddler brain expansion.',
      'Supplied with calibrated dropper ensuring precise drops per physician guidance.',
      'Gentle on developing gastrointestinal tracts with zero digestive discomfort.',
      'Encourages optic nerve myelinization and healthy visual tracking.'
    ],
    features: [
      'Precision calibrated dropper included',
      'Specially designed for growing infants & toddlers',
      'Essential building block for child neurogenesis'
    ],
    imageUrl: './images/products/life-kr-drops.jpg'
  },
  {
    id: 'glutavia-250',
    name: 'Glutavia-250 Tablets',
    brandName: 'Glutavia-250',
    genericName: 'L-Glutathione 250 mg & Vitamin C 40 mg Film Coated Tablets',
    category: 'Skin Brightening',
    therapeuticSegment: 'Skin Brightening',
    genericComposition: 'L-Glutathione 250 mg & Vitamin C (Ascorbic Acid) 40 mg Film Coated Tablets',
    activeMolecules: [
      'L-Glutathione (Reduced) 250 mg',
      'Vitamin C (Ascorbic Acid) 40 mg'
    ],
    dosageForm: 'Tablets',
    form: 'Tablets',
    packaging: '30 Film Coated Tablets in Bottle with Outer Monocarton',
    packagingSize: '30 Tablets',
    packSize: '30 Tablets',
    countryOfOrigin: 'India',
    pharmacopoeiaStandard: 'Nutraceutical / In-House',
    shelfLife: '24 Months',
    storageCondition: 'Store in a dry place at or below 25°C. Protect from moisture and light.',
    moq: '500 Packs',
    unit: 'Pack',
    badge: 'Introductory Skin Radiance',
    regulatoryStatus: 'Dermatological Antioxidant',
    indication: 'Dull & tired skin, mild facial hyperpigmentation, uneven skin tone, fine lines & early signs of aging, dehydrated epidermis, cellular detox.',
    clinicalHighlights: [
      'L-Glutathione: The body’s master tripeptide antioxidant (cysteine, glutamate, glycine), clinically proven to inhibit tyrosinase activity and shift melanogenesis towards lighter pheomelanin.',
      'Vitamin C Synergy: Maintains glutathione in its biologically active reduced state while stimulating fibroblast collagen biosynthesis.',
      'Accelerates cellular detoxification of environmental heavy metals and xenobiotic metabolites in hepatic tissue.',
      'Improves dermal elasticity and enhances skin hydration.'
    ],
    features: [
      '30 Film Coated Tablets per pack',
      'Introductory strength for radiant, luminous skin',
      'Dual antioxidant action for cellular anti-aging'
    ],
    imageUrl: './images/products/glutavia-250.jpg'
  },
  {
    id: 'glutavia-500',
    name: 'Glutavia-500 Tablets',
    brandName: 'Glutavia-500',
    genericName: 'L-Glutathione 500 mg & Vitamin C 80 mg Film Coated Tablets',
    category: 'Skin Brightening',
    therapeuticSegment: 'Skin Brightening',
    genericComposition: 'L-Glutathione 500 mg & Vitamin C (Ascorbic Acid) 80 mg Film Coated Tablets',
    activeMolecules: [
      'L-Glutathione (Reduced) 500 mg',
      'Vitamin C (Ascorbic Acid) 80 mg'
    ],
    dosageForm: 'Tablets',
    form: 'Tablets',
    packaging: '30 Film Coated Tablets in Bottle with Outer Monocarton',
    packagingSize: '30 Tablets',
    packSize: '30 Tablets',
    countryOfOrigin: 'India',
    pharmacopoeiaStandard: 'Nutraceutical / In-House',
    shelfLife: '24 Months',
    storageCondition: 'Store in a dry place at or below 25°C. Protect from moisture and light.',
    moq: '500 Packs',
    unit: 'Pack',
    badge: 'Intensive Skin Brightening Double Strength',
    regulatoryStatus: 'Advanced Dermatological Care',
    indication: 'Persistent hyperpigmentation, melasma, post-inflammatory dark spots, pronounced fine lines, deep cutaneous oxidative damage, liver health support.',
    clinicalHighlights: [
      'Double Strength 500 mg L-Glutathione delivers rapid dermatological skin tone lightening and deep dermal regeneration.',
      'High-dose Vitamin C (80 mg) amplifies intracellular glutathione recycling and provides sustained radical trapping.',
      'Promotes hepatic phase II sulfoconjugation, purging environmental toxins and reversing cutaneous photo-damage.',
      'Significantly minimizes pore appearance and refines dermal texture.'
    ],
    features: [
      'High-potency 500 mg therapeutic dose',
      'Targeted for persistent melasma & dark patches',
      'Pharmaceutical grade high-purity ingredients'
    ],
    imageUrl: './images/products/glutavia-500.jpg'
  },
  {
    id: 'zymocare-syrup',
    name: 'Zymocare Syrup',
    brandName: 'Zymocare',
    genericName: 'Alpha Amylase and Pepsin Syrup (Proteolytic & Digestive Enzyme)',
    category: 'Digestive Wellness',
    therapeuticSegment: 'Digestive Wellness',
    genericComposition: 'Alpha Amylase (Fungal Diastase 1:800 from Aspergillus oryzae) 100 mg & Pepsin (1:3000) 50 mg per 5 ml Syrup',
    activeMolecules: [
      'Alpha Amylase (Fungal Diastase 1:800) 100 mg',
      'Pepsin (1:3000) 50 mg'
    ],
    dosageForm: 'Syrup',
    form: 'Liquid',
    packaging: '200 ml Amber PET Bottle in Rigid Outer Monocarton',
    packagingSize: '200 ml Bottle',
    packSize: '200 ml',
    countryOfOrigin: 'India',
    pharmacopoeiaStandard: 'IP',
    shelfLife: '24 Months',
    storageCondition: 'Store in a cool, dry place below 25°C. Do not freeze.',
    moq: '500 Bottles',
    unit: 'Bottle',
    badge: 'Sugar Free Proteolytic Enzyme',
    regulatoryStatus: 'Gastroenterological Enzyme Formula',
    indication: 'Indigestion, dyspepsia, loss of appetite, postprandial fullness, flatulence, digestive discomfort, nutrient malabsorption.',
    clinicalHighlights: [
      'Fungal Diastase (Alpha Amylase): Cleaves internal alpha-1,4-glycosidic bonds in complex dietary carbohydrates and starches into dextrins and maltose.',
      'Pepsin (Proteolytic Enzyme): Primary gastric enzyme degrading complex dietary proteins into smaller absorbable peptides and amino acids.',
      'Relieves feelings of heaviness and postprandial distension within minutes.',
      'Completely Sugar Free formulation with pleasant Pineapple flavour.'
    ],
    features: [
      '100% Sugar-Free formulation',
      'Refreshing Pineapple Flavour',
      'Dual-action starch & protein digestive breakdown'
    ],
    imageUrl: './images/products/zymocare-syrup.jpg'
  },
  {
    id: 'esomax-d40',
    name: 'Esomax D40 Capsules',
    brandName: 'Esomax D40',
    genericName: 'Esomeprazole Magnesium (ER) & Domperidone (SR) Capsules',
    category: 'Digestive Wellness',
    therapeuticSegment: 'Digestive Wellness',
    genericComposition: 'Each hard gelatin capsule contains Esomeprazole Magnesium Trihydrate IP eq. to Esomeprazole 40 mg (Enteric Coated Pellets) & Domperidone IP 30 mg (Sustained Release Pellets)',
    activeMolecules: [
      'Esomeprazole Magnesium Trihydrate IP (EC Pellets) 40 mg',
      'Domperidone IP (SR Pellets) 30 mg'
    ],
    dosageForm: 'Capsules',
    form: 'Capsule',
    packaging: '10 x 15 Capsules in Premium Alu-Alu Blister Strip Pack',
    packagingSize: '10 x 15 Capsules',
    packSize: '150 Capsules',
    countryOfOrigin: 'India',
    pharmacopoeiaStandard: 'IP',
    shelfLife: '24 Months',
    storageCondition: 'Store protected from light and moisture below 25°C.',
    moq: '500 Strips',
    unit: 'Strip',
    badge: 'Dual PPI & Prokinetic Acid Control',
    regulatoryStatus: 'Schedule Prescription Medicine',
    indication: 'Gastroesophageal Reflux Disease (GERD), erosive esophagitis, peptic & duodenal ulcers, Zollinger-Ellison syndrome, NSAID-induced gastritis, nausea and delayed gastric emptying.',
    clinicalHighlights: [
      'Enteric-Coated Esomeprazole (40 mg): Potent S-isomer proton pump inhibitor that irreversibly blocks H+/K+-ATPase in gastric parietal cells, providing durable 24-hour acid suppression.',
      'Sustained-Release Domperidone (30 mg): Peripheral dopamine D2 receptor antagonist promoting upper gastrointestinal motility and preventing nausea and bile reflux.',
      'Alu-Alu tropical barrier packaging shields hygroscopic active pellets from environmental degradation.'
    ],
    features: [
      '10 x 15 Alu-Alu Blister packaging',
      'Dual pellet release technology (Enteric + Sustained)',
      'Prompt daytime and nocturnal acid control'
    ],
    imageUrl: './images/products/esomax-d40.jpg'
  },
  {
    id: 'borifemina-tablets',
    name: 'Borifemina Vaginal Tabs',
    brandName: 'Borifemina',
    genericName: 'Aloe Vera, Boric Acid & Tea Tree Oil Vaginal Tablets',
    category: "Women's & Specialized Wellness",
    therapeuticSegment: "Women's & Specialized Wellness",
    genericComposition: 'Each Vaginal Tablet contains Aloe Vera Extract 50 mg, Boric Acid 600 mg, Tea Tree Oil 5 mg',
    activeMolecules: [
      'Aloe Vera Extract 50 mg',
      'Boric Acid 600 mg',
      'Tea Tree Oil 5 mg'
    ],
    dosageForm: 'Vaginal Tablets',
    form: 'Tablets',
    packaging: '14 Tablets in Blister Pack with Applicator in Outer Monocarton',
    packagingSize: '14 Tablets',
    packSize: '14 Tablets',
    countryOfOrigin: 'India',
    pharmacopoeiaStandard: 'In-House / IP',
    shelfLife: '24 Months',
    storageCondition: 'Store in a cool, dry place away from children. For vaginal use only.',
    moq: '500 Packs',
    unit: 'Pack',
    badge: 'Intimate Flora & pH Balance',
    regulatoryStatus: 'Specialized Gynecological Formulation',
    indication: 'Intimate hygiene, maintenance of acidic vaginal pH, recurrent bacterial vaginosis, vulvovaginal candidiasis biofilm disruption, vaginal discomfort and odor.',
    clinicalHighlights: [
      'Boric Acid (600 mg): Clinically recommended mild acid that restores physiological acidic vaginal pH (3.8 - 4.5) and breaks down recalcitrant fungal and bacterial biofilms.',
      'Tea Tree Oil (5 mg): Natural antifungal and antibacterial active that curbs Candida species proliferation and alleviates itching.',
      'Aloe Vera Extract (50 mg): Hydrating and cooling botanical that soothes minor vulvovaginal irritation, burning, and tissue dryness.',
      'Complete 14-tablet regimen with hygienic applicator.'
    ],
    features: [
      '14 Tablets complete course with applicator',
      'Tri-action: pH restoration + antifungal + soothing hydration',
      'Specialized intimate care for women\'s wellness'
    ],
    imageUrl: './images/products/borifemina-tablets.jpg'
  },
  {
    id: 'lifekr-raft-suspension',
    name: 'Lifekr-Raft Oral Suspension',
    brandName: 'Lifekr-Raft',
    genericName: 'Sodium Alginate, Sodium Bicarbonate & Calcium Carbonate Oral Suspension',
    category: 'Digestive Wellness',
    therapeuticSegment: 'Digestive Wellness',
    genericComposition: 'Each 5 ml contains Sodium Alginate 250 mg, Sodium Bicarbonate 133.5 mg & Calcium Carbonate 80 mg Oral Suspension',
    activeMolecules: [
      'Sodium Alginate 250 mg',
      'Sodium Bicarbonate 133.5 mg',
      'Calcium Carbonate 80 mg'
    ],
    dosageForm: 'Oral Suspension',
    form: 'Liquid',
    packaging: '200 ml Bottle with Measuring Cup in Rigid Monocarton',
    packagingSize: '200 ml Suspension',
    packSize: '200 ml',
    countryOfOrigin: 'India',
    pharmacopoeiaStandard: 'IP',
    shelfLife: '24 Months',
    storageCondition: 'Store below 25°C. Do not freeze. Shake well before use.',
    moq: '500 Bottles',
    unit: 'Bottle',
    badge: 'Fast Acting Anti-Reflux Raft',
    regulatoryStatus: 'Gastroenterological Raft Technology',
    indication: 'Gastroesophageal Reflux Disease (GERD), acute heartburn, pregnancy-associated acid reflux, regurgitation, postprandial burning sensations.',
    clinicalHighlights: [
      'Alginate Raft Technology: Contact with gastric acid triggers immediate formation of a buoyant, cohesive alginate gel raft that sits on top of stomach contents, mechanically blocking acid splashback into the esophagus within seconds.',
      'Neutralizing Antacids: Sodium Bicarbonate and Calcium Carbonate neutralize excess hydrochloric acid while generating CO2 bubbles that float the protective raft.',
      'Safe for pregnant and breastfeeding women under physician advice.',
      'Pleasant Sugar-Free Mint Flavour.'
    ],
    features: [
      'Relief in just few seconds with durable barrier action',
      'Safe even for pregnant & breast feeding women',
      'Mint flavour with Sugar Free formulation'
    ],
    imageUrl: './images/products/lifekr-raft-suspension.jpg'
  },
  {
    id: 'ran-life-solution',
    name: 'Ran-Life Oral Solution',
    brandName: 'Ran-Life',
    genericName: 'Ranitidine Oral Solution IP 75 mg / 5 ml',
    category: 'Digestive Wellness',
    therapeuticSegment: 'Digestive Wellness',
    genericComposition: 'Each 5 ml contains Ranitidine Hydrochloride IP eq. to Ranitidine 75 mg in Flavoured Syrupy Base Oral Solution IP',
    activeMolecules: [
      'Ranitidine Hydrochloride IP eq. to Ranitidine 75 mg per 5 ml'
    ],
    dosageForm: 'Oral Solution',
    form: 'Liquid',
    packaging: '100 ml Bottle in Rigid Outer Monocarton',
    packagingSize: '100 ml Solution',
    packSize: '100 ml',
    countryOfOrigin: 'India',
    pharmacopoeiaStandard: 'IP',
    shelfLife: '24 Months',
    storageCondition: 'Store in a cool, dry and dark place below 25°C.',
    moq: '500 Bottles',
    unit: 'Bottle',
    badge: 'Fast-Acting H2 Acid Blocker',
    regulatoryStatus: 'Schedule Prescription Medicine',
    indication: 'Hyperacidity, gastric and duodenal ulcers, gastroesophageal reflux disease (GERD), heartburn and acid indigestion, stress-related mucosal protection.',
    clinicalHighlights: [
      'Competitive H2-Receptor Antagonist: Blocks histamine-mediated gastric acid secretion from parietal cells, reducing basal and nocturnal acid output.',
      'Liquid Oral Solution: Accelerates mucosal contact and systemic absorption, providing rapid onset of acid relief compared to solid dosage forms.',
      'Peppermint Flavour: Overcomes bitter taste and enhances palatability across adult and pediatric patients.',
      'Proven mucosal healing profile for both acute and recurring peptic lesions.'
    ],
    features: [
      '100 ml Liquid Oral Solution for rapid onset',
      'Pleasant Peppermint Flavour',
      'Binds and reduces excess stomach acid'
    ],
    imageUrl: './images/products/ran-life-solution.jpg'
  }
];
