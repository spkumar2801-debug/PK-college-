import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAHz_DaY8K850y9rf997ZerksRrAlzg99c",
  authDomain: "pk-college-74f41.firebaseapp.com",
  projectId: "pk-college-74f41",
  storageBucket: "pk-college-74f41.firebasestorage.app",
  messagingSenderId: "1013832303083",
  appId: "1:1013832303083:web:c967a92a4a6ab0b72d99ae",
};

// Admin App
const adminApp = initializeApp(firebaseConfig, "cms-admin-test");
const adminAuth = getAuth(adminApp);
const adminDb = getFirestore(adminApp);

// Public App (unauthenticated reader)
const publicApp = initializeApp(firebaseConfig, "cms-public-test");
const publicDb = getFirestore(publicApp);

async function runLiveCmsTest() {
  console.log("=== PHASE 17 — LIVE CMS TEST ===");
  
  // 1. Authenticate Admin
  console.log("1. Authenticating admin...");
  const cred = await signInWithEmailAndPassword(adminAuth, 'admin@pk-college.edu.in', 'Admin@pkcet2026!');
  console.log("Admin authenticated successfully, UID:", cred.user.uid);
  
  // 2. Fetch original homepage content
  const homeRef = doc(adminDb, "homepage", "content");
  const origSnap = await getDoc(homeRef);
  const origData = origSnap.data() || {};
  const origHeading = origData.heroHeading || "PK College of Engineering & Technology";
  console.log("Original heroHeading:", origHeading);
  
  // 3. Admin modifies hero heading to "CMS LIVE TEST"
  console.log("2. Admin updating heroHeading to: 'CMS LIVE TEST'...");
  await setDoc(homeRef, { heroHeading: "CMS LIVE TEST", updatedAt: Date.now() }, { merge: true });
  console.log("Firestore setDoc completed.");
  
  // 4. Verify Firestore document changed via public unauthenticated reader
  console.log("3. Public unauthenticated client reading from Firestore...");
  const pubSnap = await getDoc(doc(publicDb, "homepage", "content"));
  const pubHeading = pubSnap.data()?.heroHeading;
  console.log("Public Firestore reader sees heroHeading:", pubHeading);
  if (pubHeading !== "CMS LIVE TEST") {
    throw new Error(`FAILURE: Expected 'CMS LIVE TEST' but got '${pubHeading}'`);
  }
  console.log("CONFIRMED: Firestore document changed and public client sees update!");
  
  // 5. Restore original hero heading
  console.log(`4. Restoring original heroHeading: '${origHeading}'...`);
  await setDoc(homeRef, { heroHeading: origHeading, updatedAt: Date.now() }, { merge: true });
  
  // 6. Verify restored value
  const restoredSnap = await getDoc(doc(publicDb, "homepage", "content"));
  console.log("Restored heroHeading verified in Firestore:", restoredSnap.data()?.heroHeading);
  if (restoredSnap.data()?.heroHeading !== origHeading) {
    throw new Error("FAILURE: Restoration failed!");
  }
  
  console.log("\nALL PHASE 17 CMS LIVE FLOW CHECKS PASSED SUCCESSFULLY!");
}

runLiveCmsTest().then(() => process.exit(0)).catch(err => {
  console.error("TEST FAILED:", err);
  process.exit(1);
});
