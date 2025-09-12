/* ===== Modal Manager (fix X / backdrop / Escape) ===== */
(function(){
  if (window.__bhModalManagerV2) return; // uniknij duplikacji
  window.__bhModalManagerV2 = true;

  function openModal(id){
    const m = document.getElementById(id);
    if (m) m.setAttribute('aria-hidden','false');
  }
  function closeModal(m){
    if (!m) return;
    m.setAttribute('aria-hidden','true');
  }
  function closeAll(){
    document.querySelectorAll('.bh-games-modal[aria-hidden="false"]').forEach(closeModal);
  }

  // otwieranie po data-game-open
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-game-open]');
    if (btn){
      const key = btn.getAttribute('data-game-open'); // np. "aimpro"
      const id  = 'g' + key.charAt(0).toUpperCase() + key.slice(1); // "gAimpro"
      openModal(id);
    }
    // zamykanie po data-game-close
    if (e.target.closest('[data-game-close]')){
      closeModal(e.target.closest('.bh-games-modal'));
    }
  });

  // klik w tło (backdrop)
  document.addEventListener('mousedown', (e)=>{
    const modal = e.target.closest('.bh-games-modal');
    if (modal && e.target === modal){ closeModal(modal); }
  });

  // Escape
  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape') closeAll();
  });
})();
/* ===== 🎯 Aim Pro v2 (grywalne tempo) ===== */
(function(){
  if (window.__aimProV2) return;
  window.__aimProV2 = true;

  const board   = document.getElementById('aimBoard');
  const scoreEl = document.getElementById('aimScore');
  const bestEl  = document.getElementById('aimBest');
  const timeEl  = document.getElementById('aimTime');
  const start   = document.getElementById('aimStart');
  const reset   = document.getElementById('aimReset');
  const diffSel = document.getElementById('bhDiff'); // opcjonalnie z nagłówka

  if(!board || !scoreEl || !timeEl || !start || !reset) return;

  let score=0, best=+localStorage.getItem('aimBest')||0, time=30;
  let timer=null, spawnTimer=null, running=false;

  // bazowe parametry (msec / px)
  const BASE = { life: 1900, spawn: 1100, minSize: 40, maxSize: 72 };

  function kFromDiff(){
    const v = (diffSel && diffSel.value) || 'normal';
    if (v==='easy')   return 0.85;   // łatwiej
    if (v==='hard')   return 1.20;   // trudniej
    return 1.00;                     // normal
  }

  function cfg(){
    const k = kFromDiff();
    return {
      life:    Math.round(BASE.life  / k),         // im wyżej k, tym krócej żyje
      spawn:   Math.round(BASE.spawn / k),         // im wyżej k, tym częściej spawnuje
      minSize: Math.max(32, Math.round(BASE.minSize * (1.05 - (k-1)*0.5))),
      maxSize: Math.max(54, Math.round(BASE.maxSize * (1.05 - (k-1)*0.5))),
    };
  }

  function updateUI(){
    scoreEl.textContent = String(score);
    timeEl.textContent  = time+'s';
    if (bestEl) bestEl.textContent = best ? String(best) : '—';
  }

  function endGame(){
    running=false;
    if (timer) clearInterval(timer);
    if (spawnTimer) clearInterval(spawnTimer);
    if (score>best){ best=score; localStorage.setItem('aimBest',best); }
    updateUI();
    // lekki komunikat (jeśli masz toast, użyje go)
    const t = window.showToast || (m=>alert(m));
    t('Koniec! Wynik: '+score);
  }

  function resetGame(){
    running=false;
    if (timer) clearInterval(timer);
    if (spawnTimer) clearInterval(spawnTimer);
    score=0; time=30; updateUI();
    board.innerHTML='';
  }

  function spawn(){
    if(!running) return;
    const C = cfg();
    const target = document.createElement('div');
    target.style.position='absolute';
    target.style.borderRadius='50%';
    target.style.boxShadow='0 6px 16px rgba(8,10,22,.35), 0 0 0 2px rgba(94,234,212,.35)';
    target.style.background='radial-gradient(circle, rgba(255,255,255,.95) 0%, rgba(164,107,255,.9) 55%, rgba(164,107,255,.4) 100%)';
    // rozmiar i pozycja
    const size = Math.round(Math.random()*(C.maxSize-C.minSize)+C.minSize);
    const maxX = Math.max(0, board.clientWidth  - size - 6);
    const maxY = Math.max(0, board.clientHeight - size - 6);
    const x = Math.round(Math.random()*maxX);
    const y = Math.round(Math.random()*maxY);
    Object.assign(target.style, { width:size+'px', height:size+'px', left:x+'px', top:y+'px', cursor:'pointer' });

    let hit=false;
    target.addEventListener('click', (e)=>{
      if (!running) return;
      e.stopPropagation();
      hit=true;
      score++;
      updateUI();
      target.remove();
    }, { once:true });

    board.appendChild(target);

    // auto-znikanie
    setTimeout(()=>{ if(target.isConnected) target.remove(); }, C.life);
  }

  function startGame(){
    resetGame();
    running=true;
    updateUI();

    const C = cfg();

    // licznik czasu
    timer = setInterval(()=>{
      time--;
      updateUI();
      if (time<=0) endGame();
    }, 1000);

    // spawn co C.spawn ms
    spawnTimer = setInterval(spawn, C.spawn);

    // pierwszy od razu
    spawn();
  }

  // klik w puste pole = pudło (-1, ale nie poniżej 0)
  board.addEventListener('click', ()=>{
    if (!running) return;
    score = Math.max(0, score-1);
    updateUI();
  });

  start.addEventListener('click', startGame);
  reset.addEventListener('click', resetGame);

  // jeśli zmienisz poziom w select — dostosuj dynamikę w locie
  if (diffSel){
    diffSel.addEventListener('change', ()=>{
      if (!running) return;
      // przestartuj z nową dynamiką
      const keepScore = score, keepTime = time;
      startGame();
      score = keepScore;
      time  = keepTime;
      updateUI();
    });
  }

  // stan początkowy
  updateUI();
})();
