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

const app = initializeApp(firebaseConfig, "rules-verifier");
const db = getFirestore(app);

async function testRules() {
  console.log("Testing unauthenticated public read on all CMS collections...");
  const collectionsToTest = [
    { coll: 'siteSettings', docId: 'general' },
    { coll: 'homepage', docId: 'content' },
    { coll: 'placements', docId: 'overview' },
    { coll: 'departments' },
    { coll: 'facilities' },
    { coll: 'announcements' },
    { coll: 'events' },
    { coll: 'gallery' },
    { coll: 'about', docId: 'leadership' },
  ];

  for (const item of collectionsToTest) {
    try {
      if (item.docId) {
        const snap = await getDoc(doc(db, item.coll, item.docId));
        console.log(`[PASS] Read doc ${item.coll}/${item.docId} - exists: ${snap.exists()}`);
      } else {
        const snap = await getDocs(collection(db, item.coll));
        console.log(`[PASS] Read collection ${item.coll} - docs count: ${snap.size}`);
      }
    } catch (err) {
      console.error(`[FAIL] Error reading ${item.coll}:`, err.code, err.message);
    }
  }
}

testRules().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
