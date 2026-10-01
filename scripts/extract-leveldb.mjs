import fs from 'fs';
import path from 'path';

const dir = 'C:/Users/HP/AppData/Local/Google/Chrome/User Data/Profile 1/Local Storage/leveldb';
if (fs.existsSync(dir)) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.ldb') || f.endsWith('.log'));
  console.log('Found leveldb files:', files.length);
  for (const f of files) {
    const buf = fs.readFileSync(path.join(dir, f));
    for (const key of ['pkcet_departments', 'pkcet_facilities', 'pkcet_homepage', 'pkcet_placements', 'pkcet_leadership', 'pkcet_announcements', 'pkcet_events', 'pkcet_gallery', 'pkcet_site_settings']) {
      let idx = 0;
      let count = 0;
      while ((idx = buf.indexOf(key, idx)) !== -1) {
        count++;
        idx += key.length;
      }
      if (count > 0) {
        console.log(`Key ${key} found in ${f}: ${count} times`);
      }
    }
  }
} else {
  console.log('Directory not found:', dir);
}
