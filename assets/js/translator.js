/* === TRANSLATOR MOBILE FIX (translator.js) === */
(function(){
  var SOURCE_LANG = 'pl'; // język bazowy strony

  function setCookie(name, value, days){
    var d = new Date();
    d.setTime(d.getTime() + (days*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }
  function getStoredLang(){
    try { return localStorage.getItem('preferred_lang') || null; } catch(e){ return null; }
  }
  function storeLang(lang){
    try { localStorage.setItem('preferred_lang', lang); } catch(e){}
  }
  function applyLang(lang){
    if(!lang) return;
    setCookie('googtrans', '/' + SOURCE_LANG + '/' + lang, 365);
    setCookie('googtrans', '/' + SOURCE_LANG + '/' + lang, 365, window.location.hostname);
    var combo = document.querySelector('select.goog-te-combo');
    if(combo && combo.value !== lang){
      combo.value = lang;
      var event = document.createEvent("HTMLEvents");
      event.initEvent("change", true, true);
      combo.dispatchEvent(event);
    }
  }

  function moveWidgetIntoFab(){
    var fab = document.getElementById('translator-fab');
    if(!fab) return;
    var gtExisting = document.getElementById('google_translate_element');
    var target = gtExisting || document.getElementById('google_translate_element_placeholder');
    if(!target) return;
    if(target.parentElement !== fab){
      fab.appendChild(target);
    }
  }

  var mo = new MutationObserver(function(){
    moveWidgetIntoFab();
    var saved = getStoredLang();
    if(saved) applyLang(saved);
    var combo = document.querySelector('select.goog-te-combo');
    if(combo && !combo.dataset.bound){
      combo.dataset.bound = '1';
      combo.addEventListener('change', function(){
        var val = combo.value;
        if(val){
          storeLang(val);
          applyLang(val);
        }
      });
    }
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });

  moveWidgetIntoFab();
  applyLang(getStoredLang());

  window.addEventListener('load', function(){
    try {
      var frames = document.querySelectorAll('iframe.goog-te-banner-frame');
      frames.forEach(function(f){ f.style.display = 'none'; });
      document.body.style.top = '0px';
    } catch(e){}
  });
})();

/* === DODATKOWY CSS wstrzykiwany dynamicznie === */
var css = `
:root{
  --translator-top: 10px;
  --translator-right: 10px;
}
@media (max-width: 768px){
  #translator-fab{
    position: fixed;
    top: calc(var(--translator-top) + env(safe-area-inset-top));
    right: calc(var(--translator-right) + env(safe-area-inset-right));
    z-index: 2147483647;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    max-width: 48vw;
    overflow: hidden;
  }
  #translator-fab .goog-te-gadget{
    font-size: 0 !important;
    line-height: 1 !important;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    white-space: nowrap;
  }
  #translator-fab .goog-te-gadget img{
    height: 20px !important;
    width: auto !important;
  }
  #translator-fab .goog-te-combo{
    font-size: 13px !important;
    padding: 6px 8px !important;
    max-width: 40vw;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.goog-te-banner-frame.skiptranslate { display: none !important; }
body { top: 0px !important; }
#translator-fab, #translator-fab *{ box-sizing: border-box; }
#translator-fab{ aria-label: "Przetłumacz stronę"; }
#google_translate_element_placeholder{ display: inline-block; }
`;
var style = document.createElement("style");
style.innerHTML = css;
document.head.appendChild(style);

// Utworzenie kontenera na translator
if(!document.getElementById("translator-fab")){
  var div = document.createElement("div");
  div.id = "translator-fab";
  var ph = document.createElement("div");
  ph.id = "google_translate_element_placeholder";
  div.appendChild(ph);
  document.body.appendChild(div);
}
