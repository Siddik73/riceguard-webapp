import prisma from '../repositories/db';

export interface DiseaseProfile {
  slug: string;
  name: string;
  nameBn: string;
  scientificName: string;
  severity: string;
  description: string;
  descriptionBn: string;
  symptoms: string[];
  symptomsBn: string[];
  treatment: string[];
  treatmentBn: string[];
  prevention: string[];
  preventionBn: string[];
}

export class DiseaseLibraryService {
  private readonly defaultLibrary: DiseaseProfile[] = [
    {
      slug: "blast",
      name: "Rice Blast",
      nameBn: "ধান ব্লাস্ট",
      scientificName: "Magnaporthe oryzae",
      severity: "HIGH",
      description: "Rice blast is a fungal disease that can infect all above-ground parts of the rice plant, including leaves, collar, node, and neck. It is highly destructive.",
      descriptionBn: "ধান ব্লাস্ট একটি মারাত্মক ছত্রাকজনিত রোগ যা ধান গাছের পাতা, কলার, গিট এবং গলার ক্ষতি করে থাকে। সঠিক সময়ে দমন না করলে এটি ফসল সম্পূর্ণরূপে নষ্ট করতে পারে।",
      symptoms: [
        "Spindle-shaped brown lesions with grey or white centers on leaves",
        "Brown or black coloring on leaf collars and nodes",
        "Neck rot causing the panicle to fall over"
      ],
      symptomsBn: [
        "পাতায় চোখ বা মাকু আকৃতির বাদামী দাগ যার মাঝের অংশ ধূসর বা সাদা",
        "পাতার গোঁড়ায় ও গিটে কালো বা বাদামী রঙের ছোপ দাগ",
        "শীষের গোঁড়া কালো হয়ে পচে যায় এবং শীষ ভেঙে ঝুলে পড়ে"
      ],
      treatment: [
        "Apply Tricyclazole 75 WP at 0.6g/L of water immediately",
        "Use Nativo 75 WG or other systemic fungicides as prescribed by local officers",
        "Avoid applying excessive nitrogenous fertilizers until recovery"
      ],
      treatmentBn: [
        "তাৎক্ষণিকভাবে প্রতি লিটার পানিতে ০.৬ গ্রাম ট্রাইসাইক্লাজোল ৭৫ ডাব্লিউপি মিশিয়ে স্প্রে করুন",
        "কৃষি কর্মকর্তার পরামর্শ অনুযায়ী নেটিভো ৭৫ ডাব্লিউজি বা অন্য কোনো সিস্টেমিক ছত্রাকনাশক প্রয়োগ করুন",
        "আক্রান্ত গাছে সুস্থ না হওয়া পর্যন্ত ইউরিয়া সার প্রয়োগ বন্ধ রাখুন"
      ],
      prevention: [
        "Ensure wide planting spacing for optimal air ventilation",
        "Use disease-resistant rice varieties (e.g. BRRI varieties)",
        "Perform seed treatment with hot water or fungicides before sowing"
      ],
      preventionBn: [
        "পর্যাপ্ত আলো ও বাতাস চলাচলের জন্য চারা সঠিক দূরত্বে রোপণ করুন",
        "রোগ প্রতিরোধী জাতের বীজ বপন করুন (যেমন ব্রি হাইব্রিড জাতসমূহ)",
        "বপনের পূর্বে গরম পানি বা উপযুক্ত ছত্রাকনাশক দিয়ে বীজ শোধন করুন"
      ]
    },
    {
      slug: "blight",
      name: "Bacterial Leaf Blight",
      nameBn: "পাতা ব্লাইট",
      scientificName: "Xanthomonas oryzae pv. oryzae",
      severity: "HIGH",
      description: "Bacterial leaf blight causes stripes of yellowing on leaves starting from the margins, leading to dry, wilted plants known as 'kresek' in early stages.",
      descriptionBn: "ব্যাকটেরিয়াল লিফ ব্লাইট রোগের কারণে পাতার কিনারা থেকে হলুদ রঙের দাগ শুরু হয়ে পুরো পাতা শুকিয়ে খড়ের মতো হয়ে যায়। চারা অবস্থায় একে 'ক্রেসক' রোগ বলা হয়।",
      symptoms: [
        "Linear water-soaked stripes along leaf margins which turn yellow or white",
        "Wavy yellowing patterns along the leaf blades",
        "Bacterial droplets oozing from leaf pores in moist weather"
      ],
      symptomsBn: [
        "পাতার কিনারায় লম্বাটে পানির মতো ভেজা দাগ যা পরে হলুদ ও খড়ের মতো বর্ণ ধারণ করে",
        "পাতার ফলকে আঁকাবাঁকা ঢেউখেলানো হলদে ছোপ",
        "আর্দ্র আবহাওয়ায় পাতার ছিদ্র দিয়ে ব্যাকটেরিয়াজাত হলদে পুঁজের দানা বের হওয়া"
      ],
      treatment: [
        "Spray potash fertilizer (MOP) to boost crop immunity",
        "Apply copper oxychloride (e.g. Cupravit) mixed with streptocycline",
        "Maintain clean water drainage to prevent bacteria spreading"
      ],
      treatmentBn: [
        "গাছের রোগ প্রতিরোধ ক্ষমতা বাড়াতে পটাশ সার (এমওপি) উপরিপ্রয়োগ করুন",
        "কপার অক্সিক্লোরাইড (যেমন কুপ্রাভিট) এর সাথে স্ট্রেপ্টোসাইক্লিন মিশিয়ে স্প্রে করুন",
        "রোগের বিস্তার রোধ করতে জমি থেকে অতিরিক্ত পানি নিষ্কাশনের ব্যবস্থা করুন"
      ],
      prevention: [
        "Do not clip leaf seedlings before transplanting",
        "Maintain balanced fertilizer levels and avoid nitrogen overloading",
        "Ensure dry periods between crop rotations"
      ],
      preventionBn: [
        "চারা রোপণের সময় পাতার ডগা কাটা এড়িয়ে চলুন",
        "সুষম সার প্রয়োগ করুন এবং অতিরিক্ত ইউরিয়া সার ব্যবহার পরিহার করুন",
        "দুই মৌসুমের মাঝে জমি ভালোভাবে শুকিয়ে চাষ দিন"
      ]
    },
    {
      slug: "tungro",
      name: "Rice Tungro",
      nameBn: "রাইস টুংরো",
      scientificName: "RTBV and RTSV virus complex",
      severity: "MEDIUM",
      description: "Rice Tungro is a viral disease transmitted by the green leafhopper (GLH). It results in severe stunting and yellow-orange discoloration of leaves.",
      descriptionBn: "রাইস টুংরো একটি ভাইরাসজনিত রোগ যা সবুজ পাতাফড়িং (Green Leafhopper) দ্বারা ছড়ায়। এটি ধান গাছের বৃদ্ধি মারাত্মকভাবে ব্যাহত করে এবং পাতায় হলদে-কমলা রঙের ছোপ তৈরি করে।",
      symptoms: [
        "Severe stunting of the rice plant growth",
        "Discoloration of leaves starting from tips to orange-yellow shades",
        "Fewer tillers and incomplete panicle emergence"
      ],
      symptomsBn: [
        "ধান গাছের বৃদ্ধি মারাত্মকভাবে থমকে যাওয়া বা খর্বাকৃতি হওয়া",
        "পাতার ডগা থেকে শুরু করে পুরো পাতা হলদে-কমলা রঙ ধারণ করা",
        "কুশির সংখ্যা কমে যাওয়া এবং শীষ আংশিক বা অসম্পূর্ণভাবে বের হওয়া"
      ],
      treatment: [
        "Apply systemic insecticides to control green leafhopper vector population",
        "Uproot and destroy infected plants immediately to limit spread",
        "Spray neem seed kernel extract as an organic vector repellant"
      ],
      treatmentBn: [
        "সবুজ পাতাফড়িং দমনে সিস্টেমিক কীটনাশক (যেমন ইমিডাক্লোপ্রিড) প্রয়োগ করুন",
        "রোগের ছড়ানো কমাতে আক্রান্ত গাছ জমি থেকে উপড়ে ফেলে পুড়িয়ে ফেলুন",
        "জৈব উপায়ে পোকা তাড়াতে নিম বীজের নির্যাস স্প্রে করুন"
      ],
      prevention: [
        "Synchronize planting schedules with neighboring fields to break cycle",
        "Destroy weed hosts on field boundaries where green leafhoppers breed",
        "Grow leafhopper resistant varieties"
      ],
      preventionBn: [
        "ফড়িংয়ের জীবনচক্র ভাঙতে আশেপাশের সব জমিতে একই সময়ে চারা রোপণ করুন",
        "আইলের চারপাশের আগাছা পরিষ্কার রাখুন যেখানে পাতাফড়িং বংশবৃদ্ধি করে",
        "পাতাফড়িং প্রতিরোধী জাত চাষ করুন"
      ]
    },
    {
      slug: "brownspot",
      name: "Brown Spot",
      nameBn: "বাদামী দাগ",
      scientificName: "Bipolaris oryzae",
      severity: "LOW",
      description: "Brown spot is a fungal disease commonly associated with nutrient-deficient or water-stressed soil, causing small, round brown spots on leaves and grains.",
      descriptionBn: "বাদামী দাগ একটি ছত্রাকজনিত রোগ যা সাধারণত পুষ্টিহীনতা বা জমিতে পানির অভাব হলে দেখা যায়। এর ফলে ধানের পাতা ও দানায় ছোট ও গোল বাদামী দাগ পড়ে।",
      symptoms: [
        "Small, oval or circular dark brown lesions on leaf surfaces",
        "Spots have light yellow halos surrounding the dark centers",
        "Discolored and chalky rice grains leading to lower yield"
      ],
      symptomsBn: [
        "পাতার উপরিভাগে ছোট, ডিম্বাকৃতি বা গোলাকার গাঢ় বাদামী দাগ",
        "দাগগুলোর চারপাশে হালকা হলুদ রঙের একটি বলয় বা আভা থাকে",
        "ধানের চাল বিবর্ণ, খসখসে ও অপুষ্ট হয়ে যায় যা ফলন কমিয়ে দেয়"
      ],
      treatment: [
        "Apply balanced nitrogen, potash, and zinc nutrition to soil",
        "Spray copper fungicides or Mancozeb if spots cover >10% leaf area",
        "Provide regular irrigation to reduce plant stress"
      ],
      treatmentBn: [
        "জমিতে সুষম ইউরিয়া, পটাশ ও দস্তা সার নিয়মিত প্রয়োগ করুন",
        "দাগ ১০% পাতার বেশি অংশ জুড়ে ছড়ালে ম্যানকোজেব বা কপার ছত্রাকনাশক স্প্রে করুন",
        "গাছের ধকল কমাতে নিয়মিত সেচ প্রদান নিশ্চিত করুন"
      ],
      prevention: [
        "Seed treatment with hot water before planting",
        "Maintain soil health through organic compost application",
        "Ensure good soil drainage and structure"
      ],
      preventionBn: [
        "রোপণের পূর্বে বীজ গরম পানি দিয়ে ভালোমতো শোধন করুন",
        "জৈব সার ব্যবহারের মাধ্যমে মাটির উর্বরতা ও স্বাস্থ্য বজায় রাখুন",
        "জমির নিষ্কাশন ব্যবস্থা ও মাটি ঝুরঝুরে রাখার দিকে নজর দিন"
      ]
    },
    {
      slug: "sheathblight",
      name: "Sheath Blight",
      nameBn: "শীথ ব্লাইট",
      scientificName: "Rhizoctonia solani",
      severity: "HIGH",
      description: "Sheath blight causes large irregular spots on the leaf sheath near the water level, which progress up to upper leaves and can lead to lodging.",
      descriptionBn: "শীথ ব্লাইট খোল পচা রোগের অন্যতম কারণ। এটি পানির স্তরের কাছাকাছি গাছের খোলে বড় ও অনিয়মিত দাগ তৈরি করে যা পাতার দিকে ছড়িয়ে পড়ে এবং গাছ ধসিয়ে দিতে পারে।",
      symptoms: [
        "Large, grey-white spots with dark purple or brown borders on leaf sheaths",
        "Snake-skin like appearance on lower parts of the stem",
        "Premature leaf drying and lodging of stems"
      ],
      symptomsBn: [
        "গাছের গোঁড়ার খোলে অনিয়মিত ধূসর-সাদা দাগ যার সীমানা বেগুনি বা বাদামী",
        "কাণ্ডের নিচের অংশে সাপের খোলসের মতো নকশা বা ছোপ তৈরি হওয়া",
        "পাতার অগ্রভাগ অকালে শুকিয়ে যাওয়া এবং ধান গাছ মাটিতে ঢলে পড়া"
      ],
      treatment: [
        "Apply Hexaconazole (e.g. Contaf) or Propiconazole immediately",
        "Drain the field completely for 3-5 days to stop fungal growth",
        "Remove weed hosts that share the sheath blight fungus"
      ],
      treatmentBn: [
        "তাড়াতাড়ি হেক্সাকোনাজল (যেমন কনটাফ) বা প্রোপিকোনাজল স্প্রে করুন",
        "ছত্রাকের বৃদ্ধি থামাতে ৩-৫ দিনের জন্য জমির পানি নিষ্কাশন করে শুকনো রাখুন",
        "জমির আশেপাশে থাকা আগাছা পরিষ্কার করুন যা ছত্রাকের আশ্রয়স্থল"
      ],
      prevention: [
        "Avoid close planting to decrease humidity near the plant base",
        "Do not reuse stubble from infected harvests; burn or plow it in deeply",
        "Apply balanced nitrogen and potassium fertilizers"
      ],
      preventionBn: [
        "গোঁড়ার দিকে আর্দ্রতা কমাতে ঘন করে চারা রোপণ করা এড়িয়ে চলুন",
        "আক্রান্ত জমির খড় বা নাড়া পুনরায় ব্যবহার না করে মাটির নিচে পুতে ফেলুন",
        "সুষম পরিমাণে ইউরিয়া ও পটাশ সার ব্যবহার করুন"
      ]
    },
    {
      slug: "falsesmut",
      name: "False Smut",
      nameBn: "ফলস স্মার্ট",
      scientificName: "Ustilaginoidea virens",
      severity: "MEDIUM",
      description: "False smut infects the grains during panicle emergence, replacing them with powdery green or orange balls of fungal spore masses.",
      descriptionBn: "ফলস স্মার্ট রোগ ধানের শিষ বের হওয়ার সময় শিষের দানা আক্রান্ত করে। এটি ধানের দানাকে মখমলের মতো সবুজ বা কমলা রঙের গোলাকার ছত্রাক বল দিয়ে প্রতিস্থাপন করে।",
      symptoms: [
        "Grains are replaced by small, round, chalky orange masses which turn dark olive-green",
        "Velvety spore balls covering the rice grains",
        "Reduction in seed germination and mill quality"
      ],
      symptomsBn: [
        "ধানের চাল মখমলের মতো গোলাকার হলদে-কমলা পিণ্ডে পরিণত হয় যা পরে জলপাই-সবুজ হয়ে যায়",
        "ধানের শিষের উপর মখমলের মতো গুটি বা বলের স্তর তৈরি হওয়া",
        "বীজের অঙ্কুরোদগম ক্ষমতা এবং চালের কলের গুণমান হ্রাস পাওয়া"
      ],
      treatment: [
        "Spray Copper Hydroxide or Propiconazole during booting stage",
        "Uproot and bury the smut balls in soil to prevent spores spreading",
        "Ensure immediate solarization of seeds"
      ],
      treatmentBn: [
        "ধানের কড় বের হওয়ার ঠিক আগে কপার হাইড্রোক্সাইড বা প্রোপিকোনাজল স্প্রে করুন",
        "আক্রান্ত গুটিগুলো সতর্কতার সাথে জমি থেকে তুলে মাটির নিচে চাপা দিন",
        "বীজ সংরক্ষণের পূর্বে তাড়া রোদে ভালোমতো শুকিয়ে নিন"
      ],
      prevention: [
        "Use certified clean seeds free from smut balls",
        "Adopt late planting strategies in disease-prone areas",
        "Maintain crop rotation with non-host crops like legumes"
      ],
      preventionBn: [
        "সংগ্রহকৃত ভালো জাতের রোগমুক্ত প্রত্যয়িত বীজ ব্যবহার করুন",
        "রোগ প্রবণ এলাকায় কিছুটা দেরিতে বীজ বপন করার পরিকল্পনা করুন",
        "ডালজাতীয় ফসলের সাথে শস্য আবর্তন বা জমি বদল করে চাষ করুন"
      ]
    },
    {
      slug: "healthy",
      name: "Healthy Crop",
      nameBn: "সুস্থ ফসল",
      scientificName: "Oryza sativa",
      severity: "LOW",
      description: "A healthy rice plant with bright green leaves, balanced tillering, and fully developed grains free of significant pest or disease damage.",
      descriptionBn: "একটি সুস্থ ও সতেজ ধান গাছ যার পাতাগুলো উজ্জ্বল সবুজ, কুশির সংখ্যা সুষম এবং শিষের দানাগুলো রোগ বা পোকা-মাকড়ের আক্রমণ ছাড়া সুন্দরভাবে পুষ্ট হয়েছে।",
      symptoms: [
        "Vibrant uniform green color across all leaves",
        "Clear veins without spots, yellow striping, or wilt",
        "Sturdy upright stems and healthy tillers"
      ],
      symptomsBn: [
        "সবগুলো পাতায় অভিন্ন ও প্রাণবন্ত সতেজ সবুজ রঙ",
        "কোনো দাগ, হলুদ রেখা বা শুকিয়ে যাওয়া ছাড়া পরিষ্কার শিরা-উপশিরা",
        "শক্ত খাড়া কাণ্ড এবং মজবুত গোঁড়া"
      ],
      treatment: [
        "No treatment required. Maintain standard irrigation and weeding",
        "Keep checking the leaves twice a week to spot early changes"
      ],
      treatmentBn: [
        "কোনো চিকিৎসার প্রয়োজন নেই। নিয়মিত সেচ ও আগাছা পরিষ্কারের ধারা অব্যাহত রাখুন",
        "রোগের আক্রমণ প্রাথমিক অবস্থায় ধরতে সপ্তাহে অন্তত দুইবার পাতা পরীক্ষা করুন"
      ],
      prevention: [
        "Continue balanced NPK fertilizer usage",
        "Practice biological pest control and crop monitoring"
      ],
      preventionBn: [
        "সুষম মাত্রায় এনপিকে (নাইট্রোজেন, ফসফরাস ও পটাশ) সার ব্যবহার করুন",
        "জৈবিক পদ্ধতিতে বালাইনাশক ও ফসল নিয়মিত পর্যবেক্ষণ করুন"
      ]
    }
  ];

  public async seedLibraryIfEmpty(): Promise<void> {
    const count = await prisma.diseaseLibrary.count();
    if (count > 0) return;

    console.log('Seeding Disease Library data...');
    for (const item of this.defaultLibrary) {
      await prisma.diseaseLibrary.create({
        data: {
          slug: item.slug,
          name: item.name,
          nameBn: item.nameBn,
          scientificName: item.scientificName,
          severity: item.severity,
          description: item.description,
          descriptionBn: item.descriptionBn,
          symptoms: item.symptoms.join(';;'),
          symptomsBn: item.symptomsBn.join(';;'),
          treatment: item.treatment.join(';;'),
          treatmentBn: item.treatmentBn.join(';;'),
          prevention: item.prevention.join(';;'),
          preventionBn: item.preventionBn.join(';;')
        }
      });
    }
    console.log('Disease Library seeded successfully.');
  }

  public async getLibrary(): Promise<DiseaseProfile[]> {
    await this.seedLibraryIfEmpty();
    const dbItems = await prisma.diseaseLibrary.findMany();
    return dbItems.map((item) => ({
      slug: item.slug,
      name: item.name,
      nameBn: item.nameBn,
      scientificName: item.scientificName,
      severity: item.severity,
      description: item.description,
      descriptionBn: item.descriptionBn,
      symptoms: item.symptoms.split(';;'),
      symptomsBn: item.symptomsBn.split(';;'),
      treatment: item.treatment.split(';;'),
      treatmentBn: item.treatmentBn.split(';;'),
      prevention: item.prevention.split(';;'),
      preventionBn: item.preventionBn.split(';;')
    }));
  }

  public async getDiseaseBySlug(slug: string): Promise<DiseaseProfile | null> {
    await this.seedLibraryIfEmpty();
    const item = await prisma.diseaseLibrary.findUnique({
      where: { slug }
    });
    if (!item) return null;
    return {
      slug: item.slug,
      name: item.name,
      nameBn: item.nameBn,
      scientificName: item.scientificName,
      severity: item.severity,
      description: item.description,
      descriptionBn: item.descriptionBn,
      symptoms: item.symptoms.split(';;'),
      symptomsBn: item.symptomsBn.split(';;'),
      treatment: item.treatment.split(';;'),
      treatmentBn: item.treatmentBn.split(';;'),
      prevention: item.prevention.split(';;'),
      preventionBn: item.preventionBn.split(';;')
    };
  }
}
export default DiseaseLibraryService;
