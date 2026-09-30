import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

/**
 * Centralized Firebase Web configuration for PK College of Engineering & Technology
 * Project ID: pk-college-74f41
 */
export const firebaseConfig = {
  apiKey: import.meta.env["VITE_FIREBASE_API_KEY"] || "AIzaSyAHz_DaY8K850y9rf997ZerksRrAlzg99c",
  authDomain: import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"] || "pk-college-74f41.firebaseapp.com",
  projectId: import.meta.env["VITE_FIREBASE_PROJECT_ID"] || "pk-college-74f41",
  storageBucket: import.meta.env["VITE_FIREBASE_STORAGE_BUCKET"] || "pk-college-74f41.firebasestorage.app",
  messagingSenderId: import.meta.env["VITE_FIREBASE_MESSAGING_SENDER_ID"] || "1013832303083",
  appId: import.meta.env["VITE_FIREBASE_APP_ID"] || "1:1013832303083:web:c967a92a4a6ab0b72d99ae",
  measurementId: import.meta.env["VITE_FIREBASE_MEASUREMENT_ID"] || "G-SS2QJ1RR5G",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

// Centralized SDK service instances
export const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
// Configure fail-fast retry limits (12s instead of Firebase SDK's default 10 minutes)
// so that offline, unprovisioned, or blocked storage operations fail promptly with clear errors
try {
  storage.maxUploadRetryTime = 12000;
  storage.maxOperationRetryTime = 10000;
} catch (e) {
  // Ignore in environments where properties are read-only
}

export interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
}

export function getFirebaseServices(): FirebaseServices {
  return { app, auth, db, storage };
}

export const collectionNames = {
  siteSettings: "siteSettings",
  about: "about",
  academics: "academics",
  achievements: "achievements",
  placements: "placements",
  gallery: "gallery",
  events: "events",
  announcements: "announcements",
  departments: "departments",
  facilities: "facilities",
  homepage: "homepage",
  enquiries: "enquiries",
  admins: "admins",
} as const;
