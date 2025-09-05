/* Boli Help — Gry / Trening — v4.0
   UX doprecyzowany + widoczność elementów, instrukcje, pierścień 360° w Bandage.
*/
(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  /* ===== Poziom trudności (globalny) ===== */
  const diffSel = $('#bhDiff');
  const DIFFS = {
    easy:   { rkoDur:35000, rkoGoal:60, zdlDur:70000, aedSpeed:0.22, aedRounds:3, triageDur:35000, triageLives:4, triageStay:2600, triageSpawn:800, germDur:35000, germSpawn:900, germStay:[1700,900], symptomDur:70000, redDur:50000, karaDur:50000, karaTol2:100, karaTol1:160, bandDur:45000, bandSpawn:1000, bandHold:92, bandFailHold:30 },
    normal: { rkoDur:30000, rkoGoal:70, zdlDur:60000, aedSpeed:0.25, aedRounds:3, triageDur:30000, triageLives:3, triageStay:2200, triageSpawn:700, germDur:30000, germSpawn:800, germStay:[1500,700], symptomDur:60000, redDur:45000, karaDur:45000, karaTol2:80,  karaTol1:140, bandDur:40000, bandSpawn:900,  bandHold:100, bandFailHold:35 },
    hard:   { rkoDur:25000, rkoGoal:75, zdlDur:50000, aedSpeed:0.30, aedRounds:4, triageDur:25000, triageLives:2, triageStay:1900, triageSpawn:620, germDur:25000, germSpawn:700, germStay:[1300,600], symptomDur:50000, redDur:40000, karaDur:40000, karaTol2:70,  karaTol1:120, bandDur:35000, bandSpawn:800,  bandHold:110, bandFailHold:45 },
  };
  function getDiffKey(){ return localStorage.getItem('bh_diff') || 'normal'; }
  function setDiffKey(k){ localStorage.setItem('bh_diff', k); }
  function D(){ return DIFFS[getDiffKey()] || DIFFS.normal; }
  if(diffSel){
    diffSel.value = getDiffKey();
    diffSel.addEventListener('change', ()=>{ setDiffKey(diffSel.value); showToast(`🔧 Poziom: ${diffSel.options[diffSel.selectedIndex].textContent}`); });
  }

  /* ===== Modal open/close (bez zmian ID) ===== */
  const openMap = {
    rko:'#gRko', zadlawienie:'#gZdl', aed:'#gAed', triage:'#gTriage', germ:'#gGerm',
    symptom:'#gSymptom', redflags:'#gRedflags', karaoke:'#gKaraoke', bandage:'#gBandage'
  };
  document.addEventListener('click', (e)=>{
    const openBtn = e.target.closest('[data-game-open]');
    const closeBtn= e.target.closest('[data-game-close]');
    if(openBtn){
      const key = openBtn.getAttribute('data-game-open');
      const modal = document.querySelector(openMap[key]);
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

  /* ===== Toast + Best + Konfetti ===== */
  const toast = $('#gToast'), toastText = $('#gToastText');
  function showToast(msg){
    if(!toast) return;
    toastText.textContent = msg;
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'), 1600);
  }
  const setBest = (k,v)=>localStorage.setItem('bh_best_'+k, String(v));
  const getBest = (k)=>{ const v=localStorage.getItem('bh_best_'+k); return v?Number(v):null; };

  function confettiOnce(){
    const c=document.createElement('canvas');
    c.width=innerWidth; c.height=innerHeight;
    Object.assign(c.style,{position:'fixed',inset:'0',pointerEvents:'none',zIndex:99999});
    document.body.appendChild(c);
    const ctx=c.getContext('2d');
    let parts=Array.from({length:140},()=>({
      x:Math.random()*c.width, y:-20, vx:-1+Math.random()*2, vy:2+Math.random()*2.5,
      size:3+Math.random()*4, rot:Math.random()*6, vr:-.2+Math.random()*.4,
      color:['#5eead4','#a46bff','#ffd16c','#ff6ec7'][Math.floor(Math.random()*4)],
      life:110
    }));
    (function tick(){
      ctx.clearRect(0,0,c.width,c.height);
      parts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr; p.vy+=0.02; p.life--;
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
        ctx.fillStyle=p.color; ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);
        ctx.restore();
      });
      parts=parts.filter(p=>p.life>0);
      if(parts.length) requestAnimationFrame(tick); else c.remove();
    })();
  }
  function showCongrats(modalEl, {title='Gratulacje!', subtitle='', badge='🏅', action=()=>{}}){
    if(!modalEl) return;
    let overlay = modalEl.querySelector('.bh-congrats');
    if(!overlay){
      overlay = document.createElement('div');
      overlay.className = 'bh-congrats';
      Object.assign(overlay.style,{
        position:'absolute', inset:'0', display:'grid', placeItems:'center',
        background:'radial-gradient(50% 50% at 50% 50%, rgba(14,18,48,.88), rgba(14,18,48,.92))',
        backdropFilter:'saturate(120%) blur(6px)', zIndex:9999
      });
      modalEl.querySelector('.bh-games-panel')?.appendChild(overlay);
    }
    overlay.innerHTML = `
      <div style="text-align:center; color:#eaf2ff; background:rgba(60,32,100,.42);
                  border:1px solid rgba(164,107,255,.35); border-radius:16px; padding:16px 18px;
                  box-shadow:0 18px 46px rgba(8,10,22,.55), 0 0 22px rgba(164,107,255,.18); max-width:520px;">
        <div style="font-size:42px;line-height:1">${badge}</div>
        <div style="font-weight:900;letter-spacing:.3px;margin:6px 0 4px">${title}</div>
        <div style="color:#cfe2ff;margin-bottom:12px">${subtitle}</div>
        <button id="bhCongratsOk" style="
          appearance:none;border:1px solid rgba(164,107,255,.35);background:rgba(255,255,255,.06);
          color:#eef2ff;border-radius:12px;padding:8px 14px;font-weight:800;cursor:pointer">
          Zagraj ponownie
        </button>
      </div>`;
    overlay.style.display='grid';
    overlay.querySelector('#bhCongratsOk')?.addEventListener('click', ()=>{
      overlay.style.display='none';
      action();
    }, {once:true});
    confettiOnce();
  }

  /* =========================
     GRY (z doprecyzowaniami)
     ========================= */

  // --- RKO Tempo Tap ---
  (function(){
    const modal = $('#gRko');
    const tap   = $('#rkoTap');
    const start = $('#rkoStart');
    const reset = $('#rkoReset');
    const bpmEl = $('#rkoBpm');
    const inrEl = $('#rkoInRange');
    const cur   = $('#rkoCursor');
    const tEl   = $('#rkoTime');
    const bestEl= $('#rkoBest');
    if(!tap || !start) return;

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
      inrEl.textContent = Math.round((inRangeMs/D().rkoDur)*100)+'%';
    }
    function cursorProgress(ms){ const left = 6 + ( (D().rkoDur-ms) / D().rkoDur ) * 88; cur.style.left = left + '%'; }
    function stop(final=false){
      running=false; clearInterval(timer); timer=null;
      if(final){
        const score = Math.round((inRangeMs/D().rkoDur)*100);
        const best = getBest('rko') ?? 0;
        if(score>best) setBest('rko', score);
        bestEl.textContent = `Najlepszy wynik: ${Math.max(best||0, score)}%`;
        const badge = score>=D().rkoGoal ? '🏅 Tempo Master' : '🎖️ Dobry trening';
        showCongrats(modal, {
          title: 'RKO Tempo — koniec rundy',
          subtitle: `W zakresie: ${score}%`,
          badge,
          action: ()=>{ bpmEl.textContent='0'; inrEl.textContent='0%'; cur.style.left='6%'; tEl.textContent=fmt(D().rkoDur); times=[]; inRangeMs=0; }
        });
      }
    }
    function startRun(){
      times=[]; inRangeMs=0; running=true; t0=performance.now(); lastTick=t0;
      tEl.textContent = fmt(D().rkoDur);
      timer = setInterval(()=>{
        const now=performance.now();
        updateRange(now - lastTick);
        lastTick = now;
        const elapsed = now - t0;
        tEl.textContent = fmt(D().rkoDur - elapsed);
        cursorProgress(D().rkoDur - elapsed);
        if(elapsed>=D().rkoDur) stop(true);
      }, 80);
    }
    tap.addEventListener('click', ()=>{ if(!running) return; times.push(performance.now()); bpmEl.textContent = computeBpm(); });
    document.addEventListener('keydown', (e)=>{ if(e.key===' ' && !$('#gRko').hasAttribute('aria-hidden')){ e.preventDefault(); tap.click(); } });
    start.addEventListener('click', ()=>{ if(!running) startRun(); });
    reset.addEventListener('click', ()=>{ stop(false); bpmEl.textContent='0'; inrEl.textContent='0%'; cur.style.left='6%'; tEl.textContent=fmt(D().rkoDur); });
    const best = getBest('rko'); if(best!=null) bestEl.textContent = `Najlepszy wynik: ${best}%`;
    tEl.textContent = fmt(D().rkoDur);
  })();

  // --- Zadławienie 5+5 ---
  (function(){
    const modal = $('#gZdl');
    const start = $('#zdlStart'), reset = $('#zdlReset');
    const bBack = $('#zdlBack'), bAbd = $('#zdlAbd');
    const stEl  = $('#zdlStage'), seqEl = $('#zdlSeq');
    const tEl   = $('#zdlTime'),  scEl  = $('#zdlScore');
    const bestEl= $('#zdlBest');
    if(!start || !bBack || !bAbd) return;

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
      if(total%10===0){ showToast('✅ Pełny cykl 5+5!'); }
    }
    function tap(kind){
      if(!running){ startRun(kind); return; }
      if(kind!==stage){
        seqEl.textContent='BŁĄD: najpierw ' + (stage==='back'?'Plecy':'Nadbrzusze'); seqEl.style.color='#ffb3b3';
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
        const badge = total>=20 ? '🏅 Airway Hero' : '🎖️ Dobra praktyka';
        showCongrats(modal, {
          title: 'Zadławienie 5+5 — koniec czasu',
          subtitle: `Powtórzeń łącznie: ${total}`,
          badge,
          action: ()=>{ tEl.textContent=Math.ceil(D().zdlDur/1000)+'s'; }
        });
      }
    }
    function startRun(primeKind){
      stage='back'; countBack=0; countAbd=0; total=0; running=true; t0=performance.now();
      tEl.textContent = Math.ceil(D().zdlDur/1000)+'s'; seqEl.textContent='OK'; seqEl.style.color='#cfe2ff'; updateUi();
      timer=setInterval(()=>{
        const left = Math.max(0, D().zdlDur-(performance.now()-t0));
        tEl.textContent = Math.ceil(left/1000)+'s';
        if(left<=0) stop(true);
      }, 100);
      if(primeKind) realTap(primeKind);
    }
    bBack.addEventListener('click', ()=> tap('back'));
    bAbd.addEventListener('click', ()=> tap('abd'));
    start.addEventListener('click', ()=>{ if(!running) startRun(); });
    reset.addEventListener('click', ()=>{ stop(false); stage='back'; countBack=0; countAbd=0; total=0; tEl.textContent=Math.ceil(D().zdlDur/1000)+'s'; seqEl.textContent='OK'; seqEl.style.color='#cfe2ff'; updateUi(); });
    document.addEventListener('keydown', (e)=>{
      const open = !$('#gZdl').hasAttribute('aria-hidden');
      if(!open) return;
      if(e.key.toLowerCase()==='b'){ e.preventDefault(); bBack.click(); }
      if(e.key.toLowerCase()==='a'){ e.preventDefault(); bAbd.click(); }
    });
    const best = getBest('zdl'); if(best!=null) bestEl.textContent = `Najlepszy wynik: ${best}`;
  })();

  // --- AED Timing ---
  (function(){
    const modal = $('#gAed');
    const zone = $('#aedZone'), marker = $('#aedMarker');
    const start = $('#aedStart'), shock = $('#aedShock'), reset = $('#aedReset');
    const rEl   = $('#aedRound'), hitsEl = $('#aedHits'), scoreEl = $('#aedScore'), bestEl = $('#aedBest');
    if(!zone || !marker || !start) return;

    let anim=null, running=false, dir=1, pos=6, speed=0.25;
    let round=1, tries=0, hits=0, score=0;

    function zoneHit(){
      const m = pos;
      const zL = parseFloat(zone.style.left);
      const zR = 100 - parseFloat(zone.style.right);
      return m >= zL && m <= zR;
    }
    function setZoneRandom(){
      const width = 18 + Math.random()*18;
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
      if(rEl) rEl.textContent = `${round}/${D().aedRounds}`;
      if(hitsEl) hitsEl.textContent = `${hits}/${tries}`;
      if(scoreEl) scoreEl.textContent = String(score);
    }
    start.addEventListener('click', ()=>{
      if(running) return;
      if(tries>=5){
        tries=0; hits=0; round = Math.min(D().aedRounds, round+1); speed += 0.05;
      }
      setZoneRandom();
      dir = Math.random()<0.5 ? 1 : -1;
      pos = dir===1 ? 6 : 94;
      running=true; speed = (0.2 + (round-1)*0.05) + (D().aedSpeed-0.25); tick(); updateUi();
    });
    shock.addEventListener('click', ()=>{
      if(!running) return;
      tries++;
      if(zoneHit()){ hits++; score += 10; showToast('⚡ Trafione! +10'); }
      else { showToast('❌ Pudło'); }
      updateUi();
      if(tries>=5){
        stopAnim();
        if(round>=D().aedRounds){
          const best = getBest('aed') ?? 0;
          if(score>best) setBest('aed', score);
          if(bestEl) bestEl.textContent = `Najlepszy wynik: ${Math.max(best||0, score)}`;
          const badge = score>=100 ? '🏅 Shock Ready' : '🎖️ Solidny wynik';
          showCongrats(modal, {
            title: 'AED Timing — koniec gry',
            subtitle: `Wynik: ${score} pkt`,
            badge,
            action: ()=>{ round=1; tries=0; hits=0; score=0; speed=0.25; pos=6; dir=1; marker.style.left='6%'; updateUi(); }
          });
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

  // --- Reflex Triage ---
  (function(){
    const modal = $('#gTriage');
    const board = $('#trBoard');
    const start = $('#trStart'), reset = $('#trReset');
    const bR = $('#trRed'), bY = $('#trYellow'), bG = $('#trGreen');
    const modeEl = $('#trMode'), tEl = $('#trTime'), scEl = $('#trScore'), lvEl = $('#trLives'), bestEl = $('#trBest');
    if(!board || !start) return;

    let running=false, t0=0, timer=null, spawnTimer=null, targetTimer=null;
    let target='red', score=0, lives=3;

    const emojis = ['🤕','🤒','🤧','🤢','🥴','😵‍💫','🤕','🤒','🤧'];
    const colors = ['red','yellow','green'];

    const cells = [];
    for(let i=0;i<9;i++){
      const c=document.createElement('div'); c.className='triage-cell'; c.dataset.color=''; c.setAttribute('role','button'); c.setAttribute('aria-label','Pacjent');
      const face=document.createElement('div'); face.textContent = emojis[i%emojis.length]; face.style.fontSize='28px'; face.style.pointerEvents='none';
      const badge=document.createElement('div'); badge.className='triage-badge'; badge.textContent='';
      c.appendChild(face); c.appendChild(badge); board.appendChild(c); cells.push(c);
    }

    function colorLabel(c){ return c==='red'?'🔴 Czerwony':c==='yellow'?'🟡 Żółty':'🟢 Zielony'; }
    function updateModeLabel(){ modeEl.textContent = 'Klikaj: ' + colorLabel(target); }
    function setMode(col){
      target = col; updateModeLabel();
      cells.forEach(c=>{
        const glow = (c.dataset.color===col) ? '0 0 0 2px rgba(94,234,212,.95), 0 0 26px rgba(94,234,212,.5)' : '';
        c.style.boxShadow = glow;
      });
    }
    function startTargetCallout(){ targetTimer = setInterval(()=>{ setMode(colors[Math.floor(Math.random()*colors.length)]); }, 3500); }
    function stopTargetCallout(){ clearInterval(targetTimer); targetTimer=null; }
    function activeCount(){ return cells.filter(c => !!c.dataset.color).length; }

    board.addEventListener('click', (e)=>{
      if(!running) return;
      const cell = e.target.closest('.triage-cell'); if(!cell || !board.contains(cell)) return;
      const col = cell.dataset.color; if(!col) return;
      const badge = cell.querySelector('.triage-badge');
      if(col===target){
        score += 5; scEl.textContent = String(score);
        cell.dataset.color=''; badge.textContent=''; cell.style.boxShadow='0 0 0 2px rgba(94,234,212,.95), 0 0 26px rgba(94,234,212,.5)';
        setTimeout(()=>{ cell.style.boxShadow=''; }, 180);
      } else {
        lives = Math.max(0, lives-1); lvEl.textContent = String(lives);
        cell.style.boxShadow='0 0 0 2px rgba(255,99,99,.95), 0 0 26px rgba(255,99,99,.5)';
        setTimeout(()=>{ cell.style.boxShadow=''; }, 180);
        if(lives===0) stop(true);
      }
    });

    bR && bR.addEventListener('click', ()=> setMode('red'));
    bY && bY.addEventListener('click', ()=> setMode('yellow'));
    bG && bG.addEventListener('click', ()=> setMode('green'));

    function spawn(){
      if(activeCount() >= 4) return;
      const empty = cells.filter(c => !c.dataset.color); if(!empty.length) return;
      const c = empty[Math.floor(Math.random()*empty.length)];
      const badge = c.querySelector('.triage-badge');
      const col = colors[Math.floor(Math.random()*colors.length)];
      c.dataset.color = col;
      badge.textContent = col==='red' ? '🔴' : col==='yellow' ? '🟡' : '🟢';
      c.style.boxShadow = (col===target) ? '0 0 0 2px rgba(94,234,212,.85), 0 0 22px rgba(94,234,212,.4)' : '';
      setTimeout(()=>{
        if(c.dataset.color===col){
          c.dataset.color=''; badge.textContent=''; c.style.boxShadow='';
          if(col===target){ lives = Math.max(0, lives-1); lvEl.textContent = String(lives); if(lives===0) stop(true); }
        }
      }, D().triageStay);
    }

    function stop(final=false){
      running=false; clearInterval(timer); clearInterval(spawnTimer); stopTargetCallout();
      if(final){
        const best = getBest('triage') ?? 0;
        if(score>best) setBest('triage', score);
        bestEl.textContent = `Najlepszy wynik: ${Math.max(best||0, score)}`;
        const badge = score>=80 ? '🏅 Triage Ninja' : '🎖️ Uporządkowana akcja';
        showCongrats(modal, {
          title: 'Reflex Triage — koniec czasu',
          subtitle: `Wynik: ${score} • Życia: ${lives}`,
          badge
        });
      }
    }
    function startRun(){
      score=0; lives=D().triageLives; t0=performance.now(); running=true;
      scEl.textContent='0'; lvEl.textContent=String(lives); tEl.textContent=Math.ceil(D().triageDur/1000)+'s';
      setMode('red'); updateModeLabel(); startTargetCallout();
      spawnTimer = setInterval(spawn, D().triageSpawn);
      timer = setInterval(()=>{
        const left = Math.max(0, D().triageDur-(performance.now()-t0));
        tEl.textContent = Math.ceil(left/1000)+'s';
        if(left<=0) stop(true);
      }, 120);
    }

    start.addEventListener('click', ()=>{ if(!running) startRun(); });
    reset.addEventListener('click', ()=>{
      clearInterval(timer); clearInterval(spawnTimer); stopTargetCallout(); running=false;
      scEl.textContent='0'; lvEl.textContent=String(D().triageLives); tEl.textContent=Math.ceil(D().triageDur/1000)+'s'; setMode('red');
      cells.forEach(c=>{ c.dataset.color=''; const b=c.querySelector('.triage-badge'); if(b) b.textContent=''; c.style.boxShadow=''; });
    });
    const best = getBest('triage'); if(best!=null) bestEl.textContent = `Najlepszy wynik: ${best}`;
  })();

  // --- Germ Smash (wyraźne zarazki + puls) ---
  (function(){
    const modal = $('#gGerm');
    const board = $('#gmBoard');
    const start = $('#gmStart'), reset = $('#gmReset');
    const tEl = $('#gmTime'), scEl = $('#gmScore'), bestEl = $('#gmBest');
    if(!board || !start) return;

    let running=false, t0=0, timer=null, spawnTimer=null; let score=0;

    Object.assign(board.style,{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'12px', alignItems:'stretch', justifyItems:'stretch', minHeight:'360px' });

    const holes=[];
    for(let i=0;i<9;i++){
      const hole=document.createElement('div');
      Object.assign(hole.style,{ position:'relative', height:'120px', borderRadius:'12px', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.16)', overflow:'hidden', cursor:'pointer' });
      const core=document.createElement('div');
      core.innerHTML = `<div class="germ-core" style="
        position:absolute; left:50%; top:50%; transform:translate(-50%,-50%) scale(.65);
        width:94px; height:94px; border-radius:50%;
        background:radial-gradient(circle at 30% 30%, #2ce6a0, #0fbf87);
        border:3px solid #ffffff;
        box-shadow:0 10px 28px rgba(0,0,0,.6), 0 0 26px rgba(44,230,160,.6);
        display:grid; place-items:center; opacity:0; transition:opacity .14s ease, transform .14s ease;
        z-index:20; pointer-events:none;"><span class="emj" style="font-size:42px; filter: drop-shadow(0 2px 6px rgba(0,0,0,.35))">🦠</span></div>`;
      hole.appendChild(core); board.appendChild(hole);
      const coreEl = core.querySelector('.germ-core'); holes.push({hole, core: coreEl, up:false, timeout:null});
      hole.addEventListener('click', ()=>{
        const h=holes[i]; if(!running || !h.up) return;
        h.up=false; coreEl.style.opacity='0'; coreEl.style.transform='translate(-50%,-50%) scale(.55)'; coreEl.style.pointerEvents='none';
        score += 3; scEl.textContent = String(score); showToast('🧼 Sru! +3');
      });
    }
    function setEmoji(coreEl){ const span = coreEl.querySelector('.emj'); if(span) span.textContent = Math.random()<0.5 ? '🦠' : '🤢'; }
    function popOne(){
      const available = holes.filter(h=>!h.up); if(!available.length) return;
      const h = available[Math.floor(Math.random()*available.length)]; h.up=true;
      setEmoji(h.core);
      h.core.style.opacity='1';
      h.core.style.transform='translate(-50%,-50%) scale(1)';
      h.core.style.pointerEvents='auto';
      // delikatny puls
      h.core.animate([{boxShadow:'0 10px 28px rgba(0,0,0,.6), 0 0 18px rgba(44,230,160,.5)'},{boxShadow:'0 10px 28px rgba(0,0,0,.6), 0 0 30px rgba(44,230,160,.75)'}],{duration:520,iterations:3,direction:'alternate'});
      const stay = D().germStay[0] + Math.random()*D().germStay[1];
      h.timeout = setTimeout(()=>{ h.up=false; h.core.style.opacity='0'; h.core.style.transform='translate(-50%,-50%) scale(.55)'; h.core.style.pointerEvents='none'; }, stay);
    }
    function stop(final=false){
      running=false; clearInterval(timer); clearInterval(spawnTimer);
      holes.forEach(h=>{ h.up=false; h.core.style.opacity='0'; h.core.style.transform='translate(-50%,-50%) scale(.55)'; h.core.style.pointerEvents='none'; clearTimeout(h.timeout); });
      if(final){
        const best = getBest('germ') ?? 0; if(score>best) setBest('germ', score);
        if(bestEl) bestEl.textContent = `Najlepszy wynik: ${Math.max(best||0, score)}`;
        const badge = score>=60 ? '🏅 Hygiene Hero' : '🎖️ Czysta robota';
        showCongrats(modal, { title:'Germ Smash — koniec czasu', subtitle:`Wynik: ${score} pkt`, badge,
          action: ()=>{ tEl.textContent=Math.ceil(D().germDur/1000)+'s'; }
        });
      }
    }
    function startRun(){
      score=0; scEl.textContent='0'; tEl.textContent=Math.ceil(D().germDur/1000)+'s'; running=true; t0=performance.now();
      spawnTimer = setInterval(popOne, D().germSpawn);
      timer = setInterval(()=>{ const left = Math.max(0, D().germDur-(performance.now()-t0)); tEl.textContent = Math.ceil(left/1000)+'s'; if(left<=0) stop(true); }, 120);
    }
    start.addEventListener('click', ()=>{ if(!running) startRun(); });
    reset.addEventListener('click', ()=>{ stop(false); scEl.textContent='0'; tEl.textContent=Math.ceil(D().germDur/1000)+'s'; });
    const best = getBest('germ'); if(best!=null) bestEl.textContent = `Najlepszy wynik: ${best}`;
  })();

  // --- Symptom Detective ---
  (function(){
    const modal = $('#gSymptom');
    const start = $('#symStart'), reset = $('#symReset');
    const caseEl = $('#symCase'), answersEl = $('#symAnswers');
    const timeEl = $('#symTime'), scoreEl = $('#symScore'), bestEl = $('#symBest');
    if(!modal || !start || !answersEl) return;

    let running=false, t0=0, timer=null, score=0, idx=0;

    const CASES = [
      { q:"Mężczyzna 55 l., silny ból klatki, pot, bladość.", a:["Podaj wodę","Połóż, 112, rozważ aspirynę","20 przysiadów"], ok:1, tip:"Możliwy OZW — 112." },
      { q:"Ktoś się dławi, nie mówi, kaszel nieskuteczny.", a:["5 uderzeń + 5 uciśnięć","Podaj płyny","„Wymiatanie” palcem"], ok:0, tip:"Sekwencja 5+5." },
      { q:"Upadek, obrzęk kostki, bez deformacji.", a:["RICE","Ignoruj","Antybiotyk"], ok:0, tip:"RICE jest właściwe." },
      { q:"Nieprzytomny, oddycha.", a:["Pozycja bezpieczna","Zostaw na plecach","Podaj napój"], ok:0, tip:"Pozycja bezpieczna." },
      { q:"Brak oddechu.", a:["112+RKO 30:2, AED","Czekaj na sąsiada","Szukaj w necie"], ok:0, tip:"Natychmiast RKO." }
    ];

    function renderCase(){
      const item = CASES[idx % CASES.length];
      caseEl.textContent = item.q;
      answersEl.innerHTML = '';
      item.a.forEach((txt,i)=>{
        const b=document.createElement('button');
        b.className='bh-games-btn'; b.type='button'; b.textContent=txt;
        b.addEventListener('click', ()=>{
          if(!running) return;
          if(i===item.ok){ score+=10; showToast('✅ +10'); }
          else { score=Math.max(0,score-5); showToast(`❌ -5 • ${item.tip}`); }
          scoreEl.textContent=String(score);
          idx++; renderCase();
        });
        answersEl.appendChild(b);
      });
    }

    function stop(final=false){
      running=false; clearInterval(timer); timer=null;
      if(final){
        const best = getBest('symptom') ?? 0;
        if(score>best) setBest('symptom', score);
        if(bestEl) bestEl.textContent = `Najlepszy wynik: ${Math.max(best||0, score)}`;
        const badge = score>=60 ? '🏅 Case Master' : '🎖️ Czujny diagnosta';
        showCongrats(modal, { title:'Symptom Detective — koniec', subtitle:`Wynik: ${score}`, badge,
          action: ()=>{ score=0; scoreEl.textContent='0'; timeEl.textContent=Math.ceil(D().symptomDur/1000)+'s'; idx=0; } });
      }
    }
    function startRun(){
      running=true; t0=performance.now(); score=0; idx=0;
      scoreEl.textContent='0'; timeEl.textContent=Math.ceil(D().symptomDur/1000)+'s'; renderCase();
      timer = setInterval(()=>{
        const left = Math.max(0, D().symptomDur-(performance.now()-t0));
        timeEl.textContent = Math.ceil(left/1000)+'s';
        if(left<=0) stop(true);
      }, 120);
    }

    start.addEventListener('click', ()=>{ if(!running) startRun(); });
    reset.addEventListener('click', ()=>{ stop(false); score=0; scoreEl.textContent='0'; timeEl.textContent=Math.ceil(D().symptomDur/1000)+'s'; idx=0; renderCase(); });
    const best = getBest('symptom'); if(best!=null) bestEl.textContent = `Najlepszy wynik: ${best}`;
    timeEl.textContent = Math.ceil(D().symptomDur/1000)+'s';
  })();

  // --- Red Flag or Not? ---
  (function(){
    const modal = $('#gRedflags');
    const start = $('#rfStart'), reset = $('#rfReset');
    const yes = $('#rfYes'), no = $('#rfNo');
    const promptEl = $('#rfPrompt'), explainEl = $('#rfExplain');
    const timeEl = $('#rfTime'), scoreEl = $('#rfScore'), bestEl = $('#rfBest');
    if(!modal || !start || !yes || !no) return;

    let running=false, t0=0, timer=null, score=0, idx=0;

    const ITEMS = [
      { t:"Nagły ból głowy „piorun”", flag:true,  why:"Możliwy krwotok — pilnie." },
      { t:"Ucisk w klatce z dusznością", flag:true,  why:"Zawał/zator — 112." },
      { t:"Gorączka 38°C 24 h, OK", flag:false, why:"Obserwuj, nawodnienie." },
      { t:"Utrata przytomności", flag:true,  why:"Zawsze red flag." },
      { t:"Skręcenie kostki, bez deformacji", flag:false, why:"RICE." },
      { t:"Ból klatki przy kaszlu", flag:false, why:"Często mięśniowo-nerwowe." },
      { t:"Sztywność karku + gorączka", flag:true,  why:"Możliwy ZOMR." },
      { t:"Niedowład / mowa bełkotliwa", flag:true,  why:"Udar — 112." }
    ];

    function render(){ const item=ITEMS[idx%ITEMS.length]; promptEl.textContent=item.t; explainEl.textContent=''; }
    function answer(isFlag){
      if(!running) return;
      const item = ITEMS[idx % ITEMS.length];
      if(isFlag===item.flag){ score+=5; showToast('✅ +5'); }
      else { score=Math.max(0,score-3); showToast(`❌ -3 • ${item.why}`); }
      scoreEl.textContent = String(score);
      explainEl.textContent = item.why;
      idx++; render();
    }

    function stop(final=false){
      running=false; clearInterval(timer); timer=null;
      if(final){
        const best = getBest('redflags') ?? 0;
        if(score>best) setBest('redflags', score);
        if(bestEl) bestEl.textContent = `Najlepszy wynik: ${Math.max(best||0, score)}`;
        const badge = score>=40 ? '🏅 Red Flag Spotter' : '🎖️ Uważny obserwator';
        showCongrats(modal, { title:'Red Flag or Not? — koniec', subtitle:`Wynik: ${score}`, badge,
          action: ()=>{ score=0; scoreEl.textContent='0'; timeEl.textContent=Math.ceil(D().redDur/1000)+'s'; idx=0; render(); } });
      }
    }
    function startRun(){
      running=true; t0=performance.now(); score=0; idx=0;
      scoreEl.textContent='0'; timeEl.textContent=Math.ceil(D().redDur/1000)+'s'; render();
      timer = setInterval(()=>{
        const left = Math.max(0, D().redDur-(performance.now()-t0));
        timeEl.textContent = Math.ceil(left/1000)+'s';
        if(left<=0) stop(true);
      }, 120);
    }

    start.addEventListener('click', ()=>{ if(!running) startRun(); });
    reset.addEventListener('click', ()=>{ stop(false); score=0; scoreEl.textContent='0'; timeEl.textContent=Math.ceil(D().redDur/1000)+'s'; idx=0; render(); });
    yes.addEventListener('click', ()=> answer(true));
    no.addEventListener('click', ()=> answer(false));
    const best = getBest('redflags'); if(best!=null) bestEl.textContent = `Najlepszy wynik: ${best}`;
    timeEl.textContent = Math.ceil(D().redDur/1000)+'s';
  })();

  // --- CPR Karaoke ---
  (function(){
    const modal = $('#gKaraoke');
    const tap = $('#karTap');
    const start = $('#karStart');
    const reset = $('#karReset');
    const bpmEl = $('#karBpm');
    const beat = $('#karBeat');
    const inEl = $('#karIn');
    const tEl = $('#karTime');
    const scEl = $('#karScore');
    const bestEl = $('#karBest');
    if(!modal || !tap || !start) return;

    const TARGET_BPM = 110; // środek zakresu RKO
    if(bpmEl) bpmEl.textContent = String(TARGET_BPM);

    let running=false, t0=0, timer=null, score=0;
    let nextTick=0, interval=0;

    function schedule(){ interval = 60_000/TARGET_BPM; nextTick = performance.now()+interval; }
    function animateBeat(){
      if(!running) return;
      const phase = ((performance.now()-t0) % (interval*2)) / (interval*2);
      const left = 6 + phase*88;
      beat.style.left = left + '%';
      requestAnimationFrame(animateBeat);
    }
    function judgeTap(){
      const now = performance.now();
      const diff = Math.min(Math.abs(now - nextTick), Math.abs(now - (nextTick-interval)));
      if(diff <= D().karaTol2) { score+=2; showToast('✅ Perfect +2'); }
      else if(diff <= D().karaTol1) { score+=1; showToast('✔️ Good +1'); }
      else { showToast('❌ Offbeat'); }
      scEl.textContent = String(score);
    }
    function startRun(){
      running=true; score=0; scEl.textContent='0'; tEl.textContent=Math.ceil(D().karaDur/1000)+'s';
      t0=performance.now(); schedule();
      timer=setInterval(()=>{
        const now=performance.now();
        if(now >= nextTick) nextTick += interval;
        const left = Math.max(0, D().karaDur-(now-t0));
        tEl.textContent = Math.ceil(left/1000)+'s';
        const maxBeats = Math.floor(D().karaDur/interval);
        const pct = Math.min(100, Math.round((score/(maxBeats*2))*100));
        inEl.textContent = pct + '%';
        if(left<=0) stop(true);
      }, 60);
      requestAnimationFrame(animateBeat);
    }
    function stop(final=false){
      running=false; clearInterval(timer); timer=null;
      if(final){
        const best = getBest('karaoke') ?? 0;
        if(score>best) setBest('karaoke', score);
        if(bestEl) bestEl.textContent = `Najlepszy wynik: ${Math.max(best||0, score)}`;
        const badge = score>=60 ? '🏅 Rhythm Rescuer' : '🎖️ Wyczucie rytmu';
        showCongrats(modal, { title:'CPR Karaoke — koniec', subtitle:`Wynik: ${score}`, badge,
          action: ()=>{ scEl.textContent='0'; tEl.textContent=Math.ceil(D().karaDur/1000)+'s'; inEl.textContent='0%'; } });
      }
    }

    tap.addEventListener('click', ()=>{ if(running) judgeTap(); });
    document.addEventListener('keydown', (e)=>{ if(e.key===' ' && !$('#gKaraoke').hasAttribute('aria-hidden')){ e.preventDefault(); tap.click(); }});
    start.addEventListener('click', ()=>{ if(!running) startRun(); });
    reset.addEventListener('click', ()=>{ stop(false); scEl.textContent='0'; tEl.textContent=Math.ceil(D().karaDur/1000)+'s'; inEl.textContent='0%'; });
    const best = getBest('karaoke'); if(best!=null && bestEl) bestEl.textContent = `Najlepszy wynik: ${best}`;
    tEl.textContent = Math.ceil(D().karaDur/1000)+'s';
  })();

  // --- Bandage Rush (pierścień 360° + jasne zasady) ---
  (function(){
    const modal = $('#gBandage');
    const board = $('#banBoard');
    const start = $('#banStart');
    const reset = $('#banReset');
    const tEl = $('#banTime');
    const scEl = $('#banScore');
    const lvEl = $('#banLives');
    const bestEl = $('#banBest');
    if(!modal || !board || !start) return;

    let running=false, t0=0, timer=null, spawnTimer=null;
    let score=0, lives=3;

    function makeWound(){
      const wrap=document.createElement('div');
      const x = 10 + Math.random()*80;
      const y = 15 + Math.random()*70;
      Object.assign(wrap.style,{
        position:'absolute', width:'98px', height:'98px', borderRadius:'50%',
        left: x + '%', top: y + '%', transform:'translate(-50%,-50%)',
        background:'radial-gradient(circle at 35% 35%, rgba(255,99,99,.35), rgba(255,99,99,.18))',
        border:'2px solid rgba(255,99,99,.6)', boxShadow:'0 8px 24px rgba(0,0,0,.45)', cursor:'pointer'
      });

      // rdzeń rany
      const core=document.createElement('div');
      Object.assign(core.style,{ position:'absolute', inset:'16px', borderRadius:'50%', background:'rgba(255,99,99,.35)', border:'1px solid rgba(255,99,99,.5)' });

      // pierścień postępu (conic-gradient)
      const ring=document.createElement('div');
      Object.assign(ring.style,{
        position:'absolute', inset:'-6px', borderRadius:'50%',
        background: 'conic-gradient(#5eead4 0deg, #5eead4 0deg, rgba(255,255,255,.08) 0deg)',
        boxShadow:'0 0 0 2px rgba(94,234,212,.35), 0 0 22px rgba(94,234,212,.25)',
        pointerEvents:'none'
      });

      wrap.appendChild(ring); wrap.appendChild(core); board.appendChild(wrap);

      let holding=false, prog=0, growInt=null;

      function drawRing(pct){ // 0–100 → 0–360deg
        const deg = Math.round(pct * 3.6);
        ring.style.background = `conic-gradient(#5eead4 ${deg}deg, rgba(255,255,255,.08) ${deg}deg)`;
      }
      function done(){
        clearInterval(growInt);
        wrap.remove();
        score += 10; scEl.textContent = String(score);
        showToast('🩹 Opatrunek +10');
      }
      function fail(){
        if(!running) return;
        lives = Math.max(0, lives-1); lvEl.textContent = String(lives);
        showToast('❌ Za krótko przytrzymane');
        if(lives===0) stop(true);
      }

      wrap.addEventListener('mousedown', (e)=>{ e.preventDefault(); holding=true; grow(); });
      wrap.addEventListener('touchstart', (e)=>{ holding=true; grow(); }, {passive:true});
      document.addEventListener('mouseup', ()=>{ holding=false; stopGrow(); });
      document.addEventListener('touchend', ()=>{ holding=false; stopGrow(); });

      function grow(){
        clearInterval(growInt);
        growInt = setInterval(()=>{
          if(!holding) return;
          prog = Math.min(100, prog+4);
          drawRing(prog);
          if(prog>=D().bandHold) done();
        }, 80);
      }
      function stopGrow(){
        clearInterval(growInt);
        if(prog < D().bandFailHold){ fail(); }
        else { showToast('ℹ️ Jeszcze chwilę trzymaj następnym razem'); }
      }

      // deadline na reakcję
      setTimeout(()=>{ if(board.contains(wrap)){ wrap.remove(); fail(); } }, 3500 + Math.random()*1500);
    }

    function stop(final=false){
      running=false; clearInterval(timer); clearInterval(spawnTimer);
      [...board.children].forEach(ch=>ch.remove());
      if(final){
        const best = getBest('bandage') ?? 0;
        if(score>best) setBest('bandage', score);
        if(bestEl) bestEl.textContent = `Najlepszy wynik: ${Math.max(best||0, score)}`;
        const badge = score>=60 ? '🏅 Quick Healer' : '🎖️ Sprawne ręce';
        showCongrats(modal, { title:'Bandage Rush — koniec', subtitle:`Wynik: ${score} • Życia: ${lives}`, badge,
          action: ()=>{ scEl.textContent='0'; tEl.textContent=Math.ceil(D().bandDur/1000)+'s'; lvEl.textContent='3'; } });
      }
    }
    function startRun(){
      running=true; score=0; lives=3;
      scEl.textContent='0'; lvEl.textContent='3'; tEl.textContent=Math.ceil(D().bandDur/1000)+'s';
      t0=performance.now();
      spawnTimer = setInterval(()=>{ if(!running) return; makeWound(); }, D().bandSpawn);
      timer = setInterval(()=>{
        const left = Math.max(0, D().bandDur-(performance.now()-t0));
        tEl.textContent = Math.ceil(left/1000)+'s';
        if(left<=0) stop(true);
      }, 120);
    }

    start.addEventListener('click', ()=>{ if(!running) startRun(); });
    reset.addEventListener('click', ()=>{ stop(false); scEl.textContent='0'; lvEl.textContent='3'; tEl.textContent=Math.ceil(D().bandDur/1000)+'s'; });
    const best = getBest('bandage'); if(best!=null) bestEl.textContent = `Najlepszy wynik: ${best}`;
    tEl.textContent = Math.ceil(D().bandDur/1000)+'s';
  })();

})();
