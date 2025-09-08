/* assets/js/translator-unified.js
 * Jeden, spójny tłumacz dla całej strony (header, multi-lang, elegancki UI).
 * Wystarczy podpiąć <script src="/assets/js/translator-unified.js?v=1" defer></script> na każdej stronie.
 */
(function () {
  if (window.__bhTranslatorUnified__) return;
  window.__bhTranslatorUnified__ = true;

  // === 0) Konfiguracja języków (swobodnie rozszerz aj/usuń) ===
  const LANGS = [
    // Kod   , Label widoczny w UI
    ['pl','Polski'], ['en','English'], ['uk','Українська'], ['ru','Русский'],
    ['de','Deutsch'], ['cs','Čeština'], ['sk','Slovenčina'], ['lt','Lietuvių'],
    ['lv','Latviešu'], ['ro','Română'], ['es','Español'], ['fr','Français'],
    ['it','Italiano'], ['pt','Português'], ['nl','Nederlands'], ['da','Dansk'],
    ['sv','Svenska'], ['no','Norsk'], ['hu','Magyar'], ['el','Ελληνικά'],
    ['tr','Türkçe'], ['vi','Tiếng Việt'], ['ar','العربية'],
    ['he','עברית'], ['hi','हिन्दी'], ['zh-CN','简体中文'], ['zh-TW','繁體中文'],
    ['ja','日本語'], ['ko','한국어']
  ];
  const INCLUDED = LANGS.map(([code]) => code).join(',');

  // === 1) UI (header, nowoczesny, spójny) ===
  const style = document.createElement('style');
  style.textContent = `
    #bh-translate-wrap{position:fixed;right:16px;top:14px;z-index:9999;font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial}
    #bh-translate-btn{
      display:inline-flex;align-items:center;gap:8px; padding:6px 12px; border-radius:999px; font-weight:700; font-size:12px; letter-spacing:.2px;
      border:1px solid rgba(255,255,255,.35);
      background: linear-gradient(90deg, rgba(138,168,255,.35), rgba(75,227,190,.20));
      color:#fff; cursor:pointer; user-select:none; box-shadow:0 8px 24px rgba(0,0,0,.25);
      transition:transform .15s ease, filter .15s ease;
    }
    #bh-translate-btn:hover{ filter:brightness(1.08); transform:translateY(-1px); }
    #bh-translate-btn .dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.9);}

    #bh-translate-panel{
      position:absolute; right:0; top:46px; min-width:260px; max-height:60vh; overflow:auto;
      background:rgba(10,16,32,.92); backdrop-filter:saturate(130%) blur(10px);
      border:1px solid rgba(255,255,255,.22); border-radius:14px; box-shadow:0 12px 36px rgba(0,0,0,.35);
      padding:10px; display:none;
    }
    #bh-translate-panel.open{ display:block; }
    #bh-translate-search{
      width:100%; padding:8px 10px; border-radius:10px; border:1px solid rgba(255,255,255,.25);
      background:#0e1733; color:#fff; font-size:13px; margin-bottom:10px;
    }
    #bh-translate-list{ display:grid; grid-template-columns:1fr; gap:6px; }
    @media (min-width:520px){ #bh-translate-list{ grid-template-columns:1fr 1fr; } }

    .bh-lang{
      display:flex; align-items:center; gap:8px; padding:7px 10px; border-radius:10px;
      border:1px solid rgba(255,255,255,.18);
      background: linear-gradient(90deg, rgba(138,168,255,.18), rgba(75,227,190,.12));
      color:#fff; font-size:12px; cursor:pointer; user-select:none;
      transition:filter .15s ease, transform .15s ease;
    }
    .bh-lang:hover{ filter:brightness(1.08); transform:translateY(-1px); }
    .bh-lang.active{ outline:2px solid rgba(255,255,255,.55); }
    .bh-lang .code{
      display:inline-flex; align-items:center; justify-content:center; width:26px; height:20px;
      border-radius:6px; background:rgba(255,255,255,.08); font-weight:800; font-size:11px;
    }

    /* Ukrycie topbara Google + uspokojenie styli */
    .goog-te-banner-frame.skiptranslate{display:none!important}
    body{top:0!important}
    .goog-te-gadget{color:#fff}
    .goog-te-gadget-simple{background:transparent!important;border:none!important}
    .goog-te-gadget-icon{display:none}

    @media (prefers-reduced-motion: reduce){
      #bh-translate-btn, .bh-lang{ transition:none }
    }
  `;
  document.head.appendChild(style);

  const wrap = document.createElement('div');
  wrap.id = 'bh-translate-wrap';
  wrap.innerHTML = `
    <button id="bh-translate-btn" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="bh-translate-panel" title="Wybierz język">
      <span class="dot" aria-hidden="true"></span><span id="bh-translate-label">PL</span>
    </button>
    <div id="bh-translate-panel" role="menu" aria-label="Wybór języka">
      <input id="bh-translate-search" type="search" placeholder="Szukaj języka…" autocomplete="off" />
      <div id="bh-translate-list" role="listbox"></div>
    </div>
  `;

  const holder = document.createElement('div'); // niewidoczny kontener Google
  holder.id = 'google_translate_element';
  holder.style.position = 'fixed';
  holder.style.right = '16px';
  holder.style.top = '0';
  holder.style.opacity = '0';
  holder.style.pointerEvents = 'none';
  holder.style.zIndex = '0';

  function mount() {
    if (!document.getElementById('bh-translate-wrap')) document.body.appendChild(wrap);
    if (!document.getElementById('google_translate_element')) document.body.appendChild(holder);
    renderList();
    hydrateFromStorage();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once:true });
  } else mount();

  // === 2) Render listy języków z wyszukiwarką ===
  function renderList(filter = '') {
    const list = document.getElementById('bh-translate-list');
    if (!list) return;
    const q = filter.trim().toLowerCase();
    list.innerHTML = '';
    LANGS.forEach(([code, label]) => {
      if (q && !(`${label} ${code}`.toLowerCase().includes(q))) return;
      const item = document.createElement('div');
      item.className = 'bh-lang';
      item.tabIndex = 0;
      item.role = 'option';
      item.dataset.lang = code;
      item.innerHTML = `<span class="code">${code.toUpperCase()}</span><span class="label">${label}</span>`;
      list.appendChild(item);
    });
    syncActiveUI(currentLang());
  }

  // === 3) Google Translate bootstrap ===
  window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement({
      pageLanguage: 'pl',
      includedLanguages: INCLUDED,
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false
    }, 'google_translate_element');

    // Po inicjalizacji przywróć ostatni język
    applyLang(currentLang(), true);
  };

  function loadGoogle() {
    if (document.getElementById('gt-el')) return;
    const s = document.createElement('script');
    s.id = 'gt-el';
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.defer = true;
    document.head.appendChild(s);
  }
  loadGoogle();

  // === 4) Logika wyboru języka ===
  function currentLang() {
    return localStorage.getItem('bh-lang') || 'pl';
  }
  function setCurrentLang(code) {
    localStorage.setItem('bh-lang', code);
  }
  function setLabel(code) {
    const lbl = document.getElementById('bh-translate-label');
    if (lbl) lbl.textContent = code.toUpperCase();
  }
  function syncActiveUI(code) {
    document.querySelectorAll('.bh-lang').forEach(n => {
      n.classList.toggle('active', n.dataset.lang === code);
    });
    setLabel(code);
  }

  function switchSelectTo(code) {
    // Select Google: pusty string = język oryginalny
    const target = code === 'pl' ? '' : code;
    const sel = document.querySelector('select.goog-te-combo');
    if (!sel) return false;
    if (sel.value !== target) {
      sel.value = target;
      sel.dispatchEvent(new Event('change'));
    }
    return true;
  }

  function setCookies(code) {
    const v = code === 'pl' ? '/pl/pl' : `/pl/${code}`;
    document.cookie = `googtrans=${v};path=/`;
    // Cookie per domena (jeśli masz subdomeny ustaw odpowiednio):
    document.cookie = `googtrans=${v};domain=${location.hostname};path=/`;
  }

  function applyLang(code, quiet=false) {
    setCurrentLang(code);
    setCookies(code);
    syncActiveUI(code);

    // Ponawiaj próbę przełączenia, bo Google może zainicjować select z opóźnieniem
    let tries = 0;
    const iv = setInterval(() => {
      tries++;
      const ok = switchSelectTo(code);
      if (ok || tries > 20) clearInterval(iv);
    }, 150);

    if (!quiet) closePanel();
  }

  // === 5) Interakcje UI ===
  function openPanel(){
    const panel = document.getElementById('bh-translate-panel');
    const btn = document.getElementById('bh-translate-btn');
    if (!panel || !btn) return;
    panel.classList.add('open');
    btn.setAttribute('aria-expanded','true');
    const input = document.getElementById('bh-translate-search');
    if (input) { input.value = ''; renderList(''); input.focus(); }
  }
  function closePanel(){
    const panel = document.getElementById('bh-translate-panel');
    const btn = document.getElementById('bh-translate-btn');
    if (!panel || !btn) return;
    panel.classList.remove('open');
    btn.setAttribute('aria-expanded','false');
  }

  document.addEventListener('click', (e)=>{
    const btn = e.target.closest?.('#bh-translate-btn');
    const item = e.target.closest?.('.bh-lang');
    const panel = document.getElementById('bh-translate-panel');
    if (btn) {
      const isOpen = panel?.classList.contains('open');
      isOpen ? closePanel() : openPanel();
      return;
    }
    if (item) {
      applyLang(item.dataset.lang);
      return;
    }
    if (panel && !panel.contains(e.target) && !e.target.closest('#bh-translate-btn')) {
      closePanel();
    }
  });

  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape') closePanel();
    const focusedLang = document.activeElement?.closest?.('.bh-lang');
    if (focusedLang && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      applyLang(focusedLang.dataset.lang);
    }
  });

  document.addEventListener('input', (e)=>{
    if (e.target && e.target.id === 'bh-translate-search') {
      renderList(e.target.value);
    }
  });

  function hydrateFromStorage() {
    syncActiveUI(currentLang());
  }
})();
