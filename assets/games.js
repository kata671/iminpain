/* Boli Help — Gry / Trening — v3.2
   Zmiany:
   - Germ Smash: widoczność na 100% (opacity/scale, tło-kółko, zIndex, pointer-events)
   - Reflex Triage: auto-wybór koloru co ~2s + pulsujący highlight celu
*/
(function(){
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // ====== Modal: open/close ======
  const openMap = { rko:'#gRko', zadlawienie:'#gZdl', aed:'#gAed', triage:'#gTriage', germ:'#gGerm' };

  document.addEventListener('click', (e)=>{
    const openBtn = e.target.closest('[data-game-open]');
    const closeBtn= e.target.closest('[data-game-close]');
    if(openBtn){
      const key = openBtn.getAttribute('data-game-open');
      const modal = $(openMap[key]);
      if(modal){ modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
    }
    if(closeBtn){
      const modal = closeBtn.closest('.bh-games-modal');
      if(modal){ modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
    }
  });
  $$('.bh-games-modal').forEach(m=>{
    m.addEventListener('click', (e)=>{ if(e.target===m){ m.setAttribute('aria-hidden','true'); document.body.style.overflow=''; } });
  });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape'){ $$('.bh-games-modal[aria-hidden="false"]').forEach(m=>{ m.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }); } });

  // ====== Toast + Best ======
  const toast = $('#gToast'), toastText = $('#gToastText');
  function showToast(msg){
    if(!toast) return;
    toastText.textContent = msg;
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'), 1800);
  }
  const setBest = (k,v)=>localStorage.setItem('bh_best_'+k, String(v));
  const getBest = (k)=>{ const v=localStorage.getItem('bh_best_'+k); return v?Number(v):null; };

  // ====== RKO Tempo Tap ======
  (function(){
    const tap   = $('#rkoTap');
    const start = $('#rkoStart');
    const reset = $('#rkoReset');
    const bpmEl = $('#rkoBpm');
    const inrEl = $('#rkoInRange');
    const cur   = $('#rkoCursor');
    const tEl   = $('#rkoTime');
    const bestEl= $('#rkoBest');
    if(!tap || !start) return;

    const DURATION = 30_000; // 30s
    let times=[], running=false, t0=0, timer=null, inRangeMs=0, lastTick=0;

    const fmt = ms => Math.max(0, Math.ceil(ms/1000))+'s';
    function computeBpm(){
      if(times.length<2) return 0;
      const lastN = times.slice(-8);
      const diffs = lastN.slice(1).map((t,i)=> t - lastN[i]);
      const avg = diffs.reduce((a,b)=>a+b,0)/diffs.length;
      return Math.round(60_000/avg);
    }
    function updateRange(dt){
      const bpm = computeBpm();
      if(bpm>=100 && bpm<=120) inRangeMs += dt;
      inrEl.textContent = Math.round((inRangeMs/DURATION)*100)+'%';
    }
    function cursorProgress(ms){
      const left = 6 + ( (DURATION-ms) / DURATION ) * 88;
      cur.style.left = left + '%';
    }
    function stop(final=false){
      running=false; clearInterval(timer); timer=null;
      if(final){
        const score = Math.round((inRangeMs/DURATION)*100);
        const best = getBest('rko') ?? 0;
        if(score>best) setBest('rko', score);
        bestEl.textContent = `Najlepszy wynik: ${Math.max(best||0, score)}%`;
        if(score>=70) showToast('🏅 Tempo Master (≥70%)');
      }
    }
    function startRun(){
      times=[]; inRangeMs=0; running=true; t0=performance.now(); lastTick=t0;
      tEl.textContent = fmt(DURATION);
      timer = setInterval(()=>{
        const now=performance.now();
        updateRange(now - lastTick);
        lastTick = now;
        const elapsed = now - t0;
        tEl.textContent = fmt(DURATION - elapsed);
        cursorProgress(DURATION - elapsed);
        if(elapsed>=DURATION) stop(true);
      }, 80);
    }
    tap.addEventListener('click', ()=>{ if(!running) return; times.push(performance.now()); bpmEl.textContent = computeBpm(); });
    document.addEventListener('keydown', (e)=>{ if(e.key===' ' && !$('#gRko').hasAttribute('aria-hidden')){ e.preventDefault(); tap.click(); } });

    start.addEventListener('click', ()=>{ if(!running) startRun(); });
    reset.addEventListener('click', ()=>{ stop(false); bpmEl.textContent='0'; inrEl.textContent='0%'; cur.style.left='6%'; tEl.textContent='30s'; });

    const best = getBest('rko'); if(best!=null) bestEl.textContent = `Najlepszy wynik: ${best}%`;
  })();

  // ====== Zadławienie 5+5 (auto-start) ======
  (function(){
    const start = $('#zdlStart'), reset = $('#zdlReset');
    const bBack = $('#zdlBack'), bAbd = $('#zdlAbd');
    const stEl  = $('#zdlStage'), seqEl = $('#zdlSeq');
    const tEl   = $('#zdlTime'),  scEl  = $('#zdlScore');
    const bestEl= $('#zdlBest');
    if(!start || !bBack || !bAbd) return;

    const LIMIT = 60_000;
    let stage='back', countBack=0, countAbd=0, total=0, running=false, t0=0, timer=null;

    function updateUi(){
      stEl.textContent = stage==='back' ? `Plecy (${countBack+1}/5)` : `Nadbrzusze (${countAbd+1}/5)`;
      scEl.textContent = String(total);
    }
    function switchStage(){
      if(stage==='back'){ stage='abd'; countAbd=0; }
      else { stage='back'; countBack=0; }
      updateUi();
    }
    function realTap(kind){
      if(kind==='back'){ countBack++; total++; if(countBack===5) switchStage(); }
      else { countAbd++; total++; if(countAbd===5) switchStage(); }
      seqEl.textContent='OK'; seqEl.style.color='#cfe2ff'; updateUi();
      if(total>=10 && stage==='back' && countBack===0){ showToast('✅ Pełny cykl 5+5!'); }
    }
    function tap(kind){
      if(!running){ startRun(kind); return; }
      if(kind!==stage){
        seqEl.textContent='BŁĄD (kolejność)'; seqEl.style.color='#ffb3b3';
        total = Math.max(0, total-1); scEl.textContent = String(total);
        return;
      }
      realTap(kind);
    }
    function stop(final=false){
      running=false; clearInterval(timer); timer=null;
      if(final){
        const best = getBest('zdl') ?? 0;
        if(total>best) setBest('zdl', total);
        bestEl.textContent = `Najlepszy wynik: ${Math.max(best||0, total)}`;
        if(total>=20) showToast('🏅 Airway Hero (20+)');
      }
    }
    function startRun(primeKind){
      stage='back'; countBack=0; countAbd=0; total=0; running=true; t0=performance.now();
      tEl.textContent = '60s'; seqEl.textContent='OK'; seqEl.style.color='#cfe2ff'; updateUi();
      timer=setInterval(()=>{
        const left = Math.max(0, LIMIT-(performance.now()-t0));
        tEl.textContent = Math.ceil(left/1000)+'s';
        if(left<=0) stop(true);
      }, 100);
      if(primeKind) realTap(primeKind);
    }

    bBack.addEventListener('click', ()=> tap('back'));
    bAbd.addEventListener('click', ()=> tap('abd'));
    start.addEventListener('click', ()=>{ if(!running) startRun(); });
    reset.addEventListener('click', ()=>{ stop(false); stage='back'; countBack=0; countAbd=0; total=0; tEl.textContent='60s'; seqEl.textContent='OK'; seqEl.style.color='#cfe2ff'; updateUi(); });

    document.addEventListener('keydown', (e)=>{
      const open = !$('#gZdl').hasAttribute('aria-hidden');
      if(!open) return;
      if(e.key.toLowerCase()==='b'){ e.preventDefault(); bBack.click(); }
      if(e.key.toLowerCase()==='a'){ e.preventDefault(); bAbd.click(); }
    });

    const best = getBest('zdl'); if(best!=null) bestEl.textContent = `Najlepszy wynik: ${best}`;
  })();

  // ====== AED Timing ======
  (function(){
    const track = $('#aedTrack'), zone = $('#aedZone'), marker = $('#aedMarker');
    const start = $('#aedStart'), shock = $('#aedShock'), reset = $('#aedReset');
    const rEl   = $('#aedRound'), hitsEl = $('#aedHits'), scoreEl = $('#aedScore'), bestEl = $('#aedBest');
    if(!track || !zone || !marker) return;

    let anim=null, running=false, dir=1, pos=6, speed=0.25; // % per frame
    let round=1, tries=0, hits=0, score=0;

    function zoneHit(){
      const m = pos;
      const zL = parseFloat(zone.style.left);
      const zR = 100 - parseFloat(zone.style.right);
      return m >= zL && m <= zR;
    }
    function setZoneRandom(){
      const width = 18 + Math.random()*18; // 18–36%
      const left  = 10 + Math.random()*(80 - width);
      zone.style.left  = left + '%';
      zone.style.right = (100 - (left+width)) + '%';
    }
    function tick(){
      if(!running) return;
      pos += dir*speed;
      if(pos>=94){ pos=94; dir=-1; }
      if(pos<=6){ pos=6; dir=1; }
      marker.style.left = pos + '%';
      anim = requestAnimationFrame(tick);
    }
    function stopAnim(){ running=false; if(anim) cancelAnimationFrame(anim); anim=null; }
    function updateUi(){
      if(rEl) rEl.textContent = `${round}/3`;
      if(hitsEl) hitsEl.textContent = `${hits}/${tries}`;
      if(scoreEl) scoreEl.textContent = String(score);
    }

    start.addEventListener('click', ()=>{
      if(running) return;
      if(tries>=5){
        tries=0; hits=0; round = Math.min(3, round+1); speed += 0.05;
      }
      setZoneRandom();
      dir = Math.random()<0.5 ? 1 : -1;
      pos = dir===1 ? 6 : 94;
      running=true; tick(); updateUi();
    });

    shock.addEventListener('click', ()=>{
      if(!running) return;
      tries++;
      if(zoneHit()){ hits++; score += 10; showToast('⚡ Trafione! +10'); }
      else { showToast('❌ Pudło'); }
      updateUi();
      if(tries>=5){
        stopAnim();
        if(round>=3){
          const best = getBest('aed') ?? 0;
          if(score>best) setBest('aed', score);
          if(bestEl) bestEl.textContent = `Najlepszy wynik: ${Math.max(best||0, score)}`;
          if(score>=100) showToast('🏅 Shock Ready (100+)');
          round=1; tries=0; hits=0; speed=0.25; pos=6; dir=1; updateUi();
        } else {
          showToast(`Runda ${round} zakończona — Start rundy`);
          round++; tries=0; hits=0; updateUi();
        }
      }
    });

    reset.addEventListener('click', ()=>{
      stopAnim(); round=1; tries=0; hits=0; score=0; speed=0.25; pos=6; dir=1;
      marker.style.left='6%'; updateUi();
    });

    const best = getBest('aed'); if(best!=null && bestEl) bestEl.textContent = `Najlepszy wynik: ${best}`;
    updateUi();
  })();

  // ====== Reflex Triage (auto-kolor + highlight celu) ======
  (function(){
    const board = $('#trBoard');
    const start = $('#trStart'), reset = $('#trReset');
    const bR = $('#trRed'), bY = $('#trYellow'), bG = $('#trGreen');
    const modeEl = $('#trMode'), tEl = $('#trTime'), scEl = $('#trScore'), lvEl = $('#trLives'), bestEl = $('#trBest');
    if(!board || !start) return;

    const DURATION = 30_000;
    let running=false, t0=0, timer=null, spawnTimer=null, targetTimer=null;
    let target='red', score=0, lives=3;

    const emojis = ['🤕','🤒','🤧','🤢','🤕','🤒','🤧','🥴','😵‍💫'];
    const colors = ['red','yellow','green'];
    const colorLabel = c => c==='red'?'🔴 Czerwony':c==='yellow'?'🟡 Żółty':'🟢 Zielony';

    // 9 komórek
    const cells = [];
    for(let i=0;i<9;i++){
      const c=document.createElement('div');
      c.className='triage-cell';
      c.dataset.color='';
      c.style.cursor='pointer';
      c.setAttribute('role','button');
      const face=document.createElement('div');
      face.textContent = emojis[i%emojis.length];
      face.style.fontSize='28px';
      face.style.pointerEvents='none';
      const badge=document.createElement('div'); badge.className='triage-badge'; badge.textContent='';
      c.appendChild(face); c.appendChild(badge);
      board.appendChild(c); cells.push(c);
    }

    function updateModeLabel(){
      modeEl.textContent = 'Klikaj: ' + colorLabel(target);
    }
    function setMode(col){
      target = col; updateModeLabel();
      // podświetl już istniejące cele
      cells.forEach(c=>{
        if(c.dataset.color===col){
          c.style.boxShadow='0 0 0 2px rgba(94,234,212,.8), 0 0 22px rgba(94,234,212,.35)';
        } else {
          c.style.boxShadow='';
        }
      });
    }

    // Auto-zmiana koloru celu co ~2s (można też ręcznie przyciskami)
    function startTargetCallout(){
      targetTimer = setInterval(()=>{
        const newCol = colors[Math.floor(Math.random()*colors.length)];
        setMode(newCol);
      }, 2000);
    }
    function stopTargetCallout(){ clearInterval(targetTimer); targetTimer=null; }

    // Delegacja klików
    board.addEventListener('click', (e)=>{
      if(!running) return;
      const cell = e.target.closest('.triage-cell');
      if(!cell || !board.contains(cell)) return;
      const col = cell.dataset.color;
      if(!col) return;
      const badge = cell.querySelector('.triage-badge');
      if(col===target){
        score += 5; scEl.textContent = String(score);
        cell.dataset.color='';
        cell.classList.remove('triage-red','triage-yellow','triage-green');
        if(badge) badge.textContent='';
        // flash zielony
        cell.style.transition='box-shadow .15s ease';
        cell.style.boxShadow='0 0 0 2px rgba(94,234,212,.9), 0 0 26px rgba(94,234,212,.45)';
        setTimeout(()=>{ cell.style.boxShadow=''; }, 160);
        showToast('✅ Dobry priorytet +5');
      } else {
        lives = Math.max(0, lives-1); lvEl.textContent = String(lives);
        cell.style.transition='box-shadow .15s ease';
        cell.style.boxShadow='0 0 0 2px rgba(255,99,99,.9), 0 0 26px rgba(255,99,99,.45)';
        setTimeout(()=>{ cell.style.boxShadow=''; }, 160);
        showToast('❌ Zły kolor');
        if(lives===0) stop(true);
      }
    });

    // Przyciski trybu (ręczna zmiana celu)
    bR && bR.addEventListener('click', ()=> setMode('red'));
    bY && bY.addEventListener('click', ()=> setMode('yellow'));
    bG && bG.addEventListener('click', ()=> setMode('green'));

    function spawn(){
      const empty = cells.filter(c => !c.dataset.color);
      if(!empty.length) return;
      const c = empty[Math.floor(Math.random()*empty.length)];
      const badge = c.querySelector('.triage-badge');
      const col = colors[Math.floor(Math.random()*colors.length)];
      c.dataset.color = col;
      c.classList.add('triage-'+col);
      if(badge) badge.textContent = col==='red' ? '🔴' : col==='yellow' ? '🟡' : '🟢';
      // highlight jeśli to cel
      if(col===target){
        c.style.boxShadow='0 0 0 2px rgba(94,234,212,.8), 0 0 22px rgba(94,234,212,.35)';
      } else {
        c.style.boxShadow='';
      }
      // znikanie po 1.5s
      setTimeout(()=>{
        if(c.dataset.color===col){
          c.dataset.color='';
          c.classList.remove('triage-red','triage-yellow','triage-green');
          if(badge) badge.textContent='';
          c.style.boxShadow='';
          if(col===target){
            lives = Math.max(0, lives-1); lvEl.textContent = String(lives);
            if(lives===0) stop(true);
          }
        }
      }, 1500);
    }

    function stop(final=false){
      running=false;
      clearInterval(timer); clearInterval(spawnTimer); stopTargetCallout();
      if(final){
        const best = getBest('triage') ?? 0;
        if(score>best) setBest('triage', score);
        if(bestEl) bestEl.textContent = `Najlepszy wynik: ${Math.max(best||0, score)}`;
        if(score>=80) showToast('🏅 Triage Ninja (80+)');
      }
    }
    function startRun(){
      score=0; lives=3; t0=performance.now(); running=true;
      scEl.textContent='0'; lvEl.textContent='3'; tEl.textContent='30s';
      setMode('red'); updateModeLabel(); startTargetCallout();
      spawnTimer = setInterval(spawn, 480);
      timer = setInterval(()=>{
        const left = Math.max(0, DURATION-(performance.now()-t0));
        tEl.textContent = Math.ceil(left/1000)+'s';
        if(left<=0) stop(true);
      }, 120);
    }

    start.addEventListener('click', ()=>{ if(!running) startRun(); });
    reset.addEventListener('click', ()=>{
      clearInterval(timer); clearInterval(spawnTimer); stopTargetCallout(); running=false;
      scEl.textContent='0'; lvEl.textContent='3'; tEl.textContent='30s'; setMode('red');
      cells.forEach(c=>{ c.dataset.color=''; c.classList.remove('triage-red','triage-yellow','triage-green'); const b=c.querySelector('.triage-badge'); if(b) b.textContent=''; c.style.boxShadow=''; });
    });

    const best = getBest('triage'); if(best!=null && bestEl) bestEl.textContent = `Najlepszy wynik: ${best}`;
  })();

  // ====== Germ Smash (opacity/scale, kółko tła, wysoka widoczność) ======
  (function(){
    const board = $('#gmBoard');
    const start = $('#gmStart'), reset = $('#gmReset');
    const tEl = $('#gmTime'), scEl = $('#gmScore'), bestEl = $('#gmBest');
    if(!board || !start) return;

    const DURATION = 30_000;
    let running=false, t0=0, timer=null, spawnTimer=null;
    let score=0;

    // plansza 3x3
    const holes=[];
    for(let i=0;i<9;i++){
      const hole=document.createElement('div'); hole.className='germ-hole'; hole.style.position='relative';
      const germ=document.createElement('div');
      // rdzeń zarazka: emoji na kółku tła
      germ.innerHTML = `<div style="
        position:absolute; inset:0; display:grid; place-items:center;
        width:100%; height:100%;
        ">
        <div style="
          width:66px; height:66px; border-radius:50%;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.85), rgba(255,255,255,.55));
          box-shadow: 0 6px 16px rgba(0,0,0,.45);
          display:grid; place-items:center;
        ">
          <span class="emj" style="font-size:34px; filter: drop-shadow(0 2px 6px rgba(0,0,0,.35))">🦠</span>
        </div>
      </div>`;
      // kontener animacji + widoczności
      Object.assign(germ.style,{
        position:'absolute', inset:'0',
        display:'grid', placeItems:'center',
        opacity:'0', transform:'scale(.6)',
        transition:'opacity .12s ease, transform .12s ease',
        zIndex:'5', pointerEvents:'none', // gdy ukryty
      });
      hole.appendChild(germ); board.appendChild(hole);
      holes.push({hole,germ,up:false,timeout:null});

      // klik na całej „dziurce”
      hole.style.cursor='pointer';
      hole.addEventListener('click', ()=>{
        if(!running || !holes[i].up) return;
        holes[i].up=false;
        germ.style.opacity='0'; germ.style.transform='scale(.6)'; germ.style.pointerEvents='none';
        score += 3; scEl.textContent = String(score);
        showToast('🧼 Sru! +3');
      });
    }

    function setEmoji(germEl){
      const span = germEl.querySelector('.emj');
      if(span) span.textContent = Math.random()<0.5 ? '🦠' : '🤢';
    }

    function popOne(){
      const available = holes.filter(h=>!h.up);
      if(!available.length) return;
      const h = available[Math.floor(Math.random()*available.length)];
      h.up=true;
      setEmoji(h.germ);
      h.germ.style.opacity='1';
      h.germ.style.transform='scale(1)';
      h.germ.style.pointerEvents='auto';
      const stay = 800 + Math.random()*800; // 0.8–1.6s
      h.timeout = setTimeout(()=>{
        h.up=false;
        h.germ.style.opacity='0';
        h.germ.style.transform='scale(.6)';
        h.germ.style.pointerEvents='none';
      }, stay);
    }

    function stop(final=false){
      running=false;
      clearInterval(timer); clearInterval(spawnTimer);
      holes.forEach(h=>{ h.up=false; h.germ.style.opacity='0'; h.germ.style.transform='scale(.6)'; h.germ.style.pointerEvents='none'; clearTimeout(h.timeout); });
      if(final){
        const best = getBest('germ') ?? 0;
        if(score>best) setBest('germ', score);
        if(bestEl) bestEl.textContent = `Najlepszy wynik: ${Math.max(best||0, score)}`;
        if(score>=60) showToast('🏅 Hygiene Hero (60+)');
      }
    }
    function startRun(){
      score=0; scEl.textContent='0'; tEl.textContent='30s'; running=true; t0=performance.now();
      spawnTimer = setInterval(popOne, 520); // spokojniejsze tempo
      timer = setInterval(()=>{
        const left = Math.max(0, DURATION-(performance.now()-t0));
        tEl.textContent = Math.ceil(left/1000)+'s';
        if(left<=0) stop(true);
      }, 120);
    }

    start.addEventListener('click', ()=>{ if(!running) startRun(); });
    reset.addEventListener('click', ()=>{ stop(false); scEl.textContent='0'; tEl.textContent='30s'; });

    const best = getBest('germ'); if(best!=null && bestEl) bestEl.textContent = `Najlepszy wynik: ${best}`;
  })();

})();
