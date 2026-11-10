import {
  Student,
  AdmissionApplication,
  Course,
  Facility,
  FeeVoucher,
  FeeStructure,
  FeePaymentEntry,
  AttendanceRecord,
  StudentAttendanceEntry,
  ExamGrade,
  Notice,
  InstituteSettings,
  BloodGroup,
  StaffMember,
  LeadershipMember,
  PromotionalMediaItem,
  AdvertisementPlan,
} from '../types';
import { getSupabaseClient } from './supabase';

const STORAGE_KEYS = {
  STUDENTS: 'jsa_students_v1',
  ADMISSIONS: 'jsa_admissions_v1',
  STAFF: 'jsa_staff_v1',
  COURSES: 'jsa_courses_v2',
  FACILITIES: 'jsa_facilities_v2',
  FEES: 'jsa_fees_v1',
  FEE_STRUCTURES: 'jsa_fee_structures_v1',
  ATTENDANCE: 'jsa_attendance_v1',
  EXAM_GRADES: 'jsa_exam_grades_v1',
  NOTICES: 'jsa_notices_v1',
  SETTINGS: 'jsa_settings_v1',
  PROMOTIONAL_MEDIA: 'jsa_media_v1',
  ADVERTISEMENT_PLANS: 'jsa_ad_plans_v1',
};

export const INITIAL_SETTINGS: InstituteSettings = {
  instituteName: 'Jamia Salahuddin Ayubi',
  arabicName: 'جامعة صلاح الدين الأيوبي',
  directorName: 'Muneeb ur Rehman',
  directorTitle: 'Founder & Director General',
  establishedYear: '2018',
  contactEmail: 'info@jamiasalahuddin.edu.pk',
  contactPhone: '+92 300 1234567',
  address: 'Salahuddin Ayubi Avenue, Academic Complex, Education City',
  customLogoUrl: null,
  supabaseConfig: {
    url: '',
    anonKey: '',
    isConnected: false,
  },
};

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-hifz',
    code: 'HQ-100',
    title: 'Hifz-ul-Quran',
    arabicTitle: 'تحفيظ القرآن الكريم',
    category: 'Hifz-ul-Quran',
    department: 'Shu\'ba Hifz-ul-Quran',
    instructor: 'Qari Muhammad Bilal (Hafiz & Qari)',
    creditHours: 30,
    yearLevel: 'Full-Time Stages',
    description: 'A sacred memorization program dedicated to committing the complete Holy Quran to heart with sound Tajweed, daily revision cycles (Sabaq, Sabqi, Manzil), and moral mentorship.',
    objectives: [
      'Complete memorization of all 30 Juz of the Holy Quran',
      'Flawless pronunciation and articulation of Arabic letters (Makharij)',
      'Structured daily Manzil revision maintaining permanent retention',
      'Cultivating Islamic character, sincerity, and spiritual etiquette (Adab)',
    ],
    eligibility: 'Configurable by Management (Basic Nazra proficiency assessment; minimum age 7)',
    duration: 'Configurable by Management (Typically 2 to 3 years full-time pace)',
    fees: 'Configurable by Management (100% full scholarships for deserving students & orphans)',
    certification: 'Configurable by Management (Official Jamia Hifz-ul-Quran Sanad with chained Isnad)',
    admissionInfo: 'Admissions open throughout the year. Oral Nazra assessment and guardian interview conducted before final enrollment under Director Muneeb ur Rehman.',
    books: ['The Holy Quran (13/16 lines)', 'Tuhfat al-Atfal', 'Muqaddimah al-Jazariyyah'],
    isConfiguredByManagement: true,
    lastUpdated: '2026-03-01',
  },
  {
    id: 'course-nazra',
    code: 'NQ-100',
    title: 'Nazra Quran',
    arabicTitle: 'ناظرة القرآن الكريم',
    category: 'Nazra Quran',
    department: 'Quranic Sciences',
    instructor: 'Qari Sanaullah Madani',
    creditHours: 15,
    yearLevel: 'Foundational',
    description: 'Foundational fluent reading of the Holy Quran with correct Arabic letter pronunciation, vowel recognition, and basic rules of recitation for beginners.',
    objectives: [
      'Recognize Arabic orthography and Quranic script fluently',
      'Correct phonetic pronunciation of all 29 Arabic consonants',
      'Master basic stopping signs (Waqf) and vowel lengthening (Madd)',
      'Memorize essential daily Masnoon Duas and Kalimahs',
    ],
    eligibility: 'Configurable by Management (Open for young beginners and foundational adult learners)',
    duration: 'Configurable by Management (Typically 6 to 12 months modular)',
    fees: 'Configurable by Management (Subsidized maktab fee with full fee exemptions)',
    certification: 'Configurable by Management (Nazra Quran Completion Certificate)',
    admissionInfo: 'Continuous enrollment. Requires applicant B-Form / CNIC and parent contact details.',
    books: ['Noorani Qaida', 'Para Amma (Juz 30)', 'Daily Masnoon Prayers Manual'],
    isConfiguredByManagement: true,
    lastUpdated: '2026-03-01',
  },
  {
    id: 'course-tajweed',
    code: 'TQ-200',
    title: 'Tajweed-ul-Quran',
    arabicTitle: 'تجويد القرآن الكريم',
    category: 'Tajweed-ul-Quran',
    department: 'Department of Qira\'at & Phonetics',
    instructor: 'Sheikh-ul-Qurra Maulana Abdul Qayyum',
    creditHours: 20,
    yearLevel: 'Advanced Certificate',
    description: 'Systematic study of the science of Tajweed, addressing characteristics of letters (Sifat), points of articulation (Makharij), and melodic classical recitation.',
    objectives: [
      'Theoretical mastery of Tajweed rules and classical treatises',
      'Practical application of Ahkam al-Nun al-Sakinah, Mim, and Mudood',
      'Elimination of hidden (Khafiyy) and clear (Jaliyy) recitation errors',
      'Preparation for Qira\'at-e-Saba specialization',
    ],
    eligibility: 'Configurable by Management (Prior Nazra Quran reading fluency)',
    duration: 'Configurable by Management (Typically 1 Year certificate program)',
    fees: 'Configurable by Management (Tuition waivers granted upon merit assessment)',
    certification: 'Configurable by Management (Shahadat-ut-Tajweed Certificate)',
    admissionInfo: 'Admissions open at the beginning of each Islamic academic session. Practical recitation screening required.',
    books: ['Al-Jazariyyah Text & Commentary', 'Fawaid-e-Makkiyyah', 'Ahkam at-Tajweed'],
    isConfiguredByManagement: true,
    lastUpdated: '2026-03-01',
  },
  {
    id: 'course-shariyat',
    code: 'SC-300',
    title: 'Shariyat Course',
    arabicTitle: 'دورة أحكام الشريعة الإسلامية',
    category: 'Shariyat Course',
    department: 'Islamic Jurisprudence & Practical Law',
    instructor: 'Mufti Muhammad Farooq',
    creditHours: 22,
    yearLevel: 'Diploma Level',
    description: 'Comprehensive practical education in Islamic jurisprudence covering Taharah (purification), Salah, Fasting, Zakat, Hajj, Islamic transactions, and everyday modern halal living.',
    objectives: [
      'Deep understanding of core Fard \'Ayn duties required of every Muslim',
      'Practical guidance on everyday commercial transactions and modern halal ethics',
      'Resolving family jurisprudence (Nikah, Talaq, inheritance rights) questions',
      'Cultivating sound moral discernment in contemporary environments',
    ],
    eligibility: 'Configurable by Management (Open to secondary school graduates, university students, and adults)',
    duration: 'Configurable by Management (Modular 1 to 2 Year diploma)',
    fees: 'Configurable by Management (Endowment subsidized; no student turned away)',
    certification: 'Configurable by Management (Diploma in Islamic Shariyat & Practical Fiqh)',
    admissionInfo: 'Weekend and evening schedules available. Submit online admission application or contact the registrar desk.',
    books: ['Nur al-Idah', 'Mukhtasar al-Quduri', 'Al-Fiqh al-Muyassar', 'Jadid Fiqhi Masail'],
    isConfiguredByManagement: true,
    lastUpdated: '2026-03-01',
  },
  {
    id: 'course-darse-nizami',
    code: 'DN-800',
    title: 'Dars-e-Nizami',
    arabicTitle: 'الدرس النظامي - الشهادة العالمية',
    category: 'Dars-e-Nizami',
    department: 'Faculty of Classical Islamic Sciences',
    instructor: 'Sheikh-ul-Hadith Maulana Noor-ul-Haq & Senior Asatiza',
    creditHours: 32,
    yearLevel: '8-Year Complete Program (Al-Ula to Al-Alimiyyah)',
    description: 'The prestigious traditional 8-year Fazil degree curriculum producing certified scholars (\'Ulama). Encompasses advanced Arabic grammar, rhetoric, logic, Usul al-Fiqh, and exhaustive Hadith study.',
    objectives: [
      'Fluency in classical Arabic texts, syntax (Nahw), and morphology (Sarf)',
      'Advanced competency in legal deduction and Usul al-Fiqh',
      'Complete study and Isnad transmission of the Six Canonical Hadith Books (Sihah Sitta)',
      'Rigorous scholarly character formation and leadership training',
    ],
    eligibility: 'Configurable by Management (Middle/Matriculation pass or equivalent madrasa entrance test)',
    duration: 'Configurable by Management (Traditional 8 Years from Al-Ula to Dourat-ul-Hadith)',
    fees: 'Configurable by Management (100% Free Tuition with complete boarding & lodging facilities)',
    certification: 'Configurable by Management (Shahadat-ul-Alimiyyah / Master of Arts in Islamic Studies equivalent)',
    admissionInfo: 'Annual admission intake in Shawwal. Written Arabic/Urdu test and interview with Academic Board headed by Director Muneeb ur Rehman.',
    books: ['Hidayat-un-Nahw', 'Kafiyah', 'Al-Hidayah', 'Usul al-Shashi', 'Sharh Aqaid', 'Mishkat al-Masabih', 'Sahih al-Bukhari'],
    isConfiguredByManagement: true,
    lastUpdated: '2026-03-01',
  },
  {
    id: 'course-islamic-studies',
    code: 'IS-400',
    title: 'Islamic Studies',
    arabicTitle: 'الدراسات الإسلامية المعاصرة',
    category: 'Islamic Studies',
    department: 'Department of Theology & Islamic Thought',
    instructor: 'Maulana Hafiz Tariq Mehmood',
    creditHours: 24,
    yearLevel: 'Bachelor / Higher Diploma',
    description: 'An intellectually vibrant program exploring Islamic civilization, Seerah of the Prophet ﷺ, classical Islamic creed (Aqidah), comparative religions, and contemporary intellectual thought.',
    objectives: [
      'In-depth understanding of the Prophetic biography (Seerah) and early Caliphate',
      'Rigorous grounding in Sunni orthodox creed (Aqidah Tahawiyyah and Maturidi)',
      'Addressing modern philosophical challenges, atheism, and secular ideologies',
      'Developing analytical academic writing and public speaking skills',
    ],
    eligibility: 'Configurable by Management (Intermediate / F.A / F.Sc or equivalent)',
    duration: 'Configurable by Management (2 to 4 Years degree pathway)',
    fees: 'Configurable by Management (Subsidized institutional fee with merit concessions)',
    certification: 'Configurable by Management (Degree in Islamic Studies & Contemporary Thought)',
    admissionInfo: 'Online application followed by academic portfolio review and admissions interview.',
    books: ['Al-Aqidah at-Tahawiyyah', 'Ar-Raheeq Al-Makhtum', 'Tarikh al-Khulafa', 'Bidayat al-Mujtahid'],
    isConfiguredByManagement: true,
    lastUpdated: '2026-03-01',
  },
  {
    id: 'course-arabic-language',
    code: 'AL-200',
    title: 'Arabic Language',
    arabicTitle: 'اللغة العربية وآدابها',
    category: 'Arabic Language',
    department: 'Faculty of Arabic Linguistics & Literature',
    instructor: 'Ustad Bilal Al-Azhari',
    creditHours: 20,
    yearLevel: 'Certificate / Diploma',
    description: 'Comprehensive linguistic immersion in classical and modern standard Arabic (Fusha), combining speaking fluency, grammatical precision, literary appreciation, and translation techniques.',
    objectives: [
      'Fluent conversational and written Arabic communication in modern and classical contexts',
      'Mastery of foundational syntax (Nahw) and morphological patterns (Sarf)',
      'Appreciation of classical Arabic poetry, Balaghah (rhetoric), and Quranic eloquence',
      'Practical Arabic-to-English/Urdu translation of scholarly literature',
    ],
    eligibility: 'Configurable by Management (Open for all students seeking Arabic proficiency)',
    duration: 'Configurable by Management (1 to 2 Years intensive diploma)',
    fees: 'Configurable by Management (Configurable scholarship quota for madrasa students)',
    certification: 'Configurable by Management (Diploma in Classical & Modern Arabic Language)',
    admissionInfo: 'Direct entry via language placement test. Available for both morning and evening cohorts.',
    books: ['Al-Arabiyyah Baina Yadaik', 'Durus al-Lughah al-Arabiyyah', 'Al-Balaghah al-Wadihah', 'Maqamat al-Hariri'],
    isConfiguredByManagement: true,
    lastUpdated: '2026-03-01',
  },
  {
    id: 'course-tafseer',
    code: 'QT-500',
    title: 'Quran Translation and Tafseer',
    arabicTitle: 'ترجمة القرآن الكريم وتفسيره',
    category: 'Quran Translation and Tafseer',
    department: 'Department of Quranic Exegesis',
    instructor: 'Director Muneeb ur Rehman & Senior Mufassireen',
    creditHours: 26,
    yearLevel: 'Specialized Program',
    description: 'Verse-by-verse translation, contextual linguistic breakdown, Asbab al-Nuzul (reasons for revelation), and classical theological commentary on the Holy Quran.',
    objectives: [
      'Complete word-for-word and fluent translation of the Holy Quran',
      'Deep understanding of legal, moral, and spiritual guidance within each Surah',
      'Comparative analysis of premier classical commentaries (Tafseer Ibn Kathir, Jalalayn, Qurtubi)',
      'Connecting Quranic guidance directly to modern ethical and societal challenges',
    ],
    eligibility: 'Configurable by Management (Basic knowledge of Urdu and Arabic letters)',
    duration: 'Configurable by Management (Typically 1 to 2 Years comprehensive course)',
    fees: 'Configurable by Management (Endowment fund supported; open to all seekers)',
    certification: 'Configurable by Management (Sanad in Quranic Translation & Exegesis)',
    admissionInfo: 'Registration open for public, university students, and madrasa scholars. Apply via online portal.',
    books: ['Tafseer Ibn Kathir', 'Tafseer al-Jalalayn', 'Ma\'ariful Quran', 'Mufradat Alfaz al-Quran (Raghib)'],
    isConfiguredByManagement: true,
    lastUpdated: '2026-03-01',
  },
];

export const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'fac-quran-env',
    name: 'Quran learning environment',
    arabicName: 'بيئة تعليم القرآن الكريم',
    category: 'Spiritual & Memorization',
    description: 'A purpose-built serene sanctuary designed specifically for the sacred recitation and memorization of the Holy Quran. Features handcrafted wooden study Rehals arranged in classical Halaqah circles on soft emerald green prayer carpets, flooded with warm natural light through high Islamic archways.',
    detailedSpecs: [
      'Classical circular Halaqah configuration under direct Asatiza oversight',
      'Acoustically dampened natural soundproofing for peaceful recitation',
      'Personal handcrafted wooden study Rehals for each enrolled student',
      'Dedicated manzil revision corners and memorization alcoves',
    ],
    imageUrl: '/src/assets/images/facility_quran_environment_1793985364020.jpg',
    isVerifiedByManagement: true,
    verifiedBy: 'Muneeb ur Rehman (Founder & Director General)',
    verificationDate: 'March 2026',
    capacity: '200+ Hifz & Nazra Students',
    location: 'Central Academic Wing, Ground Floor',
    equipment: ['Handcrafted wooden Rehals', 'Acoustic treatment', 'Filtered cool water stations', 'Surah index boards'],
    status: 'operational',
  },
  {
    id: 'fac-classrooms',
    name: 'Classrooms',
    arabicName: 'قاعات التدريس والمحاضرات',
    category: 'Academic Instructional',
    description: 'Bright, climate-cooled lecture halls engineered for scholarly lectures, Fiqh discussions, and linguistic workshops. Equipped with modern presentation boards, wide natural daylight windows, and ergonomic dual desks.',
    detailedSpecs: [
      'Climate-controlled air-conditioning and ventilation systems',
      'Non-glare ceramic writing whiteboards and digital display monitors',
      'Spacious student seating with wide aisles for focused attention',
      'High-speed audio amplification system for guest scholarly lectures',
    ],
    imageUrl: '/src/assets/images/facility_classrooms_1793985367194.jpg',
    isVerifiedByManagement: true,
    verifiedBy: 'Muneeb ur Rehman (Founder & Director General)',
    verificationDate: 'March 2026',
    capacity: '12 Major Lecture Halls (40-60 seats each)',
    location: 'Al-Farabi & Salahuddin Academic Blocks',
    equipment: ['Magnetic whiteboards', 'Climate cooling units', 'Audio lecture mic system', 'Digital podiums'],
    status: 'operational',
  },
  {
    id: 'fac-library',
    name: 'Library',
    arabicName: 'المكتبة المركزية والبحث العلمي',
    category: 'Research & Scholarly Reference',
    description: 'Grand Maktaba housing over 25,000 physical classical manuscripts, comprehensive encyclopedias of Hadith, comparative Fiqh, and Arabic lexicography. Accompanied by silent research carrels and Maktaba Shamila digital search stations.',
    detailedSpecs: [
      '25,000+ Classical and modern Islamic volumes across 18 disciplines',
      'Dedicated rare manuscript preservation and digital scanning archive',
      'Maktaba Shamila research terminals with global open access catalogs',
      'Quiet individualized study carrels equipped with brass reading lamps',
    ],
    imageUrl: '/src/assets/images/facility_library_maktaba_1793985364590.jpg',
    isVerifiedByManagement: true,
    verifiedBy: 'Muneeb ur Rehman (Founder & Director General)',
    verificationDate: 'March 2026',
    capacity: '150 Seated Researchers',
    location: 'Library Annex, 2nd Floor',
    equipment: ['Maktaba Shamila workstations', 'Manuscript storage cases', 'High-speed fiber internet', 'Book binding station'],
    status: 'operational',
  },
  {
    id: 'fac-prayer',
    name: 'Prayer facilities',
    arabicName: 'جامع ومصلى المعهد المركزي',
    category: 'Worship & Congregational Life',
    description: 'Dignified, high-ceiling central Masjid and prayer hall with an ornate Islamic Mihrab, geometric emerald carpets, and arched stained-glass windows. Serves as the spiritual heart of the campus where 5 daily prayers and Friday congregations are held.',
    detailedSpecs: [
      'Grand central congregational prayer hall hosting all students and Asatiza',
      'Authentic Islamic architectural design with hand-painted calligraphic inscriptions',
      'High-definition acoustic sound distribution for Khutbah and Azan',
      'Continuous 24/7 access for Tahajjud, Nafila, and individual contemplation',
    ],
    imageUrl: '/src/assets/images/facility_prayer_hall_1793985365140.jpg',
    isVerifiedByManagement: true,
    verifiedBy: 'Muneeb ur Rehman (Founder & Director General)',
    verificationDate: 'March 2026',
    capacity: '1,200 Musalleen',
    location: 'Central Campus Quadrangle',
    equipment: ['Acoustic sound system', 'Ornate wooden Minbar', 'High-capacity cooling towers', 'Azan broadcast array'],
    status: 'operational',
  },
  {
    id: 'fac-wudu',
    name: 'Wudu facilities',
    arabicName: 'ميضأة رخامية وصحية متكاملة',
    category: 'Hygiene & Ablution',
    description: 'Pristine, marble-tiled ablution pavilions featuring continuous running water, comfortable ergonomic seated steps, polished chrome fixtures, and non-slip textured stone flooring complying with Sunnah hygiene guidelines.',
    detailedSpecs: [
      'Pure filtered running water with winter heating systems',
      'Ergonomic marble ablution benches allowing comfortable seated Wudu',
      'High-drainage anti-slip floor channels preventing water stagnation',
      'Dedicated shoe storage racks and clean towel drying dispensers',
    ],
    imageUrl: '/src/assets/images/facility_wudu_area_1793985385090.jpg',
    isVerifiedByManagement: true,
    verifiedBy: 'Muneeb ur Rehman (Founder & Director General)',
    verificationDate: 'March 2026',
    capacity: '80 Simultaneous Ablution Taps',
    location: 'Masjid North & South Courtyard Entrances',
    equipment: ['Solar water heaters', 'Continuous filter pump', 'Chrome lever taps', 'Anti-slip stone paving'],
    status: 'operational',
  },
  {
    id: 'fac-accommodation',
    name: 'Student accommodation',
    arabicName: 'سكن الطلاب الداخلي (الهوستل)',
    category: 'Residential Boarding',
    description: 'Orderly, clean residential dormitories providing boarder students with a supportive home away from home. Includes single wooden beds with clean linens, secure personal lockers, study nooks, and 24/7 resident scholar mentoring.',
    detailedSpecs: [
      'Well-ventilated dormitories with generous natural lighting and climate control',
      'Personal locked wardrobe, wooden bed, mattress, and study corner for every resident',
      'Round-the-clock safety supervision and attendance monitoring by resident Asatiza',
      'On-call medical first-aid room and emergency care protocols',
    ],
    imageUrl: '/src/assets/images/facility_student_accommodation_1793985386540.jpg',
    isVerifiedByManagement: true,
    verifiedBy: 'Muneeb ur Rehman (Founder & Director General)',
    verificationDate: 'March 2026',
    capacity: '350 Boarder Students',
    location: 'Residential Wing, Blocks A & B',
    equipment: ['Wooden single beds', 'Personal steel lockers', 'Ceiling fans & climate heaters', 'First aid kits'],
    status: 'operational',
  },
  {
    id: 'fac-dining',
    name: 'Dining facilities',
    arabicName: 'المطعم المركزي والمطبخ الصحي',
    category: 'Catering & Nutrition',
    description: 'Spacious, hygienic central dining mess hall serving three wholesome, freshly prepared Halal meals daily. Prepared under strict hygiene standards using fresh ingredients, fostering brotherhood across communal dining tables.',
    detailedSpecs: [
      'Three balanced daily meals (Breakfast, Lunch, Dinner) designed for student health',
      'Commercial stainless-steel kitchen with certified food preparation protocols',
      'Polished wooden dining tables accommodating simultaneous meal sessions',
      'Pure RO-purified chilled drinking water dispensers',
    ],
    imageUrl: '/src/assets/images/facility_dining_hall_1793985385151.jpg',
    isVerifiedByManagement: true,
    verifiedBy: 'Muneeb ur Rehman (Founder & Director General)',
    verificationDate: 'March 2026',
    capacity: '400 Students per Seating',
    location: 'Ground Floor, Services Building',
    equipment: ['Commercial industrial ovens', 'Stainless steel cookware', 'RO water filtration plant', 'Dish sanitizers'],
    status: 'operational',
  },
  {
    id: 'fac-study',
    name: 'Study environment',
    arabicName: 'بيئة المذاكرة والتكرار الهادئة',
    category: 'Academic Review & Takrar',
    description: 'Dedicated quiet study halls and Takrar (mutual peer review) study halls. Designed specifically for after-Isha and pre-Fajr collaborative revision of Dars-e-Nizami lessons under soft, warm study lighting.',
    detailedSpecs: [
      'Silent individual revision pods for concentrated memorization and text analysis',
      'Designated collaborative Takrar halls where student pairs debate legal texts',
      'Warm reading task lamps and acoustic carpet flooring preventing distractions',
      'Resident Asatiza available during study hours for academic clarification',
    ],
    imageUrl: '/src/assets/images/facility_study_environment_1793985386925.jpg',
    isVerifiedByManagement: true,
    verifiedBy: 'Muneeb ur Rehman (Founder & Director General)',
    verificationDate: 'March 2026',
    capacity: '250 Concurrent Students',
    location: 'East Wing Academic Level 1',
    equipment: ['Task reading lamps', 'Low study desks (Rehal style)', 'Standard study tables', 'Reference dictionaries'],
    status: 'operational',
  },
  {
    id: 'fac-resources',
    name: 'Educational resources',
    arabicName: 'المصادر التعليمية والوسائط الرقمية',
    category: 'Digital & Research Media',
    description: 'Modern digital educational laboratory combining computing terminals, bilingual research software, audio stations for Qirat self-recording and analysis, and high-speed scholarly manuscript databases.',
    detailedSpecs: [
      'Modern PC workstations pre-installed with Maktaba Shamila & Arabic lexicon software',
      'Audio monitoring headsets for Tajweed phonetic recording and error analysis',
      'High-speed scholarly internet with filtered Islamic academic access',
      'Multilingual Arabic/Urdu publishing, transcription, and translation tools',
    ],
    imageUrl: '/src/assets/images/facility_educational_resources_1793985404118.jpg',
    isVerifiedByManagement: true,
    verifiedBy: 'Muneeb ur Rehman (Founder & Director General)',
    verificationDate: 'March 2026',
    capacity: '45 Computer & Audio Workstations',
    location: 'IT & Digital Research Pavilion, 1st Floor',
    equipment: ['All-in-one workstations', 'Studio monitor headphones', 'Arabic mechanical keyboards', 'Laser printing units'],
    status: 'operational',
  },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    rollNumber: 'JSA-2026-101',
    admissionNumber: 'ADM-2026-081',
    fullName: 'Muhammad Usman Khan',
    urduName: 'محمد عثمان خان',
    fatherName: 'Abdul Rasheed Khan',
    guardianPhone: '+92 301 5551234',
    cnicOrBForm: '37405-1234567-1',
    dob: '2005-04-12',
    gender: 'male',
    bloodGroup: 'B+',
    department: 'Dars-e-Nizami',
    currentYear: 'Year 4 (Al-Rabiah)',
    boardingStatus: 'boarder',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    address: 'Street 4, Sector G-9/1, Islamabad',
    admissionDate: '2023-09-01',
    status: 'active',
    emergencyContact: '+92 301 5551234 (Father)',
  },
  {
    id: 'std-2',
    rollNumber: 'JSA-2026-102',
    admissionNumber: 'ADM-2026-082',
    fullName: 'Hamza Farooq',
    urduName: 'حمزہ فاروق',
    fatherName: 'Muhammad Farooq Ahmed',
    guardianPhone: '+92 321 4448765',
    cnicOrBForm: '35202-9876543-3',
    dob: '2008-08-19',
    gender: 'male',
    bloodGroup: 'O+',
    department: 'Hifz-ul-Quran',
    currentYear: 'Stage 3 (20 Paras Completed)',
    boardingStatus: 'boarder',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    address: 'Near Jamia Masjid, Satellite Town, Rawalpindi',
    admissionDate: '2024-02-15',
    status: 'active',
    emergencyContact: '+92 321 4448765 (Brother)',
  },
  {
    id: 'std-3',
    rollNumber: 'JSA-2026-103',
    admissionNumber: 'ADM-2026-083',
    fullName: 'Zainab Bint Tariq',
    urduName: 'زینب بنت طارق',
    fatherName: 'Tariq Mehmood',
    guardianPhone: '+92 333 9991122',
    cnicOrBForm: '61101-7766554-4',
    dob: '2004-11-05',
    gender: 'female',
    bloodGroup: 'A+',
    department: 'Dars-e-Nizami (Bannat Wing)',
    currentYear: 'Year 2 (Al-Saniyah)',
    boardingStatus: 'day_scholar',
    photoUrl: '', // Modest Bannat Wing policy - no exposed personal portrait
    address: 'House 18, Street 12, F-11/2, Islamabad',
    admissionDate: '2024-09-01',
    status: 'active',
    emergencyContact: '+92 333 9991122 (Father)',
  },
  {
    id: 'std-4',
    rollNumber: 'JSA-2026-104',
    admissionNumber: 'ADM-2026-084',
    fullName: 'Abu Bakr Siddiqui',
    urduName: 'ابوبکر صدیقی',
    fatherName: 'Maulana Hafizullah',
    guardianPhone: '+92 345 7772233',
    cnicOrBForm: '17301-4433221-5',
    dob: '2003-01-25',
    gender: 'male',
    bloodGroup: 'AB+',
    department: 'Islamic Jurisprudence (Ifta)',
    currentYear: 'Takhassus Year 1',
    boardingStatus: 'boarder',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    address: 'Village & Post Office Shamshatoo, Peshawar',
    admissionDate: '2025-08-20',
    status: 'active',
    emergencyContact: '+92 345 7772233 (Father)',
  },
  {
    id: 'std-5',
    rollNumber: 'JSA-2026-105',
    admissionNumber: 'ADM-2026-085',
    fullName: 'Talha Bin Zubair',
    urduName: 'طلحہ بن زبیر',
    fatherName: 'Zubair Alvi',
    guardianPhone: '+92 312 8884455',
    cnicOrBForm: '37406-8877665-7',
    dob: '2006-06-30',
    gender: 'male',
    bloodGroup: 'O-',
    department: 'Modern Education & IT',
    currentYear: 'Diploma Year 1',
    boardingStatus: 'day_scholar',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    address: 'Chaklala Scheme III, Rawalpindi',
    admissionDate: '2025-09-10',
    status: 'active',
    emergencyContact: '+92 312 8884455 (Father)',
  },
];

export const INITIAL_ADMISSIONS: AdmissionApplication[] = [
  {
    id: 'app-1',
    applicationNumber: 'APP-2026-8401',
    applicantName: 'Saad Ur Rehman',
    urduName: 'سعد الرحمن',
    fatherName: 'Abdul Waheed',
    fatherCnic: '37405-5544332-1',
    applicantCnicOrBForm: '37405-9988776-3',
    dob: '2007-03-15',
    gender: 'male',
    phone: '+92 300 9988111',
    guardianPhone: '+92 300 9988111',
    email: 'saad.rehman@example.com',
    address: 'Madina Town, Faisalabad',
    city: 'Faisalabad',
    program: 'Dars-e-Nizami',
    boardingRequired: true,
    previousEducation: 'Matriculation (Science) - 88%',
    previousInstitute: 'Govt High School',
    hafiz: true,
    bloodGroup: 'B+',
    status: 'pending',
    submittedAt: '2026-03-01T10:30:00Z',
  },
  {
    id: 'app-2',
    applicationNumber: 'APP-2026-8402',
    applicantName: 'Ammar Yasir',
    urduName: 'عمار یاسر',
    fatherName: 'Yasir Nadeem',
    fatherCnic: '35201-1122334-5',
    applicantCnicOrBForm: '35201-5566778-9',
    dob: '2009-07-22',
    gender: 'male',
    phone: '+92 321 6655443',
    guardianPhone: '+92 321 6655443',
    email: 'ammar.yasir@example.com',
    address: 'Johar Town, Lahore',
    city: 'Lahore',
    program: 'Hifz-ul-Quran',
    boardingRequired: true,
    previousEducation: 'Middle School (Class 6)',
    hafiz: false,
    bloodGroup: 'A+',
    status: 'interview_scheduled',
    interviewDate: '2026-03-15T09:00:00Z',
    adminNotes: 'Candidate shows strong recitation potential. Scheduled for Nazra test.',
    submittedAt: '2026-02-28T14:15:00Z',
  },
  {
    id: 'app-3',
    applicationNumber: 'APP-2026-8403',
    applicantName: 'Fatima Zahra',
    urduName: 'فاطمہ زہراء',
    fatherName: 'Syed Munir Hussain',
    fatherCnic: '61101-3344556-7',
    applicantCnicOrBForm: '61101-9988112-2',
    dob: '2005-12-10',
    gender: 'female',
    phone: '+92 334 1122334',
    guardianPhone: '+92 334 1122334',
    email: 'fatima.zahra@example.com',
    address: 'G-13/4, Islamabad',
    city: 'Islamabad',
    program: 'Dars-e-Nizami (Bannat Wing)',
    boardingRequired: false,
    previousEducation: 'F.Sc Pre-Medical - 91%',
    previousInstitute: 'Islamabad Model College',
    hafiz: true,
    bloodGroup: 'O+',
    status: 'approved',
    assignedRollNumber: 'JSA-2026-106',
    adminNotes: 'Approved with 50% merit scholarship based on academic excellence and Hifz credential.',
    submittedAt: '2026-02-25T11:00:00Z',
  },
];

export const INITIAL_FEE_STRUCTURES: FeeStructure[] = [
  {
    id: 'fs-dn',
    courseId: 'course-darse-nizami',
    courseName: 'Dars-e-Nizami (Alimiyyah)',
    department: 'Classical Islamic Sciences',
    academicYear: '2026-2027',
    billingFrequency: 'monthly',
    tuitionFee: 3500,
    boardingFee: 6000,
    admissionFee: 2000,
    examFee: 500,
    otherDues: 500,
    isScholarshipApplicable: true,
    notes: 'Full tuition waivers automatically provided to Huffaz-ul-Quran and deserving students upon director review.',
  },
  {
    id: 'fs-hz',
    courseId: 'course-hifz',
    courseName: 'Hifz-ul-Quran with Tajweed',
    department: 'Quranic Sciences',
    academicYear: '2026-2027',
    billingFrequency: 'monthly',
    tuitionFee: 2500,
    boardingFee: 5000,
    admissionFee: 1500,
    examFee: 300,
    otherDues: 200,
    isScholarshipApplicable: true,
    notes: 'Subsidized community tuition supported by Jamia Salahuddin Ayubi Endowment Fund.',
  },
  {
    id: 'fs-nq',
    courseId: 'course-nazra',
    courseName: 'Nazra Quran Foundational',
    department: 'Quranic Sciences',
    academicYear: '2026-2027',
    billingFrequency: 'monthly',
    tuitionFee: 1500,
    boardingFee: 0,
    admissionFee: 1000,
    examFee: 200,
    otherDues: 0,
    isScholarshipApplicable: true,
    notes: 'Beginner foundation maktab curriculum. Day scholar program.',
  },
  {
    id: 'fs-tq',
    courseId: 'course-tajweed',
    courseName: 'Tajweed-ul-Quran Specialization',
    department: 'Qira\'at & Phonetics',
    academicYear: '2026-2027',
    billingFrequency: 'monthly',
    tuitionFee: 2000,
    boardingFee: 0,
    admissionFee: 1500,
    examFee: 500,
    otherDues: 0,
    isScholarshipApplicable: true,
    notes: 'Practical Makharij and Qiraat certificate syllabus.',
  },
  {
    id: 'fs-sc',
    courseId: 'course-shariyat',
    courseName: 'Shariyat Course (Modular)',
    department: 'Islamic Jurisprudence',
    academicYear: '2026-2027',
    billingFrequency: 'monthly',
    tuitionFee: 2500,
    boardingFee: 0,
    admissionFee: 1500,
    examFee: 500,
    otherDues: 0,
    isScholarshipApplicable: true,
    notes: 'Evening and weekend modular diplomas for university students & working professionals.',
  },
  {
    id: 'fs-ifta',
    courseId: 'course-ifta',
    courseName: 'Takhassus fi al-Ifta (Mufti Course)',
    department: 'Jurisprudence & Fatwa Research',
    academicYear: '2026-2027',
    billingFrequency: 'monthly',
    tuitionFee: 4000,
    boardingFee: 6000,
    admissionFee: 2500,
    examFee: 1000,
    otherDues: 500,
    isScholarshipApplicable: true,
    notes: '100% full merit research fellowship granted by Muneeb ur Rehman to qualifying graduates.',
  },
];

export const INITIAL_FEES: FeeVoucher[] = [
  {
    id: 'fee-1',
    voucherNumber: 'VCH-2026-0301',
    receiptNumber: 'RCP-2026-0801',
    studentId: 'std-1',
    studentName: 'Muhammad Usman Khan',
    rollNumber: 'JSA-2026-101',
    gender: 'male',
    department: 'Dars-e-Nizami',
    course: 'Dars-e-Nizami (Alimiyyah)',
    monthYear: 'March 2026',
    feeType: 'monthly',
    tuitionFee: 3500,
    boardingFee: 6000,
    examFee: 0,
    otherDues: 500,
    discount: 1000,
    totalAmount: 9000,
    amountPaid: 9000,
    remainingDues: 0,
    dueDate: '2026-03-10',
    status: 'paid',
    paidDate: '2026-03-04T12:00:00Z',
    paymentMethod: 'Bank Deposit (Meezan Bank)',
    collectedBy: 'Muneeb ur Rehman (Director)',
    remarks: 'Full settlement received via Meezan Bank deposit slip.',
    paymentHistory: [
      {
        id: 'pay-1',
        receiptNumber: 'RCP-2026-0801',
        amount: 9000,
        date: '2026-03-04',
        paymentMethod: 'Bank Deposit (Meezan Bank)',
        receivedBy: 'Muneeb ur Rehman (Director)',
        notes: 'Deposit slip verified by accounts branch',
      },
    ],
  },
  {
    id: 'fee-2',
    voucherNumber: 'VCH-2026-0302',
    receiptNumber: 'RCP-2026-0802',
    studentId: 'std-2',
    studentName: 'Hamza Farooq',
    rollNumber: 'JSA-2026-102',
    gender: 'male',
    department: 'Hifz-ul-Quran',
    course: 'Hifz-ul-Quran with Tajweed',
    monthYear: 'March 2026',
    feeType: 'monthly',
    tuitionFee: 2500,
    boardingFee: 5000,
    examFee: 0,
    otherDues: 500,
    discount: 1500,
    totalAmount: 6500,
    amountPaid: 3500,
    remainingDues: 3000,
    dueDate: '2026-03-10',
    status: 'partial',
    paidDate: '2026-03-05T10:30:00Z',
    paymentMethod: 'Cash',
    collectedBy: 'Accounts Cashier',
    remarks: '1st installment paid in cash. Remaining 3,000 promised before 15th.',
    paymentHistory: [
      {
        id: 'pay-2',
        receiptNumber: 'RCP-2026-0802',
        amount: 3500,
        date: '2026-03-05',
        paymentMethod: 'Cash',
        receivedBy: 'Accounts Cashier',
        notes: 'Installment 1 of 2 received at office counter',
      },
    ],
  },
  {
    id: 'fee-3',
    voucherNumber: 'VCH-2026-0303',
    receiptNumber: 'RCP-2026-0803',
    studentId: 'std-3',
    studentName: 'Zainab Bint Tariq',
    rollNumber: 'JSA-2026-103',
    gender: 'female',
    department: 'Dars-e-Nizami (Bannat Wing)',
    course: 'Dars-e-Nizami (Alimiyyah)',
    monthYear: 'March 2026',
    feeType: 'monthly',
    tuitionFee: 3500,
    boardingFee: 0,
    examFee: 500,
    otherDues: 0,
    discount: 500,
    totalAmount: 3500,
    amountPaid: 3500,
    remainingDues: 0,
    dueDate: '2026-03-10',
    status: 'paid',
    paidDate: '2026-03-02T16:20:00Z',
    paymentMethod: 'Bank Transfer',
    collectedBy: 'Muneeb ur Rehman (Director)',
    remarks: 'Online Raast transaction verified directly.',
    paymentHistory: [
      {
        id: 'pay-3',
        receiptNumber: 'RCP-2026-0803',
        amount: 3500,
        date: '2026-03-02',
        paymentMethod: 'Bank Transfer',
        receivedBy: 'Muneeb ur Rehman (Director)',
        notes: 'Raast reference #RAAST-9938291 verified',
      },
    ],
  },
  {
    id: 'fee-4',
    voucherNumber: 'VCH-2026-0304',
    receiptNumber: 'RCP-2026-0804',
    studentId: 'std-4',
    studentName: 'Abu Bakr Siddiqui',
    rollNumber: 'JSA-2026-104',
    gender: 'male',
    department: 'Islamic Jurisprudence (Ifta)',
    course: 'Takhassus fi al-Ifta (Mufti Course)',
    monthYear: 'March 2026',
    feeType: 'monthly',
    tuitionFee: 4000,
    boardingFee: 6000,
    examFee: 0,
    otherDues: 0,
    discount: 10000, // 100% scholarship for Takhassus researcher
    totalAmount: 0,
    amountPaid: 0,
    remainingDues: 0,
    dueDate: '2026-03-10',
    status: 'paid',
    paidDate: '2026-03-01T08:00:00Z',
    paymentMethod: 'Jamia Merit Endowment Fund',
    collectedBy: 'Muneeb ur Rehman (Director)',
    remarks: '100% full academic research endowment waiver by Director Muneeb ur Rehman.',
  },
  {
    id: 'fee-5',
    voucherNumber: 'VCH-2026-0305',
    studentId: 'std-5',
    studentName: 'Talha Bin Zubair',
    rollNumber: 'JSA-2026-105',
    gender: 'male',
    department: 'Modern Education & IT',
    course: 'Modern Education & IT',
    monthYear: 'March 2026',
    feeType: 'monthly',
    tuitionFee: 3000,
    boardingFee: 0,
    examFee: 500,
    otherDues: 0,
    discount: 0,
    totalAmount: 3500,
    amountPaid: 0,
    remainingDues: 3500,
    dueDate: '2026-03-10',
    status: 'unpaid',
    remarks: 'Pending payment notification sent to guardian.',
  },
];

export const INITIAL_NOTICES: Notice[] = [
  {
    id: 'not-1',
    title: 'Admissions Open for Academic Year 2026-2027',
    urduTitle: 'تعلیمی سال 2026-2027 کے داخلوں کا باقاعدہ آغاز',
    content: 'Under the supervision of Muneeb ur Rehman, admissions are now open for Dars-e-Nizami (Alimiyyah), Hifz-ul-Quran with Tajweed, and Takhassus fi al-Fiqh. Online registration can be completed directly through the portal. Limited hostel seats available.',
    category: 'Admissions',
    publishDate: '2026-03-01',
    author: 'Muneeb ur Rehman (Director)',
    isImportant: true,
  },
  {
    id: 'not-2',
    title: 'Annual Khatm-e-Bukhari & Dastar-e-Fazeelat Convocation',
    urduTitle: 'سالانہ ختم بخاری شریف اور دستار فضیلت تقریب',
    content: 'The grand graduation ceremony honoring this year\'s graduates of the Dourat-ul-Hadith and Huffaz-e-Karam will be held in the main Jamia Salahuddin Ayubi auditorium. Eminent Islamic scholars from across the country will attend.',
    category: 'Events',
    publishDate: '2026-02-28',
    author: 'Academic Council',
    isImportant: true,
  },
  {
    id: 'not-3',
    title: 'Issuance of Digital Smart ID Cards',
    urduTitle: 'طلبہ کے لیے نئے ڈیجیٹل اسمارٹ شناختی کارڈ کا اجراء',
    content: 'All registered students must collect or download their new official QR-verified digital student ID cards. Security staff and hostel wardens will require digital verification starting next week.',
    category: 'Administrative',
    publishDate: '2026-02-24',
    author: 'Administration Office',
    isImportant: false,
  },
  {
    id: 'not-4',
    title: 'Mid-Term Examinations Schedule Announced',
    urduTitle: 'شعبہ درس نظامی کے ششماہی امتحانات کا شیڈول',
    content: 'Examinations for all Dars-e-Nizami classes (Al-Ula through Al-Rabiah) will commence from the 20th of this month. Detailed date-sheets are posted on student notice boards.',
    category: 'Exams',
    publishDate: '2026-02-20',
    author: 'Examination Controller',
    isImportant: false,
  },
];

export const INITIAL_EXAM_GRADES: ExamGrade[] = [
  {
    id: 'grd-1',
    studentId: 'std-1',
    studentName: 'Muhammad Usman Khan',
    rollNumber: 'JSA-2026-101',
    examTerm: 'Mid-Term 2026',
    department: 'Dars-e-Nizami',
    subjects: [
      { subjectName: 'Hidayah (Fiqh)', totalMarks: 100, obtainedMarks: 94 },
      { subjectName: 'Usul al-Shashi', totalMarks: 100, obtainedMarks: 88 },
      { subjectName: 'Al-Aqidah at-Tahawiyyah', totalMarks: 100, obtainedMarks: 92 },
      { subjectName: 'Arabic Literature & Balaghah', totalMarks: 100, obtainedMarks: 90 },
      { subjectName: 'Modern Computer Applications', totalMarks: 100, obtainedMarks: 96 },
    ],
    totalMarks: 500,
    obtainedMarks: 460,
    percentage: 92,
    grade: 'A+',
    remarks: 'Outstanding performance (Mumtaz). Strong grasp of legal methodology and Arabic grammar.',
  },
  {
    id: 'grd-2',
    studentId: 'std-2',
    studentName: 'Hamza Farooq',
    rollNumber: 'JSA-2026-102',
    examTerm: 'Quarterly Test',
    department: 'Hifz-ul-Quran',
    subjects: [
      { subjectName: 'Sabaq (New Lesson Memorization)', totalMarks: 100, obtainedMarks: 95 },
      { subjectName: 'Sabqi (Recent Paras Revision)', totalMarks: 100, obtainedMarks: 90 },
      { subjectName: 'Manzil (Old Paras Revision)', totalMarks: 100, obtainedMarks: 88 },
      { subjectName: 'Tajweed & Makharij Articulation', totalMarks: 100, obtainedMarks: 92 },
    ],
    totalMarks: 400,
    obtainedMarks: 365,
    percentage: 91.25,
    grade: 'A+',
    remarks: 'Fluent recitation with excellent rhythm and flawless retention of revised Paras.',
  },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-2026-03-01',
    date: '2026-03-01',
    classId: 'Dars-e-Nizami',
    course: 'Dars-e-Nizami',
    genderCategory: 'all',
    sessionTime: 'morning',
    lastUpdated: '2026-03-01T08:30:00Z',
    updatedBy: 'Muneeb ur Rehman',
    records: [
      { studentId: 'std-1', rollNumber: 'JSA-2026-101', studentName: 'Muhammad Usman Khan', gender: 'male', course: 'Dars-e-Nizami', classSection: 'Boys Section A', status: 'present', timestamp: '2026-03-01T08:10:00Z', method: 'qr_scan', markedBy: 'Proctor Desk' },
      { studentId: 'std-2', rollNumber: 'JSA-2026-102', studentName: 'Hamza Farooq', gender: 'male', course: 'Hifz-ul-Quran', classSection: 'Tahfeez Section A', status: 'present', timestamp: '2026-03-01T08:12:00Z', method: 'qr_scan', markedBy: 'Proctor Desk' },
      { studentId: 'std-3', rollNumber: 'JSA-2026-103', studentName: 'Zainab Bint Tariq', gender: 'female', course: 'Dars-e-Nizami', classSection: 'Bannat Wing Section A', status: 'present', timestamp: '2026-03-01T08:15:00Z', method: 'manual', markedBy: 'Bannat Wing Supervisor' },
      { studentId: 'std-4', rollNumber: 'JSA-2026-104', studentName: 'Abu Bakr Siddiqui', gender: 'male', course: 'Islamic Jurisprudence (Ifta)', classSection: 'Takhassus Year 1', status: 'present', timestamp: '2026-03-01T08:20:00Z', method: 'qr_scan', markedBy: 'Proctor Desk' },
      { studentId: 'std-5', rollNumber: 'JSA-2026-105', studentName: 'Talha Bin Zubair', gender: 'male', course: 'Modern Education & IT', classSection: 'Diploma Year 1', status: 'present', timestamp: '2026-03-01T08:25:00Z', method: 'manual', markedBy: 'IT Department' },
    ],
  },
  {
    id: 'att-2026-03-02',
    date: '2026-03-02',
    classId: 'Dars-e-Nizami',
    course: 'Dars-e-Nizami',
    genderCategory: 'all',
    sessionTime: 'morning',
    lastUpdated: '2026-03-02T08:30:00Z',
    records: [
      { studentId: 'std-1', rollNumber: 'JSA-2026-101', studentName: 'Muhammad Usman Khan', gender: 'male', course: 'Dars-e-Nizami', status: 'present', timestamp: '2026-03-02T08:05:00Z', method: 'qr_scan' },
      { studentId: 'std-2', rollNumber: 'JSA-2026-102', studentName: 'Hamza Farooq', gender: 'male', course: 'Hifz-ul-Quran', status: 'present', timestamp: '2026-03-02T08:10:00Z', method: 'qr_scan' },
      { studentId: 'std-3', rollNumber: 'JSA-2026-103', studentName: 'Zainab Bint Tariq', gender: 'female', course: 'Dars-e-Nizami', status: 'present', timestamp: '2026-03-02T08:15:00Z', method: 'manual' },
      { studentId: 'std-4', rollNumber: 'JSA-2026-104', studentName: 'Abu Bakr Siddiqui', gender: 'male', course: 'Islamic Jurisprudence (Ifta)', status: 'leave', notes: 'Authorized library research leave', timestamp: '2026-03-02T08:20:00Z', method: 'manual' },
      { studentId: 'std-5', rollNumber: 'JSA-2026-105', studentName: 'Talha Bin Zubair', gender: 'male', course: 'Modern Education & IT', status: 'present', timestamp: '2026-03-02T08:22:00Z', method: 'manual' },
    ],
  },
  {
    id: 'att-2026-03-03',
    date: '2026-03-03',
    classId: 'Dars-e-Nizami',
    course: 'Dars-e-Nizami',
    genderCategory: 'all',
    sessionTime: 'morning',
    lastUpdated: '2026-03-03T08:30:00Z',
    records: [
      { studentId: 'std-1', rollNumber: 'JSA-2026-101', studentName: 'Muhammad Usman Khan', gender: 'male', course: 'Dars-e-Nizami', status: 'present', timestamp: '2026-03-03T08:08:00Z', method: 'qr_scan' },
      { studentId: 'std-2', rollNumber: 'JSA-2026-102', studentName: 'Hamza Farooq', gender: 'male', course: 'Hifz-ul-Quran', status: 'absent', timestamp: '2026-03-03T08:15:00Z', method: 'manual' },
      { studentId: 'std-3', rollNumber: 'JSA-2026-103', studentName: 'Zainab Bint Tariq', gender: 'female', course: 'Dars-e-Nizami', status: 'present', timestamp: '2026-03-03T08:12:00Z', method: 'manual' },
      { studentId: 'std-4', rollNumber: 'JSA-2026-104', studentName: 'Abu Bakr Siddiqui', gender: 'male', course: 'Islamic Jurisprudence (Ifta)', status: 'present', timestamp: '2026-03-03T08:18:00Z', method: 'qr_scan' },
      { studentId: 'std-5', rollNumber: 'JSA-2026-105', studentName: 'Talha Bin Zubair', gender: 'male', course: 'Modern Education & IT', status: 'present', timestamp: '2026-03-03T08:20:00Z', method: 'manual' },
    ],
  },
  {
    id: 'att-2026-03-04',
    date: '2026-03-04',
    classId: 'Dars-e-Nizami',
    course: 'Dars-e-Nizami',
    genderCategory: 'all',
    sessionTime: 'morning',
    lastUpdated: '2026-03-04T08:30:00Z',
    records: [
      { studentId: 'std-1', rollNumber: 'JSA-2026-101', studentName: 'Muhammad Usman Khan', gender: 'male', course: 'Dars-e-Nizami', status: 'present', timestamp: '2026-03-04T08:07:00Z', method: 'qr_scan' },
      { studentId: 'std-2', rollNumber: 'JSA-2026-102', studentName: 'Hamza Farooq', gender: 'male', course: 'Hifz-ul-Quran', status: 'present', timestamp: '2026-03-04T08:11:00Z', method: 'qr_scan' },
      { studentId: 'std-3', rollNumber: 'JSA-2026-103', studentName: 'Zainab Bint Tariq', gender: 'female', course: 'Dars-e-Nizami', status: 'leave', notes: 'Prior written family leave', timestamp: '2026-03-04T08:15:00Z', method: 'manual' },
      { studentId: 'std-4', rollNumber: 'JSA-2026-104', studentName: 'Abu Bakr Siddiqui', gender: 'male', course: 'Islamic Jurisprudence (Ifta)', status: 'present', timestamp: '2026-03-04T08:21:00Z', method: 'qr_scan' },
      { studentId: 'std-5', rollNumber: 'JSA-2026-105', studentName: 'Talha Bin Zubair', gender: 'male', course: 'Modern Education & IT', status: 'present', timestamp: '2026-03-04T08:24:00Z', method: 'manual' },
    ],
  },
  {
    id: 'att-2026-03-05',
    date: '2026-03-05',
    classId: 'Dars-e-Nizami',
    course: 'Dars-e-Nizami',
    genderCategory: 'all',
    sessionTime: 'morning',
    lastUpdated: '2026-03-05T08:30:00Z',
    records: [
      { studentId: 'std-1', rollNumber: 'JSA-2026-101', studentName: 'Muhammad Usman Khan', gender: 'male', course: 'Dars-e-Nizami', status: 'present', timestamp: '2026-03-05T08:06:00Z', method: 'qr_scan' },
      { studentId: 'std-2', rollNumber: 'JSA-2026-102', studentName: 'Hamza Farooq', gender: 'male', course: 'Hifz-ul-Quran', status: 'present', timestamp: '2026-03-05T08:14:00Z', method: 'qr_scan' },
      { studentId: 'std-3', rollNumber: 'JSA-2026-103', studentName: 'Zainab Bint Tariq', gender: 'female', course: 'Dars-e-Nizami', status: 'present', timestamp: '2026-03-05T08:16:00Z', method: 'manual' },
      { studentId: 'std-4', rollNumber: 'JSA-2026-104', studentName: 'Abu Bakr Siddiqui', gender: 'male', course: 'Islamic Jurisprudence (Ifta)', status: 'present', timestamp: '2026-03-05T08:20:00Z', method: 'qr_scan' },
      { studentId: 'std-5', rollNumber: 'JSA-2026-105', studentName: 'Talha Bin Zubair', gender: 'male', course: 'Modern Education & IT', status: 'present', timestamp: '2026-03-05T08:22:00Z', method: 'manual' },
    ],
  },
  {
    id: 'att-2026-03-06',
    date: '2026-03-06',
    classId: 'Dars-e-Nizami',
    course: 'Dars-e-Nizami',
    genderCategory: 'all',
    sessionTime: 'morning',
    lastUpdated: '2026-03-06T08:30:00Z',
    records: [
      { studentId: 'std-1', rollNumber: 'JSA-2026-101', studentName: 'Muhammad Usman Khan', gender: 'male', course: 'Dars-e-Nizami', status: 'present', timestamp: '2026-03-06T08:05:00Z', method: 'qr_scan' },
      { studentId: 'std-2', rollNumber: 'JSA-2026-102', studentName: 'Hamza Farooq', gender: 'male', course: 'Hifz-ul-Quran', status: 'present', timestamp: '2026-03-06T08:09:00Z', method: 'qr_scan' },
      { studentId: 'std-3', rollNumber: 'JSA-2026-103', studentName: 'Zainab Bint Tariq', gender: 'female', course: 'Dars-e-Nizami', status: 'present', timestamp: '2026-03-06T08:14:00Z', method: 'manual' },
      { studentId: 'std-4', rollNumber: 'JSA-2026-104', studentName: 'Abu Bakr Siddiqui', gender: 'male', course: 'Islamic Jurisprudence (Ifta)', status: 'present', timestamp: '2026-03-06T08:19:00Z', method: 'qr_scan' },
      { studentId: 'std-5', rollNumber: 'JSA-2026-105', studentName: 'Talha Bin Zubair', gender: 'male', course: 'Modern Education & IT', status: 'leave', notes: 'Medical clinic appointment', timestamp: '2026-03-06T08:23:00Z', method: 'manual' },
    ],
  },
];

export const INITIAL_PROMOTIONAL_MEDIA: PromotionalMediaItem[] = [
  {
    id: 'med-1',
    title: 'Jamia Salahuddin Ayubi - Institutional Documentary & Campus Overview',
    urduTitle: 'جامعہ صلاح الدین الأیوبی - دستاویزی تعارفی فلم',
    type: 'video',
    category: 'institute_intro',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    duration: '03:45',
    description: 'Official institutional documentary showcasing the campus facilities, academic departments, leadership of Director Muneeb ur Rehman, and traditional Halaqahs.',
    author: 'Jamia Media Cell',
    publishedDate: '2026-02-15',
    viewsCount: 1420,
    tags: ['Documentary', 'Campus Tour', 'Overview', 'Leadership'],
    aspectRatio: '16:9',
  },
  {
    id: 'med-2',
    title: 'Shu\'ba Hifz-ul-Quran Memorization Session & Tajweed Halaqah',
    urduTitle: 'شعبہ تحفیظ القرآن الکریم - یومیہ سبق اور منزل کا حلقہ',
    type: 'footage',
    category: 'student_footage',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&auto=format&fit=crop&q=80',
    duration: '02:18',
    description: 'Classroom learning footage of students reciting daily Sabaq with accurate Tajweed under Qari Muhammad Bilal. (Recorded with official parental consent).',
    author: 'Academic Wing',
    publishedDate: '2026-02-20',
    viewsCount: 980,
    tags: ['Hifz', 'Tajweed', 'Student Footage', 'Classroom'],
    consentObtained: true,
    aspectRatio: '16:9',
  },
  {
    id: 'med-3',
    title: 'Shariyat Course 2026 - Promotional Campaign Ad',
    urduTitle: 'شریعت کورس - خصوصی تعارفی اشتہار',
    type: 'video',
    category: 'course_promo',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e35b32?w=800&auto=format&fit=crop&q=80',
    duration: '01:30',
    description: 'Highlighting the practical Fiqh syllabus, Taharah, Salah, Zakat, and ethical guidance for university students and professionals.',
    courseId: 'course-shariyat',
    courseName: 'Shariyat Course',
    author: 'Directorate of Public Relations',
    publishedDate: '2026-02-25',
    viewsCount: 2150,
    tags: ['Shariyat', 'Admissions', 'Fiqh', 'Promo Video'],
    aspectRatio: '16:9',
  },
  {
    id: 'med-4',
    title: 'Dars-e-Nizami (Al-Alimiyyah 8-Year) Scholarly Horizon',
    urduTitle: 'درس نظامی (العالمیہ) - تفصیلی کورس تعارف',
    type: 'video',
    category: 'course_promo',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507842229451-7f01be7fe88d?w=800&auto=format&fit=crop&q=80',
    duration: '04:12',
    description: 'Overview of classical Dars-e-Nizami stages from Al-Ula to Al-Alimiyyah, textbooks, and integrated modern IT education.',
    courseId: 'course-darse-nizami',
    courseName: 'Dars-e-Nizami',
    author: 'Jamia Media Cell',
    publishedDate: '2026-03-01',
    viewsCount: 1870,
    tags: ['Dars-e-Nizami', 'Alimiyyah', 'Arabic', 'Hadith'],
    aspectRatio: '16:9',
  },
  {
    id: 'med-5',
    title: 'Official Jamia Salahuddin Ayubi Emblem & Insignia',
    urduTitle: 'جامعہ صلاح الدین الأیوبی کا سرکاری نشان اور مہر',
    type: 'logo',
    category: 'institute_intro',
    url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80',
    description: 'Original high-resolution institutional coat of arms featuring the Quranic verse, Crescent, and Soft Gold and Deep Green heritage colors.',
    author: 'Design & Identity Directorate',
    publishedDate: '2026-01-10',
    tags: ['Logo', 'Brand', 'Insignia', 'Official'],
    aspectRatio: '1:1',
  },
  {
    id: 'med-6',
    title: 'Annual Admissions 2026-2027 Mega Banner',
    urduTitle: 'سالانہ داخلہ مہم 2026-2027 کا مرکزی بینر',
    type: 'banner',
    category: 'admission_ad',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
    description: 'Promotional hero campaign graphic announcing open admissions for Boys Campus and Girls (Bannat) Wing.',
    author: 'Public Relations',
    publishedDate: '2026-02-01',
    tags: ['Admissions', 'Banner', 'Campaign 2026'],
    aspectRatio: '16:9',
  },
];

export const INITIAL_AD_PLANS: AdvertisementPlan[] = [
  {
    id: 'plan-1',
    title: 'Hifz-ul-Quran & Tajweed Annual Admission Campaign',
    coursePromoted: 'Hifz-ul-Quran',
    targetAudience: 'Parents of children aged 8-14, Huffaz aspirants',
    videoDescription: 'A compelling 60-second video advert detailing the daily Halaqah routine, certified Asatizah, and boarding environment under Director Muneeb ur Rehman.',
    scriptUrdu: 'کیا آپ اپنے بچے کے سینے کو کلامِ الٰہی سے منور کرنا چاہتے ہیں؟ جامعہ صلاح الدین الأیوبی میں حفظِ قرآن کا باقاعدہ آغاز۔ تجوید کے ساتھ حفظ، صاف ستھری رہائش اور مخلص اساتذہ۔ آج ہی داخلہ فارم پر کریں۔',
    scriptEnglish: 'Nurture your child\'s heart with the Noble Quran. Jamia Salahuddin Ayubi announces admissions for full-time Hifz with Tajweed. Clean boarding, dedicated scholars, and disciplined daily mentoring. Apply online now.',
    voiceoverText: 'Bismillah-ir-Rahman-ir-Rahim. Jamia Salahuddin Ayubi presents an accredited Quranic journey. With classical Tajweed and state-of-the-art facilities, your child memorizes with confidence and adab. Visit jamiasalahuddinayubi.edu.pk.',
    captionText: 'Admissions Open 2026 | Full-time Hifz-ul-Quran with Classical Tajweed | Boys & Girls Wings | Jamia Salahuddin Ayubi',
    thumbnailUrl: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    status: 'published',
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-02-15T12:00:00Z',
    createdBy: 'Muneeb ur Rehman (Director)',
  },
  {
    id: 'plan-2',
    title: 'Shariyat Course: Essential Islamic Jurisprudence for Youth',
    coursePromoted: 'Shariyat Course',
    targetAudience: 'College/University students, professionals, and adults',
    videoDescription: 'Short-form dynamic social media reel advertising practical Fiqh rulings for day-to-day life: purification, Salah, ethical earning, and family rulings.',
    scriptUrdu: 'روزمرہ کے شرعی مسائل اور عبادات کی درستگی کے لیے جامعہ صلاح الدین ایوبی کا خصوصی "شریعت کورس"۔ وضو، نماز، زکوٰۃ اور حلال و حرام کے احکام مستند علماء سے سیکھیں۔',
    scriptEnglish: 'Master daily Fiqh, understand the rulings of Taharah, Salah, Zakat, and business ethics. Join Jamia Salahuddin Ayubi\'s specialized Shariyat Course.',
    voiceoverText: 'Empower your life with authentic Islamic knowledge. Enroll in the practical Shariyat Course at Jamia Salahuddin Ayubi today.',
    captionText: 'Shariyat Course 2026 | Practical Islamic Rulings for Everyday Life | Register Today',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e35b32?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    status: 'in_production',
    createdAt: '2026-02-20T11:30:00Z',
    updatedAt: '2026-02-25T14:00:00Z',
    createdBy: 'Media Cell Lead',
  },
];

// Reactive Event Dispatcher
type ListenerCallback = () => void;
const listeners: Set<ListenerCallback> = new Set();

function notifyListeners() {
  listeners.forEach((cb) => {
    try {
      cb();
    } catch (e) {
      console.error(e);
    }
  });
}

export function subscribeToStore(callback: ListenerCallback): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

// LocalStorage helpers with automatic seeding
function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item);
  } catch (err) {
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    notifyListeners();
  } catch (err) {
    console.error('Storage set failed:', err);
  }
}

// Data Access API
export const JamiaStore = {
  // Settings
  getSettings(): InstituteSettings {
    return getStored<InstituteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },
  updateSettings(updates: Partial<InstituteSettings>): InstituteSettings {
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    setStored(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // Students
  getStudents(): Student[] {
    return getStored<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  },
  getStudentByRoll(rollNumber: string): Student | undefined {
    const clean = rollNumber.trim().toUpperCase();
    return this.getStudents().find(
      (s) => s.rollNumber.toUpperCase() === clean || s.admissionNumber.toUpperCase() === clean
    );
  },
  getStudentById(id: string): Student | undefined {
    return this.getStudents().find((s) => s.id === id);
  },
  addStudent(student: Omit<Student, 'id'>): Student {
    const current = this.getStudents();
    const newStudent: Student = {
      ...student,
      id: 'std-' + Date.now(),
    };
    setStored(STORAGE_KEYS.STUDENTS, [newStudent, ...current]);

    // Async push to Supabase if connected
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        Promise.resolve(
          supabase.from('students').insert([{
            roll_number: newStudent.rollNumber,
            admission_number: newStudent.admissionNumber,
            full_name: newStudent.fullName,
            urdu_name: newStudent.urduName || null,
            father_name: newStudent.fatherName,
            guardian_phone: newStudent.guardianPhone,
            cnic_or_b_form: newStudent.cnicOrBForm || null,
            dob: newStudent.dob || null,
            gender: newStudent.gender,
            blood_group: newStudent.bloodGroup,
            department: newStudent.department,
            current_year: newStudent.currentYear,
            boarding_status: newStudent.boardingStatus,
            photo_url: newStudent.photoUrl || null,
            address: newStudent.address,
            admission_date: newStudent.admissionDate,
            status: newStudent.status,
            emergency_contact: newStudent.emergencyContact,
          }])
        ).then((res: any) => {
          if (res?.error) console.info('Supabase student insert note:', res.error.message);
        }).catch((err: any) => console.info('Supabase student async error:', err));
      }
    } catch (e) {
      // Graceful fallback to persistent storage
    }

    return newStudent;
  },
  updateStudent(id: string, updates: Partial<Student>): Student | null {
    const current = this.getStudents();
    const index = current.findIndex((s) => s.id === id);
    if (index === -1) return null;
    current[index] = { ...current[index], ...updates };
    setStored(STORAGE_KEYS.STUDENTS, [...current]);

    // Async push updates to Supabase if connected
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const payload: Record<string, any> = {};
        if (updates.fullName !== undefined) payload.full_name = updates.fullName;
        if (updates.urduName !== undefined) payload.urdu_name = updates.urduName;
        if (updates.fatherName !== undefined) payload.father_name = updates.fatherName;
        if (updates.guardianPhone !== undefined) payload.guardian_phone = updates.guardianPhone;
        if (updates.cnicOrBForm !== undefined) payload.cnic_or_b_form = updates.cnicOrBForm;
        if (updates.gender !== undefined) payload.gender = updates.gender;
        if (updates.department !== undefined) payload.department = updates.department;
        if (updates.currentYear !== undefined) payload.current_year = updates.currentYear;
        if (updates.status !== undefined) payload.status = updates.status;
        if (updates.photoUrl !== undefined) payload.photo_url = updates.photoUrl;
        if (updates.address !== undefined) payload.address = updates.address;

        if (Object.keys(payload).length > 0) {
          Promise.resolve(
            supabase.from('students').update(payload).or(`id.eq.${id},roll_number.eq.${current[index].rollNumber}`)
          ).then((res: any) => {
            if (res?.error) console.info('Supabase student update note:', res.error.message);
          }).catch((err: any) => console.info('Supabase student update error:', err));
        }
      }
    } catch (e) {
      // Graceful fallback
    }

    return current[index];
  },
  deleteStudent(id: string): boolean {
    const current = this.getStudents();
    const target = current.find((s) => s.id === id);
    const filtered = current.filter((s) => s.id !== id);
    if (filtered.length !== current.length) {
      setStored(STORAGE_KEYS.STUDENTS, filtered);

      // Async delete from Supabase if connected
      try {
        const supabase = getSupabaseClient();
        if (supabase && target) {
          Promise.resolve(
            supabase.from('students').delete().or(`id.eq.${id},roll_number.eq.${target.rollNumber}`)
          ).then((res: any) => {
            if (res?.error) console.info('Supabase student delete note:', res.error.message);
          }).catch((err: any) => console.info('Supabase student delete error:', err));
        }
      } catch (e) {
        // Graceful fallback
      }

      return true;
    }
    return false;
  },

  // Pull latest records directly from Supabase tables
  async syncWithSupabase(): Promise<{ success: boolean; count: number; message: string }> {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        return { success: false, count: 0, message: 'Supabase client is not configured yet. Using local persistent database.' };
      }

      const { data: remoteStudents, error: studentError } = await supabase.from('students').select('*');
      if (studentError) {
        return { success: false, count: 0, message: studentError.message };
      }

      if (remoteStudents && Array.isArray(remoteStudents) && remoteStudents.length > 0) {
        const mappedStudents: Student[] = remoteStudents.map((r: any) => ({
          id: r.id || 'std-' + r.roll_number,
          rollNumber: r.roll_number,
          admissionNumber: r.admission_number || `ADM-2026-${r.roll_number.slice(-3)}`,
          fullName: r.full_name,
          urduName: r.urdu_name || '',
          fatherName: r.father_name || '',
          guardianPhone: r.guardian_phone || '',
          cnicOrBForm: r.cnic_or_b_form || '',
          dob: r.dob || '2006-01-01',
          gender: r.gender || 'male',
          bloodGroup: (r.blood_group as BloodGroup) || 'B+',
          department: r.department || 'Dars-e-Nizami',
          currentYear: r.current_year || 'Year 1',
          boardingStatus: r.boarding_status || 'day_scholar',
          photoUrl: r.photo_url || '',
          address: r.address || '',
          admissionDate: r.admission_date || new Date().toISOString().split('T')[0],
          status: r.status || 'active',
          emergencyContact: r.emergency_contact || r.guardian_phone || '',
        }));

        setStored(STORAGE_KEYS.STUDENTS, mappedStudents);
        return { success: true, count: mappedStudents.length, message: `Successfully synchronized ${mappedStudents.length} students from Supabase!` };
      }

      return { success: true, count: 0, message: 'Connected to Supabase. Table is currently ready for records.' };
    } catch (err: any) {
      return { success: false, count: 0, message: err.message || 'Sync operation failed' };
    }
  },

  // Admissions
  getAdmissions(): AdmissionApplication[] {
    return getStored<AdmissionApplication[]>(STORAGE_KEYS.ADMISSIONS, INITIAL_ADMISSIONS);
  },
  submitAdmission(data: Omit<AdmissionApplication, 'id' | 'applicationNumber' | 'status' | 'submittedAt'>): AdmissionApplication {
    const current = this.getAdmissions();
    const isMale = (data.admissionCategory || data.gender) === 'male';
    const prefix = isMale ? 'APP-M-2026-' : 'APP-F-2026-';
    const applicationNumber = `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;

    const newApp: AdmissionApplication = {
      ...data,
      id: 'app-' + Date.now(),
      applicationNumber,
      admissionCategory: isMale ? 'male' : 'female',
      gender: isMale ? 'male' : 'female',
      status: 'pending',
      submittedAt: new Date().toISOString(),
      // Ensure backward-compatibility aliases
      phone: data.contactNumber || data.phone || '',
      guardianPhone: data.guardianContact || data.guardianPhone || '',
      applicantCnicOrBForm: data.bFormCnic || data.applicantCnicOrBForm || '',
    };

    setStored(STORAGE_KEYS.ADMISSIONS, [newApp, ...current]);

    // Save data in Supabase (if configured)
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        Promise.resolve(
          supabase.from('admission_applications').insert([{
            application_number: newApp.applicationNumber,
            applicant_name: newApp.applicantName,
            urdu_name: newApp.urduName || null,
            father_name: newApp.fatherName,
            dob: newApp.dob || null,
            gender: newApp.gender,
            phone: newApp.contactNumber || newApp.phone || '',
            guardian_phone: newApp.guardianContact || newApp.guardianPhone || '',
            email: newApp.email || null,
            address: newApp.address,
            city: newApp.city,
            program: newApp.program,
            status: 'pending',
            photo_url: newApp.photoUrl || null,
          }])
        )
          .then((res: any) => {
            if (res && res.error) console.info('Supabase live table sync note:', res.error.message);
          })
          .catch((err: any) => console.info('Supabase client async note:', err));
      }
    } catch (e) {
      // Graceful fallback to persistent storage
    }

    return newApp;
  },
  editAdmissionApplication(updated: AdmissionApplication): AdmissionApplication | null {
    const current = this.getAdmissions();
    const index = current.findIndex((a) => a.id === updated.id);
    if (index === -1) return null;
    current[index] = { ...updated };
    setStored(STORAGE_KEYS.ADMISSIONS, [...current]);
    return current[index];
  },
  updateAdmissionStatus(
    id: string,
    status: AdmissionApplication['status'],
    options?: { assignedRollNumber?: string; assignedSection?: string; interviewDate?: string; adminNotes?: string }
  ): AdmissionApplication | null {
    const current = this.getAdmissions();
    const index = current.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const existing = current[index];
    const isMale = (existing.admissionCategory || existing.gender) === 'male';

    let autoRollNumber = options?.assignedRollNumber || existing.assignedRollNumber;
    if (status === 'approved' && !autoRollNumber) {
      autoRollNumber = isMale
        ? `JSA-2026-M${Math.floor(100 + Math.random() * 900)}`
        : `JSA-2026-F${Math.floor(100 + Math.random() * 900)}`;
    }

    const updated: AdmissionApplication = {
      ...existing,
      status,
      ...options,
      assignedRollNumber: autoRollNumber,
    };
    current[index] = updated;
    setStored(STORAGE_KEYS.ADMISSIONS, [...current]);

    // If approved, automatically enroll in students directory with gender separation
    if (status === 'approved' && autoRollNumber) {
      const existingStudent = this.getStudentByRoll(autoRollNumber);
      if (!existingStudent) {
        this.addStudent({
          rollNumber: autoRollNumber,
          admissionNumber: `ADM-2026-${Math.floor(100 + Math.random() * 900)}`,
          fullName: existing.applicantName,
          urduName: existing.urduName || '',
          fatherName: existing.fatherName,
          guardianPhone: existing.guardianContact || existing.guardianPhone || existing.contactNumber || '',
          cnicOrBForm: existing.bFormCnic || existing.applicantCnicOrBForm || '',
          dob: existing.dob,
          gender: isMale ? 'male' : 'female',
          bloodGroup: existing.bloodGroup || 'B+',
          department: existing.program + (isMale ? ' (Male Campus)' : ' (Bannat Wing)'),
          currentYear: options?.assignedSection || existing.preferredSection || (isMale ? 'Boys Section A' : 'Girls Bannat Section Sayyidah Aisha (R.A)'),
          boardingStatus: existing.boardingRequired ? 'boarder' : 'day_scholar',
          photoUrl: existing.photoUrl || '',
          address: existing.address + (existing.city ? ', ' + existing.city : ''),
          admissionDate: new Date().toISOString().split('T')[0],
          status: 'active',
          emergencyContact: `${existing.guardianContact || existing.contactNumber} (${existing.relationship || 'Guardian'})`,
        });
      }
    }

    return updated;
  },

  // Staff Management
  getStaff(): StaffMember[] {
    return getStored<StaffMember[]>(STORAGE_KEYS.STAFF, []);
  },
  getStaffById(id: string): StaffMember | undefined {
    return this.getStaff().find((s) => s.id === id);
  },
  addStaff(staff: Omit<StaffMember, 'id'>): StaffMember {
    const current = this.getStaff();
    const newStaff: StaffMember = {
      ...staff,
      id: 'st-' + Date.now(),
    };
    setStored(STORAGE_KEYS.STAFF, [newStaff, ...current]);

    // Push to Supabase if connected
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        Promise.resolve(
          supabase.from('staff').insert([{
            full_name: newStaff.fullName,
            urdu_name: newStaff.urduName || null,
            father_name: newStaff.fatherName,
            contact: newStaff.contact,
            address: newStaff.address,
            designation: newStaff.designation,
            joining_date: newStaff.joiningDate,
            assigned_department: newStaff.assignedDepartment,
            salary: newStaff.salary,
            status: newStaff.status,
            role_type: newStaff.roleType,
            photo_url: newStaff.photoUrl || null,
            assigned_courses: newStaff.assignedCourses || [],
            assigned_classes: newStaff.assignedClasses || [],
          }])
        ).then((res: any) => {
          if (res?.error) console.info('Supabase staff insert note:', res.error.message);
        }).catch((err: any) => console.info('Supabase staff async note:', err));
      }
    } catch (e) {}

    return newStaff;
  },
  updateStaff(id: string, updates: Partial<StaffMember>): StaffMember | null {
    const current = this.getStaff();
    const idx = current.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    current[idx] = { ...current[idx], ...updates };
    setStored(STORAGE_KEYS.STAFF, [...current]);

    // Push to Supabase if connected
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const payload: Record<string, any> = {};
        if (updates.fullName !== undefined) payload.full_name = updates.fullName;
        if (updates.fatherName !== undefined) payload.father_name = updates.fatherName;
        if (updates.contact !== undefined) payload.contact = updates.contact;
        if (updates.address !== undefined) payload.address = updates.address;
        if (updates.designation !== undefined) payload.designation = updates.designation;
        if (updates.assignedDepartment !== undefined) payload.assigned_department = updates.assignedDepartment;
        if (updates.salary !== undefined) payload.salary = updates.salary;
        if (updates.status !== undefined) payload.status = updates.status;
        if (updates.roleType !== undefined) payload.role_type = updates.roleType;
        if (updates.photoUrl !== undefined) payload.photo_url = updates.photoUrl;
        if (updates.assignedCourses !== undefined) payload.assigned_courses = updates.assignedCourses;
        if (updates.assignedClasses !== undefined) payload.assigned_classes = updates.assignedClasses;

        if (Object.keys(payload).length > 0) {
          Promise.resolve(
            supabase.from('staff').update(payload).eq('id', id)
          ).then((res: any) => {
            if (res?.error) console.info('Supabase staff update note:', res.error.message);
          }).catch((err: any) => console.info('Supabase staff update note:', err));
        }
      }
    } catch (e) {}

    return current[idx];
  },
  deleteStaff(id: string): boolean {
    const current = this.getStaff();
    const filtered = current.filter((s) => s.id !== id);
    if (filtered.length !== current.length) {
      setStored(STORAGE_KEYS.STAFF, filtered);
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          Promise.resolve(supabase.from('staff').delete().eq('id', id))
            .then((res: any) => {
              if (res?.error) console.info('Supabase staff delete note:', res.error.message);
            }).catch((err: any) => console.info('Supabase staff delete note:', err));
        }
      } catch (e) {}
      return true;
    }
    return false;
  },
  async syncStaffWithSupabase(): Promise<{ success: boolean; count: number; message: string }> {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        return { success: false, count: 0, message: 'Supabase client is not configured yet. Using local repository.' };
      }
      const { data, error } = await supabase.from('staff').select('*');
      if (error) {
        return { success: false, count: 0, message: error.message };
      }
      if (data && Array.isArray(data) && data.length > 0) {
        const mapped: StaffMember[] = data.map((r: any) => ({
          id: r.id || 'st-' + Date.now(),
          fullName: r.full_name,
          urduName: r.urdu_name || '',
          fatherName: r.father_name || '',
          contact: r.contact || '',
          address: r.address || '',
          designation: r.designation || 'Teacher',
          joiningDate: r.joining_date || new Date().toISOString().split('T')[0],
          assignedDepartment: r.assigned_department || 'Dars-e-Nizami',
          salary: Number(r.salary) || 0,
          status: r.status || 'active',
          roleType: r.role_type || 'teacher',
          photoUrl: r.photo_url || '',
          assignedCourses: r.assigned_courses || [],
          assignedClasses: r.assigned_classes || [],
        }));
        setStored(STORAGE_KEYS.STAFF, mapped);
        return { success: true, count: mapped.length, message: `Synchronized ${mapped.length} staff records from Supabase.` };
      }
      return { success: true, count: 0, message: 'Connected to Supabase staff table.' };
    } catch (err: any) {
      return { success: false, count: 0, message: err.message || 'Staff sync failed' };
    }
  },

  // Courses
  getCourses(): Course[] {
    return getStored<Course[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
  },
  getCourseById(id: string): Course | undefined {
    const list = this.getCourses();
    return list.find((c) => c.id === id || c.code.toLowerCase() === id.toLowerCase());
  },
  updateCourse(updated: Course): Course {
    const list = this.getCourses();
    const idx = list.findIndex((c) => c.id === updated.id);
    if (idx >= 0) {
      list[idx] = { ...updated, isConfiguredByManagement: true, lastUpdated: new Date().toISOString().split('T')[0] };
      setStored(STORAGE_KEYS.COURSES, [...list]);
      // Sync to Supabase
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          Promise.resolve(
            supabase.from('courses').upsert([{
              code: updated.code,
              title: updated.title,
              arabic_title: updated.arabicTitle || null,
              category: updated.category,
              department: updated.department,
              description: updated.description,
              duration: updated.duration,
              eligibility: updated.eligibility,
              fees: updated.fees,
              certification: updated.certification,
              assigned_teachers: updated.assignedTeachers || [],
              assigned_classes: updated.assignedClasses || [],
              status: updated.status || 'active',
            }], { onConflict: 'code' })
          ).then((res: any) => {
            if (res?.error) console.info('Supabase course upsert note:', res.error.message);
          }).catch((err: any) => console.info('Supabase course async note:', err));
        }
      } catch (e) {}
      return list[idx];
    } else {
      list.push(updated);
      setStored(STORAGE_KEYS.COURSES, [...list]);
      return updated;
    }
  },
  addCourse(course: Omit<Course, 'id'>): Course {
    const list = this.getCourses();
    const newCourse: Course = {
      ...course,
      id: 'course-' + Date.now(),
      status: course.status || 'active',
      isConfiguredByManagement: true,
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setStored(STORAGE_KEYS.COURSES, [...list, newCourse]);

    // Push to Supabase if connected
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        Promise.resolve(
          supabase.from('courses').insert([{
            code: newCourse.code,
            title: newCourse.title,
            arabic_title: newCourse.arabicTitle || null,
            category: newCourse.category,
            department: newCourse.department,
            description: newCourse.description,
            duration: newCourse.duration,
            eligibility: newCourse.eligibility,
            fees: newCourse.fees,
            certification: newCourse.certification,
            assigned_teachers: newCourse.assignedTeachers || [],
            assigned_classes: newCourse.assignedClasses || [],
            status: newCourse.status || 'active',
          }])
        ).then((res: any) => {
          if (res?.error) console.info('Supabase course insert note:', res.error.message);
        }).catch((err: any) => console.info('Supabase course async note:', err));
      }
    } catch (e) {}

    return newCourse;
  },
  deleteCourse(id: string): boolean {
    const list = this.getCourses();
    const target = list.find((c) => c.id === id);
    const filtered = list.filter((c) => c.id !== id);
    if (filtered.length !== list.length) {
      setStored(STORAGE_KEYS.COURSES, filtered);
      try {
        const supabase = getSupabaseClient();
        if (supabase && target) {
          Promise.resolve(
            supabase.from('courses').delete().or(`id.eq.${id},code.eq.${target.code}`)
          ).then((res: any) => {
            if (res?.error) console.info('Supabase course delete note:', res.error.message);
          }).catch((err: any) => console.info('Supabase course async note:', err));
        }
      } catch (e) {}
      return true;
    }
    return false;
  },
  resetCourses(): void {
    localStorage.removeItem(STORAGE_KEYS.COURSES);
    notifyListeners();
  },
  async syncCoursesWithSupabase(): Promise<{ success: boolean; count: number; message: string }> {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        return { success: false, count: 0, message: 'Supabase client is not configured yet. Using local repository.' };
      }
      const { data, error } = await supabase.from('courses').select('*');
      if (error) {
        return { success: false, count: 0, message: error.message };
      }
      if (data && Array.isArray(data) && data.length > 0) {
        const mapped: Course[] = data.map((r: any) => ({
          id: r.id || 'course-' + r.code,
          code: r.code,
          title: r.title,
          arabicTitle: r.arabic_title || '',
          category: r.category || 'Islamic Studies',
          department: r.department || 'Curriculum Division',
          instructor: r.instructor || 'Senior Asatiza',
          creditHours: r.credit_hours || 0,
          description: r.description || '',
          objectives: Array.isArray(r.objectives) ? r.objectives : [],
          eligibility: r.eligibility || 'Configurable by Management',
          duration: r.duration || 'Configurable by Management',
          fees: r.fees || 'Configurable by Management',
          certification: r.certification || 'Configurable by Management',
          admissionInfo: r.admission_info || '',
          books: Array.isArray(r.books) ? r.books : [],
          isConfiguredByManagement: true,
          lastUpdated: r.last_updated || new Date().toISOString().split('T')[0],
          assignedTeachers: Array.isArray(r.assigned_teachers) ? r.assigned_teachers : [],
          assignedClasses: Array.isArray(r.assigned_classes) ? r.assigned_classes : [],
          genderArrangement: r.gender_arrangement || {
            maleClasses: ['Boys Section A'],
            femaleClasses: ['Sayyidah Aisha Wing Section A'],
            hasSeparateWings: true,
            maleTimings: '08:00 AM - 01:30 PM',
            femaleTimings: '02:00 PM - 06:00 PM',
          },
          status: r.status || 'active',
        }));
        setStored(STORAGE_KEYS.COURSES, mapped);
        return { success: true, count: mapped.length, message: `Synchronized ${mapped.length} courses from Supabase.` };
      }
      return { success: true, count: 0, message: 'Connected to Supabase courses table.' };
    } catch (err: any) {
      return { success: false, count: 0, message: err.message || 'Courses sync failed' };
    }
  },

  // Facilities
  getFacilities(): Facility[] {
    return getStored<Facility[]>(STORAGE_KEYS.FACILITIES, INITIAL_FACILITIES);
  },
  getFacilityById(id: string): Facility | undefined {
    const list = this.getFacilities();
    return list.find((f) => f.id === id);
  },
  updateFacility(updated: Facility): Facility {
    const list = this.getFacilities();
    const idx = list.findIndex((f) => f.id === updated.id);
    if (idx >= 0) {
      list[idx] = { ...updated, isVerifiedByManagement: true, verificationDate: new Date().toISOString().split('T')[0] };
      setStored(STORAGE_KEYS.FACILITIES, [...list]);
      return list[idx];
    } else {
      list.push(updated);
      setStored(STORAGE_KEYS.FACILITIES, [...list]);
      return updated;
    }
  },
  resetFacilities(): void {
    localStorage.removeItem(STORAGE_KEYS.FACILITIES);
    notifyListeners();
  },

  // Fee Structures
  getFeeStructures(): FeeStructure[] {
    return getStored<FeeStructure[]>(STORAGE_KEYS.FEE_STRUCTURES, INITIAL_FEE_STRUCTURES);
  },
  addFeeStructure(structure: Omit<FeeStructure, 'id'>): FeeStructure {
    const current = this.getFeeStructures();
    const newStruct: FeeStructure = {
      ...structure,
      id: 'fs-' + Date.now(),
    };
    setStored(STORAGE_KEYS.FEE_STRUCTURES, [newStruct, ...current]);
    return newStruct;
  },
  updateFeeStructure(id: string, updates: Partial<FeeStructure>): FeeStructure | null {
    const current = this.getFeeStructures();
    const idx = current.findIndex((f) => f.id === id);
    if (idx === -1) return null;
    current[idx] = { ...current[idx], ...updates };
    setStored(STORAGE_KEYS.FEE_STRUCTURES, [...current]);
    return current[idx];
  },
  deleteFeeStructure(id: string): boolean {
    const current = this.getFeeStructures();
    const filtered = current.filter((f) => f.id !== id);
    if (filtered.length !== current.length) {
      setStored(STORAGE_KEYS.FEE_STRUCTURES, filtered);
      return true;
    }
    return false;
  },

  // Fees
  getFees(): FeeVoucher[] {
    return getStored<FeeVoucher[]>(STORAGE_KEYS.FEES, INITIAL_FEES);
  },
  getFeeVouchersForStudent(studentIdOrRoll: string): FeeVoucher[] {
    const all = this.getFees();
    const clean = studentIdOrRoll.trim().toUpperCase();
    return all.filter((f) => f.studentId === studentIdOrRoll || f.rollNumber.toUpperCase() === clean);
  },
  addFeeVoucher(voucher: Omit<FeeVoucher, 'id' | 'voucherNumber'>): FeeVoucher {
    const current = this.getFees();
    const totalAmount = Math.max(
      0,
      (Number(voucher.tuitionFee) || 0) +
        (Number(voucher.boardingFee) || 0) +
        (Number(voucher.examFee) || 0) +
        (Number(voucher.otherDues) || 0) -
        (Number(voucher.discount) || 0)
    );
    const amountPaid = voucher.amountPaid || 0;
    const remainingDues = Math.max(0, totalAmount - amountPaid);
    let status = voucher.status;
    if (totalAmount === 0 || amountPaid >= totalAmount) {
      status = 'paid';
    } else if (amountPaid > 0) {
      status = 'partial';
    } else {
      status = 'unpaid';
    }

    const newVoucher: FeeVoucher = {
      ...voucher,
      id: 'fee-' + Date.now(),
      voucherNumber: `VCH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      totalAmount,
      amountPaid,
      remainingDues,
      status,
      paymentHistory: voucher.paymentHistory || [],
    };
    setStored(STORAGE_KEYS.FEES, [newVoucher, ...current]);
    return newVoucher;
  },
  updateFeeVoucher(id: string, updates: Partial<FeeVoucher>): FeeVoucher | null {
    const current = this.getFees();
    const idx = current.findIndex((f) => f.id === id);
    if (idx === -1) return null;
    const existing = current[idx];

    const tuition = updates.tuitionFee !== undefined ? Number(updates.tuitionFee) : existing.tuitionFee;
    const boarding = updates.boardingFee !== undefined ? Number(updates.boardingFee) : existing.boardingFee;
    const exam = updates.examFee !== undefined ? Number(updates.examFee) : existing.examFee;
    const other = updates.otherDues !== undefined ? Number(updates.otherDues) : existing.otherDues;
    const discount = updates.discount !== undefined ? Number(updates.discount) : existing.discount;

    const totalAmount = Math.max(0, tuition + boarding + exam + other - discount);
    const amountPaid = updates.amountPaid !== undefined ? Number(updates.amountPaid) : existing.amountPaid || 0;
    const remainingDues = Math.max(0, totalAmount - amountPaid);

    let status = updates.status || existing.status;
    if (totalAmount === 0 || amountPaid >= totalAmount) {
      status = 'paid';
    } else if (amountPaid > 0) {
      status = 'partial';
    } else {
      status = 'unpaid';
    }

    current[idx] = {
      ...existing,
      ...updates,
      tuitionFee: tuition,
      boardingFee: boarding,
      examFee: exam,
      otherDues: other,
      discount,
      totalAmount,
      amountPaid,
      remainingDues,
      status,
    };
    setStored(STORAGE_KEYS.FEES, [...current]);
    return current[idx];
  },
  recordFeePayment(
    voucherId: string,
    payment: {
      amount: number;
      paymentMethod: string;
      receiptNumber?: string;
      notes?: string;
      receivedBy?: string;
    }
  ): FeeVoucher | null {
    const current = this.getFees();
    const idx = current.findIndex((f) => f.id === voucherId);
    if (idx === -1) return null;

    const vch = current[idx];
    const receiptNumber = payment.receiptNumber || `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPaymentEntry: FeePaymentEntry = {
      id: 'pay-' + Date.now(),
      receiptNumber,
      amount: Number(payment.amount),
      date: new Date().toISOString().split('T')[0],
      paymentMethod: payment.paymentMethod,
      receivedBy: payment.receivedBy || 'Muneeb ur Rehman (Director)',
      notes: payment.notes,
    };

    const newAmountPaid = (vch.amountPaid || 0) + Number(payment.amount);
    const newRemainingDues = Math.max(0, vch.totalAmount - newAmountPaid);
    const newStatus = newRemainingDues === 0 ? 'paid' : 'partial';

    current[idx] = {
      ...vch,
      amountPaid: newAmountPaid,
      remainingDues: newRemainingDues,
      status: newStatus,
      receiptNumber,
      paidDate: new Date().toISOString(),
      paymentMethod: payment.paymentMethod,
      collectedBy: payment.receivedBy || 'Muneeb ur Rehman (Director)',
      paymentHistory: [...(vch.paymentHistory || []), newPaymentEntry],
    };

    setStored(STORAGE_KEYS.FEES, [...current]);
    return current[idx];
  },
  markFeePaid(id: string, paymentMethod: string = 'Direct Bank Deposit'): FeeVoucher | null {
    const vch = this.getFees().find((f) => f.id === id);
    if (!vch) return null;
    const remaining = vch.remainingDues !== undefined ? vch.remainingDues : vch.totalAmount;
    return this.recordFeePayment(id, {
      amount: remaining > 0 ? remaining : vch.totalAmount,
      paymentMethod,
      receivedBy: 'Muneeb ur Rehman (Director)',
      notes: 'Full settlement marked via dashboard ledger',
    });
  },
  deleteFeeVoucher(id: string): boolean {
    const current = this.getFees();
    const filtered = current.filter((f) => f.id !== id);
    if (filtered.length !== current.length) {
      setStored(STORAGE_KEYS.FEES, filtered);
      return true;
    }
    return false;
  },
  async syncFeesWithSupabase(): Promise<{ success: boolean; count: number; message: string }> {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        return { success: false, count: 0, message: 'Supabase client is not configured yet. Using local repository.' };
      }
      const { data, error } = await supabase.from('fee_vouchers').select('*');
      if (error) {
        return { success: false, count: 0, message: error.message };
      }
      if (data && Array.isArray(data) && data.length > 0) {
        return { success: true, count: data.length, message: `Connected to Supabase fee register (${data.length} records).` };
      }
      return { success: true, count: 0, message: 'Connected to Supabase treasury ledger.' };
    } catch (err: any) {
      return { success: false, count: 0, message: err.message || 'Fee sync failed' };
    }
  },

  // Notices
  getNotices(): Notice[] {
    return getStored<Notice[]>(STORAGE_KEYS.NOTICES, INITIAL_NOTICES);
  },
  addNotice(notice: Omit<Notice, 'id' | 'publishDate'>): Notice {
    const current = this.getNotices();
    const newNotice: Notice = {
      ...notice,
      id: 'not-' + Date.now(),
      publishDate: new Date().toISOString().split('T')[0],
    };
    setStored(STORAGE_KEYS.NOTICES, [newNotice, ...current]);
    return newNotice;
  },
  deleteNotice(id: string): boolean {
    const current = this.getNotices();
    const filtered = current.filter((n) => n.id !== id);
    if (filtered.length !== current.length) {
      setStored(STORAGE_KEYS.NOTICES, filtered);
      return true;
    }
    return false;
  },

  // Exam Grades
  getGrades(): ExamGrade[] {
    return getStored<ExamGrade[]>(STORAGE_KEYS.EXAM_GRADES, INITIAL_EXAM_GRADES);
  },
  addGrade(grade: Omit<ExamGrade, 'id'>): ExamGrade {
    const current = this.getGrades();
    const newGrade: ExamGrade = {
      ...grade,
      id: 'grd-' + Date.now(),
    };
    setStored(STORAGE_KEYS.EXAM_GRADES, [newGrade, ...current]);
    return newGrade;
  },

  // Attendance
  getAttendance(): AttendanceRecord[] {
    return getStored<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
  },
  getAttendanceByDate(date: string): AttendanceRecord[] {
    return this.getAttendance().filter((a) => a.date === date);
  },
  getAttendanceForStudent(studentIdOrRoll: string): Array<{
    date: string;
    classId: string;
    course?: string;
    status: 'present' | 'absent' | 'leave';
    timestamp?: string;
    method?: string;
    notes?: string;
  }> {
    const all = this.getAttendance();
    const clean = studentIdOrRoll.trim().toUpperCase();
    const result: Array<{
      date: string;
      classId: string;
      course?: string;
      status: 'present' | 'absent' | 'leave';
      timestamp?: string;
      method?: string;
      notes?: string;
    }> = [];

    all.forEach((att) => {
      const match = att.records.find(
        (r) => r.studentId === studentIdOrRoll || r.rollNumber.toUpperCase() === clean
      );
      if (match) {
        result.push({
          date: att.date,
          classId: att.classId,
          course: att.course,
          status: match.status,
          timestamp: match.timestamp,
          method: match.method,
          notes: match.notes,
        });
      }
    });

    return result.sort((a, b) => b.date.localeCompare(a.date));
  },
  saveAttendance(record: Omit<AttendanceRecord, 'id'>): AttendanceRecord {
    const current = this.getAttendance();
    const existingIndex = current.findIndex(
      (a) => a.date === record.date && a.classId === record.classId
    );
    let newRec: AttendanceRecord;
    if (existingIndex >= 0) {
      newRec = {
        ...record,
        id: current[existingIndex].id,
        lastUpdated: new Date().toISOString(),
      };
      current[existingIndex] = newRec;
      setStored(STORAGE_KEYS.ATTENDANCE, [...current]);
    } else {
      newRec = {
        ...record,
        id: 'att-' + Date.now(),
        lastUpdated: new Date().toISOString(),
      };
      setStored(STORAGE_KEYS.ATTENDANCE, [newRec, ...current]);
    }

    // Push to Supabase if connected
    try {
      const supabase = getSupabaseClient();
      if (supabase && newRec.records.length > 0) {
        const rows = newRec.records.map((r) => ({
          date: newRec.date,
          class_id: newRec.classId,
          roll_number: r.rollNumber,
          student_name: r.studentName,
          status: r.status,
        }));
        Promise.resolve(
          supabase.from('attendance').upsert(rows, { onConflict: 'date,class_id,roll_number' })
        ).catch(() => {});
      }
    } catch (e) {}

    return newRec;
  },
  markSingleStudentAttendance(params: {
    studentId: string;
    rollNumber: string;
    studentName: string;
    date: string;
    classId: string;
    course?: string;
    gender?: 'male' | 'female';
    status: 'present' | 'absent' | 'leave';
    method?: 'qr_scan' | 'manual';
    notes?: string;
    markedBy?: string;
  }): {
    success: boolean;
    alreadyMarked: boolean;
    previousStatus?: 'present' | 'absent' | 'leave';
    record: AttendanceRecord;
  } {
    const all = this.getAttendance();
    let attRecord = all.find((a) => a.date === params.date && a.classId === params.classId);
    let alreadyMarked = false;
    let previousStatus: 'present' | 'absent' | 'leave' | undefined = undefined;

    const newEntry: StudentAttendanceEntry = {
      studentId: params.studentId,
      rollNumber: params.rollNumber,
      studentName: params.studentName,
      gender: params.gender,
      course: params.course,
      status: params.status,
      timestamp: new Date().toISOString(),
      markedBy: params.markedBy || 'Staff Proctor',
      method: params.method || 'manual',
      notes: params.notes,
    };

    if (attRecord) {
      const entryIdx = attRecord.records.findIndex(
        (r) => r.studentId === params.studentId || r.rollNumber === params.rollNumber
      );
      if (entryIdx >= 0) {
        alreadyMarked = true;
        previousStatus = attRecord.records[entryIdx].status;
        attRecord.records[entryIdx] = newEntry;
      } else {
        attRecord.records.push(newEntry);
      }
      attRecord.lastUpdated = new Date().toISOString();
      setStored(STORAGE_KEYS.ATTENDANCE, [...all]);
    } else {
      attRecord = {
        id: 'att-' + Date.now(),
        date: params.date,
        classId: params.classId,
        course: params.course,
        lastUpdated: new Date().toISOString(),
        records: [newEntry],
      };
      setStored(STORAGE_KEYS.ATTENDANCE, [attRecord, ...all]);
    }

    // Push to Supabase if connected
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        Promise.resolve(
          supabase.from('attendance').upsert([{
            date: params.date,
            class_id: params.classId,
            roll_number: params.rollNumber,
            student_name: params.studentName,
            status: params.status,
          }], { onConflict: 'date,class_id,roll_number' })
        ).catch(() => {});
      }
    } catch (e) {}

    return { success: true, alreadyMarked, previousStatus, record: attRecord };
  },
  async syncAttendanceWithSupabase(): Promise<{ success: boolean; count: number; message: string }> {
    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        return { success: false, count: 0, message: 'Supabase client is not configured yet. Using local repository.' };
      }
      const { data, error } = await supabase.from('attendance').select('*');
      if (error) {
        return { success: false, count: 0, message: error.message };
      }
      if (data && Array.isArray(data) && data.length > 0) {
        return { success: true, count: data.length, message: `Connected to Supabase attendance table. ${data.length} records active.` };
      }
      return { success: true, count: 0, message: 'Connected to Supabase attendance register.' };
    } catch (err: any) {
      return { success: false, count: 0, message: err.message || 'Attendance sync error' };
    }
  },

  // Promotional Media & Videos
  getPromotionalMedia(): PromotionalMediaItem[] {
    return getStored<PromotionalMediaItem[]>(STORAGE_KEYS.PROMOTIONAL_MEDIA, INITIAL_PROMOTIONAL_MEDIA);
  },
  addPromotionalMedia(item: Omit<PromotionalMediaItem, 'id' | 'publishedDate'>): PromotionalMediaItem {
    const current = this.getPromotionalMedia();
    const newItem: PromotionalMediaItem = {
      ...item,
      id: 'med-' + Date.now(),
      publishedDate: new Date().toISOString().split('T')[0],
      viewsCount: 0,
    };
    setStored(STORAGE_KEYS.PROMOTIONAL_MEDIA, [newItem, ...current]);
    return newItem;
  },
  updatePromotionalMedia(id: string, updates: Partial<PromotionalMediaItem>): PromotionalMediaItem | null {
    const current = this.getPromotionalMedia();
    const idx = current.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    current[idx] = { ...current[idx], ...updates };
    setStored(STORAGE_KEYS.PROMOTIONAL_MEDIA, [...current]);
    return current[idx];
  },
  deletePromotionalMedia(id: string): boolean {
    const current = this.getPromotionalMedia();
    const filtered = current.filter((m) => m.id !== id);
    if (filtered.length !== current.length) {
      setStored(STORAGE_KEYS.PROMOTIONAL_MEDIA, filtered);
      return true;
    }
    return false;
  },

  // Advertisement Planning
  getAdvertisementPlans(): AdvertisementPlan[] {
    return getStored<AdvertisementPlan[]>(STORAGE_KEYS.ADVERTISEMENT_PLANS, INITIAL_AD_PLANS);
  },
  addAdvertisementPlan(plan: Omit<AdvertisementPlan, 'id' | 'createdAt' | 'updatedAt'>): AdvertisementPlan {
    const current = this.getAdvertisementPlans();
    const newPlan: AdvertisementPlan = {
      ...plan,
      id: 'plan-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setStored(STORAGE_KEYS.ADVERTISEMENT_PLANS, [newPlan, ...current]);
    return newPlan;
  },
  updateAdvertisementPlan(id: string, updates: Partial<AdvertisementPlan>): AdvertisementPlan | null {
    const current = this.getAdvertisementPlans();
    const idx = current.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    current[idx] = { ...current[idx], ...updates, updatedAt: new Date().toISOString() };
    setStored(STORAGE_KEYS.ADVERTISEMENT_PLANS, [...current]);
    return current[idx];
  },
  deleteAdvertisementPlan(id: string): boolean {
    const current = this.getAdvertisementPlans();
    const filtered = current.filter((p) => p.id !== id);
    if (filtered.length !== current.length) {
      setStored(STORAGE_KEYS.ADVERTISEMENT_PLANS, filtered);
      return true;
    }
    return false;
  },

  // Reset to initial demo state
  resetAll() {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.ADMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.COURSES);
    localStorage.removeItem(STORAGE_KEYS.FACILITIES);
    localStorage.removeItem(STORAGE_KEYS.FEES);
    localStorage.removeItem(STORAGE_KEYS.FEE_STRUCTURES);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.EXAM_GRADES);
    localStorage.removeItem(STORAGE_KEYS.NOTICES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.PROMOTIONAL_MEDIA);
    localStorage.removeItem(STORAGE_KEYS.ADVERTISEMENT_PLANS);
    notifyListeners();
  },
};

