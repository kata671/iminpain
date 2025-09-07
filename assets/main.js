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
// ===== PWA: rejestracja service workera =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js', { scope: '/' })
      .then(reg => {
        console.log('SW zarejestrowany:', reg.scope);

        // auto-reload strony, gdy SW się zaktualizuje
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (refreshing) return;
          refreshing = true;
          window.location.reload();
        });
      })
      .catch(err => console.error('SW błąd rejestracji:', err));
  });
}
