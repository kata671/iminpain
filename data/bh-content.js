/**
 * Boli Help — ujednolicona baza treści szczegółów (PL)
 * Klucze = parametr ?czesc= z kobieta.html / mezczyzna.html / dziecko.html
 * Schemat karty:
 *   label, symptoms[], causes[], firstaid[], otc[{t,audience}], rx[], rehab[],
 *   urgent[], myths[{m,f}], faq[{q,a}]
 * audience: "all" | "adult" | "child"
 * To NIE jest diagnoza — treść edukacyjna / pierwsza pomoc.
 */
(function (global) {
  "use strict";

  const DISCLAIMER =
    "Treści mają charakter edukacyjny i nie zastępują konsultacji lekarskiej. W razie objawów alarmowych dzwoń 112.";

  /** @type {Record<string, object>} */
  const CONTENT_PL = {
    glowa: {
      label: "Głowa (ból)",
      symptoms: [
        "Ucisk obustronny lub opaska wokół głowy",
        "Pulsujący ból jednostronny",
        "Nadwrażliwość na światło lub dźwięk",
        "Nudności, wymioty",
        "Aura (mroczki, błyski, zygzaki)",
        "Ból nasilający się przy wysiłku lub kaszlu",
        "Sztywność karku, gorączka"
      ],
      causes: [
        "Ból napięciowy (stres, brak snu, odwodnienie)",
        "Migrena (z aurą lub bez)",
        "Ból zatokowy (infekcja, alergia)",
        "Odwodnienie lub odstawienie kofeiny",
        "Nadciśnienie tętnicze",
        "Napięcie mięśni karku / bruksizm",
        "Ból polekowy przy nadużywaniu środków przeciwbólowych"
      ],
      firstaid: [
        "Nawodnij się, zjedz lekki posiłek",
        "Odpoczynek w cichym, przyciemnionym pomieszczeniu",
        "Chłodny okład na czoło lub kark",
        "Rozluźnij barki i kark (delikatne ruchy)",
        "Unikaj ekranów i intensywnego światła"
      ],
      otc: [
        { t: "Paracetamol — doraźnie, zgodnie z ulotką", audience: "all" },
        { t: "Ibuprofen — dorośli, jeśli brak przeciwwskazań", audience: "adult" },
        { t: "Preparaty złożone z kofeiną — tylko epizodycznie u dorosłych", audience: "adult" }
      ],
      rx: [
        "Tryptany w migrenie — wyłącznie po konsultacji",
        "Profilaktyka migreny — decyzja neurologa",
        "Leczenie nadciśnienia według zaleceń lekarza"
      ],
      rehab: [
        "Sen 7–9 h, stałe pory wstawania",
        "Nawodnienie ok. 30–35 ml/kg masy ciała",
        "Regularne przerwy od ekranu",
        "Dzienniczek bólów głowy (wyzwalacze)"
      ],
      urgent: [
        "Nagły, najsilniejszy w życiu ból głowy",
        "Gorączka + sztywność karku",
        "Niedowład, zaburzenia mowy, drgawki, utrata przytomności",
        "Uraz głowy z utratą przytomności",
        "Nowy silny ból w ciąży lub połogu"
      ],
      myths: [
        { m: "Migrena to zwykły ból głowy", f: "Migrena to choroba neurologiczna — wymaga właściwego postępowania." },
        { m: "Im więcej tabletek, tym lepiej", f: "Nadużywanie leków przeciwbólowych może nasilać bóle głowy." }
      ],
      faq: [
        { q: "Kiedy do lekarza?", a: "Gdy bóle są nowe, narastające, po urazie lub z objawami neurologicznymi — pilnie." },
        { q: "Czy to zawsze zatoki?", a: "Nie. Ból zatokowy zwykle łączy się z katarem, uciskiem twarzy, często infekcją." }
      ]
    },

    oko: {
      label: "Oko",
      symptoms: [
        "Pieczenie, swędzenie, uczucie piasku",
        "Zaczerwienienie, łzawienie lub suchość",
        "Pogorszenie ostrości widzenia",
        "Światłowstręt, ból przy ruchu oka",
        "Wydzielina, sklejone powieki",
        "Ból po urazie lub kontakcie z chemikaliami"
      ],
      causes: [
        "Zespół suchego oka (ekrany, klimatyzacja)",
        "Zapalenie spojówek (wirusowe, bakteryjne, alergiczne)",
        "Alergia, drażniące kosmetyki",
        "Ciało obce, uraz, oparzenie chemiczne",
        "Migrena oczna / światłowstręt",
        "Jaskra ostra (rzadko, ale pilne)"
      ],
      firstaid: [
        "Nie pocieraj oka",
        "Przemyj solą fizjologiczną (sterylna)",
        "Zdejmij soczewki kontaktowe",
        "Chłodny okład na zamkniętą powiekę przy podrażnieniu",
        "Przy chemikaliach: intensywne płukanie i natychmiast 112 / SOR"
      ],
      otc: [
        { t: "Sztuczne łzy bez konserwantów", audience: "all" },
        { t: "Krople przeciwhistaminowe przy alergii (wg ulotki)", audience: "adult" }
      ],
      rx: [
        "Antybiotyk w kroplach — tylko po zleceniu lekarza",
        "Sterydy do oka — wyłącznie pod kontrolą okulisty"
      ],
      rehab: [
        "Reguła 20-20-20 przy pracy przy ekranie",
        "Nawilżanie powietrza",
        "Higiena powiek przy nawracających zapaleniach brzegów powiek"
      ],
      urgent: [
        "Nagła utrata lub silne pogorszenie widzenia",
        "Silny ból oka, nudności (możliwa jaskra ostra)",
        "Uraz, chemikalia, zasłona/błyski z ubytkiem widzenia"
      ],
      myths: [
        { m: "Antybiotyk „na wszelki wypadek”", f: "Większość zapaleń spojówek jest wirusowa — antybiotyk nie pomaga i szkodzi." }
      ],
      faq: [
        { q: "Soczewki przy czerwonym oku?", a: "Odstaw do czasu ustąpienia objawów i konsultacji." }
      ]
    },

    uszy: {
      label: "Uszy",
      symptoms: [
        "Ból ucha (ostry lub tępy)",
        "Niedosłuch, uczucie zatkania",
        "Szumy, trzaski",
        "Wydzielina z ucha",
        "Ból przy przełykaniu, gorączka",
        "Ból po locie / nurkowaniu"
      ],
      causes: [
        "Zapalenie ucha środkowego lub zewnętrznego",
        "Woskowina",
        "Infekcja górnych dróg oddechowych, dysfunkcja trąbki słuchowej",
        "Uraz ciśnieniowy (samolot, nurek)",
        "Ból rzutowany z zębów / stawu skroniowo-żuchwowego"
      ],
      firstaid: [
        "Nie wkładaj patyczków ani przedmiotów do kanału",
        "Przy bólu: ciepły (nie gorący) okład na małżowinę",
        "Unikaj moczenia ucha przy podejrzeniu zapalenia zewnętrznego",
        "Przy silnym bólu i gorączce — kontakt z lekarzem"
      ],
      otc: [
        { t: "Paracetamol lub ibuprofen (dorośli) — doraźnie", audience: "adult" },
        { t: "Paracetamol w dawce dostosowanej do masy ciała u dzieci — wg ulotki/lekarza", audience: "child" }
      ],
      rx: [
        "Antybiotyk — tylko gdy lekarz uzna bakteryjne zapalenie",
        "Krople do uszu — według zaleceń (nie przy podejrzeniu perforacji bez oceny)"
      ],
      rehab: [
        "Ochrona uszu przed wodą przy pływaniu (gdy nawroty)",
        "Unikanie czyszczenia patyczkami"
      ],
      urgent: [
        "Nagła głuchota",
        "Silny ból z obrzękiem, gorączką, sztywnością karku",
        "Uraz, krwawienie z ucha po uderzeniu głowy"
      ],
      myths: [
        { m: "Oliwa zawsze pomaga na ból ucha", f: "Przy perforacji lub infekcji może zaszkodzić — najpierw ocena." }
      ],
      faq: [
        { q: "Kiedy do laryngologa?", a: "Ból > 2–3 dni, wydzielina, niedosłuch, nawroty, objawy po urazie." }
      ]
    },

    nos: {
      label: "Nos / zatoki",
      symptoms: [
        "Zatkany nos, katar",
        "Ucisk / ból w twarzy, czole, zębach górnych",
        "Kichanie, świąd",
        "Spływanie wydzieliny po tylnej ścianie gardła",
        "Osłabienie węchu",
        "Krwawienie z nosa"
      ],
      causes: [
        "Przeziębienie, infekcja wirusowa",
        "Alergiczny nieżyt nosa",
        "Zapalenie zatok",
        "Podrażnienie (dym, chemia, suche powietrze)",
        "Uraz nosa"
      ],
      firstaid: [
        "Nawilżanie: sól fizjologiczna / woda morska",
        "Uniesienie wezgłowia przy spaniu",
        "Przy krwawieniu: pochyl głowę do przodu, uciskaj skrzydełka nosa 10–15 min",
        "Unikaj wysilonego dmuchania nosa"
      ],
      otc: [
        { t: "Aerozol soli morskiej / soli fizjologicznej", audience: "all" },
        { t: "Leki przeciwhistaminowe przy alergii (wg ulotki)", audience: "adult" },
        { t: "Krótko działające krople obkurczające — max kilka dni u dorosłych", audience: "adult" }
      ],
      rx: [
        "Steryd donosowy — często w alergicznym nieżycie / zapaleniu zatok",
        "Antybiotyk — rzadko, tylko przy wskazaniach bakteryjnych"
      ],
      rehab: [
        "Nawilżanie powietrza",
        "Unikanie dymu i alergenów",
        "Nie stosuj kropli obkurczających dłużej niż zaleca ulotka"
      ],
      urgent: [
        "Krwawienie nie do opanowania",
        "Silny ból twarzy z obrzękiem, wysoką gorączką, zaburzeniami widzenia",
        "Uraz z deformacją lub silnym krwawieniem"
      ],
      myths: [
        { m: "Antybiotyk na każdy katar", f: "Większość infekcji jest wirusowa — antybiotyk nie skraca przeziębienia." }
      ],
      faq: [
        { q: "Kiedy zapalenie zatok?", a: "Objawy > 10 dni, narastający ból twarzy, ropna wydzielina, gorączka — ocena lekarska." }
      ]
    },

    zeby: {
      label: "Zęby / szczęka",
      symptoms: [
        "Ból zęba samoistny lub na zimno/ciepło/nacisk",
        "Obrzęk dziąsła lub twarzy",
        "Wrażliwość przy gryzieniu",
        "Uraz, ukruszenie, wybicia zęba",
        "Ból promieniujący do ucha / skroni"
      ],
      causes: [
        "Próchnica, zapalenie miazgi",
        "Ropień zębopochodny",
        "Zapalenie dziąseł / przyzębia",
        "Ząb mądrości, uraz",
        "Bruksizm, dolegliwości stawu skroniowo-żuchwowego"
      ],
      firstaid: [
        "Płucz ciepłą solą fizjologiczną (nie gorącą)",
        "Zimny okład na policzek od zewnątrz (nie na ząb bezpośrednio długo)",
        "Przy wybiciu zęba stałego: trzymaj za koronę, mleko/ślina, jak najszybciej dentysta",
        "Nie kładź aspiryny na dziąsło"
      ],
      otc: [
        { t: "Ibuprofen lub paracetamol — doraźnie u dorosłych wg ulotki", audience: "adult" },
        { t: "Żele na ząbkowanie u niemowląt — tylko produkty przeznaczone do tego", audience: "child" }
      ],
      rx: [
        "Leczenie kanałowe / antybiotyk — decyzja dentysty",
        "Drenaż ropnia — gabinet stomatologiczny / SOR stomatologiczny"
      ],
      rehab: [
        "Higiena: nitkowanie, szczotkowanie 2× dziennie",
        "Kontrole stomatologiczne",
        "Szyna relaksacyjna przy bruksizmie — po konsultacji"
      ],
      urgent: [
        "Silny obrzęk twarzy/szyi, trudności w przełykaniu lub oddychaniu",
        "Wysoka gorączka z ropniem",
        "Uraz z wybiciem zęba, złamaniem szczęki"
      ],
      myths: [
        { m: "Antybiotyk wyleczy ból zęba bez dentysty", f: "Źródło (próchnica/ropień) wymaga leczenia miejscowego." }
      ],
      faq: [
        { q: "Dentysta w nocy?", a: "Dyżury stomatologiczne / SOR — przy silnym bólu, obrzęku, urazie." }
      ]
    },

    gardlo: {
      label: "Gardło",
      symptoms: [
        "Ból przy przełykaniu",
        "Drapanie, chrypka",
        "Powiększone węzły szyjne",
        "Gorączka, osłabienie",
        "Biały nalot, naloty na migdałkach",
        "Ślinotok, trudność w otwarciu ust (pilne)"
      ],
      causes: [
        "Infekcja wirusowa (najczęściej)",
        "Angina bakteryjna (paciorkowcowa)",
        "Podrażnienie (suche powietrze, krzyk, reflux)",
        "Alergia",
        "Ropień okołomigdałkowy (powikłanie)"
      ],
      firstaid: [
        "Nawodnienie, letnie płukanki solą fizjologiczną",
        "Miód u osób > 1. r.ż. (nie dla niemowląt)",
        "Nawilżanie powietrza, odpoczynek głosu",
        "Unikaj dymu i mocno drażniących pokarmów"
      ],
      otc: [
        { t: "Pastylki/środki miejscowe łagodzące — wg ulotki", audience: "all" },
        { t: "Paracetamol przy gorączce/bólu", audience: "all" }
      ],
      rx: [
        "Antybiotyk — tylko przy potwierdzonej lub silnie podejrzewanej etologii bakteryjnej"
      ],
      rehab: [
        "Higiena rąk, nie dziel się sztućcami przy infekcji",
        "Odstawienie palenia"
      ],
      urgent: [
        "Duszność, ślinotok, niemożność przełykania śliny",
        "Silny jednostronny ból, szczękościsk, „gorący kartofel” w mowie",
        "Wysoka gorączka z pogorszeniem stanu ogólnego u dziecka"
      ],
      myths: [
        { m: "Każdy ból gardła = antybiotyk", f: "Większość to wirusy; antybiotyk nie pomaga i generuje oporność." }
      ],
      faq: [
        { q: "Test na streptokoki?", a: "Lekarz może wykonać szybki test / wymaz przy podejrzeniu anginy." }
      ]
    },

    szyja: {
      label: "Szyja / kark",
      symptoms: [
        "Sztywność karku, ból przy ruchu",
        "Ból promieniujący do barku / łopatki",
        "Ból po snu w niewłaściwej pozycji",
        "Mrowienie ręki",
        "Ból z gorączką lub po urazie"
      ],
      causes: [
        "Napięcie mięśniowe, przeciążenie",
        "Kręcz szyi",
        "Dyskopatia szyjna",
        "Infekcja (rzadziej — wymaga pilnej oceny)",
        "Uraz (whiplash)"
      ],
      firstaid: [
        "Unikaj forsownych rotacji „na siłę”",
        "Ciepły okład przy bólu napięciowym (bez urazu/infekcji)",
        "Krótkotrwała pozycja wygodna, nie unieruchamiaj na dni",
        "Po urazie: stabilizacja, ocena medyczna"
      ],
      otc: [
        { t: "Paracetamol / ibuprofen u dorosłych wg ulotki", audience: "adult" }
      ],
      rx: [
        "Fizjoterapia, leki na zlecenie lekarza przy radikulopatii"
      ],
      rehab: [
        "Ergonomia biurka i monitora",
        "Ćwiczenia mobilności i wzmocnienia pod okiem fizjoterapeuty"
      ],
      urgent: [
        "Sztywność karku + gorączka + silny ból głowy",
        "Narastające niedowłady, zaburzenia zwieraczy",
        "Uraz z bólem, drętwieniem, osłabieniem kończyn"
      ],
      myths: [
        { m: "Trzaskanie szyją zawsze pomaga", f: "Agresywne manipulacje bez oceny mogą zaszkodzić." }
      ],
      faq: [
        { q: "Kiedy RTG/MRI?", a: "Po urazie, przy objawach neurologicznych lub braku poprawy — decyzja lekarza." }
      ]
    },

    klatka: {
      label: "Klatka piersiowa",
      symptoms: [
        "Ból w klatce (kłujący, piekący, uciskowy)",
        "Ból przy głębokim wdechu lub ruchu",
        "Duszność, kołatanie",
        "Ból po wysiłku lub po posiłku",
        "Promieniowanie do ramienia, żuchwy, pleców"
      ],
      causes: [
        "Przyczyny mięśniowo-szkieletowe (częste)",
        "Refluks / dolegliwości przełyku",
        "Infekcja dróg oddechowych, zapalenie opłucnej",
        "Choroba wieńcowa / zawał — zawsze wykluczać przy typowych objawach",
        "Lęk / hiperwentylacja",
        "Odma, zator (rzadziej, ale pilne)"
      ],
      firstaid: [
        "Usiądź, nie forsuj wysiłku",
        "Jeśli podejrzenie sercowe: 112, rozluźnij ubranie, nie zostawaj sam",
        "Przy znanym refluksie: uniesienie wezgłowia, unikanie ciężkich posiłków wieczorem"
      ],
      otc: [
        { t: "Leki zobojętniające przy typowym zgagowym charakterze — doraźnie u dorosłych", audience: "adult" }
      ],
      rx: [
        "Diagnostyka kardiologiczna / pulmonologiczna według objawów"
      ],
      rehab: [
        "Kontrola czynników ryzyka (ciśnienie, cholesterol, nikotyna)",
        "Aktywność fizyczna według zaleceń lekarza"
      ],
      urgent: [
        "Ucisk/pieczenie w klatce, duszność, zimne poty, nudności — 112",
        "Nagła duszność, ból przy oddychaniu jednostronny",
        "Omdlenie, silne osłabienie"
      ],
      myths: [
        { m: "Młody = nie zawał", f: "Zdarza się rzadziej, ale nie wyklucza — liczą się objawy, nie wiek." }
      ],
      faq: [
        { q: "Ból przy nacisku żeber?", a: "Często mięśniowo-szkieletowy, ale przy duszności/objawach ogólnych i tak ocena lekarska." }
      ]
    },

    serce: {
      label: "Serce",
      symptoms: [
        "Ucisk, pieczenie lub ciężar w klatce",
        "Promieniowanie do lewej ręki, żuchwy, pleców",
        "Duszność, zimne poty, nudności",
        "Kołatanie, niemiarowość",
        "Omdlenie lub stan przedomdleniowy"
      ],
      causes: [
        "Choroba wieńcowa, zawał mięśnia sercowego",
        "Zaburzenia rytmu",
        "Nadciśnienie, niewydolność serca",
        "Przyczyny nie-sercowe naśladujące objawy (refluks, mięśnie) — wymaga różnicowania"
      ],
      firstaid: [
        "Przy podejrzeniu zawału: natychmiast 112",
        "Pozycja siedząca, rozluźnić ubranie, nie forsować ruchu",
        "Jeśli lekarz wcześniej zalecił nitroglicerynę — tylko według jego instrukcji"
      ],
      otc: [
        { t: "Nie stosuj „na własną rękę” leków nasercowych bez zaleceń", audience: "adult" }
      ],
      rx: [
        "Leczenie wyłącznie pod kontrolą lekarza (przeciwpłytkowe, beta-blokery, statyny itd.)"
      ],
      rehab: [
        "Rehabilitacja kardiologiczna po wydarzeniach sercowych",
        "Kontrola ciśnienia, glukozy, lipidów, rzucenie palenia"
      ],
      urgent: [
        "Każde podejrzenie ostrego zespołu wieńcowego — 112",
        "Utrata przytomności, ciężka duszność, ból nieustępujący"
      ],
      myths: [
        { m: "Jak ból mija po antacidzie, serce jest OK", f: "Refluks i choroba wieńcowa mogą współistnieć — nie diagnostykuj samodzielnie." }
      ],
      faq: [
        { q: "Kobiety mają inne objawy?", a: "Częściej duszność, zmęczenie, dyskomfort — nadal 112 przy podejrzeniu." }
      ]
    },

    pluca: {
      label: "Płuca / oddychanie",
      symptoms: [
        "Duszność spoczynkowa lub wysiłkowa",
        "Kaszel, świszczący oddech",
        "Ból przy wdechu",
        "Odkrztuszanie wydzieliny lub krwi",
        "Gorączka, osłabienie"
      ],
      causes: [
        "Infekcja (oskrzela, zapalenie płuc)",
        "Astma, POChP",
        "Alergia, dym, zanieczyszczenia",
        "Odma, zatorowość płucna (pilne)",
        "Niewydolność serca (duszność)"
      ],
      firstaid: [
        "Usiądź, pochyl się lekko do przodu, spokojny wydech",
        "Świeże powietrze, usuń znane wyzwalacze",
        "Przy znanym ataku astmy — lek doraźny według planu lekarza"
      ],
      otc: [
        { t: "Leki wykrztuśne / przeciwkaszlowe — ostrożnie, krótko, wg ulotki", audience: "adult" }
      ],
      rx: [
        "Inhalatory, antybiotyk, tlen — wyłącznie według wskazań"
      ],
      rehab: [
        "Szczepienia (grypa, pneumokoki) wg zaleceń",
        "Rzucenie palenia",
        "Rehabilitacja oddechowa w POChP"
      ],
      urgent: [
        "Ciężka duszność, sinica, niemożność dokończenia zdania",
        "Krwioplucie",
        "Nagły ból w klatce + duszność (odma/zator — 112)"
      ],
      myths: [
        { m: "Kaszel trzeba zawsze „zatamować”", f: "Przy infekcji produktywnej tłumienie bywa niekorzystne — pytaj farmaceutę/lekarza." }
      ],
      faq: [
        { q: "Kiedy RTG?", a: "Przy duszności, wysokiej gorączce, podejrzeniu zapalenia płuc — decyzja lekarza." }
      ]
    },

    plecy: {
      label: "Plecy / kręgosłup",
      symptoms: [
        "Ból lędźwiowy lub piersiowy",
        "Sztywność rano",
        "Ból przy schylaniu, podnoszeniu",
        "Rwa Culasse — ból do nogi",
        "Drętwienie, osłabienie kończyny"
      ],
      causes: [
        "Pr przeciążenie mięśniowo-więzadłowe",
        "Dyskopatia, rwa kulszowa",
        "Zła ergonomia, brak ruchu",
        "Rzadziej: infekcja, złamanie, przyczyny nienarządowe ruchu"
      ],
      firstaid: [
        "Unikaj leżenia całymi dniami — krótki ruch w tolerancji bólu",
        "Ciepły okład przy bólu napięciowym",
        "Technika podnoszenia: nogi, nie tylko kręgosłup",
        "Nie forsuj „wyprostowania na siłę”"
      ],
      otc: [
        { t: "Paracetamol / NLPZ u dorosłych krótkotrwale, jeśli brak przeciwwskazań", audience: "adult" }
      ],
      rx: [
        "Fizjoterapia, leki na zlecenie, diagnostyka obrazowa wg wskazań"
      ],
      rehab: [
        "Wzmacnianie mięśni głębokich tułowia",
        "Aktywność aerobowa (spacer, pływanie) w miarę możliwości",
        "Ergonomia snu i pracy"
      ],
      urgent: [
        "Narastający niedowład, zaburzenia oddawania moczu/stolca",
        "Ból po urazie z osteoporozą / u osoby starszej",
        "Gorączka + silny ból kręgosłupa"
      ],
      myths: [
        { m: "Przy bólu pleców tylko leżeć", f: "Ostrożna aktywność zwykle jest lepsza niż długotrwałe unieruchomienie." }
      ],
      faq: [
        { q: "Kiedy MRI?", a: "Objawy neurologiczne, uraz, brak poprawy, czerwone flagi — kieruje lekarz." }
      ]
    },

    brzuch: {
      label: "Brzuch",
      symptoms: [
        "Ból rozlany lub punktowy",
        "Wzdęcia, kurcze",
        "Nudności, wymioty, biegunka lub zaparcie",
        "Ból po posiłku",
        "Obrona mięśniowa, twardy brzuch (pilne)"
      ],
      causes: [
        "Niestrawność, infekcja wirusowa („grypa żołądkowa”)",
        "Refluks, choroba wrzodowa",
        "Kamica, zapalenie wyrostka, kolka",
        "Nietolerancje pokarmowe, IBS",
        "Przyczyny ginekologiczne / urologiczne"
      ],
      firstaid: [
        "Małe łyki płynów, lekka dieta przy infekcji",
        "Unikaj ciężkostrawnych posiłków i alkoholu",
        "Nie podawaj leków przeczyszczających przy ostrym silnym bólu „na ślepo”"
      ],
      otc: [
        { t: "Doustne nawodnienie przy biegunce", audience: "all" },
        { t: "Leki na zgagę doraźnie u dorosłych", audience: "adult" }
      ],
      rx: [
        "Diagnostyka i leczenie przyczynowe — lekarz"
      ],
      rehab: [
        "Regularne posiłki, błonnik wg tolerancji",
        "Ograniczenie alkoholu, NSAID na czczo"
      ],
      urgent: [
        "Silny, narastający ból, twardy brzuch, wymioty treścią fusowatą / krwią",
        "Objawy odwodnienia, omdlenia",
        "Ból w ciąży, ból jądra, ból z wysoką gorączką"
      ],
      myths: [
        { m: "Każdy ból brzucha to wyrostek", f: "Wyrostek to jedna z wielu przyczyn — liczy się dynamika objawów i badanie." }
      ],
      faq: [
        { q: "Kiedy SOR?", a: "Silny ból, krwi ste stolce/wymioty, uraz, objawy wstrząsu, ból u niemowlęcia." }
      ]
    },

    zoladek: {
      label: "Żołądek / przełyk",
      symptoms: [
        "Zgaga, pieczenie za mostkiem",
        "Uczucie pełności, odbijanie",
        "Nudności po posiłku",
        "Ból w nadbrzuszu",
        "Czarne stolce lub krwawe wymioty (pilne)"
      ],
      causes: [
        "Refluks żołądkowo-przełykowy (GERD)",
        "Dyspepsja, choroba wrzodowa",
        "Leki drażniące (np. NLPZ)",
        "Infekcja H. pylori (do diagnostyki)",
        "Przejedzenie, alkohol"
      ],
      firstaid: [
        "Ostatni posiłek 3 h przed snem, uniesione wezgłowie",
        "Unikaj dużych tłustych posiłków, mięty, gazowanych napojów (indywidualnie)",
        "Nie kładź się zaraz po jedzeniu"
      ],
      otc: [
        { t: "Antacida / algiany / IPP doraźnie — wg ulotki, nie przewlekle bez konsultacji", audience: "adult" }
      ],
      rx: [
        "IPP w kuracji, eradykacja H. pylori — według lekarza"
      ],
      rehab: [
        "Kontrola masy ciała",
        "Ograniczenie nikotyny i alkoholu"
      ],
      urgent: [
        "Krwawe wymioty, stolce smoliste",
        "Narastający ból, omdlenie, niedokrwistość"
      ],
      myths: [
        { m: "Mleko leczy zgagę", f: "Może doraźnie złagodzić, potem często nasila objawy." }
      ],
      faq: [
        { q: "Kiedy gastroskopia?", a: "Objawy alarmowe, wiek/ryzyko, brak odpowiedzi na leczenie — kieruje lekarz." }
      ]
    },

    watroba: {
      label: "Wątroba / prawy górny brzuch",
      symptoms: [
        "Dyskomfort w prawym podżebrzu",
        "Zmęczenie, utrata apetytu",
        "Żółtaczka (żółte białka oczu, skóra)",
        "Ciemny mocz, jasne stolce",
        "Wzdęcia, świąd skóry"
      ],
      causes: [
        "Stłuszczenie wątroby",
        "Wirusowe zapalenia wątroby",
        "Toksyczne uszkodzenie (alkohol, leki)",
        "Kamica dróg żółciowych (ból kolkowy)",
        "Zastój żółci, inne choroby hepatologiczne"
      ],
      firstaid: [
        "Odstaw alkohol",
        "Nie dokładaj leków hepatotoksycznych „na własną rękę”",
        "Nawodnienie, lekka dieta do czasu konsultacji"
      ],
      otc: [
        { t: "Unikaj zbędnych suplementów „na wątrobę” bez konsultacji", audience: "adult" }
      ],
      rx: [
        "Diagnostyka laboratoryjna / obrazowa — lekarz"
      ],
      rehab: [
        "Redukcja masy ciała przy stłuszczeniu",
        "Szczepienia (HBV) wg kalendarza / zaleceń"
      ],
      urgent: [
        "Żółtaczka z pogorszeniem stanu, dezorientacja",
        "Silny ból prawego podżebrza z gorączką (drogi żółciowe)",
        "Krwawienie z przewodu pokarmowego"
      ],
      myths: [
        { m: "Wątroba zawsze boli, gdy chora", f: "Często długo przebiega bez bólu — liczą się badania i objawy ogólne." }
      ],
      faq: [
        { q: "Czy to zawsze kamica?", a: "Nie. Prawy górny ból ma wiele przyczyn — wymaga wywiadu i badań." }
      ]
    },

    nerki: {
      label: "Nerki / okolica lędźwiowa",
      symptoms: [
        "Ból w boku / dole pleców (głęboki)",
        "Ból falujący (kolka)",
        "Pieczenie przy mikcji, częstomocz",
        "Gorączka, dreszcze",
        "Krew w moczu, nudności"
      ],
      causes: [
        "Kamica nerkowa",
        "Zakażenie układu moczowego / odmiedniczkowe zapalenie nerek",
        "Zastój moczu, inne przyczyny urologiczne",
        "Ból mięśniowy naśladujący okolicę nerek"
      ],
      firstaid: [
        "Nawodnienie (jeśli nie ma przeciwwskazań lekarskich)",
        "Ciepły okład przy kolce może łagodzić — ale przy gorączce szukaj pomocy",
        "Nie wstrzymuj moczu"
      ],
      otc: [
        { t: "Paracetamol na ból — jeśli brak przeciwwskazań; NLPZ ostrożnie przy nerkach", audience: "adult" }
      ],
      rx: [
        "Antybiotyk przy ZUM / OZN — tylko po ocenie lekarskiej",
        "Leczenie kamicy według urologa"
      ],
      rehab: [
        "Odpowiednie nawodnienie na co dzień",
        "Ograniczenie nadmiaru soli wg zaleceń"
      ],
      urgent: [
        "Wysoka gorączka z bólem okolicy lędźwiowej",
        "Anuria (brak moczu), silny obrzęk, dezorientacja",
        "Ciąża + objawy ZUM / bólu w boku"
      ],
      myths: [
        { m: "Sok żurawinowy leczy ostre odmiedniczkowe zapalenie", f: "Może wspierać profilaktykę nawrotów ZUM, nie leczy ciężkiej infekcji." }
      ],
      faq: [
        { q: "Kiedy USG?", a: "Przy kolce, krwiomoczu, nawracających infekcjach — decyduje lekarz." }
      ]
    },

    biodra: {
      label: "Biodra",
      symptoms: [
        "Ból w pachwinie lub boku biodra",
        "Utkanie przy wstawaniu",
        "Ból przy chodzeniu / leżeniu na boku",
        "Ograniczenie rotacji biodra"
      ],
      causes: [
        "Pr przeciążenie, zapalenie kaletki",
        "Zmiany zwyrodnieniowe stawu biodrowego",
        "Problemy kręgosłupa lędźwiowego (ból rzutowany)",
        "Uraz, kontuzja sportowa"
      ],
      firstaid: [
        "Odpoczynek od aktywności prowokującej",
        "Zimny okład po wysiłku (krótko)",
        "Unikaj długotrwałego leżenia na bolącym boku"
      ],
      otc: [
        { t: "Paracetamol / NLPZ krótko u dorosłych, jeśli wolno", audience: "adult" }
      ],
      rx: [
        "Fizjoterapia, diagnostyka obrazowa wg wskazań"
      ],
      rehab: [
        "Wzmacnianie pośladków i stabilizacji miednicy",
        "Kontrola masy ciała"
      ],
      urgent: [
        "Nagły silny ból po upadku (szczególnie osoby starsze) — możliwy złamanie",
        "Niemożność obciążenia kończyny, skrócenie kończyny"
      ],
      myths: [
        { m: "Ból biodra zawsze = endoproteza", f: "Wiele dolegliwości leczy się zachowawczo." }
      ],
      faq: [
        { q: "Pachwina czy kręgosłup?", a: "Często wymaga badania — nie zgaduj samodzielnie." }
      ]
    },

    udo: {
      label: "Udo",
      symptoms: [
        "Ból mięśni tylnych lub przednich uda",
        "Ból po sprincie / kopnięciu",
        "Siniak, obrzęk",
        "Ból przy wchodzeniu po schodach"
      ],
      causes: [
        "Naciągnięcie / naderwanie mięśnia",
        "Pr przeciążenie treningowe",
        "Problemy stawu biodrowego lub kolana (ból przeniesiony)",
        "Rzadziej: zakrzepica (zwykle z obrzękiem, asymetrią)"
      ],
      firstaid: [
        "RICE/POLICE: ochrona, odciążenie, zimno krótko, kompresja, uniesienie",
        "Unikaj forsownego stretching „na ostro” tuż po urazie"
      ],
      otc: [
        { t: "Paracetamol na ból; NLPZ ostrożnie", audience: "adult" }
      ],
      rx: [
        "Fizjoterapia, USG przy podejrzeniu większego uszkodzenia"
      ],
      rehab: [
        "Stopniowy powrót do obciążenia",
        "Rozgrzewka, siła ekscentryczna mięśni tylnych uda"
      ],
      urgent: [
        "Nagły obrzęk całego uda, ból, zaczerwienienie — oceń pod kątem ZŻG (SOR/lekarz)",
        "Uraz z silnym krwiakiem i utratą funkcji"
      ],
      myths: [
        { m: "Rozciągać od razu po naderwaniu", f: "W ostrej fazie najpierw ochrona i spokój tkanek." }
      ],
      faq: [
        { q: "Kiedy trening znowu?", a: "Gdy chód bez utykania i siła wraca — najlepiej z fizjoterapeutą." }
      ]
    },

    kolano: {
      label: "Kolano",
      symptoms: [
        "Ból z przodu, boku lub z tyłu kolana",
        "Obrzęk, uczucie „uciekania”",
        "Blokowanie, trzaski",
        "Ból przy schodach / po siedzeniu"
      ],
      causes: [
        "Pr przeciążenie, chondromalacja, zespół rzepkowo-udowy",
        "Uszkodzenie łąkotki / więzadeł",
        "Zapaleniem kaletki, artroza",
        "Uraz skrętny"
      ],
      firstaid: [
        "Odciążenie, zimny okład 10–15 min",
        "Unikaj pełnego przysiadu i skrętów w ostrej fazie",
        "Stabilne obuwie"
      ],
      otc: [
        { t: "Paracetamol / NLPZ krótko u dorosłych jeśli wolno", audience: "adult" }
      ],
      rx: [
        "Ortopeda / fizjoterapia; NMR przy urazie więzadłowym wg oceny"
      ],
      rehab: [
        "Wzmacnianie mięśnia czworogłowego i pośladków",
        "Kontrola osi kończyny, unikanie nagłych skoków obciążenia"
      ],
      urgent: [
        "Silny uraz z blokadą, niestabilnością, dużym obrzękiem",
        "Niezdolność obciążenia po urazie",
        "Objawy infekcji stawu (gorączka, silny obrzęk, zaczerwienienie)"
      ],
      myths: [
        { m: "Trzaski zawsze oznaczają operację", f: "Trzaski bez bólu i obrzęku często są niegroźne." }
      ],
      faq: [
        { q: "Kiedy do ortopedy?", a: "Uraz, blokada, nawracający obrzęk, ból > kilka tygodni." }
      ]
    },

    lydka: {
      label: "Łydka",
      symptoms: [
        "Ból mięśnia brzuchatego",
        "Nagły „strzał” podczas biegu (możliwe naderwanie)",
        "Obrzęk, siniak",
        "Ból przy zgięciu grzbietowym stopy"
      ],
      causes: [
        "Naciągnięcie / naderwanie",
        "Skurcze (odwodnienie, elektrolity, przeciążenie)",
        "Zakrzepica żył głębokich (ważne różnicowanie)",
        "Problemy achillesa / kręgosłupa"
      ],
      firstaid: [
        "Odciążenie, zimno krótko po urazie sportowym",
        "Nie masuj intensywnie przy podejrzeniu zakrzepicy",
        "Nawodnienie przy skurczach"
      ],
      otc: [
        { t: "Paracetamol na ból urazowy", audience: "adult" }
      ],
      rx: [
        "USG Doppler przy podejrzeniu ZŻG — pilnie"
      ],
      rehab: [
        "Stopniowe rozciąganie i siła po fazie ostrej",
        "Dobór butów i obciążenia treningowego"
      ],
      urgent: [
        "Asymetryczny obrzęk, ból, ucieplenie łydki — możliwa ZŻG (SOR/lekarz)",
        "Duszność + ból łydki (możliwy zator — 112)"
      ],
      myths: [
        { m: "Skurcz = zawsze magnez i koniec tematu", f: "Nawracające skurcze i obrzęk wymagają szerszej oceny." }
      ],
      faq: [
        { q: "Różnica: naderwanie vs zakrzep?", a: "Zakrzep często bez urazu, z obrzękiem i uczuciem ciężkości — przy wątpliwości badanie." }
      ]
    },

    kostka: {
      label: "Kostka",
      symptoms: [
        "Ból po skręceniu",
        "Obrzęk, siniak wokół kostki",
        "Niestabilność przy chodzeniu",
        "Ból przy obciążeniu"
      ],
      causes: [
        "Skręcenie (uszkodzenie więzadeł)",
        "Stłuczenie, złamanie",
        "Pr przeciążenie, niestabilność przewlekła"
      ],
      firstaid: [
        "Ochrona, odciążenie, zimno 10–15 min, uniesienie",
        "Elastyczny bandaż bez przejawu drętwienia palców",
        "Nie „rozchodź” na siłę w ostrej fazie"
      ],
      otc: [
        { t: "Paracetamol / NLPZ krótko u dorosłych jeśli wolno", audience: "adult" }
      ],
      rx: [
        "RTG przy kryteriach otta / decyzji lekarza",
        "Stabilizator, fizjoterapia"
      ],
      rehab: [
        "Propriocepcja (równowaga na jednej nodze) po ustąpieniu ostrego bólu",
        "Stopniowy powrót do sportu"
      ],
      urgent: [
        "Deformacja, niemożność obciążenia, podejrzenie złamania",
        "Drętwienie, bladość stopy po urazie"
      ],
      myths: [
        { m: "Skręcenie zawsze bez RTG", f: "Część urazów to złamania — decydują objawy i badanie." }
      ],
      faq: [
        { q: "Chodzić czy kule?", a: "Obciążenie w granicy bólu lub wg zaleceń po ocenie urazu." }
      ]
    },

    stopy: {
      label: "Stopy",
      symptoms: [
        "Ból pięty (np. rano pierwsze kroki)",
        "Ból śródstopia",
        "Odciski, pęcherze",
        "Obrzęk, pieczenie, mrowienie palców"
      ],
      causes: [
        "Zapaleniem rozcięgna podeszwowego",
        "Pr przeciążenie, nieodpowiednie obuwie",
        "Hallux, metatarsalgia",
        "Neuropatia (np. cukrzycowa) — do diagnostyki",
        "Uraz, stresowe złamanie"
      ],
      firstaid: [
        "Odciążenie, domowe wkładki amortyzujące tymczasowo",
        "Zimny okład po długim staniu",
        "Higiena skóry, suche skarpety"
      ],
      otc: [
        { t: "Plastry na pęcherze, kremy na zrogowacenia — ostrożnie", audience: "all" }
      ],
      rx: [
        "Fizjoterapia, wkładki na zamówienie, diagnostyka przy neuropatii"
      ],
      rehab: [
        "Rozciąganie łydki i rozcięgna",
        "Stopniowe budowanie wytrzymałości chodu"
      ],
      urgent: [
        "Stopa cukrzycowa: rana, owrzodzenie, infekcja — pilnie lekarz",
        "Nagły niedowład, silny uraz z deformacją"
      ],
      myths: [
        { m: "Twarde buty „zahartują” stopę", f: "Złe obuwie nasila przeciążenia." }
      ],
      faq: [
        { q: "Ból pięty rano?", a: "Często rozcięgno — ćwiczenia + odciążenie, przy braku poprawy fizjo/lekarz." }
      ]
    },

    strefa: {
      label: "Strefa intymna",
      symptoms: [
        "Ból, pieczenie, świąd",
        "Upławy, nieprzyjemny zapach",
        "Ból przy mikcji lub współżyciu",
        "Owrzodzenia, zmiany skórne",
        "Ból jądra / moszny (mężczyźni)"
      ],
      causes: [
        "Infekcje (bakteryjne, grzybicze, STI)",
        "Podrażnienie chemiczne / alergiczne",
        "Zapalenie układu moczowego",
        "U mężczyzn: skręt jądra (pilne), zapalenie najądrza",
        "U kobiet: przyczyny ginekologiczne wymagające oceny"
      ],
      firstaid: [
        "Higiena delikatnymi środkami, bez irygacji „na siłę”",
        "Unikaj współżycia do wyjaśnienia objawów infekcyjnych",
        "Bawełniana bielizna, unikanie mocno pachnących kosmetyków"
      ],
      otc: [
        { t: "Preparaty dopochwowe / przeciwgrzybicze — tylko gdy typowa nawracająca grzybica i znasz wzorzec; inaczej lekarz", audience: "adult" }
      ],
      rx: [
        "Diagnostyka i leczenie partnerów przy STI — lekarz"
      ],
      rehab: [
        "Bezpieczeństwo seksualne, badania wg zaleceń"
      ],
      urgent: [
        "Nagły silny ból jądra — natychmiast SOR (skręt jądra)",
        "Ciąża + ból + krwawienie",
        "Wysoka gorączka, silny ból, zatrzymanie moczu"
      ],
      myths: [
        { m: "Objawy „same przejdą”, nie trzeba partnera leczyć", f: "Przy STI leczenie obu stron bywa konieczne." }
      ],
      faq: [
        { q: "Czy to zawsze STI?", a: "Nie. Podobne objawy dają też drożdżaki, podrażnienia, ZUM — diagnostyka rozstrzyga." }
      ]
    },

    ciaza: {
      label: "Ciąża — dolegliwości",
      symptoms: [
        "Nudności, wymioty",
        "Bóle krzyża, skurcze łydek",
        "Zgaga, zaparcia",
        "Obrzęki nóg",
        "Skurcze macicy, plamienie (wymaga oceny)"
      ],
      causes: [
        "Fizjologiczne zmiany hormonalne i narządowe",
        "Refluks ciążowy",
        "Pr przeciążenie kręgosłupa",
        "Powikłania ciąży — do wykluczenia przy alarmach"
      ],
      firstaid: [
        "Małe częste posiłki przy nudnościach",
        "Uniesione wezgłowie przy zgadze",
        "Wygodne obuwie, krótkie spacery przy obrzękach (jeśli lekarz nie zaleci inaczej)"
      ],
      otc: [
        { t: "Wiele leków jest przeciwwskazanych — zawsze pytaj lekarza/położną/farmaceutę", audience: "adult" }
      ],
      rx: [
        "Opieka perinatalna według harmonogramu wizyt"
      ],
      rehab: [
        "Ćwiczenia zalecane w ciąży (np. szkoła rodzenia / fizjo uroginekologiczna)"
      ],
      urgent: [
        "Krwawienie, silny ból brzucha, nagły obrzęk twarzy/rąk, silny ból głowy z zaburzeniami widzenia",
        "Zmniejszenie ruchów płodu",
        "Odpływanie wód, regularne bolesne skurcze przed terminem — według zaleceń 112/szpital"
      ],
      myths: [
        { m: "W ciąży nie wolno żadnego leku przeciwbólowego", f: "Niektóre są dopuszczalne w wybranych trymestrach — tylko po konsultacji." }
      ],
      faq: [
        { q: "Kogo wołać?", a: "Położna / ginekolog prowadzący; w alarmie 112 lub izba przyjęć położnicza." }
      ]
    }
  };

  // Alias: stary klucz "oczy" → "oko" (na wypadek innych linków)
  CONTENT_PL.oczy = CONTENT_PL.oko;

  // EN: thin professional mirror (labels + urgent + firstaid core) — UI already has EN strings elsewhere
  const CONTENT_EN = {};
  Object.keys(CONTENT_PL).forEach((k) => {
    const s = CONTENT_PL[k];
    CONTENT_EN[k] = {
      label: s.label,
      symptoms: s.symptoms,
      causes: s.causes,
      firstaid: s.firstaid,
      otc: s.otc,
      rx: s.rx,
      rehab: s.rehab,
      urgent: s.urgent,
      myths: s.myths,
      faq: s.faq
    };
  });

  global.BH_CONTENT_PL = CONTENT_PL;
  global.BH_CONTENT_EN = CONTENT_EN;
  global.BH_CONTENT_DISCLAIMER = DISCLAIMER;

  /**
   * Patch: podmienia CONTENT_PL / CONTENT_EN w stronie szczegółów, jeśli już istnieją,
   * albo ustawia globalne używane przez loader.
   */
  global.BH_applyContentPatch = function BH_applyContentPatch() {
    try {
      if (typeof global.CONTENT_PL === "object") {
        Object.keys(CONTENT_PL).forEach((k) => {
          global.CONTENT_PL[k] = CONTENT_PL[k];
        });
      } else {
        global.CONTENT_PL = CONTENT_PL;
      }
      if (typeof global.CONTENT_EN === "object") {
        Object.keys(CONTENT_EN).forEach((k) => {
          global.CONTENT_EN[k] = CONTENT_EN[k];
        });
      } else {
        global.CONTENT_EN = CONTENT_EN;
      }
    } catch (e) {
      console.warn("BH content patch", e);
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
