async function verify() {
  const res = await fetch('http://localhost:5173/');
  const html = await res.text();

  console.log("Checking Homepage Section 9 Responsive Elements...");
  
  // 1. Verify presence of Notices & Circulars
  const hasNotices = html.includes("Notices &amp; Circulars") || html.includes("Notices & Circulars");
  console.log("1. Notices & Circulars section present:", hasNotices);

  // 2. Verify presence of Upcoming Events
  const hasEvents = html.includes("Upcoming Events");
  console.log("2. Upcoming Events section present:", hasEvents);

  // 3. Verify that truncate has been removed from announcement and event titles
  const hasNoticeTitleTruncate = /to="\/announcements"[^>]*class="[^"]*\btruncate\b[^"]*"/;
  console.log("3. Announcements title has NO truncate:", !hasNoticeTitleTruncate.test(html));

  // 4. Verify that event titles have NO truncate
  const hasEventTitleTruncate = /<h4[^>]*class="[^"]*\btruncate\b[^"]*"[^>]*>[^<]*<\/h4>/;
  console.log("4. Event title has NO truncate:", !hasEventTitleTruncate.test(html));

  // 5. Verify that event image has responsive container with overflow-hidden
  const hasResponsiveImgContainer = html.includes("aspect-square") && html.includes("overflow-hidden") && (html.includes("w-14") || html.includes("w-16"));
  console.log("5. Responsive event image container present:", hasResponsiveImgContainer);

  // 6. Verify overflow-wrap anywhere
  const hasOverflowWrap = html.includes("overflow-wrap:anywhere") || html.includes("overflow-wrap: anywhere");
  console.log("6. Overflow-wrap anywhere applied:", hasOverflowWrap);

  // 7. Verify box-border, w-full, max-w-full, min-w-0 on panels and cards
  const hasBoxConstraints = html.includes("w-full max-w-full min-w-0 box-border");
  console.log("7. Responsive box constraints (w-full max-w-full min-w-0 box-border) applied:", hasBoxConstraints);

  const allPassed = hasNotices && hasEvents && !hasNoticeTitleTruncate.test(html) && !hasEventTitleTruncate.test(html) && hasResponsiveImgContainer && hasOverflowWrap && hasBoxConstraints;
  console.log(`\nALL SECTION 9 RESPONSIVE CHECKS PASSED: ${allPassed}`);
  if (!allPassed) process.exit(1);
}

verify().catch(e => { console.error(e); process.exit(1); });
