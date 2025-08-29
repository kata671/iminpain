/* content.js — komplet opisów do „szczegóły.html”
   Klucze muszą zgadzać się z parametrem ?id=  (np. mezczyzna-oko) */

window.CONTENT = {
  /* —— KOBIETA —— */
  "kobieta-oko": {
    tytul: "Ból oka (kobieta)",
    objawy: [
      "Kłucie, pieczenie lub uczucie ciała obcego",
      "Łzawienie, światłowstręt",
      "Zaczerwienienie spojówek lub brzegu powiek",
      "Zaburzenia ostrości widzenia, mroczki"
    ],
    przyczyny: [
      "Zapalenie spojówek, alergia",
      "Zespół suchego oka, długie korzystanie z ekranu",
      "Jęczmień, gradówka",
      "Uraz mechaniczny, zadrapanie rogówki",
      "Rzadziej: jaskra ostra, zapalenie błony naczyniowej"
    ],
    pierwsza_pomoc: [
      "Odpoczynek oka, ogranicz ekspozycję na ekran",
      "Sztuczne łzy / krople nawilżające",
      "Chłodne okłady 10–15 min",
      "NIE trzyj oka, nie zakładaj soczewek do ustąpienia objawów",
      "Pilnie do lekarza, gdy: silny ból, nagłe pogorszenie widzenia, uraz chemiczny/mechaniczny"
    ],
    leki: {
      bez_recepty: [
        "Sztuczne łzy (np. hialuronian sodu)",
        "Krople z ektoiną lub pantenolem",
        "Antyalergiczne (ketotifen/azelastyna) przy alergii"
      ],
      na_recepte: [
        "Antybiotyk w kroplach przy bakteryjnym zakażeniu (wg lekarza)",
        "GKS miejscowo – tylko po zleceniu specjalisty"
      ]
    }
  },

  "kobieta-nos": {
    tytul: "Ból / dyskomfort nosa (kobieta)",
    objawy: [
      "Zatkany nos, kichanie, wodnista wydzielina",
      "Ból przy ucisku skrzydełek / grzbietu nosa",
      "Krwawienia z nosa"
    ],
    przyczyny: [
      "Infekcja wirusowa, alergia",
      "Suchość śluzówek, uraz mechaniczny",
      "Zapalenie zatok przynosowych"
    ],
    pierwsza_pomoc: [
      "Nawilżanie śluzówek (sól morska/izotoniczna)",
      "Nawodnienie i odpoczynek",
      "Przy krwawieniu: uciśnij skrzydełka 10 min, pochyl głowę do przodu"
    ],
    leki: {
      bez_recepty: [
        "Sól morska/izotoniczna, żele nawilżające",
        "Krótkotrwale: ksylometazolina/oksymetazolina (max 3–5 dni)"
      ],
      na_recepte: [
        "Steroid donosowy przy alergii/przewlekłej niedrożności (wg lekarza)",
        "Antybiotyk przy bakteryjnym zapaleniu zatok (wg lekarza)"
      ]
    }
  },

  "kobieta-usta": {
    tytul: "Usta / warga (kobieta)",
    objawy: [
      "Pękanie, suchość, zajady",
      "Opryszczka – bolesne pęcherzyki"
    ],
    przyczyny: [
      "Odwodnienie, wiatr/słońce",
      "Niedobory (B2, żelazo), cukrzyca",
      "Zakażenie HSV (opryszczka)"
    ],
    pierwsza_pomoc: [
      "Pomadka ochronna, maści natłuszczające",
      "Unikaj oblizywania ust",
      "Na opryszczkę – krem z acyklowirem jak najwcześniej"
    ],
    leki: {
      bez_recepty: ["Maści natłuszczające, pantenol", "Acyklowir 5% – miejscowo (na początku zmian)"],
      na_recepte: ["Acyklowir/ walacyklowir doustnie przy nasilonych nawrotach – wg lekarza"]
    }
  },

  /* —— MĘŻCZYZNA —— */
  "mezczyzna-oko": {
    tytul: "Ból oka (mężczyzna)",
    objawy: [
      "Pieczenie, zaczerwienienie, łzawienie",
      "Światłowstręt, zamazane widzenie"
    ],
    przyczyny: [
      "Zapalenie spojówek (alergiczne/wirusowe/bakteryjne)",
      "Zespół suchego oka",
      "Uraz rogówki"
    ],
    pierwsza_pomoc: [
      "Płukanie jałową solą/sztuczne łzy",
      "Chłodny okład 10–15 min",
      "Pilnie na SOR, gdy ból silny / pogorszenie widzenia / uraz chemiczny"
    ],
    leki: {
      bez_recepty: ["Sztuczne łzy", "Krople antyhistaminowe (alergia)"],
      na_recepte: ["Antybiotyk w kroplach – wg lekarza"]
    }
  },

  "mezczyzna-nos": {
    tytul: "Nos (mężczyzna)",
    objawy: ["Niedrożność, katar, ból przy ucisku", "Krwawienia z nosa"],
    przyczyny: ["Infekcja/alergia", "Suchość śluzówek, uraz", "Zapalenie zatok"],
    pierwsza_pomoc: [
      "Nawilżanie solą morską",
      "Picie płynów",
      "Przy krwawieniu: ucisk skrzydełek 10 min, głowa do przodu"
    ],
    leki: {
      bez_recepty: ["Sól morska/izotoniczna", "Ksylometazolina/oksymetazolina – max 3–5 dni"],
      na_recepte: ["Steroid donosowy / antybiotyk – wg lekarza"]
    }
  },

  "mezczyzna-usta": {
    tytul: "Usta (mężczyzna)",
    objawy: ["Pękanie, suchość", "Opryszczka – pęcherzyki i ból"],
    przyczyny: ["Odwodnienie, warunki pogodowe", "HSV"],
    pierwsza_pomoc: ["Nawilżanie, maści ochronne", "Acyklowir miejscowo – jak najwcześniej"],
    leki: {
      bez_recepty: ["Balsamy, pantenol", "Acyklowir 5% – miejscowo"],
      na_recepte: ["Leczenie przeciwwirusowe doustne przy ciężkich nawrotach"]
    }
  }
};
/* — koniec — */
