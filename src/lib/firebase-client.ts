/**
 * Centralized Firebase Client Services
 * Re-exports initialized auth, db, and storage services.
 */
export {
  app,
  auth,
  db,
  storage,
  getFirebaseServices,
  firebaseConfig,
  isFirebaseConfigured,
  collectionNames,
  type FirebaseServices,
} from "./firebase";
