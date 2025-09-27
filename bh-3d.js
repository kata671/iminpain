// bh-3d.js — premium 3D body viewer (progressive, no-content-touch)
(function(){
  // Feature flag
  window.BH = window.BH || {}; window.BH.features = window.BH.features || {};
  if (!('body3d' in window.BH.features)) window.BH.features.body3d = true;
  if (!window.BH.features.body3d) return;

  // Only render on pages where body makes sense; always safe.
  const url = new URL(location.href);
  const czesc = (url.searchParams.get('czesc')||'').toLowerCase();
  const typ = (url.searchParams.get('typ')||'kobieta').toLowerCase();

  // Create container
  const wrap = document.createElement('div');
  wrap.className = 'bh3d-wrap';
  const canvas = document.createElement('canvas');
  canvas.className = 'bh3d-canvas';
  wrap.appendChild(canvas);

  const toolbar = document.createElement('div'); toolbar.className='bh3d-toolbar';
  toolbar.innerHTML = '<button class="bh3d-btn" data-act="reset">Reset</button>' +
                      '<button class="bh3d-btn" data-act="wire">Wire</button>' +
                      '<button class="bh3d-btn" data-act="center">Center</button>';
  wrap.appendChild(toolbar);

  const label = document.createElement('div'); label.className='bh3d-label'; label.textContent = '3D Body — drag to rotate, wheel to zoom';
  wrap.appendChild(label);

  const toast = document.createElement('div'); toast.className='bh3d-toast'; wrap.appendChild(toast);
  function showToast(text){ toast.textContent = text; toast.setAttribute('show',''); setTimeout(()=>toast.removeAttribute('show'), 1600); }

  // Insert into DOM
  document.body.appendChild(wrap);

  // Dynamically import Three.js and OrbitControls from CDN
  // Progressive enhancement: if this fails, we simply remove container.
  const load = async()=>{
    try{
      const three = await import('https://unpkg.com/three@0.160.0/build/three.module.js');
      const controlsMod = await import('https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js');
      const {Raycaster, Vector2, Scene, PerspectiveCamera, WebGLRenderer, sRGBEncoding, ACESFilmicToneMapping, Color,
             AmbientLight, DirectionalLight, Group, Mesh, MeshStandardMaterial, BoxGeometry, SphereGeometry, CylinderGeometry} = three;
      const {OrbitControls} = controlsMod;

      // Basic scene
      const scene = new Scene(); scene.background = new Color(0x0a0f14);
      const camera = new PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 1.4, 3.0);

      const renderer = new WebGLRenderer({canvas, antialias:true, alpha:true});
      renderer.outputEncoding = sRGBEncoding;
      renderer.toneMapping = ACESFilmicToneMapping;
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));

      // Lights
      scene.add(new AmbientLight(0xffffff, 0.6));
      const key = new DirectionalLight(0xffffff, 0.8); key.position.set(2,3,2); scene.add(key);
      const rim = new DirectionalLight(0x71d1ff, 0.6); rim.position.set(-2,2,-2); scene.add(rim);

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true; controls.dampingFactor = 0.08;
      controls.minDistance = 1.2; controls.maxDistance = 5.0;
      controls.target.set(0,1.2,0);

      // Build a high-quality parametric human proxy (until GLB is provided)
      // Crafted proportions and smooth materials; named parts for picking.
      const root = new Group(); root.name='human';
      const skin = new MeshStandardMaterial({ color: 0xd2e1e9, metalness: 0.05, roughness: 0.65 });
      function capsule(name, radiusTop, radiusBottom, height, cx, cy, cz, rx=0, ry=0, rz=0){
        // Build as cylinder + spheres to emulate capsule
        const g = new Group(); g.name=name; g.position.set(cx,cy,cz); g.rotation.set(rx,ry,rz);
        const cyl = new Mesh(new CylinderGeometry(radiusTop, radiusBottom, height, 24), skin);
        const sTop = new Mesh(new SphereGeometry(radiusTop, 24, 16), skin); sTop.position.y = height/2;
        const sBot = new Mesh(new SphereGeometry(radiusBottom, 24, 16), skin); sBot.position.y = -height/2;
        cyl.castShadow = sTop.castShadow = sBot.castShadow = true;
        g.add(cyl, sTop, sBot);
        return g;
      }
      // Torso
      const torso = new Mesh(new CylinderGeometry(0.42, 0.46, 1.0, 32), skin); torso.position.set(0,1.2,0); torso.name='klatka';
      const pelvis = new Mesh(new CylinderGeometry(0.40, 0.46, 0.4, 32), skin); pelvis.position.set(0,0.8,0); pelvis.name='biodra';
      root.add(torso, pelvis);
      // Head & neck
      const szyja = capsule('szyja', 0.14, 0.16, 0.18, 0,1.72,0, Math.PI/2,0,0);
      const glowa = new Mesh(new SphereGeometry(0.24, 40, 28), skin); glowa.position.set(0,1.95,0); glowa.name='glowa';
      root.add(szyja, glowa);
      // Arms
      const ramieL = capsule('ramie_L', 0.12, 0.12, 0.42, -0.54,1.36,0, 0,0,Math.PI/16);
      const ramieP = capsule('ramie_P', 0.12, 0.12, 0.42, 0.54,1.36,0, 0,0,-Math.PI/16);
      const przedramieL = capsule('przedramie_L', 0.10, 0.10, 0.38, -0.54,0.98,0);
      const przedramieP = capsule('przedramie_P', 0.10, 0.10, 0.38, 0.54,0.98,0);
      const dlonL = capsule('dlon_L', 0.09, 0.09, 0.18, -0.54,0.68,0);
      const dlonP = capsule('dlon_P', 0.09, 0.09, 0.18, 0.54,0.68,0);
      root.add(ramieL, ramieP, przedramieL, przedramieP, dlonL, dlonP);
      // Legs
      const udoL = capsule('udo_L', 0.17, 0.17, 0.54, -0.22,0.42,0);
      const udoP = capsule('udo_P', 0.17, 0.17, 0.54, 0.22,0.42,0);
      const lydkaL = capsule('lydka_L', 0.13, 0.11, 0.5, -0.22, -0.06,0);
      const lydkaP = capsule('lydka_P', 0.13, 0.11, 0.5, 0.22, -0.06,0);
      const stopaL = capsule('stopy_L', 0.11, 0.10, 0.24, -0.22, -0.48,0, 0,0,Math.PI/2);
      const stopaP = capsule('stopy_P', 0.11, 0.10, 0.24, 0.22, -0.48,0, 0,0,Math.PI/2);
      root.add(udoL, udoP, lydkaL, lydkaP, stopaL, stopaP);

      // Clickable hitboxes with mapping to your 'czesc' keys
      const hitMap = {
        glowa:'glowa', szyja:'szyja', klatka:'klatka', biodra:'biodra',
        ramie_L:'ramie', ramie_P:'ramie', dlon_L:'dlon', dlon_P:'dlon',
        udo_L:'udo', udo_P:'udo', lydka_L:'lydka', lydka_P:'lydka',
        stopy_L:'stopy', stopy_P:'stopy'
      };
      scene.add(root);

      // Responsive
      function resize(){
        const w = wrap.clientWidth, h = wrap.clientHeight;
        camera.aspect = w/h; camera.updateProjectionMatrix();
        renderer.setSize(w,h,false);
      }
      window.addEventListener('resize', resize); resize();

      // Raycaster for pick
      const ray = new Raycaster(); const mouse = new Vector2();
      function onPointer(ev){
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
        ray.setFromCamera(mouse, camera);
        const intersects = ray.intersectObjects(root.children, true);
        if (intersects.length){
          const obj = intersects[0].object.parent; // our capsule group
          const key = hitMap[obj.name] || null;
          if (key){
            // Navigate on szczegoly.html
            const u = new URL(location.href);
            if (u.pathname.toLowerCase().includes('szczegoly')){
              u.searchParams.set('czesc', key);
              u.searchParams.set('label', key.charAt(0).toUpperCase()+key.slice(1));
              location.href = u.toString();
            }
            showToast('Wybrano: ' + key);
          }
        }
      }
      renderer.domElement.addEventListener('click', onPointer);

      // Toolbar actions
      toolbar.addEventListener('click', (e)=>{
        const act = e.target?.dataset?.act;
        if (!act) return;
        if (act==='reset'){ controls.reset(); camera.position.set(0,1.4,3.0); controls.target.set(0,1.2,0); showToast('Reset'); }
        if (act==='wire'){
          const wire = !root.userData.wire;
          root.userData.wire = wire;
          root.traverse(o=>{ if (o.material){ o.material.wireframe = wire; } });
          showToast(wire ? 'Wireframe ON' : 'Wireframe OFF');
        }
        if (act==='center'){ controls.target.set(0,1.2,0); showToast('Centered'); }
      });

      // Animate
      function tick(){
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
      }
      tick();

      // Auto focus on current 'czesc'
      const focusMap = { glowa:[0,1.9,2.6, 0,1.9,0], klatka:[0,1.4,2.8, 0,1.2,0], biodra:[0,1.0,2.8, 0,0.9,0], udo:[0,0.4,2.6, 0,0.3,0], lydka:[0,-0.1,2.4, 0,-0.2,0], stopy:[0,-0.5,2.2, 0,-0.5,0] };
      if (focusMap[czesc]){
        const [cx,cy,czv, tx,ty,tz] = focusMap[czesc];
        camera.position.set(cx,cy,czv); controls.target.set(tx,ty,tz);
      }

    }catch(err){
      console.warn('BH 3D failed, removing viewer', err);
      wrap.remove();
    }
  };
  // Kick
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load);
  else load();
})(); 
