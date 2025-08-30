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

/* ===== LISTY CZĘŚCI CIAŁA ===== */

/* ogólna lista */
const PARTS_COMMON = [
  ['oko','Oko'],['nos','Nos'],['usta','Usta'],['ucho','Ucho'],['glowa','Głowa'],
  ['klatka','Klatka piersiowa'],['brzuch','Brzuch'],['plecy','Plecy'],
  ['ramie','Ramię'],['dlon','Dłoń'],['biodra','Biodra'],['udo','Udo'],
  ['kolano','Kolano'],['lydka','Łydka'],['stopy','Stopy'],
  ['serce','Serce'],['pluca','Płuca'],['watroba','Wątroba'],['zoladek','Żołądek'],
  ['nerki','Nerki']
];

/* dodatki specyficzne dla stron */
const PARTS_WOMAN_EXTRA = [
  ['ciaza','Ciąża']
];

/* dobór listy w zależności od typu strony */
function getPartsForPage(pageType){
  if(pageType === 'kobieta'){
    return [...PARTS_WOMAN_EXTRA, ...PARTS_COMMON];
  }
  // dla mezczyzna/dziecko – sama lista wspólna
  return PARTS_COMMON;
}

/* budowa miniaturek (start od zdjęcia – bez #pierwszapomoc) */
function buildGrid(pageType){
  const grid = $('.grid'); if(!grid) return;
  const frag = document.createDocumentFragment();
  const parts = getPartsForPage(pageType);

  parts.forEach(([key,label])=>{
    const a = document.createElement('a');
    a.href = `szczegoly.html?typ=${encodeURIComponent(pageType)}&czesc=${encodeURIComponent(key)}&label=${encodeURIComponent(label)}`;
    const tile = document.createElement('div'); tile.className = 'tile'; tile.dataset.label = label.toLowerCase();

    const img = document.createElement('img');
    img.alt = label; img.loading = 'lazy';
    img.src = `img/${pageType}-${key}.png`;
    img.onerror = ()=>{ img.src = 'img/placeholder.png'; };

    const cap = document.createElement('div'); cap.className = 'tcap'; cap.textContent = label;

    a.appendChild(img); a.appendChild(cap);
    tile.appendChild(a); frag.appendChild(tile);
  });

  grid.appendChild(frag);
  attachGridSearch();
}

/* ===== PIERWSZA POMOC – pełna baza (części + poradniki) ===== */
const FIRST_AID_DB = {
  'pierwszopomoc': {
    steps: [
      'Zadbaj o własne bezpieczeństwo i oceń sytuację.',
      'Sprawdź reakcję i oddech poszkodowanego.',
      'Wezwij pomoc, gdy masz wątpliwości — 112.',
      'Zatrzymaj masywne krwawienie uciskiem/opatrunkiem.',
      'Brak oddechu: RKO 30:2 (100–120/min, 5–6 cm).',
      'Pozycja bezpieczna, jeśli oddycha i nie reaguje.',
      'Zadławienie: 5 uderzeń w plecy → 5 uciśnięć nadbrzusza.',
      'Kontroluj stan do przyjazdu służb.'
    ],
    otc: [
      'Apteczka: opatrunki, bandaże, rękawiczki, sól fizjologiczna.',
      'Paracetamol/ibuprofen – zgodnie z ulotką (jeśli wskazane).'
    ],
    rx: ['Leczenie przyczynowe wg lekarza.']
  },

  /* ===== Ciąża (tylko Kobieta) ===== */
  'ciaza': {
    steps: [
      'W przypadku dolegliwości w ciąży – unikaj ryzykownych czynności, odpocznij w wygodnej pozycji na lewym boku.',
      'Nawadniaj się małymi łykami wody; obserwuj ruchy płodu (jeśli dotyczy trymestru).',
      'Plamienie, nasilony ból brzucha/pleców, odpłynięcie płynu, osłabienie ruchów płodu, omdlenie → pilna konsultacja lekarska / SOR / IP.',
      'Ból głowy + zaburzenia widzenia/obrzęki/nadciśnienie → pilnie skontaktuj się z lekarzem/112.',
      'W urazach (upadek, brzuch): obserwacja i pilna ocena medyczna – nie zwlekaj.'
    ],
    otc: [
      'Bezpieczniejsze zwykle: paracetamol (zgodnie z zaleceniem/lekarzem).',
      'NIE zaleca się w ciąży: ibuprofen/naproksen (szczególnie w III trymestrze) – skonsultuj z lekarzem.',
      'Doustne elektrolity przy odwodnieniu, preparaty z żelazem/folianem wg zaleceń.'
    ],
    rx: [
      'Leczenie dobiera lekarz prowadzący ciążę / SOR po badaniu.'
    ]
  },

  /* ===== twarz / głowa ===== */
  'oko': {
    steps: [
      'Nie trzeć oka; zdejmij soczewki, jeśli nosisz.',
      'Płucz oko letnią wodą lub solą fizjologiczną 10–15 min.',
      'Ciała obce usuwaj tylko płukaniem (nie pęsetą).',
      'Chemikalia / pogorszenie widzenia / uraz penetrujący → natychmiast SOR (112 w razie potrzeby).'
    ],
    otc: ['Sztuczne łzy / NaCl; paracetamol wg ulotki.'],
    rx: ['Krople/maści z antybiotykiem/NLPZ – po badaniu okulistycznym.']
  },
  'nos': {
    steps: [
      'Krwotok: pochyl głowę do przodu, uciśnij skrzydełka nosa 10 min.',
      'Chłodź nasadę nosa i kark; nie wkładaj waty głęboko.',
      'Po urazie nie dmuchaj mocno; przy deformacji → RTG/lek.',
      'Krwawienie >20 min, zawroty, omdlenie → SOR.'
    ],
    otc: ['Sól morska/NaCl; paracetamol/ibuprofen.'],
    rx: ['Leki obkurczające, antybiotyk przy infekcji – wg lekarza.']
  },
  'usta': {
    steps: [
      'Rany: przemyj zimną wodą, uciśnij jałowym gazikiem.',
      'Ułamany ząb → zabezpiecz w mleku/NaCl, pilny stomatolog.',
      'Silne krwawienie lub uraz szczęki → SOR.',
      'Oparzenia chemiczne → natychmiast płucz i jedź do SOR.'
    ],
    otc: ['Żele znieczulające, paracetamol/ibuprofen.'],
    rx: ['Antybiotykoterapia / szycie ran – wg lekarza/stomatologa.']
  },
  'ucho': {
    steps: [
      'Nie używaj patyczków ani ostrych narzędzi.',
      'Ciało obce? – nie manipuluj; laryngolog.',
      'Wyciek krwisty po urazie głowy → pilnie SOR.',
      'Ból z gorączką → konsultacja (zapalenie ucha).'
    ],
    otc: ['Paracetamol/ibuprofen; środki do rozpuszczania woszczyny.'],
    rx: ['Antybiotyki krople/doustne – wg lekarza.']
  },
  'glowa': {
    steps: [
      'Uraz: oceń świadomość, wymioty, ból narastający.',
      'Zimny okład 10–20 min (przez tkaninę).',
      'Utrata przytomności, wymioty, zaburzenia mowy/widzenia → SOR.',
      'Podejrzenie wstrząśnienia: obserwacja 24–48h, ogranicz wysiłek.'
    ],
    otc: ['Paracetamol (unikaj NLPZ tuż po urazie głowy).'],
    rx: ['Leki przeciwwymiotne/przeciwobrzękowe – wg lekarza.']
  },

  /* ===== tułów ===== */
  'klatka': {
    steps: [
      'Ból w klatce traktuj poważnie; ogranicz wysiłek.',
      'Uciskowy ból z dusznością/poty → 112 (podejrzenie serca).',
      'Po urazie: unieruchom, chłodź, obserwuj oddech.'
    ],
    otc: ['Przeciwbólowe (gdy brak podejrzenia serca); plastry chłodzące.'],
    rx: ['Leczenie przyczynowe (kardio/pneumo/uraz) – szpital.']
  },
  'brzuch': {
    steps: [
      'Obserwuj lokalizację bólu, nudności, gorączkę.',
      'Nie jedz; małe łyki wody, jeśli nie wymiotujesz.',
      'Silny ból, „twardy brzuch”, krew w stolcu/wymiotach → SOR.'
    ],
    otc: ['Elektrolity, paracetamol; skurcze – drotaweryna (jeśli możesz).'],
    rx: ['Leczenie przyczynowe (chirurg/gastro) – wg rozpoznania.']
  },
  'plecy': {
    steps: [
      'Pozycja przeciwbólowa, delikatny ruch zamiast leżenia stale.',
      'Zimny/ciepły okład (co działa lepiej). Unikaj dźwigania.',
      'Drętwienie kończyn/zaburzenia zwieraczy → pilna konsultacja.'
    ],
    otc: ['Ibuprofen/naproksen (jeśli możesz), maści przeciwzapalne.'],
    rx: ['Miorelaksanty, silniejsze NLPZ, fizjoterapia – wg lekarza.']
  },

  /* ===== kończyny ===== */
  'ramie': {
    steps: ['Uraz: temblak, chłodzenie 10–20 min.', 'Zniekształcenie/brak ruchu → RTG/SOR.', 'Przeciążenie: odpoczynek, ergonomia.'],
    otc: ['NLPZ doustne/żele; plaster chłodzący.'],
    rx: ['Iniekcje dostawowe, rehabilitacja – wg lekarza.']
  },
  'dlon': {
    steps: ['Rany: przemyj, uciśnij, opatrz.', 'Podejrzenie złamania: unieruchom w pozycji funkcjonalnej.', 'Głębokie skaleczenie/utrata czucia → SOR.'],
    otc: ['Środki odkażające, opatrunki, paracetamol/ibuprofen.'],
    rx: ['Szycie ran, antybiotykoterapia, unieruchomienie – wg lekarza.']
  },
  'biodra': {
    steps: ['Nie obciążaj po urazie; chłodź; skrót kończyny/ból silny → SOR.', 'Przeciążenie: odpoczynek, rozciąganie po ustąpieniu bólu.'],
    otc: ['NLPZ doustne/żele; plastry przeciwbólowe.'],
    rx: ['Fizjoterapia, iniekcje – wg specjalisty.']
  },
  'udo': {
    steps: ['RICE: odpoczynek, lód, ucisk, uniesienie.', 'Rozległy krwiak/obrzęk → USG/lekarska ocena.'],
    otc: ['Ibuprofen/naproksen; żele chłodzące.'],
    rx: ['Rehabilitacja; ewentualne leczenie przeciwkrzepliwe – wg lekarza.']
  },
  'kolano': {
    steps: ['Uraz: unieruchom, lód 10–20 min, nie obciążaj.', 'Blokowanie/„uciekanie”, duży obrzęk → ortopeda/RTG/USG.'],
    otc: ['NLPZ doustne/żele; orteza elastyczna tymczasowo.'],
    rx: ['Fizjoterapia, iniekcje (HA/steryd) – wg lekarza.']
  },
  'lydka': {
    steps: ['Skurcz/przeciążenie: rozciąganie, delikatny masaż, ciepło.', 'Ból + jednostronny obrzęk/ocieplenie → pilnie wyklucz zakrzepicę (lekarz).'],
    otc: ['Magnez (jeśli niedobory), NLPZ miejscowo.'],
    rx: ['Diagnostyka DVT i leczenie – pilnie wg lekarza.']
  },
  'stopy': {
    steps: ['Pęcherze/otarcia: zabezpiecz; nie przebijaj bez potrzeby.', 'Skręcenie: RICE; silny ból/niemożność obciążenia → RTG.'],
    otc: ['Plastry na pęcherze, NLPZ żele/doustne.'],
    rx: ['Orteza/gips, rehabilitacja – wg lekarza.']
  },

  /* ===== narządy / objawy ogólne ===== */
  'serce': {
    steps: ['Ból uciskowy za mostkiem ± promieniowanie, duszność, zimne poty → 112.', 'Odpoczywaj; nie prowadź; czekaj na pomoc.'],
    otc: ['Brak specyficznych OTC na ostry ból wieńcowy.'],
    rx: ['Leczenie kardiologiczne szpitalne – wg rozpoznania.']
  },
  'pluca': {
    steps: ['Duszność/świsty/ból przy oddychaniu – usiądź, ogranicz wysiłek.', 'Nagła duszność/krwioplucie/ból opłucnowy → 112 / SOR.'],
    otc: ['Inhalacje z soli (objawowo).'],
    rx: ['Leczenie pulmonologiczne – wg lekarza.']
  },
  'watroba': {
    steps: ['Ból w prawym podżebrzu: unikaj alkoholu i leków obciążających wątrobę.', 'Gorączka/zażółcenie skóry → pilna konsultacja.'],
    otc: ['Unikaj nadmiaru paracetamolu; osłonowe tylko po zaleceniu.'],
    rx: ['Diagnostyka i leczenie hepatologiczne – wg lekarza.']
  },
  'zoladek': {
    steps: ['Zgaga/nadbrzusze: małe, lekkostrawne posiłki; unikaj alkoholu i NLPZ.', 'Krwiste wymioty/smoliste stolce → pilnie SOR.'],
    otc: ['IPP OTC, leki zobojętniające; paracetamol przeciwbólowo.'],
    rx: ['Eradykacja H. pylori / recepturowe IPP – wg lekarza.']
  },
  'nerki': {
    steps: ['Ból lędźwi promieniujący do pachwiny – pij małe porcje wody.', 'Gorączka, dreszcze, ból przy mikcji → lekarz (ZUM/kolka).', 'Silny ból nieustępujący → SOR.'],
    otc: ['Drotaweryna (jeśli możesz), paracetamol.'],
    rx: ['Antybiotykoterapia lub leczenie urologiczne – wg lekarza.']
  },

  /* ===== poradniki specjalne (zielone kafelki) ===== */
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
      'Użyj AED gdy dostępny – postępuj wg komunikatów.'
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

  // jeśli przyszliśmy z kotwicą #pierwszapomoc – przewiń do sekcji
  if(location.hash === '#pierwszapomoc'){
    const el = $('#pierwszapomoc');
    if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
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
