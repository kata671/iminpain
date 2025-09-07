/* Boli Help – moduł quizów, odznaka „Ratownik”
   Zapis postępu w localStorage: bh_quiz_progress, bh_badges
*/

(function(){
  const QUIZZES = [
    {
      id:'zadlawienie',
      title:'Zadławienie – dorośli',
      questions:[
        {q:'Ktoś kaszle nieskutecznie i nie może mówić. Co robisz najpierw?',
         a:[
           {t:'Zachęcam do kaszlu; jeśli nieskuteczne — 5 uderzeń między łopatki', ok:true, hint:'Najpierw kaszel. Potem uderzenia w plecy.'},
           {t:'Podaję wodę, żeby popchnąć kęs', ok:false, hint:'Woda może pogorszyć sytuację.'},
           {t:'Wkładam palec i „na ślepo” próbuję wyjąć', ok:false, hint:'Nigdy nie „wymiataj” na ślepo.'}
         ]},
        {q:'Po 5 uderzeniach brak efektu. Co dalej?',
         a:[
           {t:'5 uciśnięć nadbrzusza (chwyt Heimlicha), na zmianę z uderzeniami', ok:true, hint:'Tak. 5↔5 do skutku.'},
           {t:'Układam na plecach i czekam', ok:false, hint:'To może zamknąć drogi oddechowe.'},
           {t:'Daję coś do picia', ok:false, hint:'Nie podajemy płynów.'}
         ]},
        {q:'Utrata przytomności. Co robisz?',
         a:[
           {t:'Rozpoczynam RKO, wzywam 112, organizuję AED', ok:true, hint:'RKO 30:2, 112/AED.'},
           {t:'Szarpnięcia za ręce i czekanie', ok:false, hint:'Bezzwłocznie RKO.'},
           {t:'Układam w pozycji bocznej', ok:false, hint:'Brak oddechu → RKO, nie pozycja boczna.'}
         ]},
      ]
    },
    {
      id:'rko',
      title:'RKO – dorośli',
      questions:[
        {q:'Częstość uciśnięć klatki piersiowej to…',
         a:[
           {t:'100–120/min', ok:true, hint:'Zgadza się: 100–120/min.'},
           {t:'40/min', ok:false, hint:'Za wolno.'},
           {t:'Dowolna', ok:false, hint:'Musi być 100–120/min.'}
         ]},
        {q:'Głębokość ucisku klatki piersiowej u dorosłego:',
         a:[
           {t:'Ok. 5–6 cm w centrum mostka', ok:true, hint:'Tak.'},
           {t:'1–2 cm gdziekolwiek', ok:false, hint:'Za płytko i w złym miejscu.'},
           {t:'Mocno jak się da, na żebra', ok:false, hint:'Celujemy w środek mostka, kontrola głębokości.'}
         ]},
        {q:'Stosunek uciśnięć do oddechów (jeśli wykonujesz oddechy ratownicze):',
         a:[
           {t:'30:2', ok:true, hint:'Tak.'},
           {t:'5:1', ok:false, hint:'Nie.'},
           {t:'2:30', ok:false, hint:'Odwrotnie.'}
         ]}
      ]
    },
    {
      id:'pozycja',
      title:'Pozycja bezpieczna',
      questions:[
        {q:'Nieprzytomny oddycha prawidłowo. Co robisz?',
         a:[
           {t:'Układam w pozycji bezpiecznej i kontroluję oddech', ok:true, hint:'Tak.'},
           {t:'Zostawiam na plecach', ok:false, hint:'Ryzyko niedrożności.'},
           {t:'Podaję napój i czekam', ok:false, hint:'Nie podajemy płynów.'}
         ]},
        {q:'W której sytuacji NIE układasz w pozycji bezpiecznej?',
         a:[
           {t:'Gdy brak oddechu – zamiast tego RKO', ok:true, hint:'Brak oddechu = RKO.'},
           {t:'Gdy oddycha i nie reaguje', ok:false, hint:'Wtedy właśnie tak robimy.'},
           {t:'Gdy czekasz na pogotowie', ok:false, hint:'Zwykle tak, jeśli oddech jest.'}
         ]},
        {q:'Pozycja boczna wymaga…',
         a:[
           {t:'Stałej kontroli oddechu', ok:true, hint:'Kontroluj ciągle oddech.'},
           {t:'Braku kontroli', ok:false, hint:'Wręcz przeciwnie.'},
           {t:'Podania napojów', ok:false, hint:'Nie.'}
         ]}
      ]
    },
    {
      id:'pierwsza',
      title:'ABC pierwszej pomocy',
      questions:[
        {q:'Co oznacza ABC?',
         a:[
           {t:'Airway, Breathing, Circulation', ok:true, hint:'Drożność, oddech, krążenie.'},
           {t:'Always Be Cool', ok:false, hint:'Niestety nie to.'},
           {t:'Alarm, Bandaż, Chłodzenie', ok:false, hint:'Nie w tym skrócie.'}
         ]},
        {q:'Krwiak tętniczy z dużym krwotokiem – co najpierw?',
         a:[
           {t:'Uciśnij bezpośrednio miejsce krwawienia', ok:true, hint:'Tak.'},
           {t:'Szukanie gazy przez 5 minut', ok:false, hint:'Czas = życie. Ucisk natychmiast.'},
           {t:'Podaj picie', ok:false, hint:'Nie.'}
         ]},
        {q:'Oparzenie świeże, co robisz?',
         a:[
           {t:'Chłodzenie bieżącą wodą ~20 min', ok:true, hint:'Zgadza się.'},
           {t:'Masło/maść', ok:false, hint:'Nie smarujemy.'},
           {t:'Przemycie alkoholem', ok:false, hint:'Absolutnie nie.'}
         ]}
      ]
    }
  ];

  // DOM
  const tbody = document.getElementById('tbody');
  const badge = document.getElementById('badge');
  const qwrap = document.getElementById('qwrap');
  const idle  = document.getElementById('idle');
  const qtitle= document.getElementById('qtitle');
  const answersEl = document.getElementById('answers');
  const stepEl = document.getElementById('step');
  const totalEl= document.getElementById('total');
  const cursor = document.getElementById('cursor');
  const btnPrev= document.getElementById('prev');
  const btnNext= document.getElementById('next');
  const btnFinish=document.getElementById('finish');
  const hintEl = document.getElementById('hint');

  // storage helpers
  const LS = {
    get(k,def){ try{ return JSON.parse(localStorage.getItem(k)) ?? def }catch(_){ return def } },
    set(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
  };
  const KEY='bh_quiz_progress';
  const BAD='bh_badges';

  // progress structure: { [quizId]: {best:number} }
  let progress = LS.get(KEY, {});
  let active = null; // {quiz, idx, chosen, score}

  function allPassed(){
    return QUIZZES.every(q => (progress[q.id]?.best === 100));
  }
  function updateBadge(){
    if(allPassed()){
      const badges = LS.get(BAD,{});
      if(!badges.rescuer){
        badges.rescuer = { date: new Date().toISOString() };
        LS.set(BAD, badges);
      }
      badge.setAttribute('aria-hidden','false');
    } else {
      badge.setAttribute('aria-hidden','true');
    }
  }

  function percentRight(chosen){
    const ok = chosen.filter(Boolean).length;
    return Math.round(ok / chosen.length * 100);
  }

  // table render
  function renderTable(){
    tbody.innerHTML='';
    QUIZZES.forEach(q=>{
      const best = progress[q.id]?.best ?? 0;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${q.title}</td>
        <td>${q.questions.length}</td>
        <td>${best===100? `<span class="okmark">${best}%</span>` : (best? `${best}%` : '<span class="badmark">—</span>')}</td>
        <td><button class="btn" data-start="${q.id}">${best===100?'Powtórz':'Start'}</button></td>
      `;
      tbody.appendChild(tr);
    });

    // attach start handlers
    tbody.querySelectorAll('button[data-start]').forEach(b=>{
      b.addEventListener('click',()=>{
        const id = b.getAttribute('data-start');
        const quiz = QUIZZES.find(x=>x.id===id);
        startQuiz(quiz);
      });
    });

    updateBadge();
  }

  function startQuiz(quiz){
    active = {
      quiz,
      idx:0,
      chosen:new Array(quiz.questions.length).fill(null) // true/false per question
    };
    idle.style.display='none';
    qwrap.setAttribute('aria-hidden','false');
    renderQ();
  }

  function renderQ(){
    const q = active.quiz.questions[active.idx];
    qtitle.textContent = q.q;
    answersEl.innerHTML='';
    hintEl.textContent='';
    totalEl.textContent = active.quiz.questions.length;
    stepEl.textContent = (active.idx+1);
    cursor.style.left = (6 + (active.idx / (active.quiz.questions.length-1 || 1))*88) + '%';

    q.a.forEach(opt=>{
      const el = document.createElement('button');
      el.type='button';
      el.className='ans';
      el.textContent=opt.t;
      el.addEventListener('click', ()=>{
        // lock only for current Q – można zmienić wybór
        const ok = !!opt.ok;
        active.chosen[active.idx] = ok;
        // highlight wybór
        answersEl.querySelectorAll('.ans').forEach(a=>a.classList.remove('ok','bad'));
        el.classList.add(ok?'ok':'bad');
        hintEl.textContent = opt.hint || '';
        // micro vibra
        try{ navigator.vibrate && navigator.vibrate(ok?80:160); }catch(_){}
      });
      answersEl.appendChild(el);
    });

    btnPrev.disabled = (active.idx===0);
    btnNext.disabled = (active.idx===active.quiz.questions.length-1);
  }

  btnPrev.addEventListener('click', ()=>{
    if(!active) return;
    if(active.idx>0){ active.idx--; renderQ(); }
  });
  btnNext.addEventListener('click', ()=>{
    if(!active) return;
    if(active.idx<active.quiz.questions.length-1){ active.idx++; renderQ(); }
  });
  btnFinish.addEventListener('click', ()=>{
    if(!active) return;
    // tylko jeśli wszystkie pytania mają wybrany wariant:
    if(active.chosen.some(v=>v===null)){
      hintEl.textContent = 'Odpowiedz na wszystkie pytania, aby zakończyć.';
      return;
    }
    const p = percentRight(active.chosen);
    // zapisz best
    const prev = progress[active.quiz.id]?.best ?? 0;
    progress[active.quiz.id] = { best: Math.max(prev, p) };
    LS.set(KEY, progress);

    // komunikat
    const div = document.createElement('div');
    div.className='chip';
    div.innerHTML = p===100 ? `✅ Wynik ${p}% — świetnie!` : `ℹ️ Wynik ${p}%. Spróbuj dojść do 100%.`;
    answersEl.appendChild(div);

    renderTable();
  });

  renderTable();
})();
