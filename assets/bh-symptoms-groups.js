<script>
/*!
  BoliHelp — Grouped Symptoms (PL/EN) • v1.0
  • Bezpieczna nakładka: dopisuje .symptomsGrouped i renderer tylko gdy dana sekcja istnieje.
  • Nie modyfikuje routera, tłumacza ani innych modułów.
*/
(function(){
  /* ========== 0) LEKKI CSS POD NAGŁÓWKI GRUP ========== */
  const css = `
  .symp-group{ margin:12px 0 18px }
  .symp-group h4{
    margin:0 0 8px; font-size:14px; font-weight:900; letter-spacing:.3px; color:#eaf2ff;
    display:inline-flex; align-items:center; gap:8px;
  }
  .symp-group h4::before{
    content:"●"; font-size:10px; opacity:.9;
    background:linear-gradient(135deg,#a46bff,#5eead4);
    -webkit-background-clip:text; background-clip:text; color:transparent;
  }
  .symp-group ul.clean{ margin:0 }
  .symp-group li{ cursor:pointer; }
  .symp-group li .cb{
    display:inline-block; width:14px; height:14px; border-radius:4px; margin-right:6px;
    border:1px solid rgba(255,255,255,.35); vertical-align:-2px;
    box-shadow:inset 0 0 0 1px rgba(255,255,255,.15);
  }
  .symp-group li.li-checked .cb{
    background:linear-gradient(180deg, rgba(255,107,107,.12), rgba(255,107,107,.28));
    border-color: rgba(255,107,107,.75);
    box-shadow:0 0 0 2px rgba(255,107,107,.35);
  }`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ========== 1) RENDERER (publiczny) ========== */
  function renderSymptomsEnhanced(containerEl, partData){
    if(!containerEl || !partData) return false;
    if (partData.symptomsGrouped && typeof partData.symptomsGrouped === 'object'){
      containerEl.innerHTML = '';
      Object.entries(partData.symptomsGrouped).forEach(([groupTitle, items])=>{
        const wrap = document.createElement('div'); wrap.className = 'symp-group';
        const h4 = document.createElement('h4'); h4.textContent = groupTitle; wrap.appendChild(h4);
        const ul = document.createElement('ul'); ul.className='clean';
        (items||[]).forEach(txt=>{
          const li = document.createElement('li'); li.tabIndex = 0;
          const cb = document.createElement('span'); cb.className='cb'; cb.setAttribute('aria-hidden','true');
          li.appendChild(cb); li.appendChild(document.createTextNode(' ' + txt));
          function toggle(){
            cb.classList.toggle('checked');
            li.classList.toggle('li-checked');
            document.getElementById('dx-hint')?.classList.add('show'); // ślad, że coś zaznaczono
          }
          li.addEventListener('click', toggle);
          li.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggle(); }});
          ul.appendChild(li);
        });
        wrap.appendChild(ul);
        containerEl.appendChild(wrap);
      });
      return true;
    }
    return false; // brak grup – pozostaw dotychczasowy renderer
  }
  window.renderSymptomsEnhanced = window.renderSymptomsEnhanced || renderSymptomsEnhanced;

  /* ========== 2) AUTO-WYKRYWANIE I PODMIANA TYLKO GDY SĄ GRUPY ========== */
  function tryAutoEnhance(){
    try{
      const params = new URLSearchParams(location.search);
      const czesc  = params.get('czesc'); // np. 'oko', 'kolano' itd.
      const box    = document.getElementById('symp-common'); // Twoje UL „Objawy”
      const CPL = window.CONTENT_PL || {};
      const CEN = window.CONTENT_EN || {};
      const C = (CPL && CPL[czesc]) ? CPL : (CEN && CEN[czesc]) ? CEN : null;
      if(!box || !C || !czesc || !C[czesc]) return;
      if (C[czesc].symptomsGrouped && !box.dataset.bhGrouped){
        if (renderSymptomsEnhanced(box, C[czesc])) box.dataset.bhGrouped='1';
      }
    }catch(e){}
  }
  const mo = new MutationObserver(()=>tryAutoEnhance());
  mo.observe(document.documentElement, { childList:true, subtree:true });
  window.addEventListener('DOMContentLoaded', tryAutoEnhance);
  window.addEventListener('load', tryAutoEnhance);

  /* ========== 3) DANE: WYPASIONE GRUPY (PL/EN) ========== */
  const PL = window.CONTENT_PL || {};
  const EN = window.CONTENT_EN || {};
  function setGroups(langObj, id, groups){ if(langObj && langObj[id]) langObj[id].symptomsGrouped = groups; }
  function both(id, pl, en){ setGroups(PL,id,pl); setGroups(EN,id,en||pl); }

  /* GŁOWA */
  both('glowa',
  {"Ból":["Tępy","Pulsujący/migrenowy","Jednostronny","Nasilenie przy wysiłku","Nasilenie przy pochylaniu","Poranny z napięciem karku"],
   "Towarzyszące":["Światłowstręt","Nadwrażliwość na dźwięki","Nudności","Wymioty","Zawroty głowy","Aura (mroczki/błyski)"],
   "Wyzwalacze":["Stres","Brak snu","Odwodnienie","Głód/nieregularne posiłki","Hałas/jaskrawe światło","Zmiana pogody"],
   "Alarmowe":["Nagły „piorunujący” ból","Gorączka + sztywność karku","Uraz głowy","Zaburzenia mowy/widzenia","Niedowład","Zmiana osobowości"]},
  {"Pain":["Dull","Throbbing/migraine","Unilateral","Worse with exertion","Worse bending","Morning with neck tension"],
   "Associated":["Photophobia","Phonophobia","Nausea","Vomiting","Dizziness","Aura (flashes)"],
   "Triggers":["Stress","Sleep deprivation","Dehydration","Hunger/irregular meals","Noise/bright light","Weather change"],
   "Red flags":["Thunderclap headache","Fever + stiff neck","Head trauma","Speech/vision deficit","Weakness","Personality change"]});

  /* OKO */
  both('oko',
  {"Ból i dyskomfort":["Ból tępy","Kłucie/szczypanie","Uczucie piasku","Światłowstręt","Łzawienie"],
   "Widzenie":["Zamazane","Podwójne","Mroczki/błyski","„Zasłona”/ubytki pola","Trudność czytania"],
   "Powieki/spojówka":["Zaczerwienienie","Obrzęk powiek","Ropna wydzielina","Sklejanie powiek rano","Jęczmień/gradówka"],
   "Uraz/ekspozycja":["Ciało obce","Chemiczne podrażnienie","Uderzenie w oko","UV (spawanie/śnieg)"],
   "Alarmowe":["Nagły ubytek widzenia","Błyski + „kurtyna”","Silny ból po urazie","Ból + nudności (jaskra?)"]},
  {"Pain & discomfort":["Dull ache","Stinging","Gritty feeling","Photophobia","Tearing"],
   "Vision":["Blurred","Diplopia","Floaters/flashes","Field loss/curtain","Reading difficulty"],
   "Lids/conjunctiva":["Redness","Eyelid swelling","Purulent discharge","Sticky lids AM","Hordeolum/chalazion"],
   "Injury/exposure":["Foreign body","Chemical burn","Blunt trauma","UV keratitis"],
   "Red flags":["Sudden vision loss","Flashes + curtain","Severe post-trauma pain","Pain + nausea (acute glaucoma)"]});

  /* USZY */
  both('uszy',
  {"Ból i pełność":["Ból ucha","Uczucie zatkania","Nasilenie przy przełykaniu","Ból przy pociągnięciu małżowiny","Po locie/nurkowaniu"],
   "Słuch":["Niedosłuch","Szum (tinnitus)","Autofonia","Pogorszenie po wodzie"],
   "Wydzielina/infekcja":["Wysięk","Gorączka","Ból gardła promieniujący do ucha"],
   "Równowaga":["Zawroty","Oczopląs","Nudności/wymioty"],
   "Alarmowe":["Nagła głuchota","Porażenie nerwu VII","Silny ból + wysoka gorączka"]},
  {"Pain & fullness":["Otalgia","Fullness","Worse on swallowing","Tender pinna traction","After flight/diving"],
   "Hearing":["Hearing loss","Tinnitus","Autophony","Worse after water"],
   "Discharge/infection":["Otorrhea","Fever","Sore throat radiating"],
   "Balance":["Vertigo","Nystagmus","Nausea/vomiting"],
   "Red flags":["Sudden deafness","Facial palsy","Severe pain + high fever"]});

  /* NOS */
  both('nos',
  {"Niedrożność/katar":["Zatkany nos","Wodnista wydzielina","Gęsta żółto-zielona wydzielina","Kichanie","Świąd"],
   "Zatoki/ból":["Ból twarzy","Nasilenie przy pochylaniu","Uczucie rozpierania","Ból zębów trzonowych"],
   "Węch":["Osłabiony węch","Zaburzony węch"],
   "Alergia":["Łzawienie","Napady kichania","Sezonowość"],
   "Alarmowe":["Jednostronna ropna + krwawienia","Uraz + deformacja"]},
  {"Obstruction/discharge":["Blocked nose","Watery discharge","Thick yellow-green mucus","Sneezing","Itch"],
   "Sinus/pain":["Facial pain","Worse bending forward","Pressure","Upper molar pain"],
   "Smell":["Hyposmia","Dysosmia"],
   "Allergy":["Tearing","Sneezing bouts","Seasonality"],
   "Red flags":["Unilateral purulent + bleeding","Trauma + deformity"]});

  /* GARDŁO */
  both('gardlo',
  {"Ból/podrażnienie":["Drapanie/suchość","Ból po połykaniu","Chrypka","Kaszel","Głos matowy"],
   "Infekcyjne":["Gorączka","Węzły bolesne","Naloty na migdałkach","Nieprzyjemny zapach"],
   "Inne":["Zgaga (refluks)","Uczucie kuli w gardle"],
   "Alarmowe":["Trudność oddychania","Ślinienie + silny ból","Szczękościsk/uraz","Jednostronny silny ból + gorączka"]},
  {"Soreness/irritation":["Scratchy/dry","Odynophagia","Hoarseness","Cough","Muffled voice"],
   "Infectious":["Fever","Tender nodes","Tonsillar exudate","Halitosis"],
   "Other":["Heartburn/reflux","Globus"],
   "Red flags":["Breathing difficulty","Drooling + severe pain","Trismus/trauma","Unilateral severe pain + fever"]});

  /* SZYJA */
  both('szyja',
  {"Ból/sztywność":["Sztywność karku","Ból do barku/łopatki","Nasilenie przy ruchu","Ból nocny"],
   "Neurologiczne":["Mrowienie dłoni","Osłabienie chwytu","Drętwienie palców"],
   "Węzły/obrzęki":["Powiększone węzły","Tkliwość"],
   "Alarmowe":["Gorączka + silna sztywność","Uraz szyi","Postępujący niedowład","Zaburzenia zwieraczy"]},
  {"Pain/stiffness":["Stiff neck","Pain to shoulder/scapula","Worse on movement","Nocturnal pain"],
   "Neurologic":["Hand tingling","Grip weakness","Finger numbness"],
   "Nodes/swelling":["Enlarged nodes","Tenderness"],
   "Red flags":["Fever + marked stiffness","Neck trauma","Progressive weakness","Sphincter disturbance"]});

  /* ZĘBY */
  both('zeby',
  {"Ból":["Pulsujący ból","Ból przy nagryzaniu","Nadwrażliwość na zimno/ciepło/słodkie","Nocne nasilenie"],
   "Dziąsła":["Obrzęk","Krwawienie","Ropny pęcherzyk (przetoka)","Cofanie dziąseł"],
   "Szczęka":["Promieniowanie do ucha/skroni","Trudność otwierania (trismus)","Ból przy ucisku policzka"],
   "Alarmowe":["Gorączka + obrzęk twarzy","Uraz/wybicie zęba","Trismus narastający","Zaburzenia połykania"]},
  {"Pain":["Throbbing","Pain on biting","Sensitivity cold/heat/sweets","Night worsening"],
   "Gums":["Swelling","Bleeding","Gum abscess/fistula","Recession"],
   "Jaw":["Pain to ear/temple","Trismus","Cheek tenderness"],
   "Red flags":["Fever + facial swelling","Avulsion/trauma","Progressive trismus","Dysphagia"]});

  /* KLATKA */
  both('klatka',
  {"Ból":["Kłujący przy wdechu","Ucisk za mostkiem","Promieniowanie do lewej ręki/szyi","Tkliwość uciskowa"],
   "Oddech":["Duszność spoczynkowa","Duszność wysiłkowa","Kaszel","Świsty"],
   "Inne":["Zimny pot","Kołatanie","Gorączka","Lęk niepokój"],
   "Alarmowe":["Nagły silny ból + duszność","Objawy zawału","Uraz klatki"]},
  {"Pain":["Pleuritic sharp","Substernal pressure","Radiation to left arm/neck","Tender to palpation"],
   "Breathing":["Dyspnea at rest","On exertion","Cough","Wheezing"],
   "Other":["Cold sweat","Palpitations","Fever","Anxiety"],
   "Red flags":["Sudden severe pain + dyspnea","MI symptoms","Chest trauma"]});

  /* SERCE */
  both('serce',
  {"Rytm/perfuzja":["Kołatania","Nieregularne bicie","Omdlenia/presynkopa","Zawroty"],
   "Ból":["Ucisk za mostkiem","Nasilenie przy wysiłku","Ustępuje w spoczynku"],
   "Zastój":["Obrzęki kostek","Dusznosć nocna","Szybkie męczenie"],
   "Alarmowe":["Silny narastający ból","Zimny pot + nudności","Objawy udaru"]},
  {"Rhythm/perfusion":["Palpitations","Irregular beats","Syncope/presyncope","Lightheadedness"],
   "Pain":["Substernal pressure","Exertional","Relief at rest"],
   "Congestion":["Ankle edema","PND/orthopnea","Fatigue"],
   "Red flags":["Severe escalating pain","Cold sweat + nausea","Stroke-like signs"]});

  /* PŁUCA */
  both('pluca',
  {"Duszność":["Spoczynkowa","Wysiłkowa","Nagła"],
   "Kaszel":["Suchy","Mokry","Krwioplucie","Nocny"],
   "Płucopochodne":["Świsty","Ból przy głębokim wdechu","Gorączka"],
   "Alarmowe":["Nagła duszność + ból klatki","Obfite krwioplucie","Szybko narastająca sinica"]},
  {"Dyspnea":["At rest","On exertion","Sudden"],
   "Cough":["Dry","Productive","Hemoptysis","Nocturnal"],
   "Pulmonary":["Wheezing","Pleuritic pain","Fever"],
   "Red flags":["Sudden dyspnea + chest pain","Massive hemoptysis","Rapid cyanosis"]});

  /* BRZUCH */
  both('brzuch',
  {"Ból":["Kurczowy","Kłujący","Rozlany","Zlokalizowany RLQ/LLQ","Nasilenie po posiłku","Ustępuje po wypróżnieniu"],
   "Trawienie":["Nudności","Wymioty","Wzdęcia","Zgaga","Odbijania"],
   "Wypróżnienia":["Biegunka","Zaparcie","Krew w stolcu","Ciemny smolisty stolec"],
   "Alarmowe":["„Deskowaty” brzuch","Silna uogólniona tkliwość + gorączka","Wymioty z krwią/kawowe"]},
  {"Pain":["Crampy","Sharp","Diffuse","Localized RLQ/LLQ","Worse after meals","Relief after stool"],
   "Digestion":["Nausea","Vomiting","Bloating","Heartburn","Belching"],
   "Bowel":["Diarrhea","Constipation","Blood in stool","Melena"],
   "Red flags":["Board-like rigidity","Generalized tenderness + fever","Coffee-ground/hematemesis"]});

  /* NERKI */
  both('nerki',
  {"Ból/kolka":["Kolka nerkowa","Ból lędźwi","Promieniowanie do pachwiny","Nasilenie falami"],
   "Mocz":["Krwiomocz","Częstomocz","Piecznie przy mikcji","Mętny zapach"],
   "Ogólne":["Gorączka","Dreszcze","Nudności","Poty"],
   "Alarmowe":["Gorączka + silny ból lędźwi","Brak oddawania moczu","Nieopanowany ból"]},
  {"Pain/colic":["Renal colic","Flank pain","Radiation to groin","Colicky waves"],
   "Urine":["Hematuria","Frequency","Dysuria","Cloudy/odor"],
   "General":["Fever","Chills","Nausea","Sweats"],
   "Red flags":["Fever + severe flank pain","Anuria/retention","Uncontrolled pain"]});

  /* WĄTROBA (jeśli masz kafelek „watroba”) */
  both('watroba',
  {"Dyskomfort":["Tkliwość pod prawym łukiem","Uczucie pełności","Wzdęcia"],
   "Skóra/oczy":["Zażółcenie skóry","Ciemny mocz","Jasny stolec","Świąd skóry"],
   "Ogólne":["Zmęczenie","Utrata apetytu","Nudności"],
   "Alarmowe":["Nagłe żółtaczka","Silny ból + gorączka","Zamroczenie/splątanie"]},
  {"Discomfort":["RUQ tenderness","Fullness","Bloating"],
   "Skin/eyes":["Jaundice","Dark urine","Pale stool","Pruritus"],
   "General":["Fatigue","Anorexia","Nausea"],
   "Red flags":["Acute jaundice","Severe pain + fever","Confusion/encephalopathy"]});

  /* SKÓRA */
  both('skora',
  {"Zmiany":["Plamisto-grudkowa wysypka","Pokrzywka","Pęcherze","Krosty","Liszajec"],
   "Świąd/pieczenie":["Świąd","Pieczenie","Nadwrażliwość"],
   "Zakażenie":["Rumień ciepły bolesny","Ropienie","Gorączka"],
   "Alarmowe":["Szybko szerząca się plama","Rozległe pęcherze","Obrzęk twarzy + duszność"]},
  {"Lesions":["Maculopapular rash","Urticaria","Blisters","Pustules","Impetigo"],
   "Pruritus/burning":["Itch","Burning","Tenderness"],
   "Infection":["Warm painful erythema","Purulence","Fever"],
   "Red flags":["Rapidly spreading redness","Extensive blistering","Facial swelling + dyspnea"]});

  /* PLECY */
  both('plecy',
  {"Ból":["Tępy lędźwiowy","Kłujący piersiowy","Nasilenie przy pochylaniu/skręcie","Poranny sztywność"],
   "Korzeniowe":["Rwa kulszowa","Drętwienie stopy","Osłabienie kończyny"],
   "Mięśnie":["Tkliwość paraspinalna","Napięcie"],
   "Alarmowe":["Niedowład/zwieracze","Gorączka + ból","Uraz wysokoenergetyczny"]},
  {"Pain":["Dull lumbar","Sharp thoracic","Worse with flex/rotation","Morning stiffness"],
   "Radicular":["Sciatica","Foot numbness","Weakness"],
   "Muscular":["Paraspinal tenderness","Tightness"],
   "Red flags":["Motor deficit/bladder issues","Fever + back pain","High-energy trauma"]});

  /* BIODRA */
  both('biodra',
  {"Ból":["Pachwina/przednia część uda","Ból przy chodzeniu","Kłucie przy rotacji","Ból po wysiłku"],
   "Uraz/przeciążenie":["Upadek/skręcenie","Przeciążenie","Trzask/pstryknięcie"],
   "Mięśnie":["Naciągnięcie czworogłowego","Naciągnięcie przywodzicieli"],
   "Alarmowe":["Uraz + brak obciążania","Gorączka + ból stawu"]},
  {"Pain":["Groin/anterior thigh","Pain while walking","Sharp on rotation","Post-activity pain"],
   "Injury/overuse":["Fall/twist","Overuse","Snap/pop"],
   "Muscles":["Quadriceps strain","Adductor strain"],
   "Red flags":["Trauma + no weight-bearing","Fever + hot joint"]});

  /* UDO (jeśli masz oddzielny kafelek) */
  both('udo',
  {"Ból/mięśnie":["Naciągnięcie mięśni","Kłucie przy biegu","Tkliwość przy dotyku"],
   "Krążenie":["Uczucie ciężkości","Siniaki"],
   "Alarmowe":["Nagły obrzęk i ból (zakrzepica?)","Zasinienie po urazie + narastający ból"]},
  {"Pain/muscles":["Muscle strain","Stabbing while running","Tender to touch"],
   "Circulation":["Heaviness","Bruising"],
   "Red flags":["Sudden swelling + pain (DVT?)","Expanding bruise after trauma"]});

  /* KOLANO */
  both('kolano',
  {"Ból/obrzęk":["Ból przy schodach","Obrzęk po wysiłku","Sztywność poranna","Tkliwość rzepki"],
   "Mechaniczne":["Trzaski/strzelanie","Blokowanie","Uciekanie kolana","Niestałość"],
   "Uraz":["Skręcenie","Uderzenie","Ból więzadeł bocznych"],
   "Alarmowe":["Uraz + brak stania","Gorący, zaczerwieniony staw + gorączka"]},
  {"Pain/swelling":["Stair pain","Post-activity effusion","Morning stiffness","Patellar tenderness"],
   "Mechanical":["Crepitus/click","Locking","Giving way","Instability"],
   "Injury":["Twist","Blow","Collateral ligament pain"],
   "Red flags":["Trauma + cannot stand","Hot red joint + fever"]});

  /* ŁYDKA */
  both('lydka',
  {"Skurcze/ból":["Nocne skurcze","Ból po wysiłku","Tkliwość uciskowa"],
   "Obrzęk":["Jednostronny obrzęk","Uczucie napięcia"],
   "Alarmowe":["Nagły obrzęk + ból (zakrzepica?)","Zaczerwienienie + ocieplenie"]},
  {"Cramps/pain":["Night cramps","Post-exercise pain","Tenderness"],
   "Swelling":["Unilateral swelling","Tightness"],
   "Red flags":["Sudden swelling + pain (DVT?)","Redness + warmth"]});

  /* KOSTKA */
  both('kostka',
  {"Ból/obrzęk":["Ból przy staniu","Obrzęk boczny","Siniak","Tkliwość kostek"],
   "Ruch":["Ból przy zgięciu","Ograniczony zakres ruchu","Niestałość"],
   "Alarmowe":["Uraz + niestabilność","Silny ból mimo odciążenia"]},
  {"Pain/swelling":["Pain when standing","Lateral swelling","Bruising","Malleolar tenderness"],
   "Motion":["Pain on flexion","Reduced ROM","Instability"],
   "Red flags":["Trauma + instability","Severe pain despite rest"]});

  /* STOPY */
  both('stopy',
  {"Ból":["Ból pięty","Kłucie przy chodzeniu","Poranny ból rozcięgna","Ból śródstopia"],
   "Skóra/paznokcie":["Odciski","Pęknięcia skóry","Wrastający paznokieć","Grzybica"],
   "Krążenie/nerwy":["Obrzęki","Zimne stopy","Drętwienie/pieczenie"],
   "Alarmowe":["Rana nie goi się","Silny ból z zaczerwienieniem","Podejrzenie zakażenia"]},
  {"Pain":["Heel pain","Stabbing on walk","Morning plantar pain","Metatarsalgia"],
   "Skin/nails":["Corns","Skin fissures","Ingrown nail","Tinea"],
   "Circulation/nerves":["Swelling","Cold feet","Numbness/burning"],
   "Red flags":["Non-healing wound","Severe painful redness","Infection suspected"]});

  /* KASZEL */
  both('kaszel',
  {"Charakter":["Suchy","Mokry","Napadowy","Nocny","Przewlekły >8 tyg"],
   "Towarzyszące":["Gorączka","Duszność","Krwioplucie","Ból w klatce"],
   "Czynniki":["Alergia","Refluks","Dym papierosowy","Leki (ACE-I)"]},
  {"Character":["Dry","Productive","Paroxysmal","Nocturnal","Chronic >8w"],
   "Accompanying":["Fever","Dyspnea","Hemoptysis","Chest pain"],
   "Factors":["Allergy","Reflux","Smoke exposure","Drugs (ACE-I)"]});

  /* GORĄCZKA */
  both('goraczka',
  {"Parametry":["≥38.0°C","Dreszcze","Zlewne poty"],
   "Towarzyszące":["Bóle mięśni/stawów","Ból głowy","Kaszel/ból gardła","Biegunka"],
   "Alarmowe":["Sztywny kark","Utrudnione oddychanie","Wysypka krwotoczna","Utrata przytomności"]},
  {"Parameters":["≥38.0°C","Chills","Profuse sweats"],
   "Accompanying":["Myalgia/arthralgia","Headache","Cough/sore throat","Diarrhea"],
   "Red flags":["Stiff neck","Breathing difficulty","Petechial rash","Loss of consciousness"]});

  /* CIĄŻA */
  both('ciaza',
  {"Typowe":["Mdłości/wymioty","Zgaga","Zmęczenie","Częste mikcje","Zawroty"],
   "Dolegliwości":["Ból krzyża","Skurcze łydek","Obrzęki pod koniec dnia","Zaparcia"],
   "Alarmowe":["Krwawienie z dróg rodnych","Silny ból brzucha","Nagłe obrzęki twarzy/dłoni","Zmniejszone ruchy płodu"]},
  {"Typical":["Nausea/vomiting","Heartburn","Fatigue","Frequent urination","Lightheadedness"],
   "Aches":["Low back pain","Calf cramps","Evening swelling","Constipation"],
   "Red flags":["Vaginal bleeding","Severe abdominal pain","Sudden face/hand swelling","Reduced fetal movements"]});

  /* STREFA INTYMNA (wspólna rama – treści specyficzne masz już per płeć w opisach) */
  both('strefa',
  {"Dolegliwości":["Świąd/pieczenie","Ból","Upławy/zapach","Ból przy mikcji","Ból przy współżyciu"],
   "Skóra/śluzówki":["Zaczerwienienie","Pęknięcia/nadżerki","Krostki/pęcherzyki","Nadżerki bolesne"],
   "Alarmowe":["Silny ból + gorączka","Szybko narastający obrzęk/zaczerwienienie","Uraz/krwawienie"]},
  {"Complaints":["Itching/burning","Pain","Discharge/odor","Dysuria","Dyspareunia"],
   "Skin/mucosa":["Redness","Fissures/erosions","Papules/blisters","Painful ulcers"],
   "Red flags":["Severe pain + fever","Rapid swelling/redness","Trauma/bleeding"]});

  // KONIEC danych – jeśli w CONTENT_* nie ma danej sekcji, jest po prostu pominięta.
})();
</script>
