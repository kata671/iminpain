/*! Boli Help – Atlas Addon (toolbar + ulubione + AI podpowiedź)
    Drop-in: <script src="assets/boli-atlas.bundle.js" defer></script>
*/
(function(){
  if (window.__bhAtlasBundle) return; window.__bhAtlasBundle = true;

  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  const CSS = `
  .bh-atlas-toolbar{display:grid;gap:10px;margin:10px 0 14px}
  .bh-atlas-toolbar input[type="search"]{
    width:100%; padding:10px 12px; border-radius:12px;
    border:1px solid rgba(255,255,255,.22);
    background:rgba(255,255,255,.06); color:#fff; font-weight:700;
  }
  .bh-chiprow{display:flex;flex-wrap:wrap;gap:8px}
  .bh-chiprow .chip{
    appearance:none;border:1px solid rgba(255,255,255,.22); background:rgba(255,255,255,.06);
    padding:6px 10px;border-radius:999px;color:#eaf2ff;cursor:pointer;font-weight:800
  }
  .bh-chiprow .chip[aria-pressed="true"]{
    border-color:rgba(164,107,255,.75);
    box-shadow:0 0 0 1px rgba(164,107,255,.45) inset, 0 0 18px rgba(164,107,255,.30)
  }
  .bh-toolbar-actions{display:flex;gap:8px;flex-wrap:wrap}
  .bh-toolbar-actions button{
    appearance:none;border:1px solid rgba(255,255,255,.22); background:rgba(255,255,255,.06);
    padding:8px 12px;border-radius:12px;color:#fff;font-weight:900;cursor:pointer
  }
  .bh-toolbar-actions button:hover{transform:translateY(-1px)}

  .thumb{position:relative}
  .thumb .fav{
    position:absolute; top:8px; right:8px;
    width:32px;height:32px;border-radius:999px;display:grid;place-items:center;
    background:rgba(14,18,48,.55); border:1px solid rgba(255,255,255,.2); cursor:pointer;
    user-select:none; font-size:16px
  }
  .thumb .fav[aria-pressed="true"]{ background:rgba(255,110,199,.28); border-color:rgba(255,110,199,.6) }
  .bh-hidden{display:none !important}

  .bh-ai{position:fixed;inset:0;z-index:9999;background:rgba(14,18,48,.8);backdrop-filter:blur(4px);display:none}
  .bh-ai[aria-hidden="false"]{display:block}
  .bh-ai__panel{max-width:680px;margin:6vh auto;background:rgba(60,32,100,.36);
    border:1px solid rgba(164,107,255,.28); border-radius:16px; padding:14px; color:#fff}
  .bh-ai__head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
  .bh-ai__label{display:block;margin:8px 0;font-weight:800}
  #bhAiInput{width:100%;border-radius:12px;border:1px solid rgba(255,255,255,.22);
    background:rgba(255,255,255,.06);color:#fff;padding:10px 12px}
  .bh-ai__actions{margin:10px 0}
  .bh-ai__actions button{appearance:none;border:1px solid rgba(164,107,255,.45);
    background:rgba(255,255,255,.08);padding:8px 12px;border-radius:12px;color:#fff;font-weight:900;cursor:pointer}
  .bh-ai__out{margin-top:8px}
  .bh-ai__out .pill{display:inline-block;margin:4px 6px 0 0;padding:6px 10px;border-radius:999px;
    border:1px solid rgba(164,107,255,.45);background:rgba(255,255,255,.06)}
  `;

  function injectCSS(){
    const tag = document.createElement('style');
    tag.id = 'bh-atlas-bundle-css';
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }

  function makeToolbar(){
    const wrap = document.createElement('div');
    wrap.id = 'bhAtlasToolbar';
    wrap.className = 'bh-atlas-toolbar';
    wrap.setAttribute('aria-label','Narzędzia atlasu');
    wrap.innerHTML = `
      <input id="bhAtlasSearch" type="search" placeholder="Szukaj części ciała…" aria-label="Szukaj w atlasie">
      <div class="bh-chiprow" id="bhAtlasChips" role="tablist" aria-label="Filtry grup"></div>
      <div class="bh-toolbar-actions">
        <button id="bhAtlasFavToggle" type="button" aria-pressed="false">❤ Ulubione</button>
        <button id="bhAtlasAI" type="button">🤖 AI podpowiedź</button>
      </div>
    `;
    return wrap;
  }

  function makeAIModal(){
    const modal = document.createElement('div');
    modal.id='bhAiModal'; modal.className='bh-ai'; modal.setAttribute('aria-hidden','true');
    modal.setAttribute('role','dialog'); modal.setAttribute('aria-modal','true');
    modal.innerHTML = `
      <div class="bh-ai__panel">
        <div class="bh-ai__head">
          <strong>🤖 AI podpowiedź</strong>
          <button type="button" id="bhAiClose">✕</button>
        </div>
        <label for="bhAiInput" class="bh-ai__label">Opisz krótko objaw (np. "kłucie za mostkiem", "ból kolana")</label>
        <textarea id="bhAiInput" rows="3" placeholder="Wpisz opis objawu…"></textarea>
        <div class="bh-ai__actions">
          <button id="bhAiRun" type="button">Podpowiedz części</button>
        </div>
        <div id="bhAiOut" class="bh-ai__out" aria-live="polite"></div>
      </div>`;
    document.body.appendChild(modal);
    return modal;
  }

  function init(){
    const grid = document.getElementById('bhThumbs');
    if(!grid) return; // nie ta strona
    injectCSS();

    // Wstaw toolbar nad siatką
    const toolbar = makeToolbar();
    grid.parentNode.insertBefore(toolbar, grid);

    // Chips z BODYMAP.groups jeśli dostępne
    const chips = document.getElementById('bhAtlasChips');
    const favBtn = document.getElementById('bhAtlasFavToggle');
    const search = document.getElementById('bhAtlasSearch');

    const groups = (window.BODYMAP && window.BODYMAP.groups) ? window.BODYMAP.groups : null;
    const items  = (window.BODYMAP && window.BODYMAP.items)  ? window.BODYMAP.items  : [];
    const partById = new Map(items.map(it=>[it.id, it]));
    const state = { groups:new Set(), query:'', favOnly:false };

    if(groups){
      Object.entries(groups).forEach(([key,label])=>{
        const b=document.createElement('button');
        b.type='button'; b.className='chip'; b.textContent=label; b.dataset.group=key; b.setAttribute('aria-pressed','false');
        b.addEventListener('click', ()=>{
          if(state.groups.has(key)){ state.groups.delete(key); b.setAttribute('aria-pressed','false'); }
          else { state.groups.add(key); b.setAttribute('aria-pressed','true'); }
          applyFilter();
        });
        chips.appendChild(b);
      });
    }

    search.addEventListener('input', ()=>{ state.query=(search.value||'').toLowerCase().trim(); applyFilter(); });
    favBtn.addEventListener('click', ()=>{
      const on = favBtn.getAttribute('aria-pressed')==='true';
      favBtn.setAttribute('aria-pressed', on?'false':'true');
      state.favOnly=!on; applyFilter();
    });

    // Ulubione
    const LS='bh.fav.parts';
    const getFav=()=>{ try{return JSON.parse(localStorage.getItem(LS)||'[]')}catch(e){return[]} };
    const setFav=(a)=>localStorage.setItem(LS, JSON.stringify(a));
    const isFav=(id)=>getFav().includes(id);

    function ensureFavButtons(){
      grid.querySelectorAll('a.thumb').forEach(a=>{
        if(a.querySelector('.fav')) return;
        const u = new URL(a.href, location.href);
        const id = u.searchParams.get('czesc') || '';
        const btn = document.createElement('button');
        btn.className='fav'; btn.type='button'; btn.setAttribute('aria-pressed', isFav(id)?'true':'false'); btn.title='Ulubione';
        btn.textContent='❤';
        btn.addEventListener('click',(e)=>{
          e.preventDefault(); e.stopPropagation();
          const arr=getFav(); const i=arr.indexOf(id);
          if(i>=0){ arr.splice(i,1); btn.setAttribute('aria-pressed','false'); }
          else { arr.push(id); btn.setAttribute('aria-pressed','true'); }
          setFav(arr); if(state.favOnly) applyFilter();
        });
        a.appendChild(btn);
      });
    }

    function matchQuery(it, q){
      if(!q) return true;
      const hay = [it.pl,it.en,it.id].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    }
    function inGroups(it){
      if(!groups || state.groups.size===0) return true;
      return state.groups.has(it.group);
    }

    function applyFilter(){
      const favs = state.favOnly ? new Set(getFav()) : null;
      grid.querySelectorAll('a.thumb').forEach(a=>{
        const u = new URL(a.href, location.href);
        const id = u.searchParams.get('czesc') || '';
        const it = partById.get(id) || {id, pl:a.textContent.trim(), en:a.textContent.trim(), group:null};
        let show = true;
        if(state.query && !matchQuery(it, state.query)) show=false;
        if(!inGroups(it)) show=false;
        if(favs && !favs.has(id)) show=false;
        a.classList.toggle('bh-hidden', !show);
      });
    }

    ensureFavButtons(); applyFilter();

    // AI modal
    const aiBtn = document.getElementById('bhAtlasAI');
    const ai = makeAIModal();
    const aiClose = document.getElementById('bhAiClose');
    const aiRun   = document.getElementById('bhAiRun');
    const aiInput = document.getElementById('bhAiInput');
    const aiOut   = document.getElementById('bhAiOut');

    aiBtn.addEventListener('click', ()=>{ ai.setAttribute('aria-hidden','false'); aiInput.focus(); });
    aiClose.addEventListener('click', ()=>{ ai.setAttribute('aria-hidden','true'); aiOut.innerHTML=''; aiInput.value=''; });
    ai.addEventListener('click', (e)=>{ if(e.target===ai) aiClose.click(); });

    const RULES = [
      {kw:/most(ek|ku)|za mostk/i, parts:['mostek','serce','pluca','klatka']},
      {kw:/klatka|duszno|oddech|kaszel|świst|swist|astma/i, parts:['pluca','klatka']},
      {kw:/kolan/i, parts:['kolano']},
      {kw:/kostk|skręcen|skrecen|zwichn/i, parts:['kostka']},
      {kw:/bark|ramie|rotator/i, parts:['bark','ramie']},
      {kw:/nadgarst|cieśn|piesn|drętw| dretw/i, parts:['nadgarstek','dłoń','palce_dlon']},
      {kw:/krzyż|lędźw|ledzwi|rwa kulsz/i, parts:['odc_ledzwiowy','plecy']},
      {kw:/migren|ból głow|bol glowy|zawrot/i, parts:['glowa','mozg']},
      {kw:/gard|angin|chryp|połyk|poly/i, parts:['gardlo','krtań','jama_ustna']},
      {kw:/zatok|katar|nos/i, parts:['zatoki','nos']},
      {kw:/brzuch|mdł|mdl|wymiot|nudno|biegun|zgag/i, parts:['brzuch','zoladek','jelito_cienkie','jelito_grube']},
      {kw:/pachwin|biodr|ud/o, parts:['biodra','udo']},
      {kw:/serc|kołatan|kolatan|arytmi/i, parts:['serce','aorta']},
      {kw:/nerk|lędźwi|ledzwi|kolka nerk/i, parts:['nerki']},
      {kw:/skór|wysyp|świąd|swia|alerg/i, parts:['skora']},
    ];

    function suggestParts(text){
      const s=(text||'').toLowerCase(); const set=new Set();
      RULES.forEach(r=>{ if(r.kw.test(s)) r.parts.forEach(p=>set.add(p)); });
      return Array.from(set);
    }

    aiRun.addEventListener('click', ()=>{
      const ids = suggestParts(aiInput.value);
      aiOut.innerHTML='';
      if(!ids.length){ aiOut.textContent='Brak sugestii — spróbuj opisać konkretniej.'; return; }
      ids.forEach(id=>{ const pill=document.createElement('span'); pill.className='pill'; pill.textContent=id; aiOut.appendChild(pill); });
      grid.querySelectorAll('a.thumb').forEach(a=>{
        const u = new URL(a.href, location.href);
        const id = u.searchParams.get('czesc') || '';
        if(ids.includes(id)){
          a.style.outline='2px solid rgba(94,234,212,.8)';
          a.style.boxShadow='0 0 0 2px rgba(94,234,212,.6), 0 0 24px rgba(94,234,212,.35)';
          a.scrollIntoView({block:'nearest', behavior:'smooth'});
        }else{
          a.style.outline=''; a.style.boxShadow='';
        }
      });
    });
  }

  ready(init);
})();
