/* === TRANSLATOR BOOTSTRAP — self-contained, mobile top-right, safe for layouts === */
(function () {
  var SOURCE_LANG = 'pl'; // bazowy język strony
  var LANGS = ''; // puste = wszystkie; możesz np. 'en,de,uk,cs,sk' jeśli chcesz ograniczyć

  /* ---------- helpers: cookies & storage ---------- */
  function setCookie(name, value, days) {
    try {
      var d = new Date();
      d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toUTCString();
      document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
    } catch (e) {}
  }
  function getStoredLang() {
    try { return localStorage.getItem('preferred_lang') || null; } catch (e) { return null; }
  }
  function storeLang(lang) {
    try { localStorage.setItem('preferred_lang', lang); } catch (e) {}
  }
  function applyLang(lang) {
    if (!lang) return;
    setCookie('googtrans', '/' + SOURCE_LANG + '/' + lang, 365);
    // dla poddomen (GitHub Pages): ustaw ponownie bez domeny — przeglądarka przypisze właściwie
    setCookie('googtrans', '/' + SOURCE_LANG + '/' + lang, 365);
    var combo = document.querySelector('select.goog-te-combo');
    if (combo && combo.value !== lang) {
      combo.value = lang;
      var ev = document.createEvent('HTMLEvents');
      ev.initEvent('change', true, true);
      combo.dispatchEvent(ev);
    }
  }

  /* ---------- inject CSS (nie psuje layoutu) ---------- */
  var css = `
  :root{ --translator-top: 10px; --translator-right: 10px; }
  /* Kontener FAB */
  #translator-fab{ position: fixed; z-index: 2147483647; display: inline-flex; align-items: center; gap: 8px; }
  @media (max-width: 768px){
    #translator-fab{
      top: calc(var(--translator-top) + env(safe-area-inset-top));
      right: calc(var(--translator-right) + env(safe-area-inset-right));
      max-width: 56vw; overflow: hidden;
    }
  }
  @media (min-width: 769px){
    /* Desktop – zostaw jak u Ciebie; jeśli chcesz też w prawym górnym, odkomentuj: */
    /* #translator-fab{ top: 10px; right: 10px; } */
  }
  #translator-fab, #translator-fab *{ box-sizing: border-box; }
  /* Minimalny reset widgetu Google, żeby nie puchł */
  #translator-fab .goog-te-gadget{ font-size: 0 !important; line-height: 1 !important; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
  #translator-fab .goog-te-gadget img{ height: 20px !important; width: auto !important; }
  #translator-fab .goog-te-combo{ font-size: 13px !important; padding: 6px 8px !important; max-width: 44vw; overflow: hidden; text-overflow: ellipsis; }
  /* Ukryj baner, który rozwala layout */
  .goog-te-banner-frame.skiptranslate { display: none !important; }
  body { top: 0 !important; }
  /* Minimalny przycisk (ikona globusa), jeśli chcesz opcjonalnie ukryć select i pokazywać menu własne */
  #translator-button{ display: none; } /* domyślnie nie używamy; toolbarem steruje Google */
  `;
  var style = document.createElement('style');
  style.setAttribute('data-translator-style', '1');
  style.innerHTML = css;
  document.head.appendChild(style);

  /* ---------- kontener w prawym górnym + placeholder ---------- */
  function ensureFab() {
    if (!document.getElementById('translator-fab')) {
      var fab = document.createElement('div');
      fab.id = 'translator-fab';
      var ph = document.createElement('div');
      ph.id = 'google_translate_element'; // ważne: Google wstawi tu widget
      fab.appendChild(ph);
      document.body.appendChild(fab);
    }
  }
  ensureFab();

  /* ---------- ładuj Google Translate tylko raz ---------- */
  function loadGoogle(cbName) {
    if (window.google && window.google.translate) return; // już jest
    if (document.querySelector('script[data-gtranslate="1"]')) return; // w trakcie
    var s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=' + encodeURIComponent(cbName);
    s.async = true;
    s.defer = true;
    s.setAttribute('data-gtranslate', '1');
    document.head.appendChild(s);
  }

  /* ---------- inicjalizacja po stronie Google ---------- */
  window.googleTranslateElementInit = function () {
    try {
      /* Jeśli widget już istnieje, nie twórz go drugi raz */
      if (document.querySelector('#google_translate_element .goog-te-gadget')) {
        afterInit();
        return;
      }
      new google.translate.TranslateElement({
        pageLanguage: SOURCE_LANG,
        includedLanguages: LANGS || undefined,
        autoDisplay: false,
        layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL
      }, 'google_translate_element');
      afterInit();
    } catch (e) {
      // ciche
    }
  };

  function afterInit() {
    // ukryj baner
    try {
      var frames = document.querySelectorAll('iframe.goog-te-banner-frame');
      frames.forEach(function (f) { f.style.display = 'none'; });
      document.body.style.top = '0px';
    } catch (e) {}

    // przywróć zapisany język
    applyLang(getStoredLang());

    // nasłuch zmiany języka
    var mo = new MutationObserver(function () {
      var combo = document.querySelector('select.goog-te-combo');
      if (combo && !combo.dataset.bound) {
        combo.dataset.bound = '1';
        combo.addEventListener('change', function () {
          if (combo.value) {
            storeLang(combo.value);
            applyLang(combo.value);
          }
        });
      }
    });
    mo.observe(document.documentElement, { childList: true, subtree: true });

    // na wszelki wypadek – przesuwaj do FAB (gdyby gdzieś indziej wstrzyknął)
    var gadget = document.querySelector('#google_translate_element');
    var fab = document.getElementById('translator-fab');
    if (gadget && fab && gadget.parentElement !== fab) {
      fab.appendChild(gadget);
    }
  }

  // start
  loadGoogle('googleTranslateElementInit');

  // jeżeli z jakiegoś powodu Google się spóźnia — po load spróbuj jeszcze raz dopiąć baner/top
  window.addEventListener('load', function () {
    try {
      var frames = document.querySelectorAll('iframe.goog-te-banner-frame');
      frames.forEach(function (f) { f.style.display = 'none'; });
      document.body.style.top = '0px';
    } catch (e) {}
  });
})();
