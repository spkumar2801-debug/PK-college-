async function checkProd() {
  const url = 'https://pk-college-of-engineering-technolog.vercel.app';
  console.log(`Checking production site at ${url}...`);
  const res = await fetch(url);
  console.log(`HTTP Status: ${res.status}`);
  const text = await res.text();
  console.log(`Body Length: ${text.length}`);
  console.log(`Snippet: ${text.substring(0, 300)}`);
}

checkProd().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
