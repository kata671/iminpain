const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

function call112(){ window.location.href = 'tel:112'; }
function openNearMe(){
  const fallback = () => window.open('https://www.google.com/maps/search/', '_blank');
  if(!navigator.geolocation){ fallback(); return; }
  navigator.geolocation.getCurrentPosition(pos=>{
    const {latitude, longitude} = pos.coords;
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
  }, fallback, {enableHighAccuracy:true, timeout:8000});
}
function openHospitals(){
  const q = encodeURIComponent('szpital SOR przychodnia pogotowie apteka');
  window.open(`https://www.google.com/maps/search/${q}/`, '_blank');
}
function openPharmacy(){ window.open('https://www.google.com/maps/search/apteka+otwarta+teraz/', '_blank'); }

function attachGridSearch(){
  const box = $('.search input'); const tiles = $$('.tile');
  if(!box || tiles.length===0) return;
  box.addEventListener('input', ()=>{
    const q = box.value.trim().toLowerCase();
    tiles.forEach(t=>{
      const label = t.dataset.label || '';
      t.style.display = label.includes(q) ? '' : 'none';
    });
  });
}

/* ====== PARTS ====== */
const PARTS_COMMON = [
  ['oko','Oko'],['nos','Nos'],['usta','Usta'],['ucho','Ucho'],['glowa','Głowa'],
  ['klatka','Klatka piersiowa'],['brzuch','Brzuch'],['plecy','Plecy'],
  ['ramie','Ramię'],['dlon','Dłoń'],['biodra','Biodra'],['udo','Udo'],
  ['kolano','Kolano'],['lydka','Łydka'],['stopy','Stopy'],
  ['serce','Serce'],['pluca','Płuca'],['watroba','Wątroba'],['zoladek','Żołądek'],
  ['nerki','Nerki']
];
const PARTS_WOMAN_EXTRA = [['ciaza','Ciąża']];
function getPartsForPage(pageType){
  return pageType==='kobieta' ? [...PARTS_WOMAN_EXTRA, ...PARTS_COMMON] : PARTS_COMMON;
}
function buildGrid(pageType){
  const grid = $('.grid'); if(!grid) return;
  const frag = document.createDocumentFragment();
  getPartsForPage(pageType).forEach(([key,label])=>{
    const a = document.createElement('a');
    a.href = `szczegoly.html?typ=${encodeURIComponent(pageType)}&czesc=${encodeURIComponent(key)}&label=${encodeURIComponent(label)}`;
    const tile = document.createElement('div'); tile.className = 'tile'; tile.dataset.label = label.toLowerCase();
    const img = document.createElement('img'); img.alt = label; img.loading = 'lazy'; img.src = `img/${pageType}-${key}.png`; img.onerror = ()=>{ img.src = 'img/placeholder.png'; };
    const cap = document.createElement('div'); cap.className = 'tcap'; cap.textContent = label;
    a.appendChild(img); a.appendChild(cap); tile.appendChild(a); frag.appendChild(tile);
  });
  grid.appendChild(frag);
  attachGridSearch();
}

/* ====== DB ====== (skrócona – kluczowe sekcje; możesz rozszerzać) */
const COMMON_PARTS_DB = {
  'oko': {
    symptoms:['Łzawienie, światłowstręt, pieczenie, zaczerwienienie, uczucie piasku, pogorszenie widzenia.'],
    causes:['Ciało obce, podrażnienie, infekcja, alergia, oparzenie chemiczne, uraz.'],
    steps:['Nie trzeć; zdejmij soczewki.','Płucz oko NaCl/wodą 10–15 min.','Ciała obce usuwaj tylko płukaniem.','Chemikalia/uraz penetrujący/utrata widzenia → natychmiast SOR (112 w razie potrzeby).'],
    otc:['Sztuczne łzy/NaCl; paracetamol.'],
    rx:['Krople/maści przeciwzapalne/antybiotyk – po badaniu okulisty.'],
    doctor:['Pilna okulistyka przy chemikaliach/urazie/utracie widzenia.']
  },
  'nos': {
    symptoms:['Katar, zatkanie, ból u nasady, krwawienie, zaburzenia węchu.'],
    causes:['Infekcja, alergia, uraz, suchość śluzówki, nadciśnienie.'],
    steps:['Krwotok: pochyl do przodu, ucisk skrzydełek 10 min.','Chłodzenie nasady nosa.','>20 min krwawienia lub uraz z deformacją → SOR.'],
    otc:['Sól morska/NaCl; paracetamol/ibuprofen.'],
    rx:['Miejscowe obkurczające (krótko), antybiotyk wg lekarza.'],
    doctor:['Laryngolog/POZ; SOR przy krwawieniu nieustępującym lub ciężkim urazie.']
  },
  'stopy': {
    symptoms:['Pęcherze, ból, obrzęk, niemożność obciążenia.'],
    causes:['Skręcenie, otarcia, złamanie zmęczeniowe.'],
    steps:['Pęcherze: nie przebijaj bez potrzeby, zabezpiecz.','Skręcenie: RICE; brak możliwości obciążenia → RTG.'],
    otc:['Plastry na pęcherze, NLPZ żele/doustne.'],
    rx:['Orteza/gips; rehabilitacja – wg lekarza.'],
    doctor:['Ortopeda; SOR przy ostrym urazie.']
  },
  /* … (pozostałe jak wcześniej – zostawiłem najważniejsze; jeśli chcesz, doślę pełną bazę z poprzedniej wersji) */
};

const GUIDES_DB = {
  'pierwszopomoc': {
    steps:[
      '1) Oceń bezpieczeństwo – nie narażaj siebie, rękawiczki.',
      '2) Sprawdź reakcję i oddech (10 s).',
      '3) Zadzwoń 112 (głośnomówiący).',
      '4) Brak oddechu → RKO (100–120/min, 5–6 cm; 30:2 jeśli potrafisz).',
      '5) Oddycha, nie reaguje → pozycja bezpieczna.',
      '6) Zatrzymaj masywny krwotok (ucisk/opatrunek).',
      '7) Zapobiegaj wychłodzeniu/wstrząsowi (połóż, nogi w górę, folia NRC).',
      '8) Monitoruj do przyjazdu ZRM.'
    ],
    toc:[
      {href:'szczegoly.html?typ=porada&czesc=reanimacja&label=Reanimacja', label:'⚡ Reanimacja'},
      {href:'szczegoly.html?typ=porada&czesc=zadlawienie&label=Zadławienie', label:'🫁 Zadławienie'},
      {href:'szczegoly.html?typ=porada&czesc=wypadek&label=Wypadek', label:'💥 Wypadek'}
    ]
  },
  'reanimacja': {
    steps:[
      'A) Rozpoznaj NZK: brak reakcji + brak prawidłowego oddechu 10 s.',
      'B) Zawołaj o pomoc/AED, dzwoń 112 (głośnomówiący).',
      'C) Uciskaj środek mostka: 100–120/min, 5–6 cm, pełny powrót klatki.',
      'D) 30:2 jeśli potrafisz wentylować; inaczej same uciski.',
      'E) AED: włącz, naklej elektrody, postępuj wg poleceń.',
      'F) Dzieci: 5 oddechów startowych; 30:2 (1 rat.) / 15:2 (2 rat.).'
    ]
  },
  'zadlawienie': {
    steps:[
      'A) Skuteczny kaszel → zachęcaj do kaszlu, obserwuj.',
      'B) Całkowita niedrożność: 5 uderzeń w plecy → 5 uciśnięć nadbrzusza.',
      'C) Powtarzaj 5/5 do usunięcia przeszkody lub utraty przytomności.',
      'D) Nieprzytomny: 112, RKO 30:2; kontrola jamy ustnej po 30.',
      'E) Niemowlę: 5 uderzeń w plecy → 5 uciśnięć klatki (2 palce).'
    ]
  },
  'wypadek': {
    steps:[
      'A) STOP – najpierw Twoje bezpieczeństwo: trójkąt, kamizelka, światła.',
      'B) Oceń sytuację i wezwij 112.',
      'C) Priorytety: przytomność/oddech → krwotok → drożność → wstrząs.',
      'D) Krwotok: ucisk/opatrunek uciskowy.',
      'E) Oparzenia: chłodź 10–20 min, usuń biżuterię nieprzyklejoną, okryj jałowo.'
    ]
  }
};

const PREGNANCY_DB = {
  base: {
    symptoms:['Typowe: nudności, zgaga, zmęczenie; Alarmowe: krwawienie, silny ból, brak ruchów płodu po 20 tyg.'],
    causes:['Fizjologiczne zmiany; stany nagłe: poród przedwczesny, stan przedrzucawkowy, ZUM.'],
    steps:['Lewy bok, nawadnianie; objawy alarmowe → 112/SOR/IP.'],
    otc:['Paracetamol po zaleceniu; elektrolity; folian, D, jod.'],
    rx:['Decyzja lekarza prowadzącego.'],
    doctor:['Kontakt z lekarzem/położną; objawy alarmowe → 112/SOR/IP.']
  }
};

const FIRST_AID_DB = { ...COMMON_PARTS_DB, ...GUIDES_DB, 'ciaza': PREGNANCY_DB.base };

/* ====== Poradniki: plansze (obrazki) ====== */
const GUIDE_DIAGRAMS = {
  reanimacja: 'img/reanimacja-diagram.png',
  zadlawienie: 'img/zadlawienie-diagram.png',
  wypadek: 'img/wypadek-diagram.png'
};
function makeBoard(src, caption){
  const wrap = document.createElement('figure'); wrap.className = 'board';
  const img = document.createElement('img'); img.loading = 'lazy'; img.src = src; img.alt = caption || ''; img.onerror = ()=>{ img.src = 'img/placeholder.png'; };
  const cap = document.createElement('figcaption'); cap.textContent = caption || '';
  wrap.appendChild(img); wrap.appendChild(cap);
  return wrap;
}
function insertAllBoards(){
  const cont = $('#fa-container'); if(!cont) return;
  const row = document.createElement('div'); row.className = 'board-row';
  row.appendChild(makeBoard(GUIDE_DIAGRAMS.reanimacja, 'Reanimacja — krok po kroku'));
  row.appendChild(makeBoard(GUIDE_DIAGRAMS.zadlawienie, 'Zadławienie — co robić'));
  row.appendChild(makeBoard(GUIDE_DIAGRAMS.wypadek, 'Wypadek — postępowanie'));
  cont.prepend(row);
}

/* ====== RENDER ====== */
function renderList(ul, items){
  if(!ul) return;
  ul.innerHTML = '';
  (items||[]).forEach(txt=>{
    const li = document.createElement('li'); li.textContent = txt; ul.appendChild(li);
  });
}
function hideIfEmpty(panelSel, list){
  const panel = $(panelSel);
  if(panel && (!list || list.length===0)) panel.style.display = 'none';
}
function renderPregnancyTrimesters(){ /* rozszerzenie na żądanie */ }

function initDetails(){
  window.scrollTo({top:0, behavior:'instant'});
  const p = new URLSearchParams(location.search);
  const typ = (p.get('typ')||'').toLowerCase();
  const czesc = (p.get('czesc')||'').toLowerCase();
  const label = p.get('label') || '';

  const title = $('#detailTitle'); const crumb = $('.breadcrumb span'); const img = $('#detailImg');
  if(title) title.textContent = label || 'Szczegóły';
  if(crumb) crumb.textContent = label || '';

  const isGuide = ['pierwszopomoc','reanimacja','zadlawienie','wypadek'].includes(czesc);
  if(img){
    if(GUIDE_DIAGRAMS[czesc]){
      img.src = GUIDE_DIAGRAMS[czesc]; img.alt = `${label} — schemat krok po kroku`; img.onerror = ()=>{ img.src='img/placeholder.png'; };
    } else if(isGuide){
      img.src = 'img/placeholder.png'; img.alt = label || 'Poradnik';
    } else {
      const src = `img/${typ}-${czesc}.png`; img.src = src; img.alt = label; img.onerror = ()=>{ img.src='img/placeholder.png'; };
    }
  }

  const data = FIRST_AID_DB[czesc] || FIRST_AID_DB[typ] || {};
  renderList($('#symptoms-list'), data.symptoms);
  renderList($('#causes-list'), data.causes);
  renderList($('#fa-steps'), data.steps);
  renderList($('#otc-list'), data.otc);
  renderList($('#rx-list'), data.rx);
  renderList($('#doctor-list'), data.doctor);

  hideIfEmpty('#przyczyny', data.causes);
  hideIfEmpty('#leki', (data.otc||[]).concat(data.rx||[]));
  hideIfEmpty('#lekarz', data.doctor);

  if(czesc === 'pierwszopomoc' && GUIDES_DB.pierwszopomoc?.toc){
    const toc = $('#fa-toc'); toc.innerHTML = '';
    GUIDES_DB.pierwszopomoc.toc.forEach(i=>{
      const a=document.createElement('a'); a.className='badge'; a.href=i.href; a.textContent=i.label; toc.appendChild(a);
    });
    toc.style.display='flex'; toc.style.gap='8px'; toc.style.flexWrap='wrap'; toc.style.marginBottom='10px';
    insertAllBoards();
    ['#objawy','#przyczyny','#leki','#lekarz'].forEach(sel=>{ const el=$(sel); if(el) el.style.display='none'; });
    const panels = $('.panels'); if(panels) panels.classList.add('single');
  }
  if(['reanimacja','zadlawienie','wypadek'].includes(czesc)){
    ['#objawy','#przyczyny','#leki','#lekarz'].forEach(sel=>{ const el=$(sel); if(el) el.style.display='none'; });
    const panels = $('.panels'); if(panels) panels.classList.add('single');
  }
}

/* ====== SW register (PWA) ====== */
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{ navigator.serviceWorker.register('sw.js').catch(()=>{}); });
}

/* ====== ATTACH ====== */
document.addEventListener('DOMContentLoaded', ()=>{
  $$('#btn-112').forEach(b=>b.addEventListener('click', call112));
  $$('#btn-hosp').forEach(b=>b.addEventListener('click', openHospitals));
  $$('#btn-apteka').forEach(b=>b.addEventListener('click', openPharmacy));
  $$('#btn-loc').forEach(b=>b.addEventListener('click', openNearMe));
  $$('#btn-loc-situ').forEach(b=>b.addEventListener('click', openNearMe));

  const page = document.body.dataset.page;
  if(page==='kobieta' || page==='mezczyzna' || page==='dziecko'){ buildGrid(page); }
  if(page==='szczegoly'){ initDetails(); }
});
