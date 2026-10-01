import fs from 'fs';
import path from 'path';

const logPath = 'C:/Users/HP/AppData/Local/Google/Chrome/User Data/Profile 1/Local Storage/leveldb/001188.log';
const buf = fs.readFileSync(logPath);

const keys = ['pkcet_departments_v4', 'pkcet_facilities_v4', 'pkcet_homepage_v4', 'pkcet_placements_v4', 'pkcet_leadership_v4', 'pkcet_announcements_v4', 'pkcet_events_v4', 'pkcet_gallery_v4', 'pkcet_site_settings_v4'];

for (const k of keys) {
  let idx = buf.indexOf(k);
  if (idx !== -1) {
    console.log(`=== FOUND KEY: ${k} at ${idx} ===`);
    // Print 300 characters around it
    const start = Math.max(0, idx - 20);
    const end = Math.min(buf.length, idx + 400);
    console.log(buf.subarray(start, end).toString('utf8').replace(/[^\x20-\x7e\n]/g, '.'));
  }
}
