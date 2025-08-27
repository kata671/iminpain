/* content.js — pełna baza treści dla szczegoly.html */

window.CONTENT = {
  oko: {
    przyczyny: [
      "Zapalenie spojówek (wirusowe, bakteryjne, alergiczne)",
      "Zespół suchego oka (ekrany, klimatyzacja, dym)",
      "Ciało obce (piasek, rzęsa, opiłki)",
      "Jaskra — nagły wzrost ciśnienia wewnątrzgałkowego",
      "Zapalenie rogówki lub tęczówki",
      "Uraz mechaniczny lub chemiczny",
      "Przemęczenie oczu (zespół widzenia komputerowego)"
    ],
    objawy: [
      "Łzawienie, pieczenie, światłowstręt",
      "Zaczerwienienie spojówek, uczucie piasku",
      "Obrzęk powiek, wydzielina",
      "Ból i pogorszenie ostrości widzenia",
      "Mroczki, podwójne widzenie",
      "Nagła utrata wzroku — OBJAW ALARMOWY"
    ],
    alarm: [
      "Nagła utrata wzroku",
      "Silny ból oka",
      "Uraz chemiczny lub mechaniczny"
    ],
    pp: [
      "Nie pocieraj oka; przepłucz jałową solą fizjologiczną",
      "Usuń soczewki kontaktowe i nie zakładaj do czasu wyleczenia",
      "Przy urazie — jałowy opatrunek, nie uciskaj",
      "Silny ból lub nagła utrata widzenia → 📞 112"
    ],
    leki: [
      ["Bez recepty","Sztuczne łzy, krople nawilżające; krople antyhistaminowe OTC"],
      ["Na receptę","Krople antybiotykowe/steroidowe, leki przeciwjaskrowe"]
    ],
    profilaktyka: [
      "Rób przerwy od ekranu (zasada 20/20/20)",
      "Dbaj o odpowiednie oświetlenie pracy",
      "Stosuj sztuczne łzy przy suchości",
      "Regularne badania okulistyczne"
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
      "Ból/ucisk w okolicy zatok, gorączka",
      "Spływanie wydzieliny po tylnej ścianie gardła",
      "Pogorszenie węchu"
    ],
    alarm: [
      "Silny ból głowy + gorączka",
      "Obrzęk wokół oczu",
      "Krwawienie nieustępujące >30 minut"
    ],
    pp: [
      "Irygacja nosa solą fizjologiczną",
      "Nawilżanie powietrza, picie płynów",
      "Krótkotrwałe stosowanie kropli obkurczających (≤5 dni)"
    ],
    leki: [
      ["Bez recepty","Spraye z wodą morską/solą, leki antyhistaminowe OTC"],
      ["Na receptę","Steryd donosowy, antybiotyk, leki p/alergiczne"]
    ],
    profilaktyka: [
      "Unikaj dymu tytoniowego i alergenów",
      "Nawilżaj powietrze",
      "Hartuj organizm, szczepienia ochronne"
    ],
    lekarze: ["POZ","Laryngolog"]
  },

  usta: {
    przyczyny: [
      "Afty, opryszczka (HSV)",
      "Podrażnienia mechaniczne/chemiczne",
      "Niedobory witamin (B12, kwas foliowy, żelazo)",
      "Kandydoza jamy ustnej"
    ],
    objawy: [
      "Bolesne nadżerki/pęcherzyki",
      "Pieczenie, obrzęk, trudności w jedzeniu",
      "Nieprzyjemny zapach z ust"
    ],
    alarm: [
      "Rozległe owrzodzenia",
      "Utrudnione przełykanie",
      "Gorączka z dużymi zmianami w jamie ustnej"
    ],
    pp: [
      "Płukanki antyseptyczne",
      "Unikaj drażniących potraw i alkoholu",
      "Delikatna higiena jamy ustnej"
    ],
    leki: [
      ["Bez recepty","Żele osłaniające, płukanki antyseptyczne"],
      ["Na receptę","Leki przeciwwirusowe, przeciwgrzybicze"]
    ],
    profilaktyka: [
      "Higiena jamy ustnej",
      "Ograniczenie stresu",
      "Unikanie ostrych potraw"
    ],
    lekarze: ["POZ","Dentysta","Dermatolog"]
  },

  ucho: {
    przyczyny: [
      "Czop woskowinowy",
      "Zapalenie ucha zewnętrznego lub środkowego",
      "Barotrauma (lot, nurkowanie)",
      "Uraz mechaniczny"
    ],
    objawy: [
      "Ból ucha, uczucie zatkania",
      "Szumy, niedosłuch",
      "Wyciek wydzieliny, gorączka"
    ],
    alarm: [
      "Nagła utrata słuchu",
      "Silny ból + gorączka",
      "Zawroty głowy + wyciek krwisty"
    ],
    pp: [
      "Nie wkładaj niczego do ucha",
      "Przy bólu — ciepły okład przez tkaninę",
      "Podejrzenie infekcji — konsultacja"
    ],
    leki: [
      ["Bez recepty","Krople zmiękczające woskowinę, leki p/bólowe"],
      ["Na receptę","Antybiotyk/krople sterydowe"]
    ],
    profilaktyka: [
      "Unikaj czyszczenia patyczkami",
      "Susz ucho po kąpieli",
      "Kontroluj słuch profilaktycznie"
    ],
    lekarze: ["POZ","Laryngolog"]
  },

  glowa: {
    przyczyny: [
      "Ból napięciowy",
      "Migrena",
      "Zapalenie zatok",
      "Nadciśnienie, odwodnienie",
      "Krwawienie wewnątrzczaszkowe"
    ],
    objawy: [
      "Ucisk/pulsowanie",
      "Mdłości, wymioty (migrena)",
      "Ból przy pochylaniu (zatoki)",
      "Nagły „piorunujący” ból — ALARM"
    ],
    alarm: [
      "Nagły, najsilniejszy ból życia",
      "Ból + niedowład/drętwienie",
      "Ból + utrata przytomności"
    ],
    pp: [
      "Odpoczynek w ciszy i ciemności",
      "Nawodnienie, zimny okład",
      "Nagły silny ból + objawy neurologiczne → 📞 112"
    ],
    leki: [
      ["Bez recepty","Paracetamol, ibuprofen, naproksen"],
      ["Na receptę","Tryptany, leki profilaktyczne migreny"]
    ],
    profilaktyka: [
      "Regularny sen",
      "Unikanie stresu",
      "Nawodnienie, dieta"
    ],
    lekarze: ["POZ","Neurolog","Laryngolog"]
  },

  serce: {
    przyczyny: [
      "Dławica piersiowa, zawał",
      "Arytmie, zapalenie mięśnia sercowego",
      "Anemia, nadczynność tarczycy"
    ],
    objawy: [
      "Ból w klatce promieniujący do ręki/szczęki",
      "Duszność, zimny pot, nudności",
      "Kołatania serca, osłabienie"
    ],
    alarm: [
      "Ból w klatce >10 min",
      "Nagła duszność, utrata przytomności",
      "Zimny pot + silny ból promieniujący"
    ],
    pp: [
      "Przerwij wysiłek, usiądź/półsiedź",
      "Jeśli ból >10 min → 📞 112",
      "Nie prowadź samodzielnie"
    ],
    leki: [
      ["Bez recepty","Brak bezpiecznych OTC na ból w klatce"],
      ["Na receptę","Nitraty, beta-blokery, antykoagulanty"]
    ],
    profilaktyka: [
      "Rzuć palenie",
      "Dieta śródziemnomorska",
      "Regularna aktywność fizyczna",
      "Kontrola ciśnienia i cholesterolu"
    ],
    lekarze: ["POZ","Kardiolog","SOR"]
  },

  pluca: {
    przyczyny: [
      "Infekcje (zapalenie oskrzeli/płuc)",
      "Astma/POChP",
      "Zatorowość płucna",
      "Odma opłucnowa"
    ],
    objawy: [
      "Kaszel (suchy/mokry), duszność",
      "Ból w klatce przy oddychaniu",
      "Gorączka, osłabienie",
      "Nagła duszność/krwioplucie"
    ],
    alarm: [
      "Nagła duszność, sinica",
      "Krwioplucie",
      "Silny ból w klatce przy oddychaniu"
    ],
    pp: [
      "Odpoczynek, pozycja półsiedząca",
      "Nawilżanie powietrza, nawodnienie",
      "Silna duszność → 📞 112"
    ],
    leki: [
      ["Bez recepty","Syropy wykrztuśne/przeciwkaszlowe, inhalacje NaCl"],
      ["Na receptę","Antybiotyki, steryd wziewny, leki rozszerzające oskrzela"]
    ],
    profilaktyka: [
      "Rzuć palenie",
      "Szczepienia (grypa, COVID, pneumokoki)",
      "Unikaj zanieczyszczeń",
      "Ćwiczenia oddechowe"
    ],
    lekarze: ["POZ","Pulmonolog","SOR"]
  },

  /* ... analogicznie pozostałe: kregoslup, zoladek, watroba, nerki,
     ramie, lokiec, dlon, udo, kolano, lydka, stopa, ciaza ... */
};
