import fs from 'fs';
import path from 'path';

const dir = 'C:/Users/HP/AppData/Local/Google/Chrome/User Data/Profile 1/Local Storage/leveldb';
const files = ['001190.ldb', '001191.ldb', '001192.ldb', '001188.log'];

function findJsonAfterKey(buf, key) {
  let idx = 0;
  const results = [];
  while ((idx = buf.indexOf(key, idx)) !== -1) {
    // Look for opening [ or {
    const sub = buf.subarray(idx + key.length, idx + key.length + 50000);
    const str = sub.toString('latin1');
    const startBracket = str.search(/(\[|\{)/);
    if (startBracket !== -1) {
      // Find matching bracket
      const isArr = str[startBracket] === '[';
      const openChar = isArr ? '[' : '{';
      const closeChar = isArr ? ']' : '}';
      let depth = 0;
      let endIdx = -1;
      let inString = false;
      let escaped = false;
      for (let i = startBracket; i < str.length; i++) {
        const c = str[i];
        if (escaped) {
          escaped = false;
          continue;
        }
        if (c === '\\') {
          escaped = true;
          continue;
        }
        if (c === '"') {
          inString = !inString;
          continue;
        }
        if (!inString) {
          if (c === openChar) depth++;
          else if (c === closeChar) {
            depth--;
            if (depth === 0) {
              endIdx = i;
              break;
            }
          }
        }
      }
      if (endIdx !== -1) {
        const jsonStr = str.substring(startBracket, endIdx + 1);
        try {
          const parsed = JSON.parse(jsonStr);
          results.push(parsed);
        } catch (e) {
          // May have corrupted or Snappy compressed pieces
        }
      }
    }
    idx += key.length;
  }
  return results;
}

for (const f of files) {
  const p = path.join(dir, f);
  if (!fs.existsSync(p)) continue;
  const buf = fs.readFileSync(p);
  for (const k of ['pkcet_leadership_v4', 'pkcet_facilities_v4', 'pkcet_gallery_v4', 'pkcet_departments_v4', 'pkcet_placements_v4', 'pkcet_events_v4']) {
    const res = findJsonAfterKey(buf, k);
    if (res.length > 0) {
      console.log(`[${f}] Key ${k}: Parsed ${res.length} JSON objects.`);
      if (k === 'pkcet_leadership_v4') {
        console.log('Leadership:', JSON.stringify(res[0], null, 2));
      }
      if (k === 'pkcet_facilities_v4') {
        console.log('Facilities count:', res[0]?.length);
      }
      if (k === 'pkcet_gallery_v4') {
        console.log('Gallery count:', res[0]?.length);
      }
    }
  }
}
