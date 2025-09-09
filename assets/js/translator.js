/* Boli Help • translator.js (FINAL FAIL-SAFE)
   - natychmiastowe tłumaczenie po wyborze
   - pamięć między podstronami
   - twarde ukrycie banera Google
   - akceptuje kody typu "PL", "EN", "Polski", "English" itd.
*/
(function () {
  const PAGE_LANG = (document.documentElement.getAttribute('lang') || 'pl').toLowerCase();
  const INCLUDED  = 'pl,en,de,fr,it,es,uk,cs,sk,lt,lv,ro,ru,nl,pt';
  const COOKIE_YEARS = 1;

  // --- helper: normalizacja wartości z UI ---
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
  function normLang(value){
    if(!value) return '';
    const v = String(value).toLowerCase().trim();
    return MAP[v] || v.slice(0,2); // "PL" -> "pl", "English" -> "en"
  }

  // --- 1) schowaj baner ---
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
  (function keepKillingBanner(){
    function kill(){
      document.querySelectorAll('.goog-te-banner-frame').forEach(n=>n.remove());
      document.querySelectorAll('.skiptranslate').forEach(n=>{
        if(n!==document.documentElement && n!==document.body) n.remove();
      });
      if(document.body) document.body.style.top='0px';
    }
    kill(); let t=0, iv=setInterval(()=>{kill(); if(++t>80) clearInterval(iv);},100);
    const mo=new MutationObserver(kill);
    mo.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>mo.disconnect(),20000);
  })();

  // --- 2) kontener + loader GT ---
  function ensureContainer(){
    if(!document.getElementById('google_translate_element')){
      const el=document.createElement('div'); el.id='google_translate_element'; el.style.display='none';
      document.body.appendChild(el);
    }
  }
  let ready;
  function loadGT(){
    if(ready) return ready;
    ready = new Promise(res=>{
      window.__bhGTinit = function(){
        try{
          new google.translate.TranslateElement(
            { pageLanguage: PAGE_LANG, includedLanguages: INCLUDED, autoDisplay: false },
            'google_translate_element'
          );
        }catch(e){}
        res();
      };
      const sc=document.createElement('script');
      sc.src='https://translate.google.com/translate_a/element.js?cb=__bhGTinit';
      sc.async=true; document.head.appendChild(sc);
    });
    return ready;
  }

  // --- 3) ustaw i zastosuj język ---
  function setGoogTrans(code){
    const v=`/auto/${code}`;
    const expires=new Date(Date.now()+COOKIE_YEARS*31536e6).toUTCString();
    try{
      document.cookie = `googtrans=${v};path=/;expires=${expires}`;
      localStorage.setItem('googtrans', v);
      localStorage.setItem('googtrans-override', v);
    }catch{}
  }
  async function applyLang(rawCode){
    const code = normLang(rawCode);
    if(!code || code==='auto') return;
    ensureContainer(); await loadGT(); setGoogTrans(code);

    const tryApply=()=>{
      const sel=document.querySelector('.goog-te-combo');
      if(!sel) return false;
      if(sel.value!==code) sel.value=code;
      sel.dispatchEvent(new Event('change',{bubbles:true}));
      return true;
    };
    if(tryApply()) return;
    let n=0; const iv=setInterval(()=>{ if(tryApply()||++n>80) clearInterval(iv); },100);
  }

  // --- 4) API + auto-start ---
  window.BH_setLanguage = (code)=> applyLang(code);

  document.addEventListener('DOMContentLoaded',()=>{
    ensureContainer();

    // priorytet 1: zapisany język
    const saved = normLang((localStorage.getItem('googtrans')||'').split('/').pop());
    if(saved && saved !== PAGE_LANG){ applyLang(saved); return; }

    // priorytet 2: aktualna wartość Twojego selektu (jeśli istnieje i nie jest "pl")
    const uiSelect = document.getElementById('bhLang') || document.querySelector('.langpick select');
    const uiVal = normLang(uiSelect?.value);
    if(uiVal && uiVal !== PAGE_LANG){ applyLang(uiVal); }
  });

  // --- 5) nasłuchiwanie na Twój UI (działa dla wartości PL/EN itd.) ---
  document.addEventListener('change',(e)=>{
    const t=e.target;
    if(t && (t.id==='bhLang' || t.closest('.langpick'))) applyLang(t.value);
  });
  document.addEventListener('click',(e)=>{
    const btn=e.target.closest('[data-lang]');
    if(btn) applyLang(btn.getAttribute('data-lang'));
  });
})();
