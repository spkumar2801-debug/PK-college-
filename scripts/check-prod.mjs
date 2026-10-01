async function checkProd() {
  const base = 'https://pk-college-of-engineering-technolog.vercel.app';
  const routes = ['/', '/admin', '/placements', '/about', '/facilities', '/departments'];

  console.log(`Checking production site routes at ${base}...`);
  let allOk = true;
  for (const r of routes) {
    const url = base + r;
    const res = await fetch(url);
    const text = await res.text();
    const hasCrash = text.includes('Something went wrong') || text.includes("This page didn't load");
    console.log(`Route [${r}]: HTTP ${res.status} | Length: ${text.length} | Crash: ${hasCrash}`);
    if (res.status !== 200 || hasCrash) allOk = false;
  }
  console.log(`\nALL PRODUCTION ROUTES HEALTHY: ${allOk}`);
}

checkProd().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
