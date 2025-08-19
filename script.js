/* ---------- Przełącznik motywu ---------- */
(function(){
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if(saved === 'light'){ root.classList.add('theme-light'); }
  const btn = document.getElementById('themeToggle');
  if(btn) btn.addEventListener('click', () => {
    root.classList.toggle('theme-light');
    localStorage.setItem('theme', root.classList.contains('theme-light') ? 'light' : 'dark');
  });
})();

/* ---------- Dane medyczne + obrazy ---------- */
/* ==== PLIKI DO WGRANIA ==== 
   Umieść obrazy w /img/ o następujących nazwach (WEBP/JPG/PNG – najlepiej .webp):
   ear.webp, eye.webp, face-sinuses.webp, brain.webp, heart.webp, lungs.webp,
   kidneys.webp, throat.webp, digestive.webp, spine.webp, spine-cervical.webp,
   knee.webp, legs-muscles.webp, full-body-male.webp, full-body-female.webp
*/

const PARTS = {
  head: {
    title: 'Głowa / twarz',
    img: 'img/face-sinuses.webp',
    causes: [
      'Ból napięciowy (stres, napięcie mięśni karku)',
      'Migrena (nudności, światłowstręt, pulsujący ból)',
      'Zatoki (ból przy pochylaniu, katar, gorączka)',
      'Oczy (przemęczenie wzroku, astygmatyzm, jaskra – pilne jeśli ból oka + pogorszenie widzenia)',
      'Odwodnienie, nieregularny sen, kofeina/alkohol'
    ],
    tests: [
      'Badanie lekarskie, ocena neurologiczna',
      'Laryngolog: rynoskop, USG zatok; okulista: badanie dna oka',
      'Badania krwi (CRP, morfologia) przy gorączce',
      'TK/MR głowy – tylko przy „czerwonych flagach”'
    ],
    redflags: [
      'Nagły „najgorszy w życiu” ból',
      'Uraz głowy, drgawki, zaburzenia mowy/widzenia',
      'Gorączka + sztywność karku, wysypka',
      'Ból w ciąży z objawami neurologicznymi'
    ],
    specialists: ['POZ', 'Neurolog', 'Laryngolog', 'Okulista'],
    related: ['eye','ear','throat','brain']
  },
  eye: {
    title: 'Oko',
    img: 'img/eye.webp',
    causes: [
      'Zapalenie spojówek, suchość oka, przemęczenie',
      'Ostry ból + spadek widzenia → pilnie okulista (jaskra, zapalenie tęczówki)'
    ],
    specialists: ['Okulista'],
    related: ['head']
  },
  ear: {
    title: 'Ucho',
    img: 'img/ear.webp',
    causes: [
      'Zapalenie ucha środkowego (ból, gorączka, pogorszenie słuchu)',
      'Zatkany przewód słuchowy (woskowina)',
      'Ból rzutowany z żuchwy/zatok'
    ],
    specialists: ['Laryngolog'],
    related: ['head','throat']
  },
  throat: {
    title: 'Gardło / krtań',
    img: 'img/throat.webp',
    causes: ['Infekcja wirusowa/bakteryjna', 'Refluks', 'Przeciążenie głosu'],
    specialists: ['POZ','Laryngolog'],
    related: ['head','chest']
  },
  neck: {
    title: 'Szyja (kręgosłup szyjny)',
    img: 'img/spine-cervical.webp',
    causes: [
      'Napięcie mięśniowe, przeciążenie pracą przy komputerze',
      'Dyskopatia szyjna (ból promieniujący do barku/ramienia, drętwienia)'
    ],
    specialists: ['POZ','Neurolog','Fizjoterapeuta','Ortopeda'],
    related: ['head','arms','spine']
  },
  chest: {
    title: 'Klatka piersiowa',
    img: 'img/lungs.webp',
    causes: [
      'Mięśniowo-żebrowe (po wysiłku, przy ucisku)',
      'Płuca (infekcje, zapalenie opłucnej – ból przy oddychaniu)',
      'Serce (ucisk za mostkiem, duszność, promieniowanie do lewej ręki – PILNE)'
    ],
    tests: ['Osłuchiwanie, EKG, RTG klatki, troponiny (gdy podejrzenie kardiologiczne)'],
    specialists: ['POZ','Kardiolog','Pulmonolog'],
    related: ['heart','lungs','spine']
  },
  heart: {
    title: 'Serce',
    img: 'img/heart.webp',
    causes: [
      'Choroba wieńcowa (wysiłkowy ucisk w klatce)',
      'Zapalenie osierdzia (ból kłujący, przy pochyleniu mniej)'
    ],
    specialists: ['Kardiolog'], related: ['chest']
  },
  lungs: {
    title: 'Płuca / układ oddechowy',
    img: 'img/lungs.webp',
    causes: ['Infekcja', 'Zapalenie opłucnej', 'Atak astmy (świsty, duszność)'],
    specialists: ['Pulmonolog'], related: ['chest']
  },
  abdomen: {
    title: 'Brzuch',
    img: 'img/digestive.webp',
    causes: [
      'Skurcze jelit (IBS), wzdęcia, zatrucie pokarmowe',
      'Refluks/żołądek, wątroba/żółć, trzustka (ból do pleców)',
      'Nerki (ból boków, pieczenie przy mikcji)'
    ],
    tests: ['Badanie lekarskie, USG jamy brzusznej, bad. moczu, morfologia'],
    specialists: ['POZ','Gastroenterolog','Nefrolog','Chirurg (ostry brzuch)'],
    related: ['digestive','kidneys','spine']
  },
  digestive: {
    title: 'Układ pokarmowy',
    img: 'img/digestive.webp',
    specialists: ['Gastroenterolog'],
    related: ['abdomen']
  },
  kidneys: {
    title: 'Nerki / drogi moczowe',
    img: 'img/kidneys.webp',
    causes: ['Kamica nerkowa (kolka, ból falami do pachwiny)', 'Infekcja (gorączka, dreszcze)'],
    specialists: ['Nefrolog','Urolog'], related: ['abdomen']
  },
  arms: {
    title: 'Ręce / bark',
    img: 'img/legs-muscles.webp', // jeśli masz lepszy obraz rąk, podmień nazwę
    causes: [
      'Przeciążenie ścięgien (nadgarstek, łokieć tenisisty)',
      'Zespół cieśni nadgarstka (mrowienie, nocny ból)',
      'Bark – konflikt podbarkowy, zapalenie stożka rotatorów'
    ],
    specialists: ['Ortopeda','Fizjoterapeuta'], related: ['neck']
  },
  legs: {
    title: 'Nogi / kolana',
    img: 'img/knee.webp',
    causes: [
      'Przeciążenia, urazy więzadeł/łąkotek',
      'Żylaki/zakrzepica (ból + obrzęk jednostronny – pilnie skonsultuj)'
    ],
    specialists: ['Ortopeda','Fizjoterapeuta','Chirurg naczyniowy'],
    related: ['spine']
  },
  spine: {
    title: 'Kręgosłup',
    img: 'img/spine.webp',
    causes: ['Dyskopatia, przeciążenie, rwę kulszową'],
    specialists: ['Neurolog','Ortopeda','Fizjoterapeuta'], related: ['neck','legs','abdomen','chest']
  },
  brain: { title:'Mózg', img:'img/brain.webp', specialists:['Neurolog'], related:['head'] }
};

/* ---------- Obsługa kliknięć na overlay ---------- */
function openInfo(key){
  const data = PARTS[key];
  if(!data) return;

  // panel skrótów
  const target = document.getElementById('detail-content');
  target.innerHTML = `
    <p><strong>${data.title}</strong> – kliknięto. Otwieram szczegóły…</p>
  `;

  // modal
  const modal = document.getElementById('modal');
  const img = document.getElementById('modal-img');
  const title = document.getElementById('modal-title');
  const text = document.getElementById('modal-text');
  const chips = document.getElementById('modal-related');

  img.src = data.img || '';
  img.alt = data.title || '';
  title.textContent = data.title || 'Szczegóły';
  text.innerHTML = [
    data.causes?.length ? <h4>Możliwe przyczyny</h4><ul>${data.causes.map(li=>`<li>${li}</li>).join('')}</ul>` : '',
    data.tests?.length ? <h4>Badania / co dalej</h4><ul>${data.tests.map(li=>`<li>${li}</li>).join('')}</ul>` : '',
    data.redflags?.length ? <h4>Natychmiast do lekarza, jeśli:</h4><ul>${data.redflags.map(li=>`<li>${li}</li>).join('')}</ul>` : '',
    data.specialists?.length ? <h4>Specjaliści</h4><p>${data.specialists.join(', ')}</p> : ''
  ].join('');

  chips.innerHTML = '';
  (data.related||[]).forEach(k=>{
    const b=document.createElement('button');
    b.textContent = PARTS[k]?.title || k;
    b.addEventListener('click',()=>openInfo(k));
    chips.appendChild(b);
  });

  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
}

document.querySelectorAll('.overlay').forEach(btn=>{
  btn.addEventListener('click', ()=> openInfo(btn.dataset.part));
});

/* ---------- Modal zamykanie ---------- */
(function(){
  const modal = document.getElementById('modal');
  const closeBtn = document.querySelector('.modal__close');
  function close(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.getElementById('modal-img').src='';
  }
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e)=>{ if(e.target === modal) close(); });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') close(); });
})();

/* ---------- Galeria ---------- */
const GALLERY = [
  {src:'img/ear.webp', caption:'Ucho'},
  {src:'img/eye.webp', caption:'Oko'},
  {src:'img/brain.webp', caption:'Mózg'},
  {src:'img/face-sinuses.webp', caption:'Zatoki / twarz'},
  {src:'img/heart.webp', caption:'Serce'},
  {src:'img/lungs.webp', caption:'Płuca'},
  {src:'img/kidneys.webp', caption:'Nerki'},
  {src:'img/throat.webp', caption:'Gardło / krtań'},
  {src:'img/digestive.webp', caption:'Układ pokarmowy'},
  {src:'img/spine.webp', caption:'Kręgosłup'},
  {src:'img/spine-cervical.webp', caption:'Kręgi szyjne'},
  {src:'img/knee.webp', caption:'Kolano'},
  {src:'img/legs-muscles.webp', caption:'Mięśnie kończyn'},
];

(function renderGallery(){
  const grid = document.getElementById('gallery-grid');
  if(!grid) return;
  grid.innerHTML = GALLERY.map(item=>`
    <figure data-src="${item.src}" data-caption="${item.caption}">
      <img src="${item.src}" alt="${item.caption}" loading="lazy" decoding="async">
      <figcaption>${item.caption}</figcaption>
    </figure>
  `).join('');
  // klik -> modal
  grid.addEventListener('click',(e)=>{
    const fig = e.target.closest('figure'); if(!fig) return;
    const keyBySrc = Object.entries(PARTS).find(([,v])=>v.img===fig.dataset.src)?.[0];
    if(keyBySrc){ openInfo(keyBySrc); return; } // jeśli mamy opis – pokaż pełny modal
    // w innym wypadku tylko podgląd
    const modal = document.getElementById('modal');
    document.getElementById('modal-img').src = fig.dataset.src;
    document.getElementById('modal-title').textContent = fig.dataset.caption || 'Podgląd';
    document.getElementById('modal-text').innerHTML = '';
    document.getElementById('modal-related').innerHTML = '';
    modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
  });
})();
