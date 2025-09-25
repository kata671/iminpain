
/* Boli Help – SZCZEGÓŁY: komplet brakujących treści
   Wklej JEDEN <script src="assets/szczegoly_patch_all.js"></script> NA SAMYM KOŃCU pliku szczegoly.html
   (po wszystkich innych <script>), albo dodaj ten plik do assets/ i podłącz.
   Nie nadpisuje istniejących wpisów – tylko uzupełnia brakujące.
*/
(function(){
  // ===== Helpers =====
  function merge(target, addon){
    target = target || {};
    for (const k in addon){
      if (!(k in target)) target[k] = addon[k];
    }
    return target;
  }

  // ====== Polish content ======
  const ADD_PL = {
    glowa:{
      title:"Głowa",
      symptoms:[
        "Tępy lub pulsujący ból głowy",
        "Nadwrażliwość na światło/hałas",
        "Napięcie karku lub skroni"
      ],
      urgent:[
        "Nagły, najsilniejszy ból w życiu (piorunujący)",
        "Ból po urazie + utrata przytomności/wymioty",
        "Ból z objawami neurologicznymi (niedowład, zaburzenia mowy, drgawki)"
      ],
      causes:[
        "Migrena, napięciowy ból głowy",
        "Odwodnienie, stres, brak snu",
        "Infekcje (np. zatok)"
      ],
      firstaid:[
        "Odpoczynek w cichym, ciemnym miejscu",
        "Nawodnienie, chłodny okład na czoło/skronie",
        "Unikaj ekranów, alkoholu; rozważ delikatne rozciąganie karku"
      ],
      otc:[
        "Paracetamol 500–1000 mg co 6–8 h (max 3 g/dobę)",
        "Ibuprofen 200–400 mg co 6–8 h (max 1200 mg/d – jeśli brak przeciwwskazań)"
      ],
      rx:[
        "Silna migrena/klaster – tryptany (po kwalifikacji lekarskiej)",
        "Nawracające bóle: profilaktyka dobrana przez lekarza"
      ],
      rehab:[
        "Higiena snu, nawodnienie, zarządzanie stresem",
        "Ćwiczenia rozluźniające kark/obręcz barkową"
      ],
      myths:[
        "„Każdy silny ból głowy to guz” – zwykle nie, ale czerwone flagi wymagają pilnej oceny"
      ],
      faq:[
        "Kiedy do lekarza? — gdy ból nietypowy, narastający, z czerwonymi flagami lub częsty/nawracający."
      ]
    },

    ucho:{
      title:"Uszy",
      symptoms:[
        "Ból ucha, uczucie zatkania, spadek słuchu",
        "Szumy, czasem gorączka u dzieci"
      ],
      urgent:[
        "Silny ból z wyciekiem ropnym/krwistym po urazie",
        "Nagłe pogorszenie słuchu (zwłaszcza jednostronne)"
      ],
      causes:[
        "Zapalenie ucha środkowego/zewnętrznego",
        "Koreczek woszczynowy, barotrauma, infekcja górnych dróg oddechowych"
      ],
      firstaid:[
        "Nie wkładaj patyczków; ból łagodź paracetamolem/ibuprofenem",
        "Przy zatkaniu: krople zmiękczające woskowinę (jeśli brak perforacji)"
      ],
      otc:[
        "Paracetamol / ibuprofen przeciwbólowo",
        "Krople do ucha na woskowinę (karbamid nadtlenek)"
      ],
      rx:[
        "Antybiotyk w zapaleniu ucha środkowego (decyzja lekarska)",
        "Krople z antybiotykiem/sterydem przy zapaleniu ucha zewnętrznego"
      ],
      rehab:[
        "Nawodnienie, leczenie kataru/zatok, kontrola po leczeniu gdy ubytek słuchu"
      ],
      myths:[
        "„Patyczki czyszczą lepiej” – zwiększają ryzyko urazu i czopu"
      ],
      faq:[
        "Kiedy pilnie? — silny ból + gorączka u dziecka, wyciek, nagła głuchota, uraz."
      ]
    },

    oko:{
      title:"Oczy",
      symptoms:[
        "Ból, zaczerwienienie, łzawienie, światłowstręt",
        "Pogorszenie ostrości widzenia"
      ],
      urgent:[
        "Nagłe pogorszenie widzenia, błyski/„męty” połączone z zasłoną",
        "Ból oka po urazie/ciało obce, oparzenie chemiczne"
      ],
      causes:[
        "Zapalenie spojówek, suchość oka, ciało obce",
        "Migrena oczna, zapalenie rogówki/tęczówki (wymaga badania)"
      ],
      firstaid:[
        "Płukanie solą fizjologiczną przy podrażnieniu",
        "Zimny okład, odpoczynek od ekranów; sztuczne łzy"
      ],
      otc:[
        "Sztuczne łzy, krople przeciwalergiczne (antyhistaminowe)"
      ],
      rx:[
        "Antybiotyk/steryd do oczu – tylko po badaniu okulistycznym"
      ],
      rehab:[
        "Higiena pracy przy ekranie (20-20-20), nawilżanie powietrza"
      ],
      myths:[
        "„Każde zaczerwienienie = antybiotyk” – często to alergia/suchość"
      ],
      faq:[
        "Pilnie: uraz, chemikalia, nagłe zaburzenie widzenia, silny ból + światłowstręt."
      ]
    },

    gardlo:{
      title:"Gardło",
      symptoms:[
        "Ból gardła, chrypka, trudność w przełykaniu",
        "Gorączka lub katar (zależnie od przyczyny)"
      ],
      urgent:[
        "Duszność, ślinienie, trudność w otwieraniu ust (ropień okołomigdałkowy)",
        "Wysoka gorączka z silnym bólem i brakiem kaszlu u dzieci"
      ],
      causes:[
        "Wirusowe zapalenie gardła, angina paciorkowcowa",
        "Refluks, przeciążenie głosu, alergia"
      ],
      firstaid:[
        "Nawodnienie, pastylki nawilżające, płukanie gardła",
        "Unikaj dymu, mów mało, nawilżaj powietrze"
      ],
      otc:[
        "Paracetamol/ibuprofen, pastylki z miejscowym znieczuleniem",
        "Preparaty ziołowe na chrypkę/kaszel"
      ],
      rx:[
        "Antybiotyk przy dodatnim teście/wywiadzie na S. pyogenes"
      ],
      rehab:[
        "Higiena głosu, leczenie refluksu/alergii jeśli obecne"
      ],
      myths:[
        "„Zawsze antybiotyk” – większość infekcji gardła jest wirusowa"
      ],
      faq:[
        "Kiedy lekarz? — duszność, silny jednostronny ból, trudność przełykania, utrzymujące się objawy >7 dni."
      ]
    },

    nos:{
      title:"Nos / Zatoki",
      symptoms:[
        "Katar, niedrożność nosa, ból/ucisk zatok",
        "Osłabienie węchu, kaszel spływający z tyłu gardła"
      ],
      urgent:[
        "Silny ból twarzy z wysoką gorączką i obrzękiem oczodołu",
        "Krwotok nie do opanowania, uraz nosa z deformacją"
      ],
      causes:[
        "Infekcja wirusowa, alergia, zapalenie zatok",
        "Skrzywienie przegrody, polipy nosa"
      ],
      firstaid:[
        "Płukanie solą, inhalacje parowe, nawilżanie powietrza",
        "Krótko ksylometazolina (max 5–7 dni) na obrzęk"
      ],
      otc:[
        "Irygacje solą, leki przeciwalergiczne, NLPZ przeciwbólowo"
      ],
      rx:[
        "Antybiotyk gdy objawy bakteryjne, steroid donosowy długofalowo (laryngolog)"
      ],
      rehab:[
        "Eliminacja alergenów, terapia alergologiczna wg wskazań"
      ],
      myths:[
        "„Krople obkurczające można długo” – ryzyko polekowego nieżytu nosa"
      ],
      faq:[
        "Do lekarza: ból zatok >10 dni, wysoka gorączka, obrzęk powiek, silny jednostronny ból."
      ]
    },

    klatka:{
      title:"Klatka piersiowa",
      symptoms:[
        "Ból zamostkowy, kłucie przy oddychaniu lub kaszel",
        "Duszność, kołatanie serca"
      ],
      urgent:[
        "Ból uciskowy promieniujący do ręki/żuchwy + poty/senne mdłości",
        "Nagła duszność, sinica, krwioplucie"
      ],
      causes:[
        "Mięśniowo‑kostny, refluks, nerwobóle",
        "Zapalenie opłucnej, zawał/angina, zator płucny (pilne)"
      ],
      firstaid:[
        "Spokój, pozycja wygodna, ogranicz wysiłek",
        "Jeśli podejrzenie sercowe — wezwij pomoc (112)"
      ],
      otc:[
        "NLPZ przy bólu mięśniowo‑kostnym (jeśli brak przeciwwskazań)",
        "Leki na refluks (IPP/antacida) objawowo"
      ],
      rx:[
        "Diagnostyka kardiologiczna/pulmonologiczna wg wskazań"
      ],
      rehab:[
        "Stopniowy powrót do aktywności, fizjoterapia oddechowa przy zapaleniu"
      ],
      myths:[
        "„Każde kłucie to serce” – wiele przyczyn jest mięśniowo‑kostnych, ale czerwone flagi = pilnie"
      ],
      faq:[
        "Kiedy 112? — ból uciskowy, duszność, zawroty, bladość/poty, nagłe objawy."
      ]
    },

    brzuch:{
      title:"Brzuch",
      symptoms:[
        "Ból w nadbrzuszu/śródbrzuszu/podbrzuszu",
        "Wzdęcia, nudności, biegunka lub zaparcie"
      ],
      urgent:[
        "Twardy brzuch, silny stały ból, wymioty z krwią/czarny stolec",
        "Ból z gorączką i uogólnionym złym stanem (szczególnie u dzieci/ seniorów)"
      ],
      causes:[
        "Gastroenteritis, niestrawność, zespół jelita drażliwego",
        "Zapalenie wyrostka/woreczka, wrzód żołądka, kamica (diagnostyka!)"
      ],
      firstaid:[
        "Nawadnianie, dieta lekkostrawna, obserwacja objawów",
        "Ciepły okład na kolki (jeśli brak gorączki)"
      ],
      otc:[
        "Elektrolity, simetikon, loperamid/rifaksymina (wg wskazań), IPP/antacida"
      ],
      rx:[
        "Antybiotyk/lek przeciwpasożytniczy tylko na wskazania",
        "Leki rozkurczowe na receptę – wg diagnozy"
      ],
      rehab:[
        "Regularne posiłki, błonnik/woda, aktywność fizyczna"
      ],
      myths:[
        "„Zawsze węgiel” – czasem nasila zaparcia; stosuj zgodnie ze wskazaniami"
      ],
      faq:[
        "Pilnie: silny stały ból, gorączka, krwawienie, odwodnienie, twardy brzuch."
      ]
    },

    biodra:{
      title:"Biodra / Miednica / Uda (górna część)",
      symptoms:[
        "Ból pachwiny/biodra, ograniczenie ruchu",
        "Ból przy obciążeniu lub po urazie"
      ],
      urgent:[
        "Uraz z niemożnością obciążenia kończyny",
        "Gorączka i silny ból stawu (podejrzenie infekcji)"
      ],
      causes:[
        "Przeciążenie, zapalenie kaletki, zmiany zwyrodnieniowe",
        "Uraz, naderwanie przywodzicieli, rwa udowa"
      ],
      firstaid:[
        "Odpoczynek, okłady zimne 24–48 h po urazie, uniesienie",
        "Delikatne rozciąganie po ustąpieniu ostrej fazy"
      ],
      otc:[
        "NLPZ miejscowo/doustnie (jeśli brak przeciwwskazań)"
      ],
      rx:[
        "Fizjoterapia, zastrzyki dostawowe, diagnostyka obrazowa"
      ],
      rehab:[
        "Wzmacnianie pośladków/rdzenia, stopniowy powrót do biegania"
      ],
      myths:[
        "„Rozchodzi się” – przy urazie może pogarszać"
      ],
      faq:[
        "Lekarz? — ból >2–3 tyg., nawracający, uraz, gorączka, ograniczenie ruchu."
      ]
    },

    kolano:{
      title:"Kolano",
      symptoms:[
        "Ból przy schodzeniu/kucaniu, obrzęk, trzaski",
        "Uczucie niestabilności"
      ],
      urgent:[
        "Uraz z blokowaniem stawu, duży obrzęk, niemożność obciążenia",
        "Gorączka + bolesne, zaczerwienione kolano (infekcja)"
      ],
      causes:[
        "Przeciążeniowe (ITBS, rzepkowo‑udowe), łąkotka, więzadła",
        "Zwyrodnienie, dna moczanowa, infekcyjne zapalenie stawu"
      ],
      firstaid:[
        "RICE: odpoczynek, lód, ucisk, uniesienie",
        "Orteza/taśmy wg zaleceń, odciążenie"
      ],
      otc:[
        "NLPZ miejscowo/doustnie (jeśli brak przeciwwskazań)"
      ],
      rx:[
        "Fizjoterapia, punkcja, ewentualnie leczenie operacyjne"
      ],
      rehab:[
        "Wzmacnianie czworogłowego/pośladków, mobilizacja rzepki"
      ],
      myths:[
        "„Strzelanie niszczy stawy” – nie zawsze ma znaczenie patologiczne"
      ],
      faq:[
        "Lekarz? — uraz/obrzęk, niestabilność, gorączka, ból >2–3 tyg."
      ]
    },

    udo:{
      title:"Udo",
      symptoms:[
        "Ból mięśniowy z przodu/tyłu/po boku uda",
        "Napięcie po wysiłku, zasinienie po naderwaniu"
      ],
      urgent:[
        "Uraz z wyraźnym osłabieniem siły, duży krwiak",
        "Ból łydki + obrzęk (podejrzenie zakrzepicy)"
      ],
      causes:[
        "Przeciążenie mięśni (czworogłowy, dwugłowy), rwa kulszowa",
        "Naderwanie, zespół pasma biodrowo‑piszczelowego"
      ],
      firstaid:[
        "Chłodzenie 24–48 h, odpoczynek, elastyczny ucisk",
        "Stopniowy powrót do aktywności"
      ],
      otc:[
        "NLPZ miejscowo, magnez przy skurczach (jeśli niedobór)"
      ],
      rx:[
        "Fizjoterapia, USG przy podejrzeniu naderwania"
      ],
      rehab:[
        "Mobilizacja, wzmacnianie ekscentryczne, rozciąganie"
      ],
      myths:[
        "„Ból = brak formy” – bywa skutkiem błędów treningowych"
      ],
      faq:[
        "Do lekarza: duży krwiak/słabość, brak poprawy >2 tyg."
      ]
    },

    stopy:{
      title:"Stopy",
      symptoms:[
        "Ból pięty/śródstopia, poranny ból rozcięgna",
        "Obrzęk, odciski, drętwienie"
      ],
      urgent:[
        "Uraz z niemożnością chodu, deformacja",
        "Silne zaczerwienienie/ropień z gorączką"
      ],
      causes:[
        "Zapalenie rozcięgna, metatarsalgia, neuroma Mortona",
        "Płaskostopie, zła biomechanika, obuwie"
      ],
      firstaid:[
        "Chłodzenie, odciążenie, wkładki, rozciąganie łydki/rozcięgna"
      ],
      otc:[
        "NLPZ miejscowo, silikonowe podpiętki"
      ],
      rx:[
        "Fizjoterapia, iniekcje, rzadziej zabieg"
      ],
      rehab:[
        "Ćwiczenia krótkich mięśni stopy, rolowanie"
      ],
      myths:[
        "„Zawsze miękkie buty” – stabilność też ważna"
      ],
      faq:[
        "Lekarz? — uraz, brak poprawy >4–6 tyg., nasilona deformacja/ból."
      ]
    },

    ciaza:{
      title:"Ciąża (objawy i dolegliwości)",
      symptoms:[
        "Nudności/wymioty (I trymestr), zmęczenie",
        "Bóle krzyża/miednicy, obrzęki w późniejszym etapie"
      ],
      urgent:[
        "Krwawienie z dróg rodnych, silny ból brzucha",
        "Bóle głowy + zaburzenia widzenia/obrzęki (podejrzenie stanu przedrzucawkowego)",
        "Zmniejszone ruchy płodu"
      ],
      causes:[
        "Fizjologiczne zmiany hormonalne i biomechaniczne",
        "Infekcje układu moczowego, niedokrwistość, inne choroby współistniejące"
      ],
      firstaid:[
        "Nawodnienie, małe częste posiłki, imbir na nudności (po konsultacji)",
        "Ergonomia, pasy podtrzymujące miednicę, delikatna aktywność"
      ],
      otc:[
        "Paracetamol przeciwbólowo (preferowany w ciąży)",
        "Unikaj ibuprofenu/NLPZ (zwłaszcza w III trymestrze)"
      ],
      rx:[
        "Leczenie prowadzi lekarz prowadzący (bez samoleczenia RX)"
      ],
      rehab:[
        "Ćwiczenia dna miednicy, spacer/pływanie, fizjoterapia uroginekologiczna"
      ],
      myths:[
        "„W ciąży nie wolno ćwiczyć” – umiarkowana aktywność zwykle zalecana"
      ],
      faq:[
        "Kiedy pilnie? — krwawienie, silny ból, brak ruchów płodu, objawy stanu przedrzucawkowego."
      ]
    },

    nerki:{
      title:"Nerki / Lędźwie",
      symptoms:[
        "Ból lędźwi jednostronny, kolka nerkowa",
        "Częstomocz, pieczenie przy mikcji, gorączka"
      ],
      urgent:[
        "Silna kolka + gorączka/dreszcze (podejrzenie odmiedniczkowego zapalenia nerek)",
        "Brak oddawania moczu, krwiomocz z bólem"
      ],
      causes:[
        "ZUM, kamica nerkowa, napięciowy ból mięśni pleców",
        "Rzadziej: choroby nerek wymagające nefrologa"
      ],
      firstaid:[
        "Nawodnienie, ciepło na okolicę lędźwi",
        "Unikaj wstrzymywania moczu; probiotyki przy skłonnościach do ZUM"
      ],
      otc:[
        "Paracetamol przeciwbólowo (NLPZ ostrożnie)",
        "Preparaty żurawinowe (profilaktyka)"
      ],
      rx:[
        "Antybiotyk przy ZUM, leki rozkurczowe/przeciwbólowe w kolce"
      ],
      rehab:[
        "Core‑stability, ergonomia dźwigania, przerwy w siedzeniu"
      ],
      myths:[
        "„Zawsze nerki, gdy boli lędźwie” – częściej mięśnie/kręgosłup"
      ],
      faq:[
        "Lekarz? — gorączka, silny ból, krwiomocz, zaburzenia mikcji."
      ]
    },

    watroba:{
      title:"Wątroba (okolica prawego podżebrza)",
      symptoms:[
        "Uczucie dyskomfortu/prawego podżebrza",
        "Zmęczenie, nudności (nieswoiste)"
      ],
      urgent:[
        "Silny ból z żółtaczką/ciemnym moczem, gorączka",
        "Uraz brzucha z bólem w prawym podżebrzu"
      ],
      causes:[
        "Stłuszczenie wątroby, zapalenie wątroby",
        "Bóle pochodzenia żółciowego (pęcherzyk)"
      ],
      firstaid:[
        "Unikaj alkoholu, ciężkostrawnych potraw",
        "Nawodnienie, obserwacja objawów"
      ],
      otc:[
        "Brak specyficznych; ostrożnie z lekami obciążającymi wątrobę"
      ],
      rx:[
        "Diagnostyka (enzymy wątrobowe, USG) wg lekarza"
      ],
      rehab:[
        "Redukcja masy ciała, aktywność, dieta śródziemnomorska"
      ],
      myths:[
        "„Zioła zawsze bezpieczne dla wątroby” – niektóre są hepatotoksyczne"
      ],
      faq:[
        "Do lekarza: żółtaczka, ból z gorączką, objawy ogólne."
      ]
    },

    serce:{
      title:"Serce",
      symptoms:[
        "Ucisk w klatce, duszność, kołatania",
        "Męczliwość, obrzęki kostek"
      ],
      urgent:[
        "Ucisk zamostkowy promieniujący, zimne poty, mdłości (zawał)",
        "Nagłe kołatania z zawrotami/utrata przytomności"
      ],
      causes:[
        "Choroba wieńcowa, arytmie, nadciśnienie",
        "Lęk/panika (diagnoza różnicowa)"
      ],
      firstaid:[
        "Ogranicz wysiłek, usiądź; jeśli zawał podejrzany – 112",
        "Znane zalecenia kardiologa realizuj zgodnie z planem"
      ],
      otc:[
        "Brak uniwersalnych; ostrożnie z NLPZ u kardiologicznych"
      ],
      rx:[
        "Leczenie kardiologiczne według rozpoznania"
      ],
      rehab:[
        "Rehabilitacja kardiologiczna, stopniowe obciążenia"
      ],
      myths:[
        "„Młodych nie dotyczy” – czynniki ryzyka mają znaczenie w każdym wieku"
      ],
      faq:[
        "Pilnie: typowy ból sercowy, nagła duszność, omdlenia/kołatania."
      ]
    },

    pluca:{
      title:"Płuca / Oddychanie",
      symptoms:[
        "Kaszel, świszczący oddech, duszność",
        "Ból przy głębokim wdechu"
      ],
      urgent:[
        "Nagła duszność/spadek saturacji, sinica",
        "Krwioplucie, ból opłucnowy po unieruchomieniu (zator)"
      ],
      causes:[
        "Infekcje, astma/POChP, alergie",
        "Zatorowość płucna, odma – wymagają pilnej diagnostyki"
      ],
      firstaid:[
        "Odpoczynek, nawodnienie; kontrola temperatury",
        "Inhalacje sól hipertoniczna/para przy gęstej wydzielinie"
      ],
      otc:[
        "Leki wykrztuśne/przeciwkaszlowe zależnie od kaszlu"
      ],
      rx:[
        "Leki rozszerzające oskrzela/sterydy wziewne (astma – lekarz)",
        "Antybiotyk w bakteryjnych zapaleniach"
      ],
      rehab:[
        "Ćwiczenia oddechowe, spacerowanie według tolerancji"
      ],
      myths:[
        "„Antybiotyk na każdy kaszel” – większość infekcji wirusowa"
      ],
      faq:[
        "Kiedy lekarz? — duszność, krwioplucie, wysoka gorączka, brak poprawy."
      ]
    },

    zoladek:{
      title:"Żołądek (dyspepsja)",
      symptoms:[
        "Uczucie pełności, pieczenie za mostkiem, odbijania",
        "Mdłości po posiłkach"
      ],
      urgent:[
        "Smoliste stolce/krwiste wymioty",
        "Utrata masy ciała, anemia, nocne bóle – szczególnie po 45 r.ż."
      ],
      causes:[
        "Refluks, zapalenie błony śluzowej, H. pylori",
        "Niesteroidowe leki przeciwzapalne, stres"
      ],
      firstaid:[
        "Mniejsze posiłki, unikanie późnych kolacji, uniesienie wezgłowia",
        "Ogranicz kofeinę/alkohol/tłuste potrawy"
      ],
      otc:[
        "Antacida, IPP krótkoterminowo (test‑&‑treat wg zaleceń)"
      ],
      rx:[
        "Eradykacja H. pylori (po dodatnim teście), dłuższa terapia IPP wg lekarza"
      ],
      rehab:[
        "Dieta lekkostrawna, redukcja masy ciała, aktywność"
      ],
      myths:[
        "„Zgaga = zawsze IPP na stałe” – dążyć do najniższej skutecznej dawki"
      ],
      faq:[
        "Lekarz? — czerwone flagi, brak poprawy mimo leczenia objawowego."
      ]
    }
  };

  // ====== English content (short mirror) ======
  const ADD_EN = {
    glowa:{ title:"Head", symptoms:["Headache","Photophobia/phonophobia"], urgent:["Worst headache ever","Post‑trauma with neuro signs"], causes:["Migraine","Tension","Sinus"], firstaid:["Rest, hydrate, cool pack"], otc:["Paracetamol / Ibuprofen"], rx:["Triptans (doctor)"], rehab:["Sleep hygiene"], myths:["Not every headache is a tumor"], faq:["See doctor if red flags."] },
    ucho:{ title:"Ear", symptoms:["Ear pain, blockage"], urgent:["Discharge after trauma","Sudden hearing loss"], causes:["Otitis, wax plug"], firstaid:["Do not use cotton buds"], otc:["Paracetamol; wax‑softening drops"], rx:["Antibiotics if indicated"], rehab:["Treat rhinitis/sinus"], myths:["Cotton buds are not safe"], faq:["Urgent if severe pain, fever, discharge."] },
    oko:{ title:"Eye", symptoms:["Pain, redness","Blurred vision"], urgent:["Sudden vision loss","Chemical injury"], causes:["Conjunctivitis, dry eye"], firstaid:["Rinse with saline"], otc:["Artificial tears"], rx:["Antibiotic/steroid by ophthalmologist"], rehab:["20‑20‑20 rule"], myths:["Redness ≠ always antibiotics"], faq:["Urgent for trauma or sudden loss."] },
    gardlo:{ title:"Throat", symptoms:["Sore throat, hoarseness"], urgent:["Drooling, trismus, dyspnea"], causes:["Viral pharyngitis, strep"], firstaid:["Fluids, lozenges"], otc:["Paracetamol/ibuprofen"], rx:["Antibiotic if strep"], rehab:["Voice hygiene"], myths:["Antibiotics not always needed"], faq:["See doctor if severe/unusual."] },
    nos:{ title:"Nose/Sinuses", symptoms:["Congestion, pain"], urgent:["Periorbital swelling","Uncontrolled epistaxis"], causes:["Viral, allergy, sinusitis"], firstaid:["Saline rinses"], otc:["Decongestants short‑term"], rx:["Antibiotics if bacterial"], rehab:["Allergen control"], myths:["Decongestants long‑term are harmful"], faq:[">10 days or fever → doctor."] },
    klatka:{ title:"Chest", symptoms:["Chest pain, dyspnea"], urgent:["Crushing pain with sweat","Sudden breathlessness"], causes:["MSK, reflux, pleurisy"], firstaid:["Rest, limit effort"], otc:["NSAIDs for MSK"], rx:["Cardio work‑up"], rehab:["Gradual activity"], myths:["Every pain is cardiac"], faq:["Call EMS for red flags."] },
    brzuch:{ title:"Abdomen", symptoms:["Abdominal pain","N/V, diarrhea/constipation"], urgent:["Rigid abdomen, blood"], causes:["Gastroenteritis, IBS"], firstaid:["Hydration, light diet"], otc:["Electrolytes, simethicone"], rx:["As indicated"], rehab:["Fiber, water"], myths:["Charcoal not always ideal"], faq:["Urgent if severe pain/fever."] },
    biodra:{ title:"Hips/Groin", symptoms:["Groin pain","Limited ROM"], urgent:["Unable to weight‑bear"], causes:["Overuse, bursitis"], firstaid:["Rest, ice"], otc:["Topical NSAIDs"], rx:["Physio, imaging"], rehab:["Glute/core work"], myths:["It will ‚walk off’"], faq:["Doctor if persistent/fever."] },
    kolano:{ title:"Knee", symptoms:["Pain, swelling","Instability"], urgent:["Locked knee, large effusion"], causes:["Meniscus/ligaments"], firstaid:["RICE"], otc:["NSAIDs"], rx:["Physio, surgery if needed"], rehab:["Quad/glute strength"], myths:["Popping always bad – not"], faq:["Doctor if injury/fever."] },
    udo:{ title:"Thigh", symptoms:["Muscle pain","Bruising"], urgent:["Large hematoma"], causes:["Strain/tear"], firstaid:["Ice, rest"], otc:["Topical NSAIDs"], rx:["US + physio"], rehab:["Eccentric work"], myths:["Pain = unfit"], faq:["No improvement → doctor."] },
    stopy:{ title:"Feet", symptoms:["Heel/metatarsal pain"], urgent:["Deformity/abscess"], causes:["Plantar fasciitis"], firstaid:["Unload, stretch"], otc:["Topical NSAIDs, pads"], rx:["Physio/injections"], rehab:["Foot muscles"], myths:["Softer shoe always better"], faq:["Doctor if injury/no improvement."] },
    ciaza:{ title:"Pregnancy", symptoms:["Nausea, fatigue","Back/pelvic pain"], urgent:["Bleeding, severe headache with visual changes"], causes:["Physiologic changes"], firstaid:["Hydration, small meals"], otc:["Paracetamol"], rx:["By obstetrician"], rehab:["Pelvic floor"], myths:["No exercise allowed – false"], faq:["Red flags → urgent care."] },
    nerki:{ title:"Kidneys/Flanks", symptoms:["Flank pain","Dysuria"], urgent:["Fever + colic"], causes:["UTI, stones"], firstaid:["Fluids, warmth"], otc:["Paracetamol"], rx:["Antibiotics if UTI"], rehab:["Ergonomics, core"], myths:["Flank pain = kidneys"], faq:["Doctor for fever/blood."] },
    watroba:{ title:"Liver area", symptoms:["RUQ discomfort"], urgent:["Pain + jaundice"], causes:["Fatty liver, hepatitis"], firstaid:["Avoid alcohol"], otc:["—"], rx:["Work‑up by doctor"], rehab:["Weight/diet"], myths:["Herbs always safe"], faq:["Doctor if jaundice."] },
    serce:{ title:"Heart", symptoms:["Chest pressure","Palpitations"], urgent:["Typical MI signs"], causes:["CAD, arrhythmia"], firstaid:["Rest, call EMS"], otc:["—"], rx:["Cardiology"], rehab:["Cardiac rehab"], myths:["Young safe – false"], faq:["Red flags → EMS."] },
    pluca:{ title:"Lungs/Breathing", symptoms:["Cough, wheeze"], urgent:["Sudden dyspnea"], causes:["Infection, asthma"], firstaid:["Hydration, inhalations"], otc:["Expectorants/antitussives"], rx:["Bronchodilators/antibiotics"], rehab:["Breathing exercises"], myths:["Antibiotics for all coughs"], faq:["Doctor if severe/lasting."] },
    zoladek:{ title:"Stomach/dyspepsia", symptoms:["Fullness, heartburn"], urgent:["Melena/hematemesis"], causes:["GERD, H. pylori"], firstaid:["Small meals, head elevation"], otc:["Antacids, PPI short"], rx:["H. pylori eradication"], rehab:["Mediterranean diet"], myths:["PPI forever – no"], faq:["Doctor for red flags."] }
  };

  // ====== Aliases (routing) ======
  const ADD_ALIASES = {
    uszy: "ucho",
    oczy: "oko",
    gardlo: "gardlo",
    glowa: "glowa",
    klatka: "klatka",
    brzuch: "brzuch",
    biodro: "biodra",
    biodra: "biodra",
    kolano: "kolano",
    udo: "udo",
    stopy: "stopy",
    serce: "serce",
    pluca: "pluca",
    nerki: "nerki",
    watroba: "watroba",
    zoladek: "zoladek",
    ciaza: "ciaza"
  };

  // ====== Merge in global ======
  window.CONTENT_PL = merge(window.CONTENT_PL, ADD_PL);
  window.CONTENT_EN = merge(window.CONTENT_EN, ADD_EN);
  window.PART_ALIASES = merge(window.PART_ALIASES, ADD_ALIASES);

  // Opcjonalnie: wyłącz niebezpieczny fallback na „glowa” jeśli był gdzieś w kodzie
  if (!window.resolvePartSafe){
    window.resolvePartSafe = function(id){
      id = (id||"").toLowerCase();
      if (window.PART_ALIASES && window.PART_ALIASES[id]) id = window.PART_ALIASES[id];
      const dict = (document.documentElement.lang || "pl").startsWith("en") ? window.CONTENT_EN : window.CONTENT_PL;
      return dict[id] ? id : null; // null zamiast mylnej „glowa”
    };
  }
})();
