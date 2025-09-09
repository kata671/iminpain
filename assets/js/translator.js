/* Boli Help • translator.js (FINAL)
   - natychmiastowe tłumaczenie po wyborze języka (bez odświeżania)
   - pamięć między podstronami
   - twarde ukrycie banera Google (bez migania)
   - zero konfliktów ze „starymi” wstawkami
*/

(function () {
  const PAGE_LANG = (document.documentElement.getAttribute('lang') || 'pl').toLowerCase();
  const INCLUDED  = 'pl,en,de,fr,it,es,uk,cs,sk,lt,lv,ro,ru,nl,pt';
  const COOKIE_YEARS = 1;

  // --- 1) Dołóż style chowające baner (od razu, w <head>) ---
  (function injectNoBannerCSS() {
    if (document.getElementById('bh-gt-nobanner')) return;
    const s = document.createElement('style');
    s.id = 'bh-gt-nobanner';
    s.textContent = `
      .goog-te-banner-frame.skiptranslate, .goog-te-banner-frame { display:none!important; }
      body { top:0!important; }
      #google_translate_element, .goog-logo-link, .goog-te-gadget .goog-te-combo { display:none!important; }
    `;
    document.head.appendChild(s);
  })();

  // --- 2) Mini-killer: sprząta baner, gdyby Google próbował go wstrzyknąć później ---
  (function killBannerForever() {
    function kill() {
      document.querySelectorAll('.goog-te-banner-frame').forEach(n => n.remove());
      // Google przykleja "skiptranslate" w różnych miejscach
      document.querySelectorAll('.skiptranslate').forEach(n => {
        if (n !== document.documentElement && n !== document.body) n.remove();
      });
      if (document.body) document.body.style.top = '0px';
    }
    kill();
    let t = 0, iv = setInterval(() => { kill(); if (++t > 80) clearInterval(iv); }, 100); // ~8s
    const mo = new MutationObserver(kill);
    mo.observe(document.documentElement, { childList:true, subtree:true });
    setTimeout(() => mo.disconnect(), 20000);
  })();

  // --- 3) Zapewnij ukryty kontener wymagany przez Google ---
  function ensureContainer() {
    if (!document.getElementById('google_translate_element')) {
      const el = document.createElement('div');
      el.id = 'google_translate_element';
      el.style.display = 'none';
      document.body.appendChild(el);
    }
  }

  // --- 4) Ładuj Translate tylko raz (nasz callback: __bhGTinit) ---
  let ready;
  function loadGT() {
    if (ready) return ready;
    ready = new Promise(resolve => {
      window.__bhGTinit = function () {
        try {
          new google.translate.TranslateElement(
            { pageLanguage: PAGE_LANG, includedLanguages: INCLUDED, autoDisplay: false },
            'google_translate_element'
          );
        } catch (e) {}
        resolve();
      };
      const sc = document.createElement('script');
      sc.src = 'https://translate.google.com/translate_a/element.js?cb=__bhGTinit';
      sc.async = true;
      document.head.appendChild(sc);
    });
    return ready;
  }

  // --- 5) Ustaw „googtrans” (cookie + LS) i zastosuj język bez odświeżania ---
  function setGoogTrans(code) {
    const v = `/auto/${code}`;
    const expires = new Date(Date.now() + COOKIE_YEARS * 31536e6).toUTCString();
    try {
      document.cookie = `googtrans=${v};path=/;expires=${expires}`;
      localStorage.setItem('googtrans', v);
      localStorage.setItem('googtrans-override', v);
    } catch {}
  }

  async function applyLang(code) {
    if (!code || code === 'auto') return;
    ensureContainer();
    await loadGT();
    setGoogTrans(code);

    const tryApply = () => {
      const sel = document.querySelector('.goog-te-combo');
      if (!sel) return false;
      if (sel.value !== code) sel.value = code;
      sel.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    };

    if (tryApply()) return;
    let n = 0;
    const iv = setInterval(() => { if (tryApply() || ++n > 80) clearInterval(iv); }, 100); // do 8s
  }

  // --- 6) Publiczne API + auto-start zapisanym językiem ---
  window.BH_setLanguage = (code) => applyLang(code);

  document.addEventListener('DOMContentLoaded', () => {
    ensureContainer();
    // Jeśli użytkownik ma zapisany język inny niż domyślny — zastosuj go
    const saved = (localStorage.getItem('googtrans') || '').split('/').pop();
    if (saved && saved !== PAGE_LANG) applyLang(saved);
  });

  // --- 7) Automatyczne podpięcie pod Twój UI ---
  //  a) <select id="bhLang"> lub dowolny <select> w .langpick
  document.addEventListener('change', (e) => {
    const t = e.target;
    if (t && (t.id === 'bhLang' || t.closest('.langpick'))) {
      applyLang(t.value);
    }
  });
  //  b) dowolny element z atrybutem data-lang="en" / "pl" itd.
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-lang]');
    if (btn) applyLang(btn.getAttribute('data-lang'));
  });
})();
