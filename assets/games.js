/* BoliHelp — Gry / Trening — v4.1 PRO (stabilne sterowanie, UX i tempo)
   Działa z istniejącym gry.html (wersja "po przywróceniu").
   - Uniwersalny manager modali (X / klik w tło / Esc)
   - Spójne Start/Reset/Finish
   - Best score w localStorage
   - Skale trudności (select#bhDiff: easy/normal/hard)
   - Poprawione tempa i hitboxy
*/

(function(){
  // ===== helpers =====
  const $ = (sel, ctx=document)=>ctx.querySelector(sel);
  const $$= (sel, ctx=document)=>Array.from(ctx.querySelectorAll(sel));
  const on = (el,ev,fn)=>el&&el.addEventListener(ev,fn);
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const fmt = n => (n===Infinity||n===-Infinity||Number.isNaN(n)) ? '—' : String(n);

  // Toast
  const toastBox = document.createElement('div');
  Object.assign(toastBox.style,{
    position:'fixed', right:'16px', bottom:'16px', zIndex:10000, display:'none'
  });
  const toastInner=document.createElement('div');
  toastInner.className='box';
  Object.assign(toastInner.style,{
    background:'rgba(60,32,100,.9)', border:'1px solid rgba(164,107,255,.35)', color:'#eafff7',
    borderRadius:'12px', padding:'10px 12px', boxShadow:'0 14px 28px rgba(8,10,22,.5)', font:'600 14px system-ui,Segoe UI,Roboto'
  });
  toastBox.appendChild(toastInner);
  document.addEventListener('DOMContentLoaded',()=>document.body.appendChild(toastBox));
  function showToast(msg, ms=1800){
    toastInner.textContent=msg;
    toastBox.style.display='block';
    clearTimeout(showToast._t);
    showToast._t=setTimeout(()=>toastBox.style.display='none', ms);
  }

  // Difficulty (opcjonalnie; jeśli brak selectu — "normal")
  function diffFactor(){
    const sel = $('#bhDiff');
    const v = sel ? sel.value : 'normal';
    if(v==='easy') return 0.85;
    if(v==='hard') return 1.20;
    return 1.00;
  }

  // Best store
  function bestStore(key, val){
    const old=+localStorage.getItem(key)||0;
    if(val>old){ localStorage.setItem(key, val); return val; }
    return old;
  }

  // Generic timer
  function every(ms, fn){ const id=setInterval(fn,ms); return ()=>clearInterval(id); }

  // ===== MODALS (obsługuje .bh-games-modal) =====
  (function modalManager(){
    const OPEN_SEL  = '[data-game-open]';
    const CLOSE_SEL = '[data-game-close]';
    function openByKey(key){
      const id = 'g'+key.charAt(0).toUpperCase()+key.slice(1);
      const m  = document.getElementById(id);
      if(m) m.setAttribute('aria-hidden','false');
    }
    function close(m){ if(m) m.setAttribute('aria-hidden','true'); }
    function closeAll(){ $$('.bh-games-modal[aria-hidden="false"]').forEach(close); }

    document.addEventListener('click', (e)=>{
      const openBtn = e.target.closest(OPEN_SEL);
      if(openBtn){ openByKey(openBtn.getAttribute('data-game-open')); }
      const closeBtn = e.target.closest(CLOSE_SEL);
      if(closeBtn){ close(closeBtn.closest('.bh-games-modal')); }
    });
    document.addEventListener('mousedown', (e)=>{
      const m = e.target.closest('.bh-games-modal');
      if(m && e.target===m) close(m);
    });
    document.addEventListener('keydown', (e)=>{
      if(e.key==='Escape') closeAll();
    });
  })();

  // ===== RKO Tempo Tap =====
  (function RKO(){
    const btn=$("#rkoTap"), start=$("#rkoStart"), reset=$("#rkoReset");
    const bpmEl=$("#rkoBpm"), inRangeEl=$("#rkoInRange"), timeEl=$("#rkoTime"), bestEl=$("#rkoBest");
    const cursor=$("#rkoCursor");
    if(!btn||!start||!reset) return;

    let t0=0, taps=[], stopTick=null, running=false, best=+localStorage.getItem("rkoBest")||0;
    bestEl && (bestEl.textContent=best?best:'—');

    function update(){
      const dt=(performance.now()-t0)/1000;
      const remain=Math.max(0, 30-dt);
      timeEl && (timeEl.textContent = Math.ceil(remain)+"s");
      if(remain<=0){ finish(); return; }
      if(taps.length>1){
        const deltas=[]; for(let i=1;i<taps.length;i++) deltas.push(taps[i]-taps[i-1]);
        const avg=deltas.reduce((a,b)=>a+b,0)/deltas.length;
        const bpm=clamp(60000/avg, 0, 180);
        bpmEl && (bpmEl.textContent = bpm.toFixed(0));
        const ok=bpm>=100&&bpm<=120;
        inRangeEl && (inRangeEl.textContent = (ok?"✔ ":"✘ ")+bpm.toFixed(0));
        if(cursor){
          const rel = (clamp(bpm,60,120)-60)/60*100;
          cursor.style.left = rel+'%';
        }
        if(ok){
          const score=Math.round(bpm);
          if(score>best){
            best = bestStore("rkoBest", score);
            bestEl && (bestEl.textContent=best);
          }
        }
      }
    }
    function tap(){
      if(!running) return;
      taps.push(performance.now());
    }
    function startGame(){
      if(running) return;
      running=true; taps=[]; t0=performance.now();
      timeEl && (timeEl.textContent="30s");
      stopTick = every(200, update);
      btn.disabled=false;
      start.disabled=true;
      reset.disabled=false;
    }
    function finish(){
      if(!running) return;
      running=false;
      stopTick && stopTick(); stopTick=null;
      showToast("Koniec rundy!");
      start.disabled=false;
      reset.disabled=false;
    }
    function resetGame(){
      running=false;
      stopTick && stopTick(); stopTick=null;
      taps=[]; bpmEl&&(bpmEl.textContent='0'); inRangeEl&&(inRangeEl.textContent='0%'); timeEl&&(timeEl.textContent='30s');
      start.disabled=false; btn.disabled=false;
    }

    on(btn,'click',tap);
    on(document,'keydown',e=>{ if(e.code==='Space') tap(); });
    on(start,'click',startGame);
    on(reset,'click',resetGame);
  })();

  // ===== Zadławienie 5+5 =====
  (function CHOKE(){
    const back=$("#zdlBack"), abd=$("#zdlAbd"), start=$("#zdlStart"), reset=$("#zdlReset");
    const stage=$("#zdlStage"), seq=$("#zdlSeq"), timeEl=$("#zdlTime"), scoreEl=$("#zdlScore"), bestEl=$("#zdlBest");
    if(!back||!abd||!start||!reset) return;

    let time=60, stopTick=null, step=0, score=0, running=false, best=+localStorage.getItem("zdlBest")||0;
    bestEl && (bestEl.textContent=best?best:'—');

    function setStage(){ stage && (stage.textContent = step<5 ? `Plecy (${step+1}/5)` : `Nadbrzusze (${step-4}/5)`); }
    function update(){ timeEl&&(timeEl.textContent=time+"s"); scoreEl&&(scoreEl.textContent=score); }
    function tick(){ time--; update(); if(time<=0) finish(); }
    function startGame(){
      if(running) return;
      time=60; score=0; step=0; seq&&(seq.textContent='OK'); update(); setStage();
      running=true; stopTick=every(1000,tick);
      start.disabled=true; reset.disabled=false;
    }
    function finish(){
      if(!running) return;
      running=false;
      stopTick && stopTick(); stopTick=null;
      if(score>best){ best=bestStore("zdlBest",score); bestEl&&(bestEl.textContent=best); }
      showToast("Koniec! Wynik: "+score);
      start.disabled=false; reset.disabled=false;
    }
    function resetGame(){
      running=false;
      stopTick && stopTick(); stopTick=null;
      time=60; score=0; step=0; seq&&(seq.textContent='OK'); update(); setStage();
      start.disabled=false;
    }
    function action(type){
      if(!running||time<=0) return;
      if((step<5&&type==="B")||(step>=5&&type==="A")){
        step++; seq&&(seq.textContent="OK");
        if(step>=10){ score++; step=0; update(); }
      }else{
        seq&&(seq.textContent="BŁĄD"); step=0;
      }
      setStage();
    }

    on(back,'click',()=>action('B'));
    on(abd,'click',()=>action('A'));
    on(start,'click',startGame);
    on(reset,'click',resetGame);
  })();

  // ===== AED Timing =====
  (function AED(){
    const start=$("#aedStart"), shock=$("#aedShock"), reset=$("#aedReset");
    const roundEl=$("#aedRound"), hitsEl=$("#aedHits"), scoreEl=$("#aedScore"), bestEl=$("#aedBest");
    const marker=$("#aedMarker"), zone=$("#aedZone");
    if(!start||!shock||!reset||!marker||!zone) return;

    let round=1, hits=0, score=0, stopMove=null, running=false, pos=6, dir=1, best=+localStorage.getItem("aedBest")||0;
    bestEl&&(bestEl.textContent=best?best:'—');

    function loop(){
      const spd = 1.4/diffFactor(); // wolniej -> przyjemniej
      pos += dir*spd;
      if(pos>94||pos<6) dir*=-1;
      marker.style.left = pos+"%";
    }
    function update(){ roundEl&&(roundEl.textContent=round+"/3"); hitsEl&&(hitsEl.textContent=hits+"/"+(round-1)); scoreEl&&(scoreEl.textContent=score); }
    function startGame(){
      if(running) return;
      round=1; hits=0; score=0; pos=6; dir=1; update();
      running=true; stopMove=every(16,loop);
      start.disabled=true; reset.disabled=false; shock.disabled=false;
    }
    function shockNow(){
      if(!running) return;
      const left=parseFloat(marker.style.left||pos);
      const zl=parseFloat(zone.style.left)||40; const zr=100-(parseFloat(zone.style.right)||40);
      if(left>=zl&&left<=zr){ hits++; score+=10; showToast("Trafienie! +10"); } else { showToast("Pudło"); }
      round++;
      if(round>3){ finish(); } else update();
    }
    function finish(){
      if(!running) return;
      running=false;
      stopMove && stopMove(); stopMove=null;
      if(score>best){ best=bestStore("aedBest",score); bestEl&&(bestEl.textContent=best); }
      showToast("Koniec! Wynik: "+score);
      start.disabled=false; reset.disabled=false; shock.disabled=true;
    }
    function resetGame(){
      running=false;
      stopMove && stopMove(); stopMove=null;
      round=1; hits=0; score=0; pos=6; dir=1; update();
      start.disabled=false; shock.disabled=true;
    }

    on(start,'click',startGame);
    on(shock,'click',shockNow);
    on(reset,'click',resetGame);
  })();

  // ===== Reflex Triage =====
  (function TRIAGE(){
    const start=$("#trStart"), reset=$("#trReset");
    const modeEl=$("#trMode"), timeEl=$("#trTime"), scoreEl=$("#trScore"), livesEl=$("#trLives"), bestEl=$("#trBest"), board=$("#trBoard");
    const red=$("#trRed"), yellow=$("#trYellow"), green=$("#trGreen");
    if(!start||!reset||!board) return;

    let mode="red", time=30, score=0, lives=3, stopTick=null, running=false, best=+localStorage.getItem("trBest")||0;
    bestEl&&(bestEl.textContent=best?best:'—');

    function update(){
      modeEl && (modeEl.textContent = "Klikaj: "+(mode==="red"?"🔴 Czerwony":mode==="yellow"?"🟡 Żółty":"🟢 Zielony"));
      timeEl && (timeEl.textContent = time+"s");
      scoreEl && (scoreEl.textContent = score);
      livesEl && (livesEl.textContent = lives);
    }
    function finish(){
      running=false;
      stopTick && stopTick(); stopTick=null;
      if(score>best){ best=bestStore("trBest",score); bestEl&&(bestEl.textContent=best); }
      showToast("Koniec! Wynik: "+score);
      start.disabled=false; reset.disabled=false;
    }
    function tick(){ time--; update(); if(time<=0) finish(); }
    function spawn(){
      board.innerHTML="";
      for(let i=0;i<9;i++){
        const cell=document.createElement("button");
        cell.className="triage-cell";
        cell.style.cursor='pointer';
        const icon=["🔴","🟡","🟢"][Math.floor(Math.random()*3)];
        cell.textContent=icon;
        cell.addEventListener("click",()=>{
          if(!running) return;
          const ok = (icon==="🔴"&&mode==="red")||(icon==="🟡"&&mode==="yellow")||(icon==="🟢"&&mode==="green");
          if(ok){ score++; showToast("+1"); } else { lives--; showToast("−1 życie"); if(lives<=0){ finish(); return; } }
          update(); spawn();
        });
        board.appendChild(cell);
      }
    }
    function startGame(){
      if(running) return;
      time=30; score=0; lives=3; update(); spawn();
      running=true; stopTick=every(1000,tick);
      start.disabled=true; reset.disabled=false;
    }
    function resetGame(){
      running=false;
      stopTick && stopTick(); stopTick=null;
      time=30; score=0; lives=3; update(); board.innerHTML="";
      start.disabled=false;
    }

    on(start,'click',startGame);
    on(reset,'click',resetGame);
    on(red,'click',()=>{ mode='red'; if(running) spawn(); update(); });
    on(yellow,'click',()=>{ mode='yellow'; if(running) spawn(); update(); });
    on(green,'click',()=>{ mode='green'; if(running) spawn(); update(); });
  })();

  // ===== Germ Smash =====
  (function GERMS(){
    const start=$("#gmStart"), reset=$("#gmReset"), timeEl=$("#gmTime"), scoreEl=$("#gmScore"), bestEl=$("#gmBest"), board=$("#gmBoard");
    if(!start||!reset||!board) return;

    let time=30, score=0, stopTick=null, running=false, best=+localStorage.getItem("gmBest")||0;
    bestEl&&(bestEl.textContent=best?best:'—');

    function update(){ timeEl&&(timeEl.textContent=time+"s"); scoreEl&&(scoreEl.textContent=score); }
    function finish(){
      running=false; stopTick&&stopTick(); stopTick=null;
      if(score>best){ best=bestStore("gmBest",score); bestEl&&(bestEl.textContent=best); }
      showToast("Koniec! Wynik: "+score);
      start.disabled=false; reset.disabled=false;
    }
    function tick(){ time--; update(); if(time<=0) finish(); else spawn(); }
    function spawn(){
      board.innerHTML="";
      // 3x3 siatka
      for(let i=0;i<9;i++){
        const hole=document.createElement("button");
        hole.setAttribute('aria-label','Otwór');
        hole.style.width='30%'; hole.style.height='64px';
        hole.style.margin='5px'; hole.style.borderRadius='12px';
        hole.style.border='1px solid rgba(255,255,255,.16)';
        hole.style.background='rgba(255,255,255,.05)';
        hole.style.cursor='pointer';
        const active=Math.random()<0.33;
        if(active){ hole.textContent='🦠'; hole.style.boxShadow='0 0 0 2px rgba(94,234,212,.35)'; }
        hole.addEventListener('click',()=>{
          if(!running) return;
          if(hole.textContent==='🦠'){ score++; showToast('+1'); hole.textContent=''; hole.style.boxShadow='none'; update(); }
          else { score = Math.max(0, score-1); showToast('Pudło −1'); update(); }
        });
        board.appendChild(hole);
      }
    }
    function startGame(){
      if(running) return;
      time=30; score=0; update(); board.innerHTML="";
      running=true; stopTick=every(1000,tick); spawn();
      start.disabled=true; reset.disabled=false;
    }
    function resetGame(){
      running=false; stopTick&&stopTick(); stopTick=null;
      time=30; score=0; board.innerHTML=""; update();
      start.disabled=false;
    }

    on(start,'click',startGame);
    on(reset,'click',resetGame);
  })();

  // ===== Symptom Detective =====
  (function SYMPTOM(){
    const start=$("#symStart"), reset=$("#symReset"), timeEl=$("#symTime"), scoreEl=$("#symScore"), bestEl=$("#symBest"), caseEl=$("#symCase"), answersEl=$("#symAnswers");
    if(!start||!reset||!caseEl||!answersEl) return;

    const CASES=[
      {q:"Ból w klatce z dusznością i zimnym potem.", ok:"112", bad:"POZ"},
      {q:"Katar i stan podgorączkowy 37.6°C.", ok:"POZ", bad:"112"},
      {q:"Nagły \"najgorszy w życiu\" ból głowy.", ok:"112", bad:"POZ"},
      {q:"Ból brzucha po obfitym posiłku, bez gorączki.", ok:"POZ", bad:"112"},
    ];
    let time=60, score=0, stopTick=null, running=false, best=+localStorage.getItem("symBest")||0, cur=null;
    bestEl&&(bestEl.textContent=best?best:'—');

    function update(){ timeEl&&(timeEl.textContent=time+"s"); scoreEl&&(scoreEl.textContent=score); }
    function finish(){
      running=false; stopTick&&stopTick(); stopTick=null;
      if(score>best){ best=bestStore("symBest",score); bestEl&&(bestEl.textContent=best); }
      showToast("Koniec! Wynik: "+score);
      start.disabled=false; reset.disabled=false;
    }
    function tick(){ time--; update(); if(time<=0) finish(); }
    function newCase(){
      cur = CASES[Math.floor(Math.random()*CASES.length)];
      caseEl.textContent = cur.q;
      answersEl.innerHTML='';
      [cur.ok, cur.bad].sort(()=>Math.random()-.5).forEach(opt=>{
        const b=document.createElement('button');
        b.className='bh-games-btn'; b.textContent = (opt==='112'?'🚑 112 / SOR':'POZ / lekarz rodzinny');
        b.addEventListener('click',()=>{
          if(!running) return;
          const correct = (opt===cur.ok);
          if(correct){ score++; showToast('✔ Dobrze'); } else { showToast('✘ Spróbuj kolejny'); }
          update(); newCase();
        });
        answersEl.appendChild(b);
      });
    }
    function startGame(){
      if(running) return;
      time=60; score=0; update(); caseEl.textContent='—'; answersEl.innerHTML='';
      running=true; stopTick=every(1000,tick); newCase();
      start.disabled=true; reset.disabled=false;
    }
    function resetGame(){
      running=false; stopTick&&stopTick(); stopTick=null;
      time=60; score=0; update(); caseEl.textContent='—'; answersEl.innerHTML='';
      start.disabled=false;
    }

    on(start,'click',startGame);
    on(reset,'click',resetGame);
  })();

  // ===== Red Flag or Not? =====
  (function REDFLAG(){
    const start=$("#rfStart"), reset=$("#rfReset"), yes=$("#rfYes"), no=$("#rfNo"), timeEl=$("#rfTime"), scoreEl=$("#rfScore"), bestEl=$("#rfBest"), prompt=$("#rfPrompt"), explain=$("#rfExplain");
    if(!start||!reset||!yes||!no||!prompt||!explain) return;

    const CASES=[
      {q:"Nagła jednostronna słabość ręki i mowa niewyraźna.", a:true, why:"Możliwy udar — czerwone flagi."},
      {q:"Lekki katar i ból gardła bez duszności.", a:false, why:"Zwykle infekcja wirusowa — nie czerwona flaga."},
      {q:"Omdlenie z urazem głowy.", a:true, why:"Ryzyko powikłań — pilnie."},
      {q:"Ból brzucha po diecie kapuścianej, bez gorączki.", a:false, why:"Niestrawność — obserwacja/POZ."}
    ];
    let time=45, score=0, stopTick=null, running=false, best=+localStorage.getItem("rfBest")||0, cur=null;
    bestEl&&(bestEl.textContent=best?best:'—');

    function update(){ timeEl&&(timeEl.textContent=time+"s"); scoreEl&&(scoreEl.textContent=score); }
    function finish(){
      running=false; stopTick&&stopTick(); stopTick=null;
      if(score>best){ best=bestStore("rfBest",score); bestEl&&(bestEl.textContent=best); }
      showToast("Koniec! Wynik: "+score);
      start.disabled=false; reset.disabled=false;
    }
    function tick(){ time--; update(); if(time<=0) finish(); }
    function newCase(){ cur = CASES[Math.floor(Math.random()*CASES.length)]; prompt.textContent=cur.q; explain.textContent=''; }
    function check(ans){
      if(!running) return;
      if(ans===cur.a){ score++; explain.textContent="✔ "+cur.why; showToast('+1'); }
      else{ explain.textContent="✘ "+cur.why; }
      update(); newCase();
    }
    function startGame(){
      if(running) return;
      time=45; score=0; update(); newCase();
      running=true; stopTick=every(1000,tick);
      start.disabled=true; reset.disabled=false;
    }
    function resetGame(){
      running=false; stopTick&&stopTick(); stopTick=null;
      time=45; score=0; update(); prompt.textContent='—'; explain.textContent='';
      start.disabled=false;
    }

    on(yes,'click',()=>check(true));
    on(no,'click',()=>check(false));
    on(start,'click',startGame);
    on(reset,'click',resetGame);
  })();

  // ===== CPR Karaoke =====
  (function KARAOKE(){
    const start=$("#karStart"), reset=$("#karReset"), tap=$("#karTap"), bpmEl=$("#karBpm"), inEl=$("#karIn"), scoreEl=$("#karScore"), bestEl=$("#karBest"), timeEl=$("#karTime"), beat=$("#karBeat");
    if(!start||!reset||!tap||!bpmEl||!inEl||!scoreEl||!timeEl||!beat) return;

    const BPM=110, BEAT_MS = Math.round(60000/BPM);
    let timer=null, beatTimer=null, score=0, best=+localStorage.getItem("karBest")||0, time=45, running=false, hits=0, perfects=0;
    bestEl&&(bestEl.textContent=best?best:'—'); bpmEl&&(bpmEl.textContent=BPM);

    function tickBeat(){
      const left = beat.style.left||'6%';
      beat.style.left = (left==='6%'?'94%':'6%');
      beat._last = performance.now();
    }
    function tapNow(){
      if(!running) return;
      const now=performance.now();
      const t0 = beat._last || now;
      const delta = Math.abs(now - t0);
      let pts=0;
      if(delta<=80){ pts=2; perfects++; }
      else if(delta<=140){ pts=1; }
      score+=pts; hits++;
      update();
    }
    function acc(){
      if(!hits) return 0;
      return clamp(Math.round((score/(hits*2))*100),0,100);
    }
    function update(){ scoreEl&&(scoreEl.textContent=score); timeEl&&(timeEl.textContent=time+'s'); inEl&&(inEl.textContent=acc()+"%"); }
    function finish(){
      running=false;
      timer&&clearInterval(timer); timer=null;
      beatTimer&&clearInterval(beatTimer); beatTimer=null;
      if(score>best){ best=bestStore("karBest",score); bestEl&&(bestEl.textContent=best); }
      showToast(`Koniec! Wynik: ${score} (Perfect: ${perfects})`);
      start.disabled=false; reset.disabled=false;
    }
    function startGame(){
      if(running) return;
      score=0; time=45; hits=0; perfects=0; update();
      running=true;
      timer=setInterval(()=>{ time--; update(); if(time<=0) finish(); },1000);
      beatTimer=setInterval(tickBeat,BEAT_MS);
      tickBeat();
      start.disabled=true; reset.disabled=false;
    }
    function resetGame(){
      running=false;
      timer&&clearInterval(timer); timer=null;
      beatTimer&&clearInterval(beatTimer); beatTimer=null;
      score=0; time=45; hits=0; perfects=0; update();
      start.disabled=false;
    }

    on(tap,'click',tapNow);
    on(document,'keydown',e=>{ if(e.code==='Space') tapNow(); });
    on(start,'click',startGame);
    on(reset,'click',resetGame);
  })();

  // ===== Bandage Rush =====
  (function BANDAGE(){
    const start=$("#banStart"), reset=$("#banReset"), board=$("#banBoard"), timeEl=$("#banTime"), scoreEl=$("#banScore"), livesEl=$("#banLives"), bestEl=$("#banBest");
    if(!start||!reset||!board) return;

    let time=40, score=0, lives=3, timer=null, running=false, best=+localStorage.getItem("banBest")||0, progressInt=null;
    bestEl&&(bestEl.textContent=best?best:'—');

    function update(){ timeEl&&(timeEl.textContent=time+"s"); scoreEl&&(scoreEl.textContent=score); livesEl&&(livesEl.textContent=lives); }
    function finish(){
      running=false; timer&&clearInterval(timer); timer=null;
      if(score>best){ best=bestStore("banBest",score); bestEl&&(bestEl.textContent=best); }
      showToast("Koniec! Wynik: "+score);
      start.disabled=false; reset.disabled=false;
      board.innerHTML='';
    }
    function tick(){ time--; update(); if(time<=0) finish(); }
    function spawn(){
      board.innerHTML="";
      const wound=document.createElement("div");
      wound.setAttribute('role','button');
      wound.setAttribute('aria-label','Rana');
      wound.textContent="🩹";
      Object.assign(wound.style,{
        position:'absolute', left:Math.random()*85+'%', top:Math.random()*75+'%',
        fontSize:'34px', cursor:'pointer', userSelect:'none'
      });
      let holding=false, progress=0;
      const ring=document.createElement('div');
      Object.assign(ring.style,{
        position:'absolute', left:'-10px', top:'-10px', width:'54px', height:'54px',
        borderRadius:'50%', border:'2px dashed rgba(94,234,212,.55)', pointerEvents:'none'
      });
      wound.appendChild(ring);

      function startHold(){
        if(!running) return;
        if(holding) return;
        holding=true;
        progressInt=setInterval(()=>{
          progress += 4/diffFactor(); // szybciej rośnie na łatwym
          ring.style.border='2px solid rgba(94,234,212,.85)';
          ring.style.boxShadow='0 0 8px rgba(94,234,212,.45)';
          ring.style.transform=`scale(${1+progress/120})`;
          if(progress>=100){
            clearInterval(progressInt); progressInt=null;
            score++; showToast('+1');
            update(); spawn();
          }
        }, 60);
      }
      function endHold(){
        if(!holding) return;
        holding=false;
        if(progress<100){
          clearInterval(progressInt); progressInt=null;
          lives--; showToast('Za krótko — −1 życie');
          if(lives<=0){ finish(); return; }
          update();
        }
      }
      wound.addEventListener('mousedown', startHold);
      wound.addEventListener('touchstart', (e)=>{ e.preventDefault(); startHold(); }, {passive:false});
      document.addEventListener('mouseup', endHold);
      document.addEventListener('touchend', endHold);

      board.appendChild(wound);
    }
    function startGame(){
      if(running) return;
      time=40; score=0; lives=3; update(); spawn();
      running=true; timer=setInterval(tick,1000);
      start.disabled=true; reset.disabled=false;
    }
    function resetGame(){
      running=false; timer&&clearInterval(timer); timer=null;
      time=40; score=0; lives=3; update(); board.innerHTML='';
      start.disabled=false;
    }

    on(start,'click',startGame);
    on(reset,'click',resetGame);
  })();

})();
