/**
 * Boli Help CEO overlay — additive only.
 * Path: assets/bh-ceo.js
 * One line before </body> in index.html:
 *   <script src="assets/bh-ceo.js?v=1" defer></script>
 */
(function () {
  if (window.__BH_CEO__) return;
  window.__BH_CEO__ = '1';

  var CSS = [
    '#bhCeoBar{position:fixed;left:0;right:0;bottom:0;z-index:50050;display:flex;gap:8px;',
    'padding:10px 12px calc(10px + env(safe-area-inset-bottom));background:rgba(8,10,24,.94);',
    'border-top:1px solid rgba(255,255,255,.14);}',
    '#bhCeoBar a,#bhCeoBar button{flex:1;min-height:48px;border:0;border-radius:12px;',
    'font-weight:800;font-size:16px;cursor:pointer;text-decoration:none;display:flex;',
    'align-items:center;justify-content:center;}',
    '#bhCeo112{background:#e5484d;color:#fff;}',
    '#bhCeoCpr{background:#34e3a0;color:#0b1020;}',
    '#bhCeoFoot{max-width:980px;margin:24px auto 96px;padding:0 16px;color:#b8c2e0;font-size:13px;line-height:1.5;}',
    '#bhCeoModal{position:fixed;inset:0;z-index:50060;background:rgba(6,8,20,.75);display:none;align-items:flex-end;justify-content:center;}',
    '#bhCeoModal.on{display:flex;}',
    '#bhCeoPanel{width:min(560px,100%);background:#161a36;color:#eef2ff;border-radius:20px 20px 0 0;padding:18px;}',
    '#bhCeoBeat{width:88px;height:88px;margin:8px auto 12px;border-radius:50%;background:#34e3a0;opacity:.4;display:grid;place-items:center;font-weight:900;}',
    '#bhCeoBeat.go{animation:bhCeoP .545s linear infinite;}',
    '@keyframes bhCeoP{0%{transform:scale(.92);opacity:.35}30%{transform:scale(1.08);opacity:1}100%{transform:scale(.92);opacity:.35}}',
    '#bhCeoActs{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;}',
    '#bhCeoActs>*{flex:1;min-height:44px;border-radius:12px;border:0;font-weight:800;cursor:pointer;text-decoration:none;display:flex;align-items:center;justify-content:center;}',
    '.bhCeoGo{background:#34e3a0;color:#0b1020;}',
    '.bhCeoRed{background:#e5484d;color:#fff;}',
    '.bhCeoGhost{background:transparent;color:#eef2ff;border:1px solid rgba(255,255,255,.2)!important;}',
    'body.bhCeoPad{padding-bottom:84px;}'
  ].join('');

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
  }

  var ctx, timer, on = false;

  function beep() {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = 880; g.gain.value = 0.05; o.connect(g); g.connect(ctx.destination);
      o.start(); setTimeout(function () { o.stop(); }, 40);
    } catch (e) {}
  }

  function run(v) {
    on = v;
    var b = document.getElementById('bhCeoBeat');
    var s = document.getElementById('bhCeoStart');
    if (b) b.classList.toggle('go', v);
    if (s) s.textContent = v ? 'Stop' : 'Start 110/min';
    if (timer) { clearInterval(timer); timer = null; }
    if (v) {
      if (ctx && ctx.state === 'suspended') ctx.resume();
      beep();
      timer = setInterval(beep, 545);
    }
  }

  ready(function () {
    if (!document.getElementById('bhCeoCss')) {
      var st = document.createElement('style');
      st.id = 'bhCeoCss';
      st.textContent = CSS;
      document.head.appendChild(st);
    }

    if (!document.querySelector('meta[name="description"]')) {
      var m = document.createElement('meta');
      m.name = 'description';
      m.content = 'Boli Help — pierwsza pomoc w Polsce: RKO, zadławienie, 112. To nie diagnoza. W zagrożeniu dzwoń 112.';
      document.head.appendChild(m);
    }

    if (!document.getElementById('bhCeoBar')) {
      var bar = document.createElement('div');
      bar.id = 'bhCeoBar';
      bar.innerHTML = '<a id="bhCeo112" href="tel:112">112</a><button type="button" id="bhCeoCpr">RKO</button>';
      document.body.appendChild(bar);
      document.body.classList.add('bhCeoPad');
    }

    if (!document.getElementById('bhCeoModal')) {
      var md = document.createElement('div');
      md.id = 'bhCeoModal';
      md.innerHTML =
        '<div id="bhCeoPanel" role="dialog">' +
        '<h2>Reanimacja (RKO)</h2>' +
        '<div id="bhCeoBeat">110</div>' +
        '<ol>' +
        '<li>Bezpieczeństwo, reakcja, oddech (max 10 s).</li>' +
        '<li>Brak prawidłowego oddechu → 112, poproś o AED.</li>' +
        '<li>Uciski 5–6 cm, 100–120/min, środek klatki.</li>' +
        '<li>30 uciśnięć + 2 oddechy (albo same uciski).</li>' +
        '<li>Nie przerywaj do służb / AED / oznak życia.</li>' +
        '</ol>' +
        '<p style="font-size:12px;color:#b8c2e0">Dziecko/niemowlę: inna głębokość, start od oddechów. 112 na głośniku.</p>' +
        '<div id="bhCeoActs">' +
        '<button type="button" class="bhCeoGo" id="bhCeoStart">Start 110/min</button>' +
        '<a class="bhCeoRed" href="tel:112">112</a>' +
        '<button type="button" class="bhCeoGhost" id="bhCeoX">Zamknij</button>' +
        '</div></div>';
      document.body.appendChild(md);
    }

    if (!document.getElementById('bhCeoFoot')) {
      var f = document.createElement('p');
      f.id = 'bhCeoFoot';
      f.innerHTML = 'Boli Help pomaga zorientować się w objawach i pierwszej pomocy. To nie poradnia i nie wynik badań. W nagłym zagrożeniu dzwoń <a href="tel:112" style="color:#fff">112</a>. RKO wg skrótu ERC/PRC.';
      (document.querySelector('.container') || document.body).appendChild(f);
    }

    document.getElementById('bhCeoCpr').onclick = function () {
      document.getElementById('bhCeoModal').classList.add('on');
    };
    document.getElementById('bhCeoX').onclick = function () {
      run(false);
      document.getElementById('bhCeoModal').classList.remove('on');
    };
    document.getElementById('bhCeoStart').onclick = function () { run(!on); };
    document.getElementById('bhCeoModal').addEventListener('click', function (e) {
      if (e.target.id === 'bhCeoModal') {
        run(false);
        e.target.classList.remove('on');
      }
    });
  });
})();
