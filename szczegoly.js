// szczegoly.js — eleganckie karty z emoji
(function(){
  const QID = new URLSearchParams(location.search).get("id");

  (function injectCSS(){
    if (document.getElementById("szczegoly-css")) return;
    const s = document.createElement("style");
    s.id = "szczegoly-css";
    s.textContent = `
      .cards {display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:20px;}
      .card {background:rgba(34,42,90,.85);border:1px solid rgba(165,140,255,.25);border-radius:16px;padding:16px;box-shadow:0 4px 12px rgba(0,0,0,.25);}
      .card:hover {box-shadow:0 6px 18px rgba(0,0,0,.4);}
      .card.emergency {background:rgba(120,8,8,.22);border:1.5px solid #ff3c3c;}
      .card.emergency:hover {box-shadow:0 0 25px rgba(255,50,50,.9);}
      .label {display:inline-block;padding:6px 10px;border-radius:12px;background:rgba(165,140,255,.1);border:1px solid rgba(165,140,255,.25);margin-bottom:8px;}
      .label.red {background:rgba(255,80,80,.15);border-color:rgba(255,80,80,.45);}
      @media(max-width:980px){.cards{grid-template-columns:repeat(2,1fr);}}
      @media(max-width:640px){.cards{grid-template-columns:1fr;}}
    `;
    document.head.appendChild(s);
  })();

  function el(tag, cls, html){const e=document.createElement(tag);if(cls)e.className=cls;if(html)e.innerHTML=html;return e;}
  function listCard(title,emoji,items,cls){
    if(!items||!items.length)return null;
    const c=el("div","card"+(cls?(" "+cls):""));
    c.appendChild(el("div","label"+(cls==="emergency"?" red":""),`${emoji} <strong>${title}</strong>`));
    const ul=el("ul");
    items.forEach(t=>ul.appendChild(el("li",null,t)));
    c.appendChild(ul);return c;
  }

  async function fetchJSON(){
    const paths=["/data/detailed_conditions.json","data/detailed_conditions.json"];
    for(const p of paths){
      try{const r=await fetch(p+"?ts="+Date.now());if(r.ok)return await r.json();}catch(e){}
    }
    return null;
  }

  async function render(){
    const content=document.getElementById("content");if(!content||!QID)return;
    const data=await fetchJSON();if(!data||!data[QID]){content.innerHTML="<p>Brak danych.</p>";return;}
    const node=data[QID];document.getElementById("title").textContent=node.title||QID;

    const grid=el("div","cards");
    grid.appendChild(listCard("Przyczyny","🔎",node.causes));
    grid.appendChild(listCard("Objawy","🔎",node.symptoms));
    grid.appendChild(listCard("⚠️ Obawy","⚠️",node.concerns));
    grid.appendChild(listCard("Lekarze","👩‍⚕️",node.doctors));
    grid.appendChild(listCard("Leki","💊",node.medications));
    grid.appendChild(listCard("Pierwsza pomoc","🆘",node.first_aid));
    grid.appendChild(listCard("🚨 Niezwłoczna pomoc","🚨",node.emergency,"emergency"));
    grid.appendChild(listCard("Opis","ℹ️",[node.description]));
    grid.appendChild(listCard("Ćwiczenia","🏃",node.exercises));
    grid.appendChild(listCard("Czego unikać","❌",node.avoid));
    grid.appendChild(listCard("Profilaktyka","✅",node.prevention));
    grid.appendChild(listCard("Najczęstsze błędy","⚠️",node.mistakes));
    content.innerHTML="";content.appendChild(grid);
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",render);else render();
})();
