/* Boli Help — Gry / Trening — v3.5
   Dodane gry:
   - Symptom Detective (🕵️‍♀️): wybór poprawnej akcji dla opisu pacjenta (+10 / −5).
   - Red Flag or Not? (🚩): TAK/NIE czy to czerwona flaga (z objaśnieniami).
   Zachowane poprzednie gry i ekran „Gratulacje” + odznaki.
*/
(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  // ====== Modal open/close ======
  const openMap = {
    rko:'#gRko', zadlawienie:'#gZdl', aed:'#gAed', triage:'#gTriage', germ:'#gGerm',
    symptom:'#gSymptom', redflags:'#gRedflags'
  };
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
    setTimeout(()=>toast.classList.remove('show'), 1600);
  }
  const setBest = (k,v)=>localStorage.setItem('bh_best_'+k, String(v));
  const getBest = (k)=>{ const v=localStorage.getItem('bh_best_'+k); return v?Number(v):null; };

  // ====== Gratulacje + konfetti ======
  function confettiOnce(){
    const c=document.createElement('canvas');
    c.width=innerWidth; c.height=innerHeight;
    Object.assign(c.style,{position:'fixed',inset:'0',pointerEvents:'none',zIndex:99999});
    document.body.appendChild(c);
    const ctx=c.getContext('2d');
    let parts=Array.from({length:120},()=>({
      x:Math.random()*c.width, y:-20, vx:-1+Math.random()*2, vy:2+Math.random()*2.5,
      size:3+Math.random()*4, rot:Math.random()*6, vr:-.2+Math.random()*.4,
      color:['#5eead4','#a46bff','#ffd16c','#ff6ec7'][Math.floor(Math.random()*4)],
      life:100
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
     TU: ISTNIEJĄCE GRY (v3.4)
     — RKO, Zadławienie, AED, Reflex Triage, Germ Smash —
     (pozostawione bez zmian funkcjonalnych)
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

    const DURATION = 30_000;
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
        const badge = score>=70 ? '🏅 Tempo Master' : '🎖️ Dobry trening';
        showCongrats(modal, {
          title: 'RKO Tempo — koniec rundy',
          subtitle: `Wynik w zakresie: ${score}%`,
          badge,
          action: ()=>{ bpmEl.textContent='0'; inrEl.textContent='0%'; cur.style.left='6%'; tEl.textContent='30s'; }
        });
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

    start.addEventListener('click', ()=>{ if(running) return; startRun(); });
    reset.addEventListener('click', ()=>{ stop(false); bpmEl.textContent='0'; inrEl.textContent='0%'; cur.style.left='6%'; tEl.textContent='30s'; });

    const best = getBest('rko'); if(best!=null) bestEl.textContent = `Najlepszy wynik: ${best}%`;
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
        const badge = total>=20 ? '🏅 Airway Hero' : '🎖️ Dobra praktyka';
        showCongrats(modal, {
          title: 'Zadławienie 5+5 — koniec czasu',
          subtitle: `Powtórzeń łącznie: ${total}`,
          badge
        });
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

  // --- AED Timing ---
  (function(){
    const modal = $('#gAed');
    const track = $('#aedTrack'), zone = $('#aedZone'), marker = $('#aedMarker');
    const start = $('#aedStart'), shock = $('#aedShock'), reset = $('#aedReset');
    const rEl   = $('#aedRound'), hitsEl = $('#aedHits'), scoreEl = $('#aedScore'), bestEl = $('#aedBest');
    if(!track || !zone || !marker) return;

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
          const badge = score>=100 ? '🏅 Shock Ready' : '🎖️ Solidny wynik';
          showCongrats(modal, {
            title: 'AED Timing — koniec gry',
            subtitle: `Wynik: ${score} punktów`,
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

  // --- Reflex Triage (wersja easy) ---
  (function(){
    const modal = $('#gTriage');
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

    const cells = [];
    for(let i=0;i<9;i++){
      const c=document.createElement('div'); c.className='triage-cell'; c.dataset.color=''; c.style.cursor='pointer'; c.setAttribute('role','button');
      const face=document.createElement('div'); face.textContent = emojis[i%emojis.length]; face.style.fontSize='28px'; face.style.pointerEvents='none';
      const badge=document.createElement('div'); badge.className='triage-badge'; badge.textContent='';
      c.appendChild(face); c.appendChild(badge); board.appendChild(c); cells.push(c);
    }

    function updateModeLabel(){ modeEl.textContent = 'Klikaj: ' + colorLabel(target); }
    function setMode(col){
      target = col; updateModeLabel();
      cells.forEach(c=>{ c.style.boxShadow = (c.dataset.color===col) ? '0 0 0 2px rgba(94,234,212,.85), 0 0 22px rgba(94,234,212,.4)' : ''; });
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
        cell.dataset.color=''; cell.classList.remove('triage-red','triage-yellow','triage-green'); if(badge) badge.textContent='';
        cell.style.transition='box-shadow .15s ease';
        cell.style.boxShadow='0 0 0 2px rgba(94,234,212,.95), 0 0 26px rgba(94,234,212,.5)';
        setTimeout(()=>{ cell.style.boxShadow=''; }, 180);
      } else {
        lives = Math.max(0, lives-1); lvEl.textContent = String(lives);
        cell.style.transition='box-shadow .15s ease';
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
      c.dataset.color = col; c.classList.add('triage-'+col);
      if(badge) badge.textContent = col==='red' ? '🔴' : col==='yellow' ? '🟡' : '🟢';
      c.style.boxShadow = (col===target) ? '0 0 0 2px rgba(94,234,212,.85), 0 0 22px rgba(94,234,212,.4)' : '';
      setTimeout(()=>{
        if(c.dataset.color===col){
          c.dataset.color=''; c.classList.remove('triage-red','triage-yellow','triage-green'); if(badge) badge.textContent=''; c.style.boxShadow='';
          if(col===target){ lives = Math.max(0, lives-1); lvEl.textContent = String(lives); if(lives===0) stop(true); }
        }
      }, 2200);
    }

    function stop(final=false){
      running=false; clearInterval(timer); clearInterval(spawnTimer); stopTargetCallout();
      if(final){
        const best = getBest('triage') ?? 0;
        if(score>best) setBest('triage', score);
        if(bestEl) bestEl.textContent = `Najlepszy wynik: ${Math.max(best||0, score)}`;
        const badge = score>=80 ? '🏅 Triage Ninja' : '🎖️ Uporządkowana akcja';
        showCongrats(modal, {
          title: 'Reflex Triage — koniec czasu',
          subtitle: `Wynik: ${score} • Życia: ${lives}`,
          badge
        });
      }
    }
    function startRun(){
      score=0; lives=3; t0=performance.now(); running=true;
      scEl.textContent='0'; lvEl.textContent='3'; tEl.textContent='30s';
      setMode('red'); updateModeLabel(); startTargetCallout();
      spawnTimer = setInterval(spawn, 700);
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
    const best = getBest('triage'); if(best!=null) bestEl.textContent = `Najlepszy wynik: ${best}`;
  })();

  // --- Germ Smash (twardy layout + kółka 88px) ---
  (function(){
    const modal = $('#gGerm');
    const board = $('#gmBoard');
    const start = $('#gmStart'), reset = $('#gmReset');
    const tEl = $('#gmTime'), scEl = $('#gmScore'), bestEl = $('#gmBest');
    if(!board || !start) return;

    const DURATION = 30_000;
    let running=false, t0=0, timer=null, spawnTimer=null; let score=0;

    Object.assign(board.style,{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'12px', alignItems:'stretch', justifyItems:'stretch', minHeight:'360px' });

    const holes=[];
    for(let i=0;i<9;i++){
      const hole=document.createElement('div');
      Object.assign(hole.style,{ position:'relative', height:'110px', borderRadius:'12px', background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.16)', overflow:'hidden', cursor:'pointer' });
      const core=document.createElement('div');
      core.innerHTML = `<div class="germ-core" style="
        position:absolute; left:50%; top:50%; transform:translate(-50%,-50%) scale(.7);
        width:88px; height:88px; border-radius:50%; background:#2ce6a0; border:3px solid #ffffff;
        box-shadow:0 8px 24px rgba(0,0,0,.55), 0 0 22px rgba(44,230,160,.45);
        display:grid; place-items:center; opacity:0; transition:opacity .14s ease, transform .14s ease;
        z-index:20; pointer-events:none;"><span class="emj" style="font-size:38px; filter: drop-shadow(0 2px 6px rgba(0,0,0,.35))">🦠</span></div>`;
      hole.appendChild(core); board.appendChild(hole);
      const coreEl = core.querySelector('.germ-core'); holes.push({hole, core: coreEl, up:false, timeout:null});
      hole.addEventListener('click', ()=>{
        const h=holes[i]; if(!running || !h.up) return;
        h.up=false; coreEl.style.opacity='0'; coreEl.style.transform='translate(-50%,-50%) scale(.7)'; coreEl.style.pointerEvents='none';
        score += 3; scEl.textContent = String(score); showToast('🧼 Sru! +3');
      });
    }
    function setEmoji(coreEl){ const span = coreEl.querySelector('.emj'); if(span) span.textContent = Math.random()<0.5 ? '🦠' : '🤢'; }
    function popOne(){
      const available = holes.filter(h=>!h.up); if(!available.length) return;
      const h = available[Math.floor(Math.random()*available.length)]; h.up=true;
      setEmoji(h.core); h.core.style.opacity='1'; h.core.style.transform='translate(-50%,-50%) scale(1)'; h.core.style.pointerEvents='auto';
      const stay = 1500 + Math.random()*700;
      h.timeout = setTimeout(()=>{ h.up=false; h.core.style.opacity='0'; h.core.style.transform='translate(-50%,-50%) scale(.7)'; h.core.style.pointerEvents='none'; }, stay);
    }
    function stop(final=false){
      running=false; clearInterval(timer); clearInterval(spawnTimer);
      holes.forEach(h=>{ h.up=false; h.core.style.opacity='0'; h.core.style.transform='translate(-50%,-50%) scale(.7)'; h.core.style.pointerEvents='none'; clearTimeout(h.timeout); });
      if(final){
        const best = getBest('germ') ?? 0; if(score>best) setBest('germ', score);
        if(bestEl) bestEl.textContent = `Najlepszy wynik: ${Math.max(best||0, score)}`;
        const badge = score>=60 ? '🏅 Hygiene Hero' : '🎖️ Czysta robota';
        showCongrats(modal, { title:'Germ Smash — koniec czasu', subtitle:`Wynik: ${score} punktów`, badge });
      }
    }
    function startRun(){
      score=0; scEl.textContent='0'; tEl.textContent='30s'; running=true; t0=performance.now();
      spawnTimer = setInterval(popOne, 800);
      timer = setInterval(()=>{ const left = Math.max(0, 30_000-(performance.now()-t0)); tEl.textContent = Math.ceil(left/1000)+'s'; if(left<=0) stop(true); }, 120);
    }
    start.addEventListener('click', ()=>{ if(!running) startRun(); });
    reset.addEventListener('click', ()=>{ stop(false); scEl.textContent='0'; tEl.textContent='30s'; });
    const best = getBest('germ'); if(best!=null) bestEl.textContent = `Najlepszy wynik: ${best}`;
  })();

  /* =========================
     NOWE GRY
     ========================= */

  // --- Symptom Detective (🕵️‍♀️) ---
  (function(){
    const modal = $('#gSymptom');
    const start = $('#symStart'), reset = $('#symReset');
    const caseEl = $('#symCase'), answersEl = $('#symAnswers');
    const timeEl = $('#symTime'), scoreEl = $('#symScore'), bestEl = $('#symBest');

    if(!modal || !start || !answersEl) return;

    const DURATION = 60_000;
    let running=false, t0=0, timer=null, score=0, idx=0;

    const CASES = [
      {
        q: "Mężczyzna 55 l., nagły silny ból w klatce piersiowej, bladość, zimny pot.",
        a: ["Podaję wodę i czekam", "Kładę, wzywam 112, rozważam aspirynę (jeśli brak przeciwwskazań)", "Każę zrobić 20 przysiadów"],
        ok: 1,
        tip: "To może być ostry zespół wieńcowy — najpierw 112."
      },
      {
        q: "Kobieta dławi się, nie może mówić, kaszel nieskuteczny.",
        a: ["5 uderzeń między łopatki, potem 5 uciśnięć nadbrzusza", "Podaję pić", "Wkładam palec do gardła"],
        ok: 0,
        tip: "Sekwencja 5+5. Nie podajemy płynów, nie „wymiatanie”."
      },
      {
        q: "Nastolatek po upadku z deskorolki, obrzęk kostki, ból, bez deformacji.",
        a: ["RICE: odpoczynek, lód, ucisk, uniesienie", "Ignoruję i każę biegać", "Podaję antybiotyk"],
        ok: 0,
        tip: "RICE to bezpieczny start przy skręceniu."
      },
      {
        q: "Nieprzytomny oddycha prawidłowo.",
        a: ["Pozycja bezpieczna i kontrola oddechu", "Zostawiam na plecach", "Podaję napój"],
        ok: 0,
        tip: "Pozycja bezpieczna zapobiega zadławieniu."
      },
      {
        q: "Dorosły nie oddycha, brak reakcji.",
        a: ["112 + RKO 30:2, AED gdy dostępny", "Czekam na sąsiada", "Szukam w Internecie"],
        ok: 0,
        tip: "Natychmiast RKO i wezwij pomoc."
      }
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
          idx++;
          renderCase();
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
        showCongrats(modal, { title:'Symptom Detective — koniec czasu', subtitle:`Wynik: ${score}`, badge,
          action: ()=>{ score=0; scoreEl.textContent='0'; timeEl.textContent='60s'; idx=0; } });
      }
    }

    function startRun(){
      running=true; t0=performance.now(); score=0; idx=0;
      scoreEl.textContent='0'; timeEl.textContent='60s'; renderCase();
      timer = setInterval(()=>{
        const left = Math.max(0, DURATION-(performance.now()-t0));
        timeEl.textContent = Math.ceil(left/1000)+'s';
        if(left<=0) stop(true);
      }, 120);
    }

    start.addEventListener('click', ()=>{ if(!running) startRun(); });
    reset.addEventListener('click', ()=>{ stop(false); score=0; scoreEl.textContent='0'; timeEl.textContent='60s'; idx=0; renderCase(); });
    const best = getBest('symptom'); if(best!=null) bestEl.textContent = `Najlepszy wynik: ${best}`;
  })();

  // --- Red Flag or Not? (🚩) ---
  (function(){
    const modal = $('#gRedflags');
    const start = $('#rfStart'), reset = $('#rfReset');
    const yes = $('#rfYes'), no = $('#rfNo');
    const promptEl = $('#rfPrompt'), explainEl = $('#rfExplain');
    const timeEl = $('#rfTime'), scoreEl = $('#rfScore'), bestEl = $('#rfBest');

    if(!modal || !start || !yes || !no) return;

    const DURATION = 45_000;
    let running=false, t0=0, timer=null, score=0, idx=0;

    const ITEMS = [
      { t:"Nagły silny ból głowy „jak piorun”", flag:true,  why:"Możliwy krwotok podpajęczynówkowy — pilna pomoc." },
      { t:"Ucisk w klatce piersiowej z dusznością", flag:true,  why:"Podejrzenie zawału lub zatorowości — 112." },
      { t:"Gorączka 38°C od 24 h, dobre samopoczucie", flag:false, why:"Bez czerwonych flag — obserwacja, nawodnienie." },
      { t:"Utrata przytomności", flag:true,  why:"Zawsze red flag — ocena ABC, 112." },
      { t:"Ból kostki po skręceniu, bez deformacji", flag:false, why:"RICE, w razie wątpliwości konsultacja." },
      { t:"Krótki ból w klatce przy kaszlu, bez duszności", flag:false, why:"Często mięśniowo-nerwowe — obserwuj." },
      { t:"Sztywność karku z gorączką i światłowstrętem", flag:true,  why:"Możliwy ZOMR — pilna pomoc." },
      { t:"Jednostronny niedowład / bełkotliwa mowa", flag:true,  why:"Objawy udaru — natychmiast 112." }
    ];

    function render(){
      const item = ITEMS[idx % ITEMS.length];
      promptEl.textContent = item.t;
      explainEl.textContent = '';
    }
    function answer(isFlag){
      if(!running) return;
      const item = ITEMS[idx % ITEMS.length];
      if(isFlag===item.flag){ score+=5; showToast('✅ +5'); }
      else { score=Math.max(0,score-3); showToast(`❌ -3 • ${item.why}`); }
      scoreEl.textContent = String(score);
      explainEl.textContent = item.why;
      idx++;
      render();
    }

    function stop(final=false){
      running=false; clearInterval(timer); timer=null;
      if(final){
        const best = getBest('redflags') ?? 0;
        if(score>best) setBest('redflags', score);
        if(bestEl) bestEl.textContent = `Najlepszy wynik: ${Math.max(best||0, score)}`;
        const badge = score>=40 ? '🏅 Red Flag Spotter' : '🎖️ Uważny obserwator';
        showCongrats(modal, { title:'Red Flag or Not? — koniec czasu', subtitle:`Wynik: ${score}`, badge,
          action: ()=>{ score=0; scoreEl.textContent='0'; timeEl.textContent='45s'; idx=0; render(); } });
      }
    }
    function startRun(){
      running=true; t0=performance.now(); score=0; idx=0;
      scoreEl.textContent='0'; timeEl.textContent='45s'; render();
      timer = setInterval(()=>{
        const left = Math.max(0, DURATION-(performance.now()-t0));
        timeEl.textContent = Math.ceil(left/1000)+'s';
        if(left<=0) stop(true);
      }, 120);
    }

    start.addEventListener('click', ()=>{ if(!running) startRun(); });
    reset.addEventListener('click', ()=>{ stop(false); score=0; scoreEl.textContent='0'; timeEl.textContent='45s'; idx=0; render(); });
    yes.addEventListener('click', ()=> answer(true));
    no.addEventListener('click', ()=> answer(false));
    const best = getBest('redflags'); if(best!=null) bestEl.textContent = `Najlepszy wynik: ${best}`;
  })();

})();
