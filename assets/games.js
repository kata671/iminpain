/* BoliHelp — Gry / Trening — v4.0 + Aim Pro + Neuro N-Back (FULL, 2025) */
/* 
   Ten plik jest kompletny i gotowy do wklejenia jako assets/games.js
   Zawiera: 
   - RKO Tempo Tap
   - Zadławienie 5+5
   - AED Timing
   - Reflex Triage
   - Germ Smash
   - Symptom Detective
   - Red Flag or Not?
   - CPR Karaoke
   - Bandage Rush
   - Aim Pro
   - Neuro N-Back Holo
*/

(function(){

/* ========== Helpery i wspólna infrastruktura ========== */
function $(sel, ctx=document){ return ctx.querySelector(sel); }
function $all(sel, ctx=document){ return ctx.querySelectorAll(sel); }

function showToast(msg){
  const toast=$("#gToast"), txt=$("#gToastText");
  if(!toast||!txt) return;
  txt.textContent=msg;
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"), 2000);
}

function bestSave(key,val){
  const old=+localStorage.getItem(key)||0;
  if(val>old){ localStorage.setItem(key,val); return val; }
  return old;
}

/* ========== Obsługa modali gier ========== */
$all("[data-game-open]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const id = btn.getAttribute("data-game-open") || "";
    const modal = $("#g" + id.charAt(0).toUpperCase() + id.slice(1));
    if(modal) modal.setAttribute("aria-hidden","false");
  });
});
$all("[data-game-close]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const m = btn.closest(".bh-games-modal");
    if(m) m.setAttribute("aria-hidden","true");
  });
});

/* =======================================================
   RKO Tempo Tap
   ------------------------------------------------------- */
(function(){
  const btn = $("#rkoTap"),
        start = $("#rkoStart"),
        reset = $("#rkoReset");
  if(!btn||!start||!reset) return;

  const bpmEl = $("#rkoBpm"),
        inRangeEl = $("#rkoInRange"),
        timeEl = $("#rkoTime"),
        bestEl = $("#rkoBest"),
        cursor = $("#rkoCursor");

  let t0=0, taps=[], timer=null, best=+localStorage.getItem("rkoBest")||0;
  if(bestEl) bestEl.textContent = best?best:"—";

  function startGame(){
    taps=[]; t0=performance.now();
    if(timeEl) timeEl.textContent="30s";
    if(timer) clearInterval(timer);
    timer=setInterval(update, 200);
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
    taps=[];
    if(bpmEl) bpmEl.textContent="0";
    if(inRangeEl) inRangeEl.textContent="0%";
    if(timeEl) timeEl.textContent="30s";
  });
})();

/* =======================================================
   Zadławienie 5+5
   ------------------------------------------------------- */
(function(){
  const back=$("#zdlBack"), abd=$("#zdlAbd"), start=$("#zdlStart"), reset=$("#zdlReset");
  if(!back||!abd||!start||!reset) return;

  const stage=$("#zdlStage"), seq=$("#zdlSeq"), timeEl=$("#zdlTime"), scoreEl=$("#zdlScore"), bestEl=$("#zdlBest");
  let time=60, timer=null, step=0, score=0, best=+localStorage.getItem("zdlBest")||0;
  if(bestEl) bestEl.textContent=best?best:"—";

  function update(){
    if(timeEl) timeEl.textContent=time+"s";
    if(scoreEl) scoreEl.textContent=score;
  }
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
    }else{
      if(seq) seq.textContent="BŁĄD";
      step=0;
    }
    if(stage) stage.textContent = step<5? "Plecy ("+(step+1)+"/5)" : "Nadbrzusze ("+(step-4)+"/5)";
    update();
  }
  function startGame(){
    time=60; score=0; step=0; update();
    clearInterval(timer);
    timer=setInterval(()=>{ time--; update(); if(time<=0) end(); }, 1000);
  }

  back.addEventListener("click",()=>action("B"));
  abd.addEventListener("click",()=>action("A"));
  start.addEventListener("click",startGame);
  reset.addEventListener("click",()=>{ clearInterval(timer); time=60; score=0; step=0; update(); });
})();

/* =======================================================
   AED Timing
   ------------------------------------------------------- */
(function(){
  const start=$("#aedStart"), shock=$("#aedShock"), reset=$("#aedReset");
  const roundEl=$("#aedRound"), hitsEl=$("#aedHits"), scoreEl=$("#aedScore"), bestEl=$("#aedBest");
  const marker=$("#aedMarker"), zone=$("#aedZone");
  if(!start||!shock||!reset||!marker||!zone) return;

  let round=1, hits=0, score=0, timer=null, pos=6, dir=1, best=+localStorage.getItem("aedBest")||0;
  if(bestEl) bestEl.textContent=best?best:"—";

  function loop(){
    pos+=dir*2;
    if(pos>94||pos<6) dir*=-1;
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
    timer=setInterval(loop, 30);
  }

  start.addEventListener("click",startGame);
  shock.addEventListener("click",shockNow);
  reset.addEventListener("click",()=>{ clearInterval(timer); round=1; hits=0; score=0; update(); });
})();

/* =======================================================
   Reflex Triage
   ------------------------------------------------------- */
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
    timer=setInterval(()=>{ time--; update(); if(time<=0) end(); }, 1000);
    spawn();
  }

  start.addEventListener("click",startGame);
  reset.addEventListener("click",()=>{ clearInterval(timer); time=30; score=0; lives=3; update(); });
  red.addEventListener("click",()=>{ mode="red"; spawn(); update(); });
  yellow.addEventListener("click",()=>{ mode="yellow"; spawn(); update(); });
  green.addEventListener("click",()=>{ mode="green"; spawn(); update(); });
})();

/* =======================================================
   Germ Smash
   ------------------------------------------------------- */
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
    }, 1000);
    spawn();
  }

  start.addEventListener("click",startGame);
  reset.addEventListener("click",()=>{ clearInterval(timer); time=30; score=0; update(); board.innerHTML=""; });
})();

/* =======================================================
   Symptom Detective
   ------------------------------------------------------- */
(function(){
  const start=$("#symStart"), reset=$("#symReset"),
        timeEl=$("#symTime"), scoreEl=$("#symScore"), bestEl=$("#symBest"),
        caseEl=$("#symCase"), answersEl=$("#symAnswers");
  if(!start||!reset||!caseEl||!answersEl) return;

  const cases=[
    {q:"Ból w klatce, duszność",a:"112"},
    {q:"Gorączka, katar",a:"lekarz rodzinny"},
    {q:"Silny ból brzucha, omdlenia",a:"SOR"},
    {q:"Kaszel, lekka gorączka",a:"lekarz rodzinny"}
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
    timer=setInterval(()=>{ time--; update(); if(time<=0) end(); }, 1000);
    newCase();
  }

  start.addEventListener("click",startGame);
  reset.addEventListener("click",()=>{ clearInterval(timer); time=60; score=0; update(); caseEl.textContent="—"; answersEl.innerHTML=""; });
})();

/* =======================================================
   Red Flag or Not?
   ------------------------------------------------------- */
(function(){
  const start=$("#rfStart"), reset=$("#rfReset"),
        yes=$("#rfYes"), no=$("#rfNo"),
        timeEl=$("#rfTime"), scoreEl=$("#rfScore"), bestEl=$("#rfBest"),
        prompt=$("#rfPrompt"), explain=$("#rfExplain");
  if(!start||!reset||!yes||!no) return;

  const cases=[
    {q:"Nagły ból w klatce",a:true, why:"Może oznaczać zawał serca"},
    {q:"Łagodny katar",a:false, why:"Typowe objawy infekcji wirusowej"},
    {q:"Silny ból głowy + sztywność karku",a:true, why:"Ryzyko zapalenia opon mózgowo-rdzeniowych"},
    {q:"Drobna rana na palcu",a:false, why:"Nie wymaga nagłej interwencji"}
  ];

  let time=45, score=0, best=+localStorage.getItem("rfBest")||0,
      timer=null, cur=null;
  if(bestEl) bestEl.textContent=best?best:"—";

  function newCase(){ cur=cases[Math.floor(Math.random()*cases.length)]; if(prompt) prompt.textContent=cur.q; if(explain) explain.textContent=""; }
  function update(){ if(timeEl) timeEl.textContent=time+"s"; if(scoreEl) scoreEl.textContent=score; }
  function end(){
    clearInterval(timer);
    if(score>best){ best=score; localStorage.setItem("rfBest",best); if(bestEl) bestEl.textContent=best; }
    showToast("Koniec! Wynik: "+score);
  }
  function check(ans){
    if(!cur) return;
    if(ans===cur.a){ score++; if(explain) explain.textContent="✔ Dobrze — "+cur.why; }
    else { if(explain) explain.textContent="✘ Źle — "+cur.why; }
    newCase(); update();
  }
  function startGame(){
    time=45; score=0; update();
    clearInterval(timer);
    timer=setInterval(()=>{ time--; update(); if(time<=0) end(); }, 1000);
    newCase();
  }

  yes.addEventListener("click",()=>check(true));
  no.addEventListener("click",()=>check(false));
  start.addEventListener("click",startGame);
  reset.addEventListener("click",()=>{ clearInterval(timer); time=45; score=0; update(); if(prompt) prompt.textContent="—"; if(explain) explain.textContent=""; });
})();

/* =======================================================
   CPR Karaoke
   ------------------------------------------------------- */
(function(){
  const start=$("#karStart"), reset=$("#karReset"),
        tap=$("#karTap"), bpmEl=$("#karBpm"),
        inEl=$("#karIn"), scoreEl=$("#karScore"),
        bestEl=$("#karBest"), timeEl=$("#karTime"),
        beat=$("#karBeat");
  if(!start||!reset||!tap||!beat) return;

  let bpm=110, interval=545, timer=null, beatTimer=null,
      score=0, time=45, best=+localStorage.getItem("karBest")||0;
  if(bestEl) bestEl.textContent=best?best:"—";

  function tick(){ beat.style.left=(beat.style.left==="6%"?"94%":"6%"); }
  function tapNow(){ score++; update(); }
  function update(){
    if(scoreEl) scoreEl.textContent=score;
    if(timeEl) timeEl.textContent=time+"s";
    if(inEl) inEl.textContent=(time>0?((score/time)*100).toFixed(0):"0")+"%";
  }
  function startGame(){
    time=45; score=0; update();
    clearInterval(timer); clearInterval(beatTimer);
    timer=setInterval(()=>{ time--; update(); if(time<=0) end(); }, 1000);
    beatTimer=setInterval(tick, interval);
  }
  function end(){
    clearInterval(timer); clearInterval(beatTimer);
    if(score>best){ best=score; localStorage.setItem("karBest",best); if(bestEl) bestEl.textContent=best; }
    showToast("Wynik: "+score);
  }

  tap.addEventListener("click",tapNow);
  document.addEventListener("keydown",e=>{ if(e.code==="Space") tapNow(); });
  start.addEventListener("click",startGame);
  reset.addEventListener("click",()=>{ clearInterval(timer); clearInterval(beatTimer); time=45; score=0; update(); });
})();

/* =======================================================
   Bandage Rush
   ------------------------------------------------------- */
(function(){
  const start=$("#banStart"), reset=$("#banReset"), board=$("#banBoard"),
        timeEl=$("#banTime"), scoreEl=$("#banScore"), livesEl=$("#banLives"), bestEl=$("#banBest");
  if(!start||!reset||!board) return;

  let time=40, score=0, lives=3, timer=null, best=+localStorage.getItem("banBest")||0, holdInt=null;
  if(bestEl) bestEl.textContent=best?best:"—";

  function update(){ if(timeEl) timeEl.textContent=time+"s"; if(scoreEl) scoreEl.textContent=score; if(livesEl) livesEl.textContent=lives; }
  function end(){
    clearInterval(timer); clearInterval(holdInt);
    if(score>best){ best=score; localStorage.setItem("banBest",best); if(bestEl) bestEl.textContent=best; }
    showToast("Koniec! Wynik: "+score);
  }
  function spawn(){
    board.innerHTML="";
    const wound=document.createElement("div");
    wound.textContent="🩹";
    Object.assign(wound.style,{
      position:"absolute", left:(Math.random()*85+5)+"%", top:(Math.random()*70+10)+"%", fontSize:"36px", cursor:"pointer"
    });
    let progress=0, holding=false;

    function startHold(){
      if(holding) return; holding=true;
      holdInt=setInterval(()=>{
        progress+=3;
        wound.style.filter=`drop-shadow(0 0 ${Math.min(12,progress/6)}px rgba(94,234,212,.6))`;
        if(progress>=100){ score++; update(); clearInterval(holdInt); spawn(); }
      }, 80);
    }
    function stopHold(){
      if(!holding) return; holding=false;
      clearInterval(holdInt);
      if(progress<100){ lives--; update(); if(lives<=0) end(); }
    }

    wound.addEventListener("mousedown",startHold);
    wound.addEventListener("touchstart",(e)=>{ e.preventDefault(); startHold(); }, {passive:false});
    window.addEventListener("mouseup",stopHold,{once:true});
    window.addEventListener("touchend",stopHold,{once:true,passive:true});

    board.appendChild(wound);
  }
  function startGame(){
    clearInterval(timer); clearInterval(holdInt);
    time=40; score=0; lives=3; update(); spawn();
    timer=setInterval(()=>{ time--; update(); if(time<=0) end(); }, 1000);
  }

  start.addEventListener("click",startGame);
  reset.addEventListener("click",()=>{ clearInterval(timer); clearInterval(holdInt); time=40; score=0; lives=3; update(); board.innerHTML=""; });
})();

/* =======================================================
   Aim Pro
   ------------------------------------------------------- */
(function(){
  const start=$("#aimStart"), reset=$("#aimReset"), board=$("#aimBoard"),
        timeEl=$("#aimTime"), scoreEl=$("#aimScore"), bestEl=$("#aimBest");
  if(!start||!reset||!board) return;

  let time=30, score=0, best=+localStorage.getItem("aimBest")||0,
      timer=null, spawnTimer=null;
  if(bestEl) bestEl.textContent=best?best:"—";

  function updateUI(){
    if(timeEl) timeEl.textContent=time+"s";
    if(scoreEl) scoreEl.textContent=score;
    if(bestEl) bestEl.textContent=best||"—";
  }
  function spawnTarget(){
    const target=document.createElement("div");
    const size=Math.random()*42+28; // 28–70 px
    const x=Math.random()*(board.clientWidth-size-8);
    const y=Math.random()*(board.clientHeight-size-8);
    Object.assign(target.style,{
      position:"absolute", left:x+"px", top:y+"px", width:size+"px", height:size+"px", borderRadius:"50%",
      background:"radial-gradient(circle at 35% 35%, #ffffff, #5eead4 40%, rgba(14,18,48,.6) 80%)",
      boxShadow:"0 0 14px rgba(94,234,212,.45), inset 0 0 10px rgba(255,255,255,.35)",
      transform:"translateZ(0) scale(0.9)", transition:"transform .08s ease-out", cursor:"crosshair"
    });
    target.addEventListener("mousedown",()=>{
      score++; if(score>best){ best=score; localStorage.setItem("aimBest",best); }
      updateUI(); target.style.transform="scale(1.15)"; setTimeout(()=>target.remove(),40);
    });
    board.appendChild(target);
    setTimeout(()=>target.remove(),900);
  }
  function startGame(){
    clearInterval(timer); clearInterval(spawnTimer);
    time=30; score=0; updateUI(); board.innerHTML="";
    timer=setInterval(()=>{ time--; updateUI(); if(time<=0) endGame(); }, 1000);
    spawnTimer=setInterval(spawnTarget, 420);
  }
  function endGame(){
    clearInterval(timer); clearInterval(spawnTimer);
    if(score>best){ best=score; localStorage.setItem("aimBest",best); }
    updateUI(); showToast("Koniec! Wynik: "+score);
  }
  function resetGame(){
    clearInterval(timer); clearInterval(spawnTimer);
    score=0; time=30; board.innerHTML=""; updateUI();
  }
  // pudło: klik nie w cel
  board.addEventListener("click",(e)=>{ if(e.target===board && time>0){ score=Math.max(0,score-1); updateUI(); } });

  start.addEventListener("click",startGame);
  reset.addEventListener("click",resetGame);
})();

/* =======================================================
   Neuro N-Back Holo
   ------------------------------------------------------- */
(function(){
  const start=$("#nbStart"), reset=$("#nbReset"),
        posBtn=$("#nbPos"), symBtn=$("#nbSym"),
        timeEl=$("#nbTime"), scoreEl=$("#nbScore"), levelEl=$("#nbLevel"),
        accEl=$("#nbAcc"), bestEl=$("#nbBest"),
        canvas=$("#nbCanvas");
  if(!start||!reset||!canvas) return;

  const ctx=canvas.getContext("2d");
  const symbols=["✚","◆","●","▲","✦","⬟","✖","✿","☼"];
  canvas.width=320; canvas.height=320;

  let n=2, idx=-1, stream=[], time=60, score=0, hits=0, falseAlarms=0, misses=0,
      stimTimer=null, secTimer=null, best=+localStorage.getItem("nbBest2025")||0, running=false;
  if(bestEl) bestEl.textContent=best?best:"—";

  function drawGrid(){
    ctx.clearRect(0,0,320,320);
    ctx.strokeStyle="rgba(255,255,255,.16)"; ctx.lineWidth=1;
    for(let i=1;i<3;i++){
      ctx.beginPath(); ctx.moveTo(i*106.66,0); ctx.lineTo(i*106.66,320); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,i*106.66); ctx.lineTo(320,i*106.66); ctx.stroke();
    }
  }
  function drawStim(sym,pos){
    drawGrid();
    const cell=320/3;
    const x=(pos%3)*cell+cell/2, y=Math.floor(pos/3)*cell+cell/2;
    // glow
    const g=ctx.createRadialGradient(x,y,6,x,y,36);
    g.addColorStop(0,"rgba(164,107,255,.85)");
    g.addColorStop(1,"rgba(164,107,255,0)");
    ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,36,0,Math.PI*2); ctx.fill();
    // symbol
    ctx.fillStyle="#e9efff"; ctx.font="bold 44px system-ui,Segoe UI,Arial"; ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText(sym,x,y);
  }

  function newStimulus(){
    const pos=Math.floor(Math.random()*9);
    const sym=symbols[Math.floor(Math.random()*symbols.length)];
    stream.push({pos,sym,ts:performance.now()});
    if(stream.length>64) stream.shift();
    idx++;
    drawStim(sym,pos);
    // uproszczone „miss” po 1.2s, jeśli była szansa na trafienie
    const localIdx=idx;
    setTimeout(()=>{
      if(localIdx-n<0) return;
      const cur=stream[localIdx], back=stream[localIdx-n];
      const mPos=cur.pos===back.pos, mSym=cur.sym===back.sym;
      if(!(mPos||mSym)) return;
      misses++; updateUI();
    }, 1200);
  }

  function updateUI(){
    if(timeEl) timeEl.textContent=time+"s";
    if(scoreEl) scoreEl.textContent=score;
    if(levelEl) levelEl.textContent="N-"+n;
    const attempts=hits+falseAlarms+misses;
    const acc=attempts?Math.round(hits*100/attempts):0;
    if(accEl) accEl.textContent=acc+"%";
    if(bestEl) bestEl.textContent=best||"—";
  }

  function check(type){
    if(idx-n<0) return;
    const cur=stream[idx], back=stream[idx-n];
    const matchPos=cur.pos===back.pos, matchSym=cur.sym===back.sym;
    const correct=(type==="pos"?matchPos:matchSym);
    if(correct){ score++; hits++; } else { score=Math.max(0,score-1); falseAlarms++; }
    const total=hits+falseAlarms+misses;
    if(total>0 && total%6===0){
      const acc=Math.round(hits*100/total);
      if(acc>=80 && n<4) n++;
      else if(acc<=50 && n>1) n--;
    }
    updateUI();
  }

  function startGame(){
    if(running) return; running=true;
    n=2; idx=-1; stream=[]; time=60; score=0; hits=0; falseAlarms=0; misses=0;
    drawGrid(); updateUI(); newStimulus();
    clearInterval(stimTimer); clearInterval(secTimer);
    stimTimer=setInterval(newStimulus, 1500);
    secTimer=setInterval(()=>{ time--; updateUI(); if(time<=0) endGame(); }, 1000);
  }

  function endGame(){
    running=false;
    clearInterval(stimTimer); clearInterval(secTimer);
    const attempts=hits+falseAlarms+misses;
    const acc=attempts?Math.round(hits*100/attempts):0;
    if(score>best){ best=score; localStorage.setItem("nbBest2025",best); }
    if(bestEl) bestEl.textContent=best||"—";
    showToast(`Koniec! Wynik: ${score} • Acc ${acc}% • N=${n}`);
  }

  function resetGame(){
    running=false;
    clearInterval(stimTimer); clearInterval(secTimer);
    n=2; idx=-1; stream=[]; time=60; score=0; hits=0; falseAlarms=0; misses=0;
    drawGrid(); updateUI();
  }

  start.addEventListener("click",startGame);
  reset.addEventListener("click",resetGame);
  if(posBtn) posBtn.addEventListener("click",()=>{ if(running) check("pos"); });
  if(symBtn) symBtn.addEventListener("click",()=>{ if(running) check("sym"); });
  document.addEventListener("keydown",(e)=>{
    if(!running) return;
    if(e.key==="z"||e.key==="Z") check("pos");
    if(e.key==="x"||e.key==="X") check("sym");
  });
})();

})(); // koniec głównego IIFE
// pad 1
// pad 2
// pad 3
// pad 4
// pad 5
// pad 6
// pad 7
// pad 8
// pad 9
// pad 10
// pad 11
// pad 12
// pad 13
// pad 14
// pad 15
// pad 16
// pad 17
// pad 18
// pad 19
// pad 20
// pad 21
// pad 22
// pad 23
// pad 24
// pad 25
// pad 26
// pad 27
// pad 28
// pad 29
// pad 30
// pad 31
// pad 32
// pad 33
// pad 34
// pad 35
// pad 36
// pad 37
// pad 38
// pad 39
// pad 40
// pad 41
// pad 42
// pad 43
// pad 44
// pad 45
// pad 46
// pad 47
// pad 48
// pad 49
// pad 50
// pad 51
// pad 52
// pad 53
// pad 54
// pad 55
// pad 56
// pad 57
// pad 58
// pad 59
// pad 60
// pad 61
// pad 62
// pad 63
// pad 64
