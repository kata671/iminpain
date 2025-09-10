/* assets/lang.js — lekki, wspólny przełącznik języka (PL/EN) */

(function(){
  const LS_KEY = 'bh.lang';
  const SUPPORTED = ['pl','en'];

  // odczyt/zapis
  function get() {
    try { 
      const v = (localStorage.getItem(LS_KEY) || '').toLowerCase();
      return SUPPORTED.includes(v) ? v : 'pl';
    } catch(_) { return 'pl'; }
  }
  function set(lang) {
    if(!SUPPORTED.includes(lang)) return;
    try { localStorage.setItem(LS_KEY, lang); } catch(_){}
    // zdarzenie dla wszystkich stron
    try { document.dispatchEvent(new CustomEvent('bh:lang-changed', { detail:{lang} })); } catch(_){}
    // uaktualnij <html lang=...> od razu
    try { document.documentElement.setAttribute('lang', lang); } catch(_){}
  }

  // inicjalizacja (domyślnie PL jeśli brak)
  const current = get();
  try { document.documentElement.setAttribute('lang', current); } catch(_){}

  // eksport
  window.__lang = {
    get,
    set,
    t: (dict, key) => ((dict[get()] && dict[get()][key]) || (dict.pl && dict.pl[key]) || key)
  };

  // podłącz selektor (jeśli jest na stronie)
  function bindPicker(){
    const sel = document.getElementById('bhLangSelect');
    const lab = document.querySelector('#bhLangPick label');
    if(!sel) return;
    sel.value = get();
    if(lab) lab.textContent = (get()==='en' ? 'Language' : 'Język');
    sel.addEventListener('change', ()=> {
      const v = (sel.value || 'pl').toLowerCase();
      set(v);
      if(lab) lab.textContent = (v==='en' ? 'Language' : 'Język');
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindPicker);
  } else {
    bindPicker();
  }
})();
