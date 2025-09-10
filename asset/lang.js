// assets/lang.js  — wspólny tłumacz/synchronizacja PL/EN
(function(){
  const LS_KEY = 'bh.lang';
  const SUP = { pl:1, en:1 };

  // aktualny język (domyślnie PL)
  let lang = (localStorage.getItem(LS_KEY) || document.documentElement.getAttribute('lang') || 'pl').toLowerCase();
  if(!SUP[lang]) lang = 'pl';
  localStorage.setItem(LS_KEY, lang);

  // api
  function applyHtmlLang(){
    try{
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.setAttribute('data-lang', lang);
      // powiadom inne skrypty (np. i18n, porady, szczegóły)
      document.dispatchEvent(new CustomEvent('bh:lang-ready', { detail:{ lang } }));
    }catch(_){}
  }
  function setLang(newLang, opts){
    if(!SUP[newLang]) return;
    lang = newLang.toLowerCase();
    localStorage.setItem(LS_KEY, lang);
    applyHtmlLang();
    // natychmiast powiadom obecny dokument
    document.dispatchEvent(new CustomEvent('bh:lang-changed', { detail:{ lang } }));
    // opcjonalnie odśwież UI na tej stronie (bez przeładowania)
    if(opts && typeof opts.onApply==='function') opts.onApply(lang);
  }

  // eksport
  window.__getLang = () => lang;
  window.__setLang = (l, opts) => setLang(l, opts);

  // zastosuj od strzała
  applyHtmlLang();

  // 1) synchronizacja między kartami/stronami — działa też na telefonie (Safari/Chrome)
  window.addEventListener('storage', (e)=>{
    if(e.key===LS_KEY && e.newValue && SUP[e.newValue]){
      lang = e.newValue.toLowerCase();
      applyHtmlLang();
      document.dispatchEvent(new CustomEvent('bh:lang-changed', { detail:{ lang } }));
    }
  });

  // 2) respektuj ?lang=en|pl w URL (np. gdy linkujesz z zewnątrz)
  try{
    const q = new URLSearchParams(location.search);
    const urlLang = (q.get('lang')||'').toLowerCase();
    if(SUP[urlLang] && urlLang!==lang){
      setLang(urlLang);
    }
  }catch(_){}

  // 3) ponowna aplikacja gdy wracasz do karty (mobilne przełączanie)
  document.addEventListener('visibilitychange', ()=>{
    if(document.visibilityState==='visible'){
      const cur = (localStorage.getItem(LS_KEY)||'pl').toLowerCase();
      if(cur!==lang && SUP[cur]){ lang = cur; applyHtmlLang(); document.dispatchEvent(new CustomEvent('bh:lang-changed',{detail:{lang}})); }
    }
  });
})();
