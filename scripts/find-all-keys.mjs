import fs from 'fs';
import path from 'path';

const dir = 'C:/Users/HP/AppData/Local/Google/Chrome/User Data/Profile 1/Local Storage/leveldb';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ldb') || f.endsWith('.log'));

for (const f of files) {
  const buf = fs.readFileSync(path.join(dir, f));
  let idx = 0;
  while ((idx = buf.indexOf('pkcet_', idx)) !== -1) {
    const keySlice = buf.subarray(idx, idx + 35).toString('latin1').replace(/[^\x20-\x7e]/g, ' ');
    console.log(`[${f}] ${keySlice.trim()}`);
    idx += 7;
  }
}
