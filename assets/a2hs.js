/* Boli Help — iOS Add to Home Screen + Apple Maps button
   Samointegrujący skrypt: wstrzykuje przycisk, modal i style bez zmian w HTML/CSS.
*/
(function(){
  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isSafari = () => {
    const ua = navigator.userAgent.toLowerCase();
    return isIOS() && !ua.includes('crios') && !ua.includes('fxios');
  };

  function injectStyles(){
    if(document.getElementById('bh-a2hs-styles')) return;
    const css = `
#btn-a2hs { display:none; }
#bh-ios-hint {
  position: fixed; inset: 0; display: none; place-items: center; z-index: 10000;
  background: radial-gradient(50% 50% at 50% 50%, rgba(14,18,48,.88), rgba(14,18,48,.94));
  backdrop-filter: saturate(120%) blur(6px);
}
#bh-ios-hint .panel{
  max-width: 540px; color:#eaf2ff; border-radius:16px; padding:16px;
  background: rgba(60,32,100,.38); border:1px solid rgba(164,107,255,.35);
  box-shadow: 0 18px 46px rgba(8,10,22,.55);
}
#bh-ios-hint .panel h3{ margin:0 0 6px; font-weight:900; letter-spacing:.3px }
#bh-ios-hint .panel ol{ margin:8px 0 0 18px; }
#bh-ios-hint .panel .close{
  appearance:none; margin-top:10px; border-radius:12px; cursor:pointer; font-weight:800;
  padding:8px 12px; border:1px solid rgba(164,107,255,.35); background:rgba(255,255,255,.06); color:#eef2ff;
}
    `.trim();
    const style = document.createElement('style');
    style.id = 'bh-a2hs-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function injectModal(){
    if(document.getElementById('bh-ios-hint')) return;
    const modal = document.createElement('div');
    modal.id = 'bh-ios-hint';
    modal.setAttribute('role','dialog');
    modal.setAttribute('aria-modal','true');
    modal.setAttribute('aria-hidden','true');
    modal.innerHTML = `
      <div class="panel">
        <h3>Dodaj aplikację na ekran główny (iPhone/iPad)</h3>
        <p>W Safari na iOS:</p>
        <ol>
          <li>Stuknij ikonę <strong>Udostępnij</strong> (kwadrat ze strzałką w górę).</li>
          <li>Wybierz <strong>„Dodaj do ekranu początkowego”</strong>.</li>
          <li>Potwierdź nazwę i kliknij <strong>Dodaj</strong>.</li>
        </ol>
        <button class="close" id="bh-ios-hint-close">Zamknij</button>
      </div>
    `;
    document.body.appendChild(modal);
    const close = modal.querySelector('#bh-ios-hint-close');
    const hide = () => { modal.style.display = 'none'; modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; };
    close && close.addEventListener('click', hide);
    modal.addEventListener('click', (e)=>{ if(e.target===modal) hide(); });
  }

  function showHint(){ 
    const modal = document.getElementById('bh-ios-hint');
    if(!modal) return;
    modal.style.display = 'grid';
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  }

  function injectButtons(){
    const actions = document.querySelector('.actions');
    if(!actions) return;

    // A2HS button
    if(!document.getElementById('btn-a2hs')){
      const a2hs = document.createElement('button');
      a2hs.id = 'btn-a2hs';
      a2hs.className = 'btn';
      a2hs.type = 'button';
      a2hs.textContent = '📲 Dodaj na ekran główny';
      a2hs.style.display = 'none';
      actions.appendChild(a2hs);
      a2hs.addEventListener('click', showHint);
    }

    // Apple Maps (na iOS lepszy UX niż Google Maps)
    if(isIOS() && !document.getElementById('btn-applemaps')){
      const amap = document.createElement('a');
      amap.id = 'btn-applemaps';
      amap.className = 'btn';
      amap.href = 'maps://maps.apple.com/?q=szpital%20SOR';
      amap.textContent = '🗺️ Otwórz w Apple Maps';
      amap.rel = 'noopener';
      actions.appendChild(amap);
    }
  }

  function run(){
    injectStyles();
    injectModal();
    injectButtons();

    const btn = document.getElementById('btn-a2hs');

    // Pokaż A2HS tylko w Safari na iOS i tylko gdy nie jest już zainstalowane
    if (isSafari() && !isStandalone()) {
      btn && (btn.style.display = 'inline-flex');

      // Jednorazowa podpowiedź po 2 s (żeby user ją zobaczył)
      const onceKey = 'bh_ios_hint_seen';
      if (!localStorage.getItem(onceKey)) {
        setTimeout(()=>{ if(!isStandalone()) showHint(); localStorage.setItem(onceKey,'1'); }, 2000);
      }
    } else {
      btn && (btn.style.display = 'none');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
