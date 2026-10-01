import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAHz_DaY8K850y9rf997ZerksRrAlzg99c",
  authDomain: "pk-college-74f41.firebaseapp.com",
  projectId: "pk-college-74f41",
  storageBucket: "pk-college-74f41.firebasestorage.app",
  messagingSenderId: "1013832303083",
  appId: "1:1013832303083:web:c967a92a4a6ab0b72d99ae",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function inspectAll() {
  console.log("=== INSPECTING CURRENT FIRESTORE DOCUMENTS ===");

  // 1. siteSettings/general
  const sSnap = await getDoc(doc(db, "siteSettings", "general"));
  console.log("siteSettings/general exists:", sSnap.exists());
  if (sSnap.exists()) {
    console.log("siteSettings data:", JSON.stringify(sSnap.data(), null, 2));
  }

  // 2. homepage/content
  const hSnap = await getDoc(doc(db, "homepage", "content"));
  console.log("\nhomepage/content exists:", hSnap.exists());
  if (hSnap.exists()) {
    console.log("homepage data:", JSON.stringify(hSnap.data(), null, 2));
  }

  // 3. placements/overview
  const pSnap = await getDoc(doc(db, "placements", "overview"));
  console.log("\nplacements/overview exists:", pSnap.exists());
  if (pSnap.exists()) {
    console.log("placements keys:", Object.keys(pSnap.data()));
    console.log("highestPackage:", JSON.stringify(pSnap.data().highestPackage));
  }

  // 4. departments
  const dSnap = await getDocs(collection(db, "departments"));
  console.log("\ndepartments count:", dSnap.size);
  dSnap.forEach(d => console.log(` - ${d.id}:`, d.data().title, "intake:", d.data().intake));

  // 5. announcements
  const aSnap = await getDocs(collection(db, "announcements"));
  console.log("\nannouncements count:", aSnap.size);
  aSnap.forEach(a => console.log(` - ${a.id}:`, a.data().title));
}

inspectAll().then(() => process.exit(0)).catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
