import campusMain from "@/assets/campus-main.jpg";
import campusCourtyard from "@/assets/campus-courtyard.jpg";
import electronicsLab from "@/assets/lab-electronics.jpg";
import workshop from "@/assets/workshop.jpg";

/**
 * Public site content. Every record here is placeholder copy structured so it
 * can later be replaced by Firestore documents managed from the admin panel.
 * Do not add accreditation, rankings, affiliations or statistics until the
 * college confirms them.
 */
export const site = {
  name: "PK College of Engineering & Technology",
  shortName: "PK College",
  initials: "PK",
  tagline: "B.Tech programmes · Vijayawada",
  location: "Vijayawada outskirts, Andhra Pradesh, India",
  email: "pksomething1234567@gmail.com",
  phone: "To be announced",
  officeHours: "Mon – Sat, 9:30 am – 4:30 pm",
  developer: "SPKumar Enterprises",
};

export const imagery = { campusMain, campusCourtyard, electronicsLab, workshop };

export const mainNav = [
  { label: "About", to: "/about" },
  { label: "Academics", to: "/academics" },
  { label: "Departments", to: "/departments" },
  { label: "Admissions", to: "/admissions" },
  { label: "Placements", to: "/placements" },
  { label: "Campus Life", to: "/campus-life" },
  { label: "Gallery", to: "/gallery" },
  { label: "Events", to: "/events" },
  { label: "Announcements", to: "/announcements" },
  { label: "Contact", to: "/contact" },
] as const;

export type Faculty = { name: string; designation: string; qualification: string };
export type Department = {
  slug: string;
  code: string;
  title: string;
  summary: string;
  introduction: string;
  image: string;
  hod: { name: string; qualification: string; email?: string } | null;
  faculty: Faculty[];
  programs: { name: string; duration: string }[];
  laboratories: string[];
  infrastructure: string[];
  achievements: string[];
  events: string[];
  contactEmail?: string;
};

const labsPending = ["Laboratory list to be published by the department"];

export const departments: Department[] = [
  {
    slug: "cse", code: "CSE", title: "Computer Science & Engineering", image: electronicsLab,
    summary: "Programming, data structures, operating systems, networks and software engineering.",
    introduction: "The department covers the foundations of computing — algorithms, systems and software design — alongside project work that asks students to build and test real programs.",
    hod: null, faculty: [], programs: [{ name: "B.Tech in Computer Science & Engineering", duration: "4 years" }],
    laboratories: ["Programming laboratory", "Data structures laboratory", "Networks laboratory"],
    infrastructure: ["Computer laboratories", "Department seminar room"], achievements: [], events: [],
  },
  {
    slug: "ai-ds", code: "AI & DS", title: "Artificial Intelligence & Data Science", image: electronicsLab,
    summary: "Statistics, machine learning, data engineering and applied AI.",
    introduction: "Students study mathematics and programming first, then apply them to data analysis, machine learning and responsible use of AI systems.",
    hod: null, faculty: [], programs: [{ name: "B.Tech in Artificial Intelligence & Data Science", duration: "4 years" }],
    laboratories: labsPending, infrastructure: ["Computing laboratory"], achievements: [], events: [],
  },
  {
    slug: "ece", code: "ECE", title: "Electronics & Communication Engineering", image: electronicsLab,
    summary: "Analog and digital circuits, signals, communication systems and embedded devices.",
    introduction: "Coursework moves from circuit theory to communication and embedded systems, with regular bench work in electronics laboratories.",
    hod: null, faculty: [], programs: [{ name: "B.Tech in Electronics & Communication Engineering", duration: "4 years" }],
    laboratories: ["Electronic devices & circuits laboratory", "Digital electronics laboratory"], infrastructure: ["Electronics laboratories"], achievements: [], events: [],
  },
  {
    slug: "eee", code: "EEE", title: "Electrical & Electronics Engineering", image: electronicsLab,
    summary: "Electrical machines, power systems, control and power electronics.",
    introduction: "The programme covers generation, transmission and use of electrical energy, with laboratory practice on machines and control systems.",
    hod: null, faculty: [], programs: [{ name: "B.Tech in Electrical & Electronics Engineering", duration: "4 years" }],
    laboratories: ["Electrical machines laboratory"], infrastructure: labsPending, achievements: [], events: [],
  },
  {
    slug: "mechanical", code: "MECH", title: "Mechanical Engineering", image: workshop,
    summary: "Thermal engineering, design, manufacturing and machine workshop practice.",
    introduction: "Students learn how machines are designed, analysed and made, spending time in the workshop alongside classroom study.",
    hod: null, faculty: [], programs: [{ name: "B.Tech in Mechanical Engineering", duration: "4 years" }],
    laboratories: ["Workshop", "Thermal engineering laboratory"], infrastructure: ["Central workshop"], achievements: [], events: [],
  },
  {
    slug: "civil", code: "CIVIL", title: "Civil Engineering", image: campusCourtyard,
    summary: "Structures, surveying, construction materials and environmental engineering.",
    introduction: "The department prepares students to plan, design and supervise infrastructure, with surveying and materials testing as core practical work.",
    hod: null, faculty: [], programs: [{ name: "B.Tech in Civil Engineering", duration: "4 years" }],
    laboratories: ["Surveying laboratory", "Materials testing laboratory"], infrastructure: labsPending, achievements: [], events: [],
  },
];

export const strengths = [
  { title: "Laboratory-first teaching", text: "Each core subject is paired with scheduled laboratory hours, so theory is tested at the bench." },
  { title: "Faculty mentoring", text: "Students are assigned a faculty mentor who follows academic progress through the four years." },
  { title: "Training & placement cell", text: "Aptitude, communication and interview preparation begin well before the final year." },
  { title: "Project-based final year", text: "Every student completes a supervised project that is reviewed and presented." },
];

export const facilities = [
  { title: "Laboratories", text: "Department laboratories for computing, electronics, electrical machines, workshop and materials testing.", image: electronicsLab },
  { title: "Library", text: "Reference books, textbooks and journals with reading space for individual study.", image: campusCourtyard },
  { title: "Classrooms", text: "Lecture halls and tutorial rooms equipped for teaching and presentations.", image: campusMain },
  { title: "Sports", text: "Grounds and indoor facilities for recreation and inter-college events.", image: campusCourtyard },
  { title: "Hostel", text: "Residential accommodation details will be published by the administration.", image: campusMain },
  { title: "Transportation", text: "College bus routes from Vijayawada and nearby areas to be announced.", image: workshop },
];

export type GalleryItem = { id: number; title: string; category: "Campus" | "Laboratories" | "Learning Spaces"; image: string; alt: string };
export const gallery: GalleryItem[] = [
  { id: 1, title: "Main academic block", category: "Campus", image: campusMain, alt: "Illustrative rendering of an engineering campus entrance" },
  { id: 2, title: "Central courtyard", category: "Campus", image: campusCourtyard, alt: "Illustrative rendering of a landscaped academic courtyard" },
  { id: 3, title: "Electronics laboratory", category: "Laboratories", image: electronicsLab, alt: "Illustrative rendering of an electronics laboratory" },
  { id: 4, title: "Mechanical workshop", category: "Laboratories", image: workshop, alt: "Illustrative rendering of a mechanical workshop" },
  { id: 5, title: "Open study areas", category: "Learning Spaces", image: campusCourtyard, alt: "Illustrative rendering of an open campus learning space" },
  { id: 6, title: "Practical sessions", category: "Learning Spaces", image: electronicsLab, alt: "Illustrative rendering of a hands-on laboratory session" },
];

export type Achievement = { id: string; title: string; description: string; year: string; category: string; image: string; status: "draft" | "published" };
export const achievements: Achievement[] = [];
export type Placement = { year: string; highestPackage?: string; averagePackage?: string; recruiters: string[]; stories: { name: string; quote: string }[]; status: "draft" | "published" };
export const placements: Placement[] = [];
export type Event = { id: string; title: string; date: string; time: string; location: string; description: string; image?: string; registrationUrl?: string; status: "upcoming" | "past" | "draft" };
export const events: Event[] = [];
export type Announcement = { id: string; title: string; summary: string; content: string; date: string; category: string; image?: string; status: "draft" | "published" };
export const announcements: Announcement[] = [];
