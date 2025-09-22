/* BOLI HELP COPILOT 🤖
   Profesjonalny panel AI-assistenta dla szczegoly.html
   Autor: Twój osobisty asystent
*/

(function(){
  if(document.getElementById("bhCopilotBtn")) return; // już dodany

  // === 1. Przycisk w rogu ===
  const btn = document.createElement("button");
  btn.id = "bhCopilotBtn";
  btn.innerHTML = "🤖";
  Object.assign(btn.style,{
    position:"fixed", right:"18px", bottom:"18px", zIndex:99999,
    width:"58px", height:"58px", borderRadius:"50%", fontSize:"26px",
    background:"linear-gradient(135deg,#a46bff,#5eead4)", color:"#fff",
    border:"none", cursor:"pointer", boxShadow:"0 0 18px rgba(164,107,255,.6)",
    transition:"all .3s ease"
  });
  btn.onmouseenter=()=>btn.style.transform="scale(1.08)";
  btn.onmouseleave=()=>btn.style.transform="scale(1)";
  document.body.appendChild(btn);

  // === 2. Panel Copilota ===
  const modal = document.createElement("div");
  modal.id="bhCopilotModal";
  Object.assign(modal.style,{
    position:"fixed", inset:0, zIndex:99998,
    background:"rgba(14,18,48,.92)",
    display:"none", justifyContent:"center", alignItems:"center"
  });
  modal.innerHTML=`
    <div style="
      background:rgba(60,32,100,.85);
      border:1px solid rgba(164,107,255,.35);
      border-radius:20px;
      width:92%; max-width:900px; max-height:90vh;
      overflow-y:auto; color:#eef2ff; padding:24px;
      box-shadow:0 0 25px rgba(164,107,255,.6)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <h2 style="font-size:20px;font-weight:900;color:#fff">🤖 Boli Help Copilot</h2>
        <button id="bhCopilotClose" style="background:none;border:none;font-size:22px;color:#fff;cursor:pointer">✕</button>
      </div>
      <div id="bhCopilotContent"></div>
    </div>
  `;
  document.body.appendChild(modal);

  const closeBtn = modal.querySelector("#bhCopilotClose");
  closeBtn.onclick=()=>modal.style.display="none";
  btn.onclick=()=>{ modal.style.display="flex"; renderOverview(); };

  // === 3. Baza wiedzy Copilota ===
  const DB = {
    glowa:{
      symptoms:["Ból głowy","Zawroty","Światłowstręt"],
      flags:["Nagły, najsilniejszy ból","Sztywność karku","Utrata przytomności"],
      diseases:["Migrena","Napięciowy ból głowy","Krwotok podpajęczynówkowy"],
      otc:["Ibuprofen","Paracetamol","Aspiryna"],
      rx:["Sumatryptan","Propranolol"],
      firstaid:["Odpocznij w cichym, ciemnym pomieszczeniu","Nawodnij się","Lód na czoło"],
      doctors:["Neurolog","Lekarz rodzinny"]
    },
    serce:{
      symptoms:["Kłucie w klatce piersiowej","Kołatania","Duszność"],
      flags:["Ból promieniujący do ramienia/szczęki","Zimne poty","Nagła duszność"],
      diseases:["Dławica piersiowa","Zawał serca","Arytmia"],
      otc:["Nitrogliceryna (jeśli przepisana)","Aspiryna"],
      rx:["Beta-blokery","Statyny","ACEI"],
      firstaid:["Udrożnij drogi oddechowe","Podaj aspirynę (300mg)","Wezwij 112"],
      doctors:["Kardiolog","SOR"]
    },
    brzuch:{
      symptoms:["Ból brzucha","Wzdęcia","Biegunka"],
      flags:["Krew w stolcu","Nagły ostry ból","Wymioty krwią"],
      diseases:["Grypa żołądkowa","Zespół jelita drażliwego","Wrzód żołądka"],
      otc:["Smecta","No-spa","Elektrolity"],
      rx:["IPP (omeprazol)","Antybiotyki (Helicobacter)"],
      firstaid:["Nawodnij się","Unikaj ciężkostrawnych posiłków","Obserwuj nasilenie"],
      doctors:["Gastroenterolog","Lekarz rodzinny"]
    },
    stawy:{
      symptoms:["Ból kolana","Obrzęk","Ograniczona ruchomość"],
      flags:["Nagłe zaczerwienienie i gorączka","Silny uraz","Niemożność obciążenia nogi"],
      diseases:["Skręcenie stawu","RZS","Dna moczanowa"],
      otc:["Ibuprofen","Żele chłodzące"],
      rx:["Kolchicyna","Sterydy","Leki biologiczne"],
      firstaid:["Unieruchom staw","Schładzaj","Unieś nogę"],
      doctors:["Ortopeda","Reumatolog"]
    }
  };

  // === 4. Funkcje renderujące ===
  function renderOverview(){
    const c = document.getElementById("bhCopilotContent");
    c.innerHTML = `
      <p>Witaj! Wybierz obszar, aby zobaczyć <b>objawy, czerwone flagi, choroby, leki i pierwszą pomoc</b>:</p>
      <div style="display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));margin-top:16px">
        ${Object.keys(DB).map(k=>`
          <button class="bhCoBtn" data-part="${k}" style="
            padding:14px;border-radius:14px;
            background:linear-gradient(135deg,rgba(164,107,255,.25),rgba(94,234,212,.25));
            border:1px solid rgba(164,107,255,.45);color:#fff;font-weight:800;cursor:pointer;
            box-shadow:0 0 10px rgba(164,107,255,.3);backdrop-filter:blur(4px)">
            ${k.toUpperCase()}
          </button>`).join("")}
      </div>
    `;
    c.querySelectorAll(".bhCoBtn").forEach(b=>{
      b.onclick=()=>renderPart(b.dataset.part);
    });
  }

  function renderPart(part){
    const d = DB[part]; if(!d) return;
    const c = document.getElementById("bhCopilotContent");
    c.innerHTML=`
      <button id="bhBack" style="margin-bottom:14px;background:none;border:none;color:#5eead4;cursor:pointer">← Powrót</button>
      <h3 style="font-size:18px;font-weight:900;margin-bottom:12px;color:#fff">${part.toUpperCase()}</h3>
      ${renderSection("⚠️ Objawy",d.symptoms,"#5eead4")}
      ${renderSection("🚨 Czerwone flagi",d.flags,"#ff6b6b")}
      ${renderSection("🩺 Choroby",d.diseases,"#a46bff")}
      ${renderSection("💊 Leki OTC",d.otc,"#ffd16c")}
      ${renderSection("💉 Leki RX",d.rx,"#ff6ec7")}
      ${renderSection("⛑️ Pierwsza pomoc",d.firstaid,"#70e1b1")}
      ${renderSection("👨‍⚕️ Lekarze",d.doctors,"#5eead4")}
    `;
    c.querySelector("#bhBack").onclick=renderOverview;
  }

  function renderSection(title,items,color){
    if(!items || !items.length) return "";
    return `
      <div style="margin-bottom:16px">
        <h4 style="color:${color};margin:4px 0;font-weight:800">${title}</h4>
        <ul style="list-style:none;margin:0;padding:0;display:grid;gap:6px">
          ${items.map(i=>`<li style="
            padding:8px 12px;border-radius:10px;background:rgba(255,255,255,.05);
            border:1px solid ${color};box-shadow:0 0 10px ${color}55">${i}</li>`).join("")}
        </ul>
      </div>
    `;
  }

})();
