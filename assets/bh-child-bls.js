/**
 * RKO i zadławienie: dorosły / dziecko / niemowlę
 * Plik: assets/bh-child-bls.js
 */
(function () {
  if (window.__BH_CHILD_BLS__) return;
  window.__BH_CHILD_BLS__ = '1';

  var q = '';
  try { q = (new URLSearchParams(location.search).get('czesc') || '').toLowerCase(); } catch (e) {}
  if (q !== 'reanimacja' && q !== 'zadlawienie') return;

  var CPR = {
    adult: {
      t: 'Dorosły',
      steps: [
        'Bezpieczeństwo, reakcja, oddech max 10 s.',
        'Brak oddechu → 112, AED.',
        'Uciski 5–6 cm, 100–120/min, środek klatki.',
        '30 uciśnięć + 2 oddechy (albo same uciski).',
        'Do służb / AED / oznak życia.'
      ]
    },
    child: {
      t: 'Dziecko (ok. 1–8 lat)',
      steps: [
        '5 oddechów na start, jeśli umiesz.',
        '112 na głośniku. AED z elektrodami pediatrycznymi, jeśli są.',
        'Głębokość ok. 1/3 klatki (ok. 5 cm), jedna lub dwie ręce.',
        'Sam: 30:2. We dwoje: 15:2.',
        'Nie przerywaj.'
      ]
    },
    infant: {
      t: 'Niemowlę (<1 rok)',
      steps: [
        '5 delikatnych oddechów usta–usta i nos.',
        '112 od razu.',
        'Dwa palce na mostku, ok. 4 cm (1/3 klatki).',
        'Sam: 30:2. We dwoje: 15:2.',
        'Nie uciskaj brzucha.'
      ]
    }
  };

  var CHOKE = {
    adult: {
      t: 'Dorosły / większe dziecko',
      steps: [
        'Skuteczny kaszel → tylko zachęcaj i obserwuj.',
        'Brak kaszlu: 5 uderzeń w plecy.',
        'Potem 5 uciśnięć nadbrzusza.',
        'Na zmianę 5 i 5.',
        'Utrata przytomności → RKO 30:2 + 112.'
      ]
    },
    child: {
      t: 'Małe dziecko (przytomne)',
      steps: [
        'Kaszel skuteczny → nie wkładaj palców na ślepo.',
        '5 pleców, potem 5 nadbrzusza (dostosuj siłę).',
        'Na zmianę, aż wyjdzie albo straci przytomność.',
        'Nieprzytomne → RKO, 112.'
      ]
    },
    infant: {
      t: 'Niemowlę',
      steps: [
        'Główką w dół, 5 uderzeń w plecy (między łopatkami).',
        'Odwróć: 5 uciśnięć klatki (nie brzucha).',
        'Na zmianę 5 plecy / 5 klatka.',
        'Nie rób Heimlicha na brzuchu niemowlęcia.',
        'Bez przytomności → RKO + 112.'
      ]
    }
  };

  var pack = q === 'zadlawienie' ? CHOKE : CPR;

  function boot() {
    if (document.getElementById('bhBls')) return;
    var st = document.createElement('style');
    st.textContent =
      '#bhBls{max-width:720px;margin:16px auto 24px;padding:0 14px}' +
      '#bhBls .tabs{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}' +
      '#bhBls button{flex:1;min-height:44px;border:0;border-radius:12px;font-weight:800;cursor:pointer;background:rgba(255,255,255,.12);color:#eef2ff}' +
      '#bhBls button.on{background:#34e3a0;color:#0b1020}' +
      '#bhBls ol{color:#eef2ff;line-height:1.45}' +
      '#bhBls .n{color:#b8c2e0;font-size:13px}' +
      '#bhBls a{color:#fff}';
    document.head.appendChild(st);

    var box = document.createElement('section');
    box.id = 'bhBls';
    box.innerHTML =
      '<p class="n">Skrót ERC/PRC. Dziecko i niemowlę mają <b>inny</b> start i głębokość. To nie szkolenie.</p>' +
      '<div class="tabs">' +
        '<button type="button" data-k="adult" class="on">Dorosły</button>' +
        '<button type="button" data-k="child">Dziecko</button>' +
        '<button type="button" data-k="infant">Niemowlę</button>' +
      '</div>' +
      '<h2 id="bhBlsT"></h2><ol id="bhBlsOl"></ol>' +
      '<p class="n"><a href="tel:112">112</a></p>';
    var host = document.querySelector('.wrap, .container, main') || document.body;
    host.appendChild(box);

    function show(k) {
      var d = pack[k];
      document.getElementById('bhBlsT').textContent = d.t;
      document.getElementById('bhBlsOl').innerHTML = d.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('');
      box.querySelectorAll('button').forEach(function (b) {
        b.classList.toggle('on', b.getAttribute('data-k') === k);
      });
    }
    box.querySelectorAll('button').forEach(function (b) {
      b.onclick = function () { show(b.getAttribute('data-k')); };
    });
    show('adult');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
