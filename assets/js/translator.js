/* assets/js/translator.js */
(function () {
  if (window.__bhTranslator__) return;
  window.__bhTranslator__ = true;

  // 1) Kontener pływający (nie wymaga zmian w HTML)
  const box = document.createElement('div');
  box.id = 'bh-translate';
  box.innerHTML = `
    <button id="bh-translate-toggle" aria-expanded="false" aria-controls="bh-translate-panel" title="Tłumacz">
      🌐
    </button>
    <div id="bh-translate-panel" hidden>
      <div id="google_translate_element"></div>
    </div>
  `;
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(box));

  // 2) Prosty styl (wstrzyknięty lokalnie)
  const css = document.createElement('style');
  css.textContent = `
    #bh-translate{position:fixed;right:14px;bottom:14px;z-index:9999;font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial}
    #bh-translate-toggle{
      width:44px;height:44px;border-radius:999px;border:1px solid rgba(255,255,255,.35);
      background: radial-gradient(circle at 30% 20%, rgba(138,168,255,.35), rgba(75,227,190,.25));
      color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.25);cursor:pointer
    }
    #bh-translate-toggle:hover{filter:brightness(1.08)}
    #bh-translate-panel{
      position:absolute;right:0;bottom:52px;background:rgba(10,16,32,.9);backdrop-filter:saturate(130%) blur(8px);
      border:1px solid rgba(255,255,255,.25);border-radius:12px;padding:10px;min-width:220px;box-shadow:0 10px 30px rgba(0,0,0,.35)
    }
    /* Przytnij agresywne style Google */
    #google_translate_element .goog-te-gadget{color:#fff}
    .goog-te-gadget-simple{background:transparent!important;border:none!important}
    .goog-te-gadget-icon{display:none}
    .goog-te-combo{width:100%;padding:6px 8px;border-radius:8px;border:1px solid rgba(255,255,255,.25);background:#0e1733;color:#fff}
    /* Ukryj topbar Google (iframe) po tłumaczeniu */
    .goog-te-banner-frame.skiptranslate{display:none!important}
    body{top:0!important}
  `;
  document.head.appendChild(css);

  // 3) Toggle panelu
  document.addEventListener('click', (e) => {
    const btn = document.getElementById('bh-translate-toggle');
    const panel = document.getElementById('bh-translate-panel');
    if (!btn || !panel) return;
    if (e.target === btn) {
      const open = panel.hasAttribute('hidden') ? false : true;
      if (open) { panel.setAttribute('hidden', ''); btn.setAttribute('aria-expanded','false'); }
      else { panel.removeAttribute('hidden'); btn.setAttribute('aria-expanded','true'); }
    } else if (!box.contains(e.target)) {
      panel.setAttribute('hidden',''); btn.setAttribute('aria-expanded','false');
    }
  });

  // 4) Inicjacja Google Translate jak na stronie głównej
  window.googleTranslateElementInit = function () {
    /* dopasuj języki do swoich potrzeb */
    new google.translate.TranslateElement({
      pageLanguage: 'pl',
      includedLanguages: 'en,de,uk,ru,cs,sk,lt,lv,ro,es,fr,it',
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false
    }, 'google_translate_element');
  };

  // 5) Wczytaj skrypt Google tylko raz
  function loadGT(){
    if (document.getElementById('gt-el')) return;
    const s = document.createElement('script');
    s.id = 'gt-el';
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.defer = true;
    document.head.appendChild(s);
  }
  loadGT();
})();
