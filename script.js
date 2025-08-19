// Hotspoty w kartach
document.querySelectorAll('.segment').forEach(btn => {
  btn.addEventListener('click', () => {
    const gender = btn.parentElement.dataset.gender;     // 'female' | 'male'
    const area   = btn.dataset.area;                     // 'head' | 'torso' | 'legs'

    const map = {
      female: {
        head:  'female-head.html',
        torso: 'female-torso.html',
        legs:  'female-legs.html'
      },
      male: {
        head:  'male-head.html',
        torso: 'male-torso.html',
        legs:  'male-legs.html'
      }
    };

    const target = map[gender]?.[area];
    if (target) window.location.href = target;
  });
});

