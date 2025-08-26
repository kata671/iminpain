// Tworzenie elementów
function el(tag, className, html){ const e=document.createElement(tag); if(className) e.className=className; if(html!==undefined) e.innerHTML=html; return e; }
function list(items){ const ul=document.createElement("ul"); items.forEach(t=>{ const li=document.createElement("li"); li.innerHTML=t; ul.appendChild(li)}); return ul; }

// Karta
function cardFor(key, val, title){
  const c=el("section","card");
  const head=el("div","card__head"); head.appendChild(el("h3","card__title",title)); c.appendChild(head);
  const body=el("div","card__body");

  if(key==="medications" && Array.isArray(val)){
    const fmt=val.map(line=> line
      .replace(/^Bez recepty:/i,'<span class="tag tag--otc">Bez recepty:</span>')
      .replace(/^Na receptę:/i,'<span class="tag tag--rx">Na receptę:</span>')
    );
    body.appendChild(list(fmt));
  } else if(Array.isArray(val)){
    body.appendChild(list(val));
  } else if(typeof val==="string"){
    body.appendChild(el("p","",val));
  }

  c.appendChild(body);

  if(key==="emergency"){
    c.classList.add("emergency");
    c.addEventListener("click",()=>{ window.location.href="pomoc.html"; });
  }
  return c;
}

// KOLEJNOŚĆ (emergency na 2. pozycji)
const sections=[
  {key:"causes",     title:"🔎 Przyczyny"},
  {key:"emergency",  title:"🚨 Niezwłoczna pomoc"},
  {key:"symptoms",   title:"🤕 Objawy"},
  {key:"concerns",   title:"❗ Kiedy się niepokoić"},
  {key:"thresholds", title:"⚠️ Progi alarmowe"},
  {key:"doctors",    title:"👩‍⚕️ Lekarze"},
  {key:"medications",title:"💊 Leki"},
  {key:"first_aid",  title:"⛑️ Pierwsza pomoc"},
  {key:"rehab",      title:"🏃 Rehabilitacja"},
  {key:"avoid",      title:"🚫 Czego unikać"},
  {key:"prevention", title:"🛡️ Profilaktyka"},
  {key:"mistakes",   title:"⚡ Częste błędy"},
  {key:"now_do",     title:"👉 Co robić teraz (3 kroki)"},
  {key:"info",       title:"ℹ️ Dodatkowe informacje"}
];

// Render
const id=new URLSearchParams(location.search).get("id");
fetch("detailed_conditions.json")
  .then(r=>r.json())
  .then(db=>{
    const data=db[id]; if(!data) return;
    const title=document.getElementById("sectionTitle"); if(title) title.textContent=data.title||"Szczegóły";
    const wrap=document.getElementById("cardsContainer");
    sections.forEach(({key,title})=>{
      const val=data[key];
      if(!val || (Array.isArray(val)&&val.length===0)) return;
      wrap.appendChild(cardFor(key,val,title));
    });
  })
  .catch(err=>console.error("Błąd ładowania JSON:",err));
