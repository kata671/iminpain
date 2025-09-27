// assets/patch-ciaza-kostka.js
(function(){
  function ensure(ns,key,val){ if(!ns[key]) ns[key]=val; }
  function addParts(NS, isEN){
    ensure(NS,'kostka',{
      label: isEN ? 'Ankle' : 'Kostka',
      symptoms:[
        isEN?'Swelling after twist/trauma':'Obrzęk po skręceniu/urazie',
        isEN?'Pain on weight bearing':'Ból przy obciążaniu',
        isEN?'Bruising, warmth, limited motion':'Siniaki, ocieplenie, ograniczenie ruchu',
        isEN?'Instability/clicking sensation':'Uczucie niestabilności/„przeskakiwania”',
        isEN?'Numbness/tingling in foot':'Drętwienie/mrowienie stopy'
      ],
      urgent:[
        isEN?'Severe deformity, open wound, pale/cold foot':'Znaczna deformacja, rana otwarta, blada/zimna stopa',
        isEN?'Unable to take 4 steps':'Brak możliwości wykonania 4 kroków',
        isEN?'Pain at malleoli back edge or base of 5th metatarsal':'Ból na tylnym brzegu kostek lub u podstawy V kości śródstopia'
      ],
      causes:[
        isEN?'Ankle sprain (ATFL/CFL)':'Skręcenie kostki (ATFL/CFL)',
        isEN?'Fracture':'Złamanie',
        isEN?'Tendonitis/peroneal subluxation':'Zapalenie ścięgien/podwichnięcie strzałkowych',
        isEN?'Arthritis/gout':'Zapalenie stawu/dna moczanowa'
      ],
      firstaid:[
        isEN?'RICE: rest, ice 15–20 min, compression, elevation':'RICE: odpoczynek, lód 15–20 min, ucisk, uniesienie',
        isEN?'Remove tight shoes/rings if swelling grows':'Zdejmij obuwie/biżuterię przy narastaniu obrzęku',
        isEN?'Use crutches if needed; avoid forced motion':'Kule w razie potrzeby; nie wymuszaj ruchu'
      ],
      otc:[
        isEN?'Paracetamol/ibuprofen (if safe)':'Paracetamol/ibuprofen (jeśli bezpieczne)',
        isEN?'Topical NSAID gel':'Miejscowy żel NLPZ'
      ],
      rx:[
        isEN?'X‑ray (Ottawa rules); immobilize if fracture':'RTG (reguły Ottawskie); unieruchomienie przy złamaniu',
        isEN?'Physiotherapy for proprioception/strength':'Fizjoterapia: propriocepcja/siła'
      ],
      rehab:[
        isEN?'Early gentle ROM; alphabet with toes':'Wczesne łagodne ruchy; „alfabet” palcami',
        isEN?'Balance single‑leg work':'Ćwiczenia równowagi na jednej nodze'
      ],
      myths:[
        isEN?'“If you can walk, it isn’t broken” — false':'„Jak chodzę, to nie złamane” — fałsz',
        isEN?'Heat immediately after injury — avoid 48h':'Gorąco po urazie — unikaj 48h'
      ],
      faq:[
        isEN?'Return to sport when pain‑free, full ROM, stable':'Powrót do sportu: bez bólu, pełny zakres, stabilność'
      ],
      dx:[], docs:[]
    });

    ensure(NS,'ciaza',{
      label: isEN ? 'Pregnancy' : 'Ciąża',
      symptoms:[
        isEN?'Missed period, nausea/vomiting, breast tenderness':'Brak miesiączki, nudności/wymioty, tkliwość piersi',
        isEN?'Cramps, fatigue, frequent urination':'Skurcze, zmęczenie, częstomocz',
        isEN?'Light spotting (implantation)':'Lekkie plamienie (implantacja)'
      ],
      urgent:[
        isEN?'Severe one‑sided pain + fainting (ectopic)':'Silny jednostronny ból + omdlenie (ciąża ektopowa)',
        isEN?'Heavy bleeding or large clots':'Obfite krwawienie lub duże skrzepy',
        isEN?'Fever, foul discharge, severe vomiting/dehydration':'Gorączka, cuchnąca wydzielina, silne wymioty/odwodnienie'
      ],
      causes:[
        isEN?'Normal early pregnancy changes':'Prawidłowe zmiany wczesnej ciąży',
        isEN?'Ectopic pregnancy, miscarriage':'Ciąża ektopowa, poronienie',
        isEN?'UTI in pregnancy, hyperemesis gravidarum':'ZUM w ciąży, niepowściągliwe wymioty ciężarnych'
      ],
      firstaid:[
        isEN?'Hydration, small frequent meals, vitamin B6':'Nawadnianie, małe częste posiłki, wit. B6',
        isEN?'Avoid NSAIDs; paracetamol first‑line':'Unikaj NLPZ; paracetamol lek pierwszego wyboru',
        isEN?'Early contact with obstetric care':'Wczesny kontakt z opieką położniczą'
      ],
      otc:[
        isEN?'Prenatal vitamins (folic acid)':'Witaminy prenatalne (kwas foliowy)',
        isEN?'B6/ginger for nausea if tolerated':'B6/imbir na nudności (jeśli tolerowane)'
      ],
      rx:[
        isEN?'Ultrasound to confirm intrauterine pregnancy':'USG dla potwierdzenia ciąży wewnątrzmacicznej',
        isEN?'hCG trend; treat ectopic if suspected':'Trend hCG; leczenie ektopowej przy podejrzeniu',
        isEN?'Pregnancy‑safe antibiotics for UTI':'Antybiotyki bezpieczne w ciąży na ZUM'
      ],
      rehab:[
        isEN?'Pelvic‑floor exercises, light activity':'Ćwiczenia dna miednicy, lekka aktywność'
      ],
      myths:[
        isEN?'“Any bleeding = miscarriage” — not always':'„Każde krwawienie = poronienie” — nie zawsze',
        isEN?'“NSAIDs are fine” — avoid unless told':'„NLPZ są ok” — unikaj bez zaleceń'
      ],
      faq:[
        isEN?'Positive test + one‑sided pain — go urgent':'Dodatni test + jednostronny ból — pilna konsultacja',
        isEN?'Which painkiller is safe? Paracetamol':'Jaki lek na ból? Paracetamol'
      ],
      dx:[], docs:[]
    });
  }

  function tryInject(){
    if(typeof CONTENT_PL==='object'){ addParts(CONTENT_PL,false); }
    if(typeof CONTENT_EN==='object'){ addParts(CONTENT_EN,true); }
  }
  tryInject();
  document.addEventListener('DOMContentLoaded', tryInject);
  setTimeout(tryInject, 300);
})();