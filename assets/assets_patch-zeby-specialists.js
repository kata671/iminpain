// assets/patch-zeby-specialists.js
(function(){
  // wait until computeDocs is defined
  function ready(){
    try{
      if (typeof computeDocs !== 'function') return false;
      return true;
    }catch(e){ return false; }
  }
  function install(){
    if (!ready()) return;
    if (window.__zebyPatched) return; window.__zebyPatched = true;
    const orig = computeDocs;
    window.computeDocs = function(){
      const list = orig();
      try{
        // detect current section
        const params = new URLSearchParams(location.search);
        const czesc = (params.get('czesc')||'').toLowerCase();
        const isEN = (document.documentElement.getAttribute('lang')||'pl').toLowerCase()==='en';
        if (czesc === 'zeby'){
          const addPL = [
            {name:"Stomatolog (dentysta)", why:"Leczenie przyczyny bólu zęba", badge:"poz"},
            {name:"Endodonta (leczenie kanałowe)", why:"Zapalenie miazgi / ropień", badge:"poz"},
            {name:"Chirurg stomatologiczny / szczękowo‑twarzowy", why:"Urazy, głębokie ropnie", badge:"poz"},
            {name:"Pogotowie stomatologiczne", why:"Ostry ból/obrzęk po godzinach", badge:"sor"}
          ];
          const addEN = [
            {name:"Dentist", why:"Definitive dental treatment", badge:"poz"},
            {name:"Endodontist (root canal)", why:"Pulpitis / abscess", badge:"poz"},
            {name:"Oral & maxillofacial surgeon", why:"Trauma, deep abscess", badge:"poz"},
            {name:"Emergency dental service", why:"Out‑of‑hours acute pain/swelling", badge:"sor"}
          ];
          const add = isEN ? addEN : addPL;
          // Avoid duplicates by name
          const set = new Set(list.map(x=>x.name.toLowerCase()));
          add.forEach(x=>{ if(!set.has(x.name.toLowerCase())) list.push(x); });
        }
      }catch(e){ /* no-op */ }
      return list;
    };
  }
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', install);
  }else{
    install();
  }
  // double-check after a moment in case scripts load late
  setTimeout(install, 200);
})();