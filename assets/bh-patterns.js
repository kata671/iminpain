(function(){
  try{
    if(!(window.BH&&BH.features&&BH.features.patterns)) return;
    const hints=[
      {key:'klatka_reflux_vs_serce',when:(c)=>c.czesc==='klatka',text:'Zgaga + ból promieniujący do lewego ramienia? Objawy potrafią się mylić. Sprawdź czerwone flagi dla klatki i rozważ szybką konsultację.'},
      {key:'lydka_dvt',when:(c)=>c.czesc==='lydka',text:'Jednostronny obrzęk + ból łydki? To może wymagać pilnej oceny (ryzyko zakrzepicy). Sprawdź czerwone flagi.'},
      {key:'kostka_fracture_rule',when:(c)=>c.czesc==='kostka',text:'Ból kostki + brak możliwości zrobienia 4 kroków po urazie → RTG wg reguł Ottawskich.'},
      {key:'kolano_lock_pop',when:(c)=>c.czesc==='kolano',text:'„Trzask” w momencie urazu + blokowanie kolana? Rozważ łąkotkę/ACL — wskazana ocena ortopedyczna.'},
      {key:'oko_chem',when:(c)=>c.czesc==='oko',text:'Kontakt oka z chemikaliami → natychmiast płucz 15–20 min i zgłoś się pilnie.'}
    ];
    const url=new URL(location.href);const czesc=(url.searchParams.get('czesc')||'').toLowerCase();const ctx={czesc};
    const matches=hints.filter(h=>h.when(ctx)); if(!matches.length) return;
    const ban=document.createElement('div');ban.className='bh-banner';
    ban.innerHTML='<div class="title">Uwaga — szybka podpowiedź</div><div class="hints"></div><div style="margin-top:8px;display:flex;gap:8px;justify-content:flex-end"><button class="bh-btn ghost" id="bh-dismiss">OK</button></div>';
    const box=ban.querySelector('.hints');matches.forEach(m=>{const span=document.createElement('div');span.className='bh-chip';span.textContent=m.text;box.appendChild(span);});
    document.body.appendChild(ban);ban.querySelector('#bh-dismiss').addEventListener('click',()=>ban.remove());
  }catch(e){console.warn('BH patterns error',e)}
})();