/** Firebase client foundation. Set VITE_FIREBASE_* values when a project is provisioned.
 * Do not use this module as an authorization gate: enforce admin roles in Firestore rules.
 */
const env = import.meta.env as unknown as Record<string, string | undefined>;
export const firebaseConfig = {
  apiKey: env["VITE_FIREBASE_API_KEY"],
  authDomain: env["VITE_FIREBASE_AUTH_DOMAIN"],
  projectId: env["VITE_FIREBASE_PROJECT_ID"],
  storageBucket: env["VITE_FIREBASE_STORAGE_BUCKET"],
  messagingSenderId: env["VITE_FIREBASE_MESSAGING_SENDER_ID"],
  appId: env["VITE_FIREBASE_APP_ID"],
};
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId);
export const collectionNames = {
  colleges: "colleges", departments: "departments", faculty: "faculty", courses: "courses",
  announcements: "announcements", events: "events", gallery: "gallery", placements: "placements",
  facilities: "facilities", contact: "contact", homepage: "homepage", admins: "admins",
} as const;
