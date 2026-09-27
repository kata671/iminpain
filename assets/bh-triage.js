/**
 * Boli Help — triage na szczegółach (nie diagnoza).
 * Plik: assets/bh-triage.js
 * W szczegoly.html tuż NAD </body>:
 *   <script src="assets/bh-triage.js?v=1" defer></script>
 */
(function () {
  if (window.__BH_TRIAGE__) return;
  window.__BH_TRIAGE__ = '1';

  var Q = {};
  try {
    location.search.slice(1).split('&').forEach(function (p) {
      var i = p.indexOf('=');
      if (i > 0) Q[decodeURIComponent(p.slice(0, i))] = decodeURIComponent(p.slice(i + 1));
    });
  } catch (e) {}
  var part = (Q.czesc || Q.czesci || '').toLowerCase();

  var DB = {
    uszy: {
      title: 'Uszy',
      red: ['Nagła głuchota na jedno ucho', 'Wyciek krwi / ropa po urazie lub locie', 'Silne zawroty + wymioty + zaburzenia równowagi', 'Niemowlę z wysoką gorączką i płaczem'],
      yellow: ['Ból ucha + gorączka >38,5°C', 'Wyciek z ucha', 'Ból >48 h albo narasta'],
      green: ['Lekkie zatkanie po katarze', 'Szum bez utraty słuchu', 'Bez gorączki — obserwacja 24–48 h, nie patyczki do kanału']
    },
    glowa: {
      title: 'Głowa',
      red: ['Najgorszy ból w życiu, sztywny kark, wysypka', 'Udar: twarz/ręka/mowa (FAST)', 'Uraz głowy + wymioty / senność / padaczka'],
      yellow: ['Migrena z nowymi objawami', 'Ból + gorączka', 'Ból po uderzeniu, nawet „lekki”'],
      green: ['Znany ból napięciowy, bez flag', 'Nawodnienie, ciemność, paracetamol wg ulotki']
    },
    oko: {
      title: 'Oko',
      red: ['Nagła utrata widzenia', 'Ból + tęcza / półokrągłe halo + wymioty', 'Uraz chemiczny / ciało obce metal'],
      yellow: ['Ropa, silne światłowstręt, ból przy ruchu gałki'],
      green: ['Swędzenie, wiosenny katar, bez pogorszenia ostrości']
    },
    nos: {
      title: 'Nos',
      red: ['Krwotok, którego nie da się zatamować 20 min', 'Uraz + deformacja + wyciek przejrzystego płynu'],
      yellow: ['Zatoki + wysoka gorączka + obrzęk twarzy', 'Krew nawracająca'],
      green: ['Katar, zatkany nos, płukanie solą']
    },
    gardlo: {
      title: 'Gardło',
      red: ['Nie możesz przełknąć śliny / ślinisz się / duszność', 'Szczękościsk, ślinotok u dziecka'],
      yellow: ['Gorączka + nalot + ból >3 dni', 'Jednostronny silny ból (ropień?)'],
      green: ['Drapanie, chrypka bez duszności']
    },
    zeby: {
      title: 'Ząb',
      red: ['Obrzęk twarzy/szyi, gorączka, trudność z otwarciem ust', 'Uraz z wybiciem zęba'],
      yellow: ['Ból nocny, opuchnięcie dziąsła', 'Ropa'],
      green: ['Wrażliwość na zimne, bez opuchlizny — dentysta planowo']
    },
    szyja: {
      title: 'Szyja',
      red: ['Sztywny kark + gorączka + ból głowy', 'Osłabienie rąk / zaburzenia zwieraczy po urazie'],
      yellow: ['Ból po wypadku', 'Promieniowanie do ręki'],
      green: ['Sztywność po śnie, bez neurologii']
    },
    klatka: {
      title: 'Klatka',
      red: ['Ucisk + duszność + zimny pot + promieniowanie do ręki/szczęki — 112', 'Nagła duszność + ból przy wdechu'],
      yellow: ['Ból nowy, niejasny, nawet bez potu', 'Kaszel z krwią'],
      green: ['Ból punktowy przy ruchu/ucisku żebra po treningu']
    },
    serce: {
      title: 'Serce / klatka',
      red: ['Jak klatka: ucisk, duszność, pot, omdlenie — 112, nie jedź sam'],
      yellow: ['Kołatanie z zawrotami', 'Ból po wysiłku, nowy'],
      green: ['Kłucie sekundowe przy wdechu, bez duszności — i tak zgłoś lekarzowi jeśli wraca']
    },
    pluca: {
      title: 'Płuca',
      red: ['Ciężka duszność, sinienie, mowa urywana', 'Kaszel z dużą ilością krwi'],
      yellow: ['Duszność nowa, świsty, gorączka + duszność'],
      green: ['Lekki kaszel po przeziębieniu, bez duszności']
    },
    brzuch: {
      title: 'Brzuch / pod żebrami',
      red: ['Deskowaty brzuch, omdlenie, krew w stolcu / fusowate wymioty', 'Ciąża + ostry ból + plamienie'],
      yellow: ['Ból pod żebrami po prawej + gorączka / żółtaczka', 'Ból narasta, nie przechodzi, wymioty'],
      green: ['Zgaga po obfitym posiłku, bez flag — obserwacja, nie „na pewno żołądek”']
    },
    nerki: {
      title: 'Bok / nerki',
      red: ['Gorączka + dreszcze + ból lędźwi', 'Zatrzymanie moczu', 'Krew w moczu + silny ból'],
      yellow: ['Kolka, wymioty, ból falujący'],
      green: ['Lekki dyskomfort lędźwi po wysiłku, bez gorączki']
    },
    plecy: {
      title: 'Plecy',
      red: ['Uraz + niedowład / znieczulenie krocza / zatrzymanie moczu — 112'],
      yellow: ['Rwa z osłabieniem stopy', 'Ból w nocy, chudnięcie'],
      green: ['Lumbago po dźwignięciu, bez neurologii']
    },
    biodra: {
      title: 'Biodra / udo',
      red: ['Uraz + noga skręcona / nie do obciążenia'],
      yellow: ['Ból pachwiny + gorączka', 'Obrzęk uda'],
      green: ['Sztywność po siedzeniu']
    },
    kolano: {
      title: 'Kolano',
      red: ['Uraz + blokada + niestabilność + duży obrzęk od razu'],
      yellow: ['Nie możesz zgiąć, ciepłe kolano + gorączka'],
      green: ['Trzask bez obrzęku, ból po treningu']
    },
    lydka: {
      title: 'Łydka',
      red: ['Jednostronny obrzęk + ból + duszność (zator?) — 112'],
      yellow: ['Jednostronny obrzęk, ciepła łydka'],
      green: ['Skurcz po sporcie']
    },
    kostka: {
      title: 'Kostka',
      red: ['Deformacja, kość przebija skórę, brak czucia'],
      yellow: ['Nie staniesz, duży obrzęk, siniak'],
      green: ['Skręcenie lekkie — RICE, obciążanie wg bólu']
    },
    stopy: {
      title: 'Stopy',
      red: ['Cukrzyca + rana + czerwona smuga / gorączka'],
      yellow: ['Nagły ból + obrzęk stawu'],
      green: ['Odcisk, zmęczeniowy ból po marszu']
    },
    skora: {
      title: 'Skóra',
      red: ['Duszność + pokrzywka + obrzęk twarzy — 112', 'Szybko szerząca się czerwona smuga'],
      yellow: ['Ropień, gorączka, ugryzienie z narastaniem'],
      green: ['Suchość, swędzenie bez obrzęku']
    },
    ciaza: {
      title: 'Ciąża',
      red: ['Krwawienie, odpływanie wód, brak ruchów płodu, ból głowy + mroczki + obrzęk twarzy'],
      yellow: ['Ból podbrzusza, pieczenie przy moczu, ból łydki'],
      green: ['Nudności, zgaga, typowe dolegliwości — i tak zgłoś, jeśli coś nowego']
    },
    strefa: {
      title: 'Strefa intymna',
      red: ['Silny ból jąder, skręt? — SOR', 'Ciąża + ból + plamienie'],
      yellow: ['Ropa, wrzód, zatrzymanie moczu', 'Ból przy oddawaniu moczu + gorączka'],
      green: ['Lekkie pieczenie, bez gorączki — POZ / ginekolog planowo']
    }
  };

  DB.watek = DB.klatka;

  var d = DB[part] || {
    title: (Q.label || part || 'Objaw'),
    red: ['Duszność, omdlenie, zimny pot, nagły najgorszy ból, krew — 112'],
    yellow: ['Narasta, gorączka, nie przechodzi od doby'],
    green: ['Łagodne, znane, bez flag — POZ gdy nie mija']
  };

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html) n.innerHTML = html;
    return n;
  }

  function boot() {
    if (document.getElementById('bhTriage')) return;
    var st = document.createElement('style');
    st.textContent =
      '#bhTriage{max-width:980px;margin:12px auto 8px;padding:0 14px;font-family:system-ui,sans-serif}' +
      '#bhTriage h2{margin:0 0 8px;font-size:20px;color:#eef2ff}' +
      '#bhTriage .row{display:grid;gap:8px;margin-bottom:10px}' +
      '@media(min-width:800px){#bhTriage .row{grid-template-columns:1fr 1fr 1fr}}' +
      '#bhTriage article{border-radius:14px;padding:12px 14px;color:#0b1020}' +
      '#bhTriage .r{background:#ffd4d4;border:1px solid #e5484d}' +
      '#bhTriage .y{background:#ffe9c4;border:1px solid #e2a33a}' +
      '#bhTriage .g{background:#d4f5e6;border:1px solid #1fa971}' +
      '#bhTriage b{display:block;margin-bottom:6px}' +
      '#bhTriage ul{margin:0;padding-left:18px}' +
      '#bhTriage .note{color:#b8c2e0;font-size:13px;margin:0 0 8px}' +
      '#bhTriage a.tel{display:inline-block;margin-top:8px;background:#e5484d;color:#fff;padding:8px 12px;border-radius:10px;text-decoration:none;font-weight:800}';
    document.head.appendChild(st);

    var box = el('section', '');
    box.id = 'bhTriage';
    box.innerHTML =
      '<h2>' + d.title + ' — co robić teraz</h2>' +
      '<p class="note">To nie jest diagnoza. Wybierz kolor po tym, co się dzieje. Stare checkboxy niżej zostają.</p>' +
      '<div class="row">' +
        '<article class="r"><b>Czerwone — 112</b><ul>' + d.red.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul><a class="tel" href="tel:112">112</a></article>' +
        '<article class="y"><b>Żółte — dziś lekarz / SOR</b><ul>' + d.yellow.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></article>' +
        '<article class="g"><b>Zielone — obserwacja / POZ</b><ul>' + d.green.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></article>' +
      '</div>';

    var host = document.querySelector('.hero, .wrap, .container, main') || document.body;
    if (host.firstChild) host.insertBefore(box, host.firstChild);
    else host.appendChild(box);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
