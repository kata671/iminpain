// app.js
(function(){
  // === THEME (ciemny/jasny) ===
  const root=document.documentElement;
  function setTheme(t){
    root.classList.toggle('light', t==='light');
    localStorage.setItem('theme',t);
  }
  const saved=localStorage.getItem('theme') || 
    (matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');
  setTheme(saved);
  document.addEventListener('click',e=>{
    if(e.target && e.target.id==='theme-toggle'){
      setTheme(root.classList.contains('light')?'dark':'light');
    }
  });

  // === SEARCH (tekst -> przekierowanie) ===
  const map = {
    'glowa':'glowa','głowa':'glowa','migrena':'glowa','oczy':'oczy','oko':'oczy',
    'nos':'nos','ucho':'ucho','szyja':'szyja','bark':'bark',
    'ramie':'ramie','ramię':'ramie','lokiec':'lokiec','łokieć':'lokiec',
    'nadgarstek':'nadgarstek','dlon':'dlon','dłoń':'dlon',
    'klatka':'klatka','serce':'serce','plecy':'plecy','brzuch':'brzuch',
    'biodra':'biodra','pachwina':'pachwina','nogi':'nogi','kolano':'kolano',
    'lydka':'lydka','łydka':'lydka','kostka':'kostka','stopa':'stopa'
  };
  function go(term){
    if(!term) return;
    const t=term.toLowerCase().trim();
    let key=Object.keys(map).find(k=>t.includes(k));
    if(!key){ alert('Nie znaleziono. Spróbuj: głowa, brzuch, kolano...'); return; }
    const sex=localStorage.getItem('sex')||'k';
    const id=map[key]+'_'+sex;
    location.href='szczegoly.html?id='+id;
  }
  function bindSearch(){
    const input=document.getElementById('search');
    const btn=document.getElementById('search-btn');
    if(!input||!btn) return;
    btn.addEventListener('click',()=>go(input.value));
    input.addEventListener('keydown',e=>{if(e.key==='Enter') go(input.value);});
  }
  bindSearch();

  // === VOICE SEARCH ===
  let rec=null;
  function startVoice(){
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){ alert('Rozpoznawanie mowy niedostępne w tej przeglądarce.'); return; }
    rec=new SR(); rec.lang='pl-PL'; rec.interimResults=false; rec.maxAlternatives=1;
    rec.onresult=e=>{
      const txt=e.results[0][0].transcript;
      const el=document.getElementById('search'); if(el) el.value=txt;
      go(txt);
    };
    rec.start();
  }
  document.addEventListener('click',e=>{
    if(e.target && e.target.id==='btn-voice') startVoice();
  });

  // === PWA ===
  if('serviceWorker' in navigator){ navigator.serviceWorker.register('service-worker.js'); }
})();
