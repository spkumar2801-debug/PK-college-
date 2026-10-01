async function checkClientScripts() {
  const res = await fetch('http://localhost:5173/');
  const html = await res.text();
  console.log('Homepage HTML length:', html.length);
  
  const scriptRegex = /<script\s+[^>]*src="([^"]+)"/g;
  let match;
  const scriptUrls = [];
  while ((match = scriptRegex.exec(html)) !== null) {
    scriptUrls.push(match[1]);
  }
  console.log('Found scripts:', scriptUrls);
  
  for (const url of scriptUrls) {
    const fullUrl = url.startsWith('http') ? url : `http://localhost:5173${url}`;
    const sRes = await fetch(fullUrl);
    console.log(`Script [${url}]: HTTP ${sRes.status} | Content-Type: ${sRes.headers.get('content-type')}`);
    if (sRes.status !== 200) {
      console.error(`Failed to load script: ${url}`);
    }
  }
}

checkClientScripts().catch(console.error);
