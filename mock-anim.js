(function () {
  function el(id) { return document.getElementById(id); }
  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  const MOON_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>`;
  const SUN_SVG  = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

  function countUp(targetEl, target, duration) {
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      targetEl.textContent = Math.round(eased * target) + ' / 100';
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function showTap(targetEl, centered) {
    const existing = targetEl.querySelector('.mock-tap');
    if (existing) existing.remove();
    const tap = document.createElement('span');
    tap.className = centered ? 'mock-tap centered' : 'mock-tap';
    targetEl.appendChild(tap);
    setTimeout(() => tap.remove(), 600);
  }

  function setTab(idx) {
    document.querySelectorAll('.mock-tab').forEach((t, i) => t.classList.toggle('active', i === idx));
    const paneHeaders = el('mock-pane-headers');
    const paneCookies = el('mock-pane-cookies');
    if (idx === 0) {
      paneCookies.classList.remove('active');
      if (!paneHeaders.classList.contains('active')) paneHeaders.classList.add('active');
    } else {
      paneHeaders.classList.remove('active');
      if (!paneCookies.classList.contains('active')) paneCookies.classList.add('active');
    }
  }

  async function run() {
    const popup    = el('mock-popup');
    const urlEl    = el('mock-url');
    const gradeEl  = el('mock-grade');
    const descEl   = el('mock-grade-desc');
    const scoreEl  = el('mock-score-num');
    const fillEl   = el('mock-progress-fill');
    const scanLine = el('mock-scan-line');
    const themeBtn = el('mock-theme-btn');
    const headersView = el('mock-headers-view');
    const rowXfo   = el('mock-row-xfo');
    const detail   = el('mock-detail');
    const rows     = headersView.querySelectorAll('.mock-row-anim');
    const tabs     = document.querySelectorAll('.mock-tab');

    function applyTheme(dark) {
      popup.classList.add('mock-theme-transition');
      if (dark) {
        popup.classList.add('mock-dark');
        themeBtn.innerHTML = SUN_SVG;
        descEl.style.color  = '#f0f0f0';
        scoreEl.style.color = '#f0f0f0';
      } else {
        popup.classList.remove('mock-dark');
        themeBtn.innerHTML = MOON_SVG;
        descEl.style.color  = '#2a2018';
        scoreEl.style.color = '#1a1612';
      }
      setTimeout(() => popup.classList.remove('mock-theme-transition'), 400);
    }

    // Reset to light mode placeholder state
    popup.classList.remove('mock-dark');
    themeBtn.innerHTML = MOON_SVG;
    setTab(0);

    urlEl.textContent = '';
    urlEl.style.opacity = '0';
    gradeEl.textContent = '—';    gradeEl.style.color = '';  gradeEl.classList.remove('visible');
    descEl.textContent  = 'Scanning'; descEl.style.color  = '';  descEl.classList.remove('visible');
    scoreEl.textContent = '— / 100'; scoreEl.style.color  = '';  scoreEl.classList.remove('visible');
    fillEl.style.transition = 'none';
    fillEl.style.width      = '0%';
    fillEl.style.background = '#ede8de';
    scanLine.className = 'mock-scan-line';
    rows.forEach(r => { r.classList.remove('visible'); r.style.opacity = '0.2'; });
    rowXfo.classList.remove('selected');
    detail.classList.remove('open');

    await sleep(600);

    urlEl.textContent = 'example.com';
    requestAnimationFrame(() => { urlEl.style.opacity = '1'; });
    await sleep(400);

    // Scan + rows reveal
    scanLine.classList.add('scanning');
    rows.forEach((r, i) => {
      setTimeout(() => { r.style.opacity = ''; r.classList.add('visible'); }, 150 + i * 210);
    });
    await sleep(1800);

    // Score counts up
    fillEl.style.transition = 'width 1.2s cubic-bezier(0.2,0,0.2,1)';
    fillEl.style.width      = '84%';
    fillEl.style.background = '#16a34a';
    scoreEl.style.color = '#1a1612';
    scoreEl.classList.add('visible');
    countUp(scoreEl, 84, 1200);
    await sleep(900);

    // Grade eases in
    gradeEl.textContent = 'A';  gradeEl.style.color = '#16a34a';
    descEl.textContent  = 'Excellent'; descEl.style.color = '#2a2018';
    requestAnimationFrame(() => { gradeEl.classList.add('visible'); descEl.classList.add('visible'); });
    await sleep(2000);

    // Tap XFO row → detail opens
    showTap(rowXfo, false);
    await sleep(450);
    rowXfo.classList.add('selected');
    detail.classList.add('open');
    await sleep(3200);

    // Close detail
    detail.classList.remove('open');
    rowXfo.classList.remove('selected');
    await sleep(1000);

    // Tap Cookies tab → switch
    showTap(tabs[1], true);
    await sleep(350);
    setTab(1);
    await sleep(3000);

    // Tap Headers tab → switch back
    showTap(tabs[0], true);
    await sleep(350);
    setTab(0);
    await sleep(800);

    // Tap theme button → dark mode
    showTap(themeBtn, true);
    await sleep(350);
    applyTheme(true);
    await sleep(2200);

    // Tap Cookies tab in dark mode
    showTap(tabs[1], true);
    await sleep(350);
    setTab(1);
    await sleep(2000);

    // Tap Headers tab in dark mode
    showTap(tabs[0], true);
    await sleep(350);
    setTab(0);
    await sleep(700);

    // Tap theme button → back to light
    showTap(themeBtn, true);
    await sleep(350);
    applyTheme(false);
    await sleep(800);

    run().catch(() => {});
  }

  const floatWrap = document.getElementById('mock-float-wrap');
  const wrap      = document.getElementById('mock-wrap');
  if (!wrap || !floatWrap) return;

  const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    observer.disconnect();
    floatWrap.classList.add('entered');
    run().catch(() => {});
  }, { threshold: 0.3 });

  observer.observe(wrap);
})();
