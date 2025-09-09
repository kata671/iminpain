/* Boli Help • translator.js — ONE-FILE SELF-HEAL (FINAL)
   - usuwa stare/duble style i skrypty tłumacza
   - wstrzykuje poprawny CSS (baner/balony Google schowane)
   - ładuje Google Translate i stosuje język natychmiast
   - pamięta wybór (cookie + localStorage)
   - działa z #bhLang, [data-lang], a gdy brak UI — wstawia mini-przełącznik w prawym górnym rogu
*/

(function () {
  const PAGE_LANG = (document.documentElement.getAttribute('lang') || 'pl').toLowerCase();
  const INCLUDED  = 'pl,en,de,fr,it,es,uk,cs,sk,lt,lv,ro,ru,nl,pt';
  const COOKIE_MS = 31536e6; // 1 rok

  // ---- 0) Jednorazowy porządek: usuń duble styli/loaderów i stare resztki ----
  (function cleanup() {
    // usuń zduplikowane style z tym samym ID
    const styles = Array.from(document.querySelectorAll('style#bh-gt-nobanner'));
    if (styles.length > 1) styles.slice(1).forEach(n => n.remove());

    // usuń wszelkie stare loadery Google Translate
    document.querySelectorAll('script[src*="translate_a/element.js"]').forEach(s => s.remove());

    // usuń widoczne pozostałości w DOM
    const killSel = [
      '.goog-te-banner-frame','.goog-te-balloon-frame','.goog-tooltip','.goog-te-spinner-pos',
      '.goog-te-gadget','.goog-te-gadget-simple','iframe[id^="goog-gt-"]'
    ];
    killSel.forEach(sel => document.querySelectorAll(sel).forEach(n => n.remove()));
    document.querySelectorAll('.skiptranslate').forEach(n => {
      if (n !== document.documentElement && n !== document.body) n.remove();
    });
    if (document.body) document.body.style.top = '0px';
  })();

  // ---- 1) Wstrzyknij właściwy CSS chowający UI Google w STRONIE ----
  (function ensureNoBannerCSS(){
    if (document.getElementById('bh-gt-nobanner')) return;
    const s = document.createElement('style');
    s.id = 'bh-gt-nobanner';
    s.textContent = `
      .goog-te-banner-frame.skiptranslate,
      .goog-te-banner-frame,
      .goog-te-balloon-frame,
      .goog-tooltip,
      .goog-te-spinner-pos { display:none !important; }
      body { top:0 !important; }
      #google_translate_element,
      .goog-logo-link,
      .goog-te-gadget .goog-te-combo { display:none !important; }
    `;
    document.head.appendChild(s);
  })();

  // ---- 2) Mapowanie nazw -> kody, normalizacja ----
  const MAP = {
    polski:'pl', polish:'pl', pl:'pl', 'pl-pl':'pl',
    english:'en', angielski:'en', en:'en', 'en-us':'en', 'en-gb':'en',
    german:'de', deutsch:'de', niemiecki:'de', de:'de',
    french:'fr', francais:'fr', francuski:'fr', fr:'fr',
    italian:'it', italiano:'it', wloski:'it', włoski:'it', it:'it',
    spanish:'es', espanol:'es', hiszpanski:'es', hiszpański:'es', es:'es',
    ukrainian:'uk', ukrainski:'uk', ukraiński:'uk', uk:'uk',
    czech:'cs', czeski:'cs', cs:'cs',
    slovak:'sk', slowacki:'sk', słowacki:'sk', sk:'sk',
    lithuanian:'lt', litewski:'lt', lt:'lt',
    latvian:'lv', lotewski:'lv', lv:'lv',
    romanian:'ro', rumunski:'ro', rumuński:'ro', ro:'ro',
    russian:'ru', rosyjski:'ru', ru:'ru',
    dutch:'nl', holenderski:'nl', nl:'nl',
    portuguese:'pt', portugalski:'pt', pt:'pt'
  };
  const norm = v => (MAP[String(v||'').toLowerCase().trim()] || String(v||'').toLowerCase().slice(0,2));

  // ---- 3) Kontener + loader Google ----
  function ensureContainer(){
    if(!document.getElementById('google_translate_element')){
      const el=document.createElement('div');
      el.id='google_translate_element';
      el.style.display='none';
      document.body.appendChild(el);
    }
  }
  let ready;
  function loadGT(){
    if (ready) return ready;
    ready = new Promise(resolve=>{
      window.__bhGTinit = function(){
        try{
          new google.translate.TranslateElement(
            { pageLanguage: PAGE_LANG, includedLanguages: INCLUDED, autoDisplay: false },
            'google_translate_element'
          );
        }catch(e){}
        resolve();
      };
      const s=document.createElement('script');
      s.src='https://translate.google.com/translate_a/element.js?cb=__bhGTinit';
      s.async=true;
      document.head.appendChild(s);
    });
    return ready;
  }

  // ---- 4) Zapis wyboru + zastosowanie ----
  function setGoogTrans(code){
    const val=`/auto/${code}`;
    const exp=new Date(Date.now()+COOKIE_MS).toUTCString();
    try{
      document.cookie=`googtrans=${val};path=/;expires=${exp}`;
      localStorage.setItem('googtrans', val);
      localStorage.setItem('googtrans-override', val);
    }catch{}
  }
  const isTranslated = () => /\btranslated-(ltr|rtl)\b/.test(document.documentElement.className);

  async function applyLang(raw){
    const code = norm(raw);
    if(!code || code==='auto') return;
    ensureContainer(); await loadGT(); setGoogTrans(code);

    const tryApply=()=>{
      const sel=document.querySelector('.goog-te-combo');
      if(!sel) return false;
      if(sel.value!==code) sel.value=code;
      sel.dispatchEvent(new Event('change',{bubbles:true}));
      return true;
    };

    let n=0; const iv=setInterval(()=>{
      if (isTranslated() || tryApply() || ++n>120) clearInterval(iv); // do 12s
    },100);
  }

  // ---- 5) Publiczne API ----
  window.BH_setLanguage = (code)=> applyLang(code);

  // ---- 6) Auto-start: zapisany język lub bieżąca wartość selektu ----
  function autoStart(){
    const saved = norm((localStorage.getItem('googtrans')||'').split('/').pop());
    if(saved && saved!==PAGE_LANG){ applyLang(saved); return; }
    const ui = document.getElementById('bhLang') || document.querySelector('.langpick select');
    const val = norm(ui?.value);
    if(val && val!==PAGE_LANG) applyLang(val);
  }
  document.addEventListener('DOMContentLoaded', autoStart);
  window.addEventListener('load', autoStart);

  // ---- 7) Podpięcie do istniejącego UI (select #bhLang lub [data-lang]) ----
  document.addEventListener('change',(e)=>{
    const t=e.target;
    if(t && (t.id==='bhLang' || t.closest('.langpick'))) applyLang(t.value);
  });
  document.addEventListener('click',(e)=>{
    const b=e.target.closest('[data-lang]');
    if(b) applyLang(b.getAttribute('data-lang'));
  });

  // ---- 8) Fallback UI: jeśli nie ma przełącznika, wstaw mały w prawym górnym rogu (PL/EN) ----
  (function ensureFallbackUI(){
    const hasUI = document.getElementById('bhLang') || document.querySelector('[data-lang]');
    if (hasUI) return;
    const wrap = document.createElement('div');
    wrap.id = 'bhLangFallback';
    wrap.style.cssText = 'position:fixed;top:12px;right:12px;z-index:99999;display:flex;gap:8px;font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif';
    wrap.innerHTML = `
      <button data-lang="pl" style="padding:6px 10px;border-radius:10px;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.08);color:#fff;font-weight:800;cursor:pointer">PL</button>
      <button data-lang="en" style="padding:6px 10px;border-radius:10px;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.08);color:#fff;font-weight:800;cursor:pointer">EN</button>
    `;
    document.body.appendChild(wrap);
  })();

  // ---- 9) Utrzymuj porządek (baner/tooltipy) także po czasie ----
  (function keepCleanLater(){
    function kill(){
      document.querySelectorAll('.goog-te-banner-frame,.goog-te-balloon-frame,.goog-tooltip,.goog-te-spinner-pos').forEach(n=>n.remove());
      document.querySelectorAll('.skiptranslate').forEach(n=>{
        if(n!==document.documentElement && n!==document.body) n.remove();
      });
      if(document.body) document.body.style.top='0px';
    }
    let t=0, iv=setInterval(()=>{ kill(); if(++t>200) clearInterval(iv); }, 100);
    const mo=new MutationObserver(kill);
    mo.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>mo.disconnect(),40000);
  })();
})();
