(function () {
  if (window.__BH_INFANT_IMG__) return;
  window.__BH_INFANT_IMG__ = '1';
  var q = '';
  try { q = (new URLSearchParams(location.search).get('czesc') || '').toLowerCase(); } catch (e) {}
  if (q !== 'zadlawienie') return;
  var INFANT = 'img/zadlawienie-niemowle.png';
  var ADULT = 'img/zadlawienie.png';
  function pic(src) {
    var img = document.getElementById('img');
    if (img) img.src = src;
  }
  function hook() {
    document.querySelectorAll('#bhBls button').forEach(function (b) {
      b.addEventListener('click', function () {
        pic(b.getAttribute('data-k') === 'infant' ? INFANT : ADULT);
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hook);
  else hook();
})();
