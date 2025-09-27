// bh-init-3d.js — ensure CSS is loaded and hide 2D bodymap when 3D is active
(function(){
  try{
    // Add CSS once
    if (!document.querySelector('link[data-bh-3d]')){
      const l = document.createElement('link');
      l.rel='stylesheet'; l.href='assets/bh-3d.css'; l.setAttribute('data-bh-3d','');
      document.head.appendChild(l);
    }
    // If 3D on, hide legacy 2D bodymap widget (if present)
    const hide2D = ()=>{
      if (window.BH && window.BH.features && window.BH.features.body3d){
        const twoD = document.querySelector('.bh-bodymap'); if (twoD) twoD.style.display='none';
      }
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hide2D); else hide2D();
  }catch(e){}
})();
