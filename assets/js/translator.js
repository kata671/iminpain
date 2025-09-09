/* Boli Help • translator.js (FINAL+)
   - natychmiastowa zmiana języka
   - JEŚLI Google nie zastosuje tłumaczenia w 2.5 s → jednokrotny auto-reload
   - pamięć między stronami
   - baner Google zawsze ukryty (CSS już masz w <head>)
*/
(function () {
  const PAGE_LANG = (document.documentElement.getAttribute('lang') || 'pl').toLowerCase();
  const INCLUDED  = 'pl,en,de,fr,it,es,uk,cs,sk,lt,lv,ro,ru,nl,pt';
  const COOKIE_MS = 31536e6; // 1 rok

  // --- pomocnicze: mapowanie nazw na kody ---
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

  // --- killer banera na wszelki wypadek ---
  (function keepBannerDead(){
    function kill(){
      document.querySelectorAll('.goog-te-banner-frame').forEach(n=>n.remove());
      document.querySelectorAll('.skiptranslate').forEach(n=>{
        if(n!==document.documentElement && n!==document.body) n.remove();
      });
      if(document.body) document.body.style.top='0';
    }
    kill();
    let t=0, iv=setInterval(()=>{kill(); if(++t>300) clearInterval(iv);},100); // ~30s
    const mo=new MutationObserver(kill);
    mo.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>mo.disconnect(),60000);
  })();

  // --- kontener + loader Google ---
  function ensureContainer(){
    if(!document.getElementById('google_translate_element')){
      const el=document.createElement('div'); el.id='google_translate_element'; el.style.display='none';
      document.body.appendChild(el);
    }
  }
  let ready;
  function loadGT(){
    if(ready) return ready;
    ready=new Promise(res=>{
      window.__bhGTinit=function(){
        try{
          new google.translate.TranslateElement(
            {pageLanguage:PAGE_LANG, includedLanguages:INCLUDED, autoDisplay:false},
            'google_translate_element'
          );
        }catch(e){}
        res();
      };
      const s=document.createElement('script');
      s.src='https://translate.google.com/translate_a/element.js?cb=__bhGTinit';
      s.async=true; document.head.appendChild(s);
    });
    return ready;
  }

  // --- zapis wyboru Google ---
  function setGoogTrans(code){
    const val=`/auto/${code}`;
    const exp=new Date(Date.now()+COOKIE_MS).toUTCString();
    try{
      document.cookie=`googtrans=${val};path=/;expires=${exp}`;
      localStorage.setItem('googtrans', val);
      localStorage.setItem('googtrans-override', val);
    }catch{}
  }

  // --- sprawdzanie czy tłumaczenie „weszło” (Google dodaje klasę translated-*) ---
  const isTranslated = () => /\btranslated-(ltr|rtl)\b/.test(document.documentElement.className);

  // --- zastosuj język; jeśli nie zadziała szybko → 1x auto-reload ---
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

    // 1) od razu
    tryApply();

    // 2) kilka szybkich prób
    let n=0; const iv=setInterval(()=>{ if(isTranslated() || tryApply() || ++n>40) clearInterval(iv); },100);

    // 3) twardy fallback: auto-reload tylko raz
    if(!sessionStorage.getItem('bh_gt_reloaded')){
      setTimeout(()=>{
        if(!isTranslated()){
          sessionStorage.setItem('bh_gt_reloaded','1');
          location.reload(); // po odświeżeniu działa zawsze, baner jest ukryty
        }
      }, 2500);
    }else{
      // po pierwszym odświeżeniu – nie powtarzaj w tej sesji
      setTimeout(()=>sessionStorage.removeItem('bh_gt_reloaded'), 2000);
    }
  }

  // Publiczne API + auto-start
  window.BH_setLanguage=(code)=>applyLang(code);

  function autoStart(){
    const saved = norm((localStorage.getItem('googtrans')||'').split('/').pop());
    if(saved && saved!==PAGE_LANG){ applyLang(saved); return; }
    const ui = document.getElementById('bhLang') || document.querySelector('.langpick select');
    const val = norm(ui?.value);
    if(val && val!==PAGE_LANG) applyLang(val);
  }
  document.addEventListener('DOMContentLoaded', autoStart);
  window.addEventListener('load', autoStart);

  // podpięcie do UI
  document.addEventListener('change',(e)=>{
    const t=e.target;
    if(t && (t.id==='bhLang' || t.closest('.langpick'))) applyLang(t.value);
  });
  document.addEventListener('click',(e)=>{
    const b=e.target.closest('[data-lang]');
    if(b) applyLang(b.getAttribute('data-lang'));
  });
})();
