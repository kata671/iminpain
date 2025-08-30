/* ====== UTILS ====== */
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

/* wyszukiwarka na gridach */
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

/* LISTY CZĘŚCI */
const PARTS_COMMON = [
  ['oko','Oko'],['nos','Nos'],['usta','Usta'],['ucho','Ucho'],['glowa','Głowa'],
  ['klatka','Klatka piersiowa'],['brzuch','Brzuch'],['plecy','Plecy'],
  ['ramie','Ramię'],['dlon','Dłoń'],['biodra','Biodra'],['udo','Udo'],
  ['kolano','Kolano'],['lydka','Łydka'],['stopy','Stopy'],
  ['serce','Serce'],['pluca','Płuca'],['watroba','Wątroba'],['zoladek','Żołądek'],
  ['nerki','Nerki']
];
const PARTS_WOMAN_EXTRA = [['ciaza','Ciąża']];
function getPartsForPage(pageType){ return pageType==='kobieta' ? [...PARTS_WOMAN_EXTRA, ...PARTS_COMMON] : PARTS_COMMON; }

/* budowa miniaturek (bez #pierwszapomoc — start od zdjęcia) */
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

/* BAZA PIERWSZEJ POMOCY (skrócona do kluczowych sekcji) */
const FIRST_AID_DB = {
  'pierwszopomoc': {
    steps: [
      'Zadbaj o własne bezpieczeństwo i oceń sytuację.',
      'Sprawdź reakcję i oddech poszkodowanego.',
      'Wezwij pomoc, gdy masz wątpliwości — 112.',
      'Zatrzymaj masywne krwawienie uciskiem/opatrunkiem.',
      'Brak oddechu: RKO 30:2 (100–120/min, 5–6 cm).',
      'Pozycja bezpieczna, jeśli oddycha i nie reaguje.',
      'Kontroluj stan do przyjazdu służb.'
    ],
    otc: [
      'Apteczka: opatrunki, bandaże, rękawiczki, sól fizjologiczna.',
      'Paracetamol/ibuprofen – zgodnie z ulotką (jeśli wskazane).'
    ],
    rx: ['Leczenie przyczynowe wg lekarza.']
  },
  'zadlawienie': {
    steps: [
      'Zachęć do kaszlu, jeśli drożność częściowa.',
      '5 uderzeń między łopatki → jeśli nieskuteczne 5 uciśnięć nadbrzusza (dorośli).',
      'Powtarzaj 5/5. Utrata przytomności → RKO 30:2 i 112.'
    ], otc:[], rx:[]
  },
  'reanimacja': {
    steps: [
      'Brak prawidłowego oddechu → wezwanie pomocy i rozpoczęcie RKO.',
      'Uciśnięcia: 100–120/min, głębokość 5–6 cm, stosunek 30:2.',
      'Użyj AED gdy dostępny – postępuj wg komunikatów.'
    ], otc:[], rx:[]
  },
  'wypadek': {
    steps: [
      'Zabezpiecz miejsce; oceń krwawienia i przytomność.',
      'Wezwij 112. Uciśnij krwawiące miejsce, opatrz, unieruchom.',
      'Nie poruszaj przy podejrzeniu urazu kręgosłupa; monitoruj oddech.'
    ], otc:[], rx:[]
  },
  /* plus wszystkie części ciała – jeśli wejdziesz z siatki postaci */
  'oko': {steps:['Nie trzeć; płucz 10–15 min NaCl/wodą.','Ciała obce usuwaj tylko płukaniem.','Chemikalia/utrata widzenia → SOR.'], otc:['Sztuczne łzy; paracetamol.'], rx:['Krople/maści – okulista.']},
  'nos': {steps:['Krwotok: pochyl do przodu, ucisk 10 min.','Chłodź nasadę nosa.','>20 min krwawienia → SOR.'], otc:['Sól morska; paracetamol.'], rx:['Leki obkurczające/antybiotyk – lekarz.']},
  // ... (tu mogą być pozostałe wpisy jak w poprzedniej wersji; nie są wymagane dla kafelków)
};

/* render listy kroków */
function renderList(list, items){
  list.innerHTML = '';
  (items||[]).forEach(s=>{
    const li = document.createElement('li'); li.textContent = s; list.appendChild(li);
  });
}

/* Szczegóły – tryb zwykły + tryb „pełna instrukcja Pierwsza pomoc” z podsekcjami */
function initDetails(){
  window.scrollTo({top:0, behavior:'instant'}); // od razu zdjęcie na górze
  const p = new URLSearchParams(location.search);
  const typ = (p.get('typ')||'').toLowerCase();
  const czesc = (p.get('czesc')||'').toLowerCase();
  const label = p.get('label') || '';

  const bread = $('.breadcrumb span'); const title = $('#detailTitle'); const img = $('#detailImg');
  if(title) title.textContent = label || 'Szczegóły';
  if(bread) bread.textContent = label || '';

  if(img){
    // jeśli to „Pierwsza pomoc” (porada), pokaż neutralny placeholder zamiast konkretnej części ciała
    if(czesc === 'pierwszopomoc'){ img.src = 'img/placeholder.png'; img.alt = 'Pierwsza pomoc'; }
    else {
      const src = `img/${typ}-${czesc}.png`; img.src = src; img.alt = label;
      img.onerror = ()=>{ img.src='img/placeholder.png'; };
    }
  }

  const faSteps = $('#fa-steps');
  const otcList = $('#otc-list');
  const rxList = $('#rx-list');
  const faContainer = $('#fa-container');

  // TRYB: pełna instrukcja „Pierwsza pomoc” z podsekcjami (zadławienie/reanimacja/wypadek)
  if(czesc === 'pierwszopomoc'){
    const base = FIRST_AID_DB['pierwszopomoc'];
    renderList(faSteps, base.steps);
    if(otcList) renderList(otcList, base.otc);
    if(rxList) renderList(rxList, base.rx);

    // dodaj podsekcje na jednym ekranie:
    const sections = [
      ['zadlawienie','Zadławienie','fa-zadlawienie'],
      ['reanimacja','Reanimacja (RKO)','fa-reanimacja'],
      ['wypadek','Ofiara wypadku','fa-wypadek']
    ];
    sections.forEach(([key,title,id])=>{
      const h = document.createElement('h4'); h.id = id; h.textContent = title; h.style.marginTop = '16px';
      const ol = document.createElement('ol');
      (FIRST_AID_DB[key]?.steps||[]).forEach(s=>{ const li=document.createElement('li'); li.textContent=s; ol.appendChild(li); });
      faContainer.appendChild(h); faContainer.appendChild(ol);
    });

    // jeśli przyszliśmy z kotwicą (#fa-zadlawienie/#fa-reanimacja/#fa-wypadek/#pierwszapomoc) – przewiń
    if(location.hash){
      const el = document.getElementById(location.hash.replace('#',''));
      if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
    }
    return;
  }

  // TRYB: konkretna część ciała (wejście z siatki Kobieta/Mężczyzna/Dziecko)
  const data = FIRST_AID_DB[czesc] || FIRST_AID_DB[typ] || FIRST_AID_DB['_default'];
  if(faSteps) renderList(faSteps, data.steps);
  if(otcList) renderList(otcList, data.otc);
  if(rxList) renderList(rxList, data.rx);

  // jeśli przyszliśmy z (historycznych) linków z #pierwszapomoc – przewiń
  if(location.hash === '#pierwszapomoc'){
    const el = $('#pierwszapomoc'); if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
  }
}

/* attach */
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
