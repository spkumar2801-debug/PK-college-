import campusMain from "@/assets/campus-main.jpg";
import campusCourtyard from "@/assets/campus-courtyard.jpg";
import electronicsLab from "@/assets/lab-electronics.jpg";
import workshop from "@/assets/workshop.jpg";

export const site = {
  name: "PK Technology of Engineering",
  shortName: "PK Technology",
  location: "Vijayawada outskirts, Andhra Pradesh, India",
  email: "pksomething1234567@gmail.com",
  developer: "SPKumar Enterprises",
};

export const imagery = { campusMain, campusCourtyard, electronicsLab, workshop };

export type Department = { code: string; title: string; description: string; focus: string; image: string };
export const departments: Department[] = [
  { code: "01", title: "Computer Science & Engineering", description: "Explore computation, software systems, and emerging technologies through a practical engineering lens.", focus: "Computing & systems", image: electronicsLab },
  { code: "02", title: "Electronics & Communication", description: "Study circuits, communication systems, and the technologies that connect our world.", focus: "Circuits & communication", image: electronicsLab },
  { code: "03", title: "Mechanical Engineering", description: "Bring ideas into the physical world through design, manufacturing, and applied mechanics.", focus: "Design & manufacturing", image: workshop },
  { code: "04", title: "Civil Engineering", description: "Build a foundation in structures, materials, and the infrastructure of tomorrow.", focus: "Structures & infrastructure", image: campusCourtyard },
];

export type GalleryItem = { id: number; title: string; category: "Campus" | "Laboratories" | "Learning Spaces"; image: string; alt: string };
export const gallery: GalleryItem[] = [
  { id: 1, title: "A place to begin", category: "Campus", image: campusMain, alt: "Illustrative rendering of a contemporary engineering campus entrance" },
  { id: 2, title: "Courtyard perspectives", category: "Campus", image: campusCourtyard, alt: "Illustrative rendering of a landscaped academic courtyard" },
  { id: 3, title: "Ideas in motion", category: "Laboratories", image: electronicsLab, alt: "Illustrative rendering of an electronics engineering laboratory" },
  { id: 4, title: "Made to build", category: "Laboratories", image: workshop, alt: "Illustrative rendering of a mechanical engineering workshop" },
  { id: 5, title: "Space to think", category: "Learning Spaces", image: campusCourtyard, alt: "Illustrative rendering of an open campus learning space" },
  { id: 6, title: "Tools for discovery", category: "Learning Spaces", image: electronicsLab, alt: "Illustrative rendering of a hands-on learning laboratory" },
];

export type Achievement = { id: string; title: string; description: string; year: string; category: string; image: string; status: "draft" | "published" };
export const achievements: Achievement[] = [];
export type Placement = { year: string; highestPackage?: string; averagePackage?: string; recruiters: string[]; stories: { name: string; quote: string }[]; status: "draft" | "published" };
export const placements: Placement[] = [];
export type Event = { id: string; title: string; date: string; time: string; location: string; description: string; image?: string; registrationUrl?: string; status: "upcoming" | "past" | "draft" };
export const events: Event[] = [];
export type Announcement = { id: string; title: string; summary: string; content: string; date: string; category: string; image?: string; status: "draft" | "published" };
export const announcements: Announcement[] = [];
