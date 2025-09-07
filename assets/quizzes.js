// assets/quizzes.js (v2 – shuffle + last-step auto-finish + smooth FX)
(function(){
  const STORE_PROGRESS = 'bh.quizProgress.v1';
  const STORE_BADGES   = 'bh.badges.v1';

  /** =====================  DANE QUIZÓW  ===================== **/
  const QUIZZES = [
    {
      id:'choking',
      title:'Zadławienie (dorosły)',
      desc:'Kaszel, uderzenia w plecy, uciśnięcia nadbrzusza.',
      q: [
        {q:'Ktoś się dławi i nie może mówić. Co robisz najpierw?',
         a:[['Zachęć do kaszlu; jeśli nieskuteczny — 5 uderzeń w plecy',1],
            ['Daj wodę, by popchnąć kęs',0],
            ['„Ślepy” manewr palcem do gardła',0]]},
        {q:'Po 5 uderzeniach w plecy dalej się dławi. Co dalej?',
         a:[['5 uciśnięć nadbrzusza (Heimlich)',1],
            ['Ułóż na plecach i unieś nogi',0],
            ['Podaj tabletki przeciwbólowe',0]]},
        {q:'Traci przytomność. Co robisz?',
         a:[['Wezwij pomoc i rozpocznij RKO 30:2, użyj AED gdy dostępny',1],
            ['Spróbuj dalej poić wodą',0],
            ['Czekaj bez działań',0]]}
      ]
    },
    {
      id:'cpr',
      title:'RKO (CPR) — dorosły',
      desc:'Tempo 100–120/min, głębokość 5–6 cm, środek mostka.',
      q: [
        {q:'Gdzie prowadzimy uciski?',
         a:[['W środku klatki (na środku mostka)',1],['Pod lewą piersią',0],['Na brzuchu',0]]},
        {q:'Jakie tempo ucisków?',
         a:[['100–120/min',1],['40/min',0],['160/min',0]]},
        {q:'Głębokość ucisku u dorosłego?',
         a:[['Około 5–6 cm',1],['1–2 cm',0],['>8 cm',0]]}
      ]
    },
    {
      id:'recovery',
      title:'Pozycja bezpieczna',
      desc:'Gdy oddycha, ale jest nieprzytomny.',
      q: [
        {q:'Kiedy pozycja bezpieczna jest właściwa?',
         a:[['Gdy oddycha prawidłowo, ale nie reaguje',1],['Gdy nie oddycha',0],['Zawsze niezależnie od sytuacji',0]]},
        {q:'Co robisz z głową poszkodowanego?',
         a:[['Utrzymujesz drożność, lekkie odchylenie do tyłu',1],['Mocno zginamy do klatki',0],['Nic',0]]},
        {q:'Co dalej po ułożeniu?',
         a:[['Kontrola oddechu i wzywasz pomoc',1],['Zostawiasz bez nadzoru',0],['Podajesz napój',0]]}
      ]
    },
    {
      id:'bleeding',
      title:'Krwotok',
      desc:'Ucisk bezpośredni, opatrunek, uniesienie.',
      q: [
        {q:'Pierwsze działanie przy silnym krwotoku?',
         a:[['Ucisk bezpośredni na miejsce krwawienia',1],['Przemywanie wodą 10 minut',0],['Owijanie ciasnym paskiem „gdzieś”, byle ciasno',0]]},
        {q:'Gdy opatrunek przemaka krwią?',
         a:[['Dokładasz kolejne warstwy i uciskasz',1],['Zrywasz stary opatrunek',0],['Nic, czekasz',0]]},
        {q:'Kiedy opaska uciskowa?',
         a:[['Przy masywnych krwotokach i braku kontroli uciskiem',1],['Zawsze na drobne skaleczenie',0],['Nigdy',0]]}
      ]
    },
    {
      id:'burns',
      title:'Oparzenia',
      desc:'Chłodzenie 20 minut, jałowy opatrunek, bez lodu.',
      q: [
        {q:'Jak chłodzić oparzenie?',
         a:[['Chłodna bieżąca woda ~20 minut',1],['Lód bezpośrednio na skórę',0],['Tłuszcz/maść od razu',0]]},
        {q:'Pęcherze po oparzeniu?',
         a:[['Nie przebijać, okryć jałowo',1],['Przebić, żeby spuścić płyn',0],['Przykleić taśmą',0]]},
        {q:'Kiedy wezwać pomoc?',
         a:[['Rozległe/chemiczne/elektryczne, oparzenia dróg oddechowych, dzieci',1],['Nigdy',0],['Tylko gdy boli',0]]}
      ]
    }
  ];

  /** =====================  UTIL  ===================== **/
  const shuffle = (arr)=>{ const a=[...arr]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
  const load = (k, d)=>{ try{ return JSON.parse(localStorage.getItem(k)) ?? d; }catch(_){ return d; } };
  const save = (k, v)=> localStorage.setItem(k, JSON.stringify(v));
  const vibrate = (ms)=>{ try{ navigator.vibrate && navigator.vibrate(ms); }catch(_){ } };

  /** =====================  STAN / PAMIĘĆ  ===================== **/
  const progress = load(STORE_PROGRESS, {}); // { quizId: true/false }
  const badges   = load(STORE_BADGES, {});

  /** =====================  RENDER LISTY  ===================== **/
  const listEl = document.getElementById('quizList');
  const badgeBox = document.getElementById('badgeBox');
  const allPassed = ()=> QUIZZES.every(q=> !!progress[q.id]);

  function updateBadge(){
    if(allPassed()){
      badges.ratownik = true;
      save(STORE_BADGES, badges);
      badgeBox.style.display = 'inline-flex';
      try{ confettiLight(); }catch(_){}
    }else{
      badgeBox.style.display = badges.ratownik ? 'inline-flex':'none';
    }
  }

  function renderList(){
    listEl.innerHTML = '';
    QUIZZES.forEach(q=>{
      const card = document.createElement('article');
      card.className = 'qcard';
      card.innerHTML = `
        <div class="inner">
          <h3>${q.title}</h3>
          <p>${q.desc}</p>
          <div class="meta">
            <span class="${progress[q.id]?'pill-ok':'pill-todo'}">${progress[q.id]?'Zaliczone':'Do zrobienia'}</span>
            <button class="btn primary" data-id="${q.id}">Rozpocznij</button>
          </div>
        </div>`;
      listEl.appendChild(card);
    });
  }

  /** =====================  MODAL / LOGIKA QUIZU  ===================== **/
  const modal = document.getElementById('quizModal');
  const btnClose = document.getElementById('quizClose');
  const titleEl = document.getElementById('quizTitle');
  const qEl = document.getElementById('quizQuestion');
  const aEl = document.getElementById('quizAnswers');
  const stepEl = document.getElementById('quizStep');
  const totalEl = document.getElementById('quizTotal');
  const cursor = document.getElementById('quizCursor');
  const btnNext = document.getElementById('quizNext');
  const btnRestart = document.getElementById('quizRestart');
  const winEl = document.getElementById('quizWin');

  let active = null;   // obiekt quizu
  let step = 0;        // indeks pytania
  let correct = [];    // tablica true/false
  let shuffledQ = [];  // (opcjonalnie) pytania potasowane – na razie zostawiamy kolejność

  function setProgressBar(){
    const total = active.q.length || 1;
    stepEl.textContent = (step+1);
    totalEl.textContent = total;
    cursor.style.left = (6 + (step/((total-1)||1))*88) + '%';
  }

  function renderQuestion(){
    const item = shuffledQ[step];
    qEl.textContent = item.q;
    aEl.innerHTML = '';
    aEl.dataset.lock = '';
    winEl.setAttribute('aria-hidden','true');

    const shuffledA = shuffle(item.a); // <= TASUJEMY ODPOWIEDZI
    shuffledA.forEach(([text, ok])=>{
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = text;
      b.addEventListener('click', ()=>{
        if(aEl.dataset.lock) return;
        aEl.dataset.lock = '1';

        if(ok){
          b.classList.add('ok','pulse-ok');
          correct[step] = true;
          vibrate(60);
        }else{
          b.classList.add('bad','shake-bad');
          correct[step] = false;
          vibrate(140);
        }

        // Odsłoń które były OK
        Array.from(aEl.children).forEach(btn=>{
          if(btn === b) return;
          const t = btn.textContent;
          const pair = shuffledA.find(([tt])=>tt===t);
          if(pair && pair[1]) btn.classList.add('ok','soft-ok');
        });

        // Jeżeli to ostatnie pytanie — kończymy bez „Dalej”
        const last = (step >= shuffledQ.length - 1);
        if(last){
          btnNext.style.display = 'none';
          setTimeout(finishQuiz, 600);
        }else{
          btnNext.style.display = '';
        }
      });
      aEl.appendChild(b);
    });

    // Ustaw podpis przycisku „Dalej” / „Zakończ” + widoczność
    const last = (step >= shuffledQ.length - 1);
    btnNext.textContent = last ? 'Zakończ' : 'Dalej';
    btnNext.style.display = last ? 'none' : ''; // ukryj na ostatnim pytaniu
    setProgressBar();
  }

  function openQuiz(id){
    active = QUIZZES.find(x=>x.id===id);
    // Kolejność pytań zostawiamy stałą (jeśli chcesz, podmień na shuffle(active.q))
    shuffledQ = [...active.q];
    step = 0; correct = new Array(shuffledQ.length).fill(false);
    titleEl.textContent = active.title;
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    renderQuestion();
  }

  function closeQuiz(){
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  function finishQuiz(){
    const passed = correct.every(Boolean);
    winEl.setAttribute('aria-hidden', passed ? 'false':'true');
    if(passed){
      progress[active.id] = true;
      save(STORE_PROGRESS, progress);
      renderList();
      updateBadge();
      try{ confettiLight(); }catch(_){}
    }
  }

  btnClose.addEventListener('click', closeQuiz);
  modal.addEventListener('click', (e)=>{ if(e.target === modal) closeQuiz(); });
  btnRestart.addEventListener('click', ()=>{
    step=0; correct = new Array(shuffledQ.length).fill(false);
    renderQuestion();
  });

  btnNext.addEventListener('click', ()=>{
    if(!aEl.dataset.lock){
      // nic nie wybrano -> subtelny sygnał
      vibrate(60);
      return;
    }
    if(step < shuffledQ.length - 1){
      step++;
      renderQuestion();
    }else{
      // teoretycznie ukryte, ale zostawiamy bezpiecznik
      finishQuiz();
    }
  });

  // Akcje na kartach listy
  listEl.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-id]');
    if(!btn) return;
    openQuiz(btn.getAttribute('data-id'));
  });

  // lekkie „konfetti”
  function confettiLight(){
    const c = document.createElement('canvas'); c.width=innerWidth; c.height=innerHeight;
    Object.assign(c.style,{position:'fixed',inset:'0',pointerEvents:'none',zIndex:10001});
    document.body.appendChild(c);
    const ctx=c.getContext('2d');
    let parts=Array.from({length:120},()=>({
      x:Math.random()*c.width, y:-20,
      vx:-1+Math.random()*2, vy:2+Math.random()*2.5,
      size:3+Math.random()*4, rot:Math.random()*6, vr:-.2+Math.random()*.4,
      color:['#5eead4','#a46bff','#ffd16c','#ffffff'][Math.floor(Math.random()*4)],
      life:100
    }));
    (function tick(){
      ctx.clearRect(0,0,c.width,c.height);
      parts.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr; p.vy+=0.02; p.life--;
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot);
        ctx.fillStyle=p.color; ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);
        ctx.restore();
      });
      parts=parts.filter(p=>p.life>0);
      if(parts.length) requestAnimationFrame(tick); else c.remove();
    })();
  }

  // start
  renderList();
  updateBadge();
})();
