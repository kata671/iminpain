/* content.js — pełna baza treści dla szczegoly.html */

window.CONTENT = {
  oko: {
    przyczyny: [
      "Zapalenie spojówek (wirusowe, bakteryjne, alergiczne)",
      "Zespół suchego oka",
      "Ciało obce w oku",
      "Jaskra — wzrost ciśnienia wewnątrzgałkowego",
      "Zapalenie rogówki lub tęczówki",
      "Urazy mechaniczne i chemiczne"
    ],
    objawy: [
      "Łzawienie, pieczenie, światłowstręt",
      "Zaczerwienienie spojówek",
      "Ból i pogorszenie widzenia",
      "Podwójne widzenie"
    ],
    alarm: [
      "Nagła utrata wzroku",
      "Silny ból oka",
      "Uraz chemiczny lub mechaniczny"
    ],
    pp: [
      "Nie pocieraj oka",
      "Przepłucz solą fizjologiczną",
      "Usuń soczewki kontaktowe",
      "Silny ból/utrata wzroku → 📞 112"
    ],
    leki: [
      ["Bez recepty","Sztuczne łzy, krople antyhistaminowe OTC"],
      ["Na receptę","Krople antybiotykowe, steroidowe, p/jaskrowe"]
    ],
    profilaktyka: [
      "Rób przerwy od ekranu",
      "Dbaj o higienę oczu",
      "Noś okulary przeciwsłoneczne"
    ],
    lekarze: ["POZ","Okulista","SOR"]
  },

  nos: {
    przyczyny: [
      "Infekcja wirusowa lub bakteryjna",
      "Alergiczny nieżyt nosa",
      "Zapalenie zatok",
      "Polipy nosa, skrzywienie przegrody"
    ],
    objawy: [
      "Katar wodnisty/gęsty",
      "Kichanie, zatkany nos",
      "Ból w okolicy zatok"
    ],
    alarm: [
      "Silny ból głowy + gorączka",
      "Obrzęk wokół oczu",
      "Krwawienie >30 minut"
    ],
    pp: [
      "Płucz nos solą fizjologiczną",
      "Nawilżaj powietrze",
      "Odpoczynek i płyny"
    ],
    leki: [
      ["Bez recepty","Spraye solne, krople obkurczające krótko, leki p/alergiczne OTC"],
      ["Na receptę","Steryd donosowy, antybiotyk, leki p/alergiczne"]
    ],
    profilaktyka: [
      "Unikaj alergenów",
      "Wzmacniaj odporność",
      "Szczepienia ochronne"
    ],
    lekarze: ["POZ","Laryngolog"]
  },

  usta: {
    przyczyny: [
      "Afty, opryszczka",
      "Podrażnienia chemiczne i mechaniczne",
      "Niedobory witamin",
      "Kandydoza jamy ustnej"
    ],
    objawy: [
      "Bolesne nadżerki",
      "Pieczenie, obrzęk",
      "Trudności w jedzeniu"
    ],
    alarm: [
      "Rozległe zmiany",
      "Trudności w przełykaniu",
      "Wysoka gorączka"
    ],
    pp: [
      "Płukanki antyseptyczne",
      "Unikaj ostrych potraw i alkoholu",
      "Dbaj o higienę jamy ustnej"
    ],
    leki: [
      ["Bez recepty","Żele osłaniające, płukanki antyseptyczne"],
      ["Na receptę","Leki przeciwwirusowe, przeciwgrzybicze"]
    ],
    profilaktyka: [
      "Myj zęby 2× dziennie",
      "Dbaj o dietę bogatą w witaminy",
      "Unikaj palenia tytoniu"
    ],
    lekarze: ["POZ","Dentysta","Dermatolog"]
  },

  ucho: {
    przyczyny: [
      "Czop woskowinowy",
      "Zapalenie ucha zewnętrznego/środkowego",
      "Barotrauma",
      "Urazy mechaniczne"
    ],
    objawy: [
      "Ból ucha, niedosłuch",
      "Szumy uszne",
      "Wyciek z ucha"
    ],
    alarm: [
      "Nagła utrata słuchu",
      "Silny ból + gorączka",
      "Krwisty wyciek"
    ],
    pp: [
      "Nie wkładaj nic do ucha",
      "Delikatne ciepło przy bólu",
      "Konsultacja lekarska przy wycieku"
    ],
    leki: [
      ["Bez recepty","Krople rozpuszczające woskowinę, leki p/bólowe"],
      ["Na receptę","Antybiotyki, krople sterydowe"]
    ],
    profilaktyka: [
      "Nie używaj patyczków",
      "Osuszaj uszy po kąpieli",
      "Chroń uszy przed hałasem"
    ],
    lekarze: ["POZ","Laryngolog"]
  },

  glowa: {
    przyczyny: [
      "Ból napięciowy",
      "Migrena",
      "Zapalenie zatok",
      "Nadciśnienie",
      "Krwawienie wewnątrzczaszkowe"
    ],
    objawy: [
      "Ucisk/pulsowanie",
      "Mdłości, światłowstręt",
      "Ból przy pochylaniu"
    ],
    alarm: [
      "Nagły silny ból życia",
      "Ból + objawy neurologiczne",
      "Utrata przytomności"
    ],
    pp: [
      "Odpoczynek, cisza, ciemność",
      "Nawodnienie",
      "Zimny okład"
    ],
    leki: [
      ["Bez recepty","Paracetamol, ibuprofen, naproksen"],
      ["Na receptę","Tryptany, profilaktyka migreny"]
    ],
    profilaktyka: [
      "Sen regularny",
      "Unikaj stresu",
      "Pij wodę"
    ],
    lekarze: ["POZ","Neurolog","Laryngolog"]
  },

  serce: {
    przyczyny: [
      "Zawał, dusznica bolesna",
      "Arytmie",
      "Zapalenie mięśnia sercowego"
    ],
    objawy: [
      "Ból w klatce promieniujący",
      "Duszność, zimny pot",
      "Kołatania serca"
    ],
    alarm: [
      "Ból >10 minut",
      "Nagła duszność",
      "Utrata przytomności"
    ],
    pp: [
      "Odpoczynek",
      "Natychmiast 📞 112 przy bólu w klatce",
      "Nie prowadź pojazdów"
    ],
    leki: [
      ["Bez recepty","Brak skutecznych OTC na ból serca"],
      ["Na receptę","Nitraty, beta-blokery, antykoagulanty"]
    ],
    profilaktyka: [
      "Rzuć palenie",
      "Dieta śródziemnomorska",
      "Aktywność fizyczna"
    ],
    lekarze: ["POZ","Kardiolog","SOR"]
  },

  pluca: {
    przyczyny: [
      "Zapalenie oskrzeli/płuc",
      "Astma, POChP",
      "Zatorowość płucna",
      "Odma opłucnowa"
    ],
    objawy: [
      "Kaszel, duszność",
      "Ból w klatce",
      "Gorączka"
    ],
    alarm: [
      "Nagła duszność",
      "Krwioplucie",
      "Sinica"
    ],
    pp: [
      "Odpoczynek, pozycja półsiedząca",
      "Nawilżanie powietrza",
      "📞 112 przy nagłej duszności"
    ],
    leki: [
      ["Bez recepty","Syropy, inhalacje NaCl"],
      ["Na receptę","Antybiotyki, sterydy wziewne"]
    ],
    profilaktyka: [
      "Nie pal tytoniu",
      "Szczepienia ochronne",
      "Unikaj smogu"
    ],
    lekarze: ["POZ","Pulmonolog","SOR"]
  },

  kregoslup: {
    przyczyny: [
      "Dyskopatia",
      "Rwa kulszowa",
      "Przeciążenia",
      "Osteoporoza"
    ],
    objawy: [
      "Ból pleców, promieniowanie",
      "Sztywność",
      "Drętwienie kończyn"
    ],
    alarm: [
      "Niedowład kończyn",
      "Brak kontroli nad zwieraczami",
      "Silny nagły ból"
    ],
    pp: [
      "Krótki odpoczynek",
      "Ćwiczenia rozciągające",
      "Unikaj długiego leżenia"
    ],
    leki: [
      ["Bez recepty","Ibuprofen, naproksen, maści p/bólowe"],
      ["Na receptę","Miorelaksanty, blokady"]
    ],
    profilaktyka: [
      "Ćwiczenia wzmacniające",
      "Prawidłowa postawa",
      "Ergonomia pracy"
    ],
    lekarze: ["POZ","Ortopeda","Neurolog"]
  },

  zoladek: {
    przyczyny: [
      "Niestrawność, refluks",
      "Wrzody żołądka",
      "Zatrucia pokarmowe"
    ],
    objawy: [
      "Ból w nadbrzuszu",
      "Zgaga, odbijanie",
      "Nudności"
    ],
    alarm: [
      "Krwiste wymioty",
      "Smoliste stolce",
      "Silny nagły ból"
    ],
    pp: [
      "Lekkostrawna dieta",
      "Picie wody",
      "Unikaj alkoholu"
    ],
    leki: [
      ["Bez recepty","Leki zobojętniające, IPP w dawce OTC"],
      ["Na receptę","IPP w dawkach leczniczych, antybiotyki na H.pylori"]
    ],
    profilaktyka: [
      "Regularne posiłki",
      "Unikaj alkoholu i tłustych potraw",
      "Kontroluj stres"
    ],
    lekarze: ["POZ","Gastroenterolog","SOR"]
  },

  watroba: {
    przyczyny: [
      "WZW",
      "Stłuszczenie wątroby",
      "Alkohol"
    ],
    objawy: [
      "Dyskomfort w prawym podżebrzu",
      "Zmęczenie",
      "Zażółcenie skóry"
    ],
    alarm: [
      "Nagła żółtaczka",
      "Krwawienia",
      "Silny ból brzucha"
    ],
    pp: [
      "Unikaj alkoholu",
      "Lekkostrawna dieta",
      "Konsultacja lekarska"
    ],
    leki: [
      ["Bez recepty","Brak specyficznych"],
      ["Na receptę","Leczenie przyczynowe wg hepatologa"]
    ],
    profilaktyka: [
      "Ogranicz alkohol",
      "Szczepienia WZW",
      "Zdrowa dieta"
    ],
    lekarze: ["POZ","Hepatolog","Gastroenterolog"]
  },

  nerki: {
    przyczyny: [
      "Kamica nerkowa",
      "ZUM",
      "Odwodnienie"
    ],
    objawy: [
      "Silny ból lędźwi",
      "Gorączka, dreszcze",
      "Krwiomocz"
    ],
    alarm: [
      "Brak oddawania moczu",
      "Gorączka + ból",
      "Silny kolkowy ból"
    ],
    pp: [
      "Pij wodę",
      "Ciepłe okłady",
      "📞 112 przy ostrych objawach"
    ],
    leki: [
      ["Bez recepty","Ibuprofen, leki p/bólowe"],
      ["Na receptę","Antybiotyki, leki rozkurczowe"]
    ],
    profilaktyka: [
      "Pij dużo płynów",
      "Unikaj nadmiaru soli",
      "Badania kontrolne moczu"
    ],
    lekarze: ["POZ","Urolog","SOR"]
  },

  ramie: {
    przyczyny: [
      "Przeciążenia",
      "Zapalenie kaletki",
      "Urazy mięśni"
    ],
    objawy: [
      "Ból przy ruchu",
      "Sztywność",
      "Tkliwość"
    ],
    alarm: [
      "Nagły brak ruchu",
      "Silny ból po urazie",
      "Deformacja stawu"
    ],
    pp: [
      "Oszczędzanie kończyny",
      "Okłady zimne/ciepłe",
      "Delikatne ćwiczenia"
    ],
    leki: [
      ["Bez recepty","Maści p/bólowe, NLPZ"],
      ["Na receptę","Sterydy, rehabilitacja"]
    ],
    profilaktyka: [
      "Rozgrzewka przed wysiłkiem",
      "Unikaj przeciążeń",
      "Ćwicz regularnie"
    ],
    lekarze: ["POZ","Ortopeda","Fizjoterapeuta"]
  },

  lokiec: {
    przyczyny: [
      "Łokieć tenisisty",
      "Przeciążenia",
      "Urazy"
    ],
    objawy: [
      "Ból przy ruchach nadgarstka",
      "Tkliwość przy ucisku",
      "Osłabienie chwytu"
    ],
    alarm: [
      "Silny ból po urazie",
      "Obrzęk i zaczerwienienie",
      "Brak ruchu"
    ],
    pp: [
      "Odpoczynek",
      "Orteza lub opaska",
      "Zimne okłady"
    ],
    leki: [
      ["Bez recepty","NLPZ doustnie/miejscowo"],
      ["Na receptę","Iniekcje sterydowe, fizjoterapia"]
    ],
    profilaktyka: [
      "Unikaj długich powtarzalnych ruchów",
      "Ćwiczenia wzmacniające",
      "Rozciąganie"
    ],
    lekarze: ["POZ","Ortopeda","Fizjoterapeuta"]
  },

  dlon: {
    przyczyny: [
      "Przeciążenie ścięgien",
      "Zespół cieśni nadgarstka",
      "Urazy"
    ],
    objawy: [
      "Ból, obrzęk",
      "Mrowienie palców",
      "Osłabienie chwytu"
    ],
    alarm: [
      "Nagły brak czucia",
      "Silny obrzęk",
      "Zasinienie dłoni"
    ],
    pp: [
      "Unieruchomienie, orteza",
      "Ćwiczenia ergonomiczne",
      "Chłodzenie w ostrym bólu"
    ],
    leki: [
      ["Bez recepty","Maści p/bólowe, NLPZ"],
      ["Na receptę","Sterydy, zabieg"]
    ],
    profilaktyka: [
      "Unikaj długiej pracy bez przerw",
      "Ćwicz nadgarstki",
      "Ergonomia stanowiska"
    ],
    lekarze: ["POZ","Ortopeda","Neurolog"]
  },

  udo: {
    przyczyny: [
      "Naciągnięcia mięśni",
      "Rwa kulszowa",
      "Urazy"
    ],
    objawy: [
      "Ból przy chodzeniu",
      "Tkliwość",
      "Krwiak"
    ],
    alarm: [
      "Silny ból + krwiak",
      "Brak ruchu w nodze",
      "Obrzęk i deformacja"
    ],
    pp: [
      "RICE: odpoczynek, lód, kompresja, uniesienie",
      "Delikatny stretching po ostrej fazie"
    ],
    leki: [
      ["Bez recepty","NLPZ doustnie/miejscowo"],
      ["Na receptę","Fizjoterapia, USG i leczenie"]
    ],
    profilaktyka: [
      "Rozgrzewka",
      "Ćwiczenia wzmacniające",
      "Unikaj nagłych przeciążeń"
    ],
    lekarze: ["POZ","Ortopeda","Fizjoterapeuta"]
  },

  kolano: {
    przyczyny: [
      "Urazy więzadeł, łąkotek",
      "Zwyrodnienie stawu",
      "Chondromalacja rzepki"
    ],
    objawy: [
      "Ból przy chodzeniu",
      "Obrzęk",
      "Niestałość stawu"
    ],
    alarm: [
      "Gorączka + obrzęk",
      "Nagła niemożność chodzenia",
      "Silny ból po urazie"
    ],
    pp: [
      "RICE",
      "Stabilizacja kolana",
      "Unikanie przeciążeń"
    ],
    leki: [
      ["Bez recepty","Maści, NLPZ"],
      ["Na receptę","Zastrzyki dostawowe, rehabilitacja"]
    ],
    profilaktyka: [
      "Ćwiczenia wzmacniające mięśnie nóg",
      "Odpowiednie obuwie",
      "Unikaj nadmiernego obciążania"
    ],
    lekarze: ["POZ","Ortopeda","Fizjoterapeuta"]
  },

  lydka: {
    przyczyny: [
      "Skurcze mięśni",
      "Naderwania mięśni",
      "Zakrzepica żył głębokich"
    ],
    objawy: [
      "Ból napięciowy",
      "Obrzęk",
      "Tkliwość"
    ],
    alarm: [
      "Obrzęk + zaczerwienienie (ZŻG)",
      "Silny nagły ból",
      "Dusznica przy zakrzepicy"
    ],
    pp: [
      "Stretching",
      "Lód w ostrej fazie",
      "📞 112 przy podejrzeniu zakrzepicy"
    ],
    leki: [
      ["Bez recepty","NLPZ"],
      ["Na receptę","Leczenie p/zakrzepowe"]
    ],
    profilaktyka: [
      "Unikaj długiego siedzenia",
      "Ćwiczenia nóg",
      "Pij wodę"
    ],
    lekarze: ["POZ","Chirurg naczyniowy","SOR"]
  },

  stopa: {
    przyczyny: [
      "Skręcenie stawu skokowego",
      "Zapalenie rozcięgna podeszwowego",
      "Przeciążenia"
    ],
    objawy: [
      "Ból przy chodzeniu",
      "Obrzęk",
      "Zasinienie"
    ],
    alarm: [
      "Silny ból + brak obciążenia",
      "Deformacja stopy",
      "Obrzęk + gorączka"
    ],
    pp: [
      "RICE",
      "Stabilne obuwie",
      "Rozciąganie rozcięgna"
    ],
    leki: [
      ["Bez recepty","NLPZ, plastry chłodzące"],
      ["Na receptę","Fizjoterapia, iniekcje"]
    ],
    profilaktyka: [
      "Noś odpowiednie obuwie",
      "Ćwiczenia rozciągające",
      "Unikaj przeciążeń"
    ],
    lekarze: ["POZ","Ortopeda","Fizjoterapeuta"]
  },

  ciaza: {
    przyczyny: [
      "Typowe dolegliwości ciążowe",
      "Niedokrwistość ciążowa",
      "Nadciśnienie indukowane ciążą"
    ],
    objawy: [
      "Mdłości, zgaga",
      "Bóle kręgosłupa",
      "Obrzęki"
    ],
    alarm: [
      "Krwawienie",
      "Brak ruchów płodu",
      "Ból głowy + obrzęk twarzy"
    ],
    pp: [
      "Odpoczynek",
      "Nawodnienie",
      "📞 112 przy krwawieniu/silnym bólu"
    ],
    leki: [
      ["Bez recepty","Paracetamol, witaminy prenatalne"],
      ["Na receptę","Leczenie wg ginekologa"]
    ],
    profilaktyka: [
      "Regularne wizyty u ginekologa",
      "Suplementacja kwasu foliowego",
      "Zdrowa dieta, ruch"
    ],
    lekarze: ["Położna","Ginekolog","SOR/Izba położnicza"]
  }
};
