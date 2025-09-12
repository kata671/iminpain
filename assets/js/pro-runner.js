/* Neuro Dash — Three.js endless runner (lanes, obstacles, swipe/keys) */
(function(){
  const $=(s,ctx=document)=>ctx.querySelector(s);
  const host=$("#runArena"); if(!host||!window.THREE) return;
  const elScore=$("#runScore"), elBest=$("#runBest");
  const btnStart=$("#runStart"), btnReset=$("#runReset");

  let renderer, scene, camera, player, obstacles=[], running=false, zSpeed=0.35, lane=0, score=0, best=+(localStorage.getItem('runBest')||0);
  if(elBest) elBest.textContent=best?best:"—";

  function init(){
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
    renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
    renderer.setSize(host.clientWidth, host.clientHeight);
    host.innerHTML=""; host.appendChild(renderer.domElement);
    scene=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(60, host.clientWidth/host.clientHeight, 0.1, 100);
    camera.position.set(0,2.0,5);

    const light=new THREE.DirectionalLight(0xffffff,1.0); light.position.set(2,5,3); scene.add(light);
    scene.add(new THREE.AmbientLight(0x8899ff,.6));

    const floorGeo=new THREE.PlaneGeometry(30,200,1,1);
    const floorMat=new THREE.MeshStandardMaterial({color:0x1a1f4a, metalness:.2, roughness:.6});
    const floor=new THREE.Mesh(floorGeo, floorMat); floor.rotation.x=-Math.PI/2; floor.position.z=-80; scene.add(floor);

    const pGeo=new THREE.BoxGeometry(0.8,0.8,0.8);
    const pMat=new THREE.MeshStandardMaterial({color:0x5eead4, emissive:0x224444, metalness:.5, roughness:.3});
    player=new THREE.Mesh(pGeo, pMat); player.position.set(0,0.6,0); scene.add(player);

    window.addEventListener('resize', onResize);
    animate();
  }
  function onResize(){ if(!renderer) return; renderer.setSize(host.clientWidth, host.clientHeight); camera.aspect=host.clientWidth/host.clientHeight; camera.updateProjectionMatrix(); }

  let lastT=performance.now();
  function animate(){
    requestAnimationFrame(animate);
    const now=performance.now(), dt=(now-lastT)/16.666; lastT=now;
    for(let i=obstacles.length-1;i>=0;i--){
      const o=obstacles[i];
      o.position.z += zSpeed*dt;
      if(o.position.z>5){ scene.remove(o); obstacles.splice(i,1); score++; updateHUD(); if(score%20===0) zSpeed+=0.02; }
      if(running && collide(player,o)){ gameOver(); }
    }
    const targetX = lane*1.6;
    player.position.x += (targetX - player.position.x)*0.2*dt;
    renderer.render(scene,camera);
  }
  function collide(a,b){
    const ax=a.position.x, az=a.position.z, aw=.4;
    const bx=b.position.x, bz=b.position.z, bw=.5;
    return Math.abs(ax-bx)<(aw+bw) && Math.abs(az-bz)<(aw+bw);
  }
  function spawn(){
    if(!running) return;
    const geo=new THREE.BoxGeometry(0.9,Math.random()*0.7+0.7,0.9);
    const mat=new THREE.MeshStandardMaterial({color:0xa46bff, emissive:0x221144, metalness:.4, roughness:.4});
    const box=new THREE.Mesh(geo,mat);
    const ln = [-1,0,1][Math.floor(Math.random()*3)];
    box.position.set(ln*1.6, geo.parameters.height/2, -30);
    scene.add(box); obstacles.push(box);
    setTimeout(spawn, Math.random()*350+500);
  }
  function startGame(){ running=true; zSpeed=0.35; lane=0; score=0; updateHUD(); obstacles.forEach(o=>scene.remove(o)); obstacles=[]; spawn(); toast("Lewa/Prawa lub gest — unikaj przeszkód"); }
  function gameOver(){ running=false; if(score>best){best=score; localStorage.setItem('runBest',best);} updateHUD(); toast("Koniec! Dystans: "+score); }
  function resetGame(){ running=false; zSpeed=0.35; lane=0; score=0; obstacles.forEach(o=>scene.remove(o)); obstacles=[]; updateHUD(); }
  function updateHUD(){ if(elScore) elScore.textContent=String(score); if(elBest) elBest.textContent = best?String(best):"—"; }

  window.addEventListener('keydown', (e)=>{
    if(e.key==='ArrowLeft' || e.key==='a') lane=Math.max(-1,lane-1);
    if(e.key==='ArrowRight'|| e.key==='d') lane=Math.min( 1,lane+1);
  });
  let sx=null;
  host.addEventListener('touchstart',e=>{ sx=e.touches[0].clientX; },{passive:true});
  host.addEventListener('touchend',e=>{ if(sx==null) return; const dx=(e.changedTouches[0].clientX-sx); if(Math.abs(dx)>30){ if(dx<0) lane=Math.max(-1,lane-1); else lane=Math.min(1,lane+1);} sx=null; },{passive:true});

  function toast(m){ (window.__toast||(()=>{}))(m); }

  if(document.readyState!=="loading"){ init(); } else { window.addEventListener("DOMContentLoaded", init); }
  btnStart && btnStart.addEventListener("click", startGame);
  btnReset && btnReset.addEventListener("click", resetGame);
})();
