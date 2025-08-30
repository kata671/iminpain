/* ====== FUNKCJE WSPÓLNE ====== */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

function call112(){ window.location.href = 'tel:112'; }

/* Lokalizacja → od razu mapa z pomocą (SOR, szpital, przychodnia, apteka) */
function openMyLocation(){
  // otwórz wyszukiwanie pomocy medycznej w pobliżu
  const q = encodeURIComponent('SOR szpital pomoc medyczna przychodnia apteka');
  window.open(`https://www.google.com/maps/search/${q}/`, '_blank');
}

/* Apteka „otwarta teraz” */
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

/* Lista części ciała i organów – po Twojej redukcji */
const PARTS_COMMON = [
  ['oko','Oko'],['nos','Nos'],['usta','Usta'],['ucho','Ucho'],['glowa','Głowa'],
  ['klatka','Klatka piersiowa'],['brzuch','Brzuch'],['plecy','Plecy'],
  ['ramie','Ramię'],['dlon','Dłoń'],['biodra','Biodra'],['udo','Udo'],
  ['kolano','Kolano'],['lydka','Łydka'],['stopy','Stopy'],
  ['serce','Serce'],['pluca','Płuca'],['watroba','Wątroba'],['zoladek','Żołądek'],
  ['nerki','Nerki']
];

/* Budowa siatki miniaturek */
function buildGrid(pageType){
  const grid = $('.grid');
  if(!grid) return;
  const frag = document.createDocumentFragment();

  PARTS_COMMON.forEach(([key,label])=>{
    const a = document.createElement('a');
    a.href = `szczegoly.html?typ=${encodeURIComponent(pageType)}&czesc=${encodeURIComponent(key)}&label=${encodeURIComponent(label)}`;

    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.dataset.label = label.toLowerCase();

    const img = document.createElement('img');
    img.alt = label;
    img.loading = 'lazy';
    img.src = `img/${pageType}-${key}.png`;
    img.onerror = ()=>{ img.src = 'img/placeholder.png'; };

    const cap = document.createElement('div');
    cap.className = 'tcap';
    cap.textContent = label;

    a.appendChild(img);
    a.appendChild(cap);
    tile.appendChild(a);
    frag.appendChild(tile);
  });

  grid.appendChild(frag);
  attachGridSearch();
}

/* Szczegóły – ustaw tytuł i obraz */
function initDetails(){
  const params = new URLSearchParams(location.search);
  const typ = params.get('typ') || '';
  const czesc = params.get('czesc') || '';
  const label = params.get('label') || '';

  const bread = $('.breadcrumb span');
  const title = $('#detailTitle');
  const img = $('#detailImg');
  if(!title || !img) return;

  title.textContent = label || 'Szczegóły';
  if(bread) bread.textContent = label || '';

  const src = `img/${typ}-${czesc}.png`;
  img.src = src; img.alt = label;
  img.onerror = ()=>{ img.src='img/placeholder.png'; };
}

/* Auto-init */
document.addEventListener('DOMContentLoaded', ()=>{
  $$('#btn-112').forEach(b=>b.addEventListener('click', call112));
  $$('#btn-loc').forEach(b=>b.addEventListener('click', openMyLocation));
  $$('#btn-apteka').forEach(b=>b.addEventListener('click', openPharmacy));

  const page = document.body.dataset.page;
  if(page==='kobieta' || page==='mezczyzna' || page==='dziecko'){ buildGrid(page); }
  if(page==='szczegoly'){ initDetails(); }
});
