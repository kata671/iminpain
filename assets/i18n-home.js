/* assets/i18n-home.js — nakładka tekstów dla index.html (tylko UI, zero list/HTML) */

(function(){
  const DICT = {
    pl: {
      brand_title:"Boli Help",
      brand_sub:"Pomoc i pierwsza pomoc w nagłych sytuacjach",
      pill_choke:"Zadławienie",
      pill_cpr:"Reanimacja",
      pill_accident:"Wypadek",
      pill_firstaid:"Pierwsza pomoc",
      pill_games:"Gry / Trening",
      pill_quizzes:"Quizy",
      btn_hosp:"🏥 Szpitale / SOR",
      btn_loc:"📍 Zlokalizuj mnie",
      subheadline:"Boli mnie — wybierz obszar bólu",
      advice_title:"Porada",
      advice_chip:"SOS • instrukcja",
      close_btn:"✕",
      video_head:"Materiał wideo",
      video_hint:"Dodaj plik: <code>assets/videos/&lt;nazwa&gt;.mp4</code> i zaktualizuj mapę poniżej.",
      card_woman:"Kobieta",
      card_man:"Mężczyzna",
      card_child:"Dziecko",
      search_ph:"Szukaj objawu, części ciała lub tematu…",
      sg_head:"Podpowiedzi"
    },
    en: {
      brand_title:"Boli Help",
      brand_sub:"Help and first aid in emergencies",
      pill_choke:"Choking",
      pill_cpr:"CPR",
      pill_accident:"Accident",
      pill_firstaid:"First aid",
      pill_games:"Games / Training",
      pill_quizzes:"Quizzes",
      btn_hosp:"🏥 Hospitals / ER",
      btn_loc:"📍 Locate me",
      subheadline:"It hurts — choose the area of pain",
      advice_title:"Advice",
      advice_chip:"SOS • instructions",
      close_btn:"✕",
      video_head:"Video",
      video_hint:"Add file: <code>assets/videos/&lt;name&gt;.mp4</code> and update the map below.",
      card_woman:"Woman",
      card_man:"Man",
      card_child:"Child",
      search_ph:"Search symptom, body part or topic…",
      sg_head:"Suggestions"
    }
  };

  function apply(){
    const t = (k)=> window.__lang.t(DICT, k);

    // data-i18n (tylko krótkie etykiety — BEZ podmiany list/HTML)
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if(val!=null){
        // zachowaj emoji na początku węzła tekstowego
        if(el.firstChild && el.firstChild.nodeType===3){
          el.firstChild.nodeValue = val;
        } else {
          el.innerHTML = val;
        }
      }
    });

    // placeholder wyszukiwarki
    const search = document.getElementById('bhSearch');
    if(search){
      const ph = t('search_ph');
      search.placeholder = ph;
      search.setAttribute('aria-label', ph);
    }

    // nagłówek panelu podpowiedzi (jeśli istnieje)
    document.querySelectorAll('.bh2025-sg-head').forEach(el=>{ el.textContent = t('sg_head'); });

    // labelka selektora języka (UI)
    const lab = document.querySelector('#bhLangPick label');
    if(lab) lab.textContent = (window.__lang.get()==='en' ? 'Language':'Język');
  }

  // start + nasłuch na bh:lang-changed (telefon/laptop)
  function init(){
    try{ apply(); }catch(_){}
    document.removeEventListener('bh:lang-changed', onLang);
    document.addEventListener('bh:lang-changed', onLang);
  }
  function onLang(){ try{ apply(); }catch(_){ } }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
