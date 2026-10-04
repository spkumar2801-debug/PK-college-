import campusMain from "@/assets/campus-main.jpg";
import campusSunset from "@/assets/campus-sunset.jpg";
import campusCourtyard from "@/assets/campus-courtyard.jpg";
import electronicsLab from "@/assets/lab-electronics.jpg";
import workshop from "@/assets/workshop.jpg";
import library from "@/assets/library.jpg";
import computerLab from "@/assets/computer-lab.jpg";
import sports from "@/assets/sports.jpg";

export interface SiteSettings {
  name: string;
  shortName: string;
  code: string;
  counselingCode: string;
  established: string;
  tagline: string;
  location: string;
  address: string;
  city?: string;
  state?: string;
  pincode?: string;
  phone: string;
  admissionsPhone: string;
  email: string;
  admissionsEmail: string;
  examCellEmail: string;
  placementEmail: string;
  affiliations: string;
  developer: string;
  workingHours: string;
  logoUrl?: string;
  faviconUrl?: string;
  mapsUrl?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    instagram?: string;
  };
  aboutTitle?: string;
  aboutText?: string;
  vision?: string;
  mission?: string;
  missions?: string[];
  foundedYear?: string;
}

export const site: SiteSettings = {
  name: "PK College of Engineering & Technology",
  shortName: "PKCET",
  code: "PKET",
  counselingCode: "Counseling code to be announced",
  established: "Founded in 2021",
  foundedYear: "2021",
  tagline: "Technical Education, Innovation & Professional Development",
  location: "Location details will be updated",
  address: "Address to be updated",
  city: "To be updated",
  state: "To be updated",
  pincode: "",
  phone: "Contact details will be updated",
  admissionsPhone: "Admissions contact will be updated",
  email: "Official email will be announced",
  admissionsEmail: "Admissions email will be announced",
  examCellEmail: "Exam cell contact will be announced",
  placementEmail: "Placement cell contact will be announced",
  affiliations: "Affiliation & regulatory approvals will be updated",
  developer: "SPKumar Enterprises",
  workingHours: "Office hours will be updated",
  mapsUrl: "",
  socialLinks: {
    facebook: "",
    twitter: "",
    linkedin: "",
    youtube: "",
    instagram: "",
  },
  aboutTitle: "About the Institution",
  aboutText:
    "PK College of Engineering & Technology is established to impart quality undergraduate technical education with emphasis on fundamentals, laboratory experimentation, and professional discipline. Our academic programs are structured to develop competent engineering professionals equipped to address complex technological challenges.",
  vision:
    "To emerge as a center of technical education and applied research, preparing ethical, innovative, and socially responsible engineering professionals capable of contributing to global technological advancements.",
  missions: [
    "Provide rigorous undergraduate curriculum delivery with strong emphasis on foundational engineering principles and laboratory practicals.",
    "Foster an academic culture of discipline, critical thinking, technical inquiry, and collaborative problem solving.",
    "Collaborate with industries and academic organizations to facilitate experiential learning, technical workshops, and career readiness.",
    "Instill professional ethics, leadership qualities, and environmental consciousness among future engineering graduates.",
  ],
};

export interface HomepageSettings {
  topBannerText: string;
  showTopBanner: boolean;
  heroHeading: string;
  heroSubtitle: string;
  heroPrimaryBtnText: string;
  heroPrimaryBtnLink: string;
  heroSecondaryBtnText: string;
  heroSecondaryBtnLink: string;
  heroImage?: string;
  // Accreditation & Institutional Status Highlight
  institutionStatus: string;
  accreditation: string;
  accreditationDescription: string;
  showAccreditation: boolean;
  homepageHighlight: boolean;
  // About & CTA
  aboutPreviewTitle: string;
  aboutPreviewText: string;
  ctaTitle: string;
  ctaText: string;
}

export const initialHomepage: HomepageSettings = {
  topBannerText: "Admissions Notification for B.Tech Academic Session — Inquire at the Admissions Desk",
  showTopBanner: true,
  heroHeading: "PK College of Engineering & Technology",
  heroSubtitle: "Empowering Next-Generation Engineers with Academic Excellence, Practical Laboratories & Industry-Ready Competencies",
  heroPrimaryBtnText: "Explore Admissions",
  heroPrimaryBtnLink: "/admissions",
  heroSecondaryBtnText: "Undergraduate Programs",
  heroSecondaryBtnLink: "/departments",
  // Accreditation & Institutional Status Defaults
  institutionStatus: "Autonomous",
  accreditation: "NAAC A+",
  accreditationDescription: "Conferred Academic Autonomy by UGC and Accredited with Prestigious Grade A+ by NAAC, recognizing highest benchmarks in engineering curricula, research laboratories, and institutional quality.",
  showAccreditation: true,
  homepageHighlight: true,
  // About & CTA
  aboutPreviewTitle: "A Premier Institution for Engineering & Technical Innovation",
  aboutPreviewText: "Dedicated to academic excellence, state-of-the-art laboratory experimentation, and structured training for rewarding careers in engineering and technology.",
  ctaTitle: "Begin Your Engineering Career at PKCET",
  ctaText: "Explore our undergraduate engineering programs, modern laboratories, and disciplined academic environment.",
};

export const imagery = {
  campusMain,
  campusSunset,
  campusCourtyard,
  electronicsLab,
  workshop,
  library,
  computerLab,
  sports,
};

export interface CollegeStat {
  value: string;
  label: string;
  sub: string;
}

export const collegeStats: CollegeStat[] = [
  { value: "B.Tech", label: "Engineering Disciplines", sub: "Undergraduate degree programs" },
  { value: "T&P", label: "Training & Placement Cell", sub: "Structured career development" },
  { value: "Labs", label: "Department Laboratories", sub: "Practical experimentation facilities" },
  { value: "Library", label: "Knowledge Resource Center", sub: "Reference books & study facilities" },
  { value: "Campus", label: "Academic Infrastructure", sub: "Classrooms & student amenities" },
  { value: "Sports", label: "Physical Education", sub: "Athletic & recreation facilities" },
];

export interface Department {
  code: string;
  slug: string;
  title: string;
  shortTitle: string;
  intake: number;
  established: string;
  hod: {
    name: string;
    designation: string;
    qualification: string;
    experience: string;
    email: string;
  };
  overview: string;
  vision: string;
  mission: string[];
  laboratories: string[];
  keyDomains: string[];
  careerProspects: string[];
  image: string;
}

export const departments: Department[] = [
  {
    code: "01",
    slug: "cse",
    title: "Department of Computer Science & Engineering",
    shortTitle: "Computer Science & Engineering",
    intake: 180,
    established: "To be updated",
    hod: {
      name: "Head of Department",
      designation: "Professor & Head of Department",
      qualification: "Faculty qualifications to be updated",
      experience: "Faculty experience details to be updated",
      email: "Department contact to be updated",
    },
    overview: "The Department of Computer Science & Engineering prepares students for leadership in computing, software architecture, cloud platforms, and algorithmic problem-solving. With departmental computing laboratories and a structured curriculum, students gain hands-on proficiency in modern technologies.",
    vision: "To achieve academic excellence in computing education and research, fostering innovative engineers capable of solving complex societal and technological problems.",
    mission: [
      "Deliver rigorous foundational education in algorithms, software systems, and data structures.",
      "Facilitate active student workshops, hackathons, and technical skill development.",
      "Inculcate research ethics, team leadership, and lifelong learning competencies.",
    ],
    laboratories: [
      "Advanced Computing & Software Laboratory",
      "Web Technologies & Systems Lab",
      "Database Systems & Data Processing Lab",
      "Operating Systems & Network Lab",
      "Project & Innovation Lab",
    ],
    keyDomains: ["Software Engineering", "Cloud Computing", "Web Technologies", "Cybersecurity", "Distributed Systems"],
    careerProspects: ["Software Development Engineer", "Cloud Solutions Associate", "Database Administrator", "DevOps Engineer", "Full Stack Developer"],
    image: computerLab,
  },
  {
    code: "02",
    slug: "ai-ds",
    title: "Department of Artificial Intelligence & Data Science",
    shortTitle: "AI & Data Science",
    intake: 120,
    established: "To be updated",
    hod: {
      name: "Head of Department",
      designation: "Head of Department",
      qualification: "Faculty qualifications to be updated",
      experience: "Faculty experience details to be updated",
      email: "Department contact to be updated",
    },
    overview: "The Department of Artificial Intelligence & Data Science focuses on machine intelligence, statistical data analytics, neural networks, natural language processing, and automated decision systems. Students gain expertise in building data-driven systems for real-world applications.",
    vision: "To cultivate proficient AI engineers and data scientists equipped with cutting-edge analytical skills and ethical perspectives on intelligent computing.",
    mission: [
      "Provide strong theoretical and mathematical foundations in statistical learning and AI algorithms.",
      "Expose undergraduates to modern machine learning frameworks and data engineering tools.",
      "Promote ethical AI practices, interdisciplinary problem solving, and research.",
    ],
    laboratories: [
      "Machine Learning & Neural Networks Lab",
      "Big Data Analytics & Processing Lab",
      "Deep Learning & Computer Vision Lab",
      "Natural Language Processing & Speech Lab",
      "Data Visualization & Business Intelligence Lab",
    ],
    keyDomains: ["Machine Learning", "Deep Learning", "Data Engineering", "Computer Vision", "Natural Language Processing"],
    careerProspects: ["Data Scientist", "Machine Learning Engineer", "Business Intelligence Analyst", "Data Pipeline Engineer", "AI Solutions Developer"],
    image: computerLab,
  },
  {
    code: "03",
    slug: "ece",
    title: "Department of Electronics & Communication Engineering",
    shortTitle: "Electronics & Communication",
    intake: 120,
    established: "To be updated",
    hod: {
      name: "Head of Department",
      designation: "Head of Department",
      qualification: "Faculty qualifications to be updated",
      experience: "Faculty experience details to be updated",
      email: "Department contact to be updated",
    },
    overview: "The Department of Electronics & Communication Engineering bridges hardware and communication technologies. The discipline covers analog and digital circuits, microprocessors, digital signal processing, VLSI design, wireless communications, and Embedded Systems/IoT.",
    vision: "To impart comprehensive education in electronics and communication engineering, inspiring innovation and ethical responsibility.",
    mission: [
      "Foster strong understanding of semiconductor devices, electronic circuits, and signals.",
      "Provide state-of-the-art laboratory experimentation in VLSI, embedded hardware, and communication systems.",
      "Encourage industry-oriented student projects, technical seminars, and research activities.",
    ],
    laboratories: [
      "Analog & Digital Electronics Lab",
      "Microprocessors & Microcontrollers Lab",
      "Digital Signal Processing & Image Processing Lab",
      "VLSI Design & Simulation Lab",
      "Microwave & Optical Communications Lab",
    ],
    keyDomains: ["VLSI Design", "Embedded Systems & IoT", "Wireless Communications", "Signal & Image Processing", "Robotics"],
    careerProspects: ["Embedded Systems Engineer", "VLSI Design Engineer", "Telecom Network Engineer", "Firmware Developer", "Hardware Design Engineer"],
    image: electronicsLab,
  },
  {
    code: "04",
    slug: "eee",
    title: "Department of Electrical & Electronics Engineering",
    shortTitle: "Electrical & Electronics",
    intake: 60,
    established: "To be updated",
    hod: {
      name: "Head of Department",
      designation: "Head of Department",
      qualification: "Faculty qualifications to be updated",
      experience: "Faculty experience details to be updated",
      email: "Department contact to be updated",
    },
    overview: "The Department of Electrical & Electronics Engineering focuses on power systems, renewable energy generation, electrical machines, control engineering, and industrial automation. Students are prepared to manage electrical power grids, smart grids, and electric drive systems.",
    vision: "To produce competent electrical engineers capable of addressing energy challenges and leading sustainable technical transformations.",
    mission: [
      "Deliver rigorous education in electrical circuit theory, power apparatus, and control systems.",
      "Train students in simulation tools and laboratory testing of electrical machines.",
      "Cultivate awareness of energy conservation, clean energy systems, and safety ethics.",
    ],
    laboratories: [
      "Electrical Machines Lab I & II",
      "Power Systems & High Voltage Simulation Lab",
      "Control Systems & Automation Lab",
      "Power Electronics & Drives Lab",
      "Electrical Measurements & Instrumentation Lab",
    ],
    keyDomains: ["Power Systems", "Renewable Energy & Solar Grids", "Power Electronics", "Electric Vehicle Drives", "Industrial Automation"],
    careerProspects: ["Power Grid Engineer", "Renewable Energy Specialist", "Control Systems Engineer", "Substation Maintenance Engineer", "Automation Engineer"],
    image: electronicsLab,
  },
  {
    code: "05",
    slug: "mech",
    title: "Department of Mechanical Engineering",
    shortTitle: "Mechanical Engineering",
    intake: 60,
    established: "To be updated",
    hod: {
      name: "Head of Department",
      designation: "Head of Department",
      qualification: "Faculty qualifications to be updated",
      experience: "Faculty experience details to be updated",
      email: "Department contact to be updated",
    },
    overview: "The Department of Mechanical Engineering encompasses thermal sciences, design engineering, manufacturing technology, robotics, and industrial management. Equipped with heavy machine workshops and computer-aided design laboratories, the department instills practical fabrication and analysis skills.",
    vision: "To deliver superior mechanical engineering education that nurtures creative designers, manufacturers, and researchers.",
    mission: [
      "Impart fundamental and advanced concepts in mechanics, thermodynamics, and materials science.",
      "Provide extensive hands-on experience in machine tools, CAD/CAM, and material testing.",
      "Inspire students towards sustainable manufacturing, automotive systems, and interdisciplinary innovation.",
    ],
    laboratories: [
      "Machine Tools & CNC Machining Lab",
      "Thermal Engineering & Heat Transfer Lab",
      "Strength of Materials & Metallurgy Lab",
      "Fluid Mechanics & Hydraulic Machinery Lab",
      "Computer Aided Design (CAD/CAM) Lab",
    ],
    keyDomains: ["Thermal & Energy Systems", "Design & FEA Simulation", "Advanced Manufacturing", "Automotive Engineering", "Industrial Robotics"],
    careerProspects: ["Mechanical Design Engineer", "Production & Quality Engineer", "Thermal Plant Engineer", "Automotive Specialist", "Manufacturing Consultant"],
    image: workshop,
  },
  {
    code: "06",
    slug: "civil",
    title: "Department of Civil Engineering",
    shortTitle: "Civil Engineering",
    intake: 60,
    established: "To be updated",
    hod: {
      name: "Head of Department",
      designation: "Head of Department",
      qualification: "Faculty qualifications to be updated",
      experience: "Faculty experience details to be updated",
      email: "Department contact to be updated",
    },
    overview: "The Department of Civil Engineering covers structural analysis, geotechnical engineering, surveying, transportation infrastructure, and environmental engineering. Students learn to design, construct, and maintain sustainable public and industrial infrastructure.",
    vision: "To educate ethical civil engineers committed to creating resilient infrastructure and sustainable environments.",
    mission: [
      "Build strong foundations in structural mechanics, soil mechanics, and hydraulics.",
      "Conduct field surveying practicals and material testing under laboratory conditions.",
      "Instill knowledge of green construction practices, environmental protection, and project management.",
    ],
    laboratories: [
      "Structural Engineering & Concrete Technology Lab",
      "Geotechnical & Soil Mechanics Lab",
      "Surveying & Geomatics Lab",
      "Transportation Engineering & Highway Materials Lab",
      "Environmental Engineering Lab",
    ],
    keyDomains: ["Structural Engineering", "Transportation & Highways", "Geotechnical Engineering", "Environmental Engineering", "Construction Management"],
    careerProspects: ["Structural Design Engineer", "Site Construction Engineer", "Geotechnical Consultant", "Transportation Planner", "Project Estimation Engineer"],
    image: workshop,
  },
  {
    code: "07",
    slug: "aiml",
    title: "Department of Artificial Intelligence & Machine Learning",
    shortTitle: "AIML",
    intake: 180,
    established: "To be updated",
    hod: {
      name: "Head of Department",
      designation: "Head of Department",
      qualification: "Faculty qualifications to be updated",
      experience: "Faculty experience details to be updated",
      email: "Department contact to be updated",
    },
    overview: "The Department of Artificial Intelligence & Machine Learning imparts advanced technical education in autonomous systems, deep learning architectures, cognitive computing, and machine perception. Students master modern computing stacks and mathematical frameworks for real-world intelligent systems.",
    vision: "To develop future-ready engineers with superior problem-solving competencies in machine intelligence, cognitive computing, and ethical AI deployment.",
    mission: [
      "Provide an advanced curriculum spanning machine learning mathematical foundations, deep neural models, and algorithmic thinking.",
      "Facilitate practical experimentation in modern GPU-accelerated computing laboratories.",
      "Foster interdisciplinary research, industrial certifications, and societal applications of AI.",
    ],
    laboratories: [
      "AI & Deep Learning Systems Lab",
      "Machine Learning Algorithms Lab",
      "Cognitive Computing & Robotics Lab",
      "Data Analytics & Modeling Lab",
      "High Performance Computing & GPU Lab",
    ],
    keyDomains: ["Artificial Intelligence", "Deep Learning", "Reinforcement Learning", "Computer Vision", "Natural Language Processing"],
    careerProspects: ["AI Research Engineer", "Machine Learning Specialist", "Computer Vision Engineer", "Data Intelligence Architect", "Automation Systems Developer"],
    image: computerLab,
  },
];

export interface Announcement {
  id: string;
  title: string;
  date: string;
  category: "Academic" | "Examinations" | "Admissions" | "General" | "Placements";
  summary: string;
  content: string;
  details?: string;
  isUrgent?: boolean;
}

export const initialAnnouncements: Announcement[] = [
  {
    id: "ann-01",
    title: "B.Tech Admissions Process Guidelines — Notification for Academic Session",
    date: "2026-09-20",
    category: "Admissions",
    summary: "Information for candidates seeking admission under Convener Quota (Category-A) and Institutional Quota (Category-B).",
    content: "Eligible candidates are advised to consult the Admissions Desk regarding counseling guidelines, branch options, and documents required during physical verification. State web counseling codes and reporting schedules are subject to official council notifications.",
    isUrgent: true,
  },
  {
    id: "ann-02",
    title: "Mid-Semester Internal Evaluation Schedule Notification",
    date: "2026-09-15",
    category: "Examinations",
    summary: "Detailed timetable for Mid-I Examinations published for all undergraduate engineering branches.",
    content: "Students across all departments are required to review the timetable posted on the departmental notice boards. Minimum 75% attendance is compulsory to appear for the evaluation assessments.",
    isUrgent: false,
  },
  {
    id: "ann-03",
    title: "Training & Placement Readiness Sessions and Aptitude Modules",
    date: "2026-09-12",
    category: "Placements",
    summary: "Pre-placement training sessions commencing for pre-final and final year engineering students.",
    content: "The Training & Placement Cell announces the commencement of quantitative aptitude, logical reasoning, and technical interview preparation modules. Registered students must attend as per their branch schedule.",
    isUrgent: false,
  },
  {
    id: "ann-04",
    title: "Central Digital Library E-Resource & Book Bank Distribution",
    date: "2026-09-08",
    category: "Academic",
    summary: "Issue of semester textbooks under Book Bank scheme and renewal of digital library access accounts.",
    content: "Students may collect prescribed semester reference textbooks from the Central Library circulation counter between 9:30 AM and 4:00 PM on designated branch days.",
    isUrgent: false,
  },
  {
    id: "ann-05",
    title: "Statutory Anti-Ragging Committee Notification & Helpline",
    date: "2026-09-01",
    category: "General",
    summary: "Strict compliance of statutory anti-ragging measures across campus and residential hostels.",
    content: "PK College of Engineering & Technology enforces a zero-tolerance policy towards ragging. Any violation shall invite stringent disciplinary and legal action as per statutory regulatory norms.",
    isUrgent: true,
  },
];

export interface CollegeEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  category: "Technical" | "Workshop" | "Sports" | "Cultural" | "Academic";
  description: string;
  registrationOpen: boolean;
  image: string;
}

export const initialEvents: CollegeEvent[] = [
  {
    id: "evt-01",
    title: "Annual National Level Technical Symposium",
    date: "October 18-19, 2026",
    time: "9:30 AM - 4:30 PM",
    venue: "Main Auditorium & Departmental Seminar Halls",
    category: "Technical",
    description: "Annual technical festival featuring Paper Presentations, Codeathons, Robotics Arena, and Circuit Debugging contests across engineering departments.",
    registrationOpen: true,
    image: computerLab,
  },
  {
    id: "evt-02",
    title: "Industry Technology Workshop: Modern Software Systems & Cloud Concepts",
    date: "October 28, 2026",
    time: "10:00 AM - 3:30 PM",
    venue: "Central Computing Center",
    category: "Workshop",
    description: "Interactive technical workshop covering modern software development practices, container architectures, and scalable computing concepts.",
    registrationOpen: true,
    image: computerLab,
  },
  {
    id: "evt-03",
    title: "Campus Placement Readiness & Career Orientation Seminar",
    date: "November 05, 2026",
    time: "9:00 AM - 5:00 PM",
    venue: "Placement Seminar Hall",
    category: "Workshop",
    description: "Career guidance seminar on interview preparation, resume creation, and technical evaluation expectations.",
    registrationOpen: true,
    image: library,
  },
  {
    id: "evt-04",
    title: "Annual Inter-Departmental Sports & Athletic Meet",
    date: "November 14-16, 2026",
    time: "8:00 AM - 6:00 PM",
    venue: "Central Sports Ground",
    category: "Sports",
    description: "Annual athletic competitions covering Cricket, Volleyball, Basketball, Badminton, and Track & Field events for student contingents.",
    registrationOpen: false,
    image: sports,
  },
  {
    id: "evt-05",
    title: "Annual Cultural Fest & Student Talent Day",
    date: "December 22, 2026",
    time: "4:00 PM - 9:30 PM",
    venue: "Campus Amphitheatre",
    category: "Cultural",
    description: "Celebration of student cultural talent featuring music, dance performances, drama, literary events, and fine arts exhibitions.",
    registrationOpen: false,
    image: campusCourtyard,
  },
];

export interface CollegeFacility {
  id: string;
  title: string;
  tagline: string;
  description: string;
  keyFeatures: string[];
  image: string;
  published?: boolean | undefined;
}

export type Facility = CollegeFacility;

export const collegeFacilities: CollegeFacility[] = [
  {
    id: "fac-library",
    title: "Central Digital Library & Information Centre",
    tagline: "A comprehensive repository of scientific, engineering, and technological knowledge",
    description: "The central library provides access to reference engineering textbooks, printed national journals, digital resources, and dedicated quiet study spaces for students and faculty.",
    keyFeatures: [
      "Open access lending system with cataloged book collections",
      "Digital library wing with computer terminals for online study",
      "Subscriptions to engineering e-journals and technical papers",
      "Spacious quiet reading hall for students",
      "Book bank facility for eligible students",
    ],
    image: library,
  },
  {
    id: "fac-computing",
    title: "Central Computing Center",
    tagline: "Computational backbone and campus network infrastructure",
    description: "Equipped with modern networked desktop machines, dedicated laboratory servers, high-speed internet connectivity, and licensed engineering software tools.",
    keyFeatures: [
      "High-speed campus network connectivity",
      "UPS power backup supporting practical examinations",
      "Licensed programming environments and design tools",
      "Dedicated computing practical halls",
    ],
    image: computerLab,
  },
  {
    id: "fac-electronics",
    title: "Electronics & Embedded Systems Hub",
    tagline: "Hands-on circuit design, microcontrollers, and signal analysis",
    description: "Furnished with digital storage oscilloscopes, signal generators, microcontroller development kits, and sensor suites for experimental circuit validation.",
    keyFeatures: [
      "Circuit design and simulation software suites",
      "Dedicated clean workbenches with safety protection",
      "Embedded micro-controller prototyping boards",
      "Communication and antenna testing apparatus",
    ],
    image: electronicsLab,
  },
  {
    id: "fac-workshop",
    title: "Central Engineering Workshop",
    tagline: "Hands-on manufacturing, mechanical fabrication, and physical modeling",
    description: "Houses lathe machines, shaping and grinding equipment alongside dedicated carpentry, fitting, welding, and foundry bays where students learn hands-on fabrication.",
    keyFeatures: [
      "Turning and milling machines for practical instruction",
      "Dedicated welding stations with protective equipment",
      "Universal testing and material characterization apparatus",
      "Foundry and casting demonstration bays",
    ],
    image: workshop,
  },
  {
    id: "fac-sports",
    title: "Central Sports Arena & Fitness Facilities",
    tagline: "Fostering physical endurance, sportsmanship, and teamwork",
    description: "Features outdoor grounds for cricket and football, athletic track spaces, outdoor basketball and volleyball courts, indoor badminton facilities, and table tennis.",
    keyFeatures: [
      "Physical education staff coordinating sports activities",
      "Inter-collegiate tournament participation facilities",
      "Recreational games for boys and girls",
      "Regular health and wellness fitness sessions",
    ],
    image: sports,
  },
  {
    id: "fac-campus",
    title: "Classrooms & Department Seminar Halls",
    tagline: "Interactive learning spaces designed for acoustic clarity and engagement",
    description: "Lecture halls are equipped with multimedia projectors, interactive whiteboards, comfortable ergonomic seating, and audio support for technical presentations.",
    keyFeatures: [
      "Auditorium for college assemblies and symposia",
      "Departmental seminar halls for guest lectures",
      "Audio-visual equipment in all instructional blocks",
      "Generator power backup for uninterrupted academic work",
    ],
    image: campusMain,
  },
  {
    id: "fac-hostels",
    title: "Residential Hostels & Student Living",
    tagline: "Secure, hygienic, and supportive living environment on campus",
    description: "Separate on-campus residential hostel blocks for boys and girls with security surveillance, resident wardens, hygienic dining halls, and study areas.",
    keyFeatures: [
      "Spacious rooms with study desks and wardrobes",
      "Purified drinking water plants on every floor",
      "Indoor recreation rooms and reading sections",
      "First-aid and emergency medical support",
    ],
    image: campusCourtyard,
  },
  {
    id: "fac-transport",
    title: "College Fleet & Transportation Network",
    tagline: "Safe transit connecting city centers and surrounding regions",
    description: "A fleet of college buses operates across designated transit routes ensuring convenient travel for day-scholar students and faculty.",
    keyFeatures: [
      "Route coverage across primary transit junctions",
      "Experienced drivers following road safety standards",
      "Dedicated bus stop pickup and drop points",
      "College transport pass facility for students",
    ],
    image: campusMain,
  },
];

export interface HighestPackageFeature {
  packageAmount: string; // e.g. "12 LPA"
  currency: string; // e.g. "₹"
  placementYear: string; // e.g. "2025"
  studentName: string;
  department: string;
  program: string;
  batchYear: string;
  companyName: string;
  studentPhoto?: string;
  photoPublicId?: string;
  description?: string;
  achievementDescription?: string;
  isVisible: boolean;
}

export interface RecruiterCompany {
  id: string;
  name: string;
  logo?: string;
  logoUrl?: string;
  logoPublicId?: string;
  placementYear?: string;
  description?: string;
  websiteUrl?: string;
  displayOrder?: number;
  isVisible: boolean;
}

export interface PlacementGalleryItem {
  id: string;
  image?: string;
  imageUrl?: string;
  publicId?: string;
  title: string;
  description?: string;
  category: string;
  placementYear?: string;
  year?: string;
  displayOrder?: number;
  isVisible: boolean;
}

export interface StudentPlacementAchievement {
  id: string;
  studentName: string;
  rollNumber?: string;
  department: string;
  program?: string;
  batchYear?: string;
  companyName: string;
  packageAmount: string;
  currency?: string;
  roleDesignation?: string;
  placementYear: string;
  studentPhoto?: string;
  photoPublicId?: string;
  achievementDescription?: string;
  displayOrder?: number;
  isVisible: boolean;
}

export interface PlacementYearStat {
  id: string;
  year: string;
  studentsPlaced?: string | number;
  studentsEligible?: string | number;
  placementPercentage?: string | number;
  highestPackage?: string;
  highestPackageCurrency?: string;
  averagePackage?: string;
  medianPackage?: string;
  companiesCount?: string | number;
  notes?: string;
  description?: string;
  isFeatured?: boolean;
}

export interface PlacementData {
  overviewHeading?: string;
  overviewDescription?: string;
  highestPackage?: HighestPackageFeature;
  yearlyStats?: PlacementYearStat[];
  achievements?: StudentPlacementAchievement[];
  companies?: RecruiterCompany[];
  gallery?: PlacementGalleryItem[];
  recruiters: (string | RecruiterCompany)[];
  trainingRoadmap: {
    year: string;
    focus: string;
    modules: string[];
  }[];
  placementProcedure: string[];
  contactPerson: {
    name: string;
    designation: string;
    email: string;
    phone: string;
  };
  highlights?: string[];
}

export const placementDetails: PlacementData = {
  overviewHeading: "Campus Placement Highlights & Career Opportunities",
  overviewDescription: "The Training & Placement Cell facilitates industry readiness through continuous technical training, coding assessments, and campus recruitment drives.",
  highestPackage: {
    packageAmount: "",
    currency: "₹",
    placementYear: "",
    studentName: "",
    department: "",
    program: "B.Tech",
    batchYear: "",
    companyName: "",
    studentPhoto: "",
    photoPublicId: "",
    description: "",
    isVisible: true,
  },
  yearlyStats: [],
  achievements: [],
  companies: [],
  gallery: [],
  recruiters: [],
  trainingRoadmap: [
    {
      year: "I Year (Foundation)",
      focus: "Communication & Analytical Orientation",
      modules: ["English language communication practice", "Logical reasoning fundamentals", "Public speaking & presentation dynamics", "Basic programming logic"],
    },
    {
      year: "II Year (Skill Building)",
      focus: "Data Structures & Core Engineering Concepts",
      modules: ["Object-Oriented Programming principles", "Quantitative aptitude modules", "Relational database concepts", "Mini-projects in core engineering"],
    },
    {
      year: "III Year (Specialization)",
      focus: "Applied Technologies & Technical Problem Solving",
      modules: ["Full stack development & cloud concepts", "Algorithmic problem solving", "Technical certification support", "Mock technical interviews & resume guidance"],
    },
    {
      year: "IV Year (Recruitment)",
      focus: "Campus Placement Drives & Corporate Preparation",
      modules: ["Technical mock interview panels", "Company test patterns and mock assessments", "Core domain interview practice", "Internship facilitation"],
    },
  ],
  placementProcedure: [
    "Invitation sent to corporate HR teams and placement partners with batch demographics.",
    "Companies confirm eligibility criteria, job description, and pre-placement talk (PPT) dates.",
    "Eligible candidates register on the internal T&P placement portal.",
    "Pre-placement talk followed by online aptitude, coding, or technical rounds.",
    "Shortlisted candidates face technical, managerial, and HR interviews.",
    "Final selection offers issued through the Training & Placement Cell.",
  ],
  contactPerson: {
    name: "Training & Placement Officer",
    designation: "Head - Training & Placements",
    email: "Placement cell contact will be updated",
    phone: "Contact details will be updated",
  },
  highlights: [],
};

export interface Leadership {
  principal: {
    name: string;
    title: string;
    qualifications: string;
    experience: string;
    message: string;
    keyPoints: string[];
  };
  chairman: {
    name: string;
    title: string;
    message: string;
  };
}

export const leadership: Leadership = {
  principal: {
    name: "Principal's Desk",
    title: "Principal, PK College of Engineering & Technology",
    qualifications: "Administrative details to be updated",
    experience: "Academic administration and technical education leadership.",
    message: "Welcome to PK College of Engineering & Technology, an institution dedicated to technical education, disciplined inquiry, and ethical professional values.\n\nOur campus provides an academic environment where theoretical principles are reinforced through hands-on laboratory experimentation. In an era marked by rapid technological advances, engineering education must combine strong fundamentals with practical problem-solving competence.\n\nAt PKCET, students are guided through structured academic curricula, laboratory practicals, and career readiness programs. We encourage curiosity, technical discipline, and collaborative learning to prepare our graduates for fulfilling careers in engineering and technology.",
    keyPoints: [
      "Outcome-based engineering curriculum delivery",
      "Regular laboratory practical sessions and project work",
      "Student participation in technical workshops and seminars",
      "Commitment to academic discipline and institutional ethics",
    ],
  },
  chairman: {
    name: "Governing Body / Management",
    title: "Governing Council, PK College of Engineering & Technology",
    message: "Our vision is to provide quality technical education accessible to aspiring engineering students. We continue to invest in laboratories, classroom infrastructure, and student amenities to foster an enriching educational atmosphere.",
  },
};

export const admissionsInfo = {
  programsOffered: [
    { code: "CSE", name: "Computer Science & Engineering", seats: 180, duration: "4 Years (8 Semesters)" },
    { code: "AI&DS", name: "Artificial Intelligence & Data Science", seats: 120, duration: "4 Years (8 Semesters)" },
    { code: "AIML", name: "Artificial Intelligence & Machine Learning", seats: 180, duration: "4 Years (8 Semesters)" },
    { code: "ECE", name: "Electronics & Communication Engineering", seats: 120, duration: "4 Years (8 Semesters)" },
    { code: "EEE", name: "Electrical & Electronics Engineering", seats: 60, duration: "4 Years (8 Semesters)" },
    { code: "MECH", name: "Mechanical Engineering", seats: 60, duration: "4 Years (8 Semesters)" },
    { code: "CIVIL", name: "Civil Engineering", seats: 60, duration: "4 Years (8 Semesters)" },
  ],
  eligibility: {
    btechFirstYear: "Eligibility criteria, minimum qualifying marks in 10+2 (Mathematics, Physics, Chemistry) and entrance test qualifications are governed by the statutory rules of the competent state admissions authority.",
    lateralEntry: "Diploma holders seeking direct admission into second year (3rd semester) must fulfill the requirements prescribed by the state technical education council.",
    categoryB: "Admissions under institutional quota are conducted in accordance with the statutory guidelines and eligibility criteria notified by the competent authority.",
  },
  documentsRequired: [
    "Qualifying Examination Hall Ticket & Rank Card",
    "SSC / 10th Class Marks Memorandum (Original & copies)",
    "Intermediate / 10+2 (or Diploma) Marks Memorandum",
    "Transfer Certificate (T.C.) & Study / Conduct Certificates",
    "Category / Reservation Certificate (if applicable as per state rules)",
    "Government Identification (Aadhaar Card) of student and parent",
    "Recent Passport size photographs",
    "Migration Certificate (where applicable)",
  ],
  importantSteps: [
    { step: "01", title: "Review Guidelines", desc: "Check eligibility criteria and required qualifying entrance benchmarks." },
    { step: "02", title: "Submit Enquiry", desc: "Submit the online enquiry form or visit the college admissions desk." },
    { step: "03", title: "Counseling Allocation", desc: "Participate in state counseling with PK College of Engineering & Technology option." },
    { step: "04", title: "Document Verification", desc: "Report at the college desk with allotment documents for verification." },
  ],
};

export type GalleryCategory =
  | "Campus"
  | "Laboratories"
  | "Sports"
  | "Academic Spaces"
  | "Library"
  | "Events"
  | "Cultural"
  | "Technical Events"
  | "Departments"
  | "Other";

export interface GalleryItem {
  id: number | string;
  title: string;
  category: GalleryCategory;
  image: string;
  alt: string;
  description?: string;
  usedIn?: string;
}

export const gallery: GalleryItem[] = [
  { id: 1, title: "PKCET Academic Block & Main Entrance", category: "Campus", image: campusMain, alt: "PK College of Engineering & Technology main campus facade", usedIn: "Homepage → Campus Section" },
  { id: 2, title: "Central Digital Library & Study Hall", category: "Library", image: library, alt: "Central Library at PKCET", usedIn: "Facilities → Library" },
  { id: 3, title: "Department Computing Laboratory", category: "Laboratories", image: computerLab, alt: "Computing laboratory at PKCET", usedIn: "Departments → CSE → Laboratory" },
  { id: 4, title: "Electronics & Microcontroller Practical Hub", category: "Laboratories", image: electronicsLab, alt: "Electronics laboratory equipment", usedIn: "Departments → ECE → Laboratory" },
  { id: 5, title: "Mechanical Workshop & Machining Equipment", category: "Laboratories", image: workshop, alt: "Mechanical engineering workshop", usedIn: "Departments → Mechanical → Laboratory" },
  { id: 6, title: "Central Sports Ground & Athletic Field", category: "Sports", image: sports, alt: "Sports ground at PKCET", usedIn: "Campus Life → Sports Grounds" },
  { id: 7, title: "Academic Courtyard & Campus Grounds", category: "Campus", image: campusCourtyard, alt: "Green courtyard inside PKCET engineering campus", usedIn: "Homepage → Campus Section" },
  { id: 8, title: "Computer Workstations & Study Terminals", category: "Academic Spaces", image: computerLab, alt: "Classroom and computer workstations", usedIn: "Facilities → Computing Center" },
];

export interface AdmissionEnquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  branch: string;
  qualification: string;
  city: string;
  message?: string;
  submittedAt: string;
  status: "Pending" | "Contacted" | "Enrolled" | "Closed";
}
