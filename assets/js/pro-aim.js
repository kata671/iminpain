/* Holo Aim Arena — PIXI.js (neon targets, particles, combo) */
(function(){
  const $=(s,ctx=document)=>ctx.querySelector(s);
  const host=$("#aimArena"); if(!host||!window.PIXI) return;

  const elScore=$("#aimScore"), elCombo=$("#aimCombo"), elTime=$("#aimTime"), elBest=$("#aimBest");
  const elLevel=$("#aimLevel"), btnStart=$("#aimStart"), btnReset=$("#aimReset");

  let app, targetsLayer, particlesLayer;
  function createApp(){
    if(app) app.destroy(true,{children:true,texture:true,baseTexture:true});
    app=new PIXI.Application({resizeTo:host, backgroundAlpha:0, antialias:true, powerPreference:"high-performance"});
    host.innerHTML=""; host.appendChild(app.view);
    particlesLayer=new PIXI.ParticleContainer(2048,{scale:true,position:true,rotation:true,alpha:true});
    targetsLayer=new PIXI.Container();
    app.stage.addChild(particlesLayer); app.stage.addChild(targetsLayer);

    if(PIXI.filters && PIXI.filters.GlowFilter){
      targetsLayer.filters=[new PIXI.filters.GlowFilter({distance:24, outerStrength:2, innerStrength:1, color:0xA46BFF, quality:.25})];
    }
    app.ticker.add(update);
  }

  let running=false, timeLeft=60, score=0, combo=1, best=+(localStorage.getItem("aimBestPro")||0);
  if(elBest) elBest.textContent = best?best:"—";
  let spawnTimer=0, spawnRate=.9;
  const targets=[]; const pool=[];

  function applyLevel(){
    const v=(elLevel&&elLevel.value)||'normal';
    spawnRate = v==='easy'?1.1 : v==='normal'?0.85 : v==='hard'?0.65 : 0.48;
  }

  function makeTarget(){
    const size = rand(34, 82);
    const ring = new PIXI.Graphics();
    ring.lineStyle(3, 0x5eead4, 1); ring.drawCircle(0,0,size*.5);
    const core = new PIXI.Graphics(); core.beginFill(0xffffff,.9); core.drawCircle(0,0,size*.18); core.endFill();
    const c=new PIXI.Container(); c.addChild(ring); c.addChild(core);
    c.x = rand(size, app.renderer.width-size); c.y = rand(size, app.renderer.height-size);
    c.scale.set(.7); c.alpha=0;

    const hit = new PIXI.Graphics(); hit.beginFill(0, .001); hit.drawCircle(0,0,size*.6); hit.endFill(); hit.interactive=true; hit.cursor='crosshair';
    c.addChild(hit);

    const born=performance.now(), life=rand(800,1400);
    const obj={c,size,born,life,alive:true,xv:rand(-.25,.25),yv:rand(-.25,.25)};
    targets.push(obj); targetsLayer.addChild(c);

    hit.on('pointerdown',()=>shoot(obj));

    app.ticker.addOnce(()=>{
      const step=(d)=>{ c.alpha=Math.min(1,c.alpha+.12*d); const sc=c.scale.x+.08*d; c.scale.set(Math.min(1,sc)); if(sc>=1) app.ticker.remove(step); };
      app.ticker.add(step);
    });
  }

  function shoot(o){
    if(!running || !o.alive) return;
    o.alive=false;
    score += Math.max(1, Math.round(2 + o.size/20)) * combo;
    combo = Math.min(10, combo+1); updateHUD();
    burst(o.c.x, o.c.y, o.size);
    const ref=o.c; const fade=(d)=>{ ref.scale.x=ref.scale.y=Math.max(0,ref.scale.x-.09*d); ref.alpha=Math.max(0,ref.alpha-.12*d); if(ref.alpha<=0){ app.ticker.remove(fade); targetsLayer.removeChild(ref); ref.destroy({children:true}); } };
    app.ticker.add(fade);
  }

  function burst(x,y,size){
    const n=Math.round(10+size/4);
    for(let i=0;i<n;i++){
      const p=get(); p.x=x; p.y=y; p.alpha=.9; p.scale.set(rand(.3,.9));
      const a=Math.random()*Math.PI*2, s=rand(2,5+size/20); p.vx=Math.cos(a)*s; p.vy=Math.sin(a)*s; p.va=-rand(.012,.02); p.life=rand(18,32);
      particlesLayer.addChild(p);
    }
  }
  function get(){
    let g=pool.pop(); if(!g){ g=new PIXI.Graphics(); g.beginFill(0x5eead4,1); g.drawPolygon([0,-2,4,0,0,2,-4,0]); g.endFill(); g.vx=0; g.vy=0; g.va=-.01; g.life=20; }
    return g;
  }
  function updateParticles(){
    for(let i=particlesLayer.children.length-1;i>=0;i--){
      const p=particlesLayer.children[i]; p.x+=p.vx; p.y+=p.vy; p.alpha+=p.va; p.life--; if(p.life<=0||p.alpha<=0){ particlesLayer.removeChild(p); pool.push(p); }
    }
  }

  function updateTargets(dt){
    const now=performance.now();
    for(let i=targets.length-1;i>=0;i--){
      const o=targets[i]; o.c.x+=o.xv*dt; o.c.y+=o.yv*dt;
      if(o.c.x<20||o.c.x>app.renderer.width-20) o.xv*=-1;
      if(o.c.y<20||o.c.y>app.renderer.height-20) o.yv*=-1;
      if(now-o.born>o.life && o.alive){ o.alive=false; combo=1; updateHUD();
        const ref=o.c; const fade=(d)=>{ ref.alpha-=.08*d; ref.scale.x=ref.scale.y=Math.max(0,ref.scale.x-.06*d); if(ref.alpha<=0){ app.ticker.remove(fade); targetsLayer.removeChild(ref); ref.destroy({children:true}); } };
        app.ticker.add(fade);
      }
      if(!o.alive) targets.splice(i,1);
    }
  }

  let decay=0, spawn=0;
  function update(delta){
    if(!running) return;
    const dt=delta;
    spawn += dt/60; decay += dt/60;
    if(spawn>=spawnRate){ spawn=0; makeTarget(); }
    if(decay>=1){ decay=0; timeLeft--; if(timeLeft<=0){ endGame(); } updateHUD(); }
    updateTargets(dt); updateParticles();
  }

  function startGame(){ applyLevel(); running=true; timeLeft=60; score=0; combo=1; updateHUD(); targets.splice(0); if(particlesLayer) particlesLayer.removeChildren(); window.__toast && __toast("Start!"); }
  function endGame(){ running=false; if(score>best){best=score; localStorage.setItem("aimBestPro",best);} updateHUD(); window.__toast && __toast("Koniec! Wynik: "+score); }
  function resetGame(){ running=false; timeLeft=60; score=0; combo=1; updateHUD(); targets.splice(0); if(particlesLayer) particlesLayer.removeChildren(); }

  function updateHUD(){ if(elScore) elScore.textContent=String(score); if(elCombo) elCombo.textContent="x"+String(combo); if(elTime) elTime.textContent=String(timeLeft)+"s"; if(elBest) elBest.textContent=best?String(best):"—"; }
  const rand=(a,b)=>a+Math.random()*(b-a);

  if(document.readyState!=="loading"){ createApp(); } else { window.addEventListener("DOMContentLoaded",createApp); }
  btnStart && btnStart.addEventListener("click", startGame);
  btnReset && btnReset.addEventListener("click", resetGame);
})();
