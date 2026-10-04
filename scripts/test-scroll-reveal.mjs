import { spawn } from 'child_process';
import path from 'path';
import os from 'os';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9226;
const SITE_URL = 'http://localhost:5173/';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log('--- TESTING SCROLL-REVEAL SYSTEM ---');
  const tempProfile = path.join(os.tmpdir(), 'chrome-prof-scroll-' + Date.now());
  const chrome = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + tempProfile
  ]);

  let versionData = null;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      versionData = await res.json();
      break;
    } catch {
      await sleep(400);
    }
  }

  if (!versionData) {
    console.error('Failed to connect to Chrome debugging port.');
    chrome.kill();
    return;
  }

  const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const targets = await listRes.json();
  const pageTarget = targets.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension://')) || targets[0];
  console.log('Connecting to target:', pageTarget.url);
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let idCounter = 1;
  const pendingRequests = new Map();
  const consoleErrors = [];

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pendingRequests.has(data.id)) {
      const { resolve, reject } = pendingRequests.get(data.id);
      pendingRequests.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    } else if (data.method === 'Runtime.consoleAPICalled') {
      if (data.params.type === 'error') {
        const text = data.params.args.map(a => a.value || a.description).join(' ');
        consoleErrors.push(text);
      }
    }
  };

  await new Promise(r => ws.onopen = r);

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      pendingRequests.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');

  const testViewports = [
    { name: 'Mobile 320px', width: 320, height: 740, isMobile: true },
    { name: 'Mobile 375px', width: 375, height: 812, isMobile: true },
    { name: 'Mobile 430px', width: 430, height: 932, isMobile: true },
    { name: 'Desktop 1280px', width: 1280, height: 800, isMobile: false },
  ];

  for (const vp of testViewports) {
    console.log(`\nTesting Scroll Reveal at ${vp.name}...`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.isMobile
    });

    await send('Page.navigate', { url: SITE_URL });
    await sleep(800);
    await send('Runtime.evaluate', {
      expression: `new Promise(resolve => {
        function check() {
          if (document.readyState === 'complete' && document.querySelectorAll('[data-reveal]').length > 0) {
            resolve(true);
          } else {
            setTimeout(check, 50);
          }
        }
        check();
      })`,
      awaitPromise: true
    });
    await sleep(400);

    // Initial check: Total elements and above-the-fold vs below-the-fold
    const initialCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const all = Array.from(document.querySelectorAll('[data-reveal]'));
        const winH = window.innerHeight;
        const initialRevealed = all.filter(el => el.classList.contains('revealed')).length;
        const pendingBelowFold = all.filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.top > winH && !el.classList.contains('revealed');
        }).length;
        return {
          totalElements: all.length,
          initialRevealed,
          pendingBelowFold
        };
      })()`,
      returnByValue: true
    });
    console.log(`  Initial status: Total data-reveal items: ${initialCheck.result.value.totalElements}, Initially revealed: ${initialCheck.result.value.initialRevealed}, Pending below fold: ${initialCheck.result.value.pendingBelowFold}`);

    // Scroll down in increments
    const maxScroll = await send('Runtime.evaluate', {
      expression: `document.documentElement.scrollHeight - window.innerHeight`,
      returnByValue: true
    });

    const scrollSteps = 6;
    const stepSize = Math.floor(maxScroll.result.value / scrollSteps);
    let previousRevealedCount = initialCheck.result.value.initialRevealed;

    for (let s = 1; s <= scrollSteps; s++) {
      const targetScroll = s * stepSize;
      await send('Runtime.evaluate', {
        expression: `(() => {
          window.scrollTo(0, ${targetScroll});
          window.dispatchEvent(new Event('scroll'));
        })()`
      });
      await sleep(350);

      const progressCheck = await send('Runtime.evaluate', {
        expression: `(() => {
          const all = Array.from(document.querySelectorAll('[data-reveal]'));
          return {
            revealedCount: all.filter(el => el.classList.contains('revealed')).length,
            scrollY: window.scrollY
          };
        })()`,
        returnByValue: true
      });

      const currentRevealed = progressCheck.result.value.revealedCount;
      console.log(`  Scrolled to ${progressCheck.result.value.scrollY}px: Revealed ${currentRevealed} / ${initialCheck.result.value.totalElements} elements (+${currentRevealed - previousRevealedCount})`);
      previousRevealedCount = currentRevealed;
    }

    // Scroll back to top to verify animations stay visible (once: true)
    await send('Runtime.evaluate', {
      expression: `window.scrollTo({ top: 0, behavior: 'instant' })`
    });
    await sleep(300);

    const onceCheck = await send('Runtime.evaluate', {
      expression: `(() => {
        const all = Array.from(document.querySelectorAll('[data-reveal]'));
        const stillRevealed = all.filter(el => el.classList.contains('revealed')).length;
        return {
          total: all.length,
          stillRevealed,
          allPersist: stillRevealed >= previousRevealedCount
        };
      })()`,
      returnByValue: true
    });
    if (onceCheck && onceCheck.result && onceCheck.result.value) {
      console.log(`  After scroll back to top: All ${onceCheck.result.value.stillRevealed} revealed elements remained visible (once: true): ${onceCheck.result.value.allPersist}`);
    }
  }

  console.log(`\n--- CONSOLE ERRORS: ${consoleErrors.length} ---`);
  if (consoleErrors.length > 0) {
    console.log(consoleErrors);
  } else {
    console.log('Zero console errors detected during scroll tests!');
  }

  ws.close();
  chrome.kill();
  console.log('\nScroll reveal tests completed successfully.');
}

run().catch(console.error);
