/* ====== UTILS ====== */
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

/* 112 */
function call112(){ window.location.href = 'tel:112'; }

/* Zlokalizuj mnie (pozycja) */
function openNearMe(){
  const fallback = () => window.open('https://www.google.com/maps/search/', '_blank');
  if(!navigator.geolocation){ fallback(); return; }
  navigator.geolocation.getCurrentPosition(pos=>{
    const {latitude, longitude} = pos.coords;
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, '_blank');
  }, fallback, {enableHighAccuracy:true, timeout:8000});
}

/* Szpitale/SOR/przychodnie/pogotowie/apteki */
function openHospitals(){
  const q = encodeURIComponent('szpital SOR przychodnia pogotowie apteka');
  window.open(`https://www.google.com/maps/search/${q}/`, '_blank');
}

/* Apteka24 (otwarte teraz) */
function openPharmacy(){
  window.open('https://www.google.com/maps/search/apteka+otwarta+teraz/', '_blank');
}

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

/* lista części (po Twojej redukcji) */
const PARTS_COMMON = [
  ['oko','Oko'],['nos','Nos'],['usta','Usta'],['ucho','Ucho'],['glowa','Głowa'],
  ['klatka','Klatka piersiowa'],['brzuch','Brzuch'],['plecy','Plecy'],
  ['ramie','Ramię'],['dlon','Dłoń'],['biodra','Biodra'],['udo','Udo'],
  ['kolano','Kolano'],['lydka','Łydka'],['stopy','Stopy'],
  ['serce','Serce'],['pluca','Płuca'],['watroba','Wątroba'],['zoladek','Żołądek'],
  ['nerki','Nerki']
];

/* budowa miniaturek (start od góry zdjęcia) */
function buildGrid(pageType){
  const grid = $('.grid'); if(!grid) return;
  const frag = document.createDocumentFragment();
  PARTS_COMMON.forEach(([key,label])=>{
    const a = document.createElement('a');
    a.href = `szczegoly.html?typ=${encodeURIComponent(pageType)}&czesc=${encodeURIComponent(key)}&label=${encodeURIComponent(label)}`;
    const tile = document.createElement('div'); tile.className = 'tile'; tile.dataset.label = label.toLowerCase();
    const img = document.createElement('img');
    img.alt = label; img.loading = 'lazy'; img.src = `img/${pageType}-${key}.png`;
    img.onerror = ()=>{ img.src = 'img/placeholder.png'; };
    const cap = document.createElement('div'); cap.className = 'tcap'; cap.textContent = label;
    a.appendChild(img); a.appendChild(cap); tile.appendChild(a); frag.appendChild(tile);
  });
  grid.appendChild(frag);
  attachGridSearch();
}

/* PIERWSZA POMOC – pełna baza dla wszystkich części */
const FIRST_AID_DB = {
  // twarz / głowa
  'oko': {
    steps: [
      'Nie trzeć oka; zdejmij soczewki, jeśli nosisz.',
      'Płucz oko letnią wodą lub solą fizjologiczną przez 10–15 min.',
      'Usuń ciała obce tylko przez płukanie (nie pęsetą).',
      'Chemikalia / uraz penetrujący / nagłe pogorszenie widzenia → natychmiast SOR (112 jeśli trzeba).'
    ],
    otc: [
      'Sztuczne łzy / sól fizjologiczna (nawilżanie).',
      'Paracetamol lub ibuprofen doustnie zgodnie z ulotką.'
    ],
    rx: [
      'Antybiotykowe krople/maści, NLPZ do oka – po badaniu okulistycznym.'
    ]
  },
  'nos': {
    steps: [
      'Przy krwawieniu: pochyl głowę do przodu, uciśnij skrzydełka nosa 10 min.',
      'Chłodź kark i nasadę nosa (nie wkładaj waty głęboko).',
      'Po urazie: nie dmuchaj mocno, kontroluj obrzęk, rozważ RTG przy deformacji.',
      'Krwawienie nieustępujące >20 min lub zawroty/omdlenie → SOR.'
    ],
    otc: [
      'Roztwory soli morskiej / NaCl do nawilżania śluzówki.',
      'Paracetamol/ibuprofen przeciwbólowo.'
    ],
    rx: ['Leki obkurczające śluzówkę, antybiotyki przy infekcji – decyzja lekarza.']
  },
  'usta': {
    steps: [
      'Urazy tkanek miękkich: przepłucz zimną wodą, ucisk jałowym gazikiem.',
      'Ułamany ząb – zabezpiecz fragment w mleku/NaCl, pilny stomatolog.',
      'Silne krwawienie lub uraz szczęki → SOR.',
      'Oparzenia chemiczne → natychmiastowe płukanie i pomoc medyczna.'
    ],
    otc: ['Żele znieczulające miejscowo, paracetamol/ibuprofen.'],
    rx: ['Antybiotykoterapia / zszycie ran – wg oceny lekarza/stomatologa.']
  },
  'ucho': {
    steps: [
      'Ból ucha: nie wkładaj patyczków/głębokich aplikatorów.',
      'Podejrzenie ciała obcego: nie manipuluj – lekarz laryngolog.',
      'Wyciek krwisty po urazie głowy → pilnie SOR.',
      'Ból + gorączka → konsultacja (zapalenie ucha).'
    ],
    otc: ['Paracetamol/ibuprofen; krople z oliwą/surfaktantem przy woskowinie.'],
    rx: ['Antybiotyki krople/doustne przy zapaleniu – wg lekarza.']
  },
  'glowa': {
    steps: [
      'Uraz: oceniaj świadomość, pamięć zdarzenia, wymioty, ból narastający.',
      'Przyłóż zimny okład 10–20 min (przez tkaninę).',
      'Utrata przytomności, wymioty, zaburzenia mowy/widzenia → SOR.',
      'Podejrzenie wstrząśnienia mózgu: obserwacja 24–48 h, ogranicz wysiłek.'
    ],
    otc: ['Paracetamol (unikać ibuprofenu tuż po urazie głowy).'],
    rx: ['Leki przeciwobrzękowe/przeciwwymiotne – wg lekarza.']
  },

  // tułów
  'klatka': {
    steps: [
      'Ból w klatce piersiowej traktuj poważnie; ogranicz wysiłek.',
      'Jeśli ból uciskowy, promieniujący do barku/żuchwy, duszność, poty → 112.',
      'Po urazie: unieruchom, chłodź, kontroluj oddychanie.'
    ],
    otc: ['Przeciwbólowe (jeśli brak podejrzenia serca); plastry chłodzące na stłuczenia.'],
    rx: ['Leczenie przyczynowe (kardiologiczne/pulmonologiczne/urazowe) – szpital.']
  },
  'brzuch': {
    steps: [
      'Ból brzucha: obserwuj lokalizację, nudności, gorączkę, wymioty.',
      'Nie podawaj jedzenia; małe łyki wody, jeśli nie wymiotuje.',
      'Silny ból, „twardy” brzuch, krew w stolcu/wymiotach → SOR.'
    ],
    otc: ['Elektrolity, paracetamol; przy skurczach – drotaweryna (o ile brak przeciwwskazań).'],
    rx: ['Leczenie przyczynowe (chirurg/gastroenterolog) – wg rozpoznania.']
  },
  'plecy': {
    steps: [
      'Odpoczynek, pozycja przeciwbólowa; zimny/ciepły okład (co lepiej znosisz).',
      'Unikaj dźwigania; delikatny ruch zamiast leżenia stale.',
      'Ból z drętwieniem kończyn, zaburzenia zwieraczy → pilna konsultacja.'
    ],
    otc: ['Ibuprofen/naproksen (jeśli możesz), maści przeciwzapalne.'],
    rx: ['Miorelaksanty, silniejsze NLPZ, fizjoterapia – wg lekarza.']
  },

  // kończyny
  'ramie': {
    steps: [
      'Uraz: unieruchom w temblaku, chłodź 10–20 min.',
      'Zniekształcenie, duży ból, brak ruchu → RTG/SOR.',
      'Bez urazu: przeciążenie – odpoczynek, ergonomia.'
    ],
    otc: ['Ibuprofen/naproksen, maści przeciwzapalne; plaster chłodzący.'],
    rx: ['Iniekcje dostawowe, rehabilitacja – wg lekarza.']
  },
  'dlon': {
    steps: [
      'Otarcia/rany: przemyj, uciśnij, załóż jałowy opatrunek.',
      'Podejrzenie złamania: unieruchom w pozycji funkcjonalnej.',
      'Głębokie skaleczenie/utrata czucia → SOR/ortopeda.'
    ],
    otc: ['Środki odkażające skórę, plastry/opatrunki, paracetamol/ibuprofen.'],
    rx: ['Antybiotykoterapia, szycie ran, unieruchomienie – wg lekarza.']
  },
  'biodra': {
    steps: [
      'Uraz: nie obciążaj, chłodź, unieruchom; ból/skrót kończyny → SOR.',
      'Przeciążenie: odpoczynek, ćwiczenia rozciągające po ustąpieniu bólu.'
    ],
    otc: ['NLPZ doustne/żele (jeśli możesz), plastry przeciwbólowe.'],
    rx: ['Fizjoterapia, iniekcje dostawowe – wg specjalisty.']
  },
  'udo': {
    steps: [
      'Stłuczenie/naciągnięcie: protokół RICE (odpoczynek, lód, ucisk, uniesienie).',
      'Nagły obrzęk, krwiak rozległy → rozważ USG/lekarską ocenę.'
    ],
    otc: ['Ibuprofen/naproksen, żele chłodzące.'],
    rx: ['Rehabilitacja, ewentualne leczenie przeciwkrzepliwe przy rozległych krwiakach – wg lekarza.']
  },
  'kolano': {
    steps: [
      'Uraz: unieruchom, lód 10–20 min, nie obciążaj.',
      '„Uciekanie”/blokowanie, duży obrzęk → ortopeda/RTG/USG.',
      'Bez urazu: przeciążenie – odpoczynek, ćwiczenia stabilizacyjne.'
    ],
    otc: ['NLPZ doustne/żele; orteza elastyczna tymczasowo.'],
    rx: ['Fizjoterapia, iniekcje kwasu HA/sterydowe – wg lekarza.']
  },
  'lydka': {
    steps: [
      'Skurcz/przeciążenie: rozciąganie, delikatny masaż, ciepło.',
      'Nagły ból + obrzęk jednostronny, ocieplenie → pilnie wyklucz zakrzepicę (lekarz).'
    ],
    otc: ['Magnez (jeśli niedobory), NLPZ miejscowo.'],
    rx: ['Diagnostyka DVT i leczenie – pilnie wg lekarza.']
  },
  'stopy': {
    steps: [
      'Otarcia/pęcherze: nie przebijaj aseptycznie bez potrzeby, zabezpiecz.',
      'Uraz skrętny: RICE (odpoczynek, lód, ucisk, uniesienie).',
      'Silny ból/niemożność obciążenia → RTG.'
    ],
    otc: ['Plastry na pęcherze, NLPZ żele/doustne.'],
    rx: ['Stabilizacja ortezą/gips, rehabilitacja – wg lekarza.']
  },

  // narządy wewnętrzne / objawy ogólne
  'serce': {
    steps: [
      'Ból uciskowy za mostkiem ± promieniowanie do barku/żuchwy, duszność, poty → 112 natychmiast.',
      'Odpoczynek, nie prowadź samochodu, kontroluj objawy.'
    ],
    otc: ['Brak specyficznych OTC na ostry ból wieńcowy.'],
    rx: ['Leczenie kardiologiczne w szpitalu – wg rozpoznania (np. OZW).']
  },
  'pluca': {
    steps: [
      'Duszność, świsty, ból przy oddychaniu – ogranicz wysiłek, usiądź.',
      'Nagła duszność/krwioplucie/ból opłucnowy → 112 / SOR.'
    ],
    otc: ['Inhalacje z soli hipertonicznej/izotonicznej (objawowo).'],
    rx: ['Leczenie pulmonologiczne (np. zapalenie płuc/astma/ZP) – wg lekarza.']
  },
  'watroba': {
    steps: [
      'Ból w prawym podżebrzu, nudności – unikaj alkoholu i leków obciążających wątrobę.',
      'Gorączka/zażółcenie skóry → pilna konsultacja.'
    ],
    otc: ['Unikaj przedawkowania paracetamolu; leki osłonowe tylko po zaleceniu.'],
    rx: ['Diagnostyka i leczenie hepatologiczne – wg lekarza.']
  },
  'zoladek': {
    steps: [
      'Ból nadbrzusza/zgaga – małe, lekkostrawne posiłki; unikaj alkoholu i NLPZ.',
      'Krwiste wymioty/smoliste stolce → pilnie SOR.'
    ],
    otc: ['IPPy OTC (omeprazol itp.), leki zobojętniające, paracetamol przeciwbólowo.'],
    rx: ['Eradykacja H. pylori / recepturowe IPP / gastroenterolog – wg lekarza.']
  },
  'nerki': {
    steps: [
      'Ból w okolicy lędźwiowej promieniujący do pachwiny, nudności – pij małe porcje wody.',
      'Gorączka, dreszcze, ból przy oddawaniu moczu → lekarz (możliwy ZUM/kolka).',
      'Silny ból nieustępujący → SOR.'
    ],
    otc: ['Drotaweryna przy kolce (jeśli brak przeciwwskazań), paracetamol.'],
    rx: ['Antybiotykoterapia przy ZUM, leczenie przeciwbólowe/uro – wg lekarza.']
  },

  // poradniki specjalne (linkowane z sytuacji)
  'zadlawienie': {
    steps: [
      'Zachęć do kaszlu, jeśli drożność częściowa.',
      '5 uderzeń między łopatki → jeśli nieskuteczne 5 uciśnięć nadbrzusza (dorośli).',
      'Powtarzaj 5/5. Utrata przytomności → RKO 30:2 i 112.'
    ],
    otc: [], rx: []
  },
  'reanimacja': {
    steps: [
      'Brak prawidłowego oddechu → wezwanie pomocy i rozpoczęcie RKO.',
      'Uciśnięcia: 100–120/min, głębokość 5–6 cm, stosunek 30:2.',
      'Użyj AED gdy dostępny – postępuj zgodnie z komunikatami.'
    ],
    otc: [], rx: []
  },
  'wypadek': {
    steps: [
      'Zabezpiecz miejsce; oceń krwawienia i przytomność.',
      'Wezwij 112. Uciśnij krwawiące miejsce, opatrz, unieruchom.',
      'Nie poruszaj przy podejrzeniu urazu kręgosłupa; monitoruj oddech.'
    ],
    otc: [], rx: []
  },

  // fallback
  '_default': {
    steps: [
      'Zapewnij bezpieczeństwo i ocenę stanu.',
      'Odciąż/ochładzaj/kompresuj – zależnie od urazu.',
      'W razie wątpliwości – 112 / SOR.'
    ],
    otc: ['Paracetamol/ibuprofen wg ulotki; uwaga na przeciwwskazania.'],
    rx: ['Silniejsze przeciwbólowe/przeciwzapalne – po konsultacji.']
  }
};

/* Szczegóły – start od góry (zdjęcie) + treści */
function initDetails(){
  // Na mobile czasem przeglądarka wchodzi „w połowie” – wymuś start od góry
  window.scrollTo({top:0, behavior:'instant'});
  const p = new URLSearchParams(location.search);
  const typ = (p.get('typ')||'').toLowerCase();
  const czesc = (p.get('czesc')||'').toLowerCase();
  const label = p.get('label') || '';

  const bread = $('.breadcrumb span'); const title = $('#detailTitle'); const img = $('#detailImg');
  if(title) title.textContent = label || 'Szczegóły';
  if(bread) bread.textContent = label || '';
  if(img){
    const src = `img/${typ}-${czesc}.png`; img.src = src; img.alt = label;
    img.onerror = ()=>{ img.src='img/placeholder.png'; };
  }

  const data = FIRST_AID_DB[czesc] || FIRST_AID_DB[typ] || FIRST_AID_DB['_default'];
  const faList = $('#fa-steps'), otcList = $('#otc-list'), rxList = $('#rx-list');
  if(faList){ faList.innerHTML=''; (data.steps||[]).forEach(s=>{ const li=document.createElement('li'); li.textContent=s; faList.appendChild(li); }); }
  if(otcList){ otcList.innerHTML=''; (data.otc||[]).forEach(s=>{ const li=document.createElement('li'); li.textContent=s; otcList.appendChild(li); }); }
  if(rxList){ rxList.innerHTML=''; (data.rx||[]).forEach(s=>{ const li=document.createElement('li'); li.textContent=s; rxList.appendChild(li); }); }
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
