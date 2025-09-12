/* BreathSync XR — Three.js breathing orb with shader & coherence scoring */
(function(){
  const $=(s,ctx=document)=>ctx.querySelector(s);
  const host=$("#brArena"); if(!host||!window.THREE) return;
  const elTime=$("#brTime"), elScore=$("#brScore");
  const btnStart=$("#brStart"), btnReset=$("#brReset");

  let renderer, scene, camera, orb, clock, running=false, timeLeft=90, coherence=0;
  let targetPhase=0; // 0..1
  let userPhase=0;   // 0..1
  let hold=false;

  function init(){
    renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
    renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
    renderer.setSize(host.clientWidth, host.clientHeight);
    host.innerHTML=""; host.appendChild(renderer.domElement);

    scene=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(55, host.clientWidth/host.clientHeight, 0.1, 100);
    camera.position.set(0,0,3.2);

    const light=new THREE.PointLight(0x9ad7ff, 1.2, 10); light.position.set(2,3,3); scene.add(light);
    scene.add(new THREE.AmbientLight(0x8888aa, .6));

    const geo=new THREE.SphereGeometry(1, 64, 64);
    const mat=new THREE.ShaderMaterial({
      uniforms:{ uTime:{value:0}, uPhase:{value:0}, uColorA:{value:new THREE.Color(0x5eead4)}, uColorB:{value:new THREE.Color(0xa46bff)} },
      vertexShader:`varying vec2 vUv; uniform float uPhase; void main(){ vUv=uv; float s=1.0 + 0.18*sin(6.2831*uPhase); vec3 pos=position*s; gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.0); }`,
      fragmentShader:`varying vec2 vUv; uniform float uPhase; uniform vec3 uColorA; uniform vec3 uColorB; void main(){ float r=length(vUv-0.5); float glow=smoothstep(0.6,0.0,r); float pulse=0.5+0.5*sin(6.2831*uPhase); vec3 col=mix(uColorB,uColorA,pulse)*glow; gl_FragColor=vec4(col, 0.95); }`,
      transparent:true
    });
    orb=new THREE.Mesh(geo, mat); scene.add(orb);

    window.addEventListener('resize', onResize);
    clock=new THREE.Clock();
    animate();
  }
  function onResize(){ if(!renderer) return; renderer.setSize(host.clientWidth, host.clientHeight); camera.aspect=host.clientWidth/host.clientHeight; camera.updateProjectionMatrix(); }
  function animate(){
    requestAnimationFrame(animate);
    const dt=clock.getDelta();
    targetPhase = (targetPhase + dt/10.0) % 1.0;
    orb.material.uniforms.uPhase.value = targetPhase;
    orb.rotation.y += dt*0.3;
    userPhase = (userPhase + (hold? dt/5.0 : -dt/5.0)); if(userPhase>1) userPhase=1; if(userPhase<0) userPhase=0;
    const diff = Math.abs(targetPhase - userPhase);
    const coh = Math.max(0, 1.0 - Math.min(diff, 1.0));
    if(running) coherence = 0.98*coherence + 0.02*coh;
    renderer.render(scene,camera);
  }

  function startGame(){ running=true; timeLeft=90; coherence=0; updateHUD(); toast("Oddychaj: przytrzymaj (wdech) / puść (wydech) • spacja lub dotyk"); timerTick(); }
  function timerTick(){ if(!running) return; setTimeout(()=>{ timeLeft--; updateHUD(); if(timeLeft<=0) endGame(); else timerTick(); },1000); }
  function endGame(){ running=false; const pct = Math.round(coherence*100); toast("Koherencja: "+pct+"%"); }
  function resetGame(){ running=false; timeLeft=90; coherence=0; updateHUD(); }
  function updateHUD(){ if(elTime) elTime.textContent = timeLeft+"s"; if(elScore) elScore.textContent = Math.round(coherence*100)+"%"; }
  function toast(m){ (window.__toast||(()=>{}))(m); }
  window.addEventListener('keydown', (e)=>{ if(e.code==='Space') hold=true; }, {passive:true});
  window.addEventListener('keyup',   (e)=>{ if(e.code==='Space') hold=false; }, {passive:true});
  host.addEventListener('pointerdown', ()=>{ hold=true; }, {passive:true});
  host.addEventListener('pointerup',   ()=>{ hold=false; }, {passive:true});
  host.addEventListener('pointerleave',()=>{ hold=false; }, {passive:true});
  if(document.readyState!=="loading"){ init(); } else { window.addEventListener("DOMContentLoaded", init); }
  btnStart && btnStart.addEventListener("click", startGame);
  btnReset && btnReset.addEventListener("click", resetGame);
})();
