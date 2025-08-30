/* ====== UTILS ====== */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

/* 112 – z ładną słuchawką w UI (etykieta w HTML), tutaj tylko akcja */
function call112(){ window.location.href = 'tel:112'; }

/* Szpitale / SOR – czerwony krzyż w UI, tu link do map */
function openHospitals(){
  const q = encodeURIComponent('szpital SOR pomoc medyczna');
  window.open(`https://www.google.com/maps/search/${q}/`, '_blank');
}

/* Apteka24 */
function openPharmacy(){
  window.open('https://www.google.com/maps/search/apteka+otwarta+teraz/', '_blank');
}

/* Wyszukiwanie w gridach */
function attachGridSearch(){
  const box = $('.search input');
  const tiles = $$('.tile');
  if(!box || tiles.length===0) return;
  box.addEventListener('input', ()=>{
    const q = box.value.trim().toLowerCase();
    tiles.forEach(t=>{
      const label = t.dataset.label || '';
      t.style.display = label.includes(q) ? '' : 'none';
    });
  });
}

/* Lista części ciała (po redukcji) */
const PARTS_COMMON = [
  ['oko','Oko'],['nos','Nos'],['usta','Usta'],['ucho','Ucho'],['glowa','Głowa'],
  ['klatka','Klatka piersiowa'],['brzuch','Brzuch'],['plecy','Plecy'],
  ['ramie','Ramię'],['dlon','Dłoń'],['biodra','Biodra'],['udo','Udo'],
  ['kolano','Kolano'],['lydka','Łydka'],['stopy','Stopy'],
  ['serce','Serce'],['pluca','Płuca'],['watroba','Wątroba'],['zoladek','Żołądek'],
  ['nerki','Nerki']
];

/* Miniatury na stronach postaci */
function buildGrid(pageType){
  const grid = $('.grid');
  if(!grid) return;
  const frag = document.createDocumentFragment();

  PARTS_COMMON.forEach(([key,label])=>{
    const a = document.createElement('a');
    a.href = `szczegoly.html?typ=${encodeURIComponent(pageType)}&czesc=${encodeURIComponent(key)}&label=${encodeURIComponent(label)}#pierwszapomoc`;
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.dataset.label = label.toLowerCase();

    const img = document.createElement('img');
    img.alt = label; img.loading = 'lazy';
    img.src = `img/${pageType}-${key}.png`;
    img.onerror = ()=>{ img.src = 'img/placeholder.png'; };

    const cap = document.createElement('div');
    cap.className = 'tcap'; cap.textContent = label;

    a.appendChild(img); a.appendChild(cap);
    tile.appendChild(a); frag.appendChild(tile);
  });

  grid.appendChild(frag);
  attachGridSearch();
}

/* Treści PIERWSZEJ POMOCY zależne od części ciała / porad */
const FIRST_AID_DB = {
  // przykładowe: oko
  'oko': {
    steps: [
      'Nie trzeć oka. Usuń soczewki kontaktowe, jeśli to możliwe.',
      'Płucz oko letnią, czystą wodą lub solą fizjologiczną 10–15 min.',
      'Jeśli ciało obce jest widoczne na powierzchni – spróbuj wypłukać, NIE używaj pęsety.',
      'Silny ból, zaburzenia widzenia, chemikalia w oku → natychmiast SOR/okulista (112 w razie potrzeby).'
    ],
    otc: [
      'Sztuczne łzy / sól fizjologiczna – nawilżanie po płukaniu.',
      'Leki przeciwbólowe doustne (paracetamol/ibuprofen) zgodnie z ulotką.'
    ],
    rx: [
      'Antybiotykowe krople/maści, leki przeciwzapalne – decyzja lekarza.'
    ]
  },
  // ogólne fallbacki – można rozwinąć dla każdej części
  '_default': {
    steps: [
      'Zapewnij bezpieczeństwo. Oceń stan poszkodowanego.',
      'Schładzaj/odciążaj bolesny obszar, unieruchom jeśli podejrzenie urazu.',
      'W przypadku nasilenia objawów lub wątpliwości – 112 / SOR.'
    ],
    otc: ['Paracetamol/Ibuprofen – zgodnie z ulotką, uwaga na przeciwwskazania.'],
    rx: ['Silniejsze leki przeciwbólowe/przeciwzapalne – po konsultacji lekarskiej.']
  },
  // poradniki specjalne:
  'zadlawienie': {
    steps: [
      'Udrożnij drogi oddechowe. Poproś o kaszel jeśli możliwe.',
      '5 uderzeń między łopatkami. Jeśli nieskuteczne – 5 uciśnięć nadbrzusza (u dorosłych).',
      'Powtarzaj sekwencje 5/5. Utrata przytomności → RKO 30:2 i wzywaj pomoc (112).'
    ],
    otc: [],
    rx: []
  },
  'reanimacja': {
    steps: [
      'Sprawdź bezpieczeństwo, reagowanie i oddech. Jeśli brak prawidłowego oddechu → RKO.',
      'Uciśnięcia klatki piersiowej: 100–120/min, głębokość 5–6 cm, stosunek 30:2.',
      'Użyj AED gdy dostępny – postępuj zgodnie z komunikatami.'
    ], otc:[], rx:[]
  },
  'wypadek': {
    steps: [
      'Zabezpiecz miejsce. Oceń urazy, krwawienia, przytomność.',
      'Wezwij pomoc (112). Zatrzymaj krwawienie uciskiem/opatrunkiem.',
      'Nie ruszaj, jeśli podejrzewasz uraz kręgosłupa. Monitoruj oddech.'
    ], otc:[], rx:[]
  }
};

/* Szczegóły – ustaw tytuł, obraz i treść */
function initDetails(){
  const params = new URLSearchParams(location.search);
  const typ = params.get('typ') || '';
  const czesc = (params.get('czesc') || '').toLowerCase();
  const label = params.get('label') || '';

  const bread = $('.breadcrumb span');
  const title = $('#detailTitle');
  const img = $('#detailImg');
  if(title) title.textContent = label || 'Szczegóły';
  if(bread) bread.textContent = label || '';

  if(img){
    const src = `img/${typ}-${czesc}.png`;
    img.src = src; img.alt = label;
    img.onerror = ()=>{ img.src='img/placeholder.png'; };
  }

  // wypełnij sekcję Pierwsza pomoc/ Leki z bazy
  const data = FIRST_AID_DB[czesc] || FIRST_AID_DB[typ] || FIRST_AID_DB['_default'];
  const faList = $('#fa-steps');
  const otcList = $('#otc-list');
  const rxList = $('#rx-list');

  if(faList){
    faList.innerHTML = '';
    (data.steps || []).forEach(s=>{
      const li = document.createElement('li'); li.textContent = s; faList.appendChild(li);
    });
  }
  if(otcList){
    otcList.innerHTML = '';
    (data.otc || []).forEach(s=>{
      const li = document.createElement('li'); li.textContent = s; otcList.appendChild(li);
    });
  }
  if(rxList){
    rxList.innerHTML = '';
    (data.rx || []).forEach(s=>{
      const li = document.createElement('li'); li.textContent = s; rxList.appendChild(li);
    });
  }

  // jeśli URL ma #pierwszapomoc – przewiń do sekcji
  if(location.hash === '#pierwszapomoc'){
    const el = $('#pierwszapomoc');
    if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
  }
}

/* Auto-init */
document.addEventListener('DOMContentLoaded', ()=>{
  $$('#btn-112').forEach(b=>b.addEventListener('click', call112));
  $$('#btn-hosp').forEach(b=>b.addEventListener('click', openHospitals));
  $$('#btn-apteka').forEach(b=>b.addEventListener('click', openPharmacy));

  const page = document.body.dataset.page;
  if(page==='kobieta' || page==='mezczyzna' || page==='dziecko'){ buildGrid(page); }
  if(page==='szczegoly'){ initDetails(); }
});
