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

/* ====== DATA: Objawy, Przyczyny, Pierwsza pomoc, Leki (OTC/Rx), Lekarz ======
   Zasada: te same wpisy używamy dla K/M/D, chyba że sekcja wymaga specyficznego (np. ciąża). */

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
    steps:['Krwotok: pochyl do przodu, ucisk skrzydełek 10 min.','Chłodzenie karku i nasady nosa.','Nie wkładaj waty głęboko.','>20 min krwawienia lub uraz z deformacją → SOR.'],
    otc:['Sól morska/NaCl; paracetamol/ibuprofen.'],
    rx:['Leki obkurczające miejscowe (krótko), antybiotyk przy bakteryjnym zapaleniu – wg lekarza.'],
    doctor:['Laryngolog/POZ; SOR przy krwawieniu nieustępującym lub ciężkim urazie.']
  },
  'usta': {
    symptoms:['Ból, krwawienie, rany, obrzęk, uszkodzenie zęba.'],
    causes:['Uraz, oparzenie chemiczne/termiczne, infekcja.'],
    steps:['Przepłucz zimną wodą, uciśnij jałowym gazikiem.','Ułamany ząb zabezpiecz w mleku/NaCl – pilny stomatolog.','Silne krwawienie/uraz szczęki → SOR.'],
    otc:['Żele znieczulające, paracetamol/ibuprofen.'],
    rx:['Szycie ran, antybiotykoterapia – wg lekarza/stomatologa.'],
    doctor:['Stomatolog/Laryngolog; SOR przy ciężkim urazie lub masywnym krwawieniu.']
  },
  'ucho': {
    symptoms:['Ból, świąd, niedosłuch, szumy, wyciek.'],
    causes:['Zapalenie ucha, woskowina, ciało obce, uraz.'],
    steps:['Nie używaj patyczków.','Ciało obce? – nie manipuluj; lekarz.','Wyciek krwisty po urazie głowy → SOR.','Ból + gorączka → konsultacja.'],
    otc:['Paracetamol/ibuprofen; środki do rozpuszczania woszczyny.'],
    rx:['Antybiotyk miejscowy/doustny – wg lekarza.'],
    doctor:['Laryngolog/POZ; SOR w urazie.']
  },
  'glowa': {
    symptoms:['Ból, zawroty, nudności, światłowstręt, zaburzenia pamięci po urazie.'],
    causes:['Migrena, napięciowy, uraz (wstrząśnienie), infekcje.'],
    steps:['Po urazie: zimny okład 10–20 min, obserwacja 24–48h.','Utrata przytomności/wymioty/zaburzenia mowy/widzenia → SOR.'],
    otc:['Paracetamol (unikać NLPZ tuż po urazie).'],
    rx:['Leki przeciwwymiotne/przeciwobrzękowe – wg lekarza.'],
    doctor:['POZ/neurolog; SOR przy objawach alarmowych.']
  },
  'klatka': {
    symptoms:['Ból uciskowy, duszność, kaszel, ból przy oddychaniu.'],
    causes:['Zawał/choroba wieńcowa, zapalenie opłucnej, skurcz mięśni, uraz.'],
    steps:['Uciskowy ból z dusznością/potami → 112.','Po urazie: unieruchom, chłodź, obserwuj oddech.'],
    otc:['Przeciwbólowe (jeśli brak podejrzenia serca), plastry chłodzące.'],
    rx:['Leczenie przyczynowe (kardio/pneumo/urazowe).'],
    doctor:['Zawsze powaga – 112/SOR przy bólu typowym dla serca.']
  },
  'brzuch': {
    symptoms:['Ból (lokalizacja), nudności, wymioty, biegunka, gorączka, wzdęcia.'],
    causes:['Niestrawność, infekcja, zapalenie wyrostka/pęcherzyka, kolka nerkowa.'],
    steps:['Nie jedz; małe łyki wody jeśli nie wymiotujesz.','Silny ból, „twardy brzuch”, krew w stolcu/wymiotach → SOR.'],
    otc:['Elektrolity, paracetamol; skurcze – drotaweryna (jeśli możesz).'],
    rx:['Leczenie chirurgiczne/gastro według rozpoznania.'],
    doctor:['POZ/SOR zależnie od ciężkości.']
  },
  'plecy': {
    symptoms:['Ból, sztywność, promieniowanie do kończyn, parestezje.'],
    causes:['Przeciążenie, dyskopatia, uraz.'],
    steps:['Pozycja przeciwbólowa, unikaj dźwigania, delikatny ruch.','Drętwienie kończyn/zaburzenia zwieraczy → pilna konsultacja.'],
    otc:['NLPZ doustne/żele (jeśli możesz).'],
    rx:['Miorelaksanty, silniejsze NLPZ, fizjoterapia.'],
    doctor:['POZ/ortopeda/neurolog; SOR przy objawach ucisku rdzenia.']
  },
  'ramie': {
    symptoms:['Ból, ograniczenie ruchu, obrzęk, zniekształcenie.'],
    causes:['Uraz, przeciążenie, zapalenie ścięgien.'],
    steps:['Uraz: temblak, chłodzenie 10–20 min.','Zniekształcenie/brak ruchu → RTG/SOR.'],
    otc:['NLPZ doustne/żele; plaster chłodzący.'],
    rx:['Iniekcje dostawowe/rehabilitacja – wg lekarza.'],
    doctor:['Ortopeda; SOR przy podejrzeniu złamania.']
  },
  'dlon': {
    symptoms:['Rany, obrzęk, ból, upośledzenie chwytu.'],
    causes:['Skaleczenie, zmiażdżenie, zwichnięcie, ciało obce.'],
    steps:['Przemyj, jałowy opatrunek, ucisk przy krwawieniu.','Podejrzenie złamania: unieruchom w pozycji funkcjonalnej.'],
    otc:['Środki odkażające, opatrunki; paracetamol/ibuprofen.'],
    rx:['Szycie, antybiotykoterapia, unieruchomienie – wg lekarza.'],
    doctor:['Chirurg ręki/ortopeda; SOR przy ciężkim urazie.']
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
    steps:['RICE: odpoczynek, lód, ucisk, uniesienie.','Rozległy krwiak/obrzęk → ocena lekarska.'],
    otc:['Ibuprofen/naproksen; żele chłodzące.'],
    rx:['Rehabilitacja; przy masywnych krwiakach – wg lekarza.'],
    doctor:['POZ/ortopeda.']
  },
  'kolano': {
    symptoms:['Ból, obrzęk, niestabilność, blokowanie.'],
    causes:['Skręcenie, uszkodzenie łąkotki/więzadeł, przeciążenie.'],
    steps:['Uraz: unieruchom, lód 10–20 min, nie obciążaj.','Blokowanie/duży obrzęk → ortopeda/RTG/USG.'],
    otc:['NLPZ doustne/żele; orteza elastyczna tymczasowo.'],
    rx:['Fizjoterapia, iniekcje HA/steryd – wg lekarza.'],
    doctor:['Ortopeda.']
  },
  'lydka': {
    symptoms:['Ból, skurcze, obrzęk.'],
    causes:['Przeciążenie, skurcze, DVT (zakrzepica).'],
    steps:['Rozciąganie, delikatny masaż, ciepło.','Jednostronny obrzęk/ocieplenie → pilnie wyklucz DVT (lekarz).'],
    otc:['Magnez (jeśli niedobory), NLPZ miejscowo.'],
    rx:['Diagnostyka i leczenie przeciwkrzepliwe – wg lekarza.'],
    doctor:['Pilna konsultacja przy podejrzeniu DVT.']
  },
  'stopy': {
    symptoms:['Pęcherze, ból, obrzęk, niemożność obciążenia.'],
    causes:['Skręcenie, otarcia, złamanie zmęczeniowe.'],
    steps:['Pęcherze: nie przebijaj bez potrzeby, zabezpiecz.','Skręcenie: RICE; brak możliwości obciążenia → RTG.'],
    otc:['Plastry na pęcherze, NLPZ żele/doustne.'],
    rx:['Orteza/gips; rehabilitacja – wg lekarza.'],
    doctor:['Ortopeda; SOR przy ostrym urazie.']
  },
  'serce': {
    symptoms:['Ból uciskowy/gniecenie za mostkiem ± promieniowanie, duszność, poty, lęk.'],
    causes:['Ostry zespół wieńcowy, skurcz naczyniowy, refluks (mimika).'],
    steps:['Podejrzenie serca → 112 natychmiast.','Odpoczynek, nie prowadź, czekaj na pomoc.'],
    otc:['Brak specyficznych OTC na ostry ból wieńcowy.'],
    rx:['Leczenie kardiologiczne – szpital.'],
    doctor:['Zawsze 112/SOR przy typowych objawach.']
  },
  'pluca': {
    symptoms:['Duszność, kaszel, ból przy oddychaniu, krwioplucie.'],
    causes:['Astma, zapalenie płuc, zatorowość, odma, COVID-19.'],
    steps:['Uspokój oddech, siądź.','Nagła duszność/krwioplucie/ból opłucnowy → 112/SOR.'],
    otc:['Inhalacje soli izotonicznej/hipertonicznej.'],
    rx:['Leczenie pulmonologiczne wg rozpoznania.'],
    doctor:['POZ/pulmonolog; SOR w ostrych stanach.']
  },
  'watroba': {
    symptoms:['Ból w prawym podżebrzu, nudności, męczliwość, żółtaczka.'],
    causes:['Zapalenie, zastój żółci, leki/hepatotoksyczność.'],
    steps:['Unikaj alkoholu i leków obciążających wątrobę.','Żółtaczka/gorączka → pilna konsultacja.'],
    otc:['Unikaj nadmiaru paracetamolu.'],
    rx:['Leczenie hepatologiczne wg rozpoznania.'],
    doctor:['Hepatolog/POZ; SOR przy ciężkich objawach.']
  },
  'zoladek': {
    symptoms:['Zgaga, ból nadbrzusza, nudności, odbijanie.'],
    causes:['Nadkwasota, H. pylori, NLPZ, stres.'],
    steps:['Małe, lekkostrawne posiłki; unikaj alkoholu i NLPZ.','Krwiste wymioty/smoliste stolce → SOR.'],
    otc:['IPP OTC, leki zobojętniające; paracetamol przeciwbólowo.'],
    rx:['Eradykacja H. pylori / recepturowe IPP – wg lekarza.'],
    doctor:['Gastroenterolog/POZ.']
  },
  'nerki': {
    symptoms:['Ból lędźwi promieniujący do pachwiny, kolka, gorączka, pieczenie przy mikcji.'],
    causes:['Kolka nerkowa, ZUM/odmiedniczkowe zapalenie nerek, kamica.'],
    steps:['Pij małe porcje wody (jeśli nie ma wymiotów).','Gorączka/dreszcze/silny ból → lekarz/SOR.'],
    otc:['Drotaweryna (jeśli możesz), paracetamol.'],
    rx:['Antybiotyki/rozkurczowe – wg lekarza.'],
    doctor:['POZ/urolog; SOR przy silnym bólu/objawach sepsy.']
  }
};

/* Poradniki specjalne (zielone kafelki) – kompletne instrukcje */
const GUIDES_DB = {
  'pierwszopomoc': {
    symptoms: [
      'Brak reakcji, nieprawidłowy oddech, masywne krwawienie, uraz.'
    ],
    causes: [
      'Urazy mechaniczne, choroby nagłe (zawał, udar), zatrucia, zadławienie, oparzenia.'
    ],
    steps: [
      '1) Oceń bezpieczeństwo miejsca: nie narażaj siebie. Załóż rękawiczki, jeśli masz.',
      '2) Sprawdź reakcję: głośno zapytaj, lekko potrząśnij za ramię.',
      '3) Zadzwoń 112 (głośnomówiący) jeśli są wątpliwości lub poszkodowany nie reaguje.',
      '4) Udrożnij drogi oddechowe, oceń oddech 10 s.',
      '5) Brak oddechu → RKO (100–120/min, 5–6 cm; 30:2, jeśli potrafisz wentylować).',
      '6) Oddycha, ale nie reaguje → pozycja bezpieczna; kontrola oddechu.',
      '7) Zatrzymaj masywne krwawienie: ucisk/opatrunek uciskowy.',
      '8) Zapobiegaj wychłodzeniu/wstrząsowi: połóż, unieś nogi, okryj folią NRC.',
      '9) Monitoruj stan do przyjazdu ZRM; nie podawaj jedzenia/picia nieprzytomnym.'
    ],
    otc: [
      'Apteczka: rękawiczki, maseczka do RKO, kompresy, bandaże, opaska elastyczna, sól NaCl, plastry, folia NRC, nożyczki.'
    ],
    rx: [],
    doctor: [
      'SOR/112 przy objawach zagrożenia życia.'
    ],
    toc: [
      {href:'szczegoly.html?typ=porada&czesc=reanimacja&label=Reanimacja', label:'⚡ Reanimacja'},
      {href:'szczegoly.html?typ=porada&czesc=zadlawienie&label=Zadławienie', label:'🫁 Zadławienie'},
      {href:'szczegoly.html?typ=porada&czesc=wypadek&label=Wypadek', label:'💥 Wypadek'}
    ]
  },
  'reanimacja': {
    symptoms:['Brak reakcji i brak prawidłowego oddechu.'],
    causes:['NZK: zawał, arytmie, utonięcie, uraz, prąd, zadławienie.'],
    steps:[
      'A) Rozpoznaj NZK: brak reakcji + brak prawidłowego oddechu 10 s.',
      'B) Zawołaj o pomoc/AED, dzwoń 112 (głośnomówiący).',
      'C) Uciskaj środek mostka: 100–120/min, 5–6 cm, pełny powrót klatki.',
      'D) 30:2 jeśli potrafisz wentylować; inaczej same uciski.',
      'E) AED: włącz, naklej elektrody, postępuj wg poleceń; minimalizuj przerwy.',
      'F) Zmieniaj ratownika co ~2 min; nie przerywaj >10 s.',
      'G) Dzieci: 5 oddechów na start; 30:2 (1 rat.) / 15:2 (2 rat.); głębokość 1/3 klatki (5 cm dzieci, 4 cm niemowlęta).',
      'H) Zadławienie nieprzytomnego: RKO, kontrola jamy ustnej po każdych 30 uciśnięciach.',
      'I) Kończysz, gdy: oznaki życia, ZRM przejmuje, brak sił lub polecenie dyspozytora.'
    ],
    otc:['Maseczka do RKO, rękawiczki; AED jeśli dostępny.'],
    rx:[],
    doctor:['Po skutecznej RKO – przekaz ZRM; obserwacja.']
  },
  'zadlawienie': {
    symptoms:['Całkowita niedrożność: brak mowy/oddechu, sinica; częściowa: skuteczny kaszel/świsty.'],
    causes:['Pokarm, małe przedmioty (dzieci).'],
    steps:[
      'A) Skuteczny kaszel → zachęcaj do kaszlu, obserwuj.',
      'B) Całkowita niedrożność (dorosły/dziecko): 5 uderzeń między łopatki → 5 uciśnięć nadbrzusza.',
      'C) Powtarzaj 5/5 do usunięcia przeszkody lub utraty przytomności.',
      'D) Nieprzytomny: połóż na ziemi, 112, RKO 30:2; kontrola jamy ustnej po 30.',
      'E) Niemowlę: 5 uderzeń w plecy (głowa w dół) → 5 uciśnięć klatki (2 palce, 1/3 głębokości).',
      'F) Samopomoc: pchnięcia nadbrzusza na oparciu krzesła; wzywaj pomoc.',
      'G) Po epizodzie zgłoś się do lekarza (ryzyko urazu/pozostałości).',
      '⚠️ Ciąża/otyłość: zamiast nadbrzusza uciśnięcia na mostek.'
    ],
    otc:[],
    rx:[],
    doctor:['Lekarz/LOR po epizodzie; 112 gdy duszność/utrata przytomności.']
  },
  'wypadek': {
    symptoms:['Uraz, krwawienie, zaburzenia świadomości, ból, deformacje, duszność.'],
    causes:['Kolizje, upadki, prąd, chemikalia, pożar.'],
    steps:[
      'A) STOP – najpierw Twoje bezpieczeństwo: trójkąt, kamizelka, światła.',
      'B) Oceń: ilu poszkodowanych, mechanizm, zagrożenia. Zadzwoń 112.',
      'C) Priorytety: przytomność/oddech → krwotok → drożność → wstrząs.',
      'D) Krwotok: ucisk/opatrunek uciskowy; amputat do torebki i chłodu (nie lód bezpośrednio).',
      'E) Kręgosłup: stabilizacja głowy, nie poruszaj.',
      'F) Oddychanie: brak oddechu → RKO; duszność → pozycja półsiedząca/bezpieczna.',
      'G) Oparzenia: chłodź 10–20 min, usuń biżuterię/odzież nieprzyklejoną, jałowo przykryj.',
      'H) Złamania: unieruchom dwie sąsiednie kości/stawy, kontrola krążenia/czucia poniżej urazu.',
      'I) Wstrząs: płasko, nogi w górę, folia NRC, nie podawaj jedzenia/picia.',
      'J) Przekaz ZRM: czas, mechanizm, objawy, działania, alergie/leki/choroby (SAMPLE).'
    ],
    otc:['Rękawiczki, folia NRC, opatrunki, bandaże, sól NaCl, chusta, nożyczki.'],
    rx:[],
    doctor:['Zawsze 112/SOR przy ciężkim urazie lub wątpliwościach.']
  }
};

/* Ciąża – z podziałem na trymestry (renderowane jako podsekcje w panelach) */
const PREGNANCY_DB = {
  base: {
    symptoms:[
      'Typowe: nudności/wymioty, zgaga, zmęczenie, bóle pleców/miednicy, obrzęki kończyn (później).',
      'Alarmowe: plamienie/krwawienie, silny ból brzucha/pleców, skurcze przedwczesne, silny ból głowy, zaburzenia widzenia, znaczne obrzęki twarzy/dłoni, spadek/brak ruchów płodu (po 20. tyg.), odpłynięcie wód, gorączka.'
    ],
    causes:[
      'Fizjologiczne zmiany hormonalne/mechaniczne, infekcje, niedobory, odwodnienie.',
      'Stany nagłe: poronienie, przedwczesny poród, stan przedrzucawkowy, odklejenie łożyska, ZUM, zatrucia, urazy.'
    ],
    steps:[
      'Odpoczynek na lewym boku, nawadnianie małymi łykami, lekkostrawna dieta.',
      'Objawy alarmowe → 112 / SOR/IP ginekologiczny bez zwłoki.',
      'Bóle pleców: delikatne rozciąganie, ciepły prysznic, pas podtrzymujący (po zaleceniu).',
      'Uraz brzucha: nawet przy dobrym samopoczuciu — pilna ocena w IP.'
    ],
    otc:[
      'Paracetamol (po zaleceniu lekarza).',
      'Elektrolity przy odwodnieniu.',
      'Suplementy wg zaleceń: kwas foliowy, żelazo (gdy niedobór), wit. D, jod.',
      'Na zgagę: alginiany/wodorowęglan (po konsultacji).'
    ],
    rx:[
      'Antybiotyki/lek przeciwskurczowy/nadciśnieniowy — decyzja lekarza prowadzącego.',
      'NLPZ (ibuprofen/naproksen) zasadniczo przeciwwskazane, szczególnie w III trymestrze.'
    ],
    doctor:[
      'Stały kontakt z lekarzem/położną prowadzącą.',
      'Kontrola ruchów płodu po 20. tyg.; ich spadek → pilny kontakt.',
      'Objawy alarmowe → 112/SOR/IP.'
    ]
  },
  trimesters: [
    {
      label:'I trymestr (0–13 tyg.)',
      symptoms:[
        'Nudności/wymioty, tkliwość piersi, senność, częstomocz, plamienia (wymagają oceny).'
      ],
      causes:[
        'Burza hormonalna (hCG, progesteron), implantacja; ryzyko poronienia największe w I trymestrze.'
      ],
      steps:[
        'Małe częste posiłki, imbir/napary (po konsultacji), nawodnienie.',
        'Plamienie/ból jak miesiączkowy → konsultacja; obfite krwawienie/silny ból → SOR.'
      ]
    },
    {
      label:'II trymestr (14–27 tyg.)',
      symptoms:[
        'Lepsze samopoczucie, zgaga, bóle więzadeł, pierwsze ruchy płodu.'
      ],
      causes:[
        'Rozciąganie macicy/więzadeł, ucisk na żołądek (zgaga).'
      ],
      steps:[
        'Unikaj obfitych/ostrych posiłków, śpij z wyżej ułożonym tułowiem.',
        'Ból/napinanie regularne → ocena ryzyka porodu przedwczesnego.'
      ]
    },
    {
      label:'III trymestr (28+ tyg.)',
      symptoms:[
        'Obrzęki kostek, duszność wysiłkowa, bóle pleców/miednicy, częste skurcze przepowiadające.'
      ],
      causes:[
        'Ucisk dużej macicy, zatrzymywanie płynów; ryzyko stanu przedrzucawkowego.'
      ],
      steps:[
        'Odpoczynek na lewym boku; obserwuj ruchy płodu (test 10 ruchów).',
        'Ból głowy + zaburzenia widzenia/ciśnienie/obrzęki → natychmiast lekarz/SOR.'
      ]
    }
  ]
};

/* ====== MASTER DB ====== */
const FIRST_AID_DB = {
  ...COMMON_PARTS_DB,
  ...GUIDES_DB,
  'ciaza': PREGNANCY_DB.base
};

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

/* Render specjalny dla ciąży – trymestry w panelach */
function renderPregnancyTrimesters(){
  const cont = $('#fa-container'); if(!cont) return;
  const tr = PREGNANCY_DB.trimesters || [];
  tr.forEach(block=>{
    const h = document.createElement('h4'); h.textContent = block.label; h.style.marginTop = '12px';
    const ul = document.createElement('ul');
    (block.steps||[]).forEach(s=>{ const li=document.createElement('li'); li.textContent = s; ul.appendChild(li); });
    cont.appendChild(h); cont.appendChild(ul);
  });

  // Objawy/Przyczyny – dołącz pod głównymi listami
  const addBelow = (listId, items, label) => {
    const list = $(listId); if(!list || !items || items.length===0) return;
    const h = document.createElement('h4'); h.textContent = label; h.style.marginTop='10px';
    const ul = document.createElement('ul');
    items.forEach(t=>{ const li=document.createElement('li'); li.textContent=t; ul.appendChild(li); });
    list.appendChild(h); list.appendChild(ul);
  };
  addBelow('#symptoms-list', PREGNANCY_DB.trimesters[0]?.symptoms, 'I trymestr – dodatkowe');
  addBelow('#symptoms-list', PREGNANCY_DB.trimesters[1]?.symptoms, 'II trymestr – dodatkowe');
  addBelow('#symptoms-list', PREGNANCY_DB.trimesters[2]?.symptoms, 'III trymestr – dodatkowe');

  addBelow('#causes-list', PREGNANCY_DB.trimesters[0]?.causes, 'I trymestr – przyczyny');
  addBelow('#causes-list', PREGNANCY_DB.trimesters[1]?.causes, 'II trymestr – przyczyny');
  addBelow('#causes-list', PREGNANCY_DB.trimesters[2]?.causes, 'III trymestr – przyczyny');
}

/* Szczegóły – główna logika */
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
    if(isGuide){ img.src = 'img/placeholder.png'; img.alt = label || 'Poradnik'; }
    else {
      const src = `img/${typ}-${czesc}.png`; img.src = src; img.alt = label;
      img.onerror = ()=>{ img.src='img/placeholder.png'; };
    }
  }

  const data = FIRST_AID_DB[czesc] || FIRST_AID_DB[typ] || FIRST_AID_DB['_default'] || {};

  renderList($('#symptoms-list'), data.symptoms);
  renderList($('#causes-list'), data.causes);
  renderList($('#fa-steps'), data.steps);
  renderList($('#otc-list'), data.otc);
  renderList($('#rx-list'), data.rx);
  renderList($('#doctor-list'), data.doctor);

  hideIfEmpty('#przyczyny', data.causes);
  hideIfEmpty('#leki', (data.otc||[]).concat(data.rx||[]));
  hideIfEmpty('#lekarz', data.doctor);

  // spis treści tylko dla ogólnej "Pierwszej pomocy"
  if(czesc === 'pierwszopomoc' && GUIDES_DB.pierwszopomoc?.toc){
    const toc = $('#fa-toc'); toc.innerHTML = '';
    GUIDES_DB.pierwszopomoc.toc.forEach(i=>{
      const a=document.createElement('a'); a.className='badge'; a.href=i.href; a.textContent=i.label; toc.appendChild(a);
    });
    toc.style.display='flex'; toc.style.gap='8px'; toc.style.flexWrap='wrap'; toc.style.marginBottom='10px';
  }

  // trymestry przy ciąży
  if(czesc === 'ciaza') renderPregnancyTrimesters();
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
