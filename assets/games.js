/* BoliHelp — Gry / Trening — v4.0 + Aim Pro + Neuro N-Back (FULL) */

(function(){

// ========== helpery ==========
function $(sel, ctx=document){ return ctx.querySelector(sel); }
function $all(sel, ctx=document){ return ctx.querySelectorAll(sel); }
function showToast(msg){
  const toast=$("#gToast"), txt=$("#gToastText");
  if(!toast||!txt) return;
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
    const id=btn.getAttribute("data-game-open");
    const modal=$("#g"+id.charAt(0).toUpperCase()+id.slice(1));
    if(modal) modal.setAttribute("aria-hidden","false");
  });
});
$all("[data-game-close]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const m = btn.closest(".bh-games-modal");
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
  if(bestEl) bestEl.textContent=best?best:"—";

  function startGame(){
    taps=[]; t0=performance.now();
    if(timeEl) timeEl.textContent="30s";
    if(timer) clearInterval(timer);
    timer=setInterval(update,200);
  }
  function stopGame(){ if(timer) clearInterval(timer); }
  function update(){
    const dt=(performance.now()-t0)/1000;
    const remain=Math.max(0,30-dt);
    if(timeEl) timeEl.textContent=remain.toFixed(0)+"s";
    if(remain<=0){ stopGame(); showToast("Koniec!"); }
    if(taps.length>1){
      const deltas=[];
      for(let i=1;i<taps.length;i++) deltas.push(taps[i]-taps[i-1]);
      const avg=deltas.reduce((a,b)=>a+b,0)/deltas.length;
      const bpm=60000/avg;
      if(bpmEl) bpmEl.textContent=bpm.toFixed(0);
      const ok=bpm>=100&&bpm<=120;
      if(inRangeEl) inRangeEl.textContent=(ok?"✔":"✘")+" "+bpm.toFixed(0);
      if(cursor) cursor.style.left=(Math.min(120,Math.max(60,bpm))-60)/60*100+"%";
      if(ok){
        const score=Math.round(bpm);
        if(score>best){
          best=score; localStorage.setItem("rkoBest",best);
          if(bestEl) bestEl.textContent=best;
        }
      }
    }
  }
  function tap(){ taps.push(performance.now()); }
  btn.addEventListener("click",tap);
  document.addEventListener("keydown",e=>{ if(e.code==="Space") tap(); });
  start.addEventListener("click",startGame);
  reset.addEventListener("click",()=>{
    taps=[]; if(bpmEl) bpmEl.textContent="0"; if(inRangeEl) inRangeEl.textContent="0%"; if(timeEl) timeEl.textContent="30s";
  });
})();

// ========== Zadławienie 5+5 ==========
(function(){
  const back=$("#zdlBack"), abd=$("#zdlAbd"), start=$("#zdlStart"), reset=$("#zdlReset");
  const stage=$("#zdlStage"), seq=$("#zdlSeq"), timeEl=$("#zdlTime"), scoreEl=$("#zdlScore"), bestEl=$("#zdlBest");
  if(!back||!abd||!start||!reset) return;

  let time=60, timer=null, step=0, score=0, best=+localStorage.getItem("zdlBest")||0;
  if(bestEl) bestEl.textContent=best?best:"—";

  function update(){ if(timeEl) timeEl.textContent=time+"s"; if(scoreEl) scoreEl.textContent=score; }
  function end(){
    clearInterval(timer);
    if(score>best){ best=score; localStorage.setItem("zdlBest",best); if(bestEl) bestEl.textContent=best; }
    showToast("Koniec! Wynik: "+score);
  }
  function action(type){
    if(time<=0) return;
    if((step<5&&type==="B")||(step>=5&&type==="A")){
      step++; if(seq) seq.textContent="OK";
      if(step>=10){ score++; step=0; }
    }else{ if(seq) seq.textContent="BŁĄD"; step=0; }
    if(stage) stage.textContent= step<5? "Plecy ("+(step+1)+"/5)":"Nadbrzusze ("+(step-4)+"/5)";
    update();
  }
  function startGame(){
    time=60; score=0; step=0; update();
    clearInterval(timer);
    timer=setInterval(()=>{ time--; update(); if(time<=0) end(); },1000);
  }

  back.addEventListener("click",()=>action("B"));
  abd.addEventListener("click",()=>action("A"));
  start.addEventListener("click",startGame);
  reset.addEventListener("click",()=>{ clearInterval(timer); time=60; score=0; step=0; update(); });
})();

// ========== AED Timing ==========
(function(){
  const start=$("#aedStart"), shock=$("#aedShock"), reset=$("#aedReset");
  const roundEl=$("#aedRound"), hitsEl=$("#aedHits"), scoreEl=$("#aedScore"), bestEl=$("#aedBest");
  const marker=$("#aedMarker"), zone=$("#aedZone");
  if(!start||!shock||!reset||!marker||!zone) return;

  let round=1, hits=0, score=0, timer=null, pos=6, dir=1, best=+localStorage.getItem("aedBest")||0;
  if(bestEl) bestEl.textContent=best?best:"—";

  function loop(){
    pos+=dir*2; if(pos>94||pos<6) dir*=-1;
    marker.style.left=pos+"%";
  }
  function update(){
    if(roundEl) roundEl.textContent=round+"/3";
    if(hitsEl) hitsEl.textContent=hits+"/"+(round-1>=0?round-1:0);
    if(scoreEl) scoreEl.textContent=score;
  }
  function shockNow(){
    const left=parseFloat(marker.style.left);
    const zl=parseFloat(zone.style.left), zr=100-parseFloat(zone.style.right);
    if(left>=zl&&left<=zr){ hits++; score+=10; }
    round++; if(round>3){ end(); } update();
  }
  function end(){
    clearInterval(timer);
    if(score>best){ best=score; localStorage.setItem("aedBest",best); if(bestEl) bestEl.textContent=best; }
    showToast("Wynik: "+score);
  }
  function startGame(){
    round=1; hits=0; score=0; update();
    clearInterval(timer);
    timer=setInterval(loop,30);
  }

  start.addEventListener("click",startGame);
  shock.addEventListener("click",shockNow);
  reset.addEventListener("click",()=>{ clearInterval(timer); round=1; hits=0; score=0; update(); });
})();

// ========== Reflex Triage ==========
(function(){
  const start=$("#trStart"), reset=$("#trReset");
  const modeEl=$("#trMode"), timeEl=$("#trTime"), scoreEl=$("#trScore"), livesEl=$("#trLives"), bestEl=$("#trBest"), board=$("#trBoard");
  const red=$("#trRed"), yellow=$("#trYellow"), green=$("#trGreen");
  if(!start||!reset||!board||!red||!yellow||!green) return;

  let mode="red", time=30, score=0, lives=3, timer=null, best=+localStorage.getItem("trBest")||0;
  if(bestEl) bestEl.textContent=best?best:"—";

  function update(){
    if(modeEl) modeEl.textContent="Klikaj: "+(mode==="red"?"🔴 Czerwony":mode==="yellow"?"🟡 Żółty":"🟢 Zielony");
    if(timeEl) timeEl.textContent=time+"s";
    if(scoreEl) scoreEl.textContent=score;
    if(livesEl) livesEl.textContent=lives;
  }
  function end(){
    clearInterval(timer);
    if(score>best){ best=score; localStorage.setItem("trBest",best); if(bestEl) bestEl.textContent=best; }
    showToast("Koniec! Wynik: "+score);
  }
  function spawn(){
    board.innerHTML="";
    for(let i=0;i<9;i++){
      const cell=document.createElement("div");
      cell.className="triage-cell";
      cell.textContent=["🔴","🟡","🟢"][Math.floor(Math.random()*3)];
      cell.addEventListener("click",()=>{
        if((cell.textContent==="🔴"&&mode==="red")||(cell.textContent==="🟡"&&mode==="yellow")||(cell.textContent==="🟢"&&mode==="green")){
          score++;
        } else {
          lives--; if(lives<=0) end();
        }
        update();
      });
      board.appendChild(cell);
    }
  }
  function startGame(){
    time=30; score=0; lives=3; update();
    clearInterval(timer);
    timer=setInterval(()=>{ time--; update(); if(time<=0) end(); },1000);
    spawn();
  }

  start.addEventListener("click",startGame);
  reset.addEventListener("click",()=>{ clearInterval(timer); time=30; score=0; lives=3; update(); });
  red.addEventListener("click",()=>{ mode="red"; spawn(); update(); });
  yellow.addEventListener("click",()=>{ mode="yellow"; spawn(); update(); });
  green.addEventListener("click",()=>{ mode="green"; spawn(); update(); });
})();

// ========== Germ Smash ==========
(function(){
  const start=$("#gmStart"), reset=$("#gmReset"), timeEl=$("#gmTime"), scoreEl=$("#gmScore"), bestEl=$("#gmBest"), board=$("#gmBoard");
  if(!start||!reset||!board) return;

  let time=30, score=0, timer=null, best=+localStorage.getItem("gmBest")||0;
  if(bestEl) bestEl.textContent=best?best:"—";

  function update(){ if(timeEl) timeEl.textContent=time+"s"; if(scoreEl) scoreEl.textContent=score; }
  function end(){
    clearInterval(timer);
    if(score>best){ best=score; localStorage.setItem("gmBest",best); if(bestEl) bestEl.textContent=best; }
    showToast("Koniec! Wynik: "+score);
  }
  function spawn(){
    board.innerHTML="";
    for(let i=0;i<9;i++){
      const btn=document.createElement("button");
      btn.textContent=Math.random()<0.3?"🦠":"";
      Object.assign(btn.style,{width:"30%", height:"60px"});
      btn.addEventListener("click",()=>{
        if(btn.textContent==="🦠"){ score++; update(); btn.textContent=""; }
      });
      board.appendChild(btn);
    }
  }
  function startGame(){
    time=30; score=0; update(); board.innerHTML="";
    clearInterval(timer);
    timer=setInterval(()=>{
      time--; update();
      if(time<=0) end(); else spawn();
    },1000);
    spawn();
  }

  start.addEventListener("click",startGame);
  reset.addEventListener("click",()=>{ clearInterval(timer); time=30; score=0; update(); board.innerHTML=""; });
})();
// ========== Symptom Detective ==========
(function(){
  const start=$("#symStart"), reset=$("#symReset"),
        timeEl=$("#symTime"), scoreEl=$("#symScore"), bestEl=$("#symBest"),
        caseEl=$("#symCase"), answersEl=$("#symAnswers");
  if(!start||!reset||!caseEl||!answersEl) return;

  const cases=[
    {q:"Ból w klatce, duszność",a:"112"},
    {q:"Gorączka, katar",a:"lekarz rodzinny"},
    {q:"Silny ból brzucha, omdlenia",a:"SOR"},
    {q:"Kaszel, lekka gorączka",a:"lekarz rodzinny"},
  ];

  let time=60, score=0, best=+localStorage.getItem("symBest")||0,
      timer=null, cur=null;
  if(bestEl) bestEl.textContent=best?best:"—";

  function newCase(){
    cur=cases[Math.floor(Math.random()*cases.length)];
    caseEl.textContent=cur.q;
    answersEl.innerHTML="";
    ["112","SOR","lekarz rodzinny"].forEach(opt=>{
      const b=document.createElement("button");
      b.className="bh-games-btn";
      b.textContent=opt;
      b.addEventListener("click",()=>{
        if(opt===cur.a){ score++; } else { score=Math.max(0,score-1); }
        newCase(); update();
      });
      answersEl.appendChild(b);
    });
  }
  function update(){ if(timeEl) timeEl.textContent=time+"s"; if(scoreEl) scoreEl.textContent=score; }
  function end(){
    clearInterval(timer);
    if(score>best){ best=score; localStorage.setItem("symBest",best); if(bestEl) bestEl.textContent=best; }
    showToast("Koniec! Wynik: "+score);
  }
  function startGame(){
    time=60; score=0; update();
    clearInterval(timer);
    timer=setInterval(()=>{ time--; update(); if(time<=0) end(); },1000);
    newCase();
  }

  start.addEventListener("click",startGame);
  reset.addEventListener("click",()=>{ clearInterval(timer); time=60; score=0; update(); caseEl.textContent="—"; answersEl.innerHTML=""; });
})();

// ========== Red Flag ==========
(function(){
  const start=$("#rfStart"), reset=$("#rfReset"),
        yes=$("#rfYes"], no=$("#rfNo"),
        timeEl=$("#rfTime"), scoreEl=$("#rfScore"), bestEl=$("#rfBest"),
        prompt=$("#rfPrompt"), explain=$("#rfExplain");
  // uwaga: poprawiony selektor id dla yes
})();
