/**
 * Boli Help — łatka wyszukiwarki (nie jest to ChatGPT).
 * Wgraj jako assets/bh-ai-fix.js
 * W index.html NAD </body>, PO bh-ceo.js:
 *   <script src="assets/bh-ai-fix.js?v=1" defer></script>
 */
(function () {
  if (window.__BH_AI_FIX__) return;
  window.__BH_AI_FIX__ = '1';

  function dePL(s) {
    return String(s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ł/g, 'l').replace(/ś/g, 's').replace(/ż/g, 'z')
      .replace(/ź/g, 'z').replace(/ć/g, 'c').replace(/ą/g, 'a')
      .replace(/ę/g, 'e').replace(/ó/g, 'o');
  }

  var ROUTES = [
    { id: 'serce', label: 'Klatka / serce — sprawdź czerwone flagi', keys: ['pod zebrami', 'pod zebrem', 'zebrami', 'zebra', 'watek', 'mostek', 'ucisk w klatce', 'bol w klatce', 'promieniuje do reki', 'zimny pot', 'duszno', 'duszność', 'duszosc'] },
    { id: 'brzuch', label: 'Brzuch / nadbrzusze', keys: ['pod zebrami', 'nadbrzusze', 'zoladek', 'zolgdek', 'zgaga', 'watrob', 'pecherzyk', 'zolci', 'zolta', 'nudnosci', 'wymiot', 'biegunka', 'zaparcie', 'pępek', 'pepek'] },
    { id: 'nerki', label: 'Bok / lędźwie / nerki', keys: ['ledzwie', 'w boku', 'kolka', 'nerk', 'mocz', 'pieczenie przy'] },
    { id: 'uszy', label: 'Uszy', keys: ['ucho', 'uszy', 'szum', 'zatkane ucho', 'sluch'] },
    { id: 'glowa', label: 'Głowa', keys: ['glowa', 'migrena', 'szum', 'zawroty'] },
    { id: 'gardlo', label: 'Gardło', keys: ['gardlo', 'angina', 'polykan'] },
    { id: 'zeby', label: 'Ząb', keys: ['zab', 'zeb', 'dziąs', 'dzias'] },
    { id: 'plecy', label: 'Plecy', keys: ['plecy', 'krzyz', 'rwa', 'kregoslup'] },
    { id: 'reanimacja', label: 'RKO', keys: ['nie oddycha', 'reanim', 'rko', 'zemdlal'] },
    { id: 'zadlawienie', label: 'Zadławienie', keys: ['zadlaw', 'krztusi', 'cos w gardle'] }
  ];

  function flags(t) {
    return /zimny pot|duszno|duszosc|promieniuje|omdlen|nie oddycha|silny ucisk|nagle osłab|nagle oslab|krew w stolc|czarny stolec|sztywny kark/.test(t);
  }

  function match(text) {
    var t = dePL(text);
    var hits = [];
    ROUTES.forEach(function (r) {
      var s = 0;
      r.keys.forEach(function (k) { if (t.indexOf(dePL(k)) !== -1) s += 3; });
      if (s) hits.push({ id: r.id, label: r.label, score: s });
    });
    hits.sort(function (a, b) { return b.score - a.score; });
    return { hits: hits, red: flags(t), raw: t };
  }

  function paint(res) {
    var out = document.getElementById('bhAi2Results');
    if (!out) return;
    var typ = (document.getElementById('bhAi2Typ') || {}).value || 'kobieta';
    var html = '';
    if (res.red) {
      html += '<div class="bh-ai-card" style="border:1px solid #e5484d"><div class="bh-ai-left"><div class="bh-ai-title">Czerwone flagi</div><div class="bh-ai-meta">Przy duszności, zimnym pocie, promieniowaniu, omdleniu — <b>112</b>. To nie jest diagnoza.</div></div><a class="bh-ai-go" href="tel:112">112</a></div>';
    }
    if (!res.hits.length) {
      html += '<div class="bh-ai-card"><div class="bh-ai-left"><div class="bh-ai-title">Nie mam pewnego obszaru</div><div class="bh-ai-meta">Najczęściej „pod żebrami” to nadbrzusze (żołądek/wątroba) albo klatka. Wybierz jedną kartę. Przy silnym ucisku i duszności — 112.</div></div></div>';
      res.hits = [
        { id: 'brzuch', label: 'Brzuch / nadbrzusze' },
        { id: 'serce', label: 'Klatka / serce' }
      ];
    }
    res.hits.slice(0, 4).forEach(function (h) {
      var url = 'szczegoly.html?typ=' + encodeURIComponent(typ) + '&czesc=' + encodeURIComponent(h.id) + '&label=' + encodeURIComponent(h.label);
      html += '<div class="bh-ai-card"><div class="bh-ai-left"><div class="bh-ai-title">' + h.label + '</div><div class="bh-ai-meta">podpowiedź edukacyjna</div></div><a class="bh-ai-go" href="' + url + '">Otwórz</a></div>';
    });
    out.innerHTML = html;
  }

  function hook() {
    var run = document.getElementById('bhAi2Run');
    var txt = document.getElementById('bhAi2Text');
    if (!run || !txt || run.dataset.bhFix) return false;
    run.dataset.bhFix = '1';
    run.addEventListener('click', function (e) {
      e.stopImmediatePropagation();
      paint(match(txt.value));
    }, true);
    txt.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        paint(match(txt.value));
      }
    });
    var ph = txt.getAttribute('placeholder') || '';
    if (ph) txt.setAttribute('placeholder', 'np. boli mnie pod żebrami po prawej, gorzej po jedzeniu');
    return true;
  }

  var n = 0;
  var iv = setInterval(function () {
    if (hook() || ++n > 40) clearInterval(iv);
  }, 200);
})();
