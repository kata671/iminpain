/* content.js — pełna baza treści dla szczegoly.html
   Klucze: oko, nos, usta, ucho, glowa, serce, pluca, kregoslup, zoladek,
           watroba, nerki, ramie, lokiec, dlon, udo, kolano, lydka, stopa, ciaza
*/

window.CONTENT = {
  oko: {
    przyczyny: [
      "Zapalenie spojówek (wirusowe, bakteryjne, alergiczne)",
      "Zespół suchego oka (ekrany, klimatyzacja, dym)",
      "Ciało obce (piasek, rzęsa, opiłki)",
      "Jaskra — nagły wzrost ciśnienia wewnątrzgałkowego",
      "Zapalenie rogówki lub tęczówki",
      "Uraz mechaniczny lub chemiczny",
      "Przemęczenie oczu (zespół widzenia komputerowego, CVS)"
    ],
    objawy: [
      "Łzawienie, pieczenie, światłowstręt",
      "Zaczerwienienie spojówek, uczucie piasku",
      "Obrzęk powiek, wydzielina",
      "Ból i pogorszenie ostrości widzenia",
      "Mroczki, podwójne widzenie",
      "Nagła utrata wzroku — OBJAW ALARMOWY"
    ],
    pp: [
      "Nie pocieraj oka; przepłucz jałową solą fizjologiczną",
      "Usuń soczewki kontaktowe i nie zakładaj do czasu wyleczenia",
      "Zastosuj chłodne okłady na powieki (krótko, przez materiał)",
      "Przy urazie — jałowy opatrunek, nie uciskaj",
      "Silny ból lub nagła utrata widzenia → 📞 112 / pilny okulista"
    ],
    leki: [
      ["Bez recepty","Sztuczne łzy, krople nawilżające; krople antyhistaminowe OTC przy alergii"],
      ["Na receptę","Krople antybiotykowe/steroidowe, leki przeciwjaskrowe — wg okulisty"]
    ],
    lekarze: ["POZ","Okulista","SOR (objawy alarmowe)"]
  },

  nos: {
    przyczyny: [
      "Infekcja wirusowa (przeziębienie), bakteryjna",
      "Alergiczny nieżyt nosa",
      "Zapalenie zatok",
      "Skrzywienie przegrody, polipy nosa",
      "Nadmierne stosowanie kropli obkurczających"
    ],
    objawy: [
      "Katar wodnisty/gęsty, kichanie, zatkany nos",
      "Ból/ucisk w okolicy zatok, gorączka (infekcja)",
      "Spływanie wydzieliny po tylnej ścianie gardła",
      "Pogorszenie węchu"
    ],
    pp: [
      "Irygacja nosa roztworem soli (izotonicznej/hipertonicznej)",
      "Nawilżanie powietrza, picie płynów",
      "Krótkotrwałe stosowanie kropli obkurczających (≤5 dni)",
      "Gorączka >3 dni, ropna wydzielina, silny ból — konsultacja"
    ],
    leki: [
      ["Bez recepty","Spraye z wodą morską/solą, krótkotrwale krople obkurczające, leki antyhistaminowe OTC"],
      ["Na receptę","Steryd donosowy, antybiotyk (jeśli bakteryjne), leki p/alergiczne wg lekarza"]
    ],
    lekarze: ["POZ","Laryngolog"]
  },

  usta: {
    przyczyny: [
      "Afty, opryszczka (HSV)",
      "Podrażnienia mechaniczne/chemiczne (ostre potrawy, pasta)",
      "Niedobory (B12, kwas foliowy, żelazo)",
      "Kandydoza jamy ustnej"
    ],
    objawy: [
      "Bolesne nadżerki/pęcherzyki",
      "Pieczenie, obrzęk, trudności w jedzeniu",
      "Nieprzyjemny zapach z ust (przy nadkażeniu)"
    ],
    pp: [
      "Płukanki antyseptyczne (zgodnie z ulotką), łagodne ziołowe",
      "Unikaj drażniących potraw, alkoholu i tytoniu",
      "Nawilżanie warg, higiena jamy ustnej delikatną szczoteczką",
      "Nawracające/rozległe zmiany — konsultacja"
    ],
    leki: [
      ["Bez recepty","Żele znieczulające/osłaniające, płukanki antyseptyczne"],
      ["Na receptę","Leki przeciwwirusowe (opryszczka), przeciwgrzybicze — wg lekarza"]
    ],
    lekarze: ["POZ","Dentysta","Dermatolog (nawracające)"]
  },

  ucho: {
    przyczyny: [
      "Czop woskowinowy",
      "Zapalenie ucha zewnętrznego lub środkowego",
      "Barotrauma (lot, nurkowanie)",
      "Uraz mechaniczny (patyczki!)"
    ],
    objawy: [
      "Ból ucha, uczucie zatkania",
      "Szumy, niedosłuch",
      "Wyciek wydzieliny, gorączka (infekcja)"
    ],
    pp: [
      "Nie wkładaj niczego do ucha (patyczków)",
      "Przy bólu — ciepły okład przez tkaninę",
      "Podejrzenie infekcji/wycieku — konsultacja"
    ],
    leki: [
      ["Bez recepty","Krople zmiękczające woskowinę, leki p/bólowe (wg ulotki)"],
      ["Na receptę","Antybiotyk/krople sterydowe przy wskazaniach — laryngolog"]
    ],
    lekarze: ["POZ","Laryngolog"]
  },

  glowa: {
    przyczyny: [
      "Ból napięciowy",
      "Migrena (z/bez aury)",
      "Zapalenie zatok",
      "Nadciśnienie, odwodnienie",
      "Rzadko: krwawienie wewnątrzczaszkowe — objawy alarmowe"
    ],
    objawy: [
      "Ucisk/pulsowanie, nadwrażliwość na światło i dźwięk",
      "Mdłości, wymioty (migrena)",
      "Ból przy pochylaniu (zatoki)",
      "Nagły „piorunujący” ból — ALARM"
    ],
    pp: [
      "Odpoczynek w cichym, zaciemnionym miejscu",
      "Nawodnienie, regularne posiłki",
      "Zimny okład na czoło/kark",
      "Objawy neurologiczne, nagły najsilniejszy ból — 📞 112"
    ],
    leki: [
      ["Bez recepty","Paracetamol, ibuprofen, naproksen (wg ulotki)"],
      ["Na receptę","Tryptany, profilaktyka (beta-blokery, topiramat) — wg neurologa"]
    ],
    lekarze: ["POZ","Neurolog","Laryngolog (zatoki)"]
  },

  serce: {
    przyczyny: [
      "Dławica piersiowa, ostry zespół wieńcowy (zawał) — ALARM",
      "Arytmie, zapalenie mięśnia sercowego",
      "Anemia, nadczynność tarczycy, stres"
    ],
    objawy: [
      "Ból/ucisk w klatce promieniujący do ręki/szczęki",
      "Duszność, zimny pot, nudności",
      "Kołatania serca, osłabienie"
    ],
    pp: [
      "Natychmiast przerwij wysiłek, usiądź/półsiedź",
      "Jeśli ból >10 min lub objawy alarmowe — 📞 112",
      "Nie prowadź samodzielnie samochodu do szpitala"
    ],
    leki: [
      ["Bez recepty","Brak bezpiecznych OTC na ból w klatce — skonsultuj nagłe dolegliwości"],
      ["Na receptę","Nitraty, beta-blokery, DAPT/antykoagulanty — wg kardiologa"]
    ],
    lekarze: ["POZ","Kardiolog","SOR (ostre objawy)"]
  },

  pluca: {
    przyczyny: [
      "Infekcje (zapalenie oskrzeli/płuc)",
      "Astma/POChP",
      "Zatorowość płucna — ALARM",
      "Odma opłucnowa — ALARM"
    ],
    objawy: [
      "Kaszel (suchy lub mokry), duszność",
      "Ból w klatce przy oddychaniu",
      "Gorączka, osłabienie",
      "Nagła duszność/krwioplucie — ALARM"
    ],
    pp: [
      "Odpoczynek, pozycja półsiedząca",
      "Nawilżanie powietrza, nawodnienie",
      "Silna duszność, sinica — 📞 112"
    ],
    leki: [
      ["Bez recepty","Syropy wykrztuśne/przeciwkaszlowe (wg charakteru kaszlu), inhalacje NaCl"],
      ["Na receptę","Antybiotyki, steryd wziewny, leki rozszerzające oskrzela — wg lekarza"]
    ],
    lekarze: ["POZ","Pulmonolog","SOR (ostre)"]
  },

  kregoslup: {
    przyczyny: [
      "Przeciążenie, nieprawidłowa postawa",
      "Dyskopatia, rwa kulszowa",
      "Uraz, zapalenia",
      "Osteoporoza (złamania przeciążeniowe)"
    ],
    objawy: [
      "Ból pleców/szyi, promieniowanie do kończyn",
      "Drętwienie, osłabienie siły (ucisk nerwu)",
      "Nasilenie przy długim siedzeniu/staniu"
    ],
    pp: [
      "Okresowo oszczędzaj, ale unikaj długiego leżenia",
      "Ciepło/zimno wg preferencji, delikatna mobilizacja",
      "Ergonomia pracy (wysokość krzesła/monitora)",
      "Postępujący niedowład/utrata kontroli zwieraczy — 📞 112"
    ],
    leki: [
      ["Bez recepty","NLPZ (ibuprofen/naproksen), maści p/bólowe, plastry rozgrzewające"],
      ["Na receptę","Miorelaksanty, blokady, rehabilitacja — wg lekarza"]
    ],
    lekarze: ["POZ","Ortopeda","Neurolog","Fizjoterapeuta"]
  },

  zoladek: {
    przyczyny: [
      "Niestrawność, zatrucie pokarmowe",
      "Refluks (GERD), wrzody (H. pylori)",
      "Nietolerancje pokarmowe",
      "Stres, nieregularne posiłki"
    ],
    objawy: [
      "Ból/uczucie dyskomfortu w nadbrzuszu",
      "Zgaga, odbijania, nudności",
      "Wymioty/biegunka (zatrucie)",
      "Smoliste stolce/krwiste wymioty — ALARM"
    ],
    pp: [
      "Nawodnienie małymi łykami, lekkostrawna dieta",
      "Unikaj alkoholu, tłustych i pikantnych potraw",
      "Nasilające się wymioty/odwodnienie/krwawienie — 📞 112"
    ],
    leki: [
      ["Bez recepty","Leki osłaniające, zobojętniające, alginiany; IPP w dawkach OTC (krótko)"],
      ["Na receptę","IPP w dawkach leczniczych, eradykacja H. pylori, prokinetyki — wg lekarza"]
    ],
    lekarze: ["POZ","Gastroenterolog","SOR (krwawienie/odwodnienie)"]
  },

  watroba: {
    przyczyny: [
      "WZW, stłuszczenie wątroby (NAFLD/MAFLD)",
      "Alkohol, leki hepatotoksyczne",
      "Choroby metaboliczne (rzadziej)"
    ],
    objawy: [
      "Dyskomfort w prawym podżebrzu",
      "Zmęczenie, utrata apetytu",
      "Zażółcenie skóry/oczu — ALARM"
    ],
    pp: [
      "Abstynencja alkoholowa",
      "Dieta z ograniczeniem tłuszczów nasyconych, regularny ruch",
      "Nagłe zażółcenie/krwawienia — pilna konsultacja"
    ],
    leki: [
      ["Bez recepty","Brak specyficznych; ostrożność z lekami przeciwbólowymi"],
      ["Na receptę","Leczenie przyczynowe wg hepatologa"]
    ],
    lekarze: ["POZ","Hepatolog","Gastroenterolog"]
  },

  nerki: {
    przyczyny: [
      "Kamica nerkowa (kolka)",
      "ZUM (zapalenie pęcherza/odmiedniczkowe)",
      "Odwodnienie, leki nefrotoksyczne"
    ],
    objawy: [
      "Silny ból w okolicy lędźwiowej promieniujący do pachwiny",
      "Gorączka, dreszcze (przy ZUM)",
      "Ból/przy parciu, krwiomocz"
    ],
    pp: [
      "Płyny (o ile brak przeciwwskazań kardiologicznych/nefrologicznych)",
      "Ciepło na okolicę lędźwi",
      "Gorączka, dreszcze, wymioty — 📞 112 / SOR"
    ],
    leki: [
      ["Bez recepty","NLPZ p/bólowo (wg ulotki)"],
      ["Na receptę","Antybiotyki (ZUM), leki rozkurczowe, urologiczne — wg lekarza"]
    ],
    lekarze: ["POZ","Urolog","SOR (ostre objawy)"]
  },

  ramie: {
    przyczyny: [
      "Przeciążenie stożka rotatorów",
      "Zapalenie kaletki podbarkowej",
      "Zespół ciasnoty podbarkowej",
      "Uraz/naderwanie mięśni"
    ],
    objawy: [
      "Ból przy unoszeniu ręki, sięganiu za plecy",
      "Sztywność, ograniczenie ROM",
      "Tkliwość nad guzkami kości ramiennej"
    ],
    pp: [
      "Oszczędzanie, zimny okład na ostro (15–20 min), potem ciepło",
      "Delikatne ćwiczenia zakresu ruchu (pendulum, ślizgi ścienne)",
      "Nawracające/ostre objawy — konsultacja"
    ],
    leki: [
      ["Bez recepty","NLPZ doustnie/żele, okłady"],
      ["Na receptę","Iniekcje sterydowe, rehabilitacja — ortopeda/fizjoterapeuta"]
    ],
    lekarze: ["POZ","Ortopeda","Fizjoterapeuta"]
  },

  lokiec: {
    przyczyny: [
      "Łokieć tenisisty/golfisty (enthesopatie)",
      "Urazy skrętne, przeciążenia",
      "Zapalenie kaletki"
    ],
    objawy: [
      "Ból przy chwytaniu/pronacji/supinacji",
      "Tkliwość nad nadkłykciem bocznym/przyśrodkowym",
      "Osłabienie chwytu"
    ],
    pp: [
      "Odpoczynek od czynności wyzwalających ból",
      "Orteza/taśmy, zimno w fazie ostrej",
      "Stopniowe rozciąganie i wzmacnianie mięśni przedramienia"
    ],
    leki: [
      ["Bez recepty","NLPZ miejscowo/doustnie"],
      ["Na receptę","Iniekcje sterydowe/PRP, fizjoterapia — wg lekarza"]
    ],
    lekarze: ["POZ","Ortopeda","Fizjoterapeuta"]
  },

  dlon: {
    przyczyny: [
      "Przeciążenie ścięgien (tendinopatie)",
      "Zespół cieśni nadgarstka",
      "Skręcenia i urazy"
    ],
    objawy: [
      "Ból, obrzęk, tkliwość",
      "Mrowienie palców (I–III w cieśni)",
      "Osłabienie chwytu"
    ],
    pp: [
      "Unieruchomienie elastyczne/orteza nocna",
      "Ergonomia pracy przy komputerze",
      "Chłodzenie w ostrym bólu, ciepło w przewlekłym"
    ],
    leki: [
      ["Bez recepty","NLPZ miejscowo, maści przeciwbólowe"],
      ["Na receptę","Sterydy miejscowe, fizjoterapia, zabieg — wg lekarza"]
    ],
    lekarze: ["POZ","Ortopeda","Neurolog (cieśń)"]
  },

  udo: {
    przyczyny: [
      "Naciągnięcie/ naderwanie mięśni (przód/tył/bok uda)",
      "Promieniowanie bólu z kręgosłupa (rwa kulszowa)"
    ],
    objawy: [
      "Ból przy chodzeniu/biegu",
      "Tkliwość, zasinienie przy naderwaniu",
      "Ograniczenie zakresu ruchu"
    ],
    pp: [
      "RICE: odpoczynek, lód (15–20 min), kompresja, uniesienie",
      "Po ostrej fazie – delikatny stretching i powrót do obciążeń",
      "Silny ból/krwiak rozległy — konsultacja"
    ],
    leki: [
      ["Bez recepty","NLPZ doustnie/miejscowo (wg ulotki)"],
      ["Na receptę","Fizjoterapia, ew. USG i plan leczenia — ortopeda"]
    ],
    lekarze: ["POZ","Ortopeda","Fizjoterapeuta"]
  },

  kolano: {
    przyczyny: [
      "Urazy więzadeł (ACL/MCL), łąkotki",
      "Chondromalacja rzepki, zapalenie kaletek",
      "Zwyrodnienie stawu, RZS",
      "Infekcyjne zapalenie stawu — ALARM"
    ],
    objawy: [
      "Ból przy zginaniu, kucaniu, chodzeniu po schodach",
      "Obrzęk, uciekanie kolana, przeskakiwanie",
      "Zaczerwienienie/gorączka — podejrzenie infekcji"
    ],
    pp: [
      "RICE, odciążenie, orteza/stabilizator (jeśli masz)",
      "Unikaj forsowania schodów i klękania",
      "Gorączka/znaczny obrzęk — pilna konsultacja"
    ],
    leki: [
      ["Bez recepty","NLPZ, maści chłodzące/rozgrzewające"],
      ["Na receptę","Silniejsze NLPZ, iniekcje dostawowe, rehabilitacja — ortopeda"]
    ],
    lekarze: ["POZ","Ortopeda","Fizjoterapeuta","SOR (ostry uraz)"]
  },

  lydka: {
    przyczyny: [
      "Skurcz mięśni, odwodnienie",
      "Naderwanie mięśnia brzuchatego/płaszczkowatego",
      "Zakrzepica żył głębokich — ALARM"
    ],
    objawy: [
      "Ból napięciowy/spoczynkowy",
      "Obrzęk jednostronny, ocieplenie, zaczerwienienie (ZŻG)",
      "Tkliwość przy ucisku"
    ],
    pp: [
      "Odpoczynek, lód w ostrej fazie",
      "Delikatny stretching po ustąpieniu ostrego bólu",
      "Podejrzenie zakrzepicy (obrzęk, ocieplenie, duszność) — 📞 112 / SOR"
    ],
    leki: [
      ["Bez recepty","NLPZ p/bólowo (wg ulotki)"],
      ["Na receptę","Leczenie p/zakrzepowe przy ZŻG — tylko wg lekarza"]
    ],
    lekarze: ["POZ","Chirurg naczyniowy","SOR (podejrzenie ZŻG)"]
  },

  stopa: {
    przyczyny: [
      "Skręcenie stawu skokowego",
      "Zapalenie rozcięgna podeszwowego",
      "Przeciążenia (długie stanie, nieodpowiednie obuwie)"
    ],
    objawy: [
      "Ból przy obciążaniu, tkliwość przy palpacji",
      "Obrzęk, zasinienie po urazie",
      "Sztywność poranna (rozcięgno)"
    ],
    pp: [
      "RICE, obuwie stabilne z wkładką",
      "Ćwiczenia rozciągające rozcięgno, rolowanie piłeczką",
      "Silny ból/niemożność obciążenia — diagnostyka"
    ],
    leki: [
      ["Bez recepty","NLPZ doustnie/żele; plastry chłodzące"],
      ["Na receptę","Fizjoterapia, iniekcje miejscowe — wg ortopedy"]
    ],
    lekarze: ["POZ","Ortopeda","Fizjoterapeuta"]
  },

  ciaza: {
    przyczyny: [
      "Typowe dolegliwości: nudności, zgaga, bóle kręgosłupa, obrzęki",
      "Niedokrwistość ciążowa, infekcje dróg moczowych",
      "Nadciśnienie indukowane ciążą / stan przedrzucawkowy — ALARM"
    ],
    objawy: [
      "Zgaga, mdłości/wymioty (szczególnie I trymestr)",
      "Bóle krzyża, obrzęki nóg",
      "ALARM: krwawienie, silny ból brzucha, brak ruchów płodu",
      "ALARM: ból głowy + mroczki, nagłe obrzęki twarzy/dłoni"
    ],
    pp: [
      "Odpoczynek na lewym boku, nawodnienie małymi łykami",
      "Małe, częste posiłki; uniesienie wezgłowia przy zgadze",
      "Silne objawy alarmowe — 📞 112 / izba położnicza"
    ],
    leki: [
      ["Bez recepty","Paracetamol (p/bólowo), witaminy prenatalne; na zgagę: alginiany/antacida"],
      ["Na receptę","Leczenie wyłącznie wg ginekologa (bez samoleczenia!)"]
    ],
    lekarze: [
      "Położna / Ginekolog-położnik",
      "SOR/Izba położnicza (objawy alarmowe)",
      "POZ (choroby współistniejące — w porozumieniu z ginekologiem)"
    ]
  }
};
