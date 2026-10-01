import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAHz_DaY8K850y9rf997ZerksRrAlzg99c",
  authDomain: "pk-college-74f41.firebaseapp.com",
  projectId: "pk-college-74f41",
  storageBucket: "pk-college-74f41.firebasestorage.app",
  messagingSenderId: "1013832303083",
  appId: "1:1013832303083:web:c967a92a4a6ab0b72d99ae",
};

// Admin App (authenticated)
const adminApp = initializeApp(firebaseConfig, "admin-app");
const adminAuth = getAuth(adminApp);
const adminDb = getFirestore(adminApp);

// Public App (unauthenticated)
const publicApp = initializeApp(firebaseConfig, "public-app");
const publicDb = getFirestore(publicApp);

async function runEndToEndTests() {
  console.log("==================================================");
  console.log("STARTING CMS ARCHITECTURE VERIFICATION TEST SUITE");
  console.log("==================================================");

  // 1. Authenticate Admin
  console.log("\n[1] Authenticating Admin user...");
  const cred = await signInWithEmailAndPassword(adminAuth, 'admin@pk-college.edu.in', 'Admin@pkcet2026!');
  console.log("Admin logged in successfully! UID:", cred.user.uid);

  // TEST A: TEXT (Homepage CMS)
  console.log("\n--- TEST A: TEXT (Homepage CMS) ---");
  const testHeading = "PK College of Engineering & Technology (Live Verification)";
  await setDoc(doc(adminDb, "homepage", "content"), { heroHeading: testHeading, updatedAt: Date.now() }, { merge: true });
  console.log("Admin write to homepage/content: SUCCESS");

  const pubHomeSnap = await getDoc(doc(publicDb, "homepage", "content"));
  console.log("Public unauthenticated read from homepage/content: SUCCESS");
  console.log("Verified heroHeading:", pubHomeSnap.data()?.heroHeading);
  if (pubHomeSnap.data()?.heroHeading !== testHeading) {
    throw new Error("TEST A FAILED: heading mismatch");
  }
  console.log(">>> TEST A: PASSED");

  // TEST B: IMAGE (Cloudinary + Firestore)
  console.log("\n--- TEST B: IMAGE (Cloudinary + Firestore) ---");
  // Upload 1x1 test png to Cloudinary
  const pixelPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  const buffer = Buffer.from(pixelPngBase64, 'base64');
  const blob = new Blob([buffer], { type: 'image/png' });
  const fd = new FormData();
  fd.append('file', blob, 'test-img.png');
  fd.append('upload_preset', 'Pk college');

  const cldRes = await fetch('https://api.cloudinary.com/v1_1/e8mmudhk/image/upload', {
    method: 'POST',
    body: fd
  });
  const cldData = await cldRes.json();
  console.log("Cloudinary Upload HTTP Status:", cldRes.status);
  console.log("Cloudinary secure_url:", cldData.secure_url);
  if (!cldData.secure_url) throw new Error("Cloudinary upload failed");

  // Store in siteSettings/general
  await setDoc(doc(adminDb, "siteSettings", "general"), { logoUrl: cldData.secure_url }, { merge: true });
  console.log("Admin stored Cloudinary secure_url in siteSettings/general");

  const pubSiteSnap = await getDoc(doc(publicDb, "siteSettings", "general"));
  console.log("Public unauthenticated read logoUrl:", pubSiteSnap.data()?.logoUrl);
  if (pubSiteSnap.data()?.logoUrl !== cldData.secure_url) {
    throw new Error("TEST B FAILED: logoUrl mismatch");
  }
  console.log(">>> TEST B: PASSED");

  // TEST C: ANNOUNCEMENTS
  console.log("\n--- TEST C: ANNOUNCEMENTS ---");
  const testAnnId = `ann-verify-${Date.now()}`;
  const testAnn = {
    id: testAnnId,
    title: "Admissions Open for B.Tech Academic Year 2026-27",
    category: "Admissions",
    date: "October 2026",
    summary: "Prospective applicants can submit admission queries online.",
    isNew: true,
  };
  await setDoc(doc(adminDb, "announcements", testAnnId), testAnn);
  console.log(`Admin created announcement: ${testAnnId}`);

  const pubAnnDocs = await getDocs(collection(publicDb, "announcements"));
  console.log(`Public unauthenticated read announcements collection: ${pubAnnDocs.size} docs found`);
  const foundAnn = pubAnnDocs.docs.find(d => d.id === testAnnId);
  if (!foundAnn) throw new Error("TEST C FAILED: announcement not found by public reader");
  console.log("Verified public reader saw title:", foundAnn.data().title);
  console.log(">>> TEST C: PASSED");

  // TEST D: PLACEMENTS (Highest Package)
  console.log("\n--- TEST D: PLACEMENTS (Highest Package) ---");
  const hpData = {
    packageAmount: "45.5 LPA",
    studentName: "Aditya Sharma",
    companyName: "Google Cloud",
    batchYear: "2026",
    placementYear: "2026",
    department: "Computer Science & Engineering",
    isVisible: true,
  };
  await setDoc(doc(adminDb, "placements", "overview"), { highestPackage: hpData }, { merge: true });
  console.log("Admin updated highestPackage in placements/overview");

  const pubPlaceSnap = await getDoc(doc(publicDb, "placements", "overview"));
  console.log("Public unauthenticated read placements/overview");
  console.log("Verified highestPackage amount:", pubPlaceSnap.data()?.highestPackage?.packageAmount);
  if (pubPlaceSnap.data()?.highestPackage?.packageAmount !== "45.5 LPA") {
    throw new Error("TEST D FAILED: highestPackage mismatch");
  }
  console.log(">>> TEST D: PASSED");

  // TEST E: DEPARTMENT (Intake update)
  console.log("\n--- TEST E: DEPARTMENT (Intake / Seats update) ---");
  await setDoc(doc(adminDb, "departments", "cse"), {
    slug: "cse",
    code: "01",
    title: "Computer Science & Engineering",
    intake: 180,
    hodName: "Dr. K. V. Raman, Ph.D.",
  }, { merge: true });
  console.log("Admin updated departments/cse with intake=180");

  const pubDeptSnap = await getDoc(doc(publicDb, "departments", "cse"));
  console.log("Public unauthenticated read departments/cse");
  console.log("Verified intake:", pubDeptSnap.data()?.intake, "HOD:", pubDeptSnap.data()?.hodName);
  if (pubDeptSnap.data()?.intake !== 180) {
    throw new Error("TEST E FAILED: department intake mismatch");
  }
  console.log(">>> TEST E: PASSED");

  console.log("\n==================================================");
  console.log("ALL TESTS (A, B, C, D, E) PASSED SUCCESSFULLY!");
  console.log("==================================================");
}

runEndToEndTests().then(() => process.exit(0)).catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
