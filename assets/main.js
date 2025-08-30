/* ====== HELPERS ====== */
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

/* ====== SEARCH ON GRIDS ====== */
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

/* ====== BAZY DANYCH: pełne opisy + leki OTC/Rx rozdzielone ======
   — Zwiększyłem liczbę wpisów i uzupełniłem brakujące, żeby panele nie były puste. */
const COMMON_PARTS_DB = {
  'oko': {
    symptoms:[
      'Łzawienie, pieczenie, zaczerwienienie, światłowstręt.',
      'Uczucie piasku/ciała obcego, pogorszenie ostrości widzenia.',
      'Ból, obrzęk powiek; ropa/wydzielina (infekcja).'
    ],
    causes:[
      'Podrażnienie (wiatr, dym), ciało obce, alergia (AZS/pyłki).',
      'Zespół suchego oka, infekcja bakteryjna/ wirusowa.',
      'Uraz/otarcie rogówki; oparzenie chemiczne.'
    ],
    steps:[
      'Nie trzeć oka; zdejmij soczewki kontaktowe.',
      'Płucz oko NaCl lub letnią wodą 10–15 min (zwłaszcza po chemikaliach).',
      'Ciała obce usuwaj tylko płukaniem; nie używaj patyczków.',
      'Ból silny/utrata widzenia/uraz penetrujący → natychmiast SOR / 112.'
    ],
    otc:[
      'Sztuczne łzy (hialuronian, PVP) – na suchość.',
      'NaCl 0.9% do przepłukiwania.',
      'Paracetamol przeciwbólowo (jeśli potrzebne).'
    ],
    rx:[
      'Antybiotyk w kroplach/maści (bakteryjne zapalenie) – po badaniu lekarskim.',
      'Steryd miejscowy/NSAID do oka – tylko z zalecenia okulisty.'
    ],
    doctor:[
      'Okulista pilnie przy urazie, chemikaliach, pogorszeniu widzenia.',
      'POZ przy łagodnych objawach nieustępujących >48–72 h.'
    ]
  },
  'nos': {
    symptoms:[
      'Katar, zatkanie nosa, kichanie, ból u nasady, spływanie wydzieliny.',
      'Krwawienie z nosa, zaburzenia węchu, ból twarzy przy schylaniu.'
    ],
    causes:[
      'Infekcja wirusowa/bakteryjna, alergia sezonowa/całoroczna.',
      'Uraz, suchość śluzówki, nadciśnienie, zaburzenia krzepnięcia.'
    ],
    steps:[
      'Krwotok: pochyl się do przodu, uciskaj skrzydełka nosa 10 min.',
      'Chłodzenie nasady/ karku; nie wkładaj waty głęboko.',
      'Krwawienie >20 min lub po urazie (deformacja) → SOR.'
    ],
    otc:[
      'Sól morska/NaCl do płukania.',
      'Paracetamol/ibuprofen przeciwbólowo.',
      'Krótkotrwale: ksylometazolina/oksymetazolina (max 3–5 dni).'
    ],
    rx:[
      'Miejscowe sterydy donosowe w przewlekłej alergii.',
      'Antybiotyk przy bakteryjnym zapaleniu zatok – wg lekarza.'
    ],
    doctor:[
      'Laryngolog/POZ; SOR przy nieustępującym krwawieniu lub ciężkim urazie.'
    ]
  },
  'usta': {
    symptoms:[
      'Ból, krwawienie, rany/otarcia, obrzęk wargi, uszkodzenia zębów.'
    ],
    causes:[
      'Uraz, oparzenie termiczne/chemiczne, afty, infekcje.'
    ],
    steps:[
      'Przepłucz zimną wodą; uciśnij jałowym gazikiem przy krwawieniu.',
      'Ułamany ząb zabezpiecz w mleku/NaCl → pilny stomatolog.',
      'Silne krwawienie/uraz szczęki → SOR.'
    ],
    otc:[
      'Żele znieczulające na afty, chlorheksydyna (krótko).',
      'Paracetamol/ibuprofen przeciwbólowo.'
    ],
    rx:[
      'Szycie ran, antybiotyk wg oceny lekarza/stomatologa.'
    ],
    doctor:[
      'Stomatolog/Laryngolog; SOR przy masywnym krwawieniu/dużym urazie.'
    ]
  },
  'ucho': {
    symptoms:['Ból ucha, świąd, niedosłuch, szumy, wyciek.'],
    causes:['Zapalenie ucha, woskowina, ciało obce, uraz (barotrauma).'],
    steps:[
      'Nie czyść głęboko patyczkami.',
      'Podejrzenie ciała obcego – nie manipuluj; lekarz.',
      'Wyciek krwisty po urazie głowy → SOR.'
    ],
    otc:[
      'Paracetamol/ibuprofen, krople rozpuszczające woskowinę.'
    ],
    rx:[
      'Antybiotyk miejscowy/doustny przy zapaleniu – wg lekarza.'
    ],
    doctor:['POZ/Laryngolog; SOR przy urazie/ciężkich objawach.']
  },
  'glowa': {
    symptoms:['Ból, zawroty, nudności, światłowstręt; zaburzenia pamięci po urazie.'],
    causes:['Migrena, napięciowy, wstrząśnienie mózgu, infekcje.'],
    steps:[
      'Po urazie: zimny okład, obserwacja 24–48 h.',
      'Utrata przytomności, wymioty, zaburzenia mowy/widzenia → SOR/112.'
    ],
    otc:['Paracetamol (unikaj NLPZ tuż po urazie).'],
    rx:['Leki przeciwwymiotne/przeciwobrzękowe – wg lekarza.'],
    doctor:['POZ/Neurolog; SOR przy objawach alarmowych.']
  },
  'klatka': {
    symptoms:['Ból uciskowy, duszność, ból przy oddychaniu, kaszel.'],
    causes:['Zawał/ChNS, zapalenie opłucnej, skurcz mięśni, uraz żeber.'],
    steps:[
      'Typowy ból wieńcowy z dusznością/potami → 112 natychmiast.',
      'Po urazie: unieruchom, chłodź, kontroluj oddech.'
    ],
    otc:['Przeciwbólowe jeśli brak podejrzenia serca.'],
    rx:['Leczenie przyczynowe (kardiologiczne/pulmonologiczne).'],
    doctor:['112/SOR przy bólu typowym dla serca; POZ jeśli łagodny.']
  },
  'brzuch': {
    symptoms:['Ból (lokalizacja), nudności, wymioty, biegunka, gorączka, wzdęcia.'],
    causes:['Niestrawność, infekcja, zapalenie wyrostka/pęcherzyka, kolka nerkowa.'],
    steps:[
      'Nie jedz; popijaj małe łyki wody jeśli nie wymiotujesz.',
      'Twardy brzuch/silny ból/krew w stolcu/wymiotach → SOR.'
    ],
    otc:['Elektrolity, paracetamol; drotaweryna na skurcze (jeśli możesz).'],
    rx:['Leczenie chirurgiczne/gastro wg rozpoznania.'],
    doctor:['POZ/SOR zależnie od ciężkości.']
  },
  'plecy': {
    symptoms:['Ból, sztywność, promieniowanie do kończyn, drętwienia.'],
    causes:['Przeciążenie, dyskopatia, uraz.'],
    steps:[
      'Pozycja przeciwbólowa, delikatny ruch, unikaj dźwigania.',
      'Zaburzenia zwieraczy/drętwienie krocza → pilnie SOR.'
    ],
    otc:['NLPZ doustne/żele (jeśli możesz), plastry rozgrzewające/chłodzące.'],
    rx:['Miorelaksanty, silniejsze NLPZ, fizjoterapia.'],
    doctor:['POZ/Ortopeda/Neurolog.']
  },
  'ramie': {
    symptoms:['Ból, ograniczenie ruchu, obrzęk, deformacja.'],
    causes:['Uraz, zapalenie ścięgień, przeciążenie.'],
    steps:[
      'Uraz: temblak, chłodzenie 10–20 min.',
      'Deformacja/brak ruchu → RTG/SOR.'
    ],
    otc:['NLPZ doustne/żele; plaster chłodzący.'],
    rx:['Iniekcje dostawowe/rehabilitacja – wg lekarza.'],
    doctor:['Ortopeda; SOR przy podejrzeniu złamania.']
  },
  'dlon': {
    symptoms:['Rany, obrzęk, ból, zaburzenie chwytu.'],
    causes:['Skaleczenie, zmiażdżenie, zwichnięcie, ciało obce.'],
    steps:[
      'Przemyj, jałowy opatrunek; ucisk przy krwawieniu.',
      'Podejrzenie złamania: unieruchom w pozycji funkcjonalnej.'
    ],
    otc:['Środki odkażające, opatrunki; paracetamol/ibuprofen.'],
    rx:['Szycie, antybiotyk, unieruchomienie – wg lekarza.'],
    doctor:['Chirurg ręki/Ortopeda; SOR przy ciężkim urazie.']
  },
  'biodra': {
    symptoms:['Ból pachwiny/biodra, ograniczenie ruchu, skrócenie kończyny.'],
    causes:['Uraz, zwyrodnienie, przeciążenie.'],
    steps:['Po urazie nie obciążaj; chłodź; skrót kończyny → SOR.'],
    otc:['NLPZ doustne/żele.'],
    rx:['Rehabilitacja, iniekcje, leczenie operacyjne.'],
    doctor:['Ortopeda; SOR przy podejrzeniu złamania szyjki.']
  },
  'udo': {
    symptoms:['Ból mięśniowy, krwiak, obrzęk.'],
    causes:['Stłuczenie, naciągnięcie, naderwanie.'],
    steps:['RICE: odpoczynek, lód, ucisk, uniesienie.'],
    otc:['Ibuprofen/naproksen; żele chłodzące.'],
    rx:['Rehabilitacja; przy masywnych krwiakach – wg lekarza.'],
    doctor:['POZ/Ortopeda.']
  },
  'kolano': {
    symptoms:['Ból, obrzęk, niestabilność, blokowanie.'],
    causes:['Skręcenie, łąkotka/więzadła, przeciążenie.'],
    steps:['Unieruchom, lód 10–20 min, nie obciążaj.'],
    otc:['NLPZ doustne/żele; orteza elastyczna tymczasowo.'],
    rx:['Fizjoterapia, iniekcje HA/steryd.'],
    doctor:['Ortopeda.']
  },
  'lydka': {
    symptoms:['Ból, skurcze, obrzęk.'],
    causes:['Przeciążenie, skurcze, możliwa zakrzepica (DVT).'],
    steps:[
      'Rozciąganie, delikatny masaż, ciepło.',
      'Jednostronny obrzęk/ocieplenie → pilnie wyklucz DVT (lekarz).'
    ],
    otc:['Magnez (jeśli niedobory), NLPZ miejscowo.'],
    rx:['Leczenie przeciwkrzepliwe przy DVT – wg lekarza.'],
    doctor:['Pilna konsultacja przy podejrzeniu DVT.']
  },
  'stopy': {
    symptoms:['Pęcherze, ból, obrzęk, trudność w obciążaniu.'],
    causes:['Skręcenie, otarcia, złamanie zmęczeniowe, uraz.'],
    steps:[
      'Pęcherze: nie przebijaj bez potrzeby, zabezpiecz opatrunkiem hydrożelowym.',
      'Skręcenie: RICE; brak możliwości obciążenia → RTG/SOR.'
    ],
    otc:['Plastry na pęcherze, żele chłodzące, NLPZ doustne/żele.'],
    rx:['Orteza/gips; rehabilitacja wg urazu.'],
    doctor:['Ortopeda; SOR przy ostrym urazie/znacznej deformacji.']
  },
  'serce': {
    symptoms:['Ucisk/gniecenie za mostkiem ± promieniowanie (ramię/szczęka), duszność, poty, lęk.'],
    causes:['Ostry zespół wieńcowy, skurcz naczyniowy, refluks (mimika).'],
    steps:['Podejrzenie zawału → 112 natychmiast; odpoczynek, nie prowadź.'],
    otc:['Brak skutecznych OTC na ostry ból wieńcowy.'],
    rx:['Leczenie kardiologiczne w szpitalu.'],
    doctor:['Zawsze 112/SOR przy typowych objawach.']
  },
  'pluca': {
    symptoms:['Duszność, kaszel, ból przy oddychaniu, krwioplucie.'],
    causes:['Astma, zapalenie płuc, odma, zatorowość, COVID-19.'],
    steps:[
      'Uspokój oddech, usiądź.',
      'Nagła duszność/krwioplucie/ból opłucnowy → 112/SOR.'
    ],
    otc:['Inhalacje z soli izotonicznej/hipertonicznej.'],
    rx:['Leczenie pulmonologiczne wg rozpoznania.'],
    doctor:['POZ/Pulmonolog; SOR w ostrych stanach.']
  },
  'watroba': {
    symptoms:['Ból w prawym podżebrzu, męczliwość, nudności, zażółcenie skóry.'],
    causes:['Zapalenie, zastój żółci, polekowe uszkodzenie wątroby.'],
    steps:[
      'Unikaj alkoholu i leków obciążających wątrobę.',
      'Żółtaczka/gorączka → pilna konsultacja.'
    ],
    otc:['Unikaj nadmiaru paracetamolu; hepatoprotekcyjne suplementy (ostrożnie).'],
    rx:['Leczenie wg przyczyny (hepatolog).'],
    doctor:['Hepatolog/POZ; SOR przy ciężkich objawach.']
  },
  'zoladek': {
    symptoms:['Zgaga, ból nadbrzusza, nudności, odbijanie.'],
    causes:['Nadkwasota, H. pylori, NLPZ, stres.'],
    steps:[
      'Małe, lekkostrawne posiłki, unikaj alkoholu i NLPZ.',
      'Krwiste wymioty/smoliste stolce → SOR.'
    ],
    otc:['IPP OTC (omeprazol/esomeprazol), leki zobojętniające; paracetamol.'],
    rx:['Eradykacja H. pylori (IPP + antybiotyki) – wg lekarza.'],
    doctor:['Gastroenterolog/POZ.']
  },
  'nerki': {
    symptoms:['Ból lędźwi promieniujący do pachwiny, kolka, gorączka, pieczenie przy mikcji.'],
    causes:['Kolka nerkowa, ZUM/odmiedniczkowe zapalenie nerek, kamica.'],
    steps:[
      'Pij małe porcje wody (jeśli brak wymiotów).',
      'Gorączka/dreszcze/silny ból → lekarz/SOR.'
    ],
    otc:['Drotaweryna (jeśli możesz), paracetamol.'],
    rx:['Antybiotyk/lek rozkurczowy wg lekarza; czasem zabieg.'],
    doctor:['POZ/Urolog; SOR przy silnym bólu/objawach sepsy.']
  }
};

/* Poradniki (zielone kafelki) – pełniejsze kroki */
const GUIDES_DB = {
  'pierwszopomoc': {
    steps:[
      '1) Zadbaj o własne bezpieczeństwo (rękawiczki, miejsce zdarzenia).',
      '2) Oceń przytomność i oddech (max 10 s).',
      '3) Wezwij pomoc: 112 (tryb głośnomówiący).',
      '4) Brak oddechu → RKO: 100–120/min, 5–6 cm; 30:2 jeśli potrafisz.',
      '5) Oddycha, nie reaguje → pozycja bezpieczna, kontrola oddechu.',
      '6) Krwotok → ucisk/opatrunek uciskowy.',
      '7) Zapobiegaj wychłodzeniu (folia NRC), uspokajaj poszkodowanego.',
      '8) Monitoruj do przyjazdu ZRM; przygotuj informacje (SAMPLE).'
    ],
    toc:[
      {href:'szczegoly.html?typ=porada&czesc=reanimacja&label=Reanimacja', label:'⚡ Reanimacja'},
      {href:'szczegoly.html?typ=porada&czesc=zadlawienie&label=Zadławienie', label:'🫁 Zadławienie'},
      {href:'szczegoly.html?typ=porada&czesc=wypadek&label=Wypadek', label:'💥 Wypadek'}
    ]
  },
  'reanimacja': {
    steps:[
      'A) Rozpoznaj NZK: brak reakcji + brak prawidłowego oddechu ≤10 s.',
      'B) Zawołaj o pomoc/AED, zadzwoń 112 (głośnomówiący).',
      'C) Uciskaj środek mostka: 100–120/min, głębokość 5–6 cm, pełny powrót klatki.',
      'D) 30:2 jeśli umiesz wentylować; inaczej same uciski.',
      'E) AED: włącz, naklej elektrody, stosuj się do poleceń; minimalizuj przerwy.',
      'F) Dzieci: 5 oddechów startowych; 30:2 (1 rat.) / 15:2 (2 rat.); głęb. 1/3 klatki.',
      'G) Niemowlę: 2 palce na mostku, głęb. 1/3 (~4 cm); 100–120/min.',
      'H) Kończysz, gdy: wracają oznaki życia / ZRM przejmuje / brak sił / dyspozytor mówi przerwać.'
    ],
    otc:['Maseczka do RKO, rękawiczki; AED jeśli dostępny.'],
    rx:[],
    doctor:['Po skutecznej RKO – ZRM, transport, obserwacja.']
  },
  'zadlawienie': {
    steps:[
      'A) Skuteczny kaszel → zachęcaj do kaszlu, obserwuj.',
      'B) Całkowita niedrożność (dorosły/dziecko): 5 uderzeń między łopatki → 5 uciśnięć nadbrzusza (Heimlich).',
      'C) Powtarzaj sekwencję 5/5 do usunięcia przeszkody lub utraty przytomności.',
      'D) Nieprzytomny: połóż na ziemi, 112, RKO 30:2; kontrola jamy ustnej po każdych 30 uciśnięciach.',
      'E) Niemowlę: 5 uderzeń w plecy (głowa niżej) → 5 uciśnięć klatki (2 palce, 1/3 głębokości).',
      'F) Samopomoc: pchnięcia nadbrzusza na oparciu krzesła; wezwij pomoc.',
      'G) Ciąża/otyłość: zamiast nadbrzusza – uciśnięcia na mostek.',
      'H) Po epizodzie: konsultacja lekarska (ryzyko urazu, pozostałości ciała obcego).'
    ],
    otc:[], rx:[], doctor:['Lekarz/LOR po epizodzie; 112 przy duszności/utracie przytomności.']
  },
  'wypadek': {
    steps:[
      'A) STOP – najpierw Twoje bezpieczeństwo: trójkąt, kamizelka, światła awaryjne.',
      'B) Oceń sytuację: liczba poszkodowanych, mechanizm, zagrożenia; wezwij 112.',
      'C) Priorytety: przytomność/oddech → krwotok → drożność → wstrząs.',
      'D) Krwotok: ucisk/opatrunek uciskowy; amputat do torebki i chłodu (nie bezpośrednio lód).',
      'E) Kręgosłup: stabilizacja głowy; nie poruszaj poszkodowanego bez potrzeby.',
      'F) Oddychanie: brak oddechu → RKO; duszność → pozycja półsiedząca/bezpieczna.',
      'G) Oparzenia: chłodź 10–20 min, usuń biżuterię/odzież nieprzyklejoną, przykryj jałowo.',
      'H) Złamania: unieruchom dwie sąsiednie kości/stawy; kontrola krążenia/czucia poniżej urazu.',
      'I) Wstrząs: połóż, unieś nogi, okryj; nie podawaj jedzenia/picia.'
    ],
    otc:['Rękawiczki, folia NRC, opatrunki, bandaże, NaCl, chusta, nożyczki.'],
    rx:[], doctor:['Zawsze 112/SOR przy ciężkich obrażeniach lub wątpliwościach.']
  }
};

/* Ciąża – wpis bazowy (trymestry możesz dodać później) */
const PREGNANCY_DB = {
  base: {
    symptoms:[
      'Typowe: nudności/wymioty, zgaga, zmęczenie, bóle pleców/miednicy, obrzęki.',
      'Alarmowe: plamienie/krwawienie, silny ból, skurcze przedwczesne, zaburzenia widzenia, znaczne obrzęki, brak ruchów płodu (po 20. tyg.), odpłynięcie wód, gorączka.'
    ],
    causes:[
      'Zmiany hormonalne/mechaniczne (fizjologiczne), infekcje, niedobory, odwodnienie.',
      'Stany nagłe: poronienie, przedwczesny poród, stan przedrzucawkowy, odklejenie łożyska, ZUM.'
    ],
    steps:[
      'Lewy bok, nawadnianie, lekkostrawna dieta, umiarkowany ruch.',
      'Objawy alarmowe → 112 / SOR / IP ginekologiczny.',
      'Bóle pleców: rozciąganie, ciepły prysznic; pas podtrzymujący (po zaleceniu).'
    ],
    otc:[
      'Paracetamol (po zaleceniu), elektrolity.',
      'Suplementy: folian, wit. D, jod; żelazo przy niedoborze.'
    ],
    rx:[
      'Antybiotyki/lek przeciwskurczowy/nadciśnieniowy – wg lekarza.',
      'Unikaj NLPZ (szczególnie III trymestr).'
    ],
    doctor:[
      'Lekarz/położna prowadząca; IP przy objawach alarmowych.'
    ]
  }
};

const FIRST_AID_DB = {
  ...COMMON_PARTS_DB,
  ...GUIDES_DB,
  'ciaza': PREGNANCY_DB.base
};

/* ====== DIAGRAMY (plansze) – obrazy (jeśli brak, pokaże się placeholder) ====== */
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

/* ====== Szczegóły – główna logika ====== */
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

  // Obraz/diagram
  if(img){
    if(GUIDE_DIAGRAMS[czesc]){
      img.src = GUIDE_DIAGRAMS[czesc];
      img.alt = `${label} — schemat krok po kroku`;
      img.onerror = ()=>{ img.src='img/placeholder.png'; };
    } else if(isGuide){
      img.src = 'img/placeholder.png'; img.alt = label || 'Poradnik';
    } else {
      const src = `img/${typ}-${czesc}.png`; img.src = src; img.alt = label;
      img.onerror = ()=>{ img.src='img/placeholder.png'; };
    }
  }

  // Dane merytoryczne
  const data = FIRST_AID_DB[czesc] || FIRST_AID_DB[typ] || {};
  renderList($('#symptoms-list'), data.symptoms);
  renderList($('#causes-list'), data.causes);
  renderList($('#fa-steps'), data.steps);
  renderList($('#otc-list'), data.otc);
  renderList($('#rx-list'), data.rx);
  renderList($('#doctor-list'), data.doctor);

  // Ukryj panele puste
  hideIfEmpty('#objawy', data.symptoms);
  hideIfEmpty('#przyczyny', data.causes);
  hideIfEmpty('#leki', (data.otc||[]).concat(data.rx||[]));
  hideIfEmpty('#lekarz', data.doctor);

  // Pierwsza pomoc ogólna → 3 plansze + tryb „single”
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

  // Reanimacja/Zadławienie/Wypadek → tylko panel „Pierwsza pomoc”
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
