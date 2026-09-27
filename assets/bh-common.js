/**
 * Jedna karta: Co bywa najczęściej + Kiedy 112
 * Plik: assets/bh-common.js
 */
(function () {
  if (window.__BH_COMMON__) return;
  window.__BH_COMMON__ = '1';

  function part() {
    try { return (new URLSearchParams(location.search).get('czesc') || '').toLowerCase(); }
    catch (e) { return ''; }
  }

  var C = {
    uszy: {
      often: ['Zapalenie ucha środkowego po katarze', 'Ucho pływaka', 'Korek woskowinowy', 'Zatkana trąbka (lot, alergia)', 'Ból rzutowany z zęba / stawu'],
      call: ['Nagła głuchota na jedno ucho', 'Wyciek krwi po urazie lub locie', 'Zawroty + wymioty + chwianie się', 'Niemowlę z wysoką gorączką i płaczem']
    },
    glowa: {
      often: ['Ból napięciowy', 'Migrena', 'Sinusowy ból przy katarze'],
      call: ['Najgorszy ból w życiu', 'Sztywny kark + gorączka', 'Udar FAST (twarz/ręka/mowa)', 'Uraz + wymioty / senność']
    },
    oko: {
      often: ['Zapalenie spojówek', 'Alergia', 'Zmęczenie oka'],
      call: ['Nagła utrata widzenia', 'Ból + halo + wymioty', 'Chemia / odprysk metalu']
    },
    nos: {
      often: ['Katar / alergia', 'Zatoki'],
      call: ['Krwotok >20 min', 'Uraz + wyciek jasnego płynu']
    },
    gardlo: {
      often: ['Wirusowe zapalenie gardła', 'Angina', 'Refluks dający drapanie'],
      call: ['Nie przełykasz śliny / duszność', 'Szczękościsk u dziecka']
    },
    zeby: {
      often: ['Próchnica / miazga', 'Ząb mądrości', 'Zatoki udające ząb'],
      call: ['Opuchlizna twarzy + gorączka', 'Wybitty ząb']
    },
    szyja: {
      often: ['Sztywność po śnie', 'Napięcie mięśni'],
      call: ['Sztywny kark + gorączka + ból głowy', 'Niedowład po urazie']
    },
    klatka: {
      often: ['Ból mięśniowy żebra', 'Refluks', 'Kaszel opłucnowy'],
      call: ['Ucisk + duszność + zimny pot', 'Promieniowanie do ręki/szczęki', 'Nagła duszność']
    },
    serce: {
      often: ['Kołatanie z stresu / kawy', 'Refluks udający klatkę'],
      call: ['Ucisk, pot, duszność, omdlenie — nie jedź sama, 112']
    },
    pluca: {
      often: ['Infekcja, kaszel', 'Astma / świsty'],
      call: ['Mowa urywana, sinienie, dużo krwi w kaszlu']
    },
    brzuch: {
      often: ['Niestrawność, zgaga, gaz', 'Kamica / pęcherzyk (prawe podżebrze)', 'Żołądek po tłustym'],
      call: ['Deskowaty brzuch, krew, omdlenie', 'Ciąża + ostry ból + plamienie']
    },
    nerki: {
      often: ['Kolka kamieniowa', 'Infekcja dróg moczowych'],
      call: ['Gorączka + dreszcze + lędźwie', 'Zatrzymanie moczu']
    },
    plecy: {
      often: ['Lumbago po dźwignięciu', 'Rwa kulszowa'],
      call: ['Niedowład, znieczulenie krocza, zatrzymanie moczu']
    },
    biodra: {
      often: ['Przeciążenie, sztywność'],
      call: ['Uraz + noga do obciążenia się nie nadaje']
    },
    kolano: {
      often: ['Przeciążenie, łąkotka po sporcie'],
      call: ['Blokada + duży obrzęk od razu po urazie']
    },
    lydka: {
      often: ['Skurcz, zakwaszenie'],
      call: ['Jednostronny obrzęk + duszność (zator?)']
    },
    kostka: {
      often: ['Skręcenie'],
      call: ['Deformacja, kość przez skórę']
    },
    stopy: {
      often: ['Odcisk, przeciążenie'],
      call: ['Cukrzyca + rana + czerwona smuga']
    },
    skora: {
      often: ['Suchość, alergia'],
      call: ['Pokrzywka + duszność + obrzęk twarzy']
    },
    ciaza: {
      often: ['Nudności, zgaga, ból krzyża'],
      call: ['Krwawienie, wody, brak ruchów, mroczki + obrzęk twarzy']
    },
    strefa: {
      often: ['Infekcja, podrażnienie'],
      call: ['Silny ból jądra', 'Ciąża + ból + plamienie', 'Zatrzymanie moczu']
    }
  };
  C.watek = C.klatka;

  function lis(arr) {
    return '<ul>' + arr.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>';
  }

  function hideChoroby() {
    document.querySelectorAll('[data-variant="dx"], #dx-open, #dx-hint').forEach(function (n) {
      n.style.display = 'none';
    });
    var panel = document.getElementById('s-dx');
    if (panel) panel.setAttribute('aria-hidden', 'true');
  }

  function boot() {
    hideChoroby();
    if (document.getElementById('bhCommon')) return;
    var p = part();
    var d = C[p] || {
      often: ['Dolegliwość tego miejsca — zobacz przyczyny niżej'],
      call: ['Duszność, omdlenie, zimny pot, krew, najgorszy ból — 112']
    };

    var st = document.createElement('style');
    st.textContent =
      '#bhCommon{max-width:980px;margin:12px auto;padding:0 14px}' +
      '#bhCommon .grid{display:grid;gap:10px}' +
      '@media(min-width:800px){#bhCommon .grid{grid-template-columns:1fr 1fr}}' +
      '#bhCommon article{border-radius:14px;padding:14px;color:#0b1020}' +
      '#bhCommon .a{background:#d4f5e6;border:1px solid #1fa971}' +
      '#bhCommon .b{background:#ffd4d4;border:1px solid #e5484d}' +
      '#bhCommon h2{margin:0 0 8px;font-size:18px}' +
      '#bhCommon ul{margin:0;padding-left:18px}' +
      '#bhCommon .n{color:#b8c2e0;font-size:13px;margin:0 0 10px}' +
      '#bhCommon a.tel{display:inline-block;margin-top:10px;background:#e5484d;color:#fff;padding:8px 12px;border-radius:10px;text-decoration:none;font-weight:800}';
    document.head.appendChild(st);

    var box = document.createElement('section');
    box.id = 'bhCommon';
    box.innerHTML =
      '<p class="n">Ten sam układ dla kobiety, mężczyzny i dziecka. To nie diagnoza.</p>' +
      '<div class="grid">' +
        '<article class="a"><h2>Co bywa najczęściej</h2>' + lis(d.often) + '</article>' +
        '<article class="b"><h2>Kiedy 112</h2>' + lis(d.call) + '<a class="tel" href="tel:112">112</a></article>' +
      '</div>';

    var old = document.getElementById('bhTriage');
    if (old) old.remove();

    var host = document.querySelector('.hero, .wrap, .container, main') || document.body;
    if (host.firstChild) host.insertBefore(box, host.firstChild);
    else host.appendChild(box);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
