/* ====== Akcje przycisków z index/kart wyboru ====== */
(function(){
  const hosp = document.getElementById('btn-hosp');
  if (hosp) hosp.addEventListener('click', ()=>{
    window.open('https://www.google.com/maps/search/SOR+szpital+blisko+mn', '_blank');
  });

  const loc = document.getElementById('btn-loc');
  if (loc) loc.addEventListener('click', ()=>{
    if (!navigator.geolocation) {
      alert('Twoja przeglądarka nie obsługuje geolokalizacji.');
      window.open('https://www.google.com/maps', '_blank');
      return;
    }
    navigator.geolocation.getCurrentPosition(pos=>{
      const { latitude, longitude } = pos.coords;
      window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
    }, ()=>{ window.open('https://www.google.com/maps', '_blank'); });
  });
})();

/* ====== Twój kod: Hotspoty w kartach (zostawiamy 1:1) ====== */
(function(){
  document.querySelectorAll('.segment').forEach(btn => {
    btn.addEventListener('click', () => {
      const gender = btn.parentElement.dataset.gender;     // 'female' | 'male'
      const area   = btn.dataset.area;                     // 'head' | 'torso' | 'legs'

      const map = {
        female: { head:'female-head.html', torso:'female-torso.html', legs:'female-legs.html' },
        male:   { head:'male-head.html',   torso:'male-torso.html',   legs:'male-legs.html' }
      };

      const target = map[gender]?.[area];
      if (target) window.location.href = target;
    });
  });
})();

/* ====== Mikro-UX: klikane „chip” na klawiaturze/focus ====== */
(function(){
  document.querySelectorAll('.chip, .pill, .btn').forEach(el=>{
    el.addEventListener('keyup', e=>{ if(e.key==='Enter') el.click(); });
  });
})();

/* ====== Instalacja PWA – własny przycisk ====== */
(function(){
  let deferredPrompt = null;
  const btn = document.getElementById('btnInstall');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (btn) btn.hidden = false;
  });

  btn?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    btn.disabled = true;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    btn.hidden = true;
    btn.disabled = false;
  });

  window.addEventListener('appinstalled', () => { if (btn) btn.hidden = true; });
})();
