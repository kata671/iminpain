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
