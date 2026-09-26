/** Firebase client foundation. Set VITE_FIREBASE_* values when a project is provisioned.
 * Do not use this module as an authorization gate: enforce admin roles in Firestore rules.
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId);
export const collectionNames = {
  siteSettings: "siteSettings", about: "about", academics: "academics", achievements: "achievements",
  placements: "placements", gallery: "gallery", events: "events", announcements: "announcements", admins: "admins",
} as const;
