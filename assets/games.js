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

})(); // koniec głównego IIFE
