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
        const
