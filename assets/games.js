/* BoliHelp — Gry / Trening — v4.1 + Aim Pro (fix) */

(function(){

// ========== helpery ==========
function $(sel, ctx=document){ return ctx.querySelector(sel); }
function $all(sel, ctx=document){ return ctx.querySelectorAll(sel); }
function showToast(msg){
  const toast=$("#gToast"), txt=$("#gToastText");
  if(!toast || !txt) return;
  txt.textContent=msg; toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),2000);
}
function bestSave(key,val){
  const old=+localStorage.getItem(key)||0;
  if(val>old){ localStorage.setItem(key,val); return val; }
  return old;
}

// ========== obsługa modali ==========
$all("[data-game-open]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const id=btn.getAttribute("data-game-open");             // np. "aimpro"
    const modalId="g"+id.charAt(0).toUpperCase()+id.slice(1); // "gAimpro"
    const modal=$("#"+modalId);
    if(modal) modal.setAttribute("aria-hidden","false");
  });
});
$all("[data-game-close]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const m=btn.closest(".bh-games-modal");
    if(m) m.setAttribute("aria-hidden","true");
  });
});

// ========== RKO Tempo Tap ==========
(function(){
  const btn=$("#rkoTap"), start=$("#rkoStart"), reset=$("#rkoReset");
  const bpmEl=$("#rkoBpm"), inRangeEl=$("#rkoInRange"), timeEl=$("#rkoTime"), bestEl=$("#rkoBest");
  const cursor=$("#rkoCursor");
  if(!btn||!start||!reset) return;

  let t0=0, taps=[], timer=null, best=+localStorage.getItem("rkoBest")||0;
  bestEl && (bestEl.textContent=best?best:"—");

  function startGame(){
    taps=[]; t0=performance.now();
    timeEl && (timeEl.textContent="30s");
    if(timer) clearInterval(timer);
    timer=setInterval(update,200);
  }
  function stopGame(){ if(timer) clearInterval(timer); }
  function update(){
    const dt=(performance.now()-t0)/1000;
    const remain=Math.max(0,30-dt);
    timeEl && (timeEl.textContent=remain.toFixed(0)+"s");
    if(remain<=0){ stopGame(); showToast("Koniec!"); }
    if(taps.length>1){
      const deltas=[];
      for(let i=1;i<taps.length;i++) deltas.push(taps[i]-taps[i-1]);
      const avg=deltas.reduce((a,b)=>a+b,0)/deltas.length;
      const bpm=60000/avg;
      bpmEl && (bpmEl.textContent=bpm.toFixed(0));
      const ok=bpm>=100&&bpm<=120;
      inRangeEl && (inRangeEl.textContent=(ok?"✔":"✘")+" "+bpm.toFixed(0));
      if(cursor) cursor.style.left=(Math.min(120,Math.max(60,bpm))-60)/60*100+"%";
      if(ok){
        const score=Math.round(bpm);
        if(score>best){
          best=score; localStorage.setItem("rkoBest",best);
          bestEl && (bestEl.textContent=best);
        }
      }
    }
  }
  function tap(){ taps.push(performance.now()); }
  btn.addEventListener("click",tap);
  document.addEventListener("keydown",e=>{ if(e.code==="Space") tap(); });
  start.addEventListener("click",startGame);
  reset.addEventListener("click",()=>{ taps=[]; bpmEl&&(bpmEl.textContent="0"); inRangeEl&&(inRangeEl.textContent="0%"); timeEl&&(timeEl.textContent="30s"); });
})();

// ========== Zadławienie 5+5 ==========
(function(){
  const back=$("#zdlBack"), abd=$("#zdlAbd"), start=$("#zdlStart"), reset=$("#zdlReset");
  const stage=$("#zdlStage"), seq=$("#zdlSeq"), timeEl=$("#zdlTime"), scoreEl=$("#zdlScore"), bestEl=$("#zdlBest");
  if(!back||!abd||!start||!reset) return;

  let time=60, timer=null, step=0, score=0, best=+localStorage.getItem("zdlBest")||0;
  bestEl && (bestEl.textContent=best?best:"—");

  function startGame(){
    time=60; score=0; step=0; update();
    if(timer) clearInterval(timer);
    timer=setInterval(()=>{ time--; update(); if(time<=0) end(); },1000);
  }
  function end(){
    if(timer) clearInterval(timer);
    showToast("Koniec! Wynik: "+score);
    if(score>best){ best=score; localStorage.setItem("zdlBest",best); bestEl && (bestEl.textContent=best); }
  }
  function update(){ timeEl&&(timeEl.textContent=time+"s"); scoreEl&&(scoreEl.textContent=score); }
  function action(type){
    if(time<=0) return;
    if((step<5&&type==="B")||(step>=5&&type==="A")){
      step++; seq&&(seq.textContent="OK");
      if(step>=10){ score++; step=0; }
    }else{ seq&&(seq.textContent="BŁĄD"); step=0; }
    stage&&(stage.textContent= step<5? "Plecy ("+(step+1)+"/5)":"Nadbrzusze ("+(step-4)+"/5)");
    update();
  }
  back.addEventListener("click",()=>action("B"));
  abd.addEventListener("click",()=>action("A"));
  start.addEventListener("click",startGame);
  reset.addEventListener("click",()=>{ if(timer) clearInterval(timer); time=60; score=0; step=0; update(); });
})();

// ========== AED Timing ==========
(function(){
  const start=$("#aedStart"), shock=$("#aedShock"), reset=$("#aedReset");
  const roundEl=$("#aedRound"), hitsEl=$("#aedHits"), scoreEl=$("#aedScore"), bestEl=$("#aedBest");
  const marker=$("#aedMarker"), zone=$("#aedZone");
  if(!start||!shock||!reset||!marker||!zone) return;

  let round=1, hits=0, score=0, timer=null, pos=6, dir=1, best=+localStorage.getItem("aedBest")||0;
  bestEl && (bestEl.textContent=best?best:"—");

  function loop(){
    pos+=dir*2; if(pos>94||pos<6) dir*=-1;
    marker.style.left=pos+"%";
  }
  function startGame(){
    round=1; hits=0; score=0; update();
    if(timer) clearInterval(timer);
    timer=setInterval(loop,30);
  }
  function shockNow(){
    const left=parseFloat(marker.style.left||"6");
    const zl=parseFloat(zone.style.left||"40"), zr=100-parseFloat(zone.style.right||"40");
    if(left>=zl&&left<=zr){ hits++; score+=10; }
    round++; if(round>3){ end(); } update();
  }
  function update(){ roundEl&&(roundEl.textContent=round+"/3"); hitsEl&&(hitsEl.textContent=hits+"/"+(round-1)); scoreEl&&(scoreEl.textContent=score); }
  function end(){
    if(timer) clearInterval(timer);
    if(score>best){ best=score; localStorage.setItem("aedBest",best); bestEl&&(bestEl.textContent=best); }
    showToast("Wynik: "+score);
  }
  start.addEventListener("click",startGame);
  shock.addEventListener("click",shockNow);
  reset.addEventListener("click",()=>{ if(timer) clearInterval(timer); round=1; hits=0; score=0; update(); });
})();

// ========== Reflex Triage ==========
(function(){
  const start=$("#trStart"), reset=$("#trReset");
  const modeEl=$("#trMode"), timeEl=$("#trTime"), scoreEl=$("#trScore"), livesEl=$("#trLives"), bestEl=$("#trBest"), board=$("#trBoard");
  const red=$("#trRed"), yellow=$("#trYellow"), green=$("#trGreen");
  if(!start||!reset||!board) return;

  let mode="red", time=30, score=0, lives=3, timer=null, best=+localStorage.getItem("trBest")||0;
  bestEl && (bestEl.textContent=best?best:"—");

  function startGame(){
    time=30; score=0; lives=3; update();
    if(timer) clearInterval(timer);
    timer=setInterval(()=>{ time--; update(); if(time<=0) end(); },1000);
    spawn();
  }
  function update(){
    modeEl&&(modeEl.textContent="Klikaj: "+(mode==="red"?"🔴 Czerwony":mode==="yellow"?"🟡 Żółty":"🟢 Zielony"));
    timeEl&&(timeEl.textContent=time+"s"); scoreEl&&(scoreEl.textContent=score); livesEl&&(livesEl.textContent=lives);
  }
  function end(){
    if(timer) clearInterval(timer);
    if(score>best){ best=score; localStorage.setItem("trBest",best); bestEl&&(bestEl.textContent=best); }
    showToast("Koniec! Wynik: "+score);
  }
  function spawn(){
    board.innerHTML="";
    for(let i=0;i<9;i++){
      const cell=document.createElement("div");
      cell.className="triage-cell";
      cell.textContent=["🔴","🟡","🟢"][Math.floor(Math.random()*3)];
      cell.addEventListener("click",()=>{
        if( (cell.textContent==="🔴"&&mode==="red") || (cell.textContent==="🟡"&&mode==="yellow") || (cell.textContent==="🟢"&&mode==="green") ){
          score++;
        } else {
          lives--; if(lives<=0) end();
        }
        update();
      });
      board.appendChild(cell);
    }
  }
  start.addEventListener("click",startGame);
  reset.addEventListener("click",()=>{ if(timer) clearInterval(timer); time=30; score=0; lives=3; update(); });
  red && red.addEventListener("click",()=>{ mode="red"; spawn(); update(); });
  yellow && yellow.addEventListener("click",()=>{ mode="yellow"; spawn(); update(); });
  green && green.addEventListener("click",()=>{ mode="green"; spawn(); update(); });
})();

// ========== Germ Smash ==========
(function(){
  const start=$("#gmStart"), reset=$("#gmReset"), timeEl=$("#gmTime"), scoreEl=$("#gmScore"), bestEl=$("#gmBest"), board=$("#gmBoard");
  if(!start||!reset||!board) return;

  let time=30, score=0, timer=null, best=+localStorage.getItem("gmBest")||0;
  bestEl && (bestEl.textContent=best?best:"—");

  function startGame(){ time=30; score=0; update(); board.innerHTML=""; if(timer) clearInterval(timer); timer=setInterval(tick,1000); spawn(); }
  function tick(){ time--; update(); if(time<=0) end(); else spawn(); }
  function spawn(){
    board.innerHTML="";
    for(let i=0;i<9;i++){
      const btn=document.createElement("button");
      btn.textContent=Math.random()<0.3?"🦠":"";
      btn.style.width="30%"; btn.style.height="60px";
      btn.addEventListener("click",()=>{ if(btn.textContent==="🦠"){ score++; update(); btn.textContent=""; } });
      board.appendChild(btn);
    }
  }
  function update(){ timeEl&&(timeEl.textContent=time+"s"); scoreEl&&(scoreEl.textContent=score); }
  function end(){
    if(timer) clearInterval(timer);
    if(score>best){ best=score; localStorage.setItem("gmBest",best); bestEl&&(bestEl.textContent=best); }
    showToast("Koniec! Wynik: "+score);
  }
  start.addEventListener("click",startGame);
  reset.addEventListener("click",()=>{ if(timer) clearInterval(timer); time=30; score=0; update(); board.innerHTML=""; });
})();

// ========== Symptom Detective ==========
(function(){
  const start=$("#symStart"), reset=$("#symReset"), timeEl=$("#symTime"), scoreEl=$("#symScore"), bestEl=$("#symBest"), caseEl=$("#symCase"), answersEl=$("#symAnswers");
  if(!start||!reset||!caseEl||!answersEl) return;

  const cases=[
    {q:"Ból w klatce + duszność",a:"112"},
    {q:"Gorączka i katar",a:"lekarz rodzinny"},
    {q:"Utrata przytomności",a:"112"},
    {q:"Lekki ból brzucha po posiłku",a:"lekarz rodzinny"}
  ];
  let time=60, score=0, best=+localStorage.getItem("symBest")||0, timer=null, cur=null;
  bestEl && (bestEl.textContent=best?best:"—");

  function newCase(){
    cur=cases[Math.floor(Math.random()*cases.length)];
    caseEl.textContent=cur.q;
    answersEl.innerHTML="";
    ["112","lekarz rodzinny"].forEach(opt=>{
      const b=document.createElement("button");
      b.className="bh-games-btn"; b.textContent=opt;
      b.addEventListener("click",()=>{ if(opt===cur.a){ score++; } newCase(); update(); });
      answersEl.appendChild(b);
    });
  }
  function startGame(){ time=60; score=0; update(); if(timer) clearInterval(timer); timer=setInterval(()=>{ time--; update(); if(time<=0) end(); },1000); newCase(); }
  function update(){ timeEl&&(timeEl.textContent=time+"s"); scoreEl&&(scoreEl.textContent=score); }
  function end(){
    if(timer) clearInterval(timer);
    if(score>best){ best=score; localStorage.setItem("symBest",best); bestEl&&(bestEl.textContent=best); }
    showToast("Wynik: "+score);
  }
  start.addEventListener("click",startGame);
  reset.addEventListener("click",()=>{ if(timer) clearInterval(timer); time=60; score=0; update(); caseEl.textContent="—"; answersEl.innerHTML=""; });
})();

// ========== Red Flag ==========
(function(){
  const start=$("#rfStart"), reset=$("#rfReset"), yes=$("#rfYes"), no=$("#rfNo"), timeEl=$("#rfTime"), scoreEl=$("#rfScore"), bestEl=$("#rfBest"), prompt=$("#rfPrompt"), explain=$("#rfExplain");
  if(!start||!reset||!yes||!no||!prompt||!explain) return;

  const cases=[
    {q:"Nagły silny ból w klatce",a:true, why:"Możliwy zawał — pilnie SOR/112."},
    {q:"Łagodny katar i kichanie",a:false, why:"Objawy łagodne — dom/POZ."},
    {q:"Udar: opadający kącik ust",a:true, why:"Objawy udaru — pilnie 112."},
    {q:"Lekki ból głowy po stresie",a:false, why:"Raczej napięciowy — obserwacja."}
  ];
  let time=45, score=0, best=+localStorage.getItem("rfBest")||0, timer=null, cur=null;
  bestEl && (bestEl.textContent=best?best:"—");

  function newCase(){ cur=cases[Math.floor(Math.random()*cases.length)]; prompt.textContent=cur.q; explain.textContent=""; }
  function startGame(){ time=45; score=0; update(); if(timer) clearInterval(timer); timer=setInterval(()=>{ time--; update(); if(time<=0) end(); },1000); newCase(); }
  function update(){ timeEl&&(timeEl.textContent=time+"s"); scoreEl&&(scoreEl.textContent=score); }
  function end(){
    if(timer) clearInterval(timer);
    if(score>best){ best=score; localStorage.setItem("rfBest",best); bestEl&&(bestEl.textContent=best); }
    showToast("Wynik: "+score);
  }
  function check(ans){
    if(!cur) return;
    if(ans===cur.a){ score++; explain.textContent="✔ Dobrze. "+cur.why; }
    else { explain.textContent="✘ Źle. "+cur.why; }
    newCase(); update();
  }
  yes.addEventListener("click",()=>check(true));
  no.addEventListener("click",()=>check(false));
  start.addEventListener("click",startGame);
  reset.addEventListener("click",()=>{ if(timer) clearInterval(timer); time=45; score=0; update(); prompt.textContent="—"; explain.textContent=""; });
})();

// ========== Karaoke ==========
(function(){
  const start=$("#karStart"), reset=$("#karReset"), tap=$("#karTap"), bpmEl=$("#karBpm"), inEl=$("#karIn"), scoreEl=$("#karScore"), bestEl=$("#karBest"), timeEl=$("#karTime"), beat=$("#karBeat");
  if(!start||!reset||!tap||!beat) return;

  let bpm=110, interval=545, timer=null, beatTimer=null, score=0, time=45, best=+localStorage.getItem("karBest")||0;
  bestEl && (bestEl.textContent=best?best:"—");

  function tick(){ beat.style.left=(beat.style.left==="6%"?"94%":"6%"); }
  function tapNow(){ score++; update(); }
  function update(){ scoreEl&&(scoreEl.textContent=score); timeEl&&(timeEl.textContent=time+"s"); inEl&&(inEl.textContent= time>0 ? ((score/time)*100).toFixed(0)+"%" : "0%"); }
  function startGame(){ time=45; score=0; update(); if(timer) clearInterval(timer); if(beatTimer) clearInterval(beatTimer); timer=setInterval(()=>{ time--; update(); if(time<=0) end(); },1000); beatTimer=setInterval(tick,interval); }
  function end(){
    if(timer) clearInterval(timer); if(beatTimer) clearInterval(beatTimer);
    if(score>best){ best=score; localStorage.setItem("karBest",best); bestEl&&(bestEl.textContent=best); }
    showToast("Wynik: "+score);
  }
  tap.addEventListener("click",tapNow);
  document.addEventListener("keydown",e=>{ if(e.code==="Space") tapNow(); });
  start.addEventListener("click",startGame);
  reset.addEventListener("click",()=>{ if(timer) clearInterval(timer); if(beatTimer) clearInterval(beatTimer); time=45; score=0; update(); });
})();

// ========== Bandage Rush ==========
(function(){
  const start=$("#banStart"), reset=$("#banReset"), board=$("#banBoard"), timeEl=$("#banTime"), scoreEl=$("#banScore"), livesEl=$("#banLives"), bestEl=$("#banBest");
  if(!start||!reset||!board) return;

  let time=40, score=0, lives=3, timer=null, best=+localStorage.getItem("banBest")||0;
  bestEl && (bestEl.textContent=best?best:"—");

  function startGame(){ time=40; score=0; lives=3; update(); if(timer) clearInterval(timer); timer=setInterval(()=>{ time--; update(); if(time<=0) end(); },1000); spawn(); }
  function spawn(){
    board.innerHTML="";
    const wound=document.createElement("div");
    wound.textContent="🩹"; wound.style.position="absolute";
    wound.style.left=Math.random()*90+"%"; wound.style.top=Math.random()*80+"%";
    wound.style.fontSize="32px";
    let holding=false, progress=0, int=null;
    wound.addEventListener("mousedown",()=>{ if(holding) return; holding=true; int=setInterval(()=>{ progress++; if(progress>=100){ score++; spawn(); clearInterval(int); } update(); },100); });
    wound.addEventListener("mouseup",()=>{ holding=false; if(int) clearInterval(int); });
    board.appendChild(wound);
  }
  function update(){ timeEl&&(timeEl.textContent=time+"s"); scoreEl&&(scoreEl.textContent=score); livesEl&&(livesEl.textContent=lives); }
  function end(){
    if(timer) clearInterval(timer);
    if(score>best){ best=score; localStorage.setItem("banBest",best); bestEl&&(bestEl.textContent=best); }
    showToast("Wynik: "+score);
  }
  start.addEventListener("click",startGame);
  reset.addEventListener("click",()=>{ if(timer) clearInterval(timer); time=40; score=0; lives=3; update(); board.innerHTML=""; });
})();

// ========== Aim Pro ==========
(function(){
  // Elementy interfejsu
  const start = $("#aimStart");
  const reset = $("#aimReset");
  const board = $("#aimBoard");
  const timeEl = $("#aimTime");
  const scoreEl = $("#aimScore");
  const bestEl = $("#aimBest");

  // Jeśli brak sekcji w DOM — wyjście
  if(!board || !start || !reset) return;

  // Stan gry
  let score = 0;
  let best  = +localStorage.getItem("aimBest") || 0;
  let time  = 30;
  let timer = null;
  let spawnTimer = null;

  bestEl && (bestEl.textContent = best ? best : "—");

  function updateUI(){
    timeEl && (timeEl.textContent  = time + "s");
    scoreEl && (scoreEl.textContent = score);
  }

  function spawnTarget(){
    if(time <= 0) return;

    const target = document.createElement("div");
    target.className = "aim-target";

    // rozmiar 28–68 px, losowa pozycja z marginesem
    const size = Math.random() * 40 + 28;
    const maxX = Math.max(0, board.clientWidth  - size - 8);
    const maxY = Math.max(0, board.clientHeight - size - 8);
    const x = Math.max(4, Math.random() * maxX);
    const y = Math.max(4, Math.random() * maxY);

    Object.assign(target.style, {
      width: size + "px",
      height: size + "px",
      left: x + "px",
      top: y + "px",
      position: "absolute"
    });

    let alive = true;

    // trafienie (blokujemy propagację żeby nie liczyć jako pudło)
    target.addEventListener("click", (e)=>{
      e.stopPropagation();
      if(!alive) return;
      alive = false;
      score++;
      updateUI();
      target.remove();
    });

    board.appendChild(target);

    // auto-znikanie po 1.2 s (bez kary)
    setTimeout(()=>{
      if(alive){
        alive = false;
        target.remove();
      }
    }, 1200);
  }

  function startGame(){
    // reset timery
    if(timer) clearInterval(timer);
    if(spawnTimer) clearInterval(spawnTimer);

    score = 0;
    time  = 30;
    board.innerHTML = "";
    updateUI();

    // odliczanie czasu
    timer = setInterval(()=>{
      time--;
      updateUI();
      if(time <= 0){
        endGame();
      }
    }, 1000);

    // tempo pojawiania się celów (im niżej, tym trudniej)
    spawnTimer = setInterval(spawnTarget, 650);
  }

  function endGame(){
    if(timer) clearInterval(timer);
    if(spawnTimer) clearInterval(spawnTimer);

    if(score > best){
      best = score;
      localStorage.setItem("aimBest", best);
    }
    bestEl && (bestEl.textContent = best ? best : "—");
    showToast("Koniec! Wynik: " + score);
  }

  function resetGame(){
    if(timer) clearInterval(timer);
    if(spawnTimer) clearInterval(spawnTimer);
    score = 0;
    time  = 30;
    board.innerHTML = "";
    updateUI();
  }

  // pudło (klik w planszę, ale nie w cel) — -1 pkt, nie schodzimy poniżej zera
  board.addEventListener("click", ()=>{
    if(time > 0){
      score = Math.max(0, score - 1);
      updateUI();
    }
  });

  start.addEventListener("click", startGame);
  reset.addEventListener("click", resetGame);
})();

// ========== Neuro N-Back Holo (2025) ==========
(function(){
  const start = document.getElementById("nbStart");
  const reset = document.getElementById("nbReset");
  const board = document.getElementById("nbBoard");
  const timeEl= document.getElementById("nbTime");
  const scoreEl=document.getElementById("nbScore");
  const bestEl =document.getElementById("nbBest");
  const levelEl=document.getElementById("nbLevel");
  const accEl  =document.getElementById("nbAcc");
  const posBtn =document.getElementById("nbPos");
  const symBtn =document.getElementById("nbSym");
  if(!start || !reset || !board) return;

  // Canvas
  let canvas, ctx, dpr=1, rafId=null, running=false;
  function ensureCanvas(){
    if(canvas) return;
    canvas = document.createElement("canvas");
    canvas.style.width="100%"; canvas.style.height="100%"; canvas.style.display="block";
    board.innerHTML=""; board.appendChild(canvas);
    ctx = canvas.getContext("2d");
    resize();
  }
  function resize(){
    dpr = Math.min(2, window.devicePixelRatio||1);
    const r = board.getBoundingClientRect();
    canvas.width = Math.max(320, Math.floor(r.width * dpr));
    canvas.height= Math.max(260, Math.floor(r.height* dpr));
  }
  window.addEventListener("resize", ()=>{ if(canvas) resize(); });

  // Stan
  let time=60, score=0, best=+localStorage.getItem("nbBest2025")||0;
  let n=1, goodStreak=0, badStreak=0;
  let stream=[]; // {pos:0..8, sym:'A'.., ts}
  let idx=-1;    // bieżący indeks bodźca
  let period=2000; // ms między bodźcami (adaptacyjne 2000→1300)
  let tLastStim=0;
  let hits=0, falseAlarms=0, misses=0;
  let posArmed=false, symArmed=false; // czy można oddać odpowiedź na bieżący bodziec

  const alphabet = "ABCDEFGHJKLMNPRSTUVWXYZ"; // bez podobnych znaków
  function rndSym(){ return alphabet[Math.floor(Math.random()*alphabet.length)]; }
  function rndPos(){ return Math.floor(Math.random()*9); }

  function pushStim(){
    const st={ pos:rndPos(), sym:rndSym(), ts:performance.now() };
    stream.push(st); idx++;
    posArmed=true; symArmed=true;
  }

  function isPosMatch(){
    if(idx-n<0) return false;
    return stream[idx].pos === stream[idx-n].pos;
  }
  function isSymMatch(){
    if(idx-n<0) return false;
    return stream[idx].sym === stream[idx-n].sym;
  }

  function adaptDifficulty(){
    // liczymy skuteczność z ostatnich ~10 bodźców
    const window = Math.min(10, stream.length);
    if(window<6) return;
    const from = stream.length - window;
    const recentHits = stats.slice(from).filter(x=>x.hit).length;
    const recentTotal= stats.slice(from).length;
    const acc = recentTotal ? recentHits*100/recentTotal : 0;
    // n w górę gdy acc>=85% i mamy >=2 trafienia pozytywne, w dół gdy acc<60% lub dużo FA/miss
    if(acc>=85 && n<3){ n++; goodStreak++; badStreak=0; period=Math.max(1300, period-80); }
    else if(acc<60 && n>1){ n--; badStreak++; goodStreak=0; period=Math.min(2100, period+80); }
    levelEl && (levelEl.textContent=String(n));
  }

  // pion: siatka 3×3, hologram; HUD: symbol, n, combo
  function drawStim(){
    const W=canvas.width, H=canvas.height;
    ctx.clearRect(0,0,W,H);

    // tło lekko holograficzne
    const bg = ctx.createLinearGradient(0,0,W,H);
    bg.addColorStop(0,"rgba(164,107,255,0.08)");
    bg.addColorStop(1,"rgba(94,234,212,0.08)");
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

    // siatka
    const pad=20*dpr, gridSize=Math.min(W,H)-pad*2;
    const cell=gridSize/3;
    const gx=(W-gridSize)/2, gy=(H-gridSize)/2;

    // glow siatki
    ctx.save();
    ctx.shadowColor="rgba(164,107,255,0.25)";
    ctx.shadowBlur=18*dpr;
    ctx.strokeStyle="rgba(255,255,255,0.18)";
    ctx.lineWidth=1*dpr;
    for(let i=0;i<=3;i++){
      ctx.beginPath(); ctx.moveTo(gx+i*cell, gy); ctx.lineTo(gx+i*cell, gy+gridSize); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(gx, gy+i*cell); ctx.lineTo(gx+gridSize, gy+i*cell); ctx.stroke();
    }
    ctx.restore();

    // zaznacz bieżącą pozycję
    if(idx>=0){
      const p=stream[idx].pos; const cx0=p%3, cy0=Math.floor(p/3);
      const cxg = gx + cx0*cell + cell/2;
      const cyg = gy + cy0*cell + cell/2;

      // pulsujący neon
      const t = (performance.now()/300)%Math.PI;
      const R = Math.min(cell*0.38, 42*dpr) * (0.92 + 0.06*Math.sin(t));
      ctx.beginPath();
      ctx.arc(cxg, cyg, R*1.25, 0, Math.PI*2);
      ctx.fillStyle="rgba(94,234,212,0.18)";
      ctx.fill();

      ctx.beginPath();
      ctx.lineWidth=Math.max(2*dpr, R*0.12);
      ctx.strokeStyle="rgba(94,234,212,0.88)";
      ctx.arc(cxg, cyg, R, 0, Math.PI*2);
      ctx.stroke();

      // symbol na środku siatki
      ctx.font = `${Math.floor(cell*0.5)}px system-ui, -apple-system, Segoe UI, Roboto`;
      ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillStyle="rgba(255,255,255,0.92)";
      ctx.fillText(stream[idx].sym, W/2, gy - pad*0.3);
    }

    // HUD dolny
    const acc = (hits+falseAlarms+misses)>0 ? Math.round(hits*100/(hits+falseAlarms+misses)) : 100;
    accEl && (accEl.textContent = `${acc}%`);
    ctx.font = `${14*dpr}px system-ui, -apple-system, Segoe UI, Roboto`;
    ctx.fillStyle="rgba(255,255,255,0.85)";
    ctx.textAlign="left";
    ctx.fillText(`n=${n} • Acc ${acc}%`, gx, gy+gridSize+16*dpr);
  }

  // ocena i statystyki
  const stats=[]; // {i, posNeed, symNeed, posHit, symHit}
  function evaluateEndOfStim(){
    if(idx<0) return;
    const needPos = isPosMatch();
    const needSym = isSymMatch();
    let posHit=false, symHit=false;

    // jeżeli użytkownik nie wcisnął, a była potrzeba -> miss
    if(needPos && posArmed===true){ misses++; }
    if(needSym && symArmed===true){ misses++; }

    stats.push({i:idx, posNeed:needPos, symNeed:needSym, posHit, symHit});
    adaptDifficulty();
  }

  function handleAnswer(type){
    if(idx<0) return;
    const need = (type==="pos") ? isPosMatch() : isSymMatch();
    if(type==="pos" && posArmed){
      if(need){ hits++; score+=2; markStat("posHit"); } else { falseAlarms++; score=Math.max(0, score-1); }
      posArmed=false;
    }
    if(type==="sym" && symArmed){
      if(need){ hits++; score+=2; markStat("symHit"); } else { falseAlarms++; score=Math.max(0, score-1); }
      symArmed=false;
    }
    scoreEl && (scoreEl.textContent=String(score));
  }
  function markStat(key){
    if(stats.length===0) return;
    const s=stats[stats.length-1];
    s[key]=true;
  }

  // pętla
  function loop(ts){
    if(!running) return;
    if(!tLastStim) tLastStim=ts;

    // nowy bodziec co 'period' ms
    if(ts - tLastStim >= period){
      evaluateEndOfStim(); // rozlicz poprzedni
      pushStim(); tLastStim = ts;
    }

    drawStim();
    rafId = requestAnimationFrame(loop);
  }

  function startGame(){
    ensureCanvas();
    time=60; score=0; n=1; goodStreak=0; badStreak=0; period=2000;
    stream.length=0; idx=-1; stats.length=0;
    hits=0; falseAlarms=0; misses=0;
    posArmed=false; symArmed=false;

    scoreEl && (scoreEl.textContent="0");
    levelEl && (levelEl.textContent="1");
    accEl   && (accEl.textContent="—");
    timeEl  && (timeEl.textContent="60s");

    running=true; tLastStim=0;
    if(rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(loop);

    // licznik czasu
    if(timer) clearInterval(timer);
    timer=setInterval(()=>{
      time--;
      timeEl && (timeEl.textContent=time+"s");
      if(time<=0) endGame();
    },1000);
  }

  function resetGame(){
    running=false;
    if(rafId) cancelAnimationFrame(rafId);
    if(timer) clearInterval(timer);
    stream.length=0; idx=-1; stats.length=0;
    hits=0; falseAlarms=0; misses=0;
    time=60; score=0; n=1; period=2000;
    scoreEl && (scoreEl.textContent="0");
    levelEl && (levelEl.textContent="1");
    accEl   && (accEl.textContent="—");
    timeEl  && (timeEl.textContent="60s");
    if(ctx) ctx.clearRect(0,0,canvas.width,canvas.height);
  }

  function endGame(){
    running=false;
    if(rafId) cancelAnimationFrame(rafId);
    if(timer) clearInterval(timer);
    const attempts = hits+falseAlarms+misses;
    const acc = attempts? Math.round(hits*100/attempts) : 100;
    if(score > best){
      best = score; localStorage.setItem("nbBest2025", best);
      bestEl && (bestEl.textContent=String(best));
    }
    showToast(`Koniec! Wynik: ${score} • Acc ${acc}% • n=${n}`);
  }

  let timer=null;
  start.addEventListener("click", startGame);
  reset.addEventListener("click", resetGame);
  posBtn && posBtn.addEventListener("click", ()=>handleAnswer("pos"));
  symBtn && symBtn.addEventListener("click", ()=>handleAnswer("sym"));
  document.addEventListener("keydown", (e)=>{
    if(!running) return;
    if(e.key==='z' || e.key==='Z') handleAnswer("pos");
    if(e.key==='x' || e.key==='X') handleAnswer("sym");
  });
})();
})(); // koniec głównego IIFE
