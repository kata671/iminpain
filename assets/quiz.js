// assets/quizy.js
(function(){
  // ===== Dane quizów =====
  const QUIZZES = [
    {
      id: 'zadlawienie',
      title: 'Zadławienie (SOS)',
      desc: 'Kaszel, uderzenia w plecy, nadbrzusze i kiedy RKO.',
      questions: [
        {
          q: 'Ktoś się dławi i nie może mówić. Co robisz najpierw?',
          a: [
            {t:'Zachęcam do kaszlu; jeśli nieskuteczny — 5 uderzeń w plecy', ok:true},
            {t:'Podaję wodę, żeby popchnąć kęs', ok:false},
            {t:'Wkładam palec i „na ślepo” próbuję wyjąć', ok:false},
          ],
          ok:'Tak! Najpierw kaszel. Jeśli nieskuteczny → 5 uderzeń w plecy.',
          bad:'Woda/„wymiatanie” palcem może pogorszyć sytuację.'
        },
        {
          q: 'Po 5 uderzeniach w plecy wciąż brak poprawy. Co dalej?',
          a: [
            {t:'5 uciśnięć nadbrzusza (Heimlicha)', ok:true},
            {t:'Kładę poszkodowanego na plecach', ok:false},
            {t:'Czekam bez działania', ok:false},
          ],
          ok:'Dobrze: 5 nadbrzusza, naprzemiennie z uderzeniami w plecy.',
          bad:'Bierne czekanie/pozycja na plecach nie pomaga.'
        },
        {
          q: 'Poszkodowany traci przytomność. Co robisz?',
          a: [
            {t:'RKO 30:2, wezwij 112/AED', ok:true},
            {t:'Układam w pozycji siedzącej', ok:false},
            {t:'Podaję wodę', ok:false},
          ],
          ok:'Tak: RKO 30:2 + 112/AED.',
          bad:'Woda/pozycja siedząca nie są właściwe teraz.'
        }
      ]
    },
    {
      id: 'rko',
      title: 'Reanimacja (RKO)',
      desc: 'Uciskanie 100–120/min, 5–6 cm, centrum mostka.',
      questions: [
        {
          q: 'Brak oddechu u dorosłego. Co z RKO?',
          a: [
            {t:'Ucisk 100–120/min, 5–6 cm, środek mostka', ok:true},
            {t:'Ucisk delikatny 40/min', ok:false},
            {t:'Czekam na karetkę bez ucisków', ok:false},
          ],
          ok:'Właśnie tak. Tempo 100–120/min i 5–6 cm głęboko.',
          bad:'Za wolno/bez ucisków — rozpoczynamy RKO!'
        },
        {
          q: 'Jaki jest zalecany stosunek ucisków do oddechów (jeśli potrafisz)?',
          a: [
            {t:'30 uciśnięć : 2 oddechy', ok:true},
            {t:'10 : 10', ok:false},
            {t:'Bez reguły — jak wyjdzie', ok:false},
          ],
          ok:'Tak: 30:2.',
          bad:'Niepoprawne. Zalecenie: 30:2.'
        },
        {
          q: 'Kiedy przerywasz RKO?',
          a: [
            {t:'Gdy przyjadą służby lub poszkodowany zacznie oddychać', ok:true},
            {t:'Kiedy się zmęczę po 30 sekundach', ok:false},
            {t:'Po 2 minutach zawsze', ok:false},
          ],
          ok:'Tak, tylko z ważnego powodu.',
          bad:'Zbyt wcześnie nie przerywamy.'
        }
      ]
    },
    {
      id: 'pozycja',
      title: 'Pozycja bezpieczna',
      desc: 'Gdy oddycha, ale nie reaguje — ułożenie i kontrola.',
      questions: [
        {
          q: 'Poszkodowany oddycha, ale jest nieprzytomny. Co robisz?',
          a: [
            {t:'Układam w pozycji bezpiecznej i kontroluję oddech', ok:true},
            {t:'Podaję napój i zostawiam siedzącego', ok:false},
            {t:'Kładę na plecach bez kontroli drożności', ok:false},
          ],
          ok:'Świetnie: pozycja bezpieczna + stała kontrola oddechu.',
          bad:'To mogłoby pogorszyć sytuację.'
        },
        {
          q: 'Co z głową/szyją w pozycji bezpiecznej?',
          a: [
            {t:'Utrzymuję drożność i stabilność ułożeniem', ok:true},
            {t:'Brak znaczenia, byle wygodnie', ok:false},
            {t:'Zginam mocno szyję do przodu', ok:false},
          ],
          ok:'Drożność i stabilność są kluczowe.',
          bad:'Nieprawidłowe — pamiętaj o drożności.'
        },
        {
          q: 'Jak często oceniasz oddech w pozycji bezpiecznej?',
          a: [
            {t:'Regularnie (np. co minutę) aż do przyjazdu pomocy', ok:true},
            {t:'Wcale — po ułożeniu sprawa zakończona', ok:false},
            {t:'Tylko jeśli ktoś poprosi', ok:false},
          ],
          ok:'Tak — regularna kontrola.',
          bad:'Kontrola musi być ciągła.'
        }
      ]
    },
    {
      id: 'krwotok',
      title: 'Krwotok',
      desc: 'Silny krwotok = ucisk bezpośredni, uniesienie, opatrunek.',
      questions: [
        {
          q: 'Co robisz najpierw przy silnym krwotoku?',
          a: [
            {t:'Ucisk bezpośredni na ranę', ok:true},
            {t:'Płukanie wodą przez kilka minut', ok:false},
            {t:'Czekam aż samo się zatrzyma', ok:false},
          ],
          ok:'Ucisk to priorytet.',
          bad:'To nie zatrzyma intensywnego krwotoku.'
        },
        {
          q: 'Kiedy rozważasz opaskę uciskową?',
          a: [
            {t:'Gdy ucisk bezpośredni nie działa i krwotok jest zagrażający życiu', ok:true},
            {t:'Zawsze, nawet przy drobnym skaleczeniu', ok:false},
            {t:'Nigdy — opasek się nie stosuje', ok:false},
          ],
          ok:'Tak, w sytuacjach zagrażających życiu.',
          bad:'To nieprawidłowe podejście.'
        },
        {
          q: 'Po opanowaniu krwotoku co dalej?',
          a: [
            {t:'Wezwanie pomocy, obserwacja wstrząsu, uniesienie kończyny (jeśli można)', ok:true},
            {t:'Usunięcie wszystkich opatrunków, żeby zobaczyć ranę', ok:false},
            {t:'Brak dalszych działań', ok:false},
          ],
          ok:'Dobrze — bezpieczeństwo i obserwacja.',
          bad:'Nie wolno niepotrzebnie ruszać opatrunków.'
        }
      ]
    }
  ];

  // ===== Stan/LS =====
  const LS_KEY_PROGRESS = 'bh_quiz_progress_v1'; // { [quizId]: {score: number, passed: bool} }
  const LS_KEY_BADGE    = 'bh_badge_rescuer_v1'; // "true"

  const $ = sel => document.querySelector(sel);

  const grid   = $('#quizGrid');
  const modal  = $('#quizModal');
  const mClose = $('#quizClose');
  const mRestart = $('#quizRestart');
  const mNext  = $('#quizNext');
  const qTitle = $('#quizTitle');
  const qSub   = $('#quizSubtitle');
  const qText  = $('#qText');
  const aWrap  = $('#aWrap');
  const stepEl = $('#quizStep');
  const totalEl= $('#quizTotal');
  const cursor = $('#quizCursor');
  const badgeBox = $('#badgeBox');

  let progress = loadProgress();
  let current = null; // {quiz, step, chosen[]}

  renderGrid();
  updateBadge();

  // ===== Funkcje UI listy =====
  function renderGrid(){
    grid.innerHTML = '';
    QUIZZES.forEach(q=>{
      const pr = progress[q.id] || {};
      const passed = !!pr.passed;
      const score  = pr.score ?? null;

      const card = document.createElement('article');
      card.className = 'qcard';
      card.innerHTML = `
        <div class="qcard__body">
          <div class="qcard__title">${q.title}</div>
          <div class="qcard__desc">${q.desc}</div>
        </div>
        <div class="qcard__foot">
          <span class="pill-status ${passed ? 'pill-ok' : 'pill-new'}">${passed ? 'Zaliczone ✅' : (score===null ? 'Nowy' : 'Do poprawy')}</span>
          <button class="btn" type="button">Rozpocznij</button>
        </div>
      `;
      card.querySelector('button').addEventListener('click', ()=> startQuiz(q));
      grid.appendChild(card);
    });
  }

  function updateBadge(){
    const allPassed = QUIZZES.every(q => progress[q.id]?.passed);
    if(allPassed){
      if(localStorage.getItem(LS_KEY_BADGE)!=='true'){
        localStorage.setItem(LS_KEY_BADGE,'true');
        toast('🏅 Zdobyto odznakę „Ratownik”!');
        confetti(true);
      }
      badgeBox.classList.remove('hidden');
    } else {
      badgeBox.classList.add('hidden');
    }
  }

  // ===== Modal quizu =====
  function startQuiz(quiz){
    current = {quiz, step:0, chosen:new Array(quiz.questions.length).fill(null)};
    openModal(quiz);
    renderStep();
  }

  function openModal(quiz){
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    qTitle.textContent = quiz.title;
    qSub.textContent   = quiz.desc;
    totalEl.textContent= quiz.questions.length;
  }

  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }

  function renderStep(){
    const {quiz, step} = current;
    const item = quiz.questions[step];

    stepEl.textContent = String(step+1);
    cursor.style.left = (6 + (step/((quiz.questions.length-1)||1))*88) + '%';

    qText.textContent = item.q;
    aWrap.innerHTML = '';
    let locked = false;
    item.a.forEach(opt=>{
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ans';
      b.textContent = opt.t;
      b.addEventListener('click', ()=>{
        if(locked) return; locked = true;
        const ok = !!opt.ok;
        current.chosen[step] = ok;
        b.classList.add(ok ? 'correct' : 'wrong');
        const n = document.createElement('div');
        n.className = 'muted';
        n.textContent = ok ? item.ok : item.bad;
        b.after(n);
        try{ navigator.vibrate && navigator.vibrate(ok?80:160);}catch(_){}
        setTimeout(()=> locked=false, 250);
      });
      aWrap.appendChild(b);
    });

    mNext.textContent = (step === quiz.questions.length-1) ? 'Zakończ' : 'Dalej';
  }

  function nextStep(){
    const {quiz, step} = current;
    if(step < quiz.questions.length-1){
      current.step++;
      renderStep();
    } else {
      // wynik
      const score = current.chosen.reduce((s,v)=> s + (v?1:0), 0);
      const total = current.chosen.length;
      const passed = (score === total);
      saveProgress(current.quiz.id, {score, passed});
      closeModal();
      toast(`Wynik: ${score}/${total}${passed ? ' — zaliczone ✅' : ''}`);
      confetti(passed);
      renderGrid();
      updateBadge();
    }
  }

  function restartQuiz(){
    if(!current) return;
    current.step = 0;
    current.chosen = new Array(current.quiz.questions.length).fill(null);
    renderStep();
  }

  // ===== LS =====
  function loadProgress(){
    try{
      return JSON.parse(localStorage.getItem(LS_KEY_PROGRESS) || '{}');
    }catch(_){ return {}; }
  }
  function saveProgress(id, obj){
    progress[id] = Object.assign({}, progress[id] || {}, obj);
    localStorage.setItem(LS_KEY_PROGRESS, JSON.stringify(progress));
  }

  // ===== UX =====
  function toast(msg){
    const t = document.createElement('div');
    t.className = 'award';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(()=> t.remove(), 2600);
  }

  function confetti(celebrate){
    const count = celebrate ? 140 : 90;
    const c=document.createElement('canvas'); c.width=innerWidth; c.height=innerHeight;
    Object.assign(c.style,{position:'fixed',inset:'0',pointerEvents:'none',zIndex:10001});
    document.body.appendChild(c);
    const ctx=c.getContext('2d');
    let parts=Array.from({length: count},()=>({
      x:Math.random()*c.width, y:-20,
      vx:-1+Math.random()*2, vy:2+Math.random()*2.5,
      size:3+Math.random()*4, rot:Math.random()*6, vr:-.2+Math.random()*.4,
      color: celebrate ? ['#5eead4','#a46bff','#ffd16c'][Math.floor(Math.random()*3)] : 'rgba(255,255,255,.9)',
      life: 100
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

  // ===== Zdarzenia =====
  mClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && modal.getAttribute('aria-hidden')==='false') closeModal(); });
  mNext.addEventListener('click', nextStep);
  mRestart.addEventListener('click', restartQuiz);
})();
