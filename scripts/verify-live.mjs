import http from 'http';

function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let d = '';
      res.on('data', chunk => d += chunk);
      res.on('end', () => {
        const hasCrash = d.includes('Something went wrong') || d.includes("This page didn't load");
        resolve({ url, status: res.statusCode, hasCrash, length: d.length, snippet: d.substring(0, 150) });
      });
    }).on('error', (err) => resolve({ url, status: 0, hasCrash: true, error: err.message }));
  });
}

async function run() {
  const urls = [
    'http://localhost:5173/',
    'http://localhost:5173/admin',
    'http://localhost:5173/placements',
    'http://localhost:5173/about',
    'http://localhost:5173/facilities',
    'http://localhost:5173/departments'
  ];

  console.log('--- VERIFYING LIVE WEBPAGES ---');
  let allHealthy = true;
  for (const u of urls) {
    const res = await checkUrl(u);
    console.log(`URL: ${res.url}`);
    console.log(`  HTTP Status: ${res.status}`);
    console.log(`  Crash Text Detected: ${res.hasCrash}`);
    console.log(`  Response Byte Length: ${res.length}`);
    if (res.status !== 200 || res.hasCrash) {
      allHealthy = false;
    }
  }
  console.log(`\nALL PAGES HEALTHY: ${allHealthy}`);
}

run();
