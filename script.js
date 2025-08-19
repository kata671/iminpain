
// Kliknięcie w część ciała – pokazanie info
document.querySelectorAll('.overlay').forEach(part=>{
  part.addEventListener('click',()=>{
    const detail=document.getElementById('detail-content');
    detail.innerHTML="<p><strong>"+part.dataset.part+"</strong>: Szczegółowe informacje o bólu w tej części ciała.</p>";
    detail.scrollIntoView({behavior:'smooth'});
  });
});

// --- Przełącznik motywu (light/dark) z localStorage ---
(function(){
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if(saved === 'light'){ root.classList.add('theme-light'); }
  const btn = document.getElementById('themeToggle');
  if(!btn) return;
  btn.addEventListener('click', () => {
    root.classList.toggle('theme-light');
    const mode = root.classList.contains('theme-light') ? 'light' : 'dark';
    localStorage.setItem('theme', mode);
  });
})();

// --- Animacja wejścia sekcji (IntersectionObserver) ---
(function(){
  const els = document.querySelectorAll('.card, .hero');
  els.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  },{threshold:.15});
  els.forEach(el => io.observe(el));
})();
