import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9222;
const OUTPUT_DIR = path.resolve('C:\\Users\\HP\\.gemini\\antigravity-ide\\brain\\6bb3c847-9df1-4494-a457-e0790bbf8d81');

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log('Launching headless Chrome...');
  const tempProfile = path.join(os.tmpdir(), 'chrome-prof-' + Date.now());
  const chrome = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + tempProfile
  ]);

  chrome.on('error', (err) => console.error('Chrome spawn error:', err));

  // wait for port
  let versionData = null;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      versionData = await res.json();
      break;
    } catch {
      await sleep(500);
    }
  }

  if (!versionData) {
    console.error('Failed to connect to Chrome debugging port.');
    chrome.kill();
    return;
  }

  console.log('Connected to Chrome:', versionData.Browser);

  // get the default page target
  const listRes = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  const targets = await listRes.json();
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const wsUrl = pageTarget.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);

  let idCounter = 1;
  const pendingRequests = new Map();
  const consoleMessages = [];

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pendingRequests.has(data.id)) {
      const { resolve, reject } = pendingRequests.get(data.id);
      pendingRequests.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    } else if (data.method === 'Console.messageAdded') {
      consoleMessages.push(data.params.message);
    } else if (data.method === 'Runtime.consoleAPICalled') {
      const text = data.params.args.map(a => a.value || a.description).join(' ');
      consoleMessages.push({ type: data.params.type, text });
    }
  };

  await new Promise((resolve) => {
    ws.onopen = resolve;
  });

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      pendingRequests.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Console.enable');

  const viewports = [
    { name: '320px', width: 320, height: 740, isMobile: true, capture: true },
    { name: '360px', width: 360, height: 760, isMobile: true, capture: false },
    { name: '375px', width: 375, height: 812, isMobile: true, capture: true },
    { name: '390px', width: 390, height: 844, isMobile: true, capture: false },
    { name: '412px', width: 412, height: 915, isMobile: true, capture: false },
    { name: '430px', width: 430, height: 932, isMobile: true, capture: true },
    { name: '768px', width: 768, height: 1024, isMobile: false, capture: false },
    { name: '820px', width: 820, height: 1180, isMobile: false, capture: false },
    { name: '1024px', width: 1024, height: 768, isMobile: false, capture: false },
    { name: '1280px', width: 1280, height: 800, isMobile: false, capture: true },
    { name: '1440px', width: 1440, height: 900, isMobile: false, capture: false },
  ];

  console.log('\n--- TESTING RESPONSIVE VIEWPORTS ---');

  const SITE_URL = 'http://localhost:5173/';
  console.log(`\n--- TESTING WITH DEV SERVER (${SITE_URL}) ---`);

  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.isMobile
    });

    await send('Page.navigate', { url: SITE_URL });
    await sleep(800);
    // Wait for stylesheet to be active
    await send('Runtime.evaluate', {
      expression: `new Promise(resolve => {
        function check() {
          const hero = document.querySelector('.hero-bg-image');
          if (document.styleSheets.length > 0 && hero && window.getComputedStyle(hero).position === 'absolute') {
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

    // Check for overflow
    const overflowEval = await send('Runtime.evaluate', {
      expression: `(() => {
        const docWidth = document.documentElement.clientWidth;
        const bodyWidth = document.body.clientWidth;
        const windowWidth = window.innerWidth;
        const offenders = [];

        function isClippedByParent(el) {
          let parent = el.parentElement;
          while (parent && parent !== document.documentElement && parent !== document.body) {
            const ps = window.getComputedStyle(parent);
            if (ps.overflowX === 'hidden' || ps.overflow === 'hidden' || ps.overflowX === 'clip') {
              const pr = parent.getBoundingClientRect();
              if (pr.right <= windowWidth + 2) {
                return true;
              }
            }
            parent = parent.parentElement;
          }
          return false;
        }
        
        document.querySelectorAll('*').forEach(el => {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden') return;
          if (style.position === 'fixed' && (rect.width <= windowWidth || el.getAttribute('role') === 'dialog')) return;
          if (isClippedByParent(el)) return;
          
          if (rect.right > docWidth + 2) {
            offenders.push({
              tag: el.tagName,
              id: el.id,
              class: (typeof el.className === 'string' ? el.className : '').slice(0, 40),
              right: Math.round(rect.right),
              docWidth
            });
          }
        });
        
        return {
          docWidth,
          bodyWidth,
          windowWidth,
          hasHorizontalScroll: document.documentElement.scrollWidth > windowWidth,
          offendersCount: offenders.length,
          offenders: offenders.slice(0, 5)
        };
      })()`,
      returnByValue: true
    });

    const result = overflowEval.result.value;
    console.log(`Viewport ${vp.name.padEnd(7)} (${vp.width}x${vp.height}): ScrollWidth > WinWidth: ${result.hasHorizontalScroll} | Overflowing elements: ${result.offendersCount}`);
    if (result.offendersCount > 0) {
      console.log('   Offenders:', JSON.stringify(result.offenders));
    }

    if (vp.capture) {
      const screenshot = await send('Page.captureScreenshot', {
        format: 'png',
        clip: {
          x: 0,
          y: 0,
          width: vp.width,
          height: vp.height,
          scale: 1
        }
      });
      const filePath = path.join(OUTPUT_DIR, `screenshot_${vp.width}px.png`);
      fs.writeFileSync(filePath, Buffer.from(screenshot.data, 'base64'));
      console.log(`   Saved screenshot: ${filePath}`);
    }
  }

  // Now test Mobile Drawer at 375px
  console.log('\n--- TESTING MOBILE NAVIGATION DRAWER & INSTITUTIONAL DESK ---');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Page.navigate', { url: SITE_URL });
  await sleep(2000);

  // Find all buttons on page
  const inspectButtons = await send('Runtime.evaluate', {
    expression: `(() => {
      return Array.from(document.querySelectorAll('button')).map(b => ({
        text: b.innerText,
        ariaLabel: b.getAttribute('aria-label'),
        classes: b.className,
        rect: b.getBoundingClientRect()
      }));
    })()`,
    returnByValue: true
  });
  console.log('Available buttons on mobile:', JSON.stringify(inspectButtons.result.value, null, 2));

  // Click the mobile menu hamburger button
  const clickMenu = await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('button[aria-label="Open navigation menu"]') || 
                  document.querySelector('.mobile-college-header button') ||
                  document.querySelector('header button');
      if (btn) {
        btn.focus();
        btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
        btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
        btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        btn.click();
        return { clicked: true, label: btn.getAttribute('aria-label'), tag: btn.tagName };
      }
      return { clicked: false };
    })()`,
    returnByValue: true
  });
  console.log('Hamburger button clicked:', clickMenu.result.value);

  // Poll for drawer up to 3s
  let drawerFound = false;
  for (let i = 0; i < 15; i++) {
    await sleep(200);
    const check = await send('Runtime.evaluate', {
      expression: `!!document.querySelector('[role="dialog"]')`,
      returnByValue: true
    });
    if (check.result.value) {
      drawerFound = true;
      break;
    }
  }
  console.log('Drawer opened successfully:', drawerFound);

  // Check drawer & institutional desk in DOM
  const drawerCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const drawer = document.querySelector('[role="dialog"]');
      const desk = Array.from(document.querySelectorAll('*')).find(el => el.textContent && el.textContent.toUpperCase().includes('INSTITUTIONAL DESK'));
      if (!drawer) return { error: 'Drawer not found' };
      const drawerRect = drawer.getBoundingClientRect();
      const deskRect = desk ? desk.getBoundingClientRect() : null;
      return {
        drawerWidth: drawerRect.width,
        drawerHeight: drawerRect.height,
        drawerRight: drawerRect.right,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        deskFound: !!desk,
        deskWidth: deskRect ? deskRect.width : null,
        deskRight: deskRect ? deskRect.right : null
      };
    })()`,
    returnByValue: true
  });
  console.log('Drawer & Desk metrics:', JSON.stringify(drawerCheck.result.value, null, 2));

  // Capture drawer screenshot
  const drawerScreenshot = await send('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: 0,
      y: 0,
      width: 375,
      height: 812,
      scale: 1
    }
  });
  const drawerFilePath = path.join(OUTPUT_DIR, 'screenshot_drawer_375px.png');
  fs.writeFileSync(drawerFilePath, Buffer.from(drawerScreenshot.data, 'base64'));
  console.log(`Saved drawer screenshot: ${drawerFilePath}`);

  // Test drawer at 320px
  await send('Emulation.setDeviceMetricsOverride', {
    width: 320,
    height: 700,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sleep(300);
  const drawer320Screenshot = await send('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: 0,
      y: 0,
      width: 320,
      height: 700,
      scale: 1
    }
  });
  const drawer320FilePath = path.join(OUTPUT_DIR, 'screenshot_drawer_320px.png');
  fs.writeFileSync(drawer320FilePath, Buffer.from(drawer320Screenshot.data, 'base64'));
  console.log(`Saved drawer 320px screenshot: ${drawer320FilePath}`);

  console.log('\n--- CONSOLE MESSAGES AUDIT ---');
  const errors = consoleMessages.filter(m => m.type === 'error' || m.level === 'error');
  console.log(`Total console messages: ${consoleMessages.length}, Errors: ${errors.length}`);
  if (errors.length > 0) {
    console.log('Console Errors:', JSON.stringify(errors, null, 2));
  } else {
    console.log('Zero console errors found!');
  }

  // Cleanup
  ws.close();
  chrome.kill();
  console.log('\nAudit complete.');
}

run().catch(console.error);
