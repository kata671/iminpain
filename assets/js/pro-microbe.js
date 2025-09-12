/* Microbe Lab — PIXI particle simulation with beam cleaning */
(function(){
  const $=(s,ctx=document)=>ctx.querySelector(s);
  const host=$("#miArena"); if(!host||!window.PIXI) return;
  const elTime=$("#miTime"), elScore=$("#miScore"), elBest=$("#miBest");
  const btnStart=$("#miStart"), btnReset=$("#miReset");

  let app, microbes=[], running=false, timeLeft=60, score=0, best=+(localStorage.getItem('miBest')||0);
  if(elBest) elBest.textContent = best?best:"—";

  function init(){
    app=new PIXI.Application({resizeTo:host, backgroundAlpha:0, antialias:true});
    host.innerHTML=""; host.appendChild(app.view);
    app.stage.interactive=true;
    app.ticker.add(update);
    beam=new PIXI.Graphics(); beam.alpha=.6; app.stage.addChild(beam);
    app.stage.on('pointermove', e=>{ const p=e.data.global; cx=p.x; cy=p.y; });
    app.stage.on('pointerdown', ()=>holding=true);
    app.stage.on('pointerup',   ()=>holding=false);
    spawnField();
  }

  let beam, cx=0, cy=0, holding=false;

  function spawnField(){
    microbes.forEach(m=>m.g.destroy()); microbes=[];
    const n = Math.max(80, Math.floor((app.renderer.width*app.renderer.height)/15000));
    for(let i=0;i<n;i++){
      const g=new PIXI.Graphics();
      const col = Math.random()<.5?0x5eead4:0xa46bff;
      g.beginFill(col,.9);
      const r=Math.random()*3+2;
      g.drawCircle(0,0,r);
      g.endFill();
      g.x=Math.random()*(app.renderer.width-40)+20;
      g.y=Math.random()*(app.renderer.height-40)+20;
      const m={g, r, vx:(Math.random()*2-1), vy:(Math.random()*2-1), alive:true, hp:Math.random()+1.0};
      app.stage.addChild(g); microbes.push(m);
    }
  }

  function update(delta){
    beam.clear();
    if(holding){
      beam.beginFill(0xffffff,.08); beam.lineStyle(2,0x5eead4,.8);
      beam.drawCircle(cx,cy,60); beam.endFill();
    }
    const W=app.renderer.width, H=app.renderer.height;
    for(const m of microbes){
      m.g.x+=m.vx*delta; m.g.y+=m.vy*delta;
      if(m.g.x<10||m.g.x>W-10) m.vx*=-1;
      if(m.g.y<10||m.g.y>H-10) m.vy*=-1;
      if(holding){
        const dx=m.g.x-cx, dy=m.g.y-cy, d2=dx*dx+dy*dy;
        if(d2<(60*60)){ m.hp-=0.03*delta; m.g.alpha = Math.max(.2, m.hp/2.0); if(m.hp<=0 && m.alive){ m.alive=false; score++; app.stage.removeChild(m.g);} }
      }
    }
    if(running){
      timeLeft -= delta/60;
      if(timeLeft<=0){ endGame(); }
      updateHUD();
    }
  }
  function startGame(){ running=true; timeLeft=60; score=0; updateHUD(); spawnField(); toast('Przytrzymaj, aby włączyć „laser”'); }
  function endGame(){ running=false; if(score>best){best=score; localStorage.setItem('miBest',best);} updateHUD(); toast('Koniec! Wynik: '+score); }
  function resetGame(){ running=false; timeLeft=60; score=0; updateHUD(); spawnField(); }
  function updateHUD(){ if(elTime) elTime.textContent=Math.max(0,Math.ceil(timeLeft))+'s'; if(elScore) elScore.textContent=String(score); if(elBest) elBest.textContent=best?String(best):'—'; }
  function toast(m){ (window.__toast||(()=>{}))(m); }

  if(document.readyState!=="loading"){ init(); } else { window.addEventListener("DOMContentLoaded", init); }
  btnStart && btnStart.addEventListener("click", startGame);
  btnReset && btnReset.addEventListener("click", resetGame);
})();
